# Activity Tracking & Points System Documentation

## Overview

The TIC Portal now includes a comprehensive activity tracking and gamification system that:
- **Tracks ALL user activities** on the platform (auth, learning, collaboration, hackathons, etc.)
- **Automatically awards points** based on predefined rules
- **Prevents point farming** with cooldowns and daily limits
- **Stores activity history** for analytics and user profiles

---

## Architecture

### 1. Database Models

**UserActivity Model** - Tracks all user actions
```prisma
model UserActivity {
  id            String       @id
  userId        String
  type          ActivityType // AUTH, LEARNING, HACKATHON, etc.
  action        String       // Specific action (REGISTER, LOGIN, etc.)
  metadata      Json?        // Additional context
  pointsAwarded Int          @default(0)
  createdAt     DateTime
}
```

**Point Model** - Stores points awarded
```prisma
model Point {
  id        String   @id
  userId    String
  amount    Int
  reason    String
  activity  String?
  createdAt DateTime
}
```

### 2. Activity Types

- `AUTH` - Authentication activities (register, login, logout, profile updates)
- `LEARNING` - Learning path activities (stages, quizzes, resources)
- `HACKATHON` - Hackathon participation and submissions
- `MENTORSHIP` - Mentor requests and sessions
- `COLLABORATION` - Team/squad activities, messaging
- `GAMIFICATION` - Badges, leaderboards, streaks

---

## Points Configuration

### Authentication Activities
| Activity | Points | Notes |
|----------|--------|-------|
| REGISTER | 10 | One-time only |
| EMAIL_VERIFICATION | 20 | One-time only |
| LOGIN | 2 | Max once per day |
| PROFILE_COMPLETE | 30 | One-time only |
| PROFILE_UPDATE | 5 | Per update |

### Learning Activities
| Activity | Points | Notes |
|----------|--------|-------|
| STAGE_START | 5 | Per stage |
| STAGE_COMPLETE | 50 | One-time per stage |
| QUIZ_ATTEMPT | 10 | Per attempt |
| QUIZ_PASS | 30 | One-time per quiz |
| QUIZ_PERFECT_SCORE | 50 | Replaces QUIZ_PASS |
| RESOURCE_VIEW | 2 | Limited per day |
| RESOURCE_COMPLETE | 10 | Per resource |
| COURSE_COMPLETE | 100 | One-time per course |

### Hackathon Activities
| Activity | Points | Notes |
|----------|--------|-------|
| REGISTER | 20 | Per hackathon |
| TEAM_CREATE | 15 | Per team |
| SUBMISSION | 100 | Per hackathon |
| SUBMISSION_UPDATE | 10 | Per update |
| SUBMISSION_ON_TIME | 20 | Bonus |
| WIN_FIRST | 500 | First place |
| WIN_SECOND | 300 | Second place |
| WIN_THIRD | 200 | Third place |
| PARTICIPATION | 50 | Completion bonus |

### Mentorship Activities
| Activity | Points | Notes |
|----------|--------|-------|
| REQUEST_MENTOR | 5 | Per request |
| SESSION_ATTEND | 25 | Per session |
| SESSION_COMPLETE | 40 | Per session |
| PROVIDE_SESSION | 50 | For mentors |
| FEEDBACK_PROVIDE | 10 | Per feedback |

### Collaboration Activities
| Activity | Points | Notes |
|----------|--------|-------|
| TEAM_CREATE | 15 | One-time |
| TEAM_JOIN | 10 | Per team |
| SQUAD_JOIN | 15 | Per squad |
| MESSAGE_SEND | 1 | Max 10/day |
| FILE_SHARE | 5 | Per file |
| TEAM_ACTIVITY | 5 | Various actions |

### Gamification Activities
| Activity | Points | Notes |
|----------|--------|-------|
| BADGE_EARNED | 50 | Per badge |
| STREAK_2_DAYS | 10 | 2-day login streak |
| STREAK_3_DAYS | 20 | 3-day login streak |
| STREAK_7_DAYS | 50 | Weekly bonus |
| STREAK_30_DAYS | 200 | Monthly bonus |
| LEADERBOARD_TOP_10 | 100 | Weekly/monthly |
| LEADERBOARD_TOP_3 | 300 | Weekly/monthly |

---

## How It Works

### 1. Automatic Tracking via Middleware

The `trackActivity` middleware automatically tracks all authenticated requests:

```typescript
// In app.ts
import { trackActivity } from "./shared/middleware/activityTracker";
app.use(trackActivity); // After auth middleware
```

**What gets tracked:**
- HTTP method and path
- User ID (from JWT)
- Response status code
- User agent and IP
- Timestamp

**What gets skipped:**
- Health checks (`/health`)
- Documentation (`/api/docs`)
- Failed requests (4xx, 5xx status codes)
- Unauthenticated requests

### 2. Manual Tracking in Services

For specific events, track manually in your service layer:

```typescript
import { activityService } from "../../shared/services/activity";

// Example: Track email verification
await activityService.trackAuthActivity(
  user.id, 
  "EMAIL_VERIFICATION"
);

// Example: Track stage completion
await activityService.trackActivity({
  userId: user.id,
  action: "STAGE_COMPLETE",
  metadata: { stageId, stageName },
  awardPoints: true
});
```

### 3. Points Awarding Logic

Points are awarded automatically when tracking activities, with built-in protections:

**Unique Activities** (one-time only):
- REGISTER
- EMAIL_VERIFICATION
- PROFILE_COMPLETE
- STAGE_COMPLETE (per stage)
- TEAM_JOIN (per team)
- BADGE_EARN (per badge)

