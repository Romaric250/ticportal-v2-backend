# Socket.io Enhanced Logging Guide

## Overview

The Socket.io real-time chat now has comprehensive logging with emojis and clear prefixes to make debugging easier.

## Log Prefixes

All socket logs use the `[SOCKET]` prefix with specific emojis to indicate the type of operation:

| Emoji | Prefix | Meaning |
|-------|--------|---------|
| 🚀 | `[SOCKET]` | Initialization |
| 🔐 | `[SOCKET AUTH]` | Authentication process |
| 🟢 | `[SOCKET]` | New connection |
| 🔵 | `[SOCKET]` | User action attempt |
| ✅ | `[SOCKET]` | Success |
| ❌ | `[SOCKET]` | Failure/Error |
| 💥 | `[SOCKET]` | Critical error |
| 📢 | `[SOCKET]` or `[SOCKET EMIT]` | Broadcasting to clients |
| 💾 | `[SOCKET]` | Database operation |
| 🔍 | `[SOCKET]` | Data lookup/verification |
| 🔴 | `[SOCKET]` | Disconnection |
| ⌨️ | `[SOCKET]` | Typing indicator |
| ✉️ | `[SOCKET]` | Message delivery receipt |
| 👁️ | `[SOCKET]` | Message read receipt |

---

## Log Flow Examples

### 1. **Socket Connection & Authentication**

```
🚀 [SOCKET] Initializing Socket.io server
✅ [SOCKET] Authentication middleware applied
🔐 [SOCKET AUTH] Authenticating new socket connection
🔍 [SOCKET AUTH] Token found, verifying...
✅ [SOCKET AUTH] Token verified, fetching user from database
✅ [SOCKET AUTH] Authentication successful
  { socketId: "abc123", userId: "user_id", email: "user@example.com", fullName: "John Doe" }
🟢 [SOCKET] New client connected successfully
  { socketId: "abc123", userId: "user_id", userName: "John Doe", email: "user@example.com" }
✅ [SOCKET] Team chat handlers registered for client
```

### 2. **Join Team Room**

```
🔵 [SOCKET] User attempting to join team room
  { userId: "user_id", teamId: "team_id", socketId: "abc123", userName: "John Doe" }
✅ [SOCKET] User successfully joined team room
  { userId: "user_id", teamId: "team_id", socketId: "abc123", userName: "John Doe" }
📢 [SOCKET] Broadcasting online status to team
  { userId: "user_id", teamId: "team_id", userName: "John Doe", payload: {...} }
```

### 3. **Send Message (Success)**

```
🔵 [SOCKET] User attempting to send message
  { userId: "user_id", teamId: "team_id", userName: "John Doe", messagePreview: "Hello team!", attachmentsCount: 0 }
💾 [SOCKET] Saving message to database
  { userId: "user_id", teamId: "team_id", userName: "John Doe" }
✅ [SOCKET] Message saved to database
  { userId: "user_id", teamId: "team_id", messageId: "msg_id", userName: "John Doe" }
📢 [SOCKET] Message broadcast to all team members (including sender)
  { userId: "user_id", teamId: "team_id", messageId: "msg_id", userName: "John Doe", payload: {...} }
```

### 4. **Send Message (Failure - Not a Member)**

```
🔵 [SOCKET] User attempting to send message
  { userId: "user_id", teamId: "team_id", userName: "John Doe", messagePreview: "Hello!", attachmentsCount: 0 }
❌ [SOCKET] Send message failed: Not a team member
  { userId: "user_id", teamId: "team_id", userName: "John Doe" }
```

### 5. **Typing Indicators**

```
⌨️ [SOCKET] User started typing
  { userId: "user_id", teamId: "team_id", userName: "John Doe" }
📢 [SOCKET] Broadcasting typing indicator (start) to team
  { userId: "user_id", teamId: "team_id", userName: "John Doe" }

⌨️ [SOCKET] User stopped typing
  { userId: "user_id", teamId: "team_id", userName: "John Doe" }
📢 [SOCKET] Broadcasting typing indicator (stop) to team
  { userId: "user_id", teamId: "team_id", userName: "John Doe" }
```

