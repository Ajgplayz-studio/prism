'use strict';

const express = require('express');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { Server } = require('socket.io');
const admin = require('firebase-admin');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  serveClient: true,
  maxHttpBufferSize: 100_000,
  pingInterval: 25_000,
  pingTimeout: 20_000
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://prism-web-v2-default-rtdb.firebaseio.com';
const MAX_PEERS = Math.min(12, Math.max(2, Number(process.env.MAX_VOICE_PEERS) || 8));
let htmlCache = { value: '', expiresAt: 0 };

function getAdmin() {
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON in Hostless environment variables.');
    let account;
    try {
      account = JSON.parse(raw);
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must contain the complete service-account JSON.');
    }
    admin.initializeApp({
      credential: admin.credential.cert(account),
      projectId: process.env.FIREBASE_PROJECT_ID || account.project_id || 'prism-web-v2',
      databaseURL: DATABASE_URL
    });
  }
  return admin;
}

function validKey(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 128 &&
    /^[A-Za-z0-9_-]+$/.test(value);
}

function makeRoom(sid, cid) {
  return 'prism-voice:' + sid + ':' + cid;
}

async function authorizeRoom(uid, sid, cid) {
  if (!validKey(sid) || !validKey(cid)) throw new Error('Invalid voice channel.');
  const db = getAdmin().database();
  const parts = await Promise.all([
    db.ref('prism/servers/' + sid).once('value'),
    db.ref('prism/serverChannels/' + sid + '/' + cid).once('value'),
    db.ref('prism/users/' + uid + '/name').once('value')
  ]);
  const serverSnap = parts[0];
  const channelSnap = parts[1];
  const nameSnap = parts[2];
  if (!serverSnap.exists() || !channelSnap.exists()) throw new Error('That Prism channel no longer exists.');

  if (sid !== 'official' && serverSnap.val().owner !== uid) {
    const memberSnap = await db.ref('prism/myServers/' + uid + '/' + sid).once('value');
    if (!memberSnap.exists() || memberSnap.val() === false) {
      throw new Error('Join this Prism server before entering its voice chat.');
    }
  }

  return {
    room: makeRoom(sid, cid),
    sid,
    cid,
    profile: { uid, name: String(nameSnap.val() || 'Prism user').slice(0, 20) }
  };
}

io.use(async (socket, next) => {
  try {
    const firebase = getAdmin();
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (typeof token !== 'string' || !token) {
      return next(new Error('Log in to Prism before joining voice chat.'));
    }
    const decoded = await firebase.auth().verifyIdToken(token);
    const nameSnap = await firebase.database().ref('prism/users/' + decoded.uid + '/name').once('value');
    socket.data.profile = {
      uid: decoded.uid,
      name: String(nameSnap.val() || 'Prism user').slice(0, 20)
    };
    next();
  } catch (error) {
    console.error('[voice] Authentication failed:', error.message);
    next(new Error(error.message.includes('FIREBASE_SERVICE_ACCOUNT_JSON')
      ? error.message
      : 'Could not verify your Prism login. Check the Hostless Firebase configuration.'));
  }
});

async function leaveVoice(socket) {
  const room = socket.data.voiceRoom;
  if (!room) return;
  socket.data.voiceRoom = null;
  socket.to(room).emit('voice:peer-left', { socketId: socket.id });
  await socket.leave(room);
}

