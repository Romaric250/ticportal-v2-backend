# 🔄 Deliverables Schema Update - Dual Status System

## 🎯 Major Update: Separating Submission from Review

### Why This Change?

**Previous Issue:**
- Single `status` field mixed submission state and review state
- Admin couldn't filter "only submitted" deliverables
- Deleting submission changed review status incorrectly

**New Solution:**
- ✅ `submissionStatus`: NOT_SUBMITTED | SUBMITTED
- ✅ `reviewStatus`: PENDING | APPROVED | REJECTED

---

## 📊 Schema Changes

### Old Schema
```prisma
model TeamDeliverable {
  id          String            @id
  content     String
  status      DeliverableStatus @default(PENDING)  // Mixed concept
  // PENDING, APPROVED, REJECTED
}

enum DeliverableStatus {
  PENDING
  APPROVED
  REJECTED
}
```

### New Schema
```prisma
model TeamDeliverable {
  id               String           @id
  content          String
  submissionStatus SubmissionStatus @default(NOT_SUBMITTED)  // Has team submitted?
  reviewStatus     ReviewStatus     @default(PENDING)        // Admin's decision
}

enum SubmissionStatus {
  NOT_SUBMITTED  // Team hasn't submitted yet
  SUBMITTED      // Team has submitted content
}

enum ReviewStatus {
  PENDING    // Awaiting admin review
  APPROVED   // Admin approved
  REJECTED   // Admin rejected
}
```

---

## 🔄 Status Combinations

| Submission Status | Review Status | Meaning |
|-------------------|---------------|---------|
| NOT_SUBMITTED | PENDING | Template created, team hasn't submitted |
| SUBMITTED | PENDING | Team submitted, awaiting review |
| SUBMITTED | APPROVED | Team submitted, admin approved |
| SUBMITTED | REJECTED | Team submitted, admin rejected |
| NOT_SUBMITTED | REJECTED | Team deleted after rejection |

**Invalid Combinations:**
- ❌ NOT_SUBMITTED + APPROVED (can't approve what's not submitted)

---

## 📋 Migration Steps

### Step 1: Update Prisma Schema

```bash
# Run migration
npx prisma db push

# Or create migration
npx prisma migrate dev --name add_dual_status_system
```

### Step 2: Update Service Imports

```typescript
// Old
import { DeliverableStatus } from "@prisma/client";

// New
import { SubmissionStatus, ReviewStatus } from "@prisma/client";
```

### Step 3: Update All Status References

**Create Template:**
```typescript
// Old
status: DeliverableStatus.PENDING

// New
submissionStatus: SubmissionStatus.NOT_SUBMITTED,
reviewStatus: ReviewStatus.PENDING
```

**Team Submits:**
```typescript
// Old
status: DeliverableStatus.PENDING

// New
submissionStatus: SubmissionStatus.SUBMITTED,
reviewStatus: ReviewStatus.PENDING
```

**Admin Approves:**
```typescript
// Old
status: DeliverableStatus.APPROVED

// New
submissionStatus: SubmissionStatus.SUBMITTED,  // Keep submitted
reviewStatus: ReviewStatus.APPROVED            // Change review
```

**Admin Rejects:**
```typescript
// Old
status: DeliverableStatus.REJECTED

// New
submissionStatus: SubmissionStatus.SUBMITTED,  // Keep submitted
reviewStatus: ReviewStatus.REJECTED            // Change review
```

**Team/Admin Deletes:**
```typescript
// Old
status: DeliverableStatus.PENDING
content: ""

// New
submissionStatus: SubmissionStatus.NOT_SUBMITTED,  // Change to not submitted
reviewStatus: ReviewStatus.PENDING,                // Reset review
content: ""
```

---

## 🛣️ Updated Service Methods

### Create Template (Auto-create for teams)
```typescript
await db.teamDeliverable.createMany({
  data: teams.map(team => ({
    teamId: team.id,
    templateId: template.id,
    type: template.type,
    contentType: template.contentType,
    content: "",
    submissionStatus: SubmissionStatus.NOT_SUBMITTED,  // Not submitted yet
    reviewStatus: ReviewStatus.PENDING,                 // Pending review
  })),
});
```

