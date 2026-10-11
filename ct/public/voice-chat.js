(() => {
"use strict";
const head = document.getElementById("chead");
if (!head || !document.getElementById("main") || !document.getElementById("msgs") || !window.firebase || typeof db === "undefined") return;
const style = document.createElement("style");
style.textContent = "\n#voice-join{display:inline-flex;align-items:center;gap:7px;border:0;border-radius:6px;padding:7px 11px;background:var(--accent,#5755d9);color:#fff;cursor:pointer;font-weight:650;font-size:13px;box-shadow:none}\n#voice-join.hidden{display:none!important}#voice-join:disabled{opacity:.6;cursor:wait}\n#voice-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(5,6,10,.62);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity .18s ease}\n#voice-overlay.hidden{display:none!important}#voice-overlay.voice-visible{opacity:1}\n#voice-window{position:relative;display:flex;flex-direction:column;width:min(700px,calc(100vw - 28px));height:min(440px,calc(100dvh - 28px));min-height:300px;overflow:hidden;border:1px solid color-mix(in srgb,var(--text,#e5e5e9) 9%,transparent);border-radius:12px;background:var(--side,#191a20);color:var(--text,#e5e5e9);box-shadow:0 20px 60px rgba(0,0,0,.45);transform:translateY(10px) scale(.985);transition:transform .18s ease}\n#voice-overlay.voice-visible #voice-window{transform:translateY(0) scale(1)}\n#voice-topbar{height:56px;min-height:56px;display:flex;align-items:center;gap:10px;padding:0 16px;border-bottom:1px solid color-mix(in srgb,var(--text,#e5e5e9) 7%,transparent);background:var(--darker,#131419)}\n#voice-brand-dot{width:8px;height:8px;border-radius:50%;background:#3ba879;box-shadow:none}\n#voice-header-copy{min-width:0;flex:1}#voice-kicker{font-size:9px;letter-spacing:1.5px;font-weight:700;color:var(--dim,#a0a3ad)}#voice-title{font-size:14px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}#voice-status{font-size:11px;color:var(--dim,#a0a3ad);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#voice-close{width:30px;height:30px;border-radius:5px;border:1px solid color-mix(in srgb,var(--text,#e5e5e9) 10%,transparent);background:var(--input,#292b32);color:var(--text,#e5e5e9);font-size:20px;line-height:1;cursor:pointer}\n#voice-stage{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:12px 16px;background:var(--bg,#202127)}\n#voice-participants{width:100%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;gap:20px;min-height:100px}\n.voice-person{width:112px;max-width:30%;display:flex;flex-direction:column;align-items:center;gap:9px;min-width:72px}\n.voice-avatar{width:72px;height:72px;max-width:100%;aspect-ratio:1;border:2px solid color-mix(in srgb,var(--text,#e5e5e9) 12%,transparent);border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:22px;letter-spacing:-.5px;background:var(--accent,#5755d9);box-shadow:none;position:relative}\n.voice-person.voice-self .voice-avatar{border-color:#39b982;box-shadow:0 0 0 2px rgba(57,185,130,.12)}\n.voice-person.voice-speaking .voice-avatar{outline:2px solid #3fe594;outline-offset:3px}\n.voice-person-name{max-width:100%;font-size:12px;color:#f0f3fa;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.voice-person-sub{font-size:10px;color:#9eaac0;margin-top:-5px}\n#voice-local-share-wrap{width:min(100%,520px);height:170px;min-height:95px;border-radius:8px;overflow:hidden;position:relative;background:#08090d;border:1px solid color-mix(in srgb,var(--text,#e5e5e9) 12%,transparent);box-shadow:none}\n#voice-local-share-wrap.hidden{display:none!important}#voice-local-share{width:100%;height:100%;object-fit:contain;display:block}\n#voice-local-share-label{position:absolute;left:10px;bottom:9px;padding:5px 8px;border-radius:7px;background:rgba(0,0,0,.68);font-size:10px;color:#fff}\n#voice-remote-shares{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;max-height:132px;overflow:auto}\n#voice-remote-shares:empty{display:none}#voice-remote-shares .voice-remote-tile{width:min(46%,260px);height:116px;position:relative;background:#070a10;border:1px solid rgba(255,255,255,.13);border-radius:10px;overflow:hidden}\n.voice-remote-tile video{width:100%;height:100%;object-fit:contain;display:block}.voice-remote-label{position:absolute;left:7px;bottom:6px;background:#000b;padding:4px 6px;border-radius:5px;font-size:10px}\n#voice-note{font-size:10px;color:#929eb3;min-height:14px;text-align:center;padding:0 14px 8px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#voice-controls{min-height:64px;display:flex;align-items:center;justify-content:center;gap:8px;padding:9px 14px 11px;border-top:1px solid color-mix(in srgb,var(--text,#e5e5e9) 7%,transparent);background:var(--darker,#131419)}\n.voice-control{position:relative;width:46px;height:46px;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid color-mix(in srgb,var(--text,#e5e5e9) 9%,transparent);border-radius:8px;background:var(--input,#292b32);color:var(--text,#e5e5e9);cursor:pointer;transition:background .12s ease,border-color .12s ease}\n.voice-control:hover{background:var(--hover,#272930)}.voice-control:focus-visible{outline:2px solid #91a7ff;outline-offset:2px}\n.voice-control svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\n.voice-control small{font-size:8px;color:#d0d7e4;line-height:1}\n.voice-control.voice-active{background:color-mix(in srgb,var(--accent,#5755d9) 24%,var(--input,#292b32));border-color:color-mix(in srgb,var(--accent,#5755d9) 55%,transparent)}\n.voice-control.voice-muted{background:rgba(233,67,80,.2);border-color:rgba(255,99,113,.55);color:#ffb7be}\n#voice-hangup{background:#fa3e49;border:0;border-radius:50%;width:52px;height:52px;margin-left:3px;box-shadow:0 4px 18px #fa3e493c}\n#voice-hangup:hover{background:#ff5962}#voice-hangup svg{width:23px;height:23px}\n@media(max-width:560px){#voice-overlay{padding:8px}#voice-window{width:calc(100vw - 16px);height:min(520px,calc(100dvh - 16px));border-radius:17px}#voice-topbar{height:56px;min-height:56px;padding:0 12px}#voice-stage{padding:8px}#voice-participants{gap:10px}.voice-person{width:84px}.voice-avatar{width:58px;font-size:18px}#voice-controls{gap:7px;padding:9px 8px 11px}.voice-control{width:42px;height:44px;border-radius:13px}#voice-hangup{width:49px;height:49px}#voice-local-share-wrap{height:135px}#voice-remote-shares .voice-remote-tile{height:90px}}\n@media(prefers-reduced-motion:reduce){#voice-overlay,#voice-window,.voice-control{transition:none}}\n";
style.textContent += "\n#dm-call{display:inline-flex;align-items:center;gap:7px;border:1px solid color-mix(in srgb,var(--text,#e5e5e9) 10%,transparent);border-radius:6px;padding:7px 11px;background:var(--input,#292b32);color:var(--text,#e5e5e9);cursor:pointer;font-weight:650;font-size:13px}\n#dm-call.hidden{display:none!important}#dm-call:disabled{opacity:.6;cursor:wait}\n";
document.head.appendChild(style);
const callLayoutStyle=document.createElement("style");
callLayoutStyle.textContent = `
#voice-overlay.voice-minimized{inset:auto auto 16px 16px;width:min(360px,calc(100vw - 24px));height:auto;padding:0;display:flex;align-items:stretch;justify-content:stretch;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;opacity:1;pointer-events:none;transition:none}
#voice-overlay.voice-minimized.hidden{display:none!important}
#voice-overlay.voice-minimized #voice-window{pointer-events:auto;width:360px;height:76px;min-width:280px;min-height:64px;max-width:calc(100vw - 24px);max-height:calc(100dvh - 24px);overflow:auto;resize:both;transform:none;border-radius:11px;box-shadow:0 12px 38px rgba(0,0,0,.42);}
#voice-overlay.voice-minimized #voice-stage,#voice-overlay.voice-minimized #voice-note{display:none}
#voice-overlay.voice-minimized #voice-controls{min-height:56px;padding:8px;gap:7px}
#voice-overlay.voice-minimized .voice-control{width:42px;height:42px}
#voice-overlay.voice-minimized #voice-hangup{width:74px;height:42px;border-radius:8px;margin-left:0;box-shadow:none}
#voice-overlay.voice-minimized #voice-hangup small{font-size:9px}
#voice-topbar{cursor:grab;user-select:none;touch-action:none}
#voice-topbar:active{cursor:grabbing}
#voice-window button{user-select:none}
#voice-minimize{height:30px;min-width:30px;border-radius:5px;border:1px solid color-mix(in srgb,var(--text,#e5e5e9) 10%,transparent);background:var(--input,#292b32);color:var(--text,#e5e5e9);font-size:20px;line-height:1;cursor:pointer}
#voice-local-share-wrap{width:min(100%,680px);height:min(340px,42vh);min-height:190px}
#voice-local-share-wrap video{width:100%;height:100%;object-fit:contain;cursor:zoom-in}
#voice-local-fullscreen{position:absolute;right:9px;top:9px;border:1px solid #ffffff30;border-radius:6px;background:#090b12cc;color:#fff;padding:6px 9px;cursor:pointer;z-index:2}
#voice-remote-shares{width:100%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;max-height:min(420px,50vh);overflow:auto}
#voice-remote-shares:empty{display:none}
#voice-remote-shares .voice-remote-tile{width:min(640px,100%);height:min(360px,45vh);min-height:210px;flex:1 1 420px;position:relative;background:#070a10;border:1px solid rgba(255,255,255,.13);border-radius:10px;overflow:hidden}
.voice-remote-tile video{width:100%;height:100%;object-fit:contain;display:block;cursor:zoom-in}
.voice-remote-label{position:absolute;left:8px;bottom:8px;background:#000b;padding:5px 7px;border-radius:5px;font-size:11px;max-width:calc(100% - 56px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;pointer-events:none}
.voice-fullscreen-button{position:absolute;top:8px;right:8px;width:34px;height:32px;border:1px solid #ffffff35;border-radius:6px;background:#05070cbd;color:white;font-size:19px;cursor:pointer;z-index:3}
#voice-share-window{display:none;position:fixed;z-index:2147482999;right:392px;bottom:16px;width:min(520px,calc(100vw - 410px));max-height:65vh;min-height:180px;flex-direction:column;overflow:hidden;background:var(--side,#191a20);color:var(--text,#e5e5e9);border:1px solid color-mix(in srgb,var(--text,#e5e5e9) 13%,transparent);border-radius:11px;box-shadow:0 12px 38px rgba(0,0,0,.42)}
#voice-share-window.voice-share-visible{display:flex}
#voice-share-window-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;font-size:12px;font-weight:700;border-bottom:1px solid color-mix(in srgb,var(--text,#e5e5e9) 9%,transparent);background:var(--darker,#131419)}
#voice-share-window-body{padding:8px;overflow:auto;min-height:0}
#voice-share-empty{font-size:11px;line-height:1.5;color:var(--dim,#a0a3ad);padding:18px 12px;text-align:center}
#voice-share-empty.hidden{display:none!important}
#voice-share-window #voice-local-share-wrap{width:100%;height:min(300px,36vh);min-height:160px;margin-bottom:8px}
#voice-share-window #voice-remote-shares{max-height:56vh}
#voice-share-window #voice-remote-shares .voice-remote-tile{width:100%;height:min(320px,38vh);min-height:180px;flex:1 1 100%}
#voice-hangup{width:74px;border-radius:10px;margin-left:0;box-shadow:none}
#voice-hangup small{font-size:9px}
@media(max-width:760px){
 #voice-share-window{right:12px;bottom:calc(16px + 122px);width:min(520px,calc(100vw - 24px));max-height:48vh}
 #voice-share-window #voice-local-share-wrap{height:180px;min-height:120px}
 #voice-share-window #voice-remote-shares .voice-remote-tile{height:200px;min-height:130px}
 #voice-overlay.voice-minimized{right:12px;bottom:12px;width:calc(100vw - 24px)}
 #voice-remote-shares .voice-remote-tile{height:min(300px,38vh);min-height:170px;flex-basis:100%}
}
`;
document.head.appendChild(callLayoutStyle);
const join = document.createElement("button");
join.id = "voice-join"; join.type = "button"; join.className = "hidden";
join.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg><span>Join Voice</span>';
const dmCall = document.createElement("button");
dmCall.id = "dm-call"; dmCall.type = "button"; dmCall.className = "hidden";
dmCall.textContent = "Call"; dmCall.title = "Call this user";
dmCall.setAttribute("aria-label", "Start a direct call");
head.appendChild(dmCall);
head.appendChild(join);
const overlay = document.createElement("div");
overlay.id = "voice-overlay"; overlay.className = "hidden";
overlay.setAttribute("role", "dialog"); overlay.setAttribute("aria-modal", "true"); overlay.setAttribute("aria-label", "Prism voice call");
overlay.innerHTML = "\n  <section id=\"voice-window\">\n    <header id=\"voice-topbar\">\n      <span id=\"voice-brand-dot\"></span>\n      <div id=\"voice-header-copy\">\n        <div id=\"voice-kicker\">PRISM VOICE</div>\n        <div id=\"voice-title\">Voice call</div>\n        <div id=\"voice-status\">Not connected</div>\n      </div>\n      <button id=\"voice-minimize\" type=\"button\" aria-label=\"Minimize call window\" title=\"Minimize call window\">—</button>\n      <button id=\"voice-close\" type=\"button\" aria-label=\"End call\" title=\"End call\">×</button>\n    </header>\n    <div id=\"voice-stage\">\n      <div id=\"voice-local-share-wrap\" class=\"hidden\">\n        <video id=\"voice-local-share\" autoplay muted playsinline></video>\n        <button id=\"voice-local-fullscreen\" type=\"button\" title=\"View fullscreen\" aria-label=\"View fullscreen\">⛶</button>\n        <span id=\"voice-local-share-label\">You're sharing your screen</span>\n      </div>\n      <div id=\"voice-remote-shares\"></div>\n      <div id=\"voice-participants\"></div>\n    </div>\n    <div id=\"voice-note\">Your microphone is only used while connected.</div>\n    <footer id=\"voice-controls\">\n      <button class=\"voice-control\" id=\"voice-mute\" type=\"button\" aria-label=\"Mute microphone\" title=\"Mute microphone\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\"/><path d=\"M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8\"/></svg><small>Mic</small>\n      </button>\n      <button class=\"voice-control\" id=\"voice-deafen\" type=\"button\" aria-label=\"Mute incoming audio\" title=\"Mute incoming audio\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 10v4a2 2 0 0 0 2 2h2l5 4V4l-5 4H5a2 2 0 0 0-2 2z\"/><path d=\"M16 9a5 5 0 0 1 0 6M18.5 6.5a9 9 0 0 1 0 11\"/></svg><small>Audio</small>\n      </button>\n      <button class=\"voice-control\" id=\"voice-camera\" type=\"button\" aria-label=\"Start camera\" title=\"Start camera\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"6\" width=\"12\" height=\"12\" rx=\"2\"/><path d=\"m15 10 6-3v10l-6-3\"/></svg><small id=\"voice-camera-label\">Camera</small>\n      </button>\n      <button class=\"voice-control\" id=\"voice-share\" type=\"button\" aria-label=\"Share screen\" title=\"Share screen\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M8 22h8M12 17v5M12 13V8M9 11l3-3 3 3\"/></svg><small id=\"voice-share-label\">Share</small>\n      </button>\n      <button class=\"voice-control\" id=\"voice-hangup\" type=\"button\" aria-label=\"Leave voice call\" title=\"Leave voice call\">\n        <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 14.5a12 12 0 0 1 15 0l1.8 1.5a1.6 1.6 0 0 1 .3 2.1l-1.3 2a1.6 1.6 0 0 1-2 .6l-3.5-1.5a1.6 1.6 0 0 1-.9-1.8l.4-1.8a10 10 0 0 0-4.6 0l.4 1.8a1.6 1.6 0 0 1-.9 1.8L5.2 20.7a1.6 1.6 0 0 1-2-.6l-1.3-2a1.6 1.6 0 0 1 .3-2.1z\"/></svg><small>End call</small>\n      </button>\n    </footer>\n  </section>";
document.body.appendChild(overlay);
const shareWindow=document.createElement("aside");
shareWindow.id="voice-share-window";
shareWindow.innerHTML='<div id="voice-share-window-head"><span>Live screenshare / camera</span></div><div id="voice-share-window-body"><div id="voice-share-empty">Minimize the call window to keep chatting while video stays here.</div></div>';
document.body.appendChild(shareWindow);
const $ = id => document.getElementById(id);
const status = $("voice-status"), title = $("voice-title"), list = $("voice-participants");
const note = $("voice-note"), mute = $("voice-mute"), deafen = $("voice-deafen");
const shareBtn = $("voice-share"), shareLabel = $("voice-share-label"), hangup = $("voice-hangup");
const cameraBtn = $("voice-camera"), cameraLabel = $("voice-camera-label");
const localShareWrap = $("voice-local-share-wrap"), localShareVideo = $("voice-local-share"), localShareLabel = $("voice-local-share-label");
const remoteShares = $("voice-remote-shares");
const voiceStage=$("voice-stage"), callWindow=$("voice-window"), callTopbar=$("voice-topbar");
const sideShareBody=$("voice-share-window-body"), sideShareEmpty=$("voice-share-empty");
const localFullscreen=$("voice-local-fullscreen"), minimizeBtn=$("voice-minimize");
const s = {room:null,session:null,stream:null,screenStream:null,cameraStream:null,joined:false,joining:false,muted:false,deafened:false,people:{},peers:new Map(),pr:null,ownRef:null,inbox:null,ph:null,ih:null,revision:0,directTarget:null,inviteStateRef:null,inviteStateHandler:null,minimized:false,ice:[{urls:"stun:stun.l.google.com:19302"}]};
let incomingCallsRef = null;
const seenIncomingCalls = new Set();
const valid = x => /^[A-Za-z0-9_-]{1,128}$/.test(String(x));
const base = r => "prism/voiceRooms/" + r.sid + "/" + r.cid;
function msg(t){if(typeof toast==="function")toast(t);else console.log(t);}
function directRoomFor(a,b){
 const key = [String(a),String(b)].sort().join(":");
 let hash = 2166136261;
 for(let i=0;i<key.length;i++){hash^=key.charCodeAt(i);hash=Math.imul(hash,16777619);}
 return {sid:"dm_"+(hash>>>0).toString(36),cid:"direct"};
}
function current(){
 if(s.directTarget){
  if(!valid(s.directTarget.roomSid)||!valid(s.directTarget.roomCid))return null;
  return {sid:s.directTarget.roomSid,cid:s.directTarget.roomCid,name:"Direct call with "+String(s.directTarget.name||"user")};
 }
 if(typeof view==="undefined"||!view||view.type!=="server"||!view.sid||!view.cid||!valid(view.sid)||!valid(view.cid))return null;
 return {sid:String(view.sid),cid:String(view.cid),name:$("chname").textContent||"channel"};
}
function showCall(){
 if(s.minimized)setMinimized(false);
 if(overlay.classList.contains("hidden"))overlay.classList.remove("hidden");
 requestAnimationFrame(()=>overlay.classList.add("voice-visible"));
}
function setMinimized(minimized){
 s.minimized=!!minimized;
 overlay.classList.toggle("voice-minimized",s.minimized);
 minimizeBtn.textContent=s.minimized?"□":"—";
 minimizeBtn.title=s.minimized?"Maximize call window":"Minimize call window";
 minimizeBtn.setAttribute("aria-label",s.minimized?"Maximize call window":"Minimize call window");
 if(s.minimized){
   shareWindow.classList.add("voice-share-visible");
   sideShareBody.appendChild($("voice-local-share-wrap"));
   sideShareBody.appendChild(remoteShares);
 }else{
   shareWindow.classList.remove("voice-share-visible");
   voiceStage.insertBefore(remoteShares,$("voice-participants"));
   voiceStage.insertBefore($("voice-local-share-wrap"),remoteShares);
   callWindow.style.position="";callWindow.style.left="";callWindow.style.top="";callWindow.style.right="";callWindow.style.bottom="";callWindow.style.transform="";callWindow.style.margin="";callWindow.style.zIndex="";callWindow.style.width="";callWindow.style.height="";callWindow.style.maxWidth="";callWindow.style.maxHeight="";
 }
 refreshSideShareEmpty();
}
function refreshSideShareEmpty(){
 const hasLocal=!!(s.screenStream||s.cameraStream);
 const hasRemote=!!remoteShares.children.length;
 sideShareEmpty.classList.toggle("hidden",hasLocal||hasRemote);
}
async function requestMediaFullscreen(target){
 if(!target)return;
 try{
  if(document.fullscreenElement){await document.exitFullscreen();return;}
  if(target.requestFullscreen)await target.requestFullscreen();
  else if(target.webkitRequestFullscreen)target.webkitRequestFullscreen();
 }catch(e){note.textContent="Fullscreen isn't available in this browser.";}
}
function refresh(){
 const canJoin=!!current()&&!s.directTarget;
 join.classList.toggle("hidden",!canJoin);join.disabled=s.joining;
 join.querySelector("span").textContent=s.joined?"Open Voice":s.joining?"Connecting...":"Join Voice";
 join.title=s.joined?"Open the voice call":"Join channel voice";
 const isDM = typeof view!=="undefined"&&view&&view.type==="dm";
 dmCall.classList.toggle("hidden",!isDM);
 dmCall.disabled=s.joining;
 const currentDMCall=!!(isDM&&s.directTarget&&s.directTarget.uid===view.otherUid&&(s.joined||s.joining));
 dmCall.textContent=currentDMCall?"Open call":"Call";
 dmCall.title=currentDMCall?"Open your direct call":"Call "+String(isDM?view.otherName||"user":"user");
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
 title.textContent=s.room?(s.directTarget?"Call with "+String(s.directTarget.name||"user"):"#"+s.room.name+" voice"):"Voice call";
 status.textContent=s.joining?"Connecting to microphone…":s.joined?"Connected · "+people.length+" participant"+(people.length===1?"":"s"):"Not connected";
 mute.classList.toggle("voice-muted",s.muted);mute.setAttribute("aria-label",s.muted?"Unmute microphone":"Mute microphone");mute.title=s.muted?"Unmute microphone":"Mute microphone";
 deafen.classList.toggle("voice-muted",s.deafened);deafen.setAttribute("aria-label",s.deafened?"Unmute incoming audio":"Mute incoming audio");deafen.title=s.deafened?"Unmute incoming audio":"Mute incoming audio";
 shareBtn.classList.toggle("voice-active",!!s.screenStream);shareBtn.setAttribute("aria-label",s.screenStream?"Stop sharing screen":"Share screen");shareBtn.title=s.screenStream?"Stop sharing screen":"Share screen";
 shareLabel.textContent=s.screenStream?"Stop":"Share";
 cameraBtn.classList.toggle("voice-active",!!s.cameraStream);cameraBtn.setAttribute("aria-label",s.cameraStream?"Stop camera":"Start camera");cameraBtn.title=s.cameraStream?"Stop camera":"Start camera";
 cameraLabel.textContent=s.cameraStream?"Stop":"Camera";
 localShareLabel.textContent=s.screenStream?"You're sharing your screen":"Your camera is on";
 localShareWrap.classList.toggle("hidden",!s.screenStream&&!s.cameraStream);
 renderShares();
}
function renderShares(){
 remoteShares.textContent="";
 s.peers.forEach(p=>{
  if(!p.video||!p.videoTrack||p.videoTrack.readyState==="ended")return;
  const tile=document.createElement("div");tile.className="voice-remote-tile";
  const full=document.createElement("button");full.type="button";full.className="voice-fullscreen-button";full.textContent="⛶";full.title="View fullscreen";full.setAttribute("aria-label","View "+p.name+"'s video fullscreen");
  full.onclick=event=>{event.stopPropagation();requestMediaFullscreen(tile);};
  p.video.onclick=()=>requestMediaFullscreen(tile);
  const label=document.createElement("span");label.className="voice-remote-label";label.textContent=p.name+" · camera / screen";
  tile.append(p.video,label,full);remoteShares.appendChild(tile);
 });
 refreshSideShareEmpty();
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
 p={uid,session:v.session,name:v.name||"Prism user",pc,audio:a,video:null,videoTrack:null,shareSender:null,cameraSender:null,pending:[],remote:false,offered:false,needsRenegotiation:false};
 s.peers.set(uid,p);
 if(s.stream)s.stream.getAudioTracks().forEach(t=>pc.addTrack(t,s.stream));
 if(s.screenStream){const track=s.screenStream.getVideoTracks()[0];if(track)p.shareSender=pc.addTrack(track,s.screenStream);}
 if(s.cameraStream){const track=s.cameraStream.getVideoTracks()[0];if(track)p.cameraSender=pc.addTrack(track,s.cameraStream);}
 pc.onicecandidate=e=>{if(e.candidate)send(uid,p.session,"candidate",e.candidate.toJSON?e.candidate.toJSON():e.candidate);};
 pc.ontrack=e=>{
  const stream=e.streams&&e.streams[0]?e.streams[0]:new MediaStream([e.track]);
  if(e.track.kind==="audio"){a.srcObject=stream;a.play().catch(()=>note.textContent="Click the page once if audio playback is blocked.");}
  else if(e.track.kind==="video"){
   if(p.video)p.video.remove();
   const el=document.createElement("video");el.autoplay=true;el.playsInline=true;el.controls=false;el.srcObject=stream;el.setAttribute("aria-label",p.name+" video");
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
 if(s.cameraStream)stopCamera(true);
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
function stopCamera(renegotiatePeers=true){
 const stream=s.cameraStream;
 if(!stream)return;
 s.cameraStream=null;
 stream.getTracks().forEach(track=>{try{track.onended=null;track.stop();}catch(_){}});
 s.peers.forEach(p=>{
  if(p.cameraSender){
   try{p.pc.removeTrack(p.cameraSender);}catch(_){}
   p.cameraSender=null;
   if(renegotiatePeers)renegotiate(p);
  }
 });
 if(s.screenStream){localShareVideo.srcObject=s.screenStream;localShareWrap.classList.remove("hidden");}
 else {localShareVideo.srcObject=null;localShareWrap.classList.add("hidden");}
 note.textContent="Camera turned off.";
 render();
}
async function toggleCamera(){
 if(s.cameraStream){stopCamera(true);return;}
 if(!s.joined)return msg("Join voice before turning on your camera.");
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return msg("Camera access isn't supported by this browser.");
 if(s.screenStream)stopShare(true);
 try{
  const stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},frameRate:{ideal:24,max:30}},audio:false});
  const track=stream.getVideoTracks()[0];
  if(!track){stream.getTracks().forEach(t=>t.stop());return;}
  s.cameraStream=stream;
  localShareVideo.srcObject=stream;
  localShareWrap.classList.remove("hidden");
  track.onended=()=>{if(s.cameraStream===stream)stopCamera(true);};
  s.peers.forEach(p=>{
   try{p.cameraSender=p.pc.addTrack(track,stream);renegotiate(p);}
   catch(e){console.warn("Unable to add camera to peer",e);}
  });
  note.textContent="Your camera is on. Camera video is peer-to-peer.";
  render();
 }catch(e){
  if(e&&e.name==="NotAllowedError")note.textContent="Camera permission was denied.";
  else note.textContent="Couldn't start your camera: "+(e&&e.message||"browser error");
 }
}
async function stop(error){
 s.revision++;
 const direct = s.directTarget;
 if(s.minimized)setMinimized(false);
 if(s.pr&&s.ph)s.pr.off("value",s.ph);if(s.inbox&&s.ih)s.inbox.off("child_added",s.ih);
 if(s.inviteStateRef&&s.inviteStateHandler)s.inviteStateRef.off("value",s.inviteStateHandler);
 s.inviteStateRef=null;s.inviteStateHandler=null;
 s.joined=false;s.joining=false;s.muted=false;s.deafened=false;
 if(s.screenStream)stopShare(false);
 if(s.cameraStream)stopCamera(false);
 s.room=null;s.session=null;s.people={};Array.from(s.peers.keys()).forEach(removePeer);
 if(s.stream){s.stream.getTracks().forEach(t=>t.stop());s.stream=null;}
 if(s.ownRef){try{await s.ownRef.remove();}catch(_){}}
 if(direct&&direct.invitePath)db.ref(direct.invitePath).remove().catch(()=>{});
 s.pr=null;s.ownRef=null;s.inbox=null;s.ph=null;s.ih=null;s.directTarget=null;
 overlay.classList.remove("voice-visible");overlay.classList.add("hidden");
 mute.classList.remove("voice-muted");deafen.classList.remove("voice-muted");note.textContent="Your microphone is only used while connected.";
 refresh();render();if(error)msg(error);
}
async function start(){
 const runRevision=++s.revision;
 const r=current();if(!r)return msg("Open a server text channel or direct message first.");
 if(!me||!me.uid||!firebase.auth().currentUser)return msg("Log in to Prism first.");
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.RTCPeerConnection)return msg("Voice requires HTTPS, a microphone, and WebRTC support.");
 s.joining=true;s.room=r;showCall();refresh();render();note.textContent="Requesting microphone permission…";
 try{
  s.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
  if(runRevision!==s.revision){if(s.stream)s.stream.getTracks().forEach(t=>t.stop());s.stream=null;return;}
  s.session=window.crypto&&crypto.randomUUID?crypto.randomUUID().replace(/-/g,""):Date.now().toString(36)+Math.random().toString(36).slice(2);
  s.pr=db.ref(base(r)+"/participants");s.ownRef=s.pr.child(me.uid);s.inbox=db.ref(base(r)+"/signals/"+me.uid);
  await s.ownRef.onDisconnect().remove();await s.ownRef.set({name:String(me.name||"Prism user").slice(0,20),avatar:avatarSourceOk(ownAvatar())?ownAvatar():"",session:s.session,joinedAt:Date.now()});
  s.joined=true;s.joining=false;note.textContent=s.directTarget?"Private call is connected through peer-to-peer voice.":"Voice is peer-to-peer. Screen sharing is optional; headphones reduce echo.";
  s.ph=x=>peopleChanged(x);s.ih=x=>gotSignal(x);s.pr.on("value",s.ph);s.inbox.on("child_added",s.ih);
  refresh();render();
 }catch(e){
  console.error(e);
  await stop(e&&e.name==="NotAllowedError"?"Microphone permission was denied.":e&&e.code==="PERMISSION_DENIED"?"Firebase denied voice access. The Firebase owner must publish the voice rules.":e&&e.message||"Could not start voice chat.");
 }
}
join.addEventListener("click",()=>{if(s.joined)showCall();else if(s.joining)stop();else start();});
minimizeBtn.addEventListener("click",()=>setMinimized(!s.minimized));
localFullscreen.addEventListener("click",()=>requestMediaFullscreen($("voice-local-share-wrap")));
callTopbar.addEventListener("pointerdown",event=>{
 if(event.button!==0||event.target.closest("button"))return;
 const rect=callWindow.getBoundingClientRect();
 callWindow.style.position="fixed";callWindow.style.left=rect.left+"px";callWindow.style.top=rect.top+"px";
 callWindow.style.right="auto";callWindow.style.bottom="auto";callWindow.style.transform="none";callWindow.style.margin="0";
 callWindow.style.zIndex="2147483002";
 callWindow.dataset.dragX=String(event.clientX);callWindow.dataset.dragY=String(event.clientY);
 callWindow.dataset.dragLeft=String(rect.left);callWindow.dataset.dragTop=String(rect.top);
 callWindow.dataset.dragging="1";
 try{callTopbar.setPointerCapture(event.pointerId);}catch(_){}
 event.preventDefault();
});
callTopbar.addEventListener("pointermove",event=>{
 if(callWindow.dataset.dragging!=="1")return;
 const dx=event.clientX-Number(callWindow.dataset.dragX||0),dy=event.clientY-Number(callWindow.dataset.dragY||0);
 const rect=callWindow.getBoundingClientRect();
 const left=Math.max(8,Math.min(window.innerWidth-rect.width-8,Number(callWindow.dataset.dragLeft||rect.left)+dx));
 const top=Math.max(8,Math.min(window.innerHeight-rect.height-8,Number(callWindow.dataset.dragTop||rect.top)+dy));
 callWindow.style.left=left+"px";callWindow.style.top=top+"px";
});
const stopDragging=()=>{callWindow.dataset.dragging="0";};
callTopbar.addEventListener("pointerup",stopDragging);
callTopbar.addEventListener("pointercancel",stopDragging);
dmCall.addEventListener("click",()=>{
 if(typeof view==="undefined"||!view||view.type!=="dm"||!view.otherUid)return;
 if(s.joined&&s.directTarget&&s.directTarget.uid===view.otherUid){showCall();return;}
 callUser(view.otherUid,view.otherName||"user");
});
mute.addEventListener("click",()=>{if(!s.stream)return;s.muted=!s.muted;s.stream.getAudioTracks().forEach(t=>t.enabled=!s.muted);render();});
deafen.addEventListener("click",()=>{s.deafened=!s.deafened;s.peers.forEach(p=>{p.audio.muted=s.deafened;});render();});
shareBtn.addEventListener("click",toggleShare);
cameraBtn.addEventListener("click",toggleCamera);
hangup.addEventListener("click",()=>stop());
$("voice-close").addEventListener("click",()=>stop());
overlay.addEventListener("click",e=>{if(e.target===overlay&&!s.minimized)overlay.classList.remove("voice-visible");});
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
async function handleIncomingCall(snap){
 const invite=snap.val();
 if(!me||!invite||invite.status!=="ringing"||!invite.fromUid||invite.fromUid===me.uid)return;
 if(Date.now()-(Number(invite.createdAt)||0)>60000){snap.ref.remove().catch(()=>{});return;}
 if(!valid(invite.roomSid)||!valid(invite.roomCid))return;
 const inviteId=String(me.uid)+":"+String(snap.key);
 if(seenIncomingCalls.has(inviteId))return;
 seenIncomingCalls.add(inviteId);
 const callerName=String(invite.fromName||"Prism user").slice(0,40);
 let answer=false;
 try{answer=window.confirm(callerName+" is calling you on Prism. Answer the call?");}catch(_){}
 const latest=await snap.ref.once("value").catch(()=>null);
 const live=latest&&latest.val();
 if(!live||live.status!=="ringing")return;
 if(!answer){
  await snap.ref.update({status:"declined",declinedAt:Date.now()}).catch(()=>{});
  return;
 }
 if(s.joined||s.joining)await stop();
 await snap.ref.update({status:"accepted",acceptedAt:Date.now()}).catch(e=>{throw e;});
 s.directTarget={uid:invite.fromUid,name:callerName,roomSid:invite.roomSid,roomCid:invite.roomCid,invitePath:"prism/dmCallInvites/"+me.uid+"/"+snap.key,callId:snap.key,incoming:true};
 await start();
}
function watchIncomingCalls(user){
 if(incomingCallsRef){incomingCallsRef.off("child_added",handleIncomingCall);incomingCallsRef=null;}
 if(!user)return;
 incomingCallsRef=db.ref("prism/dmCallInvites/"+user.uid);
 incomingCallsRef.on("child_added",handleIncomingCall,error=>msg("Couldn't listen for direct calls. Firebase rules may need dmCallInvites read access."));
}
async function callUser(uid,name){
 if(!me||!uid||uid===me.uid)return msg("You can't call your own account.");
 if(s.joined&&s.directTarget&&s.directTarget.uid===uid){showCall();return;}
 if(s.joined||s.joining)await stop();
 const targetName=String(name||"Prism user").slice(0,40);
 const room=directRoomFor(me.uid,uid);
 const inviteRef=db.ref("prism/dmCallInvites/"+uid).push();
 const callId=inviteRef.key;
 const invitePath="prism/dmCallInvites/"+uid+"/"+callId;
 s.directTarget={uid:uid,name:targetName,roomSid:room.sid,roomCid:room.cid,invitePath:invitePath,callId:callId,outgoing:true};
 s.inviteStateRef=inviteRef;
 s.inviteStateHandler=snap=>{
  const value=snap.val();
  if(!value||!s.directTarget||s.directTarget.callId!==callId)return;
  if(value.status==="accepted"){note.textContent=targetName+" answered. Connecting…";}
  if(value.status==="declined"){stop(targetName+" declined the call.");}
  if(value.status==="missed"){stop("No answer from "+targetName+".");}
 };
 inviteRef.on("value",s.inviteStateHandler);
 try{
  await inviteRef.set({fromUid:me.uid,fromName:me.name,roomSid:room.sid,roomCid:room.cid,status:"ringing",createdAt:Date.now()});
  await start();
  window.setTimeout(async()=>{
   if(!s.directTarget||s.directTarget.callId!==callId)return;
   const latest=await inviteRef.once("value").catch(()=>null);
   if(latest&&latest.exists()&&latest.val().status==="ringing"){
    await inviteRef.update({status:"missed"}).catch(()=>{});
    if(s.directTarget&&s.directTarget.callId===callId)await stop("No answer from "+targetName+".");
   }
  },45000);
 }catch(e){
  await stop("Couldn't start the direct call. Check microphone permissions and Firebase rules for dmCallInvites/voiceRooms.");
 }
}
window.PrismVoice=Object.assign(window.PrismVoice||{},{callUser:callUser,openCall:showCall,hangup:stop});
firebase.auth().onAuthStateChanged(user=>{
 if(!user)stop();
 watchIncomingCalls(user);
});
window.addEventListener("beforeunload",()=>{if(s.stream)s.stream.getTracks().forEach(t=>t.stop());if(s.screenStream)s.screenStream.getTracks().forEach(t=>t.stop());if(s.cameraStream)s.cameraStream.getTracks().forEach(t=>t.stop());});
refresh();render();
})();