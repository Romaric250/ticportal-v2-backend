# TIC Feed Module

A comprehensive, real-time social feed system for the TIC Summit Portal with WebSocket support, advanced filtering, and enterprise-grade scalability.

## Features

✅ **Real-time Updates** - WebSocket-powered live feed  
✅ **Multi-Category System** - Announcements, Mentorship, Teams, Achievements, Events, Learning, Tech News, Opportunities, General  
✅ **Role-Based Visibility** - PUBLIC, STUDENTS_ONLY, MENTORS_ONLY, TEAM_ONLY, ADMIN_ONLY  
✅ **Rich Media Support** - Images, videos, file attachments  
✅ **Nested Comments** - Infinite comment threading  
✅ **Engagement Metrics** - Likes, views, bookmarks, shares  
✅ **Content Moderation** - Reporting system with admin review  
✅ **Advanced Search** - Full-text search, tag filtering  
✅ **Pinned Posts** - Admin-pinnable important announcements  
✅ **Trending Tags** - Auto-calculated trending topics  
✅ **Presence Tracking** - Real-time "who's viewing" indicators  

---

## Database Schema

### Models

- **FeedPost** - Main posts with categories, visibility, media
- **FeedAttachment** - File attachments (documents, images, videos)
- **FeedLike** - Likes for posts and comments
- **FeedComment** - Comments with nested replies
- **FeedView** - View tracking with analytics
- **FeedBookmark** - Saved posts
- **FeedReport** - Content reports for moderation
- **FeedPresence** - Real-time user presence

### Categories

```typescript
enum FeedCategory {
  ANNOUNCEMENTS      // Official announcements
  MENTORSHIP        // Mentorship content
  TEAM_UPDATES      // Team progress updates
  ACHIEVEMENTS      // User achievements
  EVENTS            // Event announcements
  LEARNING          // Learning resources
  TECH_NEWS         // Tech industry news
  OPPORTUNITIES     // Jobs, internships
  GENERAL           // General discussions
}
```

### Visibility Levels

```typescript
enum FeedVisibility {
  PUBLIC           // All users
  STUDENTS_ONLY    // Students only
  MENTORS_ONLY     // Mentors only
  TEAM_ONLY        // Specific team
  ADMIN_ONLY       // Admins only
}
```

---

## REST API Endpoints

### Posts

#### `GET /api/feed/posts`
Get paginated feed posts with filters.

**Query Parameters:**
- `category` - Filter by category or "all"
- `visibility` - Filter by visibility level
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `includePinned` - Include pinned posts (default: true)
- `teamId` - Filter by team
- `authorId` - Filter by author
- `tags` - Filter by tags (comma-separated)
- `search` - Full-text search

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pinnedPosts": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### `GET /api/feed/posts/:postId`
Get single post with full details.

#### `POST /api/feed/posts`
Create a new post.

**Body:**
```json
{
  "title": "Optional title",
  "content": "Post content (required)",
  "category": "ANNOUNCEMENTS",
  "tags": ["tech", "announcement"],
  "imageUrls": [
    "https://...",
    "https://..."
  ],
  "videoUrl": "https://...",
  "visibility": "PUBLIC",
  "teamId": "optional-team-id",
  "attachments": [
    {
      "fileName": "document.pdf",
      "fileUrl": "https://...",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "fileType": "document"
    }
  ]
}
```

#### `PUT /api/feed/posts/:postId`
Update a post (author or admin only).

#### `DELETE /api/feed/posts/:postId`
Delete a post (author or admin only).

#### `POST /api/feed/posts/:postId/pin`
Pin/unpin a post (admin only).

**Body:**
```json
{
  "isPinned": true
}
```

### Interactions

#### `POST /api/feed/posts/:postId/like`
Toggle like on a post.

#### `GET /api/feed/posts/:postId/likes`
Get users who liked the post.

#### `POST /api/feed/posts/:postId/view`
Record a view.

**Body:**
```json
{
  "duration": 30  // Optional: seconds viewed
}
```

#### `POST /api/feed/posts/:postId/bookmark`
Toggle bookmark on a post.

#### `GET /api/feed/bookmarks`
Get user's bookmarked posts.

### Comments

#### `GET /api/feed/posts/:postId/comments`
Get comments for a post (with nested replies).

#### `POST /api/feed/posts/:postId/comments`
Create a comment.

**Body:**
```json
{
  "content": "Comment content",
  "parentId": "optional-parent-comment-id"
}
```

#### `PUT /api/feed/comments/:commentId`
Update a comment (author only).

#### `DELETE /api/feed/comments/:commentId`
Delete a comment (author or admin).

#### `POST /api/feed/comments/:commentId/like`
Toggle like on a comment.

### Moderation

#### `POST /api/feed/report`
Report inappropriate content.

**Body:**
```json
{
  "postId": "optional-post-id",
  "commentId": "optional-comment-id",
  "reason": "SPAM" | "INAPPROPRIATE" | "HARASSMENT" | "FALSE_INFORMATION" | "OTHER",
  "description": "Optional details"
}
```

### Discover

#### `GET /api/feed/trending-tags`
Get trending tags (last 7 days).

---

## WebSocket Events

### Connection

