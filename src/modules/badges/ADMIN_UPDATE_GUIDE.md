# 📝 Admin Badge Update Guide

## 🎯 **Complete Badge Management System**

Admins can view, update, and manage all badge information through these endpoints.

---

## 📋 **Admin Endpoints for Badge Management**

### **1. Get All Badges (Database View)**

Get all badges with database details (not just static definitions).

```http
GET /api/badges/admin/all
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "id": "679a1234...",
        "badgeId": "rookie",
        "name": "Rookie",
        "description": "Earn your first 100 TIC Points",
        "icon": "🌱",
        "imageUrl": null,
        "category": "POINTS",
        "tier": "BRONZE",
        "points": 50,
        "rarity": 95,
        "criteria": "{\"type\":\"TOTAL_POINTS\",\"value\":100}"
      },
      // ... 30 more badges
    ],
    "total": 31
  }
}
```

**Use Case:** Admin dashboard badge list

---

### **2. Get Specific Badge Details**

Get detailed information about a single badge including award count.

```http
GET /api/badges/admin/badge/:badgeId
Authorization: Bearer ADMIN_TOKEN
```

**Example:**
```http
GET /api/badges/admin/badge/rookie
```

**Response:**
```json
{
  "success": true,
  "data": {
    "badge": {
      "id": "679a1234...",
      "badgeId": "rookie",
      "name": "Rookie",
      "description": "Earn your first 100 TIC Points",
      "icon": "🌱",
      "imageUrl": null,
      "category": "POINTS",
      "tier": "BRONZE",
      "points": 50,
      "rarity": 95,
      "criteria": "{\"type\":\"TOTAL_POINTS\",\"value\":100}"
    },
    "awardCount": 67
  }
}
```

**Use Case:** Badge edit form pre-fill

---

### **3. Update Badge Information**

Update any field of a badge.

```http
PUT /api/badges/admin/:badgeId
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "New description",
  "points": 75,
  "icon": "🌟",
  "imageUrl": "https://cdn.example.com/badge.png",
  "rarity": 90
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/badges/admin/rookie \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rookie Master",
    "description": "Earn your first 100 TIC Points - You are just getting started!",
    "points": 75,
    "icon": "🌟"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Badge updated successfully",
  "data": {
    "id": "679a1234...",
    "badgeId": "rookie",
    "name": "Rookie Master",
    "description": "Earn your first 100 TIC Points - You are just getting started!",
    "icon": "🌟",
    "points": 75,
    "rarity": 95,
    // ... other fields
  }
}
```

**Updatable Fields:**
- `name` - Badge display name
- `description` - Badge description text
- `icon` - Emoji or icon identifier
- `imageUrl` - URL to badge image
- `category` - Badge category (POINTS, SOCIAL, etc.)
- `tier` - Badge tier (BRONZE, SILVER, etc.)
- `points` - Bonus points awarded when earned
- `rarity` - Rarity score 1-100
- `criteria` - JSON string of requirements

**Note:** Only provided fields are updated. Others remain unchanged.

---

## 🖥️ **Admin UI Implementation**

### **Badge List Page**

