# 🔔 Deliverable Notifications System

## Notifications Triggered

### 1. Deliverable Submitted
**When:** Team submits a deliverable  
**Who:** All team members  
**Type:** `DELIVERABLE_SUBMITTED`

```json
{
  "type": "DELIVERABLE_SUBMITTED",
  "title": "Deliverable Submitted ✅",
  "message": "Your team has submitted \"Project Proposal\"",
  "metadata": {
    "deliverableId": "...",
    "templateId": "..."
  }
}
```

### 2. Points Awarded (Submission)
**When:** Immediately after submission  
**Who:** All team members  
**Type:** `POINTS_AWARDED`

```json
{
  "type": "POINTS_AWARDED",
  "title": "Points Awarded! 🎉",
  "message": "You earned 10 points for submitting \"Project Proposal\"",
  "metadata": {
    "points": 10,
    "action": "DELIVERABLE_SUBMIT",
    "deliverableId": "..."
  }
}
```

### 3. Deliverable Approved + Bonus Points
**When:** Admin approves deliverable  
**Who:** All team members  
**Type:** `POINTS_AWARDED`

```json
{
  "type": "POINTS_AWARDED",
  "title": "Bonus Points! 🌟",
  "message": "Your deliverable \"Project Proposal\" was approved! You earned 20 bonus points!",
  "metadata": {
    "points": 20,
    "action": "DELIVERABLE_APPROVED",
    "deliverableId": "...",
    "reviewStatus": "APPROVED"
  }
}
```

### 4. Deliverable Rejected
**When:** Admin rejects deliverable  
**Who:** All team members  
**Type:** `DELIVERABLE_REJECTED`

```json
{
  "type": "DELIVERABLE_REJECTED",
  "title": "Deliverable Needs Revision ⚠️",
  "message": "\"Project Proposal\" needs revision. Reason: Missing technical details",
  "metadata": {
    "deliverableId": "...",
    "reason": "Missing technical details"
  }
}
```

---

## Complete Workflow

### Scenario 1: Submit and Get Approved

```bash
# 1. Team submits deliverable
POST /api/deliverables/123/submit

# Notifications sent:
→ 🔔 "Deliverable Submitted ✅"
→ 🎉 "Points Awarded! 10 points for submitting"

# 2. Admin approves
POST /api/admin/deliverables/123/approve

# Notification sent:
→ 🌟 "Bonus Points! Your deliverable was approved! 20 points!"
```

**Total notifications:** 3 per team member

---

### Scenario 2: Submit and Get Rejected

```bash
# 1. Team submits deliverable
POST /api/deliverables/123/submit

# Notifications sent:
→ 🔔 "Deliverable Submitted ✅"
→ 🎉 "Points Awarded! 10 points"

# 2. Admin rejects
POST /api/admin/deliverables/123/reject

# Notification sent:
→ ⚠️ "Deliverable Needs Revision"
```

**Total notifications:** 3 per team member

---

## Notification Types

| Type | Icon | When | Points? |
|------|------|------|---------|
| `DELIVERABLE_SUBMITTED` | ✅ | Team submits | No |
| `POINTS_AWARDED` (Submit) | 🎉 | After submission | Yes (10) |
| `POINTS_AWARDED` (Approved) | 🌟 | After approval | Yes (20) |
| `DELIVERABLE_REJECTED` | ⚠️ | Admin rejects | No |

---

## Frontend Integration

### React Notification Display

```typescript
interface Notification {
  type: string;
  title: string;
  message: string;
  metadata?: {
    points?: number;
    action?: string;
    deliverableId?: string;
    reason?: string;
  };
  createdAt: Date;
}

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'DELIVERABLE_SUBMITTED':
        return '✅';
      case 'POINTS_AWARDED':
        return notification.metadata?.action === 'DELIVERABLE_APPROVED' ? '🌟' : '🎉';
      case 'DELIVERABLE_REJECTED':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'DELIVERABLE_SUBMITTED':
      case 'POINTS_AWARDED':
        return 'green';
      case 'DELIVERABLE_REJECTED':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <div className={`notification notification-${getColor()}`}>
      <span className="icon">{getIcon()}</span>
      <div>
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
        {notification.metadata?.points && (
          <span className="points-badge">+{notification.metadata.points} points</span>
        )}
        <span className="time">{formatTime(notification.createdAt)}</span>
      </div>
    </div>
  );
};
```

### Real-time with Socket.io

```typescript
// Client-side
socket.on('notification', (notification: Notification) => {
  // Show toast
  toast({
    title: notification.title,
    description: notification.message,
    duration: 5000,
  });

  // Update notification list
  setNotifications((prev) => [notification, ...prev]);

  // Play sound for points
  if (notification.type === 'POINTS_AWARDED') {
    playPointsSound();
    showConfetti();
  }
});
```