Connect to feed namespace:
```typescript
import { io } from "socket.io-client";

const socket = io("/feed", {
  auth: {
    token: accessToken
  }
});
```

### Client → Server Events

#### `feed:join`
Join a feed room by category.

**Payload:**
```typescript
{
  category: "ANNOUNCEMENTS" | "MENTORSHIP" | ... | "all"
}
```

#### `feed:leave`
Leave current feed room.

#### `feed:typing:comment`
Indicate user is typing a comment.

**Payload:**
```typescript
{
  postId: string,
  isTyping: boolean
}
```

#### `feed:post:view`
Notify server of post view (for presence).

**Payload:**
```typescript
{
  postId: string
}
```

### Server → Client Events

#### `feed:post:created`
New post created.

**Payload:**
```typescript
{
  post: {
    id: string,
    author: {...},
    title: string,
    content: string,
    category: string,
    ...
  }
}
```

#### `feed:post:updated`
Post updated.

**Payload:**
```typescript
{
  postId: string,
  updates: {...}
}
```

#### `feed:post:deleted`
Post deleted.

**Payload:**
```typescript
{
  postId: string
}
```

#### `feed:post:pinned`
Post pinned/unpinned.

**Payload:**
```typescript
{
  postId: string,
  isPinned: boolean
}
```

#### `feed:post:liked`
Post liked/unliked.

**Payload:**
```typescript
{
  postId: string,
  userId: string,
  userName: string,
  isLiked: boolean,
  likesCount: number
}
```

#### `feed:comment:created`
New comment created.

**Payload:**
```typescript
{
  postId: string,
  comment: {...},
  commentsCount: number
}
```

#### `feed:comment:updated`
Comment updated.

#### `feed:comment:deleted`
Comment deleted.

#### `feed:comment:liked`
Comment liked/unliked.

#### `feed:view:incremented`
Post view count updated.

#### `feed:typing:comment`
User typing indicator.

**Payload:**
```typescript
{
  postId: string,
  userId: string,
  userName: string,
  isTyping: boolean
}
```

---

## Usage Examples

### Frontend Integration

#### Connecting to Feed Socket

```typescript
import { io } from "socket.io-client";

const feedSocket = io(`${API_URL}/feed`, {
  auth: { token: accessToken }
});

// Join "all" category room
feedSocket.emit("feed:join", { category: "all" });

// Listen for new posts
feedSocket.on("feed:post:created", (data) => {
  addPostToFeed(data.post);
});

// Listen for likes
feedSocket.on("feed:post:liked", (data) => {
  updatePostLikes(data.postId, data.likesCount);
});

// Cleanup
useEffect(() => {
  return () => {
    feedSocket.emit("feed:leave");
    feedSocket.disconnect();
  };
}, []);
```

#### Creating a Post

```typescript
const createPost = async (data) => {
  const response = await fetch(`${API_URL}/api/feed/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      content: data.content,
      category: data.category,
      tags: data.tags,
      imageUrls: data.imageUrls,  // Array of image URLs
    })
  });

  return response.json();
};
```

#### Liking a Post

```typescript
const toggleLike = async (postId) => {
  const response = await fetch(`${API_URL}/api/feed/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  const { data } = await response.json();
  return data.isLiked;
};
```

#### Typing Indicator

```typescript
let typingTimeout;

const handleCommentTyping = (postId, isTyping) => {
  clearTimeout(typingTimeout);
  
  feedSocket.emit("feed:typing:comment", {
    postId,
    isTyping: true
  });

  // Auto-stop after 3 seconds
  typingTimeout = setTimeout(() => {
    feedSocket.emit("feed:typing:comment", {
      postId,
      isTyping: false
    });
  }, 3000);
};
```

---

## File Uploads

Use the existing `/api/upload` endpoint to upload files first, then include the URL in your post/comment.

```typescript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  const { data } = await response.json();
  return data.url;  // Use this in your post
};
```

---

## Performance Optimization

### Caching Strategy

- Cache pinned posts for 5 minutes
- Cache trending tags for 1 hour
- Paginate all list endpoints

### Indexes

All critical queries have database indexes:
- Post lookups by category + publishedAt
- Comment lookups by postId + createdAt
- User interactions by userId

### Rate Limiting

Implement rate limiting on:
- Post creation: 10/hour per user
- Comment creation: 50/hour per user
- Like actions: 100/hour per user

---

## Security

### Permissions

- **Posts**: Author or Admin can edit/delete
- **Comments**: Author or Admin can edit/delete
- **Pin**: Admin only
- **Official Posts**: Admin only
- **Visibility**: Enforced at query level

### Content Moderation

- Users can report inappropriate content
- Admins review reports in dashboard
- Automated spam detection (future)

---

## Testing

Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

Test WebSocket connection:
```bash
# Use socket.io-client or Postman
```

---

## Future Enhancements

- [ ] Mentions (@username)
- [ ] Hashtag autocomplete
- [ ] Post reactions (beyond likes)
- [ ] Post scheduling
- [ ] Draft posts
- [ ] Rich text formatting
- [ ] Poll posts
- [ ] Image galleries
- [ ] Video player integration
- [ ] Push notifications
- [ ] Email digests

---

## Support

For issues or questions, contact the development team.