### Team Submits
```typescript
await db.teamDeliverable.update({
  where: { id: deliverableId },
  data: {
    content: data.content,
    description: data.description,
    submissionStatus: SubmissionStatus.SUBMITTED,  // Mark as submitted
    reviewStatus: ReviewStatus.PENDING,            // Reset to pending if was rejected
    submittedAt: new Date(),
    reviewedAt: null,  // Clear previous review
    reviewedBy: null,
    feedback: null,
  },
});
```

### Admin Approves
```typescript
await db.teamDeliverable.update({
  where: { id: deliverableId },
  data: {
    reviewStatus: ReviewStatus.APPROVED,  // Only change review status
    reviewedAt: new Date(),
    reviewedBy: reviewerId,
    // submissionStatus stays SUBMITTED
  },
});
```

### Admin Rejects
```typescript
await db.teamDeliverable.update({
  where: { id: deliverableId },
  data: {
    reviewStatus: ReviewStatus.REJECTED,  // Only change review status
    feedback: reason,
    reviewedAt: new Date(),
    reviewedBy: reviewerId,
    // submissionStatus stays SUBMITTED
  },
});
```

### Admin Uploads for Team
```typescript
await db.teamDeliverable.create({
  data: {
    // ...other fields
    content: data.content,
    submissionStatus: SubmissionStatus.SUBMITTED,  // Admin submitted for team
    reviewStatus: ReviewStatus.PENDING,             // Awaiting review
  },
});
```

### Delete Submission (Reset)
```typescript
await db.teamDeliverable.update({
  where: { id: deliverableId },
  data: {
    content: "",
    description: null,
    submissionStatus: SubmissionStatus.NOT_SUBMITTED,  // Back to not submitted
    reviewStatus: ReviewStatus.PENDING,                 // Reset review
    feedback: null,
    reviewedAt: null,
    reviewedBy: null,
  },
});
```

---

## 🔍 Admin Filtering

### Get Only Submitted Deliverables
```typescript
// Admin dashboard - show only submitted for review
const submitted = await db.teamDeliverable.findMany({
  where: {
    submissionStatus: SubmissionStatus.SUBMITTED,  // Team has submitted
  },
  include: {
    team: true,
    template: true,
  },
});
```

### Get Pending Reviews
```typescript
// Show submissions awaiting review
const pendingReviews = await db.teamDeliverable.findMany({
  where: {
    submissionStatus: SubmissionStatus.SUBMITTED,
    reviewStatus: ReviewStatus.PENDING,  // Not reviewed yet
  },
});
```

### Get Not Submitted
```typescript
// Show teams that haven't submitted
const notSubmitted = await db.teamDeliverable.findMany({
  where: {
    submissionStatus: SubmissionStatus.NOT_SUBMITTED,
  },
});
```

### Get Approved Submissions
```typescript
const approved = await db.teamDeliverable.findMany({
  where: {
    submissionStatus: SubmissionStatus.SUBMITTED,
    reviewStatus: ReviewStatus.APPROVED,
  },
});
```

### Get Rejected Submissions
```typescript
const rejected = await db.teamDeliverable.findMany({
  where: {
    submissionStatus: SubmissionStatus.SUBMITTED,
    reviewStatus: ReviewStatus.REJECTED,
  },
});
```

---

## 📊 Updated API Responses

### Get Admin Deliverables
```json
GET /api/admin/deliverables

// Can filter by submissionStatus
GET /api/admin/deliverables?submissionStatus=SUBMITTED
GET /api/admin/deliverables?reviewStatus=PENDING

Response:
{
  "success": true,
  "data": [
    {
      "id": "deliverable_id",
      "team": {
        "name": "Team Alpha"
      },
      "content": "https://file.pdf",
      "submissionStatus": "SUBMITTED",     // Team has submitted
      "reviewStatus": "PENDING",            // Awaiting review
      "submittedAt": "2026-01-11T10:00:00Z"
    }
  ]
}
```

