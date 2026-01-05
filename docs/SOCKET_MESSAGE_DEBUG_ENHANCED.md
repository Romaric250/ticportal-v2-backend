# 🔍 Socket.io Message Broadcast Debugging Guide (ENHANCED)

## 🎯 Quick Diagnosis

### Enhanced Server Logging
The server now logs detailed room membership information:
- **On Join**: Shows all sockets in the room after join
- **On Message Send**: Shows room membership before broadcast
- **Key Info**: Socket IDs, User IDs, Room name, Total members

### Using the Test Client
We've created a comprehensive HTML test client (`test-socket-client.html`) to help debug Socket.io issues.

#### Setup:
1. Open `test-socket-client.html` in your browser (or multiple browsers/tabs)
2. Get a JWT token from the login endpoint
3. Paste the token and click "Connect"
4. Enter a Team ID and click "Join Team"
5. Send messages and watch the event log

#### Key Features:
- ✅ Real-time connection status
- 📨 Live message display
- 📋 Detailed event log with timestamps
- 🔍 Shows all emitted and received events
- 👥 Test with multiple clients (open in multiple tabs)

## 🐛 Common Issues & Solutions

### Issue 1: Messages Not Broadcasting

**Symptoms:**
- Join/online events work
- Messages save to database
- But clients don't receive `team:message` event

**Debug Steps:**

1. **Check Room Membership**
   ```
   Look for this log after join:
   "✅ [SOCKET] User successfully joined team room - Room membership verified"
   
   Verify:
   - totalSocketsInRoom > 0
   - Your socketId is in the socketIds array
   - Your userId is in the userIds array
   ```

2. **Check Message Broadcast**
   ```
   Look for this log after sending:
   "📢 [SOCKET] Message broadcast to all team members"
   
   Verify:
   - expectedRecipients matches totalSocketsInRoom
   - broadcastToRoom matches the room name from join
   - payload contains correct data
   ```

3. **Check Client-Side**
   - Open browser DevTools console
   - Verify `team:message` listener is registered
   - Check for JavaScript errors
   - Confirm client is listening to correct event name

### Issue 2: Room Name Mismatch

**Check:**
- Room name format: `team:${teamId}` (with colon)
- TeamId is consistent between join and send
- No extra spaces or characters

### Issue 3: Socket Not in Room

**Possible Causes:**
- Socket disconnected after join
- Join failed silently
- User is not a team member

**Debug:**
```
1. Join team
2. Check log: "✅ [SOCKET] User successfully joined team room"
3. Verify socketId appears in room membership
4. Send message immediately
5. Check if socketId still in room
```

### Issue 4: Multiple Socket Connections

**Symptoms:**
- User appears multiple times in logs
- Messages received multiple times
- Unexpected socket count

**Solution:**
- Check client code for multiple io() calls
- Ensure old connections are closed
- Use socket.disconnect() before reconnecting

## 🧪 Testing Scenarios

### Scenario 1: Single User
1. Connect with test client
2. Join team
3. Send message
4. Check logs: Should see room with 1 socket
5. Should receive own message (io.to includes sender)

### Scenario 2: Two Users (Minimum for real broadcast test)
1. Open test client in two browser tabs
2. Use different JWT tokens for each
3. Both join same team
4. Check logs: Should see room with 2 sockets
5. Send message from User A
6. Both users should receive the message

### Scenario 3: User Leaves and Rejoins
1. Connect and join team
2. Leave team
3. Rejoin team
4. Send message
5. Should receive message (verify room membership)

## 📊 Expected Log Flow (Normal Operation)

### Joining a Team:
```
🔵 [SOCKET] User attempting to join team room
✅ [SOCKET] User successfully joined team room - Room membership verified
   - socketIds: ['abc123']
   - userIds: ['user-1']
   - totalSocketsInRoom: 1
📢 [SOCKET] Broadcasting online status to team
```

