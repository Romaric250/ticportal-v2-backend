# 🤖 Automatic Badge Assignment - Complete Guide

## ✅ **System Overview**

Badges are **automatically awarded** in two ways:

### 1. **Real-Time Auto-Assignment** ⚡
Badges are checked and awarded immediately after user actions:
- ✅ After creating a post
- ✅ After liking a post  
- ✅ After commenting
- ✅ After viewing posts
- ✅ After joining a team

**Implementation:** Already integrated in `feed/service.ts`

### 2. **Scheduled Auto-Assignment** 🕐
A cron job runs **every hour** to check ALL users for new badges:
- Runs at: **:00 (top of every hour)**
- Checks: All verified users
- Awards: Any newly earned badges
- Logs: Total badges awarded

---

## 🔧 **Setup Instructions**

### **Step 1: Verify Cron Configuration**

The cron job is already configured in `src/config/cron.ts`:

```typescript
const badgeAwardJob = new CronJob("0 * * * *", async () => {
  try {
    logger.info("Starting automatic badge award job");
    const totalAwarded = await BadgeService.checkBadgesForAllUsers();
    logger.info({ totalAwarded }, "Badge award job completed");
  } catch (error) {
    logger.error({ error }, "Badge award job failed");
  }
});
```

**Schedule:** `"0 * * * *"` = Every hour at minute 0

---

### **Step 2: Start Cron Jobs in Your Server**

Find your server startup file (usually `index.ts` or `server.ts`) and add:

```typescript
import { startCronJobs } from "./config/cron";

// After express setup
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // ✅ Start all cron jobs
  startCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: shutting down gracefully');
  
  const { stopCronJobs } = require('./config/cron');
  stopCronJobs();
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

---

### **Step 3: Verify It's Working**

After starting your server, you should see:

```
✅ All cron jobs started
✅ - Health check: Every 14 minutes
✅ - Badge awards: Every hour
```

Then every hour at :00:
```
[INFO] Starting automatic badge award job
[INFO] New badges awarded to user: userId=123, badges=["rookie"]
[INFO] New badges awarded to user: userId=456, badges=["first_post", "friendly"]
[INFO] Badge award job completed: totalBadgesAwarded=5
```

---

## 🎯 **How Auto-Assignment Works**

### **For Each User:**

1. **Fetch User Stats:**
   ```typescript
   {
     totalPoints: 250,
     postsCreated: 5,
     likesGiven: 30,
     commentsGiven: 10,
     maxPostLikes: 15,
     // ... etc
   }
   ```

2. **Check Each Badge:**
   ```typescript
   for (const badge of ALL_BADGES) {
     if (!userHasBadge && meetsRequirement) {
       awardBadge(userId, badge.id);
     }
   }
   ```

3. **Award Badge:**
   - Add to `UserBadge` table
   - Award bonus points
   - Log activity
   - (Optional) Send notification

---

## 📊 **Example Flow**

### **User Journey:**

**9:00 AM** - User creates their first post
→ Real-time check: Awards "First Post" badge (📝 +25 points)

**9:30 AM** - User likes 50 posts
→ Real-time check: Awards "Friendly" badge (❤️ +50 points)

**10:00 AM** - Cron job runs
→ Checks all users
→ User now has 75 total points
→ No new badges (need 100 for "Rookie")

**10:30 AM** - User comments on posts, earns 30 more points
→ Real-time check: Total = 105 points
→ Awards "Rookie" badge (🌱 +50 points)

**11:00 AM** - Cron job runs again
→ Checks user
→ Already has all earned badges
→ No new awards

---

## ⚙️ **Cron Schedule Options**

Current: **Every hour**
```typescript
"0 * * * *"  // Every hour at :00
```

**Alternative Schedules:**

Every 30 minutes:
```typescript
"*/30 * * * *"  
```

Every 2 hours:
```typescript
"0 */2 * * *"  
```

Every 6 hours:
```typescript
"0 */6 * * *"  
```

Daily at midnight:
```typescript
"0 0 * * *"  
```

Twice daily (9 AM & 9 PM):
```typescript
"0 9,21 * * *"  
```

---

## 🔍 **Monitoring**

### **Check Cron Job Status:**

```bash
# Check logs for cron activity
tail -f logs/app.log | grep "badge award job"

