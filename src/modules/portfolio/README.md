# 🎨 Portfolio API - Complete Documentation

## 🎯 **Overview**

Single comprehensive endpoint that returns complete portfolio data for the authenticated user.

---

## 📋 **API Endpoint**

### **GET /api/portfolio**

Get complete portfolio overview for the authenticated user.

```http
GET /api/portfolio
Authorization: Bearer YOUR_TOKEN
```

---

## 📤 **Response Structure**

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "695a331a785c23eb1c7eb0c4",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "avatarUrl": "https://...",
      "initials": "JD",
      "school": "Lincoln High School",
      "grade": 11,
      "level": 3,
      "levelTitle": "Finalist",
      "totalXP": 4250,
      "globalRank": 42,
      "hoursLogged": 124,
      "bio": "Passionate about innovation and technology..."
    },
    "hackathonJourney": [
      {
        "id": "phase_1",
        "phase": "Bootcamp Phase",
        "status": "completed",
        "completedAt": "2024-10-22T12:00:00Z",
        "startedAt": "2024-09-01T08:00:00Z",
        "description": "Completed 5 of 5 modules on Design Thinking and Problem Identification.",
        "tags": ["Design Thinking", "Ideation"],
        "icon": "check",
        "progress": 100,
        "modulesCompleted": 5,
        "totalModules": 5
      },
      {
        "id": "phase_2",
        "phase": "Team Formation",
        "status": "completed",
        "completedAt": "2024-11-05T14:30:00Z",
        "description": "Formed 'Team Hydro' with 4 peers.",
        "teamMembers": [
          {
            "id": "user_1",
            "name": "Member 1",
            "avatarUrl": "https://...",
            "initials": "M1"
          }
        ],
        "icon": "users",
        "progress": 100
      },
      {
        "id": "phase_3",
        "phase": "Summit Finalist",
        "status": "pending",
        "description": "Develop MVP and Pitch Deck.",
        "icon": "rocket",
        "progress": 0
      },
      {
        "id": "phase_4",
        "phase": "Final Awards",
        "status": "pending",
        "description": "The big day. Presentation and scoring.",
        "icon": "trophy",
        "progress": 0
      }
    ],
    "featuredProject": null,
    "certifications": [
      {
        "id": "cert_1",
        "title": "Design Thinking Fundamentals",
        "issuer": "TIC SUMMIT",
        "description": "Module: Introduction to Design Thinking",
        "issuedAt": "2024-10-22T12:00:00Z",
        "certificateUrl": null,
        "icon": "check",
        "type": "course_completion"
      }
    ],
    "badges": [
      {
        "id": "badge_1",
        "badgeId": "rookie",
        "name": "Rookie",
        "icon": "🌱",
        "color": "amber",
        "earnedAt": "2024-09-05T10:00:00Z",
        "locked": false,
        "points": 50,
        "category": "MILESTONE",
        "tier": "BRONZE"
      },
      {
        "id": "badge_2",
        "badgeId": "team_player",
        "name": "Team Player",
        "icon": "👥",
        "color": "sky",
        "earnedAt": "2024-11-05T14:00:00Z",
        "locked": false,
        "points": 75,
        "category": "SOCIAL",
        "tier": "BRONZE"
      },
      {
        "id": "badge_3",
        "badgeId": "legend",
        "name": "Legend",
        "icon": "🔒",
        "color": "slate",
        "earnedAt": null,
        "locked": true,
        "points": 500,
        "category": "MILESTONE",
        "tier": "PLATINUM"
      }
    ],
    "mentorFeedback": [],
    "skills": []
  }
}
```

---

## 📊 **Field Descriptions**

### **Profile**
- `id` - User unique identifier
- `name` - Full name
- `email` - Email address
- `avatarUrl` - Profile photo URL or null
- `initials` - Generated initials (e.g., "JD")
- `school` - School name or null
- `grade` - Grade level or null
- `level` - Current level number (1-8)
- `levelTitle` - Level name (Beginner, Novice, etc.)
- `totalXP` - Total TIC Points earned
- `globalRank` - Position in global leaderboard
- `hoursLogged` - Estimated hours of activity
- `bio` - User bio or null

### **Hackathon Journey**
Array of phases representing the user's hackathon progress:

- `id` - Phase identifier
- `phase` - Phase name
- `status` - "completed" | "in_progress" | "pending" | "locked"
- `completedAt` - Completion date (optional)
- `startedAt` - Start date (optional)
- `scheduledDate` - Scheduled date (optional)
- `description` - Phase description
- `tags` - Array of tags (optional)
- `icon` - Icon name
- `progress` - Progress percentage (0-100)
- `teamMembers` - Array of team members (optional)
- `milestones` - Array of milestones (optional)
- `modulesCompleted` - Completed modules count (optional)
- `totalModules` - Total modules count (optional)

### **Featured Project**
- Currently returns `null` (TODO: Implement when project system is ready)
- Will include project details, images, stats, etc.

### **Certifications**
Array of earned certifications:

- `id` - Certification identifier
- `title` - Certificate title
- `issuer` - Issuing organization
- `description` - Description
- `issuedAt` - Issue date
- `certificateUrl` - Certificate URL or null
- `icon` - Icon name
- `type` - "course_completion" | "achievement" | "hackathon" | "mentorship"

### **Badges**
Array of all badges (earned and locked):

- `id` - User badge record ID
- `badgeId` - Badge identifier
- `name` - Badge name
- `icon` - Badge emoji/icon
- `color` - Badge color theme
- `earnedAt` - Date earned or null (locked)
- `locked` - Whether badge is locked
- `points` - Badge point value (optional)
- `category` - Badge category (optional)
- `tier` - Badge tier (optional)

### **Mentor Feedback**
- Currently returns empty array (TODO: Implement when mentor system is ready)
- Will include feedback from mentors

### **Skills**
- Currently returns empty array (TODO: Implement skills tracking)
- Will include user skills with proficiency levels

---

## 🎯 **Level System**

| Level | Name | Min Points |
|-------|------|------------|
| 1 | Beginner | 0 |
| 2 | Novice | 500 |
| 3 | Finalist | 1,000 |
| 4 | Scholar | 2,000 |
| 5 | Advanced | 3,500 |
| 6 | Expert | 5,000 |
| 7 | Master | 7,500 |
| 8 | Legend | 10,000+ |

---

## 🔍 **Data Sources**

The endpoint aggregates data from:

✅ **User Profile** - `User` model  
✅ **Points** - `Point` model  
✅ **Learning Progress** - `LearningEnrollment`, `ModuleCompletion`  
✅ **Team** - `TeamMember` model  
✅ **Certifications** - Derived from module completions  
✅ **Badges** - `UserBadge`, `Badge` models  
⏳ **Featured Project** - Coming soon  
⏳ **Mentor Feedback** - Coming soon  
⏳ **Skills** - Coming soon

---

## ⚡ **Performance**

**Parallel Queries:**
All data fetched in parallel using `Promise.all()` for maximum speed.

```typescript
const [profile, journey, project, certs, badges, feedback, skills] =
  await Promise.all([
    getProfileInfo(),
    getHackathonJourney(),
    getFeaturedProject(),
    getCertifications(),
    getBadges(),
    getMentorFeedback(),
    getSkills(),
  ]);
