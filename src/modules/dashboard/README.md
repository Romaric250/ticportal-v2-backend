# 📊 Dashboard API - Complete Documentation

## 🎯 **Overview**

Single comprehensive endpoint that returns all dashboard data in one request for optimal performance.

---

## 📋 **API Endpoint**

### **GET /api/dashboard/overview**

Get complete dashboard data for the authenticated user.

```http
GET /api/dashboard/overview
Authorization: Bearer YOUR_TOKEN
```

---

## 📤 **Response Structure**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "695a331a785c23eb1c7eb0c4",
      "name": "Alex Chen",
      "avatarUrl": "https://...",
      "initials": "AC"
    },
    "stats": {
      "totalTP": 2450,
      "tpToday": 150,
      "currentLevel": 4,
      "levelName": "Scholar",
      "dayStreak": 12,
      "levelProgress": {
        "percentage": 85,
        "currentPoints": 2450,
        "nextLevelPoints": 2500,
        "pointsNeeded": 50,
        "nextLevelName": "Level 5 - Advanced"
      }
    },
    "nextUp": {
      "moduleId": "mod_123",
      "pathId": "path_456",
      "pathName": "Design Thinking Fundamentals",
      "title": "Module 3: Design thinking & ideation",
      "description": "Learn how to empathise with users, define problems, and iterate creative solutions for your TIC project.",
      "category": "Academic",
      "status": "in_progress",
      "progress": 65,
      "lastAccessed": "2024-10-24T10:30:00Z",
      "thumbnailUrl": null,
      "estimatedTime": "2h",
      "modulesCompleted": 2,
      "totalModules": 5
    },
    "team": {
      "id": "team_789",
      "name": "Code Warriors",
      "initials": "CW",
      "phase": "Ideation phase",
      "memberCount": 4,
      "description": "4 members",
      "members": [
        {
          "id": "user_1",
          "name": "John Doe",
          "avatarUrl": "https://...",
          "initials": "JD",
          "role": "Leader"
        },
        {
          "id": "user_2",
          "name": "Jane Smith",
          "avatarUrl": null,
          "initials": "JS",
          "role": "Developer"
        }
      ]
    },
    "upcomingDeadlines": [
      {
        "id": "deadline_1",
        "title": "Project proposal submission",
        "subtitle": "Due tomorrow",
        "date": "2024-10-25",
        "dueDate": "2024-10-25T23:59:59Z",
        "variant": "danger",
        "type": "deliverable_submission",
        "priority": "high",
        "hackathonId": "hack_123"
      },
      {
        "id": "deadline_2",
        "title": "Mentor check-in",
        "subtitle": "In 3 days",
        "date": "2024-10-28",
        "dueDate": "2024-10-28T14:00:00Z",
        "variant": "purple",
        "type": "mentor_checkin",
        "priority": "low",
        "mentorId": "mentor_456"
      }
    ],
    "recentBadges": [
      {
        "id": "badge_1",
        "badgeId": "first_post",
        "name": "First Post",
        "icon": "📝",
        "color": "amber",
        "earnedAt": "2024-10-20T08:00:00Z",
        "points": 50,
        "locked": false
      },
      {
        "id": "badge_2",
        "badgeId": "team_player",
        "name": "Team Player",
        "icon": "👥",
        "color": "sky",
        "earnedAt": "2024-10-18T14:30:00Z",
        "points": 75,
        "locked": false
      },
      {
        "id": "badge_3",
        "badgeId": "rookie",
        "name": "Rookie",
        "icon": "🌱",
        "color": "amber",
        "earnedAt": "2024-10-15T10:00:00Z",
        "points": 50,
        "locked": false
      }
    ],
    "badgeStats": {
      "totalBadges": 5,
      "totalPoints": 300
    }
  }
}
```

---

## 📊 **Field Descriptions**

### **User Info**
- `id` - User unique identifier
- `name` - Full name
- `avatarUrl` - Profile photo URL or null
- `initials` - Generated initials (e.g., "AC")

### **Stats**
- `totalTP` - Total TIC Points earned
- `tpToday` - Points earned today
- `currentLevel` - Current level (1-8)
- `levelName` - Level name (Beginner, Novice, etc.)
- `dayStreak` - Consecutive days with activity
- `levelProgress`:
  - `percentage` - Progress to next level (0-100)
  - `currentPoints` - Current TP
  - `nextLevelPoints` - TP needed for next level
  - `pointsNeeded` - Remaining points needed
  - `nextLevelName` - Next level name

### **Next Up Module**
- `moduleId` - Module identifier
- `pathId` - Learning path identifier
- `pathName` - Learning path name
- `title` - Module title
- `description` - Module description
- `category` - Module category
- `status` - "not_started", "in_progress", or "completed"
- `progress` - Completion percentage (0-100)
- `lastAccessed` - Last activity date or null
- `thumbnailUrl` - Module thumbnail or null
- `estimatedTime` - Estimated duration
- `modulesCompleted` - Number of completed modules
- `totalModules` - Total modules in path

### **Team**
- `id` - Team identifier
- `name` - Team name
- `initials` - Team initials
- `phase` - Current project phase
- `memberCount` - Number of members
- `description` - Team description
- `members[]` - Array of team members
  - `id` - Member user ID
  - `name` - Member full name
  - `avatarUrl` - Member photo or null
  - `initials` - Member initials
  - `role` - Member role in team
- `hackathon` - Associated hackathon (optional)

### **Deadlines**
- `id` - Deadline identifier
- `title` - Deadline title
- `subtitle` - Human-readable time info
- `date` - Date string (YYYY-MM-DD)
- `dueDate` - Full datetime (ISO 8601)
- `variant` - UI variant: "danger" | "info" | "purple"
- `type` - Deadline type
- `priority` - "high" | "medium" | "low"
- `hackathonId` - Related hackathon ID (optional)
- `mentorId` - Related mentor ID (optional)

### **Badges**
- `id` - User badge record ID
- `badgeId` - Badge identifier
- `name` - Badge name
- `icon` - Badge emoji/icon
- `color` - Badge color theme
- `earnedAt` - Date earned (ISO 8601) or null
- `points` - Badge point value
- `locked` - Whether badge is earned

---

## 🎯 **Level System**

| Level | Name | Min Points | Max Points |
|-------|------|------------|------------|
| 1 | Beginner | 0 | 500 |
| 2 | Novice | 500 | 1,000 |
| 3 | Intermediate | 1,000 | 2,000 |
| 4 | Scholar | 2,000 | 3,500 |
| 5 | Advanced | 3,500 | 5,000 |
| 6 | Expert | 5,000 | 7,500 |
| 7 | Master | 7,500 | 10,000 |
| 8 | Legend | 10,000+ | ∞ |

---

## 🔍 **Data Sources**

The endpoint aggregates data from:

✅ **User Profile** - `User` model  
✅ **Points** - `Point` model (existing)  
✅ **Learning Progress** - `LearningEnrollment`, `ModuleCompletion`  
✅ **Team** - `Team`, `TeamMember` models  
✅ **Deadlines** - `DeliverableTemplate`, `MentorSession`  
✅ **Badges** - `UserBadge`, `Badge` models (existing)

---

## ⚡ **Performance**

**Parallel Queries:**
All data fetched in parallel using `Promise.all()` for maximum speed.

```typescript
const [user, stats, nextModule, team, deadlines, badges, badgeStats] =
  await Promise.all([
    getUserInfo(),
    getUserStats(),
    getNextModule(),
    getUserTeam(),
    getUpcomingDeadlines(),
    getRecentBadges(),
    getBadgeStats(),
  ]);
