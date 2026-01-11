# ✅ Dual Status System - Implementation Checklist

## 🎯 What Changed

### Schema Update
- ✅ Added `submissionStatus` enum (NOT_SUBMITTED, SUBMITTED)
- ✅ Added `reviewStatus` enum (PENDING, APPROVED, REJECTED)
- ✅ Removed old `status` field
- ✅ Updated `DeliverableStatus` → Split into two enums

---

## 📋 Implementation Steps

### 1. Run Database Migration
```bash
cd c:\Users\Romaric\Desktop\Projects\ticportal\ticportal-v2-backend

# Push schema changes
npx prisma db push

# Or create migration
npx prisma migrate dev --name add_dual_status_system

# Generate Prisma Client
npx prisma generate
```

### 2. Update Service File

**File:** `src/modules/deliverables/service.ts`

```typescript
// Change imports
import { SubmissionStatus, ReviewStatus } from "@prisma/client";

// Update all references:
// DeliverableStatus.PENDING → ReviewStatus.PENDING
// DeliverableStatus.APPROVED → ReviewStatus.APPROVED
// DeliverableStatus.REJECTED → ReviewStatus.REJECTED

// Add submissionStatus everywhere
```

### 3. Key Changes in Service Methods

**Create Template:**
```typescript
submissionStatus: SubmissionStatus.NOT_SUBMITTED,
reviewStatus: ReviewStatus.PENDING,
```

**Team Submits:**
```typescript
submissionStatus: SubmissionStatus.SUBMITTED,
reviewStatus: ReviewStatus.PENDING,
```

**Admin Approves:**
```typescript
reviewStatus: ReviewStatus.APPROVED,
// submissionStatus stays SUBMITTED
```

**Admin Rejects:**
```typescript
reviewStatus: ReviewStatus.REJECTED,
// submissionStatus stays SUBMITTED
```

**Delete (Reset):**
```typescript
submissionStatus: SubmissionStatus.NOT_SUBMITTED,
reviewStatus: ReviewStatus.PENDING,
content: "",
```

### 4. Admin Filter - Get Only Submitted

```typescript
// Add to getDeliverables method
const deliverables = await db.teamDeliverable.findMany({
  where: {
    submissionStatus: filters?.submissionStatus,  // NEW
    reviewStatus: filters?.reviewStatus,          // Changed from status
    teamId: filters?.teamId,
    templateId: filters?.templateId,
  },
});
```

---

## 🔍 Testing Checklist

### Test 1: Template Creation
```bash
POST /api/admin/deliverable-templates

# Expected result:
# - Auto-creates for all teams
# - submissionStatus: NOT_SUBMITTED
# - reviewStatus: PENDING
```

### Test 2: Team Submission
```bash
POST /api/deliverables/:id/submit

# Expected result:
# - submissionStatus: SUBMITTED
# - reviewStatus: PENDING
```

### Test 3: Admin Filtering (NEW!)
```bash
# Get only submitted deliverables
GET /api/admin/deliverables?submissionStatus=SUBMITTED

# Get only pending reviews
GET /api/admin/deliverables?submissionStatus=SUBMITTED&reviewStatus=PENDING

# Get not submitted
GET /api/admin/deliverables?submissionStatus=NOT_SUBMITTED
```

### Test 4: Admin Approval
```bash
POST /api/admin/deliverables/:id/approve

# Expected result:
# - submissionStatus: SUBMITTED (unchanged)
# - reviewStatus: APPROVED
```

### Test 5: Admin Rejection
```bash
POST /api/admin/deliverables/:id/reject

# Expected result:
# - submissionStatus: SUBMITTED (unchanged)
# - reviewStatus: REJECTED
```

### Test 6: Delete Submission
```bash
DELETE /api/deliverables/:id

# Expected result:
# - submissionStatus: NOT_SUBMITTED (changed)
# - reviewStatus: PENDING (reset)
# - content: ""
```

### Test 7: Admin Submits for Team
```bash
POST /api/admin/deliverables/:teamId

# Expected result:
# - submissionStatus: SUBMITTED
# - reviewStatus: PENDING
```

---

## 🎯 Quick Reference

### Status Combinations

| Action | Submission Status | Review Status |
|--------|------------------|---------------|
| Template created | NOT_SUBMITTED | PENDING |
| Team submits | SUBMITTED | PENDING |
| Admin approves | SUBMITTED | APPROVED |
| Admin rejects | SUBMITTED | REJECTED |
| Team/Admin deletes | NOT_SUBMITTED | PENDING |
| Team resubmits after rejection | SUBMITTED | PENDING |
| Admin submits for team | SUBMITTED | PENDING |

---

## 📊 API Response Changes

### Before (Single Status)
```json
{
  "status": "PENDING",
  "content": "file.pdf"
}
```

### After (Dual Status)
```json
{
  "submissionStatus": "SUBMITTED",
  "reviewStatus": "PENDING",
  "content": "file.pdf"
}
```

---

## 🔄 Migration Script

Run this after schema update to migrate existing data:

```typescript
// src/scripts/migrate-deliverables.ts
import { db } from "../config/database";
import { SubmissionStatus, ReviewStatus } from "@prisma/client";

async function migrateDeliverables() {
  const deliverables = await db.teamDeliverable.findMany();

  for (const d of deliverables) {
    // Determine submission status
    const submissionStatus = d.content && d.content.length > 0
      ? SubmissionStatus.SUBMITTED
      : SubmissionStatus.NOT_SUBMITTED;

    // Map old status to reviewStatus
    let reviewStatus: ReviewStatus;
    switch (d.status) {
      case 'APPROVED':
        reviewStatus = ReviewStatus.APPROVED;
        break;
      case 'REJECTED':
        reviewStatus = ReviewStatus.REJECTED;
        break;
      default:
        reviewStatus = ReviewStatus.PENDING;
    }

    await db.teamDeliverable.update({
      where: { id: d.id },
      data: { submissionStatus, reviewStatus },
    });
  }

  console.log(`✅ Migrated ${deliverables.length} deliverables`);
}

migrateDeliverables();
```

---

## ✅ Benefits

### For Admin
- ✅ Filter only submitted deliverables
- ✅ See pending reviews clearly
- ✅ Track who hasn't submitted
- ✅ Better analytics

### For Teams
- ✅ Clear submission state
- ✅ Know review status
- ✅ Can delete and resubmit

### For System
- ✅ Data integrity
- ✅ Logical states
- ✅ Easy filtering
- ✅ Accurate tracking

---

## 📖 Documentation

- **Full Guide:** `DELIVERABLES_DUAL_STATUS_SYSTEM.md`
- **API Reference:** `DELIVERABLES_API_REFERENCE.md` (update needed)
- **Student Guide:** `STUDENT_DELIVERABLES.md` (update needed)

---

**Next Steps:**
1. ✅ Run `npx prisma db push`
2. ✅ Update service.ts imports and logic
3. ✅ Test all endpoints
4. ✅ Update frontend to show both statuses
5. ✅ Run migration script for existing data

**Status:** 📝 Schema Updated - Ready for Implementation  
**Version:** 3.0.0 - Major Update
