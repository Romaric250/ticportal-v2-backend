# 🏅 Badge System - Complete Documentation

## 🎯 **Overview**

Automatic badge awarding system that recognizes user achievements across points, content creation, social engagement, team participation, and special milestones.

---

## 🏆 **Badge Categories**

### 1. **POINTS Badges** 💎
| Badge | Requirement | Tier | Points | Icon |
|-------|------------|------|--------|------|
| Rookie | 100 total points | Bronze | 50 | 🌱 |
| Rising Star | 500 total points | Silver | 100 | ⭐ |
| Point Master | 1,000 total points | Gold | 200 | 🏆 |
| Legend | 5,000 total points | Diamond | 500 | 💎 |

### 2. **CONTENT Badges** ✍️
| Badge | Requirement | Tier | Points | Icon |
|-------|------------|------|--------|------|
| First Post | Create 1 post | Bronze | 25 | 📝 |
| Content Creator | Create 10 posts | Silver | 100 | ✍️ |
| Prolific Writer | Create 50 posts | Gold | 300 | 📚 |
| Viral Sensation | 100 likes on one post | Gold | 250 | 🔥 |
| Engagement King | 50 comments on one post | Platinum | 300 | 👑 |

### 3. **SOCIAL Badges** 💬
| Badge | Requirement | Tier | Points | Icon |
|-------|------------|------|--------|------|
| Friendly | Like 50 posts | Bronze | 50 | ❤️ |
| Commentator | Leave 25 comments | Silver | 100 | 💬 |
| Conversation Starter | Leave 100 comments | Gold | 200 | 🗣️ |

### 4. **TEAM Badges** 🤝
| Badge | Requirement | Tier | Points | Icon |
|-------|------------|------|--------|------|
| Team Player | Join 1 team | Bronze | 50 | 🤝 |
| Team Leader | 5+ members in team | Silver | 150 | 👥 |
| Squad Commander | 10+ members in team | Gold | 300 | ⚔️ |
| Deliverable Pro | Submit 3+ deliverables | Gold | 200 | 📦 |

### 5. **ACHIEVEMENT Badges** 🎖️
| Badge | Requirement | Tier | Points | Icon |
|-------|------------|------|--------|------|
| Early Bird | Post within 1h of joining | Bronze | 50 | 🐦 |
| Daily Active | 7-day login streak | Silver | 150 | 📅 |
| Dedicated | 30-day login streak | Gold | 500 | 🔥 |
| Night Owl | Post between 12 AM-4 AM | Bronze | 25 | 🦉 |
| Speed Reader | View 100 posts | Silver | 100 | 📖 |

### 6. **SPECIAL Badges** ⭐
| Badge | Requirement | Tier | Points | Icon |
|-------|------------|------|--------|------|
| Founding Member | Joined in launch month | Platinum | 1,000 | 🌟 |
| Hackathon Winner | Win a hackathon | Diamond | 2,000 | 🏅 |
| Bug Hunter | Report critical bug | Gold | 500 | 🐛 |

---

## 🔄 **Auto-Awarding Logic**

Badges are automatically checked and awarded after these actions:
- ✅ Creating a post
- ✅ Liking a post
- ✅ Commenting on a post
- ✅ Viewing posts
- ✅ Joining a team
- ✅ Points milestones reached

---

## 📡 **API Endpoints**

### **Get All Available Badges**
```http
GET /api/badges/all
```

**Response:**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "id": "rookie",
        "name": "Rookie",
        "description": "Earn your first 100 TIC Points",
        "icon": "🌱",
        "category": "POINTS",
        "tier": "BRONZE",
        "points": 50,
        "requirement": {
          "type": "TOTAL_POINTS",
          "value": 100,
          "description": "Reach 100 total points"
        },
        "rarity": 95
      }
    ],
    "total": 27
  }
}
```

### **Get My Badges**
```http
GET /api/badges/my-badges
```

**Response:**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "userId": "...",
        "badgeId": "rookie",
        "awardedAt": "2024-01-16T...",
        "badge": {
          "id": "rookie",
          "name": "Rookie",
          ...
        }
      }
    ],
    "total": 5
  }
}
```

