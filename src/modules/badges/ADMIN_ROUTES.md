# 🛠️ Badge Admin Routes - Complete Documentation

## 🔐 **Admin Access Required**

All admin routes require authentication with `ADMIN` or `SUPER_ADMIN` role.

**Headers:**
```http
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 📋 **Admin Endpoints**

### **1. Award Badge to User**

Manually award a badge to a specific user.

```http
POST /api/badges/admin/award
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "userId": "695a331a785c23eb1c7eb0c4",
  "badgeId": "hackathon_winner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Badge awarded successfully",
  "data": {
    "userId": "695a331a785c23eb1c7eb0c4",
    "badgeId": "hackathon_winner"
  }
}
```

**Use Cases:**
- Award special badges (Hackathon Winner, Bug Hunter)
- Manually reward users for contributions
- Correct missing badges

---

### **2. Revoke Badge from User**

Remove a badge from a user.

```http
DELETE /api/badges/admin/revoke
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "userId": "695a331a785c23eb1c7eb0c4",
  "badgeId": "rookie"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Badge revoked successfully",
  "data": {
    "userId": "695a331a785c23eb1c7eb0c4",
    "badgeId": "rookie"
  }
}
```

**Use Cases:**
- Remove incorrectly awarded badges
- Moderate abuse
- Reset user badges

---

### **3. Update Badge Information**

Modify badge properties (name, description, points, etc.).

```http
PUT /api/badges/admin/:badgeId
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "name": "Rookie Master",
  "description": "Updated description",
  "points": 75,
  "icon": "🌟",
  "rarity": 90
}
```

**Response:**
```json
{
  "success": true,
  "message": "Badge updated successfully",
  "data": {
    "id": "...",
    "badgeId": "rookie",
    "name": "Rookie Master",
    "description": "Updated description",
    "points": 75,
    "icon": "🌟",
    "rarity": 90
  }
}
```

**Updatable Fields:**
- `name` - Badge display name
- `description` - Badge description
- `icon` - Emoji or icon
- `imageUrl` - Badge image URL
- `category` - Badge category
- `tier` - Badge tier
- `points` - Bonus points awarded
- `rarity` - Rarity score (1-100)
- `criteria` - JSON requirement string

---

### **4. Get Badge Statistics**

Get comprehensive badge system statistics.

```http
GET /api/badges/admin/stats
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBadges": 31,
    "totalAwarded": 245,
    "averageBadgesPerUser": 2.45,
    "mostPopular": [
      {
        "badge": {
          "badgeId": "first_post",
          "name": "First Post",
          "icon": "📝"
        },
        "awardedCount": 89
      },
      {
        "badge": {
          "badgeId": "rookie",
          "name": "Rookie",
          "icon": "🌱"
        },
        "awardedCount": 67
      }
    ],
    "recentlyAwarded": [
      {
        "badgeId": "content_creator",
        "user": {
          "id": "...",
          "firstName": "John",
          "lastName": "Doe"
        },
        "earnedAt": "2024-01-17T..."
      }
    ],
    "distribution": [
      { "category": "POINTS", "_count": { "category": 4 } },
      { "category": "CONTENT", "_count": { "category": 5 } },
      { "category": "SOCIAL", "_count": { "category": 3 } }
    ]
  }
}
```

**Use Cases:**
- Monitor badge system health
- Identify popular badges
- Track badge distribution
- Analytics and reporting

---

### **5. Sync Badges for All Users**

Manually trigger badge check for all users.

```http
POST /api/badges/admin/sync-all
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Badge sync completed",
  "data": {
    "totalBadgesAwarded": 47
  }
}
```

**Use Cases:**
- Fix missing badges after system updates
- Bulk badge award after criteria changes
- Manual sync when cron fails
- Testing

**⚠️ Warning:** This can be resource-intensive for large user bases.

---

### **6. Get User Badge Details (Admin View)**

Get detailed badge information for a specific user.

```http
GET /api/badges/admin/user-badges/:userId
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "id": "...",
        "userId": "...",
        "badgeId": "rookie",
        "earnedAt": "2024-01-15T...",
        "badge": {
          "name": "Rookie",
          "description": "Earn your first 100 TIC Points",
          "icon": "🌱",
          "points": 50
        }
      }
    ],
    "progress": [
      {
        "badgeId": "rising_star",
        "badge": {...},
        "currentValue": 250,
        "requiredValue": 500,
        "percentage": 50,
        "earned": false
      }
    ],
    "earnedCount": 5,
    "totalCount": 31
  }
}
```

**Use Cases:**
- User support
- Badge verification
- Progress tracking
- Debugging

---

## 🔧 **Admin Tools**

### **Batch Award Badges**

Award same badge to multiple users:

```javascript
const userIds = ["userId1", "userId2", "userId3"];
const badgeId = "founding_member";

