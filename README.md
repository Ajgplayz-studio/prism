# ◈ Prism

**Prism** is a free and open-source Discord alternative where *everything* is free — no Nitro, no paywalled features, no premium tiers. Just chat.

🌐 **Live demo:** https://ajgplayz-studio.github.io/prism/

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

Voice chat is implemented on the `voice-chat` branch as a Hostless Node.js app. GIF search, video calls, and file uploads are still not included.

---

Made with 💜 — free forever, no Nitro required.


## 🎙️ Hostless voice-chat branch

This branch adds authenticated, channel-based voice rooms using WebRTC audio and Socket.IO signaling. The GitHub Pages version on `main` is unchanged; use the Hostless App to run the voice-enabled version.

1. In Hostless, create an **App** for this repository and select the **`voice-chat`** branch.
2. Set the start command to **`npm start`** (Node.js 20 or newer). The server listens on Hostless's supplied `PORT`.
3. In your Firebase project, open **Project settings → Service accounts** and generate a private key JSON for the project Prism already uses (`discord-prism`).
4. Add the entire JSON file contents as the Hostless secret/environment variable **`FIREBASE_SERVICE_ACCOUNT_JSON`**. Never commit the key to GitHub or put it in frontend code.
5. Add the Hostless domain in Firebase Authentication → Settings → Authorized domains.
6. Deploy, sign in to Prism, open a server text channel and click **Join Voice**. Give the browser microphone permission.

Optional environment variables:

- `FIREBASE_DATABASE_URL` — defaults to the Prism Realtime Database URL.
- `FIREBASE_PROJECT_ID` — defaults to the service account's project ID.
- `MAX_VOICE_PEERS` — room size limit; defaults to 8 and is capped at 12.
- `TURN_URL`, `TURN_USERNAME`, `TURN_CREDENTIAL` — optional TURN relay settings for restrictive networks.

The server uses a public STUN server by default. Some networks—especially school or workplace networks—may require TURN credentials for audio to connect reliably. Voice requires HTTPS and browser microphone permission. Check `/healthz` for service status.
