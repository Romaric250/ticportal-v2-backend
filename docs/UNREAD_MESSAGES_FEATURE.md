# Unread Message Tracking Feature

## Overview
Added unread message tracking for team chat to allow users to see which messages they haven't read yet.

## Database Changes

### New Model: `TeamChatRead`
Tracks which messages have been read by which users.

```prisma
model TeamChatRead {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  chatId    String   @db.ObjectId
  userId    String   @db.ObjectId
  readAt    DateTime @default(now())

  chat      TeamChat @relation(fields: [chatId], references: [id], onDelete: Cascade)

  @@unique([chatId, userId])
  @@index([userId, readAt])
}
```

### Updated Model: `TeamChat`
Added relation to `TeamChatRead`:
```prisma
model TeamChat {
  // ...existing fields...
  readBy    TeamChatRead[]
}
```

## API Endpoints

### 1. Get Unread Count for a Team
**GET** `/api/teams/:teamId/chats/unread-count`

Get the number of unread messages for the current user in a specific team.

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

### 2. Get Total Unread Count for User
**GET** `/api/teams/chats/total-unread`

Get the total number of unread messages across ALL teams for the current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUnread": 15
  }
}
```

**Use Case:** Display a badge on your app's navigation/header showing total unread count.

### 3. Get Unread Counts for All Teams
**GET** `/api/teams/chats/unread-counts`

Get unread message counts for all teams the user is a member of (per-team breakdown).

**Response:**
```json
{
  "success": true,
  "data": {
    "team1Id": 5,
    "team2Id": 3,
    "team3Id": 12
  }
}
```

**Use Case:** Display individual badges next to each team in a sidebar.

### 4. Get User's Teams with Unread Counts
**GET** `/api/teams/my`

Get all teams the user is a member of, including unread count for each team.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team1",
      "name": "Team Alpha",
      "school": "MIT",
      "userRole": "LEAD",
      "joinedAt": "2026-01-01T00:00:00Z",
      "unreadCount": 5,
      "_count": {
        "members": 4,
        "chats": 120
      }
    },
    {
      "id": "team2",
      "name": "Team Beta",
      "school": "Stanford",
      "userRole": "MEMBER",
      "joinedAt": "2026-01-02T00:00:00Z",
      "unreadCount": 0,
      "_count": {
        "members": 3,
        "chats": 45
      }
    }
  ]
}
```

**Use Case:** One call to get all team info + unread counts.

### 5. Mark Messages as Read
**POST** `/api/teams/:teamId/chats/mark-read`

Mark specific messages or all unread messages as read for the current user.

### 5. Mark Messages as Read
**POST** `/api/teams/:teamId/chats/mark-read`

Mark specific messages or all unread messages as read for the current user.

**Request Body:**
```json
{
  "messageIds": ["msg1", "msg2"]  // Optional - if not provided, marks all as read
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "markedCount": 2
  }
}
```

## Usage Examples

### Frontend Implementation

```typescript
// Get total unread count for user (for app header badge)
const getTotalUnreadCount = async () => {
  const response = await fetch('/api/teams/chats/total-unread', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data.totalUnread;  // Returns number like 15
};

// Get unread count for a specific team
const getUnreadCount = async (teamId: string) => {
  const response = await fetch(`/api/teams/${teamId}/chats/unread-count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
```typescript
// Get total unread count for user (for app header badge)
const getTotalUnreadCount = async () => {
  const response = await fetch('/api/teams/chats/total-unread', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data.totalUnread;  // Returns number like 15
};

// Get unread count for a specific team
const getUnreadCount = async (teamId: string) => {
  const response = await fetch(`/api/teams/${teamId}/chats/unread-count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data.unreadCount;
};

// Get user's teams with unread counts included
const getUserTeamsWithUnread = async () => {
  const response = await fetch('/api/teams/my', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data;  // Array of teams with unreadCount property
};

// Mark all messages as read when user opens chat
const markAllAsRead = async (teamId: string) => {
  await fetch(`/api/teams/${teamId}/chats/mark-read`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})  // Empty body marks all as read
  });
};

// Mark specific messages as read
const markMessagesAsRead = async (teamId: string, messageIds: string[]) => {
  await fetch(`/api/teams/${teamId}/chats/mark-read`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messageIds })
  });
};

