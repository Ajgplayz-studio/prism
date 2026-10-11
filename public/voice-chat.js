(() => {
"use strict";
const head = document.getElementById("chead");
if (!head || !document.getElementById("main") || !document.getElementById("msgs") || !window.firebase || typeof db === "undefined") return;
const style = document.createElement("style");
style.textContent = "\n#voice-join{display:inline-flex;align-items:center;gap:7px;border:0;border-radius:8px;padding:8px 12px;background:var(--accent,#5865f2);color:#fff;cursor:pointer;font-weight:750;font-size:13px;box-shadow:0 4px 14px #0003}\n#voice-join.hidden{display:none!important}#voice-join:disabled{opacity:.6;cursor:wait}\n#voice-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(5,8,14,.48);backdrop-filter:blur(9px) saturate(.78);-webkit-backdrop-filter:blur(9px) saturate(.78);opacity:0;transition:opacity .18s ease}\n#voice-overlay.hidden{display:none!important}#voice-overlay.voice-visible{opacity:1}\n#voice-window{position:relative;display:flex;flex-direction:column;width:min(700px,calc(100vw - 28px));height:min(440px,calc(100dvh - 28px));min-height:300px;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(145deg,rgba(22,28,43,.96),rgba(9,13,22,.97));color:#f5f7fb;box-shadow:0 28px 100px rgba(0,0,0,.58),inset 0 1px 0 rgba(255,255,255,.06);transform:translateY(10px) scale(.985);transition:transform .18s ease}\n#voice-overlay.voice-visible #voice-window{transform:translateY(0) scale(1)}\n#voice-topbar{height:64px;min-height:64px;display:flex;align-items:center;gap:12px;padding:0 18px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.12)}\n#voice-brand-dot{width:9px;height:9px;border-radius:50%;background:#48e28b;box-shadow:0 0 14px #48e28b88}\n#voice-header-copy{min-width:0;flex:1}#voice-kicker{font-size:9px;letter-spacing:2.1px;font-weight:850;color:#9eaac0}#voice-title{font-size:15px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}#voice-status{font-size:11px;color:#a4afc4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#voice-close{width:31px;height:31px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);color:#e6eaf2;font-size:20px;line-height:1;cursor:pointer}\n#voice-stage{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:12px 16px;background:radial-gradient(ellipse at 50% 30%,rgba(56,102,180,.17),transparent 65%)}\n#voice-participants{width:100%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:20px;min-height:100px}\n.voice-person{width:112px;max-width:30%;display:flex;flex-direction:column;align-items:center;gap:9px;min-width:72px}\n.voice-avatar{width:72px;height:72px;max-width:100%;aspect-ratio:1;border:2px solid rgba(255,255,255,.1);border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:22px;letter-spacing:-.5px;background:linear-gradient(145deg,#2f98d8,#5459dc 55%,#9a53d0);box-shadow:0 0 0 5px rgba(255,255,255,.025),0 8px 24px #0005;position:relative}\n.voice-person.voice-self .voice-avatar{border-color:#29df82;box-shadow:0 0 0 3px rgba(41,223,130,.12),0 8px 24px #0005}\n.voice-person.voice-speaking .voice-avatar{outline:2px solid #3fe594;outline-offset:3px}\n.voice-person-name{max-width:100%;font-size:12px;color:#f0f3fa;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.voice-person-sub{font-size:10px;color:#9eaac0;margin-top:-5px}\n#voice-local-share-wrap{width:min(100%,520px);height:170px;min-height:95px;border-radius:13px;overflow:hidden;position:relative;background:#080b11;border:1px solid rgba(255,255,255,.14);box-shadow:0 12px 30px #0005}\n#voice-local-share-wrap.hidden{display:none!important}#voice-local-share{width:100%;height:100%;object-fit:contain;display:block}\n#voice-local-share-label{position:absolute;left:10px;bottom:9px;padding:5px 8px;border-radius:7px;background:rgba(0,0,0,.68);font-size:10px;color:#fff}\n#voice-remote-shares{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;max-height:132px;overflow:auto}\n#voice-remote-shares:empty{display:none}#voice-remote-shares .voice-remote-tile{width:min(46%,260px);height:116px;position:relative;background:#070a10;border:1px solid rgba(255,255,255,.13);border-radius:10px;overflow:hidden}\n.voice-remote-tile video{width:100%;height:100%;object-fit:contain;display:block}.voice-remote-label{position:absolute;left:7px;bottom:6px;background:#000b;padding:4px 6px;border-radius:5px;font-size:10px}\n#voice-note{font-size:10px;color:#929eb3;min-height:14px;text-align:center;padding:0 14px 8px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#voice-controls{min-height:70px;display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 14px 13px;border-top:1px solid rgba(255,255,255,.07);background:rgba(0,0,0,.18)}\n.voice-control{position:relative;width:46px;height:46px;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid rgba(255,255,255,.09);border-radius:15px;background:rgba(255,255,255,.085);color:#f1f4fa;cursor:pointer;transition:background .12s ease,transform .12s ease,border-color .12s ease}\n.voice-control:hover{background:rgba(255,255,255,.16);transform:translateY(-1px)}.voice-control:focus-visible{outline:2px solid #91a7ff;outline-offset:2px}\n.voice-control svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\n.voice-control small{font-size:8px;color:#d0d7e4;line-height:1}\n.voice-control.voice-active{background:rgba(111,137,255,.23);border-color:rgba(137,158,255,.56)}\n.voice-control.voice-muted{background:rgba(233,67,80,.2);border-color:rgba(255,99,113,.55);color:#ffb7be}\n#voice-hangup{background:#fa3e49;border:0;border-radius:50%;width:52px;height:52px;margin-left:3px;box-shadow:0 4px 18px #fa3e493c}\n#voice-hangup:hover{background:#ff5962}#voice-hangup svg{width:23px;height:23px}\n@media(max-width:560px){#voice-overlay{padding:8px}#voice-window{width:calc(100vw - 16px);height:min(520px,calc(100dvh - 16px));border-radius:17px}#voice-topbar{height:56px;min-height:56px;padding:0 12px}#voice-stage{padding:8px}#voice-participants{gap:10px}.voice-person{width:84px}.voice-avatar{width:58px;font-size:18px}#voice-controls{gap:7px;padding:9px 8px 11px}.voice-control{width:42px;height:44px;border-radius:13px}#voice-hangup{width:49px;height:49px}#voice-local-share-wrap{height:135px}#voice-remote-shares .voice-remote-tile{height:90px}}\n@media(prefers-reduced-motion:reduce){#voice-overlay,#voice-window,.voice-control{transition:none}}\n";
document.head.appendChild(style);
const join = document.createElement("button");
join.id = "voice-join"; join.type = "button"; join.className = "hidden";
join.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg><span>Join Voice</span>';
head.appendChild(join);
const overlay = document.createElement("div");
overlay.id = "voice-overlay"; overlay.className = "hidden";
overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-label", "Prism voice call");
overlay.innerHTML = "\n  <section id=\"voice-window\">\n    <header id=\"voice-topbar\">\n      <span id=\"voice-brand-dot\"></span>\n      <div id=\"voice-header-copy\">\n        <div id=\"voice-kicker\">PRISM VOICE</div>\n        <div id=\"voice-title\">Voice call</div>\n        <div id=\"voice-status\">Not connected</div>\n      </div>\n      <button id=\"voice-close\" type=\"button\" aria-label=\"Close call window\" title=\"Close call window\">×</button>\n    </header>\n    <div id=\"voice-stage\">\n      <div id=\"voice-local-share-wrap\" class=\"hidden\">\n        <video id=\"voice-local-share\" autoplay muted playsinline></video>\n        <span id=\"voice-local-share-label\">You're sharing your screen</span>\n      </div>\n      <div id=\"voice-remote-shares\"></div>\n      <div id=\"voice-participants\"></div>\n    </div>\n    <div id=\"voice-note\">Your microphone is only used while connected.</div>\n    <footer id=\"voice-controls\">\n      <button class=\"voice-control\" id=\"voice-mute\" type=\"button\" aria-label=\"Mute microphone\" title=\"Mute microphone\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\"/><path d=\"M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8\"/></svg><small>Mic</small>\n      </button>\n      <button class=\"voice-control\" id=\"voice-deafen\" type=\"button\" aria-label=\"Mute incoming audio\" title=\"Mute incoming audio\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 10v4a2 2 0 0 0 2 2h2l5 4V4l-5 4H5a2 2 0 0 0-2 2z\"/><path d=\"M16 9a5 5 0 0 1 0 6M18.5 6.5a9 9 0 0 1 0 11\"/></svg><small>Audio</small>\n      </button>\n      <button class=\"voice-control\" id=\"voice-share\" type=\"button\" aria-label=\"Share screen\" title=\"Share screen\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M8 22h8M12 17v5M12 13V8M9 11l3-3 3 3\"/></svg><small id=\"voice-share-label\">Share</small>\n      </button>\n      <button class=\"voice-control\" id=\"voice-hangup\" type=\"button\" aria-label=\"Leave voice call\" title=\"Leave voice call\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 14.5a12 12 0 0 1 15 0l1.8 1.5a1.6 1.6 0 0 1 .3 2.1l-1.3 2a1.6 1.6 0 0 1-2 .6l-3.5-1.5a1.6 1.6 0 0 1-.9-1.8l.4-1.8a10 10 0 0 0-4.6 0l.4 1.8a1.6 1.6 0 0 1-.9 1.8L5.2 20.7a1.6 1.6 0 0 1-2-.6l-1.3-2a1.6 1.6 0 0 1 .3-2.1z\"/></svg>\n      </button>\n    </footer>\n  </section>";
document.body.appendChild(overlay);
const $ = id => document.getElementById(id);
const status = $("voice-status"), title = $("voice-title"), list = $("voice-participants");
const note = $("voice-note"), mute = $("voice-mute"), deafen = $("voice-deafen");
const shareBtn = $("voice-share"), shareLabel = $("voice-share-label"), hangup = $("voice-hangup");
const localShareWrap = $("voice-local-share-wrap"), localShareVideo = $("voice-local-share");
const remoteShares = $("voice-remote-shares");
const s = {room:null,session:null,stream:null,screenStream:null,joined:false,joining:false,muted:false,deafened:false,people:{},peers:new Map(),pr:null,ownRef:null,inbox:null,ph:null,ih:null,revision:0,ice:[{urls:"stun:stun.l.google.com:19302"}]};
const valid = x => /^[A-Za-z0-9_-]{1,128}$/.test(String(x));
const base = r => "prism/voiceRooms/" + r.sid + "/" + r.cid;
function msg(t){if(typeof toast==="function")toast(t);else console.log(t);}
function current(){
 if(typeof view==="undefined"||!view||view.type!=="server"||!view.sid||!view.cid||!valid(view.sid)||!valid(view.cid))return null;
 return {sid:String(view.sid),cid:String(view.cid),name:$("chname").textContent||"channel"};
}
function showCall(){
 if(overlay.classList.contains("hidden"))overlay.classList.remove("hidden");
 requestAnimationFrame(()=>overlay.classList.add("voice-visible"));
}
function refresh(){
 const canJoin=!!current();
 join.classList.toggle("hidden",!canJoin);join.disabled=s.joining;
 join.querySelector("span").textContent=s.joined?"Open Voice":s.joining?"Connecting...":"Join Voice";
 join.title=s.joined?"Open the voice call":"Join channel voice";
}
function initials(name){
 const bits=String(name||"Prism user").trim().split(/\s+/).filter(Boolean);
 return (bits.length>1?bits[0][0]+bits[bits.length-1][0]:String(bits[0]||"P").slice(0,2)).toUpperCase();
}
function avatarSourceOk(value){return typeof value==="string"&&value.length<=260000&&(/^https:\/\/[^\s"'<>]+$/i.test(value)||/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(value));}
function ownAvatar(){try{return typeof settings!=="undefined"&&settings.avatar||"";}catch(_){return "";}}
function render(){
 list.textContent="";
 const people=[];
 if(s.joined||s.joining)people.push({uid:me&&me.uid||"self",name:(me&&me.name||"You")+" (you)",self:true,avatar:ownAvatar()});
 Object.keys(s.people||{}).forEach(uid=>{if(uid===(me&&me.uid))return;const v=s.people[uid];if(v&&s.joined)people.push({uid,name:v.name||"Prism user",self:false,avatar:v.avatar||""});});
 people.forEach(person=>{
  const card=document.createElement("div");
  card.className="voice-person"+(person.self?" voice-self":"")+(s.peers.has(person.uid)&&s.peers.get(person.uid).pc.connectionState==="connected"?" voice-speaking":"");
  const avatar=document.createElement("div");avatar.className="voice-avatar";
  if(avatarSourceOk(person.avatar)){const image=document.createElement("img");image.src=person.avatar;image.alt=person.name+" profile icon";image.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block";image.onerror=()=>{image.remove();avatar.textContent=initials(person.name);};avatar.appendChild(image);}else avatar.textContent=initials(person.name);
  const nm=document.createElement("div");nm.className="voice-person-name";nm.textContent=person.name;
  const sub=document.createElement("div");sub.className="voice-person-sub";sub.textContent=person.self?(s.muted?"Mic muted":"You"):(s.peers.has(person.uid)?"Voice participant":"Connecting…");
  card.append(avatar,nm,sub);list.appendChild(card);
 });
 title.textContent=s.room?"#"+s.room.name+" voice":"Voice call";
 status.textContent=s.joining?"Connecting to microphone…":s.joined?"Connected · "+people.length+" participant"+(people.length===1?"":"s"):"Not connected";
 mute.classList.toggle("voice-muted",s.muted);mute.setAttribute("aria-label",s.muted?"Unmute microphone":"Mute microphone");mute.title=s.muted?"Unmute microphone":"Mute microphone";
 deafen.classList.toggle("voice-muted",s.deafened);deafen.setAttribute("aria-label",s.deafened?"Unmute incoming audio":"Mute incoming audio");deafen.title=s.deafened?"Unmute incoming audio":"Mute incoming audio";
 shareBtn.classList.toggle("voice-active",!!s.screenStream);shareBtn.setAttribute("aria-label",s.screenStream?"Stop sharing screen":"Share screen");shareBtn.title=s.screenStream?"Stop sharing screen":"Share screen";
 shareLabel.textContent=s.screenStream?"Stop":"Share";localShareWrap.classList.toggle("hidden",!s.screenStream);
 renderShares();
}
function renderShares(){
 remoteShares.textContent="";
 s.peers.forEach(p=>{
  if(!p.video||!p.videoTrack||p.videoTrack.readyState==="ended")return;
  const tile=document.createElement("div");tile.className="voice-remote-tile";
  const label=document.createElement("span");label.className="voice-remote-label";label.textContent=p.name+" · screen";
  tile.append(p.video,label);remoteShares.appendChild(tile);
 });
}
function send(uid,session,type,payload){
 if(!s.joined||!s.room||!s.session||!session)return Promise.resolve();
 return db.ref(base(s.room)+"/signals/"+uid).push({fromUid:me.uid,fromSession:s.session,toSession:session,type,payload,ts:Date.now()}).catch(e=>console.warn("voice signaling",e));
}
function removePeer(uid){
 const p=s.peers.get(uid);if(!p)return;
 try{p.pc.close();}catch(_){}
 if(p.audio)p.audio.remove();if(p.video)p.video.remove();
 if(p.videoTrack){p.videoTrack.onended=null;p.videoTrack.onmute=null;}
 s.peers.delete(uid);render();
}
function renegotiate(p){
 if(!p||!s.joined)return;
 if(p.pc.signalingState!=="stable"){p.needsRenegotiation=true;return;}
 p.needsRenegotiation=false;
 (async()=>{try{const o=await p.pc.createOffer();await p.pc.setLocalDescription(o);await send(p.uid,p.session,"description",{type:p.pc.localDescription.type,sdp:p.pc.localDescription.sdp});}catch(e){p.needsRenegotiation=true;console.warn("voice renegotiation",e);}})();
}
function peer(uid,v){
 if(!v||!v.session||uid===me.uid)return null;
 let p=s.peers.get(uid);if(p&&p.session===v.session)return p;if(p)removePeer(uid);
 const pc=new RTCPeerConnection({iceServers:s.ice}),a=document.createElement("audio");
 a.autoplay=true;a.playsInline=true;a.style.display="none";a.muted=s.deafened;document.body.appendChild(a);
 p={uid,session:v.session,name:v.name||"Prism user",pc,audio:a,video:null,videoTrack:null,shareSender:null,pending:[],remote:false,offered:false,needsRenegotiation:false};
 s.peers.set(uid,p);
 if(s.stream)s.stream.getAudioTracks().forEach(t=>pc.addTrack(t,s.stream));
 if(s.screenStream){const track=s.screenStream.getVideoTracks()[0];if(track)p.shareSender=pc.addTrack(track,s.screenStream);}
 pc.onicecandidate=e=>{if(e.candidate)send(uid,p.session,"candidate",e.candidate.toJSON?e.candidate.toJSON():e.candidate);};
 pc.ontrack=e=>{
  const stream=e.streams&&e.streams[0]?e.streams[0]:new MediaStream([e.track]);
  if(e.track.kind==="audio"){a.srcObject=stream;a.play().catch(()=>note.textContent="Click the page once if audio playback is blocked.");}
  else if(e.track.kind==="video"){
   if(p.video)p.video.remove();
   const el=document.createElement("video");el.autoplay=true;el.playsInline=true;el.controls=false;el.srcObject=stream;el.setAttribute("aria-label",p.name+" screen share");
   p.video=el;p.videoTrack=e.track;
   e.track.onended=()=>{if(p.video){p.video.remove();p.video=null;}p.videoTrack=null;renderShares();};
   e.track.onmute=()=>{if(e.track.readyState==="ended"){if(p.video){p.video.remove();p.video=null;}p.videoTrack=null;renderShares();}};
   el.play().catch(()=>note.textContent="A screen share arrived. Click the page if playback is blocked.");renderShares();
  }
 };
 pc.onconnectionstatechange=()=>{if(pc.connectionState==="failed")note.textContent="Connection failed; some networks need a TURN relay.";if(pc.connectionState==="connected")render();};
 pc.onsignalingstatechange=()=>{if(pc.signalingState==="stable"&&p.needsRenegotiation)renegotiate(p);};
 render();return p;
}
async function offer(uid,v){
 const p=peer(uid,v);
 if(!p||p.offered||!s.joined||String(me.uid).localeCompare(String(uid))<=0||p.pc.signalingState!=="stable")return;
 p.offered=true;
 try{const o=await p.pc.createOffer();await p.pc.setLocalDescription(o);await send(uid,p.session,"description",{type:p.pc.localDescription.type,sdp:p.pc.localDescription.sdp});}
 catch(e){p.offered=false;note.textContent="Could not connect to a participant.";console.warn(e);}
}
async function peopleChanged(snap){
 if(!s.joined)return;
 const d=snap.val()||{};s.people=d;
 Array.from(s.peers.keys()).forEach(uid=>{if(!d[uid]||d[uid].session!==s.peers.get(uid).session)removePeer(uid);});
 Object.keys(d).forEach(uid=>{if(uid===me.uid)return;peer(uid,d[uid]);offer(uid,d[uid]);});
 render();
}
async function gotSignal(snap){
 const m=snap.val();
 try{
  if(!s.joined||!m||m.toSession!==s.session||!m.fromUid||!m.fromSession)return;
  let v=s.people[m.fromUid];if(!v||v.session!==m.fromSession){const x=await s.pr.child(m.fromUid).once("value");v=x.val();}
  if(!v||v.session!==m.fromSession)return;
  const p=peer(m.fromUid,v);if(!p)return;
  if(m.type==="description"&&m.payload&&(m.payload.type==="offer"||m.payload.type==="answer")){
   await p.pc.setRemoteDescription(new RTCSessionDescription(m.payload));p.remote=true;
   while(p.pending.length){try{await p.pc.addIceCandidate(new RTCIceCandidate(p.pending.shift()));}catch(_){}}
   if(m.payload.type==="offer"){const a=await p.pc.createAnswer();await p.pc.setLocalDescription(a);await send(m.fromUid,v.session,"description",{type:p.pc.localDescription.type,sdp:p.pc.localDescription.sdp});}
  }else if(m.type==="candidate"&&m.payload){if(p.remote)await p.pc.addIceCandidate(new RTCIceCandidate(m.payload));else p.pending.push(m.payload);}
 }catch(e){console.warn("voice signal handling",e);}
 finally{snap.ref.remove().catch(()=>{});}
}
function stopShare(renegotiatePeers=true){
 const stream=s.screenStream;if(!stream)return;s.screenStream=null;localShareVideo.srcObject=null;localShareWrap.classList.add("hidden");
 stream.getTracks().forEach(t=>{try{t.onended=null;t.stop();}catch(_){}});
 s.peers.forEach(p=>{if(p.shareSender){try{p.pc.removeTrack(p.shareSender);}catch(_){}p.shareSender=null;if(renegotiatePeers)renegotiate(p);}});
 note.textContent="Screen sharing stopped.";render();
}
async function toggleShare(){
 if(s.screenStream){stopShare(true);return;}
 if(!s.joined)return msg("Join voice before sharing your screen.");
 if(!navigator.mediaDevices||!navigator.mediaDevices.getDisplayMedia)return msg("Screen sharing isn't supported by this browser.");
 try{
  const stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:15,max:30}},audio:false});
  const track=stream.getVideoTracks()[0];if(!track){stream.getTracks().forEach(t=>t.stop());return;}
  s.screenStream=stream;localShareVideo.srcObject=stream;localShareWrap.classList.remove("hidden");
  track.onended=()=>{if(s.screenStream===stream)stopShare(true);};
  s.peers.forEach(p=>{try{p.shareSender=p.pc.addTrack(track,stream);renegotiate(p);}catch(e){console.warn("Unable to add screen share to peer",e);}});
  note.textContent="You're sharing your screen. Stop sharing anytime.";render();
 }catch(e){if(e&&e.name==="NotAllowedError")note.textContent="Screen sharing was cancelled.";else note.textContent="Couldn't start screen sharing: "+(e&&e.message||"browser error");}
}
async function stop(error){
 s.revision++;
 if(s.pr&&s.ph)s.pr.off("value",s.ph);if(s.inbox&&s.ih)s.inbox.off("child_added",s.ih);
 s.joined=false;s.joining=false;s.muted=false;s.deafened=false;
 if(s.screenStream)stopShare(false);
 s.room=null;s.session=null;s.people={};Array.from(s.peers.keys()).forEach(removePeer);
 if(s.stream){s.stream.getTracks().forEach(t=>t.stop());s.stream=null;}
 if(s.ownRef){try{await s.ownRef.remove();}catch(_){}}
 s.pr=null;s.ownRef=null;s.inbox=null;s.ph=null;s.ih=null;
 overlay.classList.remove("voice-visible");overlay.classList.add("hidden");
 mute.classList.remove("voice-muted");deafen.classList.remove("voice-muted");note.textContent="Your microphone is only used while connected.";
 refresh();render();if(error)msg(error);
}
async function start(){
 const r=current();if(!r)return msg("Open a server text channel first.");
 if(!me||!me.uid||!firebase.auth().currentUser)return msg("Log in to Prism first.");
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.RTCPeerConnection)return msg("Voice requires HTTPS, a microphone, and WebRTC support.");
 s.joining=true;s.room=r;showCall();refresh();render();note.textContent="Requesting microphone permission…";
 try{
  s.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
  s.session=window.crypto&&crypto.randomUUID?crypto.randomUUID().replace(/-/g,""):Date.now().toString(36)+Math.random().toString(36).slice(2);
  s.pr=db.ref(base(r)+"/participants");s.ownRef=s.pr.child(me.uid);s.inbox=db.ref(base(r)+"/signals/"+me.uid);
  await s.ownRef.onDisconnect().remove();await s.ownRef.set({name:String(me.name||"Prism user").slice(0,20),avatar:avatarSourceOk(ownAvatar())?ownAvatar():"",session:s.session,joinedAt:Date.now()});
  s.joined=true;s.joining=false;note.textContent="Voice is peer-to-peer. Screen sharing is optional; headphones reduce echo.";
  s.ph=x=>peopleChanged(x);s.ih=x=>gotSignal(x);s.pr.on("value",s.ph);s.inbox.on("child_added",s.ih);
  refresh();render();
 }catch(e){
  console.error(e);
  await stop(e&&e.name==="NotAllowedError"?"Microphone permission was denied.":e&&e.code==="PERMISSION_DENIED"?"Firebase denied voice access. The Firebase owner must publish the voice rules.":e&&e.message||"Could not start voice chat.");
 }
}
join.addEventListener("click",()=>{if(s.joined)showCall();else if(s.joining)stop();else start();});
mute.addEventListener("click",()=>{if(!s.stream)return;s.muted=!s.muted;s.stream.getAudioTracks().forEach(t=>t.enabled=!s.muted);render();});
deafen.addEventListener("click",()=>{s.deafened=!s.deafened;s.peers.forEach(p=>{p.audio.muted=s.deafened;});render();});
shareBtn.addEventListener("click",toggleShare);
hangup.addEventListener("click",()=>stop());
$("voice-close").addEventListener("click",()=>stop());
overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.classList.remove("voice-visible");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&s.joined&&!overlay.classList.contains("hidden"))overlay.classList.remove("voice-visible");});
if(typeof openChannel==="function"){
 const original=openChannel;
 openChannel=function(){const a=Array.from(arguments),r=s.room;if((s.joined||s.joining)&&r&&(String(a[0])!==r.sid||String(a[1])!==r.cid))stop();const out=original.apply(this,a);refresh();return out;};
}
if(typeof openServer==="function"){
 const original=openServer;
 openServer=function(){const a=Array.from(arguments);if((s.joined||s.joining)&&s.room&&String(a[0])!==s.room.sid)stop();const out=original.apply(this,a);refresh();return out;};
}
if(typeof openDM==="function"){
 const original=openDM;
 openDM=function(){stop();const out=original.apply(this,arguments);refresh();return out;};
}
firebase.auth().onAuthStateChanged(user=>{if(!user)stop();});
window.addEventListener("beforeunload",()=>{if(s.stream)s.stream.getTracks().forEach(t=>t.stop());if(s.screenStream)s.screenStream.getTracks().forEach(t=>t.stop());});
refresh();render();
})();