### Team Submits
```json
POST /api/deliverables/:id/submit

Response:
{
  "success": true,
  "data": {
    "submissionStatus": "SUBMITTED",  // Now marked as submitted
    "reviewStatus": "PENDING",         // Awaiting review
    "content": "https://file.pdf"
  }
}
```

### Admin Approves
```json
POST /api/admin/deliverables/:id/approve

Response:
{
  "success": true,
  "data": {
    "submissionStatus": "SUBMITTED",  // Still submitted
    "reviewStatus": "APPROVED",        // Now approved
    "reviewedAt": "2026-01-11T14:00:00Z"
  }
}
```

### Team/Admin Deletes
```json
DELETE /api/deliverables/:id

Response:
{
  "success": true,
  "data": {
    "submissionStatus": "NOT_SUBMITTED",  // Back to not submitted
    "reviewStatus": "PENDING",             // Reset review
    "content": ""                          // Empty
  }
}
```

---

## 🎯 Complete Workflow Examples

### Workflow 1: Normal Submission
```
1. Template created
   submissionStatus: NOT_SUBMITTED
   reviewStatus: PENDING

2. Team submits
   submissionStatus: SUBMITTED
   reviewStatus: PENDING

3. Admin approves
   submissionStatus: SUBMITTED
   reviewStatus: APPROVED
```

### Workflow 2: Rejection & Resubmission
```
1. Template created
   submissionStatus: NOT_SUBMITTED
   reviewStatus: PENDING

2. Team submits
   submissionStatus: SUBMITTED
   reviewStatus: PENDING

3. Admin rejects
   submissionStatus: SUBMITTED
   reviewStatus: REJECTED

4. Team resubmits (updates)
   submissionStatus: SUBMITTED
   reviewStatus: PENDING (reset)

5. Admin approves
   submissionStatus: SUBMITTED
   reviewStatus: APPROVED
```

### Workflow 3: Deletion After Submission
```
1. Team submits
   submissionStatus: SUBMITTED
   reviewStatus: PENDING

2. Team deletes
   submissionStatus: NOT_SUBMITTED  (changed)
   reviewStatus: PENDING             (reset)
   content: ""

3. Team resubmits
   submissionStatus: SUBMITTED
   reviewStatus: PENDING
```

### Workflow 4: Admin Submits for Team
```
1. Template created
   submissionStatus: NOT_SUBMITTED
   reviewStatus: PENDING

2. Admin uploads for team
   submissionStatus: SUBMITTED  (admin submission)
   reviewStatus: PENDING         (awaiting review)

3. Admin or another admin reviews
   submissionStatus: SUBMITTED
   reviewStatus: APPROVED/REJECTED
```

---

## 🔍 Admin Dashboard Filters

### Filter Options
```typescript
interface DeliverableFilters {
  submissionStatus?: 'NOT_SUBMITTED' | 'SUBMITTED';
  reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  teamId?: string;
  templateId?: string;
}

// Show only submitted deliverables
GET /api/admin/deliverables?submissionStatus=SUBMITTED

// Show only pending reviews
GET /api/admin/deliverables?submissionStatus=SUBMITTED&reviewStatus=PENDING

// Show approved submissions
GET /api/admin/deliverables?reviewStatus=APPROVED

// Show teams that haven't submitted
GET /api/admin/deliverables?submissionStatus=NOT_SUBMITTED
```

---

## ✅ Benefits of Dual Status System

### For Admins
1. ✅ **Clear Filtering:** See only submitted deliverables
2. ✅ **Accurate Count:** Know how many teams submitted
3. ✅ **Review Queue:** Filter pending reviews easily
4. ✅ **Track Progress:** See who hasn't submitted yet
5. ✅ **Better Analytics:** Separate submission rate from approval rate

### For Teams
1. ✅ **Clear State:** Know if submission is received
2. ✅ **Review Status:** See if admin has reviewed
3. ✅ **Resubmit After Delete:** Can delete and start fresh
4. ✅ **Update After Rejection:** Can improve and resubmit

