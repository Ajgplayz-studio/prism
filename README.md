# ◈ Prism

**Prism** is a free and open-source Discord alternative where *everything* is free — no Nitro, no paywalled features, no premium tiers. Just chat.

🌐 **Original live demo:** https://ajgplayz-studio.github.io/prism/

---

## ✨ Features

### 💬 Chat
- **Real-time messaging** — messages appear instantly for everyone
- **Chat channels** (`#`) for free-flowing conversation
- **Forum channels** (`📝`) for structured discussion — post topics, reply in threads
- **Message replies** with quoting and jump-to-original
- **Edit & delete** your own messages (with an "(edited)" tag)
- **Emoji reactions** with a hover action bar and toggleable pills
- **Pinned messages** with a header counter and pins viewer panel
- **Typing indicators** so you know who's writing

### 🏠 Servers
- **Create your own servers** with custom emoji icons
- **Invite-only by default** — every server gets a shareable invite link (`#invite=CODE`); nobody joins without it, not even the creator
- **Official Prism server** is open to everyone — no invite needed
- **Copy invite links** anytime from the server menu, and **leave** servers you no longer want

### 📩 Direct messages
- DM anyone from the member list or the `+` button
- **Unread badges** with message counts, sorted by most recent
- **New-message toasts** and online status dots
- Close conversations you don't need anymore

### 🎨 Personalization
- **Themes:** Dark, Light, and Midnight
- **Custom accent color**
- **Custom CSS box** (Fluxer-style) — restyle anything
- **🎨 Get themes button** — one click opens the official community themes server
- **Custom status** shown in the member list

### 👥 Community
- **Online member list** with presence tracking
- **Username + password accounts** (powered by Firebase Authentication)

---

## 🚀 Quick start

1. Open the [live demo](https://ajgplayz-studio.github.io/prism/).
2. **Sign up** with a username and password.
3. You'll land in the official **Prism** server — say hi in `#general`!
4. Click **+** in the server rail to create your own server, then share your invite link with friends.

### Creating channels
Click the **+** next to **TEXT CHANNELS** (server owners only). You'll be asked for:
1. **A name** — e.g. `announcements`
2. **A type:**
   - 💬 **Chat** — a channel where you can chat
   - 📝 **Forum** — add posts, and discuss each one in its own reply thread

### Setting a server icon
Click your **server's name** at the top of the channel list → **🖼️ Change server icon** → pick an emoji. It shows in the server rail for everyone.

### Joining with an invite link
Just open the link — Prism will ask you to log in first if you need to, then show a **Join** dialog.

---

## 🛠️ Host your own

Prism is a single static `index.html` — no frameworks, no build step.

1. **Fork** this repository.
2. Create a [Firebase](https://console.firebase.google.com/) project.
3. Enable **Authentication → Email/Password** sign-in.
4. Create a **Realtime Database** and wire your config into `index.html` (search for `firebaseConfig`).
5. Go to **Settings → Pages**, set the branch to `main`, and hit **Save**.
6. Your site will be live at `https://[your-username].github.io/[repo-name]`.

> ⚠️ The default database rules used during development allow open read/write (test mode). Before going public, tighten your [Realtime Database rules](https://firebase.google.com/docs/database/security) — especially around invites and membership.

---

## 🧱 Built with

- **Firebase Authentication** — username/password accounts
- **Firebase Realtime Database** — messages, servers, DMs, presence, everything
- **Plain HTML, CSS & JavaScript** — one file, zero dependencies

## 🗺️ What's not here (yet)

This `voice-chat-static` branch adds channel voice chat. GIF search, video calls, and file uploads are still not included.

---

Made with 💜 — free forever, no Nitro required.


## 🎙️ Static voice chat

This branch adds microphone-based voice chat in server channels using WebRTC audio and Firebase Realtime Database for presence/signaling. It is configured to use the original `discord-prism` Firebase project so existing accounts and chat data remain the same. The audio itself is peer-to-peer; Firebase does not store voice recordings.

### Deploy with GitHub Pages

1. In this fork, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
2. The workflow in `.github/workflows/pages.yml` deploys this branch automatically after a push.
3. When the workflow succeeds, open **https://michaelmb110b12-wq.github.io/prism-/**.

### Firebase owner setup required

The owner of the original `discord-prism` Firebase project needs to make two changes before voice chat can work:

1. In **Authentication → Settings → Authorized domains**, add `michaelmb110b12-wq.github.io`.
2. In **Realtime Database → Rules**, merge the `voiceRooms` fragment from [VOICE_CHAT_RULES.md](./VOICE_CHAT_RULES.md) into the existing `rules.prism` object, then publish. Do **not** replace the complete existing rules with the fragment; keep the existing accounts/chat permissions intact. Check for overly broad ancestor rules, because Realtime Database rules are additive and a broad parent read/write grant can override more-specific restrictions.

After those changes, sign in with an existing Prism account, open a server text channel and select **Join Voice**, then approve microphone access. The page must be served over HTTPS. The client uses a public STUN server; some restrictive networks may need a TURN relay for connections to succeed.
