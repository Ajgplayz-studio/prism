# Firebase Realtime Database voice rules

These rules are a **fragment**, not a complete replacement for the project's rules.

The original Prism app stores data below `prism/`. In Firebase Console → Realtime Database → Rules, merge this `voiceRooms` object **inside the existing `rules.prism` object**, alongside the current `users`, `servers`, `messages`, and other nodes. Preserve the rest of the existing rules, then review and publish them. If a `voiceRooms` node already exists, merge carefully instead of overwriting it.

```json
{
  "voiceRooms": {
    "$sid": {
      "$cid": {
        "participants": {
          ".read": "auth != null && root.child('prism/serverChannels').child($sid).child($cid).exists() && ($sid === 'official' || root.child('prism/myServers').child(auth.uid).child($sid).val() === true || root.child('prism/servers').child($sid).child('owner').val() === auth.uid)",
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && root.child('prism/serverChannels').child($sid).child($cid).exists() && ($sid === 'official' || root.child('prism/myServers').child(auth.uid).child($sid).val() === true || root.child('prism/servers').child($sid).child('owner').val() === auth.uid)"
          }
        },
        "signals": {
          "$targetUid": {
            ".read": "auth != null && auth.uid === $targetUid && root.child('prism/serverChannels').child($sid).child($cid).exists() && ($sid === 'official' || root.child('prism/myServers').child(auth.uid).child($sid).val() === true || root.child('prism/servers').child($sid).child('owner').val() === auth.uid)",
            "$signalId": {
              ".write": "auth != null && ((!newData.exists() && auth.uid === $targetUid) || ( root.child('prism/serverChannels').child($sid).child($cid).exists() && ($sid === 'official' || root.child('prism/myServers').child(auth.uid).child($sid).val() === true || root.child('prism/servers').child($sid).child('owner').val() === auth.uid) && root.child('prism/voiceRooms').child($sid).child($cid).child('participants').child(auth.uid).exists() && root.child('prism/voiceRooms').child($sid).child($cid).child('participants').child($targetUid).exists() && newData.child('fromUid').val() === auth.uid && newData.child('fromSession').val() === root.child('prism/voiceRooms').child($sid).child($cid).child('participants').child(auth.uid).child('session').val() && newData.child('toSession').val() === root.child('prism/voiceRooms').child($sid).child($cid).child('participants').child($targetUid).child('session').val()))"
            }
          }
        }
      }
    }
  }
}
```

The fragment limits participant-list reads and signaling inbox reads to signed-in users who can access that channel. Each user can write their own participant entry; signaling requires an active participant record and matching session IDs. The recipient can remove signaling records from their own inbox.

**Important:** Realtime Database rules are additive. If an existing rule at `rules` or `rules.prism` already grants broad reads/writes, these child restrictions cannot revoke that access. The Firebase project owner should inspect all ancestor `.read` and `.write` rules before publishing. Do not paste a service-account private key into this repository or into the browser.