### For System
1. ✅ **Data Integrity:** Statuses don't conflict
2. ✅ **Audit Trail:** Clear history of submission vs review
3. ✅ **Flexible Queries:** Easy filtering and reporting
4. ✅ **Logical States:** No invalid state combinations

---

## 📝 Database Migration Script

```typescript
// Migration script to update existing data
async function migrateExistingDeliverables() {
  const allDeliverables = await db.teamDeliverable.findMany();

  for (const deliverable of allDeliverables) {
    let submissionStatus: SubmissionStatus;
    let reviewStatus: ReviewStatus;

    // Determine submission status based on content
    if (deliverable.content && deliverable.content.length > 0) {
      submissionStatus = SubmissionStatus.SUBMITTED;
    } else {
      submissionStatus = SubmissionStatus.NOT_SUBMITTED;
    }

    // Map old status to new reviewStatus
    switch (deliverable.status) {
      case 'APPROVED':
        reviewStatus = ReviewStatus.APPROVED;
        break;
      case 'REJECTED':
        reviewStatus = ReviewStatus.REJECTED;
        break;
      case 'PENDING':
      default:
        reviewStatus = ReviewStatus.PENDING;
        break;
    }

    // Update deliverable
    await db.teamDeliverable.update({
      where: { id: deliverable.id },
      data: {
        submissionStatus,
        reviewStatus,
      },
    });
  }

  console.log(`Migrated ${allDeliverables.length} deliverables`);
}
```

---

## 🎨 Frontend Updates

### Status Badge Component
```typescript
const DeliverableStatusBadges = ({ deliverable }: { deliverable: any }) => {
  return (
    <div className="status-badges">
      {/* Submission Status */}
      <span className={`badge ${deliverable.submissionStatus.toLowerCase()}`}>
        {deliverable.submissionStatus === 'SUBMITTED' ? '✅ Submitted' : '⏳ Not Submitted'}
      </span>

      {/* Review Status (only show if submitted) */}
      {deliverable.submissionStatus === 'SUBMITTED' && (
        <span className={`badge ${deliverable.reviewStatus.toLowerCase()}`}>
          {deliverable.reviewStatus === 'APPROVED' && '✅ Approved'}
          {deliverable.reviewStatus === 'REJECTED' && '❌ Rejected'}
          {deliverable.reviewStatus === 'PENDING' && '⏳ Pending Review'}
        </span>
      )}
    </div>
  );
};
```

### Admin Filter Component
```typescript
const AdminDeliverablesFilter = () => {
  const [filters, setFilters] = useState({
    submissionStatus: 'ALL',
    reviewStatus: 'ALL',
  });

  return (
    <div className="filters">
      <select
        value={filters.submissionStatus}
        onChange={(e) => setFilters({ ...filters, submissionStatus: e.target.value })}
      >
        <option value="ALL">All Submissions</option>
        <option value="SUBMITTED">Submitted Only</option>
        <option value="NOT_SUBMITTED">Not Submitted</option>
      </select>

      <select
        value={filters.reviewStatus}
        onChange={(e) => setFilters({ ...filters, reviewStatus: e.target.value })}
      >
        <option value="ALL">All Reviews</option>
        <option value="PENDING">Pending Review</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>
  );
};
```

---

## 🎯 Status Decision Tree

```
Template Created
├─ submissionStatus: NOT_SUBMITTED
└─ reviewStatus: PENDING

Team Submits
├─ submissionStatus: SUBMITTED
└─ reviewStatus: PENDING

Admin Reviews
├─ submissionStatus: SUBMITTED (unchanged)
└─ reviewStatus: APPROVED or REJECTED

Team Deletes
├─ submissionStatus: NOT_SUBMITTED
├─ reviewStatus: PENDING (reset)
└─ content: "" (empty)

Team Resubmits After Rejection
├─ submissionStatus: SUBMITTED (stays)
└─ reviewStatus: PENDING (reset)
```

---

**Status:** ✅ Dual Status System Documented!  
**Schema:** Updated with submissionStatus + reviewStatus  
**Benefits:** Clear separation, better filtering, accurate tracking  
**Version:** 3.0.0 - Major Update
