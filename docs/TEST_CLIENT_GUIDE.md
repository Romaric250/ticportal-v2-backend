# 🚀 Socket.io Test Client - Quick Start Guide

## What is This?

A standalone HTML page to test and debug Socket.io real-time team chat functionality without needing the frontend application.

## How to Use

### Step 1: Get a JWT Token

First, you need to authenticate and get a JWT token:

#### Option A: Use Postman/Thunder Client
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

Response will include:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Option B: Use curl
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

#### Option C: Register a New User First
```http
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "school": "Test School",
  "role": "USER"
}
```

### Step 2: Get a Team ID

You need a team to chat in:

#### Option A: Create a New Team
```http
POST http://localhost:5000/api/v1/teams
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Test Team",
  "description": "For testing Socket.io",
  "school": "Test School",
  "hackathonId": "optional-hackathon-id"
}
```

#### Option B: Get List of Existing Teams
```http
GET http://localhost:5000/api/v1/teams
Authorization: Bearer YOUR_JWT_TOKEN
```

### Step 3: Open the Test Client

1. Make sure your server is running:
   ```bash
   npm run dev
   ```

2. Open `test-socket-client.html` in your browser:
   - Double-click the file, or
   - Right-click → Open with → Your browser, or
   - Drag and drop into browser window

### Step 4: Connect and Test

1. **Enter Configuration:**
   - Server URL: `http://localhost:5000` (default)
   - JWT Token: Paste your access token from Step 1
   - Team ID: Paste your team ID from Step 2

2. **Click "Connect"**
   - Status should change to "✅ Connected"
   - You'll see your Socket ID
   - Event log will show connection details

3. **Click "Join Team"**
   - Event log should show `team:join` emitted
   - Server should confirm join
   - You should receive `team:member:online` event

4. **Type a Message and Click "Send"**
   - Message should appear in the Messages section
   - Event log should show `team:message:send` emitted
   - You should receive `team:message` event back

## Testing with Multiple Users

### Option 1: Multiple Browser Tabs
1. Open test client in Tab 1
2. Login as User A, get token, connect
3. Open test client in Tab 2
4. Login as User B, get different token, connect
5. Both users join the same team
6. Send messages from either user
7. Both should receive all messages

### Option 2: Multiple Browsers
1. Open in Chrome: Connect as User A
2. Open in Firefox: Connect as User B
3. Both join same team
4. Test messaging

### Option 3: Incognito/Private Windows
1. Normal window: User A
2. Incognito window: User B
3. Both join same team
4. Test messaging

## What to Look For

### ✅ Success Signs:
- Green "✅ Connected" status
- Socket ID is displayed
- User ID is displayed
- "📨 [RECEIVED] team:message" appears in log
- Messages appear in the Messages section
- Other users' messages appear when they send

### ❌ Problem Signs:
- Red "❌ Disconnected" status
- "💥 Connection error" in log
- "❌ [RECEIVED] error" in log
- Messages sent but not received
- Only one user receives messages

## Troubleshooting

### Connection Failed
**Problem:** Can't connect to server

**Solutions:**
1. Verify server is running (`npm run dev`)
2. Check server URL (default: `http://localhost:5000`)
3. Check JWT token is valid (not expired)
4. Look at browser console for errors (F12)
5. Check server logs for connection attempts

### Not a Team Member Error
**Problem:** "Not a team member" error when joining

**Solutions:**
1. Verify you're using correct Team ID
2. Make sure user who created the token is a member of the team
3. Check database: Does TeamMember entry exist?
4. Try creating a new team with this user

### Messages Not Broadcasting
**Problem:** Message sent but other users don't receive it

**Solutions:**
1. Check server logs for room membership
2. Verify both users actually joined the team
3. Look for "📢 [SOCKET] Message broadcast" in server logs
4. Check `expectedRecipients` count in logs
5. See SOCKET_MESSAGE_DEBUG_ENHANCED.md for detailed debugging

### No Events in Log
**Problem:** Event log is empty or incomplete

**Solutions:**
1. Clear log and try again
2. Check browser console (F12) for JavaScript errors
3. Verify Socket.io client library loaded (check Network tab)
4. Try refreshing the page

## Server Logs to Monitor

When testing, watch for these logs on the server:

```
🟢 [SOCKET] New client connected successfully
✅ [SOCKET] User successfully joined team room - Room membership verified
🔍 [SOCKET] Room membership before message broadcast
📢 [SOCKET] Message broadcast to all team members
```

## Quick Test Checklist

- [ ] Server running on http://localhost:5000
- [ ] Got JWT token from login
- [ ] Got Team ID (created or existing)
- [ ] Test client opened in browser
- [ ] Connected successfully (green status)
- [ ] Joined team (no errors)
- [ ] Sent test message
- [ ] Received own message
- [ ] (Optional) Second user received message

## Common Commands

### Start Server
```bash
cd c:\Users\Romaric\Desktop\Projects\ticportal\ticportal-v2-backend
npm run dev
```

### Check Running Processes
```bash
# Windows PowerShell
Get-Process node

# Kill if needed
taskkill /F /IM node.exe
```

### View Server Logs
Just look at the terminal where you ran `npm run dev`

## Need Help?

1. Check server logs for detailed error messages
2. Review SOCKET_MESSAGE_DEBUG_ENHANCED.md
3. Check browser console (F12) for client-side errors
4. Enable detailed Socket.io logging:
   ```bash
   set DEBUG=socket.io:* & npm run dev
   ```

---

**File Location:** `test-socket-client.html`  
**Last Updated:** 2024  
**Status:** ✅ Ready to use