### Display Points in UI

```typescript
const PointsNotification = ({ notification }: { notification: Notification }) => {
  if (notification.type !== 'POINTS_AWARDED') return null;

  const points = notification.metadata?.points || 0;
  const action = notification.metadata?.action;

  return (
    <div className="points-notification">
      <div className="points-badge">
        <span className="points-value">+{points}</span>
        <span className="points-label">points</span>
      </div>
      <p className="points-message">{notification.message}</p>
      {action === 'DELIVERABLE_APPROVED' && (
        <div className="bonus-indicator">🌟 Bonus Points!</div>
      )}
    </div>
  );
};
```

---

## Socket.io Integration

### Server-side (Already Implemented)

The `sendNotification()` utility function handles:
1. Creating notification in database
2. Emitting to connected users via Socket.io
3. Error handling

```typescript
await sendNotification({
  userId: member.userId,
  type: "POINTS_AWARDED",
  title: "Points Awarded! 🎉",
  message: `You earned ${points} points`,
  metadata: { points, action, deliverableId },
});
```

### Client-side Setup

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: userToken },
});

socket.on('connect', () => {
  console.log('Connected to notifications');
});

socket.on('notification', (notification) => {
  console.log('New notification:', notification);
  handleNotification(notification);
});
```

---

## Notification Persistence

### All notifications are saved to database

```typescript
// Get user's notifications
const notifications = await db.notification.findMany({
  where: { userId: "USER_ID" },
  orderBy: { createdAt: 'desc' },
  take: 20,
});

// Mark as read
await db.notification.update({
  where: { id: notificationId },
  data: { read: true },
});

// Get unread count
const unreadCount = await db.notification.count({
  where: { userId: "USER_ID", read: false },
});
```

---

## Notification Settings (Future Enhancement)

```typescript
// Allow users to configure notification preferences
interface NotificationPreferences {
  deliverableSubmitted: boolean;
  pointsAwarded: boolean;
  deliverableApproved: boolean;
  deliverableRejected: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

// Example: Opt-out of certain notifications
await db.userPreferences.update({
  where: { userId: "USER_ID" },
  data: {
    notifications: {
      deliverableSubmitted: false, // Don't notify for submissions
      pointsAwarded: true,         // But notify for points
    },
  },
});
```

---

## Testing Notifications

### 1. Submit Deliverable

```bash
POST /api/deliverables/123/submit
{
  "teamId": "team_abc",
  "content": "https://...",
  "contentType": "FILE"
}

# Expected notifications (per team member):
# 1. ✅ "Deliverable Submitted"
# 2. 🎉 "Points Awarded! 10 points"
```

### 2. Approve Deliverable

```bash
POST /api/admin/deliverables/123/approve
{
  "reviewerId": "admin_xyz"
}

# Expected notification (per team member):
# 3. 🌟 "Bonus Points! 20 points!"
```

### 3. Reject Deliverable

```bash
POST /api/admin/deliverables/123/reject
{
  "reviewerId": "admin_xyz",
  "reason": "Missing technical details"
}

# Expected notification (per team member):
# ⚠️ "Deliverable Needs Revision"
```

---

## Summary

### Notifications Per Action

| Action | Notifications Sent | Total Per Team (5 members) |
|--------|-------------------|---------------------------|
| Submit | 2 (Submitted + Points) | 10 notifications |
| Approve | 1 (Bonus Points) | 5 notifications |
| Reject | 1 (Needs Revision) | 5 notifications |

### Complete Workflow (Submit → Approve)
- **Per Member:** 3 notifications (Submit, Points, Bonus)
- **Team of 5:** 15 total notifications
- **Total Points:** 30 per member

---

## Implementation Files

1. **`src/modules/deliverables/service.ts`**
   - `submitDeliverable()` - Sends 2 notifications
   - `approveDeliverable()` - Sends 1 notification
   - `rejectDeliverable()` - Sends 1 notification

2. **`src/shared/utils/notifications.ts`**
   - `sendNotification()` - Creates DB record + emits Socket.io event

3. **`src/socket/index.ts`**
   - Handles Socket.io connections
   - Emits notifications to connected users

---

## Status

✅ **COMPLETE AND WORKING!**

- Notification on submit
- Points notification on submit
- Bonus points notification on approve
- Rejection notification with reason
- Socket.io real-time delivery
- Database persistence
- Error handling

**Test by submitting and approving a deliverable!** 🔔

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-11  
**Status:** ✅ Production Ready
