# 🎮 Real-Time Points System - Frontend Integration

## 🔥 **Live Points Notifications**

Every interaction now awards points **instantly** with real-time WebSocket notifications!

---

## 📊 **Points Breakdown:**

| Action | Points (You) | Points (Author) | Event |
|--------|--------------|-----------------|-------|
| View post (1st time) | **5** | **1** | `feed:points:earned` |
| View post (again) | **2** | **1** | `feed:points:earned` |
| Like post | **2** | **5** | `feed:points:earned` |
| Comment | **15** | **10** | `feed:points:earned` |
| Bookmark | **0** | **3** | `feed:points:earned` |
| Create post | **100+** | - | `feed:points:earned` |

---

## 🎯 **WebSocket Events:**

### Connect to Feed Socket:
```typescript
import { io } from 'socket.io-client';

const feedSocket = io('http://localhost:5000/feed', {
  auth: {
    token: yourAuthToken
  }
});

// Listen for points earned
feedSocket.on('feed:points:earned', (data) => {
  console.log('🎉 Points earned!', data);
  // data = {
  //   userId: "...",
  //   points: 5,
  //   reason: "Viewed post",
  //   timestamp: "2024-01-16T...",
  //   metadata: { postId: "..." }
  // }
  
  // Show notification
  showPointsNotification(data.points, data.reason);
  
  // Update user's total points
  updatePointsBalance(data.points);
});

// Listen for points summary updates
feedSocket.on('feed:points:summary', (data) => {
  console.log('📊 Points summary:', data);
  // data = {
  //   userId: "...",
  //   totalPoints: 325,
  //   timestamp: "2024-01-16T..."
  // }
  
  updateTotalPoints(data.totalPoints);
});
```

---

## 💻 **React Integration:**

### Points Notification Hook:
```typescript
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; // or your notification library
import { feedSocket } from './socket';

export const usePointsNotifications = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [recentPoints, setRecentPoints] = useState<Array<{
    points: number;
    reason: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    // Listen for points earned
    feedSocket.on('feed:points:earned', (data) => {
      // Show toast notification
      toast.success(`+${data.points} TIC Points! ${data.reason}`, {
        icon: '🎉',
        duration: 3000,
      });

      // Add to recent points
      setRecentPoints(prev => [{
        points: data.points,
        reason: data.reason,
        timestamp: new Date(data.timestamp),
      }, ...prev].slice(0, 5)); // Keep last 5

      // Update total
      setTotalPoints(prev => prev + data.points);
    });

    // Listen for summary updates
    feedSocket.on('feed:points:summary', (data) => {
      setTotalPoints(data.totalPoints);
    });

    return () => {
      feedSocket.off('feed:points:earned');
      feedSocket.off('feed:points:summary');
    };
  }, []);

  return { totalPoints, recentPoints };
};
```

### Points Display Component:
```tsx
import { usePointsNotifications } from './hooks/usePointsNotifications';

export const PointsWidget = () => {
  const { totalPoints, recentPoints } = usePointsNotifications();

  return (
    <div className="points-widget">
      {/* Total Points Badge */}
      <div className="points-badge">
        <span className="icon">🏆</span>
        <span className="total">{totalPoints}</span>
        <span className="label">TIC Points</span>
      </div>

      {/* Recent Points Activity */}
      <div className="recent-points">
        {recentPoints.map((item, index) => (
          <div key={index} className="points-item">
            <span className="amount">+{item.points}</span>
            <span className="reason">{item.reason}</span>
            <span className="time">{formatTime(item.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Post Card with Points:
```tsx
const PostCard = ({ post }: { post: Post }) => {
  const { ref, hasViewed } = usePostView(post.id);

  return (
    <article ref={ref} className="post-card">
      {/* View indicator */}
      {hasViewed && (
        <div className="view-badge">
          ✓ Viewed (+{hasViewed === 'first' ? '5' : '2'} points)
        </div>
      )}

      {/* Post content */}
      <div className="post-content">
        {post.content}
      </div>

      {/* Interaction buttons */}
      <div className="post-actions">
        <button onClick={() => handleLike(post.id)}>
          ❤️ Like <span className="points-hint">+2</span>
        </button>
        
        <button onClick={() => handleComment(post.id)}>
          💬 Comment <span className="points-hint">+15</span>
        </button>
        
        <button onClick={() => handleBookmark(post.id)}>
          🔖 Bookmark
        </button>
      </div>
    </article>
  );
};
```

### Animated Points Notification:
```tsx
import { motion, AnimatePresence } from 'framer-motion';

