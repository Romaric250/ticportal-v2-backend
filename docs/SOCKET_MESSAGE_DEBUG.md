# Socket.io Message Debugging Guide

## Issue: Messages Not Being Broadcast

If you see users joining teams successfully but messages aren't being broadcast, follow these debugging steps:

---

## Step 1: Verify Client is Sending the Correct Event

Make sure your client is emitting the event with the correct name and data structure:

### ✅ Correct:
```javascript
socket.emit('team:message:send', { 
  teamId: 'your_team_id',
  message: 'Hello team!',
  attachments: [] // optional
});
```

### ❌ Common Mistakes:
```javascript
// Wrong event name
socket.emit('message:send', { ... });
socket.emit('team:message', { ... });
socket.emit('sendMessage', { ... });

// Missing required fields
socket.emit('team:message:send', { 
  message: 'Hello!' 
  // Missing teamId!
});

// Wrong data structure
socket.emit('team:message:send', 'Hello!'); // Should be an object
```

---

## Step 2: Check What Logs You See

### Scenario A: No Logs at All
**Problem:** Client isn't sending the event or using wrong event name.

**Solution:** 
1. Check browser console for socket connection: `socket.connected` should be `true`
2. Verify you're emitting 'team:message:send' (not 'message:send' or other variants)
3. Check for client-side errors

### Scenario B: See "🔵 User attempting to send message"
**Problem:** Message is received but failing at validation or database save.

**Look for:**
- `❌ [SOCKET] Send message failed: Not authenticated`
- `❌ [SOCKET] Send message failed: Not a team member`
- `💥 [SOCKET] Error sending team message`

### Scenario C: See "💾 Saving message to database" but no "📢 Message broadcast"
**Problem:** Database save is failing.

**Look for:**
- `💥 [SOCKET] Error sending team message` with error details
- Database connection issues
- Prisma errors

### Scenario D: See "📢 Message broadcast" but client not receiving
**Problem:** Client not listening or wrong event name.

**Solution:**
```javascript
// Make sure you're listening for the correct event
socket.on('team:message', (data) => {
  console.log('Received message:', data);
});

// NOT:
socket.on('message', ...);
socket.on('team:message:send', ...); // This is for SENDING
socket.on('newMessage', ...);
```

---

## Step 3: Test Socket Connection

### In Browser Console:

```javascript
// 1. Check if connected
console.log('Connected:', socket.connected);

// 2. Check socket ID
console.log('Socket ID:', socket.id);

// 3. Try sending a test message
socket.emit('team:message:send', { 
  teamId: 'YOUR_TEAM_ID_HERE',
  message: 'Test message from console',
  attachments: []
});

// 4. Listen for ANY events from server
socket.onAny((eventName, ...args) => {
  console.log('Received event:', eventName, args);
});

// 5. Check for errors
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// 6. Check if you're in the team room
socket.on('team:member:online', (data) => {
  console.log('Member online event:', data);
});
```

---

## Step 4: Verify You Joined the Team Room

Messages are only sent to users who have joined the team room with `team:join`.

### Check logs for:
```
✅ [SOCKET] User successfully joined team room
  teamId: "your_team_id"
```

### In client:
```javascript
// Make sure you join AFTER connecting
socket.on('connect', () => {
  console.log('Connected, joining team...');
  socket.emit('team:join', { teamId: 'YOUR_TEAM_ID' });
});

// Verify join was successful
socket.on('team:member:online', (data) => {
  if (data.userId === yourUserId) {
    console.log('Successfully joined team room!');
  }
});
```

---

## Step 5: Common Issues

### Issue 1: Multiple Socket Connections
**Symptom:** User joins multiple times, messages go to wrong socket

**Solution:**
```javascript
// Use useEffect cleanup in React
useEffect(() => {
  const socket = io('http://localhost:5000', { auth: { token } });
  
  // ... setup listeners ...
  
  return () => {
    socket.disconnect(); // IMPORTANT: Cleanup
  };
}, [teamId, token]); // Only recreate when these change
```

### Issue 2: Not Authenticated
**Symptom:** See "❌ Not authenticated" in logs

**Solution:**
```javascript
// Make sure token is passed correctly
const socket = io('http://localhost:5000', {
  auth: { token: yourJwtToken } // NOT query: { token }
});
```

### Issue 3: teamId Mismatch
**Symptom:** User joins team A but sends message to team B

