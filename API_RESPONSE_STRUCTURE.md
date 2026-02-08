# API Response Structure for Admin Dashboard Stats

## Endpoint: `GET /api/admin/dashboard-stats`

### Expected Response Structure

```json
{
  "success": true,
  "data": {
    "usersByRole": [
      {
        "role": "ADMIN",
        "count": 4
      },
      {
        "role": "AFFILIATE",
        "count": 2
      },
      {
        "role": "STUDENT",
        "count": 11
      },
      {
        "role": "MENTOR",
        "count": 1
      }
    ],
    "usersByStatus": [
      {
        "status": "ACTIVE",
        "count": 7
      },
      {
        "status": "PENDING",
        "count": 11
      }
    ],
    "usersOverTime": [
      {
        "date": "2026-01-13",
        "users": 1
      },
      {
        "date": "2026-01-14",
        "users": 1
      },
      {
        "date": "2026-01-15",
        "users": 2
      }
    ],
    "teamsCount": 9,
    "activeTeams": 9
  }
}
```

### Field Specifications

#### Root Level
- `success` (boolean, required): Always `true` for successful responses
- `data` (object, required): Contains the dashboard statistics

#### `data.usersByRole` (array of objects, required)
- Each object contains:
  - `role` (string, required): User role (e.g., "ADMIN", "AFFILIATE", "STUDENT", "MENTOR", "JUDGE", "SQUAD_LEAD")
  - `count` (number, required): Number of users with this role

#### `data.usersByStatus` (array of objects, required)
- Each object contains:
  - `status` (string, required): User status (e.g., "ACTIVE", "PENDING", "SUSPENDED", "INACTIVE")
  - `count` (number, required): Number of users with this status

#### `data.usersOverTime` (array of objects, required)
- Each object contains:
  - `date` (string, required): Date in ISO format (YYYY-MM-DD), e.g., "2026-01-13"
  - `users` (number, required): Number of users created on this date
- Should contain data for the last 30 days
- Dates should be sorted in ascending order

#### `data.teamsCount` (number, required)
- Total number of teams in the system

#### `data.activeTeams` (number, required)
- Number of teams that have at least one member

### Error Response Structure

```json
{
  "success": false,
  "message": "Failed to get detailed stats"
}
```

### TypeScript Interface

```typescript
interface DashboardStatsResponse {
  success: true;
  data: {
    usersByRole: Array<{
      role: string;
      count: number;
    }>;
    usersByStatus: Array<{
      status: string;
      count: number;
    }>;
    usersOverTime: Array<{
      date: string; // YYYY-MM-DD format
      users: number;
    }>;
    teamsCount: number;
    activeTeams: number;
  };
}
```

### Notes

1. All arrays should be present even if empty (`[]`)
2. All numeric fields should be numbers, not strings
3. Dates in `usersOverTime` should be in ISO date format (YYYY-MM-DD)
4. The `usersOverTime` array should only include dates from the last 30 days
5. Role and status values should match the Prisma enum values exactly
