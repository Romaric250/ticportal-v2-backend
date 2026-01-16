# 🚀 Smart Feed Algorithm - Frontend Integration Guide

## 📊 **Feed Architecture Overview**

The feed uses **lazy loading with intersection observer** to prevent counting all posts as viewed when the page loads. Views are only counted when posts actually appear in the viewport.

---

## 🎯 **API Endpoints:**

### 1. **Get Main Feed (Infinite Scroll)**
```http
GET /api/feed/posts?page=1&limit=10&category=all&includePinned=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pinnedPosts": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

### 2. **Get Trending Posts (Top 3)**
```http
GET /api/feed/trending?limit=3
```

**Algorithm:** 
- Posts from last 7 days
- Score = (likes × 3 + comments × 5 + views × 0.1) × time_decay
- Higher engagement + recency = higher score

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "content": "...",
      "likesCount": 45,
      "commentsCount": 23,
      "viewsCount": 234,
      "isLiked": false,
      "isBookmarked": false,
      "author": {...}
    }
  ]
}
```

### 3. **Get Latest Posts (Top 3)**
```http
GET /api/feed/latest?limit=3
```

**Returns:** Most recent 3 posts

### 4. **Search Posts**
```http
GET /api/feed/search?q=typescript&page=1&limit=20
```

**Searches:**
- Post titles
- Post content
- Tags (exact match)
- Orders by: likes desc → created desc

### 5. **Record View (Smart Tracking)**
```http
POST /api/feed/posts/:postId/record-view
Content-Type: application/json

{
  "duration": 5  // seconds user viewed post (optional)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "viewsCount": 156,
    "alreadyViewed": false
  }
}
```

---

## 💻 **Frontend Implementation:**

### **React + Intersection Observer Example:**

```tsx
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Post {
  id: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  author: {
    fullName: string;
    profilePhoto: string;
  };
}

// Hook for tracking post views
const usePostView = (postId: string) => {
  const [hasViewed, setHasViewed] = useState(false);
  const viewTimeRef = useRef<number>();

  const { ref, inView } = useInView({
    threshold: 0.5, // 50% of post must be visible
    triggerOnce: true, // Only trigger once
  });

  useEffect(() => {
    if (inView && !hasViewed) {
      viewTimeRef.current = Date.now();

      // Record view after 2 seconds
      const timer = setTimeout(async () => {
        const duration = Math.floor((Date.now() - viewTimeRef.current!) / 1000);
        
        try {
          await fetch(`/api/feed/posts/${postId}/record-view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ duration }),
          });
          
          setHasViewed(true);
          console.log(`✅ View recorded for post ${postId}`);
        } catch (error) {
          console.error('Failed to record view:', error);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [inView, postId, hasViewed]);

  return { ref, hasViewed };
};

// Feed Component
export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trending, setTrending] = useState<Post[]>([]);
  const [latest, setLatest] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadTrending();
    loadLatest();
    loadPosts(1);
  }, []);

  const loadTrending = async () => {
    const res = await fetch('/api/feed/trending?limit=3', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setTrending(data.data);
  };

  const loadLatest = async () => {
    const res = await fetch('/api/feed/latest?limit=3', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setLatest(data.data);
  };

  const loadPosts = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/feed/posts?page=${pageNum}&limit=10&includePinned=${pageNum === 1}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();

      if (pageNum === 1) {
        setPosts(data.data.posts);
      } else {
        setPosts(prev => [...prev, ...data.data.posts]);
      }

      setHasMore(data.data.pagination.page < data.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage);
  };

  return (
    <div className="feed-container">
      {/* Trending Section */}
      <section className="trending-section">
        <h2>🔥 Trending Now</h2>
        <div className="trending-grid">
          {trending.map(post => (
            <TrendingPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Latest Section */}
      <section className="latest-section">
        <h2>⚡ Latest Posts</h2>
        <div className="latest-grid">
          {latest.map(post => (
            <LatestPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Main Feed */}
      <section className="main-feed">
        <h2>📰 Feed</h2>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Load More Button */}
        {hasMore && (
          <button onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </section>
    </div>
  );
};

// Post Card with View Tracking
const PostCard = ({ post }: { post: Post }) => {
  const { ref, hasViewed } = usePostView(post.id);

  return (
    <article ref={ref} className="post-card">
      {hasViewed && <span className="viewed-badge">✓ Viewed</span>}
      
      <div className="post-header">
        <img src={post.author.profilePhoto} alt={post.author.fullName} />
        <span>{post.author.fullName}</span>
      </div>

      <div className="post-content">
        {post.content}
      </div>

      <div className="post-stats">
        <span>❤️ {post.likesCount}</span>
        <span>💬 {post.commentsCount}</span>
        <span>👁️ {post.viewsCount}</span>
      </div>
    </article>
  );
};
```

---

## 🎨 **Search Component:**

```tsx
const SearchFeed = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/feed/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=20`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      setResults(data.data.posts);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Searching...</p>}

      <div className="search-results">
        {results.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
```

---

## 🔥 **Key Features:**

✅ **Smart View Tracking**
- Only counts views when 50%+ of post is visible
- Requires 2+ seconds viewing time
- Prevents duplicate views
- Tracks view duration

✅ **Infinite Scroll**
- Load 10 posts at a time
- Auto-load more on scroll
- Pinned posts only on first page

✅ **Trending Algorithm**
- Engagement-based scoring
- Time decay (7 days)
- Prioritizes viral content

✅ **Real-time Search**
- Debounced queries
- Searches title, content, tags
- Sorted by relevance

✅ **Performance**
- Lazy loading
- Intersection Observer API
- Minimal re-renders
- Debounced requests

---

## 📊 **View Tracking Flow:**

```
User opens feed
   ↓
Posts load (NO views counted)
   ↓
User scrolls
   ↓
Post enters viewport (50%+ visible)
   ↓
Wait 2 seconds
   ↓
POST /api/feed/posts/:id/record-view
   ↓
View count incremented ✅
```

---

## 🧪 **Testing:**

```bash
# Get trending
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/feed/trending

# Get latest
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/feed/latest

# Search
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/feed/search?q=typescript"

# Record view
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"duration": 5}' \
  http://localhost:5000/api/feed/posts/POST_ID/record-view
```

---

**The smart feed is ready to deliver personalized, engaging content!** 🚀✨
