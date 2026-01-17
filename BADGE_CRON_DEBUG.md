# 🔧 Badge Cron Troubleshooting Guide

## ✅ **What Was Fixed**

### **Problem:** Badge cron not running
- Health check cron works ✅
- Badge cron doesn't trigger ❌

### **Root Causes Fixed:**

1. **Circular Dependency** - BadgeService imported at top level
   - **Fix:** Lazy load inside cron callback

2. **Not Started Properly** - Job wasn't starting
   - **Fix:** Explicit `.start()` call with error handling

3. **No Logging** - Silent failures
   - **Fix:** Added comprehensive logging

---

## 🧪 **Testing Steps**

### **Step 1: Restart Your Server**

```bash
# Stop current server (Ctrl+C)
# Start fresh
npm run dev
```

### **Step 2: Check Startup Logs**

You should see:
```
✅ Health check cron started: Every 14 minutes
✅ Badge award cron started: Every 1 minute (TESTING MODE)
⚠️  For production, change schedule to '0 * * * *' (every hour)
🚀 All cron jobs running!
🧪 Testing badge job now...
🏅 Badge award cron triggered at 2024-01-16T...
📊 Checking badges for all users...
🎉 Badge award job completed - X badges awarded
```

### **Step 3: Wait 1 Minute**

After 1 minute, you should see:
```
🏅 Badge award cron triggered at 2024-01-16T...
📊 Checking badges for all users...
🎉 Badge award job completed - X badges awarded
```

This will repeat **every minute** (testing mode).

---

## 🔍 **Debugging Commands**

### **Check if Cron is Running:**

Add this to your code temporarily:
```typescript
import { badgeAwardJob } from './config/cron';

console.log('Badge cron running?', badgeAwardJob.running);
console.log('Badge cron pattern:', badgeAwardJob.cronTime.source);
```

### **Manual Trigger:**

```typescript
import { badgeAwardJob } from './config/cron';

// Fire immediately
badgeAwardJob.fireOnTick();
```

### **Test via Script:**

```bash
# Run the test script
npx tsx src/scripts/test-badge-cron.ts

# Should output:
🧪 Testing Badge Award Cron...
⏰ Starting badge check at: 2024-01-16T...
📊 Checking badges for all users...
✅ Test completed!
📊 Total badges awarded: 5
🎉 SUCCESS! Badges were awarded!
```

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: "Cannot find module '../modules/badges/service'"**

**Cause:** Path issue or circular dependency

**Fix:**
```typescript
// Use dynamic import
const { BadgeService } = await import("../modules/badges/service");
```

### **Issue 2: Cron starts but doesn't trigger**

**Cause:** Timezone or pattern issue

**Fix:**
```typescript
// Ensure pattern is correct
"*/1 * * * *" // Every minute ✅
"0 * * * *"   // Every hour ✅

// Check timezone
new CronJob(pattern, callback, null, false, "UTC");
```

### **Issue 3: Silent failures (no logs)**

**Cause:** Errors being swallowed

**Fix:**
```typescript
try {
  // cron logic
} catch (error: any) {
  logger.error({ error: error.message, stack: error.stack });
  console.error("Badge cron error:", error); // Force console log
}
```

### **Issue 4: "BadgeService is not a constructor"**

**Cause:** Import issue

**Fix:**
```typescript
// Correct import
import { BadgeService } from "../modules/badges/service";

// NOT this:
import BadgeService from "../modules/badges/service"; ❌
```

---

## 📊 **Verification Checklist**

- [ ] Server starts without errors
- [ ] See "✅ Badge award cron started" in logs
- [ ] After 1 minute, see "🏅 Badge award cron triggered"
- [ ] See "🎉 Badge award job completed" message
- [ ] Badges are being awarded (check database or API)

---

## 🔄 **Schedule Options**

Current: **Every 1 minute** (testing)
```typescript
"*/1 * * * *"
```

**Change to production schedule:**
```typescript
// Every hour
"0 * * * *"

// Every 30 minutes
"*/30 * * * *"

// Every 2 hours
"0 */2 * * *"

// Every 6 hours
"0 */6 * * *"
```

**Update in `src/config/cron.ts`:**
```typescript
export const badgeAwardJob = new CronJob(
  "0 * * * *", // Change here
  async () => {
    // ...
  }
);
```

---

## 🎯 **Expected Behavior**

### **Testing Mode (Every 1 Minute):**

```
00:00:00 - Server starts
00:00:01 - Badge cron triggers immediately (fireOnTick)
00:01:00 - Badge cron triggers (scheduled)
00:02:00 - Badge cron triggers
00:03:00 - Badge cron triggers
...
```

### **Production Mode (Every Hour):**

```
00:00:00 - Server starts
01:00:00 - Badge cron triggers
02:00:00 - Badge cron triggers
03:00:00 - Badge cron triggers
...
```

---

## 🚨 **Emergency Disable**

If cron is causing issues:

```typescript
// In app.ts, comment out:
// startCronJobs();

// Or stop specific job:
import { badgeAwardJob } from './config/cron';
badgeAwardJob.stop();
```

---

## ✅ **Success Indicators**

You know it's working when:

1. **Logs show triggers every minute** ✅
2. **No error messages** ✅
3. **Badges appear in database** ✅
4. **API returns new badges** ✅

Test API:
```bash
GET /api/badges/my-badges

# Should show newly awarded badges
```

---

## 🎓 **Understanding the Flow**

```
Server starts
    ↓
startCronJobs() called
    ↓
badgeAwardJob.start()
    ↓
[Every 1 minute]
    ↓
Cron callback executes
    ↓
Lazy load BadgeService
    ↓
checkBadgesForAllUsers()
    ↓
For each user:
  - Get stats
  - Check requirements
  - Award badges
    ↓
Log results
    ↓
Wait 1 minute
    ↓
Repeat
```

---

## 🛠️ **Advanced Debugging**

### **Enable Verbose Logging:**

```typescript
const badgeAwardJob = new CronJob(
  "*/1 * * * *",
  async () => {
    console.log("=== CRON START ===");
    console.log("Time:", new Date());
    
    try {
      console.log("Loading BadgeService...");
      const { BadgeService } = await import("../modules/badges/service");
      console.log("BadgeService loaded ✅");
      
      console.log("Starting badge check...");
      const result = await BadgeService.checkBadgesForAllUsers();
      console.log("Badge check completed ✅");
      console.log("Result:", result);
      
    } catch (error) {
      console.error("=== CRON ERROR ===");
      console.error(error);
    }
    
    console.log("=== CRON END ===");
  }
);
```

---

**The badge cron should now work perfectly!** 🏅✨