### **Get Badge Progress**
```http
GET /api/badges/progress
```

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "badgeId": "rookie",
        "badge": {...},
        "currentValue": 75,
        "requiredValue": 100,
        "percentage": 75,
        "earned": false
      },
      {
        "badgeId": "first_post",
        "badge": {...},
        "currentValue": 1,
        "requiredValue": 1,
        "percentage": 100,
        "earned": true
      }
    ],
    "earnedCount": 3,
    "totalCount": 27
  }
}
```

### **Check and Award Badges**
```http
POST /api/badges/check
```

Manually triggers badge checking and awarding.

**Response:**
```json
{
  "success": true,
  "data": {
    "newBadges": ["rookie", "first_post"],
    "count": 2
  }
}
```

### **Get User's Badges (Public)**
```http
GET /api/badges/user/:userId
```

View another user's badges.

### **Get Badge Leaderboard**
```http
GET /api/badges/leaderboard?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": {
        "id": "...",
        "firstName": "John",
        "lastName": "Doe",
        "profilePhoto": "..."
      },
      "badgeCount": 15
    }
  ]
}
```

---

## 💻 **Frontend Integration**

### **Display User Badges**

```tsx
import { useEffect, useState } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: string;
  category: string;
}

export const BadgeDisplay = () => {
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/badges/my-badges', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setBadges(data.data.badges));
  }, []);

  return (
    <div className="badges-grid">
      {badges.map(({ badge, awardedAt }) => (
        <div key={badge.id} className="badge-card">
          <div className="badge-icon">{badge.icon}</div>
          <h3>{badge.name}</h3>
          <p>{badge.description}</p>
          <span className={`tier-${badge.tier.toLowerCase()}`}>
            {badge.tier}
          </span>
          <small>Earned: {new Date(awardedAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};
```

### **Badge Progress Bars**

```tsx
export const BadgeProgress = () => {
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/badges/progress', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setProgress(data.data.progress));
  }, []);

  return (
    <div className="badge-progress">
      {progress.filter(p => !p.earned).map(item => (
        <div key={item.badgeId} className="progress-item">
          <div className="badge-info">
            <span className="icon">{item.badge.icon}</span>
            <div>
              <h4>{item.badge.name}</h4>
              <p>{item.badge.description}</p>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          
          <span className="progress-text">
            {item.currentValue} / {item.requiredValue} ({item.percentage}%)
          </span>
        </div>
      ))}
    </div>
  );
};
```

### **Badge Notification**

```tsx
// Listen for new badges via WebSocket or check after actions
const checkForNewBadges = async () => {
  const res = await fetch('/api/badges/check', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await res.json();
  
  if (data.data.newBadges.length > 0) {
    // Show notification
    data.data.newBadges.forEach((badgeId: string) => {
      showBadgeNotification(badgeId);
    });
  }
};

// Call after user actions
const handleCreatePost = async (content: string) => {
  await createPost(content);
  await checkForNewBadges(); // Check for new badges!
};
```

---

## 🎨 **CSS Styling**

```css
.badge-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  text-align: center;
}

.badge-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.tier-bronze {
  color: #cd7f32;
  font-weight: bold;
}

.tier-silver {
  color: #c0c0c0;
  font-weight: bold;
}

.tier-gold {
  color: #ffd700;
  font-weight: bold;
}

.tier-platinum {
  color: #e5e4e2;
  font-weight: bold;
}

.tier-diamond {
  color: #b9f2ff;
  font-weight: bold;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}
```

---

## 🔧 **Adding New Badges**

1. Add badge definition to `badges.ts`:
```typescript
NEW_BADGE: {
  id: "new_badge",
  name: "New Badge",
  description: "Do something awesome",
  icon: "🎉",
  category: BadgeCategory.ACHIEVEMENT,
  tier: BadgeTier.GOLD,
  points: 200,
  requirement: {
    type: "CUSTOM_METRIC",
    value: 50,
    description: "Achieve 50 of something",
  },
  rarity: 30,
},
```

2. Add checking logic in `service.ts`:
```typescript
case "CUSTOM_METRIC":
  const metric = await getCustomMetric(userId);
  return metric >= value;
```

3. Badge automatically awards when conditions are met!

---

## 📊 **Integration with App**

Add to `app.ts`:
```typescript
import badgeRoutes from "./modules/badges/routes";

// Register routes
app.use("/api", badgeRoutes);
```

---

## ✅ **Summary**

**27 badges** across 6 categories:
- ✅ Auto-awarded after user actions
- ✅ Progress tracking
- ✅ Points rewards
- ✅ Leaderboard
- ✅ Public profiles
- ✅ Easy to extend

**Badges boost engagement and reward active users!** 🏅✨