# Expected output every hour:
# [INFO] Starting automatic badge award job
# [INFO] Badge award job completed: totalAwarded=12
```

### **Manually Trigger Badge Check:**

```bash
# Via API (for testing)
POST /api/badges/check
Authorization: Bearer YOUR_TOKEN

# Response:
{
  "success": true,
  "data": {
    "newBadges": ["rookie", "friendly"],
    "count": 2
  }
}
```

---

## 🚨 **Troubleshooting**

### **Issue:** Cron job not running

**Check:**
1. Is `startCronJobs()` called in server startup?
2. Check logs for "All cron jobs started"
3. Verify no errors in badge service

**Fix:**
```typescript
// Add debug logging
const badgeAwardJob = new CronJob("0 * * * *", async () => {
  console.log("🔔 Badge cron triggered at", new Date());
  // ... rest of code
});
```

### **Issue:** Badges not being awarded

**Check:**
1. Are users verified? (`isVerified: true`)
2. Check badge requirements match user stats
3. Look for errors in logs

**Debug:**
```typescript
// Test specific user
const stats = await BadgeService.getUserStats(userId);
console.log("User stats:", stats);

const badges = await BadgeService.checkAndAwardBadges(userId);
console.log("New badges:", badges);
```

---

## 📈 **Performance Considerations**

### **Current Setup:**
- Checks all verified users every hour
- Efficient database queries
- Logs all awards

### **For Large User Base (10,000+ users):**

**Option 1: Batch Processing**
```typescript
// Process in batches of 100
const batchSize = 100;
for (let i = 0; i < users.length; i += batchSize) {
  const batch = users.slice(i, i + batchSize);
  await Promise.all(batch.map(u => checkAndAwardBadges(u.id)));
}
```

**Option 2: Only Check Active Users**
```typescript
// Only check users active in last 24 hours
const users = await db.user.findMany({
  where: {
    isVerified: true,
    lastActiveAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  }
});
```

**Option 3: Increase Interval**
```typescript
// Run every 6 hours instead
"0 */6 * * *"
```

---

## ✅ **Testing**

### **Test Cron Job Manually:**

```typescript
// In your test file or REPL
import { BadgeService } from "./modules/badges/service";

const result = await BadgeService.checkBadgesForAllUsers();
console.log(`Awarded ${result} badges`);
```

### **Test Specific Badge:**

```typescript
// Create conditions for badge
await createPost(); // First Post badge
await createNMorePosts(9); // Content Creator badge (10 total)

// Check badges
const newBadges = await BadgeService.checkAndAwardBadges(userId);
console.log("New badges:", newBadges); // Should include both
```

---

## 🎯 **Summary**

### **Two Auto-Assignment Methods:**

1. **⚡ Real-Time (Immediate)**
   - Triggers after user actions
   - Fast response
   - Integrated in feed service

2. **🕐 Scheduled (Hourly Cron)**
   - Checks all users every hour
   - Catches missed badges
   - Handles batch awards

### **Benefits:**

✅ **No Frontend Calls Needed** - All automatic  
✅ **Dual Protection** - Real-time + scheduled  
✅ **Scalable** - Handles any user count  
✅ **Logged** - Full audit trail  
✅ **Flexible** - Easy to adjust schedule  

---

## 🚀 **Next Steps**

1. ✅ Start server with cron jobs enabled
2. ✅ Monitor logs for hourly badge awards
3. ✅ Test by creating content and earning badges
4. ✅ Check leaderboard to see top badge earners

**Badges are now fully automatic!** 🏅✨