**Solution:**
```javascript
// Use the SAME teamId for join and send
const teamId = 'abc123';

socket.emit('team:join', { teamId }); // ✅
socket.emit('team:message:send', { teamId, message: 'Hello' }); // ✅

// NOT:
socket.emit('team:join', { teamId: 'abc123' });
socket.emit('team:message:send', { teamId: 'xyz789', message: 'Hello' }); // ❌
```

### Issue 4: Message Format Wrong
**Symptom:** No logs or error about message format

**Solution:**
```javascript
// Correct format
socket.emit('team:message:send', { 
  teamId: 'abc123',
  message: 'Hello',
  attachments: ['url1', 'url2'] // Array of strings
});

// NOT:
socket.emit('team:message:send', { 
  teamId: 'abc123',
  message: 'Hello',
  attachments: 'url1' // Should be array
});
```

---

## Step 6: Enable Debug Mode

### Client-side:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token },
  transports: ['websocket'], // Force websocket
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Log all events
socket.onAny((event, ...args) => {
  console.log(`[Socket Event] ${event}:`, args);
});

// Log connection issues
socket.on('connect_error', (error) => {
  console.error('[Socket] Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket] Disconnected:', reason);
});
```

---

## Step 7: Test with Minimal Client

Create a test HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Socket Test</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>Socket.io Test</h1>
  <div id="status"></div>
  <input id="teamId" placeholder="Team ID" value="YOUR_TEAM_ID" />
  <input id="message" placeholder="Message" value="Test message" />
  <button onclick="join()">Join Team</button>
  <button onclick="sendMessage()">Send Message</button>
  <div id="messages"></div>

  <script>
    const token = 'YOUR_JWT_TOKEN';
    const socket = io('http://localhost:5000', { auth: { token } });

    socket.on('connect', () => {
      document.getElementById('status').innerText = 'Connected: ' + socket.id;
      console.log('Connected:', socket.id);
    });

    socket.on('team:message', (data) => {
      console.log('Received message:', data);
      const div = document.createElement('div');
      div.innerText = `${data.userName}: ${data.message}`;
      document.getElementById('messages').appendChild(div);
    });

    socket.on('error', (error) => {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    });

    function join() {
      const teamId = document.getElementById('teamId').value;
      console.log('Joining team:', teamId);
      socket.emit('team:join', { teamId });
    }

    function sendMessage() {
      const teamId = document.getElementById('teamId').value;
      const message = document.getElementById('message').value;
      console.log('Sending message:', { teamId, message });
      socket.emit('team:message:send', { teamId, message, attachments: [] });
    }

    // Log all events
    socket.onAny((event, ...args) => {
      console.log(`Event: ${event}`, args);
    });
  </script>
</body>
</html>
```

---

## Expected Log Flow for Successful Message

```
🔵 [SOCKET] User attempting to send message
  { userId: "...", teamId: "...", userName: "...", messagePreview: "Hello!", attachmentsCount: 0 }

💾 [SOCKET] Saving message to database
  { userId: "...", teamId: "...", userName: "..." }

✅ [SOCKET] Message saved to database
  { userId: "...", teamId: "...", messageId: "...", userName: "..." }

📢 [SOCKET] Message broadcast to all team members (including sender)
  { userId: "...", teamId: "...", messageId: "...", userName: "...", payload: {...} }
```

---

## Quick Checklist

- [ ] Socket is connected (`socket.connected === true`)
- [ ] User authenticated (see `🟢 [SOCKET] New client connected`)
- [ ] User joined team room (see `✅ [SOCKET] User successfully joined team room`)
- [ ] Emitting correct event name: `team:message:send`
- [ ] Sending correct data structure: `{ teamId, message, attachments? }`
- [ ] Listening for correct event: `team:message`
- [ ] Same teamId used for join and send
- [ ] No errors in server logs
- [ ] No errors in browser console

---

## Still Not Working?

### Check these:

1. **Server logs:** Are you seeing the "🔵 User attempting to send message" log?
   - NO → Client not sending event or wrong event name
   - YES → Continue to next check

2. **Server logs:** Do you see "💾 Saving message to database"?
   - NO → Authentication or permission failure (check for ❌ logs)
   - YES → Continue to next check

3. **Server logs:** Do you see "📢 Message broadcast"?
   - NO → Database save failed (check for 💥 error logs)
   - YES → Server is working, client not receiving

4. **Client receiving?** Check browser console:
   - Are you listening for `team:message` event?
   - Try using `socket.onAny()` to see ALL events
   - Check network tab for websocket frames

---

## Need More Help?

Share these details:
1. Complete server logs from when you send a message
2. Browser console logs (including any errors)
3. The exact code you're using to send the message
4. The exact code you're using to listen for messages
