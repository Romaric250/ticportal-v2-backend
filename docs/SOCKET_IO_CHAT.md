# Socket.io Real-Time Chat - Complete Documentation

## Overview

The TIC Portal now features a fully-functional real-time chat system built with Socket.io. Team members can send messages, see typing indicators, track online status, and receive instant notifications about team updates.

---

## Features

✅ **Real-time Messaging** - Instant message delivery to all team members  
✅ **Typing Indicators** - See when teammates are typing  
✅ **Online Status** - Track who's online, offline, or away  
✅ **Message Receipts** - Delivery and read receipts  
✅ **Team Updates** - Real-time notifications for team changes  
✅ **Authentication** - JWT-based socket authentication  
✅ **Room Management** - Automatic team room joining/leaving  

---

## Architecture

### File Structure

```
src/socket/
├── index.ts              # Socket.io initialization
├── types.ts              # TypeScript type definitions
├── middleware/
│   └── auth.ts          # Authentication middleware
└── events/
    └── teamChat.ts      # Team chat event handlers
```

### Key Components

1. **Socket Authentication** (`middleware/auth.ts`)
   - Verifies JWT tokens from handshake
   - Attaches user info to socket
   - Rejects unauthenticated connections

2. **Event Handlers** (`events/teamChat.ts`)
   - Team room join/leave
   - Message sending
   - Typing indicators
   - Message receipts
   - Disconnect handling

3. **Socket Initialization** (`index.ts`)
   - Registers middleware
   - Sets up event handlers
   - Exports helper functions

---

## Client-Side Integration

### 1. Connection

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token-here'
  }
});

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('error', (error) => {
  console.error('Socket error:', error.message);
});
```

### 2. Join a Team Room

```typescript
socket.emit('team:join', { teamId: 'team-id-here' });

// Listen for members coming online
socket.on('team:member:online', (data) => {
  console.log(`${data.userId} is now ${data.status}`);
  // Update UI to show member's online status
});
```

### 3. Send Messages

```typescript
socket.emit('team:message:send', {
  teamId: 'team-id-here',
  message: 'Hello team!',
  attachments: ['url1', 'url2'] // optional
});

// Listen for incoming messages
socket.on('team:message', (data) => {
  console.log('New message from', data.userName, ':', data.message);
  // Display message in chat UI
  // data: { id, teamId, userId, userName, message, attachments, createdAt }
});
```

### 4. Typing Indicators

```typescript
// Start typing
const handleTyping = () => {
  socket.emit('team:typing:start', { teamId: 'team-id-here' });
};

// Stop typing (after user stops or sends message)
const handleStopTyping = () => {
  socket.emit('team:typing:stop', { teamId: 'team-id-here' });
};

// Listen for typing indicators from others
socket.on('team:typing', (data) => {
  if (data.isTyping) {
    console.log(`${data.userName} is typing...`);
  } else {
    console.log(`${data.userName} stopped typing`);
  }
});
```

### 5. Message Receipts

```typescript
// Send delivery receipt when message is received
socket.on('team:message', (data) => {
  socket.emit('team:message:delivered', {
    messageId: data.id,
    teamId: data.teamId
  });
});

// Send read receipt when message is viewed
const handleMessageRead = (messageId, teamId) => {
  socket.emit('team:message:read', { messageId, teamId });
};

// Listen for receipts from others
socket.on('team:message:receipt', (data) => {
  console.log(`Message ${data.messageId} ${data.status} by ${data.userId}`);
  // Update message status in UI
});
```

### 6. Team Update Notifications

```typescript
// Listen for team updates
socket.on('team:updated', (data) => {
  console.log('Team updated:', data);
  // Update team info in UI
  // data: { teamId, name?, projectTitle?, description? }
});

// Listen for new members
socket.on('team:member:added', (data) => {
  console.log(`${data.userName} joined the team as ${data.role}`);
  // Add member to team member list in UI
});

// Listen for member removals
socket.on('team:member:removed', (data) => {
  console.log(`${data.userName} was removed from the team`);
  // Remove member from UI
});

// Listen for role updates
socket.on('team:member:role:updated', (data) => {
  console.log(`${data.userName}'s role changed to ${data.newRole}`);
  // Update member role in UI
});
```

### 7. Leave Team Room

```typescript
socket.emit('team:leave', { teamId: 'team-id-here' });
```

### 8. Disconnect

```typescript
socket.disconnect();
```

---

## Events Reference

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `team:join` | `{ teamId: string }` | Join a team chat room |
| `team:leave` | `{ teamId: string }` | Leave a team chat room |
| `team:message:send` | `{ teamId, message, attachments? }` | Send a message |
| `team:typing:start` | `{ teamId: string }` | Start typing indicator |
| `team:typing:stop` | `{ teamId: string }` | Stop typing indicator |
| `team:message:delivered` | `{ messageId, teamId }` | Acknowledge message delivery |
| `team:message:read` | `{ messageId, teamId }` | Mark message as read |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `team:message` | `{ id, teamId, userId, userName, message, attachments, createdAt }` | New message received |
| `team:typing` | `{ teamId, userId, userName, isTyping }` | Typing status changed |
| `team:member:online` | `{ teamId, userId, status }` | Member online status changed |
| `team:message:receipt` | `{ messageId, teamId, userId, status }` | Message receipt |
| `team:updated` | `{ teamId, name?, projectTitle?, description? }` | Team details updated |
| `team:member:added` | `{ teamId, userId, userName, role }` | New member added |
| `team:member:removed` | `{ teamId, userId, userName }` | Member removed |
| `team:member:role:updated` | `{ teamId, userId, userName, newRole }` | Member role changed |
| `error` | `{ message: string }` | Error occurred |

---

## React Example

### Complete Chat Component

```typescript
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

