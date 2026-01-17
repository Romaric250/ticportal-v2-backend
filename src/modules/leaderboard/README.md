# 🏆 Leaderboard System - Complete Documentation

## 📋 **Overview**

Complete leaderboard system based on TIC Points (TP) with rankings for:
- **Students** - Individual user rankings
- **Teams** - Combined points of all team members
- **Schools** - Combined points of all students from a school

---

## 🎯 **API Endpoints**

### **1. Get Current User's Rank**

Get authenticated user's current rank and statistics.

```http
GET /api/leaderboard/me
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "695a331a785c23eb1c7eb0c4",
    "rank": 142,
    "totalTP": 850,
    "rankChange": 3,
    "previousRank": 145,
    "tpChange": 50,
    "percentile": 68.5
  }
}
```

**Fields:**
- `rank` - Current position in leaderboard
- `totalTP` - Total TIC Points earned
- `rankChange` - Rank movement (positive = moved up)
- `previousRank` - Rank from 7 days ago
- `tpChange` - Points earned in last 7 days
- `percentile` - User's percentile ranking

---

### **2. Get Students Leaderboard**

Get paginated list of all students ranked by TIC Points.

```http
GET /api/leaderboard/students?page=1&limit=20&search=alex&school=Tech High
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `search` (string, optional) - Search by name or email
- `school` (string, optional) - Filter by school name
- `minTP` (number, optional) - Minimum TP filter
- `maxTP` (number, optional) - Maximum TP filter

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "695a331a785c23eb1c7eb0c4",
        "userId": "695a331a785c23eb1c7eb0c4",
        "rank": 1,
        "name": "Alex Chen",
        "school": "Tech High Global",
        "avatarUrl": "https://...",
        "initials": "AC",
        "totalTP": 2450,
        "badges": ["rookie", "first_post", "content_creator"],
        "activityTrend": 15,
        "rankChange": 0,
        "email": "alex@example.com"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 452,
      "totalPages": 23
    }
  }
}
```

**Fields:**
- `activityTrend` - % change in activity (last 7 days vs previous 7 days)
- `rankChange` - Rank movement in last 7 days
- `badges` - Array of earned badge IDs

---

### **3. Get Top 3 Students**

Get the top 3 ranked students for podium display.

```http
GET /api/leaderboard/students/top
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "userId": "...",
      "rank": 1,
      "name": "Alex Chen",
      "school": "Tech High Global",
      "avatarUrl": "https://...",
      "initials": "AC",
      "totalTP": 2450,
      "badges": ["rookie", "legend"],
      "activityTrend": 15,
      "rankChange": 0,
      "email": "alex@example.com"
    },
    // ... 2 more students
  ]
}
```

---

### **4. Get Teams Leaderboard**

Get paginated list of teams ranked by combined member points.

```http
GET /api/leaderboard/teams?page=1&limit=20&search=alpha&school=Tech High
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, optional) - Search by team name
- `school` (string, optional) - Filter by school

**Response:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "...",
        "teamId": "...",
        "rank": 1,
        "name": "Team Alpha",
        "school": "Tech High Global",
        "totalTP": 5000,
        "memberCount": 5,
        "activityTrend": 12,
        "rankChange": 0,
        "members": [
          {
            "id": "...",
            "name": "John Doe",
            "avatarUrl": "https://..."
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

**Note:** `totalTP` is the sum of all team members' points.

---

### **5. Get Top 3 Teams**

```http
GET /api/leaderboard/teams/top
Authorization: Bearer YOUR_TOKEN
```

---

### **6. Get Schools Leaderboard**

Get paginated list of schools ranked by total student points.

```http
GET /api/leaderboard/schools?page=1&limit=20&search=Tech
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `search` (string, optional) - Search by school name