```typescript
import { useEffect, useState } from 'react';

const BadgeListPage = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    const res = await fetch('/api/badges/admin/all', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    setBadges(data.data.badges);
    setLoading(false);
  };

  return (
    <div className="badge-list">
      <h1>Badge Management</h1>
      <button onClick={() => navigate('/admin/badges/new')}>
        Create New Badge
      </button>

      <table>
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>Category</th>
            <th>Tier</th>
            <th>Points</th>
            <th>Awarded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {badges.map(badge => (
            <tr key={badge.badgeId}>
              <td>{badge.icon}</td>
              <td>{badge.name}</td>
              <td>{badge.category}</td>
              <td>
                <span className={`tier-${badge.tier.toLowerCase()}`}>
                  {badge.tier}
                </span>
              </td>
              <td>{badge.points}</td>
              <td>
                <BadgeAwardCount badgeId={badge.badgeId} />
              </td>
              <td>
                <button onClick={() => navigate(`/admin/badges/${badge.badgeId}/edit`)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

### **Badge Edit Form**

```typescript
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BadgeEditPage = () => {
  const { badgeId } = useParams();
  const navigate = useNavigate();
  const [badge, setBadge] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    imageUrl: '',
    points: 0,
    rarity: 50,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBadge();
  }, [badgeId]);

  const fetchBadge = async () => {
    const res = await fetch(`/api/badges/admin/badge/${badgeId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    
    if (data.success) {
      setBadge(data.data.badge);
      setFormData({
        name: data.data.badge.name,
        description: data.data.badge.description,
        icon: data.data.badge.icon,
        imageUrl: data.data.badge.imageUrl || '',
        points: data.data.badge.points,
        rarity: data.data.badge.rarity,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/badges/admin/${badgeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        alert('Badge updated successfully!');
        navigate('/admin/badges');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to update badge');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' || name === 'rarity' 
        ? parseInt(value) 
        : value
    }));
  };

  if (!badge) return <div>Loading...</div>;

  return (
    <div className="badge-edit">
      <h1>Edit Badge: {badge.name}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Badge ID (Read-only)</label>
          <input type="text" value={badge.badgeId} disabled />
        </div>

        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Icon (Emoji) *</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="🏆"
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bonus Points *</label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Rarity (1-100) *</label>
            <input
              type="number"
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              min="1"
              max="100"
              required
            />
            <small>Higher = more common</small>
          </div>
        </div>

        <div className="form-group">
          <label>Category (Read-only)</label>
          <input type="text" value={badge.category} disabled />
        </div>

        <div className="form-group">
          <label>Tier (Read-only)</label>
          <input type="text" value={badge.tier} disabled />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/badges')}>
            Cancel
          </button>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div className="badge-preview">
        <h3>Preview</h3>
        <div className="badge-card">
          <div className="badge-icon">{formData.icon}</div>
          <h4>{formData.name}</h4>
          <p>{formData.description}</p>
          <span className="badge-points">+{formData.points} points</span>
        </div>
      </div>
    </div>
  );
};
```

---

### **Badge Statistics Widget**

```typescript
const BadgeStatsWidget = ({ badgeId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/badges/admin/badge/${badgeId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
    .then(res => res.json())
    .then(data => setStats(data.data));
  }, [badgeId]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="badge-stats-widget">
      <h3>{stats.badge.icon} {stats.badge.name}</h3>
      <div className="stat">
        <strong>{stats.awardCount}</strong>
        <span>Times Awarded</span>
      </div>
      <div className="stat">
        <strong>{stats.badge.points}</strong>
        <span>Points Value</span>
      </div>
      <div className="stat">
        <strong>{stats.badge.rarity}%</strong>
        <span>Rarity</span>
      </div>
    </div>
  );
};
```

---

## 🧪 **Testing Badge Updates**

### **Test Get All Badges:**
```bash
curl http://localhost:5000/api/badges/admin/all \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### **Test Get Specific Badge:**
```bash
curl http://localhost:5000/api/badges/admin/badge/rookie \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### **Test Update Badge:**
```bash
curl -X PUT http://localhost:5000/api/badges/admin/rookie \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rookie Champion",
    "points": 100
  }'
```

---

## ✅ **Summary**

**Admin Badge Management Routes:**

1. ✅ **GET /api/badges/admin/all** - List all badges
2. ✅ **GET /api/badges/admin/badge/:badgeId** - Get specific badge
3. ✅ **PUT /api/badges/admin/:badgeId** - Update badge

**Features:**
- View all badges with database details
- Get individual badge info + award count
- Update any badge field
- Changes reflect immediately
- Audit logging on updates

**Complete admin badge CRUD system!** 📝✨
