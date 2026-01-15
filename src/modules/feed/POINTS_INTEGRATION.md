# Feed Points Integration - Manual Steps

## ✅ Already Integrated:

1. ✅ **Post Creation** - Awards 100 points + bonuses
2. ✅ **Comment Creation** - Awards 15 points to commenter + 10 to post author

## 🔧 Manual Integration Needed:

### 1. Update `togglePostLike` in service.ts

Find this section (around line 460):
```typescript
} else {
  // Like
  await db.feedLike.create({
    data: {
      postId,
      userId,
    },
  });

  await db.feedPost.update({
    where: { id: postId },
    data: { likesCount: { increment: 1 } },
  });

  isLiked = true;
  logger.info({ userId, postId }, "Post liked");
}
```

**Add after the feedPost.update:**
```typescript
  // Award points to the liker
  await FeedPointsService.awardLikeGivenPoints(userId, postId);

  // Award points to the post author
  await FeedPointsService.awardLikeReceivedPoints(post.authorId, postId, userId);
```

### 2. Update `toggleCommentLike` in service.ts

Find the comment like creation section (around line 750):
```typescript
} else {
  // Like comment
  await db.feedLike.create({
    data: {
      commentId,
      userId,
    },
  });

  await db.feedComment.update({
    where: { id: commentId },
    data: { likesCount: { increment: 1 } },
  });

  isLiked = true;
}
```

**Add after feedComment.update:**
```typescript
  // Award points to comment author (smaller reward than post like)
  const comment = await db.feedComment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  });

  if (comment && comment.authorId !== userId) {
    await db.point.create({
      data: {
        userId: comment.authorId,
        amount: 2,
        reason: "Comment liked",
        activity: "FEED_COMMENT_LIKED",
      },
    });
  }
```

### 3. Update `toggleBookmark` in service.ts

Find the bookmark creation section (around line 840):
```typescript
} else {
  // Create bookmark
  await db.feedBookmark.create({
    data: {
      postId,
      userId,
    },
  });

  isBookmarked = true;
  logger.info({ userId, postId }, "Post bookmarked");
}
```

**Add after db.feedBookmark.create:**
```typescript
  // Award points to post author
  const post = await db.feedPost.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (post) {
    await FeedPointsService.awardBookmarkReceivedPoints(post.authorId, postId, userId);
  }
```

### 4. Update `recordView` in service.ts

Find the view recording section (around line 800):
```typescript
static async recordView(userId: string, input: RecordViewInput) {
  // ...existing code...

  // Increment view count
  await db.feedPost.update({
    where: { id: input.postId },
    data: { viewsCount: { increment: 1 } },
  });
```

**Add after view count update:**
```typescript
  // Track view activity (no points, just analytics)
  await FeedPointsService.trackPostView(userId, input.postId, input.duration);
```

---

## 🎯 Points Breakdown:

| Action | Points | Recipient |
|--------|--------|-----------|
| Create Post | 100 | Post Author |
| Add Images | +20 | Post Author |
| Add Video | +30 | Post Author |
| First Post of Day | +50 | Post Author |
| Like a Post | 2 | Liker |
| Receive a Like | 5 | Post Author |
| Comment on Post | 15 | Commenter |
| Receive Comment | 10 | Post Author |
| Bookmark Received | 3 | Post Author |
| Post Reaches 20 Likes | 100 | Post Author (one-time) |
| Post Reaches 50 Likes | 200 | Post Author (one-time) |
| Post Reaches 50 Comments | 150 | Post Author (one-time) |

---

## 🧪 Testing Points:

```bash
# 1. Create a post (should get 100+ points)
POST /api/feed/posts
{
  "content": "Test post",
  "category": "GENERAL",
  "imageUrls": ["https://..."]  # +20 bonus
}

# 2. Check points
GET /api/feed/points/summary

# Response:
{
  "success": true,
  "data": {
    "totalPoints": 120,
    "breakdown": [
      {
        "activity": "FEED_POST_CREATED",
        "points": 120,
        "count": 1
      }
    ]
  }
}

# 3. Like a post (should get 2 points, author gets 5)
POST /api/feed/posts/:postId/like

# 4. Comment (should get 15 points, author gets 10)
POST /api/feed/posts/:postId/comments
{
  "content": "Great post!"
}
```

---

## 📊 Analytics Dashboard Integration:

The points system tracks all activities, so you can build dashboards showing:
- Most engaging posts (by likes/comments)
- Top contributors (by total points)
- Daily/weekly activity trends
- Milestone achievements

All data is available through the existing points and activity tables!