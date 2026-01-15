# 🎯 Feed Points & Gamification System

A comprehensive points and achievement system for the TIC Feed that rewards user engagement and quality content.

## ✅ Features Implemented:

### 📝 **Content Creation Rewards**
- **Create Post**: 100 TIC Points
- **Add Images**: +20 bonus points
- **Add Video**: +30 bonus points  
- **First Post of Day**: +50 bonus points

### ❤️ **Engagement Rewards**
- **Like a Post**: 2 points (to liker)
- **Receive a Like**: 5 points (to author)
- **Comment on Post**: 15 points (to commenter)
- **Receive Comment**: 10 points (to author)
- **Post Bookmarked**: 3 points (to author)

### 🏆 **Milestone Achievements**
- **Popular Post** (20+ likes): 100 bonus points (one-time)
- **Viral Post** (50+ likes): 200 bonus points (one-time)
- **Engagement Master** (50+ comments): 150 bonus points (one-time)

### 📊 **Activity Tracking**
All feed interactions are tracked in the `UserActivity` table:
- Post creation, updates, deletions
- Likes, comments, bookmarks
- Views and engagement metrics
- Milestone achievements

---

## 🚀 API Endpoints:

### Get Points Summary
```http
GET /api/feed/points/summary
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPoints": 325,
    "breakdown": [
      {
        "activity": "FEED_POST_CREATED",
        "points": 120,
        "count": 1
      },
      {
        "activity": "FEED_POST_LIKED",
        "points": 15,
        "count": 5
      },
      {
        "activity": "FEED_COMMENT_CREATED",
        "points": 75,
        "count": 5
      },
      {
        "activity": "FEED_POST_POPULAR",
        "points": 100,
        "count": 1
      }
    ]
  }
}
```

---

## 🎮 Gamification Flow:

### Example: User Posts with Images
```typescript
// 1. User creates post with 2 images
POST /api/feed/posts
{
  "content": "Check out my project!",
  "category": "TEAM_UPDATES",
  "imageUrls": ["https://...", "https://..."]
}

// Points awarded:
// - Base post: 100 points
// - With images: +20 points
// - First post today: +50 points
// Total: 170 points ✨
```

### Example: Post Goes Viral
```typescript
// Post receives 25 likes → Popular Post achievement
// Author automatically receives:
// - 100 bonus points (one-time)
// - 5 points per like = 125 points
// Total from likes: 225 points 🔥

// Post reaches 50 likes → Viral Post achievement  
// Author receives additional:
// - 200 bonus points (one-time)
// - Total milestone bonuses: 300 points 🚀
```

---

## 📈 Integration Points:

### Automatic Points Award:
Points are automatically awarded when users:
1. ✅ Create posts (`createPost`)
2. ✅ Comment on posts (`createComment`)
3. ⚠️ Like posts (needs manual integration - see POINTS_INTEGRATION.md)
4. ⚠️ Bookmark posts (needs manual integration)
5. ✅ Reach milestones (automatic on like/comment increments)

### Manual Integration Required:
See `POINTS_INTEGRATION.md` for step-by-step instructions to add:
- Like points
- Bookmark points
- Comment like points
- View tracking

---

## 🔍 Points Service Methods:

```typescript
import { FeedPointsService } from './points.service';

// Award post creation points
await FeedPointsService.awardPostCreationPoints(
  userId,
  postId,
  hasImages,
  hasVideo
);

// Award like points (given & received)
await FeedPointsService.awardLikeGivenPoints(userId, postId);
await FeedPointsService.awardLikeReceivedPoints(authorId, postId, likerId);

// Award comment points
await FeedPointsService.awardCommentGivenPoints(userId, postId, commentId);
await FeedPointsService.awardCommentReceivedPoints(authorId, postId, commenterId);

// Award bookmark points
await FeedPointsService.awardBookmarkReceivedPoints(authorId, postId, bookmarkerId);

// Check milestones (automatic)
await FeedPointsService.checkPostMilestones(postId, authorId);

// Get user summary
const summary = await FeedPointsService.getUserFeedPointsSummary(userId);
```

---

## 💡 Future Enhancements:

### Planned Features:
- [ ] **Streak Bonuses**: Daily posting streaks
- [ ] **Quality Scores**: Bonus for high-engagement posts
- [ ] **Achievement Badges**: Visual achievements for milestones
- [ ] **Leaderboards**: Top contributors, most viral posts
- [ ] **Point Multipliers**: Special events with 2x points
- [ ] **Redemption System**: Exchange points for rewards
- [ ] **Referral Bonuses**: Points for bringing new users

### Analytics Dashboard:
- Most engaging content by category
- Top point earners
- Trending posts by engagement
- Daily/weekly/monthly activity charts
- Milestone achievement timeline

---

## 🧪 Testing:

```bash
# 1. Create a post
POST /api/feed/posts
{
  "content": "Test post",
  "category": "GENERAL",
  "imageUrls": ["https://..."]
}
# Expected: 120 points (100 + 20 for image)

# 2. Check points
GET /api/feed/points/summary
# Should show 120 points

# 3. Get others to like/comment
# Each like: +5 to you, +2 to liker
# Each comment: +10 to you, +15 to commenter

# 4. Reach 20 likes
# Automatic: +100 bonus points (Popular Post)

# 5. Reach 50 likes  
# Automatic: +200 bonus points (Viral Post)
```

---

## 📊 Database Schema:

### Points Table:
```prisma
model Point {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  amount    Int
  reason    String
  activity  String?
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```

### Activity Table:
```prisma
model UserActivity {
  id            String       @id @default(auto()) @map("_id") @db.ObjectId
  userId        String       @db.ObjectId
  type          ActivityType
  action        String
  metadata      Json?
  pointsAwarded Int          @default(0)
  createdAt     DateTime     @default(now())
}
```

---

## 🎉 Benefits:

✅ **User Engagement**: Rewards active participation  
✅ **Quality Content**: Incentivizes good posts  
✅ **Community Growth**: Encourages interactions  
✅ **Gamification**: Makes platform fun and addictive  
✅ **Analytics**: Rich data for insights  
✅ **Scalable**: Easy to add new point triggers  

**Start earning TIC Points today!** 🚀
