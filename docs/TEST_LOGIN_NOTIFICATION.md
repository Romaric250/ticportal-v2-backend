# Test Login Notification

## Quick Test

### 1. Start the Server
```bash
npm run dev
```

Look for these logs to confirm notification system is active:
```
✅ Socket.io initialized with team chat handlers
⏰ [CRON] Notification cleanup scheduled (every 1 minute)
📬 [SOCKET] Notification handlers registered
```

### 2. Login to Get a Notification
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Expected logs:**
```
📬 [NOTIFICATION] Created new notification
📢 [SOCKET] Notification emitted to user
📢 [SOCKET] Unread count update emitted
```

### 3. Check Notifications via API
```bash
# Get all notifications
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get unread count
curl http://localhost:5000/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "...",
      "type": "SYSTEM_ANNOUNCEMENT",
      "title": "Welcome Back!",
      "message": "You've successfully logged in",
      "data": {
        "loginTime": "2026-01-05T...",
        "deviceInfo": "Unknown device"
      },
      "isRead": false,
      "createdAt": "2026-01-05T...",
      "expiresAt": "2026-02-04T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 4. Test Real-time Socket.io (Optional)

Create an HTML file `test-notification.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Notifications</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>Notification Test</h1>
  <div id="status">Connecting...</div>
  <div id="notifications"></div>
  <div id="unread-count">Unread: 0</div>

  <script>
    const token = 'YOUR_JWT_TOKEN'; // Replace with your actual token
    
    const socket = io('http://localhost:5000', {
      auth: { token }
    });

    socket.on('connect', () => {
      document.getElementById('status').textContent = '✅ Connected!';
      console.log('Connected to Socket.io');
    });

    socket.on('notification:new', (notification) => {
      console.log('📬 New notification:', notification);
      
      const notifDiv = document.createElement('div');
      notifDiv.style.border = '1px solid #ccc';
      notifDiv.style.padding = '10px';
      notifDiv.style.margin = '10px 0';
      notifDiv.innerHTML = `
        <strong>${notification.title}</strong><br>
        ${notification.message}<br>
        <small>${new Date(notification.createdAt).toLocaleString()}</small>
      `;
      
      document.getElementById('notifications').prepend(notifDiv);
    });

    socket.on('notification:unread-count', ({ count }) => {
      console.log('🔔 Unread count:', count);
      document.getElementById('unread-count').textContent = `Unread: ${count}`;
    });

    socket.on('disconnect', () => {
      document.getElementById('status').textContent = '❌ Disconnected';
    });
  </script>
</body>
</html>
```

**Usage:**
1. Replace `YOUR_JWT_TOKEN` with your actual token from login
2. Open the file in a browser
3. Login from another tab/window
4. Watch the notification appear in real-time!

### 5. Mark as Read (Test Auto-delete)
```bash
curl -X POST http://localhost:5000/api/notifications/mark-read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notificationId": "NOTIFICATION_ID_FROM_STEP_3"}'
```

**Expected:**
- Notification marked as read
- Will auto-delete after 1 minute
- Unread count decreases

Wait 1 minute, then check again:
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

The notification should be gone! 🎉

## Troubleshooting

### Not Seeing Notifications?
1. Check if server started successfully
2. Verify Prisma client was generated: `npx prisma generate`
3. Check server logs for notification creation
4. Verify JWT token is valid

### Socket.io Not Working?
1. Check CORS settings in `src/server.ts`
2. Verify token in auth header
3. Check browser console for errors
4. Make sure server URL is correct

### Notifications Not Deleting?
1. Check if cron job is running (look for logs every minute)
2. Verify notification was marked as read
3. Wait at least 1 minute after marking as read

## What You Should See

✅ Login creates a notification
✅ Notification appears in API response
✅ Real-time notification via Socket.io (if testing)
✅ Unread count increases
✅ Mark as read works
✅ Notification auto-deletes after 1 minute
✅ Unread count decreases

## Success!

If all the above works, your notification system is **fully functional**! 🎉

You can now integrate notifications into:
- Team activities
- Points/badges earned
- Hackathon reminders
- Mentor assignments
- And more!