```

**Typical Response Time:** 150-400ms

---

## 🧪 **Testing**

```bash
# Get portfolio overview
curl http://localhost:5000/api/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return complete portfolio data
```

---

## 🎨 **Frontend Integration**

```typescript
import { useEffect, useState } from 'react';

interface Portfolio {
  profile: any;
  hackathonJourney: any[];
  featuredProject: any;
  certifications: any[];
  badges: any[];
  mentorFeedback: any[];
  skills: any[];
}

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        setPortfolio(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!portfolio) return <div>Error loading portfolio</div>;

  return (
    <div className="portfolio">
      {/* Profile Section */}
      <section className="profile">
        <img src={portfolio.profile.avatarUrl || `/avatar/${portfolio.profile.initials}`} />
        <h1>{portfolio.profile.name}</h1>
        <p>{portfolio.profile.school}</p>
        <div className="stats">
          <div>Level {portfolio.profile.level} - {portfolio.profile.levelTitle}</div>
          <div>{portfolio.profile.totalXP} XP</div>
          <div>Rank #{portfolio.profile.globalRank}</div>
        </div>
      </section>

      {/* Hackathon Journey */}
      <section className="journey">
        <h2>Hackathon Journey</h2>
        <div className="phases">
          {portfolio.hackathonJourney.map(phase => (
            <div key={phase.id} className={`phase phase-${phase.status}`}>
              <div className="icon">{phase.icon}</div>
              <h3>{phase.phase}</h3>
              <p>{phase.description}</p>
              <div className="progress">
                <div style={{ width: `${phase.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {portfolio.certifications.length > 0 && (
        <section className="certifications">
          <h2>Certifications</h2>
          <div className="cert-grid">
            {portfolio.certifications.map(cert => (
              <div key={cert.id} className="cert-card">
                <div className="icon">{cert.icon}</div>
                <h3>{cert.title}</h3>
                <p>{cert.issuer}</p>
                <small>{new Date(cert.issuedAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Badges */}
      {portfolio.badges.length > 0 && (
        <section className="badges">
          <h2>Trophy Case</h2>
          <div className="badge-grid">
            {portfolio.badges.map(badge => (
              <div 
                key={badge.id} 
                className={`badge badge-${badge.color} ${badge.locked ? 'locked' : ''}`}
              >
                <span className="icon">{badge.icon}</span>
                <h4>{badge.name}</h4>
                {!badge.locked && <p>+{badge.points} XP</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PortfolioPage;
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

**Endpoint:** `GET /api/portfolio`

**Features:**
- ✅ Single request for all portfolio data
- ✅ Parallel data fetching (fast!)
- ✅ Profile with stats and rankings
- ✅ Hackathon journey phases
- ✅ Course completion certificates
- ✅ Badge trophy case (earned + locked)
- ⏳ Featured project (coming soon)
- ⏳ Mentor feedback (coming soon)
- ⏳ Skills (coming soon)

**Response Time:** ~150-400ms  
**Authentication:** Required  
**Caching:** Recommended (5-15 minutes)

**Portfolio API ready!** 🎨✨
