# Team Module API Documentation

Complete team management system with collaboration features, activity tracking, and email notifications.

---

## Features

✅ Full CRUD operations for teams
✅ Team member management (add, remove, update roles)
✅ Team chat system
✅ Activity tracking with points
✅ Professional email notifications
✅ Role-based permissions
✅ Pagination support

---

## Endpoints

### 1. Get All Teams
```http
GET /api/teams?page=1&limit=20
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team_id",
      "name": "Team Alpha",
      "projectTitle": "AI Chatbot",
      "description": "Building an AI-powered chatbot",
      "squad": {
        "id": "squad_id",
        "name": "Squad Alpha",
        "schoolName": "University of Buea"
      },
      "members": [...],
      "_count": {
        "members": 4,
        "chats": 25,
        "submissions": 2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### 2. Get User's Teams
```http
GET /api/teams/my
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "team_id",
      "name": "Team Alpha",
      "userRole": "LEAD",
      "joinedAt": "2026-01-01T00:00:00.000Z",
      ...
    }
  ]
}
```

---

### 3. Get Team by ID
```http
GET /api/teams/:teamId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team_id",
    "name": "Team Alpha",
    "projectTitle": "AI Chatbot",
    "description": "...",
    "squad": {...},
    "members": [
      {
        "id": "member_id",
        "role": "LEAD",
        "user": {
          "id": "user_id",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "profilePhoto": "...",
          "bio": "..."
        },
        "joinedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "submissions": [...],
    "mentorAssignments": [...]
  }
}
```

---

### 4. Create Team
```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Team Alpha",
  "squadId": "squad_id",
  "projectTitle": "AI Chatbot",
  "description": "Building an AI-powered chatbot for education"
}
```

**Requirements:**
- User must be a member of the squad
- Team name: 3-100 characters
- Creator automatically becomes team lead

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "team_id",
    "name": "Team Alpha",
    ...
  }
}
```

**Activity Tracked:** `TEAM_CREATED` (+15 points)

---

### 5. Update Team
```http
PUT /api/teams/:teamId
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Team Alpha Updated",
  "projectTitle": "Advanced AI Chatbot",
  "description": "Updated description"
}
```

**Permissions:** Only team leads can update

**Activity Tracked:** `TEAM_UPDATED` (+5 points)

---

### 6. Delete Team
```http
DELETE /api/teams/:teamId
Authorization: Bearer <token>
```

**Permissions:** 
- Only team leads can delete
- Cannot delete teams with submissions

**Activity Tracked:** `TEAM_DELETED` (no points)

---

### 7. Add Team Member
```http
POST /api/teams/:teamId/members
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user_id",
  "role": "MEMBER"
}
```

**Roles:** `MEMBER` | `LEAD`

**Permissions:** Only team leads can add members

**Validations:**
- User must be in the same squad
- User cannot already be a team member

**Email Sent:** Team invitation email to new member

**Activity Tracked:** 
- `TEAM_MEMBER_ADDED` for inviter (+5 points)
- `TEAM_JOINED` for new member (+10 points)

---

### 8. Update Team Member Role
```http
PUT /api/teams/:teamId/members/:memberId/role
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "role": "LEAD"
}
```

**Permissions:** Only team leads can update roles

**Validations:**
- Cannot demote the only team lead

**Email Sent:** Role update notification

**Activity Tracked:** `TEAM_MEMBER_ROLE_UPDATED` (+3 points)

---

### 9. Remove Team Member
```http
DELETE /api/teams/:teamId/members/:memberId
Authorization: Bearer <token>
```

**Permissions:** 
- Team leads can remove any member
- Members can remove themselves

**Validations:**
- Cannot remove the only team lead

**Email Sent:** Removal notification (if not self-removal)

**Activity Tracked:**
- `TEAM_MEMBER_REMOVED` or `TEAM_LEFT`
- `REMOVED_FROM_TEAM` for removed member

---

### 10. Get Team Chats
```http
GET /api/teams/:teamId/chats?page=1&limit=50
Authorization: Bearer <token>
```

**Permissions:** Only team members can view chats

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

### 11. Send Team Chat Message
```http
POST /api/teams/:teamId/chats
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Hello team! Let's discuss our project.",
  "attachments": ["https://example.com/file1.pdf"]
}
```

**Validations:**
- Message: 1-2000 characters
- Max 5 attachments

**Permissions:** Only team members can send messages

**Activity Tracked:** `TEAM_MESSAGE_SENT` (no points to prevent spam)

---

## Role Permissions

### Team Lead
- ✅ Update team details
- ✅ Delete team
- ✅ Add members
- ✅ Remove members
- ✅ Update member roles
- ✅ Send messages
- ✅ View chats

### Team Member
- ✅ Send messages
- ✅ View chats
- ✅ Leave team (remove self)
- ❌ Update team details
- ❌ Add/remove other members
- ❌ Update roles

---

## Points System

| Activity | Points | Type |
|----------|--------|------|
| Create Team | +15 | One-time |
| Join Team | +10 | One-time per team |
| Update Team | +5 | Repeatable |
| Add Member | +5 | Repeatable |
| Update Role | +3 | Repeatable |
| Send Message | 0 | No points (spam prevention) |

---

## Email Notifications

All emails use professional styling with:
- TIC Portal branding
- Dark (#111827) and White (#FFFFFF) color scheme
- Clean, minimal design
- Responsive layout

### Team Invitation Email
Sent when a user is added to a team.

### Role Update Email
Sent when a member's role changes.

### Team Removal Email
Sent when a member is removed (not for self-removal).

---

## Error Handling

### 400 Bad Request
```json
{
  "success": false,
  "message": "Team name must be at least 3 characters"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only team leads can update team details"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Team not found"
}
```

---

## Frontend Integration

### React Example: Create Team

```tsx
const createTeam = async (data: CreateTeamInput) => {
  const response = await fetch('/api/teams', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
};
```

### React Example: Team Chat (with Real-time)

```tsx
import { useState, useEffect } from 'react';

function TeamChat({ teamId }: { teamId: string }) {
  const [messages, setMessages] = useState([]);
  
  const sendMessage = async (message: string) => {
    const response = await fetch(`/api/teams/${teamId}/chats`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    setMessages(prev => [...prev, data.data]);
  };
  
  return (
    <div>
      {/* Chat UI */}
    </div>
  );
}
```

---

## Testing

### Test Team Creation

```bash
# Create team
curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Alpha",
    "squadId": "SQUAD_ID",
    "projectTitle": "AI Chatbot",
    "description": "Building an AI-powered chatbot"
  }'
```

### Test Adding Member

```bash
# Add member
curl -X POST http://localhost:5000/api/teams/TEAM_ID/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type": application/json" \
  -d '{
    "userId": "USER_ID",
    "role": "MEMBER"
  }'
```

---

## Related Files

- `src/modules/teams/service.ts` - Business logic
- `src/modules/teams/controller.ts` - Request handling
- `src/modules/teams/routes.ts` - API routes
- `src/modules/teams/types.ts` - TypeScript types & validation
- `src/shared/utils/email.ts` - Email templates
- `src/shared/constants/points.ts` - Points configuration
- `src/shared/services/activity.ts` - Activity tracking

---

## Next Steps

- 🔲 Add real-time chat with Socket.io
- 🔲 Add file upload for chat attachments
- 🔲 Add team analytics dashboard
- 🔲 Add team achievements/badges
- 🔲 Add team leaderboard
- 🔲 Add team activity feed