io.on('connection', (socket) => {
  socket.on('voice:join', async (payload, acknowledge) => {
    const reply = typeof acknowledge === 'function' ? acknowledge : function () {};
    try {
      const sid = payload && payload.sid;
      const cid = payload && payload.cid;
      const roomInfo = await authorizeRoom(socket.data.profile.uid, sid, cid);

      if (socket.data.voiceRoom === roomInfo.room) {
        reply({ ok: true, room: roomInfo.room, peers: [] });
        return;
      }
      await leaveVoice(socket);
      const current = await io.in(roomInfo.room).fetchSockets();
      if (current.length >= MAX_PEERS) {
        reply({ ok: false, error: 'This voice room is full (maximum ' + MAX_PEERS + ' people).' });
        return;
      }

      const peers = current.map((peer) => ({
        socketId: peer.id,
        uid: peer.data.profile.uid,
        name: peer.data.profile.name
      }));
      socket.data.voiceRoom = roomInfo.room;
      socket.data.voiceChannel = { sid, cid };
      await socket.join(roomInfo.room);
      socket.to(roomInfo.room).emit('voice:peer-joined', {
        socketId: socket.id,
        uid: socket.data.profile.uid,
        name: socket.data.profile.name
      });
      reply({ ok: true, room: roomInfo.room, peers });
    } catch (error) {
      reply({ ok: false, error: error.message || 'Could not join this voice channel.' });
    }
  });

  socket.on('voice:signal', (payload) => {
    const room = socket.data.voiceRoom;
    if (!room || !payload || typeof payload.target !== 'string' ||
        !payload.data || typeof payload.data !== 'object') return;
    const target = io.sockets.sockets.get(payload.target);
    if (!target || target.data.voiceRoom !== room) return;

    const data = payload.data;
    if (data.description &&
        (!['offer', 'answer'].includes(data.description.type) ||
         typeof data.description.sdp !== 'string' || data.description.sdp.length > 50_000)) return;
    if (data.candidate && typeof data.candidate.candidate === 'string' &&
        data.candidate.candidate.length > 2_048) return;
    target.emit('voice:signal', {
      from: socket.id,
      profile: socket.data.profile,
      data
    });
  });

  socket.on('voice:leave', () => {
    leaveVoice(socket).catch((error) => console.error('[voice] leave failed:', error.message));
  });
  socket.on('disconnect', () => {
    leaveVoice(socket).catch((error) => console.error('[voice] disconnect cleanup failed:', error.message));
  });
});

app.get('/healthz', (_req, res) => {
  res.json({
    ok: true,
    service: 'prism-voice-chat',
    voiceAuthConfigured: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  });
});

app.get('/voice-config.json', (_req, res) => {
  const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
  if (process.env.TURN_URL && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    const urls = process.env.TURN_URL.split(',').map((item) => item.trim()).filter(Boolean);
    if (urls.length) {
      iceServers.push({
        urls,
        username: process.env.TURN_USERNAME,
        credential: process.env.TURN_CREDENTIAL
      });
    }
  }
  res.set('Cache-Control', 'no-store').json({ iceServers });
});

app.use(express.static(path.join(__dirname, 'public'), { index: false, etag: true, maxAge: '5m' }));

async function getPrismHtml() {
  if (htmlCache.value && Date.now() < htmlCache.expiresAt) return htmlCache.value;
  let html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
  if (!/<html[\s>]/i.test(html) || !/<\/body\s*>/i.test(html)) {
    throw new Error('index.html is missing or is not a complete HTML page.');
  }
  const scripts = '\n<script src="/socket.io/socket.io.js"></script>\n<script src="/voice-chat.js"></script>\n';
  html = html.replace(/<\/body\s*>/i, scripts + '</body>');
  htmlCache = { value: html, expiresAt: Date.now() + 60_000 };
  return html;
}

app.get(['/', '/index.html'], async (_req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    res.type('html').send(await getPrismHtml());
  } catch (error) {
    console.error('[web] Could not load local Prism index.html:', error.message);
    res.status(500).type('text').send('Could not load index.html. Make sure it exists in the repository root.');
  }
});

app.use((_req, res) => res.status(404).type('text').send('Not found'));

server.listen(PORT, HOST, () => {
  console.log('Prism Voice listening on ' + HOST + ':' + PORT);
  console.log('Prism HTML: ' + path.join(__dirname, 'index.html'));
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    console.warn('Voice auth is not configured. Add FIREBASE_SERVICE_ACCOUNT_JSON in Hostless.');
  }
});