**Daily Limits** (max points per day):
- LOGIN: 2 points (once per 24h)
- MESSAGE_SEND: 10 points total per day

**Cooldowns** (minimum time between rewards):
- LOGIN: 24 hours
- MESSAGE_SEND: 1 minute

---

## Usage Examples

### Track Auth Activities

```typescript
// In auth service
import { activityService } from "../../shared/services/activity";

// Registration
await activityService.trackAuthActivity(user.id, "REGISTER", {
  email: user.email,
  role: user.role
});

// Login
await activityService.trackAuthActivity(user.id, "LOGIN");

// Profile update
await activityService.trackAuthActivity(user.id, "PROFILE_UPDATE");
```

### Track Learning Activities

```typescript
// Stage completion
await activityService.trackActivity({
  userId: user.id,
  action: "STAGE_COMPLETE",
  metadata: {
    stageId: stage.id,
    stageName: stage.name,
    completedAt: new Date()
  }
});

// Quiz completion
await activityService.trackActivity({
  userId: user.id,
  action: isPerfect ? "QUIZ_PERFECT_SCORE" : "QUIZ_PASS",
  metadata: {
    quizId: quiz.id,
    score,
    maxScore
  }
});
```

### Track Hackathon Activities

```typescript
// Submission
await activityService.trackActivity({
  userId: user.id,
  action: "SUBMISSION",
  metadata: {
    hackathonId,
    teamId,
    isOnTime
  }
});

// Award bonus for on-time submission
if (isOnTime) {
  await activityService.trackActivity({
    userId: user.id,
    action: "SUBMISSION_ON_TIME",
    metadata: { hackathonId }
  });
}
```

### Get User Stats

```typescript
// Get total points
const totalPoints = await activityService.getUserPoints(userId);

// Get recent activities
const activities = await activityService.getUserActivities(userId, 20);

// Get points history
const pointsHistory = await activityService.getUserPointsHistory(userId, 20);

// Get activities by type
const authActivities = await activityService.getUserActivities(
  userId, 
  50, 
  "AUTH"
);
```

### Award Manual/Bonus Points (Admin)

```typescript
// Award bonus points (e.g., for special achievements)
await activityService.awardBonusPoints(
  userId,
  100,
  "Special event participation bonus"
);
```

---

## API Endpoints for Frontend

### Get User Points
```
GET /api/users/:userId/points
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPoints": 450,
    "rank": 15,
    "activities": [...]
  }
}
```

### Get Activity History
```
GET /api/users/:userId/activities?limit=50&type=LEARNING
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "...",
        "type": "AUTH",
        "action": "LOGIN",
        "pointsAwarded": 2,
        "createdAt": "2026-01-04T10:30:00Z",
        "metadata": {...}
      }
    ]
  }
}
```

### Get Points History
```
GET /api/users/:userId/points/history?limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "points": [
      {
        "id": "...",
        "amount": 20,
        "reason": "EMAIL_VERIFICATION",
        "activity": "AUTH",
        "createdAt": "2026-01-04T10:30:00Z"
      }
    ]
  }
}
```

---

## Extending the System

### Add New Activity Type

1. **Update Points Config** (`src/shared/constants/points.ts`):
```typescript
export const POINTS_CONFIG = {
  // ...existing config
  NEW_CATEGORY: {
    ACTION_NAME: 50,
  }
};

export const ACTIVITY_TYPE_MAP = {
  // ...existing mappings
  ACTION_NAME: "NEW_CATEGORY",
};
```

2. **Track in Service**:
```typescript
await activityService.trackActivity({
  userId,
  action: "ACTION_NAME",
  metadata: { /* context */ }
});
```

### Add New Point Rule

```typescript
// In points.ts
export const POINTS_CONFIG = {
  LEARNING: {
    // ...existing actions
    NEW_ACTION: 25, // Add new action with points
  }
};
```

### Customize Point Calculation

Override `calculatePoints` method in `ActivityService` for complex logic.

---

## Best Practices

1. **Always track activities** - Even if they don't award points, tracking helps with analytics
2. **Include metadata** - Add context to help with debugging and reporting
3. **Don't track sensitive data** - Avoid storing passwords, tokens, or PII in metadata
4. **Use appropriate activity types** - Helps with filtering and reporting
5. **Test point limits** - Ensure daily limits and cooldowns work as expected
6. **Monitor for abuse** - Check for users trying to farm points

---

## Database Queries

### Get Top Users by Points
```typescript
const leaderboard = await db.point.groupBy({
  by: ['userId'],
  _sum: { amount: true },
  orderBy: { _sum: { amount: 'desc' } },
  take: 10
});
```

### Get Activity Stats by Type
```typescript
const stats = await db.userActivity.groupBy({
  by: ['type'],
  _count: { id: true },
  _sum: { pointsAwarded: true }
});
```

### Get Daily Active Users
```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);

const activeUsers = await db.userActivity.findMany({
  where: {
    createdAt: { gte: today },
    action: 'LOGIN'
  },
  distinct: ['userId']
});
```

---

## Summary

✅ **Comprehensive tracking** - All activities logged automatically  
✅ **Smart point system** - Prevents farming with limits and cooldowns  
✅ **Easy to extend** - Add new activities and point rules easily  
✅ **Analytics ready** - Rich metadata for reporting and insights  
✅ **Performance optimized** - Non-blocking, async tracking  

The system is now ready to track all user activities and reward engagement across the platform! 🎮🏆
