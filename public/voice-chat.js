(() => {
  'use strict';

  const header = document.getElementById('chead');
  const main = document.getElementById('main');
  const messages = document.getElementById('msgs');
  if (!header || !main || !messages) return;

  const style = document.createElement('style');
  style.textContent =
    '#voice-join{border:0;border-radius:7px;padding:7px 11px;background:var(--accent,#5865f2);color:#fff;font:600 12px system-ui,sans-serif;cursor:pointer;white-space:nowrap;flex:none}' +
    '#voice-join:disabled{opacity:.65;cursor:wait}' +
    '#voice-panel{padding:10px 16px;background:var(--side,#2b2d31);border-bottom:1px solid var(--darker,#17181b);color:var(--text,#dbdee1);font-size:13px}' +
    '#voice-panel.hidden{display:none!important}#voice-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap}' +
    '#voice-status{font-weight:700;flex:1;min-width:120px}#voice-controls{display:flex;gap:7px;flex-wrap:wrap}' +
    '#voice-controls button{border:0;border-radius:7px;padding:7px 10px;background:var(--input,#383a40);color:var(--text,#dbdee1);font:600 12px system-ui,sans-serif;cursor:pointer}' +
    '#voice-leave{background:#b93642!important;color:#fff!important}#voice-members{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}' +
    '.voice-member{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:999px;background:var(--input,#383a40);font-size:12px}' +
    '.voice-dot{width:7px;height:7px;border-radius:50%;background:#23a55a}#voice-note{display:block;color:var(--dim,#949ba4);font-size:11px;margin-top:7px}';
  document.head.appendChild(style);

  const joinButton = document.createElement('button');
  joinButton.id = 'voice-join';
  joinButton.type = 'button';
  joinButton.className = 'hidden';
  joinButton.textContent = 'Join Voice';
  joinButton.title = 'Join voice chat for this text channel';
  header.appendChild(joinButton);

  const panel = document.createElement('section');
  panel.id = 'voice-panel';
  panel.className = 'hidden';
  panel.innerHTML = '<div id="voice-top"><div id="voice-status">Not connected to voice</div><div id="voice-controls"><button id="voice-mute" type="button">Mute mic</button><button id="voice-leave" type="button">Leave voice</button></div></div><div id="voice-members"></div><small id="voice-note">Your microphone is only used while connected to this voice room.</small>';
  main.insertBefore(panel, messages);

  const status = document.getElementById('voice-status');
  const members = document.getElementById('voice-members');
  const muteButton = document.getElementById('voice-mute');
  const leaveButton = document.getElementById('voice-leave');
  const note = document.getElementById('voice-note');

  const state = {
    socket: null,
    stream: null,
    peers: new Map(),
    joined: false,
    joining: false,
    muted: false,
    roomKey: null,
    revision: 0,
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  function notify(message) {
    if (typeof toast === 'function') toast(message);
    else console.info('[Prism voice]', message);
  }

  function currentRoom() {
    if (typeof view === 'undefined' || !view || view.type !== 'server' || !view.sid || !view.cid) return null;
    const title = document.getElementById('chname');
    return { sid: String(view.sid), cid: String(view.cid), name: title ? title.textContent : 'channel' };
  }

  function refreshButton() {
    const room = currentRoom();
    joinButton.classList.toggle('hidden', !room);
    joinButton.disabled = state.joining;
    if (state.joined) {
      joinButton.textContent = 'Leave Voice';
      joinButton.title = 'Leave this voice room';
    } else if (state.joining) {
      joinButton.textContent = 'Connecting…';
    } else {
      joinButton.textContent = 'Join Voice';
      joinButton.title = 'Join voice chat for this text channel';
    }
  }

  function renderMembers() {
    members.textContent = '';
    if (!state.joined && !state.joining) return;
    const ownName = (typeof me !== 'undefined' && me && me.name) || 'You';
    const all = [{ name: ownName + ' (you)' }];
    state.peers.forEach(function (peer) { all.push({ name: peer.name || 'Prism user' }); });
    all.forEach(function (person) {
      const chip = document.createElement('span');
      chip.className = 'voice-member';
      const dot = document.createElement('span');
      dot.className = 'voice-dot';
      const label = document.createElement('span');
      label.textContent = person.name;
      chip.append(dot, label);
      members.appendChild(chip);
    });
  }

  function removePeer(id) {
    const peer = state.peers.get(id);
    if (!peer) return;
    try { peer.pc.close(); } catch (_) {}
    if (peer.audio) peer.audio.remove();
    state.peers.delete(id);
    renderMembers();
  }

  function endVoice(message) {
    state.revision++;
    const socket = state.socket;
    state.socket = null;
    state.joined = false;
    state.joining = false;
    state.roomKey = null;
    state.muted = false;

    if (socket) {
      if (socket.connected) socket.emit('voice:leave');
      socket.removeAllListeners();
      socket.disconnect();
    }
    Array.from(state.peers.keys()).forEach(removePeer);
    if (state.stream) {
      state.stream.getTracks().forEach(function (track) { track.stop(); });
      state.stream = null;
    }
    panel.classList.add('hidden');
    status.textContent = 'Not connected to voice';
    muteButton.textContent = 'Mute mic';
    muteButton.setAttribute('aria-pressed', 'false');
    refreshButton();
    if (message) notify(message);
  }

  function sendSignal(target, data) {
    if (state.socket && state.socket.connected) state.socket.emit('voice:signal', { target: target, data: data });
  }

  function ensurePeer(person) {
    if (!person || !person.socketId) return null;
    if (state.peers.has(person.socketId)) return state.peers.get(person.socketId);

    const pc = new RTCPeerConnection({ iceServers: state.iceServers });
    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.playsInline = true;
    audio.style.display = 'none';
    document.body.appendChild(audio);
    const peer = { pc: pc, audio: audio, name: person.name || 'Prism user', pending: [] };
    state.peers.set(person.socketId, peer);
    renderMembers();

    if (state.stream) {
      state.stream.getTracks().forEach(function (track) { pc.addTrack(track, state.stream); });
    }
    pc.onicecandidate = function (event) {
      if (event.candidate) {
        sendSignal(person.socketId, { candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate });
      }
    };
    pc.ontrack = function (event) {
      if (event.streams && event.streams[0]) audio.srcObject = event.streams[0];
      audio.play().catch(function () {
        note.textContent = 'Connected. Click the page once if your browser blocks audio playback.';
      });
    };
    pc.onconnectionstatechange = function () {
      if (pc.connectionState === 'failed') note.textContent = 'Connection failed. Some networks require a TURN relay for voice.';
    };
    return peer;
  }

  async function offerTo(person) {
    const peer = ensurePeer(person);
    if (!peer || !state.socket || !state.socket.connected) return;
    try {
      const offer = await peer.pc.createOffer();
      await peer.pc.setLocalDescription(offer);
      sendSignal(person.socketId, {
        description: { type: peer.pc.localDescription.type, sdp: peer.pc.localDescription.sdp }
      });
    } catch (error) {
      console.warn('[Prism voice] Offer failed:', error);
      notify('Could not connect to one participant.');
    }
  }

  async function applySignal(message) {
    if (!message || !message.from) return;
    const person = { socketId: message.from, name: message.profile && message.profile.name };
    const peer = ensurePeer(person);
    if (!peer || !message.data) return;
    const data = message.data;
    try {
      if (data.description) {
        await peer.pc.setRemoteDescription(data.description);
        while (peer.pending.length) await peer.pc.addIceCandidate(peer.pending.shift());
        if (data.description.type === 'offer') {
          const answer = await peer.pc.createAnswer();
          await peer.pc.setLocalDescription(answer);
          sendSignal(message.from, {
            description: { type: peer.pc.localDescription.type, sdp: peer.pc.localDescription.sdp }
          });
        }
      }
      if (data.candidate) {
        const candidate = new RTCIceCandidate(data.candidate);
        if (peer.pc.remoteDescription) await peer.pc.addIceCandidate(candidate);
        else peer.pending.push(candidate);
      }
    } catch (error) {
      console.warn('[Prism voice] Signal failed:', error);
    }
  }

  async function joinVoice() {
    const room = currentRoom();
    if (!room) return notify('Open a server text channel before joining voice.');
    if (typeof me === 'undefined' || !me || !window.firebase || !firebase.auth().currentUser) {
      return notify('Log in to Prism before joining voice chat.');
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return notify('Microphone access needs HTTPS and browser permission.');
    }
    if (!window.io) return notify('The voice service did not load. Refresh and try again.');

    endVoice();
    state.joining = true;
    const revision = ++state.revision;
    refreshButton();
    panel.classList.remove('hidden');
    status.textContent = 'Requesting microphone permission…';
    note.textContent = 'Allow microphone access when your browser asks.';

    try {
      const configResponse = await fetch('/voice-config.json', { cache: 'no-store' });
      if (configResponse.ok) {
        const config = await configResponse.json();
        if (Array.isArray(config.iceServers) && config.iceServers.length) state.iceServers = config.iceServers;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
      if (revision !== state.revision) {
        stream.getTracks().forEach(function (track) { track.stop(); });
        return;
      }
      state.stream = stream;
      const token = await firebase.auth().currentUser.getIdToken();
      const socket = window.io({ auth: { token: token }, transports: ['websocket', 'polling'] });
      state.socket = socket;
      status.textContent = 'Connecting to #' + room.name + ' voice…';

      socket.on('connect', function () {
        socket.emit('voice:join', { sid: room.sid, cid: room.cid }, function (result) {
          if (!result || !result.ok) {
            endVoice((result && result.error) || 'Could not join this voice channel.');
            return;
          }
          state.joining = false;
          state.joined = true;
          state.roomKey = result.room;
          status.textContent = 'Connected to #' + room.name;
          note.textContent = 'Voice is live. Mute your mic or leave whenever you need. Headphones help prevent echo.';
          refreshButton();
          renderMembers();
          (result.peers || []).forEach(function (person) {
            ensurePeer(person);
            if (String(socket.id).localeCompare(String(person.socketId)) > 0) offerTo(person);
          });
        });
      });
      socket.on('voice:peer-joined', function (person) {
        ensurePeer(person);
        if (person && String(socket.id).localeCompare(String(person.socketId)) > 0) offerTo(person);
      });
      socket.on('voice:signal', applySignal);
      socket.on('voice:peer-left', function (person) {
        if (person && person.socketId) removePeer(person.socketId);
      });
      socket.on('connect_error', function (error) {
        endVoice((error && error.message) || 'Could not connect to the voice service.');
      });
      socket.on('disconnect', function () {
        if (state.socket === socket && (state.joined || state.joining)) {
          endVoice('Voice disconnected. Join again to reconnect.');
        }
      });
    } catch (error) {
      console.error('[Prism voice] Join failed:', error);
      const message = error && error.name === 'NotAllowedError'
        ? 'Microphone permission was denied. Allow access and try again.'
        : ((error && error.message) || 'Could not start voice chat.');
      endVoice(message);
    }
  }

  function leaveVoice() {
    if (state.joined || state.joining || state.socket || state.stream) endVoice();
  }

  joinButton.addEventListener('click', function () {
    if (state.joined || state.joining) leaveVoice();
    else joinVoice();
  });
  muteButton.addEventListener('click', function () {
    if (!state.stream) return;
    state.muted = !state.muted;
    state.stream.getAudioTracks().forEach(function (track) { track.enabled = !state.muted; });
    muteButton.textContent = state.muted ? 'Unmute mic' : 'Mute mic';
    muteButton.setAttribute('aria-pressed', String(state.muted));
  });
  leaveButton.addEventListener('click', leaveVoice);

  if (typeof openChannel === 'function') {
    const original = openChannel;
    openChannel = function () {
      const args = Array.from(arguments);
      const room = currentRoom();
      if ((state.joined || state.joining) && room && (String(args[0]) !== room.sid || String(args[1]) !== room.cid)) leaveVoice();
      const result = original.apply(this, args);
      refreshButton();
      return result;
    };
  }
  if (typeof openServer === 'function') {
    const original = openServer;
    openServer = function () {
      const args = Array.from(arguments);
      if ((state.joined || state.joining) && typeof view !== 'undefined' && view.sid !== args[0]) leaveVoice();
      const result = original.apply(this, args);
      refreshButton();
      return result;
    };
  }
  if (typeof openDM === 'function') {
    const original = openDM;
    openDM = function () {
      leaveVoice();
      const result = original.apply(this, arguments);
      refreshButton();
      return result;
    };
  }
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function (user) { if (!user) leaveVoice(); });
  }
  refreshButton();
})();