### 6. **Message Receipts**

```
✉️ [SOCKET] Message delivered receipt
  { userId: "user_id", teamId: "team_id", messageId: "msg_id", userName: "John Doe" }
📢 [SOCKET] Broadcasting delivery receipt to team
  { userId: "user_id", teamId: "team_id", messageId: "msg_id" }

👁️ [SOCKET] Message read receipt
  { userId: "user_id", teamId: "team_id", messageId: "msg_id", userName: "John Doe" }
📢 [SOCKET] Broadcasting read receipt to team
  { userId: "user_id", teamId: "team_id", messageId: "msg_id" }
```

### 7. **Disconnect**

```
🔴 [SOCKET] User disconnected
  { userId: "user_id", socketId: "abc123", userName: "John Doe" }
🔍 [SOCKET] Found team rooms user was in
  { userId: "user_id", userName: "John Doe", roomsCount: 2, rooms: ["team:team1", "team:team2"] }
📢 [SOCKET] Broadcasting offline status to team on disconnect
  { userId: "user_id", teamId: "team1", userName: "John Doe", room: "team:team1" }
📢 [SOCKET] Broadcasting offline status to team on disconnect
  { userId: "user_id", teamId: "team2", userName: "John Doe", room: "team:team2" }
✅ [SOCKET] User disconnect handled successfully
  { userId: "user_id", socketId: "abc123", userName: "John Doe" }
```

### 8. **Team Events (From REST API)**

```
📢 [SOCKET EMIT] Broadcasting team update to all members
  { teamId: "team_id", payload: { teamId: "team_id", name: "New Team Name" } }

📢 [SOCKET EMIT] Broadcasting member added to all team members
  { teamId: "team_id", userId: "new_user_id", userName: "Jane Smith", role: "MEMBER", payload: {...} }

📢 [SOCKET EMIT] Broadcasting member removed to all team members
  { teamId: "team_id", userId: "removed_user_id", userName: "John Doe", payload: {...} }

📢 [SOCKET EMIT] Broadcasting role update to all team members
  { teamId: "team_id", userId: "user_id", userName: "John Doe", newRole: "LEAD", payload: {...} }
```

---

## Error Scenarios

### 1. **Authentication Errors**

#### No Token
```
🔐 [SOCKET AUTH] Authenticating new socket connection
❌ [SOCKET AUTH] No authentication token provided
```

#### Invalid Token
```
🔐 [SOCKET AUTH] Authenticating new socket connection
🔍 [SOCKET AUTH] Token found, verifying...
❌ [SOCKET AUTH] Invalid or malformed token
  { socketId: "abc123", decoded: null }
```

#### User Not Found
```
🔐 [SOCKET AUTH] Authenticating new socket connection
🔍 [SOCKET AUTH] Token found, verifying...
✅ [SOCKET AUTH] Token verified, fetching user from database
❌ [SOCKET AUTH] User not found in database
  { socketId: "abc123", userId: "invalid_user_id" }
```

### 2. **Permission Errors**

#### Not a Team Member (Join)
```
🔵 [SOCKET] User attempting to join team room
❌ [SOCKET] Join failed: Not a team member
  { userId: "user_id", teamId: "team_id", socketId: "abc123" }
```

#### Not Authenticated
```
🔵 [SOCKET] User attempting to send message
❌ [SOCKET] Send message failed: Not authenticated
  { teamId: "team_id", socketId: "abc123" }
```

### 3. **System Errors**

```
💥 [SOCKET] Error sending team message
  { 
    error: {...}, 
    teamId: "team_id", 
    userId: "user_id", 
    userName: "John Doe",
    errorMessage: "Database connection lost" 
  }
```

---

## Debugging Tips

### 1. **Trace a User's Journey**

Search logs by `userId` to see all actions:
```bash
# Find all actions by a specific user
grep "userId.*user_123" logs/app.log

# Or with jq if using JSON logs
cat logs/app.log | jq 'select(.userId == "user_123")'
```

### 2. **Trace a Specific Team**

Search by `teamId`:
```bash
grep "teamId.*team_456" logs/app.log
```

### 3. **Find Connection Issues**

