# Team API Reference

Quick reference for all team management endpoints.

**Base URL:** `http://localhost:5000/api/teams`

---

## REST API Endpoints

### 1. Get All Teams
```http
GET /api/teams?page=1&limit=20
```
No auth required. Returns paginated list of all teams.

**Response:**
```json
{
  "success": true,
  "data": [...teams],
  "pagination": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
}
```

---

### 2. Get My Teams
```http
GET /api/teams/my
Authorization: Bearer {token}
```
Returns all teams the authenticated user belongs to.

---

### 3. Get Team by ID
```http
GET /api/teams/:teamId
```
No auth required. Returns detailed team info including members, submissions, mentors.

---

### 4. Create Team
```http
POST /api/teams
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Team Alpha",
  "school": "University of Buea",
  "profileImage": "https://utfs.io/f/abc123.jpg",
  "projectTitle": "AI Chatbot",
  "description": "Optional description"
}
```
Creates a new team. Creator becomes team lead automatically.

**Validation:**
- `name`: 3-100 characters (required)
- `school`: school name (required)
- `profileImage`: valid URL (optional)
- `projectTitle`: max 200 characters (optional)
- `description`: max 1000 characters (optional)

---

### 5. Update Team
```http
PUT /api/teams/:teamId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "profileImage": "https://utfs.io/f/xyz789.jpg",
  "projectTitle": "Updated Title",
  "description": "Updated description"
}
```
Update team details. **Only team leads can update.**

---

### 6. Delete Team
```http
DELETE /api/teams/:teamId
Authorization: Bearer {token}
```
Delete a team. **Only team leads can delete.** Cannot delete teams with submissions.

---

### 7. Add Team Member
```http
POST /api/teams/:teamId/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "role": "MEMBER"
}
```
Add a new member to the team. **Only team leads can add members.**

**Roles:** `MEMBER` or `LEAD`

**Sends email notification to the new member.**

---

### 8. Update Member Role
```http
PUT /api/teams/:teamId/members/:memberId/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "LEAD"
}
```
Update a member's role. **Only team leads can update roles.**

**Sends email notification to the member.**

---

### 9. Remove Team Member
```http
DELETE /api/teams/:teamId/members/:memberId
Authorization: Bearer {token}
```
Remove a member from the team. 

**Permissions:**
- Team leads can remove anyone
- Members can remove themselves

**Sends email notification (except self-removal).**

---

### 10. Get Team Chats
```http
GET /api/teams/:teamId/chats?page=1&limit=50
Authorization: Bearer {token}
```
Get team chat message history. **Only team members can access.**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "chat_id",
      "message": "Hello team!",
      "attachments": ["url1", "url2"],
      "sender": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "profilePhoto": "..."
      },
      "createdAt": "2026-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

### 11. Send Chat Message
```http
POST /api/teams/:teamId/chats
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Hello team!",
  "attachments": ["https://example.com/file.pdf"]
}
```
Send a message to team chat. **Only team members can send.**

**Validation:**
- `message`: 1-2000 characters (required)
- `attachments`: max 5 URLs (optional)

---

## Socket.io Events (Real-time)

**Connect:** `ws://localhost:5000`

**Auth:** Include JWT token in connection
```typescript
const socket = io('http://localhost:5000', {
  auth: { token: yourJwtToken }
});
```

### Client → Server Events

```typescript
// Join team room
socket.emit('team:join', { teamId: 'team_id' });

// Send message
socket.emit('team:message:send', { 
  teamId: 'team_id', 
  message: 'Hello!',
  attachments: ['url1'] // optional
});

// Typing indicators
socket.emit('team:typing:start', { teamId: 'team_id' });
socket.emit('team:typing:stop', { teamId: 'team_id' });

// Message receipts
socket.emit('team:message:delivered', { messageId: 'msg_id', teamId: 'team_id' });
socket.emit('team:message:read', { messageId: 'msg_id', teamId: 'team_id' });

// Leave room
socket.emit('team:leave', { teamId: 'team_id' });
```

### Server → Client Events

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

// Team updated
socket.on('team:updated', (data) => {
  // { teamId, name?, projectTitle?, description? }
});

// Member added
socket.on('team:member:added', (data) => {
  // { teamId, userId, userName, role }
});

// Member removed
socket.on('team:member:removed', (data) => {
  // { teamId, userId, userName }
});

// Role updated
socket.on('team:member:role:updated', (data) => {
  // { teamId, userId, userName, newRole }
});

// Errors
socket.on('error', (data) => {
  // { message: string }
});
```

---

## Quick Examples

### React: Fetch Teams
```tsx
const { data } = await fetch('/api/teams?page=1&limit=20')
  .then(r => r.json());
```

### React: Create Team
```tsx
const team = await fetch('/api/teams', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Team Alpha',
    school: 'University of Buea',
    profileImage: 'https://utfs.io/f/abc123.jpg',
    projectTitle: 'AI Chatbot'
  })
}).then(r => r.json());
```

### React: Real-time Chat Hook
```tsx
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

export const useTeamChat = (teamId: string, token: string) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const s = io('http://localhost:5000', { auth: { token } });
    
    s.on('connect', () => s.emit('team:join', { teamId }));
    s.on('team:message', (msg) => setMessages(prev => [...prev, msg]));
    
    setSocket(s);
    return () => s.disconnect();
  }, [teamId, token]);

  const sendMessage = (message: string) => {
    socket?.emit('team:message:send', { teamId, message });
  };

  return { messages, sendMessage };
};
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP status codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Points System

| Action | Points |
|--------|--------|
| Create Team | +15 |
| Join Team | +10 |
| Update Team | +5 |
| Add Member | +5 |
| Update Role | +3 |

---

**Full Documentation:** See `/docs` folder for detailed guides.