export const TeamChat = ({ teamId, authToken }: { teamId: string; authToken: string }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      auth: { token: authToken }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat');
      newSocket.emit('team:join', { teamId });
    });

    newSocket.on('team:message', (data) => {
      setMessages((prev) => [...prev, data]);
      newSocket.emit('team:message:delivered', {
        messageId: data.id,
        teamId: data.teamId
      });
    });

    newSocket.on('team:typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => [...new Set([...prev, data.userName])]);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== data.userName));
      }
    });

    newSocket.on('team:member:online', (data) => {
      setOnlineMembers((prev) => {
        const newSet = new Set(prev);
        if (data.status === 'online') {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('team:leave', { teamId });
      newSocket.disconnect();
    };
  }, [teamId, authToken]);

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('team:typing:start', { teamId });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('team:typing:stop', { teamId });
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    socket.emit('team:message:send', {
      teamId,
      message: inputMessage.trim()
    });

    socket.emit('team:typing:stop', { teamId });
    setInputMessage('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.userName}:</strong> {msg.message}
            <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <div className="online-status">
        {onlineMembers.size} member(s) online
      </div>
    </div>
  );
};
```

---

## Security

### Authentication

- All socket connections require valid JWT tokens
- Tokens verified via `socketAuthMiddleware`
- Invalid tokens result in connection rejection

### Authorization

- Users can only join rooms for teams they belong to
- Message sending requires team membership
- Team membership verified on each action

### Rate Limiting

- Consider implementing rate limiting for:
  - Message sending (prevent spam)
  - Typing indicators (prevent abuse)
  - Room joining/leaving (prevent flooding)

---

## Testing

### Manual Testing

```bash
# Start the server
npm run dev

# Use a tool like Postman or Socket.io client tester
# Connect to: http://localhost:3000
# Auth: { "token": "your-jwt-token" }

# Test sequence:
1. Connect with valid token
2. Emit 'team:join' with teamId
3. Emit 'team:message:send' with message
4. Verify 'team:message' received
5. Test typing indicators
6. Test disconnect behavior
```

### Automated Testing (Coming Soon)

Unit tests for:
- Socket authentication
- Event handlers
- Message validation
- Team membership checks

---

## Performance Considerations

### Scaling

For production with multiple servers:

1. **Redis Adapter** - Use `@socket.io/redis-adapter` for multi-server support
2. **Message Queue** - Integrate with Kafka for message persistence
3. **Load Balancing** - Use sticky sessions or shared state

### Optimization

- Limit message history loaded on join
- Implement message pagination
- Use message throttling
- Compress socket payloads
- Monitor connection count

---

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check server is running
   - Verify correct URL and port
   - Check CORS configuration

2. **Authentication Failed**
   - Verify JWT token is valid
   - Check token expiration
   - Ensure token in auth field

3. **Messages Not Received**
   - Verify user joined team room
   - Check team membership
   - Check console for errors

4. **Typing Indicators Not Working**
   - Verify team membership
   - Check event names match exactly
   - Ensure timeouts are cleared properly

### Debug Mode

Enable detailed logging:

```typescript
const socket = io('http://localhost:3000', {
  auth: { token: authToken },
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.onAny((event, ...args) => {
  console.log(`Event: ${event}`, args);
});
```

---

## Next Steps

### Planned Enhancements

- [ ] File upload for attachments
- [ ] Message reactions (👍, ❤️, etc.)
- [ ] Message threading/replies
- [ ] Voice/video calls
- [ ] Screen sharing
- [ ] Message search
- [ ] Message editing/deletion
- [ ] User mentions (@username)
- [ ] Rich text formatting
- [ ] Code syntax highlighting

### Integration Tasks

- [ ] Add rate limiting middleware
- [ ] Integrate Redis adapter for scaling
- [ ] Add message persistence queue
- [ ] Implement message encryption
- [ ] Add webhook notifications
- [ ] Create admin monitoring dashboard

---

## Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Check logs in `/shared/utils/logger.ts`
4. Test with Socket.io client tools

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: January 5, 2026