Look for authentication or connection errors:
```bash
grep "❌.*SOCKET" logs/app.log
grep "💥.*SOCKET" logs/app.log
```

### 4. **Track Message Flow**

Follow a message from send to broadcast:
```bash
# Search for specific message ID
grep "messageId.*msg_789" logs/app.log
```

### 5. **Monitor Active Connections**

Watch for connections and disconnections in real-time:
```bash
tail -f logs/app.log | grep -E "(🟢|🔴).*SOCKET"
```

### 6. **Check Broadcast Events**

See all broadcasts to team rooms:
```bash
grep "📢.*SOCKET" logs/app.log
```

---

## Log Levels

| Level | When Used |
|-------|-----------|
| `info` | Normal operations, successful actions |
| `warn` | Authentication failures, permission errors |
| `error` | System errors, exceptions |

---

## Reading the Logs

Each log entry includes:

1. **Timestamp** - When the event occurred
2. **Level** - `INFO`, `WARN`, or `ERROR`
3. **Emoji + Prefix** - Visual indicator of operation type
4. **Message** - Description of what happened
5. **Context Object** - Relevant data (userId, teamId, etc.)

Example:
```
[2026-01-05 14:30:15.123 +0000] INFO (12345): 🔵 [SOCKET] User attempting to send message
    userId: "user_123"
    teamId: "team_456"
    userName: "John Doe"
    messagePreview: "Hello team!"
    attachmentsCount: 0
```

---

## Troubleshooting Common Issues

### Issue: User can't join team room

**Look for:**
- `❌ [SOCKET AUTH]` - Authentication failed
- `❌ [SOCKET] Join failed: Not authenticated` - Not logged in
- `❌ [SOCKET] Join failed: Not a team member` - Not in the team

### Issue: Messages not being received

**Look for:**
- `📢 [SOCKET] Message broadcast to all team members` - Message was sent
- Check if user successfully joined: `✅ [SOCKET] User successfully joined team room`
- Verify user is still connected: No `🔴 [SOCKET] User disconnected`

### Issue: Multiple connections from same user

**Look for:**
- Multiple `🟢 [SOCKET] New client connected` with same `userId`
- This usually means the client didn't properly disconnect before reconnecting

### Issue: Broadcasts not reaching all members

**Look for:**
- `📢 [SOCKET]` logs showing which room the broadcast was sent to
- Check if intended recipients are in that room: `✅ [SOCKET] User successfully joined team room`

---

## Performance Monitoring

Watch for patterns that might indicate issues:

1. **High frequency of disconnects/reconnects** - Client-side connection issues
2. **Authentication failures** - Invalid/expired tokens
3. **Permission errors** - Users trying to access teams they're not in
4. **Slow database operations** - `💾 [SOCKET] Saving message` taking too long

---

## Example: Full Message Send Flow

```
1. 🔵 [SOCKET] User attempting to send message
2. 💾 [SOCKET] Saving message to database
3. ✅ [SOCKET] Message saved to database
4. 📢 [SOCKET] Message broadcast to all team members (including sender)
```

If any step fails, you'll see an error between steps:
```
1. 🔵 [SOCKET] User attempting to send message
2. ❌ [SOCKET] Send message failed: Not a team member
```

---

## Best Practices

1. **Always check authentication first** - Look for `🔐 [SOCKET AUTH]` logs
2. **Trace by userId or teamId** - Find related logs quickly
3. **Look for the 📢 broadcasts** - Verify events are being sent
4. **Check disconnect logs** - Users leaving unexpectedly
5. **Monitor error rates** - High frequency of `❌` or `💥` indicates issues

---

## Quick Reference Commands

```bash
# Watch live socket activity
tail -f logs/app.log | grep SOCKET

# Find errors only
grep -E "(❌|💥).*SOCKET" logs/app.log

# Count connections today
grep "🟢.*New client connected" logs/app.log | grep "$(date +%Y-%m-%d)" | wc -l

# List all users currently in a team
grep "✅.*User successfully joined team room" logs/app.log | grep "team_456" | tail -20

# Find message broadcast issues
grep "📢.*Message broadcast" logs/app.log | tail -50
```
