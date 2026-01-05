# Team Search & Join Request System

## Overview
Added comprehensive team search and join request functionality with email notifications.

## New Features

### 1. Team Search
**Endpoint:** `GET /api/teams/search?q={query}&page=1&limit=20`

Search teams by:
- Team name
- School
- Project title
- Description

**Example:**
```http
GET /api/teams/search?q=AI&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...teams],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

### 2. Request to Join Team
**Endpoint:** `POST /api/teams/:teamId/join-request`  
**Auth:** Required

Send a request to join a team with an optional message.

**Request Body:**
```json
{
  "message": "I'd love to join your team! I have experience with React and Node.js."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Join request sent successfully",
  "data": {
    "id": "request_id",
    "teamId": "team_id",
    "userId": "user_id",
    "message": "...",
    "status": "PENDING",
    "createdAt": "2026-01-05T..."
  }
}
```

**Features:**
- Prevents duplicate requests
- Prevents requests if already a team member
- Sends email notification to all team leads
- Tracks activity

---

### 3. View Team Join Requests (Team Leads Only)
**Endpoint:** `GET /api/teams/:teamId/join-requests`  
**Auth:** Required (Team Lead)

Get all pending join requests for your team.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "request_id",
      "teamId": "team_id",
      "userId": "user_id",
      "message": "...",
      "status": "PENDING",
      "createdAt": "2026-01-05T...",
      "user": {
        "id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "profilePhoto": "...",
        "school": "University of Buea"
      }
    }
  ]
}
```

---

### 4. Handle Join Request (Accept/Reject)
**Endpoint:** `POST /api/teams/:teamId/join-requests/:requestId`  
**Auth:** Required (Team Lead)

Accept or reject a pending join request.

**Request Body (Accept):**
```json
{
  "action": "accept",
  "message": "Welcome to the team! Let's build something amazing together."
}
```

**Request Body (Reject):**
```json
{
  "action": "reject",
  "message": "Thanks for your interest. The team is currently full."
}
```

**Features:**
- **Accept:** Adds user as team member with MEMBER role
- **Reject:** Updates request status to REJECTED
- Sends email notification with optional custom message
- Tracks activity
- Only team leads can handle requests
- Prevents handling already-processed requests

---

### 5. View My Join Requests
**Endpoint:** `GET /api/teams/join-requests/my`  
**Auth:** Required

View all your own join requests across all teams.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "request_id",
      "teamId": "team_id",
      "userId": "user_id",
      "message": "...",
      "status": "PENDING",
      "createdAt": "2026-01-05T...",
      "team": {
        "id": "team_id",
        "name": "Team Alpha",
        "school": "University of Buea",
        "profileImage": "...",
        "projectTitle": "AI Chatbot"
      }
    }
  ]
}
```

---

## Database Schema

### TeamJoinRequest Model
```prisma
model TeamJoinRequest {
  id        String                 @id @default(auto()) @map("_id") @db.ObjectId
  teamId    String                 @db.ObjectId
  userId    String                 @db.ObjectId
  message   String?
  status    TeamJoinRequestStatus  @default(PENDING)
  createdAt DateTime               @default(now())
  updatedAt DateTime               @updatedAt

  team Team @relation(fields: [teamId], references: [id])
  user User @relation("UserTeamJoinRequests", fields: [userId], references: [id])

  @@unique([teamId, userId])
}

enum TeamJoinRequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

**Key Features:**
- Composite unique constraint on `[teamId, userId]` prevents duplicate requests
- `status` field tracks request state
- `message` allows optional personal message from requester
- Auto-updating `updatedAt` field

---

## Email Notifications

### 1. Join Request Sent (to Team Leads)
```typescript
sendTeamJoinRequestEmail(
  email: string,
  firstName: string,
  teamName: string,
  requesterName: string,
  message?: string
)
```

**Sent when:** User requests to join a team  
**Recipients:** All team leads  
**Content:** Requester name, optional message, link to review requests

---

### 2. Join Request Accepted (to Requester)
```typescript
sendJoinRequestAcceptedEmail(
  email: string,
  firstName: string,
  teamName: string,
  message?: string
)
```