// Get unread counts for sidebar/navigation
const getAllUnreadCounts = async () => {
  const response = await fetch('/api/teams/chats/unread-counts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.data;  // { teamId: count, ... }
};
```

### Display Unread Badge

```tsx
// In your app header/navigation (total unread for all teams)
const AppHeader = () => {
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const fetchTotalUnread = async () => {
      const count = await getTotalUnreadCount();
      setTotalUnread(count);
    };
    fetchTotalUnread();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTotalUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header>
      <nav>
        <Link to="/teams">
          Teams
          {totalUnread > 0 && (
            <span className="badge">{totalUnread}</span>
          )}
        </Link>
      </nav>
    </header>
  );
};

// In your team list component (per-team unread counts)
const TeamList = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsData = await getUserTeamsWithUnread();
      setTeams(teamsData);
    };
    fetchTeams();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTeams, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {teams.map(team => (
        <div key={team.id}>
          <span>{team.name}</span>
          {team.unreadCount > 0 && (
            <span className="badge">{team.unreadCount}</span>
          )}
        </div>
      ))}
    </div>
  );
};
```

### Mark as Read on Chat View

```tsx
// When user opens chat
useEffect(() => {
  if (chatIsOpen) {
    markAllAsRead(teamId);
  }
}, [chatIsOpen, teamId]);

// Or mark as read when messages are visible
useEffect(() => {
  const visibleMessageIds = getVisibleMessageIds();
  if (visibleMessageIds.length > 0) {
    markMessagesAsRead(teamId, visibleMessageIds);
  }
}, [visibleMessages]);
```

## Features

### Automatic Tracking
- Messages are **not** marked as unread for the sender (own messages don't count)
- Each user tracks their own read status independently
- Read status is recorded with timestamp for future analytics

### Performance Optimizations
- **Indexes** on `userId` and `readAt` for fast queries
- **Unique constraint** on `[chatId, userId]` prevents duplicates
- **Cascade delete** when messages are deleted

### Smart Counting
- Only counts messages from other users (not your own messages)
- Efficiently fetches unread counts for multiple teams at once
- Skips creating read records for messages you sent

## Migration Steps

1. **Update Prisma Schema**
   ```bash
   # Schema already updated
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Create Migration**
   ```bash
   npx prisma migrate dev --name add_team_chat_read_tracking
   ```

4. **Deploy to Production**
   ```bash
   npx prisma migrate deploy
   ```

## Best Practices

### When to Mark as Read
- **Immediately**: When user opens the chat view
- **On Scroll**: When message comes into viewport
- **On Focus**: When chat window receives focus
- **Batch**: Mark multiple messages at once to reduce API calls

### Polling vs Real-time
For unread counts in sidebar/navigation:
- **Polling**: Fetch every 30-60 seconds (simple, works well for most apps)
- **Socket.io**: Emit unread count updates in real-time (better UX, more complex)

### Example with Socket.io
```typescript
// Server-side (when new message is sent)
socket.to(`team:${teamId}`).emit('team:new-message', {
  message: chatMessage,
  unreadCounts: await getUpdatedUnreadCounts(teamId)
});

// Client-side
socket.on('team:new-message', (data) => {
  // Update messages
  setMessages(prev => [...prev, data.message]);
  
  // Update unread count if chat is not currently open
  if (!isChatOpen) {
    updateUnreadCount(teamId);
  }
});
```

## Testing

```bash
# Get total unread count for user (across all teams)
curl "http://localhost:3000/api/teams/chats/total-unread" \
  -H "Authorization: Bearer YOUR_JWT"

# Get unread count for a specific team
curl "http://localhost:3000/api/teams/TEAM_ID/chats/unread-count" \
  -H "Authorization: Bearer YOUR_JWT"

# Get user's teams with unread counts
curl "http://localhost:3000/api/teams/my" \
  -H "Authorization: Bearer YOUR_JWT"

# Get unread counts per team (alternative method)
curl "http://localhost:3000/api/teams/chats/unread-counts" \
  -H "Authorization: Bearer YOUR_JWT"

# Mark all messages as read in a team
curl -X POST "http://localhost:3000/api/teams/TEAM_ID/chats/mark-read" \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{}'

# Mark specific messages as read
curl -X POST "http://localhost:3000/api/teams/TEAM_ID/chats/mark-read" \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"messageIds": ["msg1", "msg2"]}'
```

## Files Modified
- `prisma/schema.prisma` - Added `TeamChatRead` model and relation
- `src/modules/teams/types.ts` - Added `MarkMessagesAsReadSchema`
- `src/modules/teams/service.ts` - Added unread tracking methods
- `src/modules/teams/controller.ts` - Added unread tracking endpoints
- `src/modules/teams/routes.ts` - Added unread tracking routes

## Status
✅ Schema updated
✅ Service methods implemented
✅ Controller methods implemented
✅ Routes added
⏳ Migration needs to be run
⏳ Frontend integration needed