### Sending a Message:
```
🔵 [SOCKET] User attempting to send message
💾 [SOCKET] Saving message to database
✅ [SOCKET] Message saved to database
🔍 [SOCKET] Room membership before message broadcast
   - totalSocketsInRoom: 2
   - socketIds: ['abc123', 'def456']
   - currentSocketId: 'abc123'
📢 [SOCKET] Message broadcast to all team members
   - expectedRecipients: 2
```

## 🔧 Advanced Debugging

### Check Socket.io Adapter
```typescript
// In teamChat.ts, add this debug code:
const adapter = io.of('/').adapter;
console.log('All rooms:', adapter.rooms);
console.log('All sids:', adapter.sids);
```

### Monitor Room Events
```typescript
// Add to initializeSocket in src/socket/index.ts:
io.of('/').adapter.on('create-room', (room) => {
  logger.info({ room }, 'Room created');
});

io.of('/').adapter.on('join-room', (room, id) => {
  logger.info({ room, socketId: id }, 'Socket joined room');
});

io.of('/').adapter.on('leave-room', (room, id) => {
  logger.info({ room, socketId: id }, 'Socket left room');
});
```

### Test with Socket.io Admin UI
```bash
npm install @socket.io/admin-ui

# In server.ts:
import { instrument } from '@socket.io/admin-ui';
instrument(io, { auth: false }); // Set auth: true in production!

# Visit: https://admin.socket.io
```

## 📝 Checklist

When debugging message broadcast issues:

- [ ] Server logs show join successful with room membership
- [ ] Room name format is `team:${teamId}` 
- [ ] Socket ID appears in room member list
- [ ] Multiple clients can join the same room
- [ ] Message is saved to database
- [ ] Broadcast log shows correct expectedRecipients count
- [ ] Client has `team:message` event listener
- [ ] No JavaScript errors in browser console
- [ ] Test client receives the message
- [ ] Production client receives the message

## 🚨 Emergency Diagnosis

If messages still don't broadcast after all checks:

1. **Restart Everything**
   ```bash
   # Stop server (Ctrl+C)
   # Clear dist folder
   rm -rf dist
   # Rebuild
   npm run build
   # Restart
   npm run dev
   ```

2. **Test with Minimal Code**
   ```typescript
   // Temporarily simplify message send:
   socket.on("team:message:send", async ({ teamId, message }) => {
     io.to(`team:${teamId}`).emit("team:message", {
       id: 'test-123',
       message,
       userId: socket.userId,
       teamId,
       createdAt: new Date().toISOString()
     });
   });
   ```

3. **Check Socket.io Version Compatibility**
   ```bash
   # Server
   npm list socket.io
   
   # Client (check in browser console)
   window.io.version
   ```

4. **Enable Socket.io Debug Mode**
   ```bash
   # Windows
   set DEBUG=socket.io:* & npm run dev
   
   # Linux/Mac
   DEBUG=socket.io:* npm run dev
   ```

## 📚 Additional Resources

- [Socket.io Rooms Documentation](https://socket.io/docs/v4/rooms/)
- [Socket.io Emit Cheatsheet](https://socket.io/docs/v4/emit-cheatsheet/)
- [Socket.io Debugging Guide](https://socket.io/docs/v4/troubleshooting-connection-issues/)

---

## 🎓 Understanding the Logs

### Room Membership Log
```json
{
  "teamId": "team-123",
  "roomName": "team:team-123",
  "totalSocketsInRoom": 2,
  "socketIds": ["abc123", "def456"],
  "userIds": ["user-1", "user-2"],
  "currentSocketId": "abc123",
  "currentUserId": "user-1"
}
```

**What it means:**
- 2 sockets are in the room
- Current socket (abc123) is user-1
- Other socket (def456) is user-2
- Broadcast will reach both sockets

### Message Broadcast Log
```json
{
  "userId": "user-1",
  "teamId": "team-123",
  "messageId": "msg-789",
  "payload": { ... },
  "broadcastToRoom": "team:team-123",
  "expectedRecipients": 2
}
```

**What it means:**
- Message sent by user-1
- Broadcast to room "team:team-123"
- Should reach 2 sockets
- If client doesn't receive, issue is client-side

---

**Last Updated:** 2024
**Status:** ✅ Enhanced with room membership debugging and test client