**Sent when:** Team lead accepts a join request  
**Recipients:** The requester  
**Content:** Welcome message, optional message from team lead, link to team page

---

### 3. Join Request Rejected (to Requester)
```typescript
sendJoinRequestRejectedEmail(
  email: string,
  firstName: string,
  teamName: string,
  message?: string
)
```

**Sent when:** Team lead rejects a join request  
**Recipients:** The requester  
**Content:** Polite rejection, optional message from team lead, link to browse other teams

---

## Security & Validation

### Validations:
- **Search query:** Required, minimum 1 character
- **Join request message:** Optional, max 500 characters
- **Handle request action:** Must be "accept" or "reject"
- **Handle request message:** Optional, max 500 characters

### Security Checks:
- ✅ Must be authenticated to request to join
- ✅ Cannot join if already a member
- ✅ Cannot send duplicate join requests
- ✅ Only team leads can view team's join requests
- ✅ Only team leads can accept/reject requests
- ✅ Cannot handle requests for other teams
- ✅ Cannot handle already-processed requests

---

## Activity Tracking

All actions are tracked in the activity log:
- `TEAM_JOIN_REQUESTED` - User sends join request
- `TEAM_JOIN_REQUEST_ACCEPTED` - Team lead accepts request
- `TEAM_JOIN_ACCEPTED` - User's request is accepted
- `TEAM_JOIN_REQUEST_REJECTED` - Team lead rejects request

---

## API Routes Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/teams/search?q={query}` | No | Search teams |
| GET | `/api/teams/join-requests/my` | Yes | Get user's own requests |
| POST | `/api/teams/:teamId/join-request` | Yes | Request to join team |
| GET | `/api/teams/:teamId/join-requests` | Yes (Lead) | Get team's pending requests |
| POST | `/api/teams/:teamId/join-requests/:requestId` | Yes (Lead) | Accept/reject request |

---

## Example Workflows

### Workflow 1: User Joins Team

1. **User searches for teams:**
   ```http
   GET /api/teams/search?q=AI Project
   ```

2. **User sends join request:**
   ```http
   POST /api/teams/team123/join-request
   Body: { "message": "I'd love to help!" }
   ```
   - Email sent to team leads

3. **Team lead reviews requests:**
   ```http
   GET /api/teams/team123/join-requests
   ```

4. **Team lead accepts request:**
   ```http
   POST /api/teams/team123/join-requests/request456
   Body: { "action": "accept", "message": "Welcome!" }
   ```
   - User added as team member
   - Welcome email sent to user

### Workflow 2: User Checks Request Status

1. **User views their requests:**
   ```http
   GET /api/teams/join-requests/my
   ```

2. **Response shows all requests with status:**
   ```json
   {
     "data": [
       { "status": "PENDING", "team": {...} },
       { "status": "ACCEPTED", "team": {...} },
       { "status": "REJECTED", "team": {...} }
     ]
   }
   ```

---

## Migration Required

Run Prisma migration to update database:
```bash
npx prisma migrate dev --name add_team_join_requests
```

This creates the `TeamJoinRequest` collection and `TeamJoinRequestStatus` enum.

---

## Testing

### Test Cases:
1. ✅ Search teams by various criteria
2. ✅ Request to join team
3. ✅ Prevent duplicate join requests
4. ✅ Prevent joining as existing member
5. ✅ View team requests (team lead only)
6. ✅ Accept join request
7. ✅ Reject join request
8. ✅ View own join requests
9. ✅ Email notifications sent correctly
10. ✅ Activity tracking works

---

## Future Enhancements

Possible improvements:
- [ ] Withdraw join request functionality
- [ ] Auto-expire old pending requests (e.g., after 30 days)
- [ ] Team lead can invite users directly (reverse of join request)
- [ ] Bulk accept/reject requests
- [ ] Join request templates/quick replies
- [ ] Push notifications in addition to emails
- [ ] Request history/audit log

---

**Status:** ✅ Fully Implemented  
**Date:** January 5, 2026