**Response:**
```json
{
  "success": true,
  "data": {
    "schools": [
      {
        "id": "Tech High Global",
        "rank": 1,
        "name": "Tech High Global",
        "totalTP": 25000,
        "studentCount": 150,
        "teamCount": 30,
        "activityTrend": 8,
        "rankChange": 0,
        "averageTP": 166.67
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

**Note:** `totalTP` is the sum of all students' points from that school.

---

### **7. Get Top 3 Schools**

```http
GET /api/leaderboard/schools/top
Authorization: Bearer YOUR_TOKEN
```

---

## 🔢 **Ranking Logic**

### **1. Students Ranking:**
```sql
-- Sum points for each user
SELECT userId, SUM(amount) as totalTP
FROM Point
GROUP BY userId
ORDER BY totalTP DESC
```

### **2. Teams Ranking:**
```sql
-- Sum points for all team members
SELECT t.id, SUM(p.amount) as totalTP
FROM Team t
JOIN TeamMember tm ON t.id = tm.teamId
JOIN Point p ON tm.userId = p.userId
GROUP BY t.id
ORDER BY totalTP DESC
```

### **3. Schools Ranking:**
```sql
-- Sum points for all students from school
SELECT u.school, SUM(p.amount) as totalTP
FROM User u
JOIN Point p ON u.id = p.userId
WHERE u.school IS NOT NULL
GROUP BY u.school
ORDER BY totalTP DESC
```

---

## 📊 **Calculated Metrics**

### **Activity Trend:**
Percentage change in points earned (last 7 days vs previous 7 days)

```javascript
const current = pointsInLast7Days;
const previous = pointsInPrevious7Days;
const trend = ((current - previous) / previous) * 100;
```

**Examples:**
- `+50` = 50% increase in activity
- `-20` = 20% decrease in activity
- `0` = No change

### **Rank Change:**
Difference between current rank and rank from 7 days ago

```javascript
const rankChange = previousRank - currentRank;
```

**Examples:**
- `+5` = Moved up 5 positions
- `-3` = Moved down 3 positions
- `0` = No rank change

### **Tie Handling:**
When multiple users have the same points, they receive the same rank:

```
Points: [1000, 1000, 900, 800]
Ranks:  [1,    1,    3,   4]
```

---

## 🎨 **Frontend Integration**

### **Leaderboard Page:**

```typescript
import { useEffect, useState } from 'react';

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMyRank();
    fetchLeaderboard();
  }, [activeTab, page]);

  const fetchMyRank = async () => {
    const res = await fetch('/api/leaderboard/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMyRank(data.data);
  };

  const fetchLeaderboard = async () => {
    const endpoint = `/api/leaderboard/${activeTab}?page=${page}&limit=20`;
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (activeTab === 'students') {
      setStudents(data.data.students);
    }
    // Handle teams and schools similarly
  };

  return (
    <div className="leaderboard">
      {/* My Rank Card */}
      {myRank && (
        <div className="my-rank-card">
          <h3>Your Rank</h3>
          <div className="rank-display">#{myRank.rank}</div>
          <p>{myRank.totalTP} TP</p>
          <span className={myRank.rankChange > 0 ? 'up' : 'down'}>
            {myRank.rankChange > 0 ? '↑' : '↓'} {Math.abs(myRank.rankChange)}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab('students')}>Students</button>
        <button onClick={() => setActiveTab('teams')}>Teams</button>
        <button onClick={() => setActiveTab('schools')}>Schools</button>
      </div>

      {/* Leaderboard List */}
      <div className="leaderboard-list">
        {students.map(student => (
          <div key={student.id} className="leaderboard-item">
            <div className="rank">#{student.rank}</div>
            <img src={student.avatarUrl || '/default-avatar.png'} />
            <div className="info">
              <h4>{student.name}</h4>
              <p>{student.school}</p>
            </div>
            <div className="badges">
              {student.badges.map(badge => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
            <div className="points">{student.totalTP} TP</div>
            <div className={`trend ${student.activityTrend > 0 ? 'up' : 'down'}`}>
              {student.activityTrend}%
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};
```

### **Podium Display (Top 3):**

```typescript
const PodiumDisplay = () => {
  const [top3, setTop3] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard/students/top', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTop3(data.data));
  }, []);

  return (
    <div className="podium">
      {/* 2nd Place */}
      <div className="podium-item second">
        <div className="medal">🥈</div>
        <img src={top3[1]?.avatarUrl} />
        <h3>{top3[1]?.name}</h3>
        <p>{top3[1]?.totalTP} TP</p>
      </div>

      {/* 1st Place */}
      <div className="podium-item first">
        <div className="medal">🥇</div>
        <img src={top3[0]?.avatarUrl} />
        <h3>{top3[0]?.name}</h3>
        <p>{top3[0]?.totalTP} TP</p>
      </div>

      {/* 3rd Place */}
      <div className="podium-item third">
        <div className="medal">🥉</div>
        <img src={top3[2]?.avatarUrl} />
        <h3>{top3[2]?.name}</h3>
        <p>{top3[2]?.totalTP} TP</p>
      </div>
    </div>
  );
};
```

---

## 🧪 **Testing**

```bash
# Get your rank
curl http://localhost:5000/api/leaderboard/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get students leaderboard
curl "http://localhost:5000/api/leaderboard/students?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get top 3 students
curl http://localhost:5000/api/leaderboard/students/top \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search students
curl "http://localhost:5000/api/leaderboard/students?search=alex" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by school
curl "http://localhost:5000/api/leaderboard/students?school=Tech%20High" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get teams leaderboard
curl "http://localhost:5000/api/leaderboard/teams?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get schools leaderboard
curl "http://localhost:5000/api/leaderboard/schools?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ⚡ **Performance Considerations**

### **Current Implementation:**
- Real-time calculations
- Database aggregations
- Efficient indexing

### **For Scale (10,000+ users):**

**1. Caching:**
```typescript
// Cache leaderboard for 5 minutes
const cachedLeaderboard = await redis.get('leaderboard:students');
if (cachedLeaderboard) {
  return JSON.parse(cachedLeaderboard);
}

const leaderboard = await calculateLeaderboard();
await redis.setex('leaderboard:students', 300, JSON.stringify(leaderboard));
```

**2. Materialized Views:**
```sql
-- Create materialized view for rankings
CREATE MATERIALIZED VIEW student_rankings AS
SELECT 
  u.id,
  u.firstName,
  u.lastName,
  SUM(p.amount) as totalTP,
  RANK() OVER (ORDER BY SUM(p.amount) DESC) as rank
FROM User u
LEFT JOIN Point p ON u.id = p.userId
GROUP BY u.id;

-- Refresh periodically
REFRESH MATERIALIZED VIEW student_rankings;
```

**3. Background Jobs:**
- Calculate rankings every 15 minutes via cron
- Store in database table
- API serves pre-calculated data

---

## ✅ **Summary**

**7 Endpoints:**
1. ✅ GET /api/leaderboard/me
2. ✅ GET /api/leaderboard/students
3. ✅ GET /api/leaderboard/students/top
4. ✅ GET /api/leaderboard/teams
5. ✅ GET /api/leaderboard/teams/top
6. ✅ GET /api/leaderboard/schools
7. ✅ GET /api/leaderboard/schools/top

**Features:**
- Real-time rankings
- Activity trends
- Rank change tracking
- Search & filters
- Pagination
- Badge display
- Percentile ranking

**Leaderboard system ready!** 🏆✨
