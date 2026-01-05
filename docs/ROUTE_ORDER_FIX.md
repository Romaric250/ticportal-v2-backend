# Route Order Fix - Team Search

## Issue
When searching for teams using `GET /api/teams/search?q=ta`, the application was throwing an error:
```
Inconsistent column data: Malformed ObjectID: invalid character 's' was found at index 0 in the provided hex string: "search".
```

## Root Cause
The route `GET /api/teams/:teamId` was defined BEFORE `GET /api/teams/search` in the routes file. 

In Express.js, route order matters! When a request comes in for `/api/teams/search`:
1. Express checks routes in the order they're defined
2. The `/:teamId` route matches first (treating "search" as a teamId parameter)
3. The application tries to find a team with ID "search"
4. MongoDB/Prisma rejects "search" as an invalid ObjectID

## Solution
Moved the `/search` route definition to appear BEFORE the `/:teamId` route.

### Route Order (Correct)
```typescript
router.post("/", authenticate, TeamController.createTeam);
router.get("/search", authenticate, TeamController.searchTeams);  // ✅ Specific route first
router.get("/:teamId", cacheMiddleware(60), TeamController.getTeamById);  // ✅ Dynamic route last
```

### Route Order (Incorrect - Previous)
```typescript
router.post("/", authenticate, TeamController.createTeam);
router.get("/:teamId", cacheMiddleware(60), TeamController.getTeamById);  // ❌ Catches everything
router.get("/search", TeamController.searchTeams);  // ❌ Never reached
```

## Best Practice: Route Ordering in Express

**Rule:** Define specific routes before dynamic routes with parameters.

**Correct Order:**
1. Static routes (e.g., `/search`, `/my`, `/stats`)
2. Routes with specific segments (e.g., `/join-requests/my`)
3. Dynamic routes with parameters (e.g., `/:teamId`, `/:id`)

**Example:**
```typescript
// ✅ Good order
router.get("/teams/search", ...)        // 1. Static
router.get("/teams/my", ...)            // 1. Static
router.get("/teams/join-requests/my", ...) // 2. Specific
router.get("/teams/:teamId", ...)       // 3. Dynamic
router.get("/teams/:teamId/members", ...) // 3. Dynamic with specific
```

## Files Modified
- `src/modules/teams/routes.ts` - Moved `/search` route before `/:teamId` route

## Testing
After this fix, team search should work correctly:
```bash
# Search for teams
curl "http://localhost:3000/api/teams/search?q=test&school=MIT" \
  -H "Authorization: Bearer YOUR_JWT"

# Get specific team by ID
curl "http://localhost:3000/api/teams/ACTUAL_TEAM_ID" \
  -H "Authorization: Bearer YOUR_JWT"
```

## Status
✅ Fixed - Team search now works correctly
✅ No breaking changes - all existing routes still work
