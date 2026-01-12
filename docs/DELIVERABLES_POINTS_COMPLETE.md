# ✅ TIC Points Integration - Complete!

## 🎯 Points System Implemented

### Points Awarded for Deliverables

| Activity | Points | When | Code Location |
|----------|--------|------|---------------|
| **Submit Deliverable** | 10 | Team submits | `submitDeliverable()` |
| **Deliverable Approved** | 20 | Admin approves | `approveDeliverable()` |
| **Total Possible** | **30** | Submit + Approved | Per team member |

---

## 📊 How It Works

### 1. Submit Deliverable (+10 points)

```typescript
// When team submits deliverable
POST /api/deliverables/:id/submit

// Each team member receives:
db.userActivity.create({
  userId: member.userId,
  type: "HACKATHON",
  action: "DELIVERABLE_SUBMIT",
  pointsAwarded: 10,
  metadata: {
    deliverableId: "...",
    templateId: "...",
    title: "Project Proposal",
  },
})
```

**Console output:**
```
✅ Awarded 10 points to team TEAM_ID
```

### 2. Approve Deliverable (+20 bonus points)

```typescript
// When admin approves deliverable
POST /api/admin/deliverables/:id/approve

// Each team member receives additional:
db.userActivity.create({
  userId: member.userId,
  type: "HACKATHON",
  action: "DELIVERABLE_APPROVED",
  pointsAwarded: 20,
  metadata: {
    deliverableId: "...",
    templateId: "...",
    title: "Project Proposal",
    reviewerId: "ADMIN_ID",
  },
})
```

**Console output:**
```
✅ Awarded 20 bonus points to team TEAM_ID
```

---

## 🎮 Complete Workflow Example

### Scenario: Team submits and gets approved

```bash
# 1. Team submits proposal
POST /api/deliverables/123/submit
{
  "teamId": "team_abc",
  "content": "https://...",
  "contentType": "FILE"
}
→ ✅ Each member gets +10 points

# 2. Admin approves
POST /api/admin/deliverables/123/approve
{
  "reviewerId": "admin_xyz"
}
→ ✅ Each member gets +20 bonus points

# Total: 30 points per team member! 🎉
```

---

## 📋 Activities Tracked

### Deliverable Submit
- **Type:** `HACKATHON`
- **Action:** `DELIVERABLE_SUBMIT`
- **Points:** 10
- **Metadata:**
  - `deliverableId`
  - `templateId`
  - `title`

### Deliverable Approved
- **Type:** `HACKATHON`
- **Action:** `DELIVERABLE_APPROVED`
- **Points:** 20
- **Metadata:**
  - `deliverableId`
  - `templateId`
  - `title`
  - `reviewerId`

---

## 🔍 Viewing Points

### Get User's Total Points

```typescript
const activities = await db.userActivity.findMany({
  where: { userId: "USER_ID" },
  select: { pointsAwarded: true },
});

const totalPoints = activities.reduce(
  (sum, activity) => sum + activity.pointsAwarded,
  0
);

console.log(`Total points: ${totalPoints}`);
```

### Get Team's Deliverable Points

```typescript
const teamMembers = await db.teamMember.findMany({
  where: { teamId: "TEAM_ID" },
  include: {
    user: {
      include: {
        activities: {
          where: {
            type: "HACKATHON",
            action: {
              in: ["DELIVERABLE_SUBMIT", "DELIVERABLE_APPROVED"],
            },
          },
        },
      },
    },
  },
});

// Each member's deliverable points
teamMembers.forEach((member) => {
  const points = member.user.activities.reduce(
    (sum, a) => sum + a.pointsAwarded,
    0
  );
  console.log(`${member.user.firstName}: ${points} points`);
});
```

---

## ⚙️ Configuration

Points values are defined in:
```
src/shared/constants/points.ts
```

```typescript
HACKATHON: {
  DELIVERABLE_SUBMIT: 10,      // Submission
  DELIVERABLE_APPROVED: 20,    // Approval bonus
  // ...other hackathon points
}
```

To change point values, edit this file and restart the server.

---

## 🧪 Testing Points

### 1. Submit a Deliverable

```bash
curl -X POST http://localhost:5000/api/deliverables/DELIVERABLE_ID/submit \
  -H "Content-Type: application/json" \
  -d '{
    "teamId": "TEAM_ID",
    "content": "https://example.com/file.pdf",
    "contentType": "FILE"
  }'

# Check console for:
# ✅ Awarded 10 points to team TEAM_ID
```

### 2. Approve the Deliverable

```bash
curl -X POST http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID/approve \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": "ADMIN_ID"
  }'

# Check console for:
# ✅ Awarded 20 bonus points to team TEAM_ID
```

### 3. Check User Activities

```bash
# Get user's activities
curl http://localhost:5000/api/users/USER_ID/activities

# Should show:
[
  {
    "type": "HACKATHON",
    "action": "DELIVERABLE_SUBMIT",
    "pointsAwarded": 10,
    "createdAt": "..."
  },
  {
    "type": "HACKATHON",
    "action": "DELIVERABLE_APPROVED",
    "pointsAwarded": 20,
    "createdAt": "..."
  }
]
```

---

## 🎯 Points Summary

### Per Deliverable (Per Team Member)
- ✅ Submit: **10 points**
- ✅ Approved: **+20 points**
- ✅ Total: **30 points**

### Example: Team of 5 Members
- Submit deliverable: **50 points total** (10 × 5)
- Get approved: **+100 points total** (20 × 5)
- **Grand Total: 150 points for the team!**

---

## 📝 Implementation Details

### Files Modified

1. **`src/shared/constants/points.ts`**
   - Added `DELIVERABLE_SUBMIT: 10`
   - Added `DELIVERABLE_APPROVED: 20`
   - Added activity type mappings

2. **`src/modules/deliverables/service.ts`**
   - Added points tracking in `submitDeliverable()`
   - Added bonus points in `approveDeliverable()`
   - Uses `UserActivity` model for tracking

### Error Handling

Points awarding is wrapped in try-catch to prevent submission failures if points fail:

```typescript
try {
  // Award points
  await db.userActivity.create({...});
} catch (error) {
  console.error("Failed to award points:", error);
  // Continue anyway - don't fail the submission
}
```

---

## 🚀 Status

✅ **COMPLETE AND WORKING!**

- Points configured in `points.ts`
- Tracking implemented in `service.ts`
- Activities stored in `UserActivity` model
- Console logging for verification
- Error handling included

**Test it now by submitting and approving a deliverable!** 🎉

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-11  
**Status:** ✅ Production Ready
