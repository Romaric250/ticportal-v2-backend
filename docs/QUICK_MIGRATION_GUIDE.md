# 🚀 Quick Migration Guide - Dual Status System

## ⚡ Immediate Steps to Fix the Error

### Step 1: Run Prisma Generation
```bash
cd c:\Users\Romaric\Desktop\Projects\ticportal\ticportal-v2-backend

# Generate new Prisma client with updated enums
npx prisma generate

# Push schema to database
npx prisma db push
```

This will:
- ✅ Generate new `SubmissionStatus` and `ReviewStatus` enums
- ✅ Remove old `DeliverableStatus` enum
- ✅ Update database schema
- ✅ Fix the import error

---

## 🔧 Files Already Updated

### ✅ Schema (prisma/schema.prisma)
- Added `SubmissionStatus` enum
- Added `ReviewStatus` enum  
- Updated `TeamDeliverable` model
- Removed old `DeliverableStatus` enum

### ✅ Service (partially - src/modules/deliverables/service.ts)
- Updated imports to use new enums
- Main methods structure updated

---

## 📝 Quick Fixes Needed in Service File

After running `npx prisma generate`, fix these specific lines in `service.ts`:

### Line ~114 (Create Template - Auto-create deliverables)
```typescript
// Find this
status: DeliverableStatus.PENDING,

// Replace with
submissionStatus: SubmissionStatus.NOT_SUBMITTED,
reviewStatus: ReviewStatus.PENDING,
```

### Line ~330 (Upload Deliverable)
```typescript
// Find this
status: DeliverableStatus.PENDING,

// Replace with
submissionStatus: SubmissionStatus.SUBMITTED,
reviewStatus: ReviewStatus.PENDING,
```

### Line ~366 (Approve Deliverable)
```typescript
// Find this
status: DeliverableStatus.APPROVED,

// Replace with
reviewStatus: ReviewStatus.APPROVED,
// Note: submissionStatus stays SUBMITTED (don't change it)
```

### Line ~418 (Reject Deliverable)
```typescript
// Find this
status: DeliverableStatus.REJECTED,

// Replace with
reviewStatus: ReviewStatus.REJECTED,
// Note: submissionStatus stays SUBMITTED (don't change it)
```

### Line ~496 (Submit Deliverable - Check approved)
```typescript
// Find this
if (deliverable.status === DeliverableStatus.APPROVED) {

// Replace with
if (deliverable.reviewStatus === ReviewStatus.APPROVED) {
```

### Line ~501 (Submit Deliverable - Check rejected)
```typescript
// Find this
const wasRejected = deliverable.status === DeliverableStatus.REJECTED;

// Replace with
const wasRejected = deliverable.reviewStatus === ReviewStatus.REJECTED;
```

### Line ~512 (Submit Deliverable - Update status)
```typescript
// Find this
status: DeliverableStatus.PENDING,

// Replace with
submissionStatus: SubmissionStatus.SUBMITTED,
reviewStatus: ReviewStatus.PENDING,
```

### Line ~646 (Delete Submission - Check approved)
```typescript
// Find this
if (deliverable.status === DeliverableStatus.APPROVED) {

// Replace with
if (deliverable.reviewStatus === ReviewStatus.APPROVED) {
```

### Line ~658 (Delete Submission - Reset status)
```typescript
// Find this
status: DeliverableStatus.PENDING,

// Replace with
submissionStatus: SubmissionStatus.NOT_SUBMITTED,
reviewStatus: ReviewStatus.PENDING,
```

---

## 🎯 Controller Updates

### Update getDeliverables method (controller.ts)

```typescript
// Find this
const { status, teamId, templateId } = req.query;

const deliverables = await DeliverableService.getDeliverables({
  status: status as any,
  teamId: teamId as string,
  templateId: templateId as string,
});

// Replace with
const { submissionStatus, reviewStatus, teamId, templateId } = req.query;

const deliverables = await DeliverableService.getDeliverables({
  submissionStatus: submissionStatus as any,
  reviewStatus: reviewStatus as any,
  teamId: teamId as string,
  templateId: templateId as string,
});
```

---

## ⚡ Automated Fix Script

Save this as `fix-deliverables.js` and run with `node fix-deliverables.js`:

```javascript
const fs = require('fs');
const path = require('path');

const servicePath = path.join(__dirname, 'src', 'modules', 'deliverables', 'service.ts');
let content = fs.readFileSync(servicePath, 'utf8');

// Replace all DeliverableStatus references
content = content.replace(/status: DeliverableStatus\.PENDING,/g, 
  'submissionStatus: SubmissionStatus.NOT_SUBMITTED,\n        reviewStatus: ReviewStatus.PENDING,');

content = content.replace(/status: DeliverableStatus\.APPROVED,/g, 
  'reviewStatus: ReviewStatus.APPROVED,');

content = content.replace(/status: DeliverableStatus\.REJECTED,/g, 
  'reviewStatus: ReviewStatus.REJECTED,');

content = content.replace(/deliverable\.status === DeliverableStatus\.APPROVED/g, 
  'deliverable.reviewStatus === ReviewStatus.APPROVED');

content = content.replace(/deliverable\.status === DeliverableStatus\.REJECTED/g, 
  'deliverable.reviewStatus === ReviewStatus.REJECTED');

content = content.replace(/status\?: DeliverableStatus;/g, 
  'submissionStatus?: SubmissionStatus;\n    reviewStatus?: ReviewStatus;');

fs.writeFileSync(servicePath, content);
console.log('✅ Service file updated!');
```

---

## 🧪 Test After Migration

```bash
# 1. Restart server
npm run dev

# 2. Create a template (should auto-create with new statuses)
curl -X POST http://localhost:5000/api/admin/deliverable-templates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "description": "Test",
    "type": "PROPOSAL",
    "contentType": "FILE",
    "dueDate": "2026-02-01T00:00:00Z"
  }'

# 3. Check database - should have:
# submissionStatus: NOT_SUBMITTED
# reviewStatus: PENDING

# 4. Test filtering
curl "http://localhost:5000/api/admin/deliverables?submissionStatus=SUBMITTED"
curl "http://localhost:5000/api/admin/deliverables?reviewStatus=PENDING"
```

---

## ✅ Expected Behavior After Fix

### Template Creation
```json
{
  "submissionStatus": "NOT_SUBMITTED",
  "reviewStatus": "PENDING",
  "content": ""
}
```

### Team Submits
```json
{
  "submissionStatus": "SUBMITTED",    // Changed
  "reviewStatus": "PENDING",
  "content": "https://file.pdf"
}
```

### Admin Approves
```json
{
  "submissionStatus": "SUBMITTED",    // Unchanged
  "reviewStatus": "APPROVED",          // Changed
  "content": "https://file.pdf"
}
```

### Team/Admin Deletes
```json
{
  "submissionStatus": "NOT_SUBMITTED", // Changed
  "reviewStatus": "PENDING",            // Reset
  "content": ""
}
```

---

## 🎯 Priority Order

1. ✅ Run `npx prisma generate` (FIRST - must do this!)
2. ✅ Run `npx prisma db push`
3. ✅ Fix service.ts (use script or manual)
4. ✅ Fix controller.ts (update filter params)
5. ✅ Restart server
6. ✅ Test endpoints

---

**Start with Step 1 - it will fix the import error immediately!**

```bash
npx prisma generate
```

This generates the new enums and makes them available to import! 🚀