```

**Typical Response Time:** 100-300ms

---

## 🧪 **Testing**

```bash
# Get dashboard overview
curl http://localhost:5000/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return all dashboard data
```

---

## 🎨 **Frontend Integration**

```typescript
import { useEffect, useState } from 'react';

interface DashboardData {
  user: any;
  stats: any;
  nextUp: any;
  team: any;
  upcomingDeadlines: any[];
  recentBadges: any[];
  badgeStats: any;
}

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard/overview', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>Error loading dashboard</div>;

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <section className="welcome">
        <h1>Welcome, {dashboard.user.name}! 👋</h1>
        <div className="avatar">
          {dashboard.user.avatarUrl ? (
            <img src={dashboard.user.avatarUrl} alt={dashboard.user.name} />
          ) : (
            <div className="initials">{dashboard.user.initials}</div>
          )}
        </div>
      </section>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total TP</h3>
          <p className="big-number">{dashboard.stats.totalTP}</p>
        </div>
        
        <div className="stat-card">
          <h3>Today's TP</h3>
          <p className="big-number">+{dashboard.stats.tpToday}</p>
        </div>
        
        <div className="stat-card">
          <h3>Current Level</h3>
          <p className="big-number">{dashboard.stats.currentLevel}</p>
          <p className="subtitle">{dashboard.stats.levelName}</p>
        </div>
        
        <div className="stat-card">
          <h3>Day Streak</h3>
          <p className="big-number">{dashboard.stats.dayStreak} 🔥</p>
        </div>
      </section>

      {/* Level Progress */}
      <section className="level-progress">
        <h2>Level Progress</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${dashboard.stats.levelProgress.percentage}%` }}
          />
        </div>
        <p>
          {dashboard.stats.levelProgress.pointsNeeded} TP until {dashboard.stats.levelProgress.nextLevelName}
        </p>
      </section>

      {/* Next Up Module */}
      {dashboard.nextUp && (
        <section className="next-up">
          <h2>Continue Learning</h2>
          <div className="module-card">
            <h3>{dashboard.nextUp.title}</h3>
            <p>{dashboard.nextUp.description}</p>
            <div className="progress">
              {dashboard.nextUp.progress}% complete
            </div>
            <button>Continue →</button>
          </div>
        </section>
      )}

      {/* Team */}
      {dashboard.team && (
        <section className="team">
          <h2>Your Team: {dashboard.team.name}</h2>
          <div className="team-members">
            {dashboard.team.members.map(member => (
              <div key={member.id} className="member">
                <img src={member.avatarUrl || `/avatar/${member.initials}`} />
                <p>{member.name}</p>
                <span>{member.role}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Deadlines */}
      {dashboard.upcomingDeadlines.length > 0 && (
        <section className="deadlines">
          <h2>Upcoming Deadlines</h2>
          <ul>
            {dashboard.upcomingDeadlines.map(deadline => (
              <li key={deadline.id} className={`deadline-${deadline.variant}`}>
                <h4>{deadline.title}</h4>
                <p>{deadline.subtitle}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent Badges */}
      {dashboard.recentBadges.length > 0 && (
        <section className="badges">
          <h2>Recent Badges</h2>
          <div className="badge-grid">
            {dashboard.recentBadges.map(badge => (
              <div key={badge.id} className={`badge badge-${badge.color}`}>
                <span className="icon">{badge.icon}</span>
                <h4>{badge.name}</h4>
                <p>+{badge.points} TP</p>
              </div>
            ))}
          </div>
          <p>Total: {dashboard.badgeStats.totalBadges} badges earned</p>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
```

---

## 🛠️ **Error Handling**

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Errors:**
- `401` - Unauthorized (no token/invalid token)
- `404` - User not found
- `500` - Server error

---

## ✅ **Summary**

**Endpoint:** `GET /api/dashboard/overview`

**Features:**
- ✅ Single request for all dashboard data
- ✅ Parallel data fetching (fast!)
- ✅ User info with safe initials
- ✅ TP stats with level system
- ✅ Day streak calculation
- ✅ Next learning module recommendation
- ✅ Team information
- ✅ Upcoming deadlines
- ✅ Recent badges
- ✅ Badge statistics

**Response Time:** ~100-300ms  
**Authentication:** Required  
**Caching:** Recommended (5-15 minutes)

**Dashboard API ready!** 📊✨