for (const userId of userIds) {
  await fetch('/api/badges/admin/award', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, badgeId })
  });
}
```

### **Update Multiple Badges**

Bulk update badge properties:

```javascript
const badgeUpdates = [
  { badgeId: 'rookie', points: 60 },
  { badgeId: 'rising_star', points: 120 }
];

for (const update of badgeUpdates) {
  await fetch(`/api/badges/admin/${update.badgeId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ points: update.points })
  });
}
```

---

## 📊 **Admin Dashboard Examples**

### **Badge Overview Widget**

```typescript
const BadgeOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/badges/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setStats(data.data));
  }, []);

  return (
    <div className="badge-stats">
      <h2>Badge System Overview</h2>
      <div className="stats-grid">
        <div className="stat">
          <h3>{stats?.totalBadges}</h3>
          <p>Total Badges</p>
        </div>
        <div className="stat">
          <h3>{stats?.totalAwarded}</h3>
          <p>Badges Awarded</p>
        </div>
        <div className="stat">
          <h3>{stats?.averageBadgesPerUser.toFixed(2)}</h3>
          <p>Avg per User</p>
        </div>
      </div>

      <h3>Most Popular Badges</h3>
      <ul>
        {stats?.mostPopular.map(item => (
          <li key={item.badge.badgeId}>
            {item.badge.icon} {item.badge.name} - {item.awardedCount} awarded
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### **User Badge Management**

```typescript
const UserBadgeManager = ({ userId }) => {
  const [userBadges, setUserBadges] = useState([]);

  const awardBadge = async (badgeId) => {
    await fetch('/api/badges/admin/award', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, badgeId })
    });
    
    // Refresh badges
    fetchUserBadges();
  };

  const revokeBadge = async (badgeId) => {
    await fetch('/api/badges/admin/revoke', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, badgeId })
    });
    
    fetchUserBadges();
  };

  return (
    <div className="user-badge-manager">
      <h2>Manage User Badges</h2>
      
      {/* List earned badges */}
      <div className="earned-badges">
        {userBadges.badges?.map(badge => (
          <div key={badge.badgeId}>
            {badge.badge.icon} {badge.badge.name}
            <button onClick={() => revokeBadge(badge.badgeId)}>
              Revoke
            </button>
          </div>
        ))}
      </div>

      {/* Award new badge */}
      <select onChange={(e) => awardBadge(e.target.value)}>
        <option>Award badge...</option>
        {/* List available badges */}
      </select>
    </div>
  );
};
```

---

## 🔒 **Security Considerations**

### **Role Authorization**

All admin routes check for admin roles:

```typescript
// In authorize middleware
if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
  return res.status(403).json({
    success: false,
    message: 'Forbidden - Admin access required'
  });
}
```

### **Audit Logging**

All admin actions are logged:

```typescript
logger.info({ 
  admin: adminId, 
  action: 'BADGE_AWARDED',
  userId, 
  badgeId 
}, 'Admin awarded badge');
```

---

## 🧪 **Testing Admin Routes**

### **Test Badge Award**

```bash
curl -X POST http://localhost:5000/api/badges/admin/award \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "badgeId": "founding_member"
  }'
```

### **Test Stats**

```bash
curl http://localhost:5000/api/badges/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### **Test Sync**

```bash
curl -X POST http://localhost:5000/api/badges/admin/sync-all \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## ✅ **Summary**

**6 Admin Endpoints:**
1. ✅ Award badge
2. ✅ Revoke badge  
3. ✅ Update badge
4. ✅ Get stats
5. ✅ Sync all users
6. ✅ Get user details

**Access Control:**
- All routes require admin authentication
- Role-based authorization
- Audit logging enabled

**Admin dashboard ready!** 🛠️✨
