# Quick Reference: Teams & Emails

## Team Endpoints (Quick Reference)

```bash
# Get all teams
GET /api/teams?page=1&limit=20

# Get my teams
GET /api/teams/my [AUTH]

# Create team
POST /api/teams [AUTH, SQUAD_MEMBER]
{
  "name": "Team Alpha",
  "squadId": "...",
  "projectTitle": "...",
  "description": "..."
}

# Update team
PUT /api/teams/:teamId [AUTH, TEAM_LEAD]
{ "name": "...", "projectTitle": "..." }

# Delete team
DELETE /api/teams/:teamId [AUTH, TEAM_LEAD]

# Add member
POST /api/teams/:teamId/members [AUTH, TEAM_LEAD]
{ "userId": "...", "role": "MEMBER" }

# Update role
PUT /api/teams/:teamId/members/:memberId/role [AUTH, TEAM_LEAD]
{ "role": "LEAD" }

# Remove member
DELETE /api/teams/:teamId/members/:memberId [AUTH, TEAM_LEAD_OR_SELF]

# Get chats
GET /api/teams/:teamId/chats?page=1&limit=50 [AUTH, MEMBER]

# Send message
POST /api/teams/:teamId/chats [AUTH, MEMBER]
{
  "message": "Hello!",
  "attachments": ["url1", "url2"]
}
```

## Email Functions

```typescript
// Verification
await sendVerificationEmail(email, firstName, otp);

// Password reset
await sendPasswordResetEmail(email, firstName, otp);

// Welcome
await sendWelcomeEmail(email, firstName);

// Team invite
await sendTeamInviteEmail(email, firstName, teamName, inviterName);

// Role update
await sendTeamRoleUpdateEmail(email, firstName, teamName, newRole);

// Team removal
await sendTeamRemovalEmail(email, firstName, teamName);

// Squad invite
await sendSquadInviteEmail(email, firstName, squadName, schoolName);

// Hackathon reminder
await sendHackathonReminderEmail(email, firstName, hackathonName, daysLeft);

// Mentor assignment
await sendMentorAssignmentEmail(email, firstName, teamName, mentorName);
```

## Points Reference

| Activity | Points |
|----------|--------|
| TEAM_CREATED | +15 |
| TEAM_JOINED | +10 |
| TEAM_UPDATED | +5 |
| TEAM_MEMBER_ADDED | +5 |
| TEAM_MEMBER_ROLE_UPDATED | +3 |
| TEAM_MESSAGE_SENT | 0 |

## Common Errors

```typescript
// 400 - Validation error
"Team name must be at least 3 characters"

// 403 - Permission denied
"Only team leads can update team details"
"You must be a member of the squad to create a team"

// 404 - Not found
"Team not found"
"Member not found"
```

## Testing Commands

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password"}' \
  | jq -r '.data.accessToken')

# 2. Create team
TEAM_ID=$(curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestTeam","squadId":"SQUAD_ID"}' \
  | jq -r '.data.id')

# 3. Add member
curl -X POST http://localhost:5000/api/teams/$TEAM_ID/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","role":"MEMBER"}'

# 4. Send message
curl -X POST http://localhost:5000/api/teams/$TEAM_ID/chats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello team!"}'
```

## Email Design Colors

```css
/* Primary Colors */
--dark: #111827;
--white: #FFFFFF;

/* Grays */
--gray-light: #f3f4f6;
--gray-medium: #f9fafb;
--gray-border: #e5e7eb;
```

## Frontend Hooks

```typescript
// Fetch team
const { data: team } = useQuery(['team', teamId], 
  () => fetch(`/api/teams/${teamId}`).then(r => r.json())
);

// Create team
const createTeam = useMutation(
  (data) => fetch('/api/teams', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  })
);

// Send message
const sendMessage = useMutation(
  (message) => fetch(`/api/teams/${teamId}/chats`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message })
  })
);
```

## Validation Schemas

```typescript
// Create team
{
  name: string (3-100 chars),
  squadId: string (required),
  projectTitle?: string (max 200),
  description?: string (max 1000)
}

// Add member
{
  userId: string (required),
  role: 'MEMBER' | 'LEAD' (default: 'MEMBER')
}

// Send message
{
  message: string (1-2000 chars),
  attachments?: string[] (max 5 URLs)
}
```

## Permissions Quick Check

| Action | Team Lead | Member |
|--------|-----------|--------|
| Update team | ✅ | ❌ |
| Delete team | ✅ | ❌ |
| Add members | ✅ | ❌ |
| Remove members | ✅ | ❌ (self only) |
| Update roles | ✅ | ❌ |
| Send messages | ✅ | ✅ |
| View chats | ✅ | ✅ |

## Logging Examples

```typescript
// Info logs
logger.info({ userId, teamId }, "Team created");
logger.info({ userId, teamId, memberId }, "Member added");

// Error logs
logger.error({ error, userId }, "Failed to create team");
logger.error({ error, teamId }, "Failed to send message");
```
