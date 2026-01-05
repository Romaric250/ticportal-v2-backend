# Socket.io Real-Time Chat - Quick Start Guide

## Server Setup (Already Done ✅)

The Socket.io server is fully configured and running. No additional setup needed!

---

## Client Connection (5 Minutes)

### 1. Install Socket.io Client

```bash
npm install socket.io-client
```

### 2. Create Socket Connection

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token-here' // Get from login
  }
});

socket.on('connect', () => {
  console.log('Connected!', socket.id);
});
```

### 3. Join Team Chat

```typescript
socket.emit('team:join', { teamId: 'your-team-id' });
```

### 4. Send/Receive Messages

```typescript
// Send
socket.emit('team:message:send', {
  teamId: 'your-team-id',
  message: 'Hello team!'
});

// Receive
socket.on('team:message', (data) => {
  console.log(data.userName, ':', data.message);
});
```

---

## React Component (Copy & Paste)

```tsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const TeamChat = ({ teamId, token }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const s = io('http://localhost:3000', { auth: { token } });
    
    s.on('connect', () => {
      s.emit('team:join', { teamId });
    });
    
    s.on('team:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    setSocket(s);
    return () => s.disconnect();
  }, [teamId, token]);

  const send = () => {
    if (!input.trim()) return;
    socket?.emit('team:message:send', { teamId, message: input });
    setInput('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.userName}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && send()}
      />
      <button onClick={send}>Send</button>
    </div>
  );
};
```

---

## All Events Cheat Sheet

### Send Events

```typescript
// Join team room
socket.emit('team:join', { teamId });

// Send message
socket.emit('team:message:send', { teamId, message });

// Typing indicator
socket.emit('team:typing:start', { teamId });
socket.emit('team:typing:stop', { teamId });

// Message receipts
socket.emit('team:message:delivered', { messageId, teamId });
socket.emit('team:message:read', { messageId, teamId });

// Leave room
socket.emit('team:leave', { teamId });
```

### Listen Events

```typescript
// New message
socket.on('team:message', (data) => {
  // { id, teamId, userId, userName, message, attachments, createdAt }
});

// Typing indicator
socket.on('team:typing', (data) => {
  // { teamId, userId, userName, isTyping }
});

// Online status
socket.on('team:member:online', (data) => {
  // { teamId, userId, status: 'online' | 'offline' | 'away' }
});

// Message receipt
socket.on('team:message:receipt', (data) => {
  // { messageId, teamId, userId, status: 'delivered' | 'read' }
});

// Team updates
socket.on('team:updated', (data) => {
  // { teamId, name?, projectTitle?, description? }
});

socket.on('team:member:added', (data) => {
  // { teamId, userId, userName, role }
});

socket.on('team:member:removed', (data) => {
  // { teamId, userId, userName }
});

socket.on('team:member:role:updated', (data) => {
  // { teamId, userId, userName, newRole }
});

// Errors
socket.on('error', (data) => {
  // { message: string }
});
```

---

## Common Patterns

### Typing Indicator with Timeout

```typescript
let typingTimeout;

const handleTyping = () => {
  socket.emit('team:typing:start', { teamId });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('team:typing:stop', { teamId });
  }, 3000);
};

// In input onChange
onChange={(e) => {
  setValue(e.target.value);
  handleTyping();
}}
```

### Auto-send Delivery Receipt

```typescript
socket.on('team:message', (data) => {
  // Display message
  displayMessage(data);
  
  // Auto-send delivery receipt
  socket.emit('team:message:delivered', {
    messageId: data.id,
    teamId: data.teamId
  });
});
```

### Track Online Members

```typescript
const [onlineMembers, setOnlineMembers] = useState(new Set());

socket.on('team:member:online', (data) => {
  setOnlineMembers(prev => {
    const updated = new Set(prev);
    if (data.status === 'online') {
      updated.add(data.userId);
    } else {
      updated.delete(data.userId);
    }
    return updated;
  });
});
```

---

## Testing

### Quick Test in Browser Console

```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => console.log('Connected:', socket.id));
socket.emit('team:join', { teamId: 'your-team-id' });
socket.emit('team:message:send', { 
  teamId: 'your-team-id', 
  message: 'Test message' 
});
socket.on('team:message', console.log);
```

---

## Troubleshooting

### "Authentication token required"
→ Check token is in auth field: `{ auth: { token: '...' } }`

### "Not a team member"
→ Verify you're a member of the team in the database

### Messages not received
→ Make sure you called `socket.emit('team:join', { teamId })`

### Connection refused
→ Check server is running on correct port (3000)

---

## API Endpoints (Still Work!)

The Socket.io implementation works alongside the existing REST API:

```typescript
// REST API for history/pagination
GET  /api/teams/:teamId/chats?page=1&limit=50
POST /api/teams/:teamId/chats

// Socket.io for real-time
socket.emit('team:message:send', { teamId, message })
socket.on('team:message', (data) => { ... })
```

**Best Practice**: Use REST for initial load, Socket.io for real-time updates.

---

## Full Documentation

- **SOCKET_IO_CHAT.md** - Complete guide with examples
- **SOCKET_IMPLEMENTATION_SUMMARY.md** - Technical details
- **TEAM_MODULE_API.md** - REST API endpoints

---

**Ready to Go!** 🚀

The server is running with Socket.io ready. Just connect from your client and start chatting!
