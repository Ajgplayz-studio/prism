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
- **Create your own servers** with emoji or image/GIF icons
- **Discover is enabled by default** for new servers, so communities appear in the public Discover directory automatically
- **Per-server Discover switch** — owners can enable or disable a listing from the server menu; the choice is saved for everyone
- **Shareable invite links** are still available from the server menu (`#invite=CODE`)
- **Official Prism server** is always listed and open to everyone

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

### 🧭 Discovery
- **Searchable public directory** with categories and server descriptions
- **Existing servers** are listed when their owner next opens Prism, unless they have explicitly disabled discovery
- **Only the owner** can change a server's public listing; turning it off removes it from Discover

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
5. To deploy this voice-enabled branch, go to **Settings → Pages** and set the source to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` deploys the `voice-chat-static` branch.
6. Your site will be live at `https://[your-username].github.io/[repo-name]`.

> ⚠️ The default database rules used during development allow open read/write (test mode). Before going public, tighten your [Realtime Database rules](https://firebase.google.com/docs/database/security) — especially around invites and membership.

---

## 🧱 Built with

- **Firebase Authentication** — username/password accounts
- **Firebase Realtime Database** — messages, servers, DMs, presence, everything
- **Plain HTML, CSS & JavaScript** — one file, zero dependencies

## 🗺️ What's not here (yet)

Voice chat is added on the `voice-chat-static` branch. Video calls, GIF search, and file uploads are not included.

---

## 🎙️ Voice chat (this branch)

Open a server text channel and click **Join Voice**. Allow microphone access to join, use **Mute mic** to mute yourself, and **Leave voice** to disconnect. Audio is peer-to-peer; Firebase Realtime Database carries room presence and WebRTC signaling, not the audio stream.

This branch uses the original `discord-prism` Firebase project to keep the same accounts and messages as the original Prism. The owner of that Firebase project must authorize `michaelmb110b12-wq.github.io` under **Authentication → Settings → Authorized domains** and merge the voice rules in [VOICE_CHAT_RULES.md](./VOICE_CHAT_RULES.md) into the existing database rules. Do not replace the existing rules with only that fragment. Some restrictive networks need a TURN relay for audio to connect.

Made with 💜 — free forever, no Nitro required.
