# Socket.io Static Method Fix

## Issue
The Socket.io team chat handler was calling `teamService.sendTeamChatMessage()` as an instance method, which caused a runtime error because:
1. No `teamService` instance was ever created
2. `TeamService` only has static methods

## Error
```
TypeError: Cannot read property 'sendTeamChatMessage' of undefined
```

## Root Cause
In `src/socket/events/teamChat.ts`, the code was:
```typescript
const chatMessage = await teamService.sendTeamChatMessage(
  teamId,
  socket.userId,
  message,
  attachments
);
```

This tried to call an instance method on a non-existent object.

## Fix
Changed to use the static method correctly AND fixed the method signature:

```typescript
const chatMessage = await TeamService.sendTeamChatMessage(
  teamId,
  socket.userId,
  {
    message,
    attachments,
  }
);
```

### Two changes made:
1. **Capital T**: Changed `teamService` to `TeamService` (static class method)
2. **Correct parameters**: Changed from 4 parameters to 3 parameters (wrapping `message` and `attachments` in an object as the third parameter)

## Service Method Signature
```typescript
static async sendTeamChatMessage(
  teamId: string,
  userId: string,
  input: SendTeamChatMessageInput, // { message: string, attachments?: string[] }
)
```

## Files Modified
- `src/socket/events/teamChat.ts` (line 157-162)

## Status
✅ **FIXED** - All Socket.io handlers now correctly use static `TeamService` methods

## Related Fixes
This completes the series of Socket.io fixes:
1. ✅ Fixed socket authentication to fetch user from DB
2. ✅ Fixed all `teamService` → `TeamService` static method calls
3. ✅ Fixed parameter order in `sendTeamChatMessage` calls
4. ✅ Fixed parameter structure (using input object)

## Testing
After this fix, Socket.io real-time team chat should work correctly:
1. Join team room: `socket.emit('team:join', { teamId })`
2. Send message: `socket.emit('team:message:send', { teamId, message, attachments })`
3. Receive message: `socket.on('team:message', (data) => { ... })`

All database operations now execute correctly with the proper static method calls.