export const PointsToast = ({ points, reason }: { points: number; reason: string }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="points-toast"
    >
      <div className="points-icon">🎉</div>
      <div className="points-content">
        <div className="points-amount">+{points} Points!</div>
        <div className="points-reason">{reason}</div>
      </div>
    </motion.div>
  );
};

// Usage with context
const [pointsNotifications, setPointsNotifications] = useState([]);

feedSocket.on('feed:points:earned', (data) => {
  const id = Date.now();
  setPointsNotifications(prev => [...prev, { id, ...data }]);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    setPointsNotifications(prev => prev.filter(n => n.id !== id));
  }, 3000);
});

<AnimatePresence>
  {pointsNotifications.map(notification => (
    <PointsToast
      key={notification.id}
      points={notification.points}
      reason={notification.reason}
    />
  ))}
</AnimatePresence>
```

---

## 🎨 **CSS Styling:**

```css
.points-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.points-icon {
  font-size: 32px;
}

.points-amount {
  font-size: 20px;
  font-weight: bold;
}

.points-reason {
  font-size: 14px;
  opacity: 0.9;
}

.points-hint {
  font-size: 12px;
  color: #4ade80;
  margin-left: 4px;
}

.view-badge {
  display: inline-block;
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
}
```

---

## 🧪 **Testing Points System:**

```typescript
// Test view points
const testView = async () => {
  const response = await fetch(`/api/feed/posts/${postId}/record-view`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ duration: 5 })
  });
  
  const data = await response.json();
  console.log('View recorded:', data);
  // { viewsCount: 156, alreadyViewed: false, pointsEarned: 5 }
};

// Test like points
const testLike = async () => {
  await fetch(`/api/feed/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // Socket will emit: feed:points:earned (2 points to you, 5 to author)
};

// Test comment points
const testComment = async () => {
  await fetch(`/api/feed/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: "Great post!" })
  });
  // Socket will emit: feed:points:earned (15 points to you, 10 to author)
};
```

---

## 📊 **Points Dashboard:**

```tsx
export const PointsDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('/api/feed/points/summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setSummary(data.data));
  }, []);

  return (
    <div className="points-dashboard">
      <h2>Your TIC Points</h2>
      
      <div className="total-points">
        <span className="amount">{summary?.totalPoints || 0}</span>
        <span className="label">Total Points</span>
      </div>

      <div className="points-breakdown">
        {summary?.breakdown.map((item) => (
          <div key={item.activity} className="breakdown-item">
            <span className="activity">{formatActivity(item.activity)}</span>
            <span className="points">{item.points} pts</span>
            <span className="count">({item.count}x)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎯 **Key Features:**

✅ **Real-time Notifications** - Instant feedback on all actions  
✅ **View Points** - 5 for first view, 2 for repeat views  
✅ **Like Points** - 2 to liker, 5 to author  
✅ **Comment Points** - 15 to commenter, 10 to author  
✅ **Bookmark Points** - 3 to author  
✅ **Socket Integration** - Live updates via WebSocket  
✅ **Toast Notifications** - Beautiful animated alerts  
✅ **Points Dashboard** - Track all earnings  

**Users now see points in real-time as they engage!** 🎉✨
