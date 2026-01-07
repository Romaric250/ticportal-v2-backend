# Quick Reference: Unread Messages API

## All User-Specific Endpoints

### 1. Total Unread Count (All Teams)
**`GET /api/teams/chats/total-unread`**

Returns the total number of unread messages across ALL teams for the current user.

**Perfect for:** App header/navigation badge showing total unread.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUnread": 15
  }
}
```

---

### 2. User's Teams with Unread Counts
**`GET /api/teams/my`**

Returns all teams the user is a member of, each with its unread count included.

**Perfect for:** Team list/sidebar with individual badges.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team1",
      "name": "Team Alpha",
      "unreadCount": 5,
      ...
    }
  ]
}
```

---

### 3. Unread Count for Specific Team
**`GET /api/teams/:teamId/chats/unread-count`**

Returns unread count for a single team.

**Perfect for:** Checking unread count before/after opening a chat.

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

### 4. Unread Counts Per Team (Dictionary)
**`GET /api/teams/chats/unread-counts`**

Returns a dictionary of teamId → unread count (only teams with unread messages).

**Perfect for:** Updating multiple badges at once.

**Response:**
```json
{
  "success": true,
  "data": {
    "team1Id": 5,
    "team2Id": 3
  }
}
```

---

### 5. Mark Messages as Read
**`POST /api/teams/:teamId/chats/mark-read`**

Marks messages as read for the current user.

**Body (optional):**
```json
{
  "messageIds": ["msg1", "msg2"]  // If empty/omitted, marks ALL as read
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

---

## Quick Implementation Guide

### Scenario 1: App Header Badge
Show total unread count across all teams.

```typescript
// Fetch once on mount + refresh every 30s
const [totalUnread, setTotalUnread] = useState(0);

useEffect(() => {
  const fetch = async () => {
    const res = await fetch('/api/teams/chats/total-unread', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setTotalUnread(data.data.totalUnread);
  };
  
  fetch();
  const interval = setInterval(fetch, 30000);
  return () => clearInterval(interval);
}, []);

// Display
{totalUnread > 0 && <Badge>{totalUnread}</Badge>}
```

---

### Scenario 2: Team List with Individual Badges
Show unread count next to each team.

```typescript
// Fetch teams with unread counts included
const [teams, setTeams] = useState([]);

useEffect(() => {
  const fetch = async () => {
    const res = await fetch('/api/teams/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setTeams(data.data);
  };
  
  fetch();
  const interval = setInterval(fetch, 30000);
  return () => clearInterval(interval);
}, []);

// Display
{teams.map(team => (
  <div key={team.id}>
    {team.name}
    {team.unreadCount > 0 && <Badge>{team.unreadCount}</Badge>}
  </div>
))}
```

---

### Scenario 3: Mark as Read When Opening Chat
Automatically mark all messages as read when user opens a team chat.

```typescript
useEffect(() => {
  if (chatIsOpen) {
    fetch(`/api/teams/${teamId}/chats/mark-read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // Empty body = mark all as read
    });
  }
}, [chatIsOpen, teamId]);
```

---

## Key Features

✅ **Per-User Tracking** - Each user has independent read status  
✅ **Your Messages Don't Count** - Own messages are not counted as unread  
✅ **Efficient Queries** - Optimized with database indexes  
✅ **Flexible** - Mark all or specific messages as read  
✅ **Complete** - Get total count, per-team counts, or individual team count  

---

## Common Patterns

### Pattern 1: Navigation Badge (Total)
```
Teams (15) ← Shows total unread across all teams
```
Use: `GET /api/teams/chats/total-unread`

### Pattern 2: Sidebar with Individual Badges
```
📁 Team Alpha (5)
📁 Team Beta (3)
📁 Team Gamma
```
Use: `GET /api/teams/my`

### Pattern 3: Real-time Updates via Socket.io
```typescript
socket.on('team:new-message', async () => {
  // Refresh unread count
  const count = await getTotalUnreadCount();
  setTotalUnread(count);
});
```

---

## Migration Required

Before using these endpoints, run:

```bash
npx prisma migrate dev --name add_team_chat_read_tracking
```

This creates the `TeamChatRead` table that tracks read status.
