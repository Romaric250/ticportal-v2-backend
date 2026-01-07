# Fix for Team Service Duplicate Declaration Error

## Problem
The file `src/modules/teams/service.ts` has duplicate `teamLeads` variable declarations causing a build error.

## Solution
Remove all the comment-style code I added (lines starting with `// Add import` through the end of those additions around line 1150).

The correct way to integrate notifications is to:

1. Add import at the top of the file (line 1-20):
```typescript
import { NotificationService } from "../notifications/service";
```

2. Add notification calls inside actual method bodies (not as comments):

**In `addTeamMember` method** - after the member is added:
```typescript
await NotificationService.notifyTeamMemberAdded(input.userId, team.name, teamId);
```

**In `updateTeamMemberRole` method** - after role is updated:
```typescript
await NotificationService.notifyTeamRoleUpdated(actualUserId, team.name, input.role, teamId);
```

**In `removeTeamMember` method** - after removal (if not self):
```typescript
if (!isSelfRemoval) {
  await NotificationService.notifyTeamMemberRemoved(actualUserId, team.name);
}
```

**In `requestToJoinTeam` method** - in the existing teamLeads loop:
```typescript
for (const lead of teamLeads) {
  await sendTeamJoinRequestEmail(...);
  
  // Add notification
  await NotificationService.notifyTeamJoinRequest(
    lead.userId,
    `${requester.firstName} ${requester.lastName}`,
    team.name,
    teamId,
    joinRequest.id
  );
}
```

**In `approveJoinRequest` method** - after approval:
```typescript
await NotificationService.notifyTeamJoinApproved(joinRequest.userId, team.name, teamId);
```

**In `rejectJoinRequest` method** - after rejection:
```typescript
await NotificationService.notifyTeamJoinRejected(joinRequest.userId, team.name);
```

## Quick Fix
1. Open `src/modules/teams/service.ts`
2. Search for `// Add import at top` 
3. Delete everything from that comment down to `await NotificationService.notifyTeamJoinRejected(request.userId, team.name);`
4. The notification integration can be done later manually following the examples above
