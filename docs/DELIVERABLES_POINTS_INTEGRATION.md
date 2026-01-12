# 🎯 TIC Points Integration for Deliverables

## Points Awarded

### Deliverable Submission (10 points)
**When:** Team submits a deliverable  
**Who:** All team members  
**Action:** `DELIVERABLE_SUBMISSION`

```typescript
// In submitDeliverable() method
const teamMembers = await db.teamMember.findMany({
  where: { teamId: data.teamId },
});

await Promise.all(
  teamMembers.map((member) =>
    db.point.create({
      data: {
        userId: member.userId,
        // Add correct fields based on your Point model
        reason: `Submitted deliverable: ${deliverable.template.title}`,
      },
    })
  )
);
```

### Deliverable Approved (20 bonus points)
**When:** Admin approves a submitted deliverable  
**Who:** All team members  
**Action:** `DELIVERABLE_APPROVED`

```typescript
// In approveDeliverable() method
const teamMembers = await db.teamMember.findMany({
  where: { teamId: deliverable.teamId },
});

await Promise.all(
  teamMembers.map((member) =>
    db.point.create({
      data: {
        userId: member.userId,
        // Add correct fields based on your Point model
        reason: `Deliverable approved: ${deliverable.template.title}`,
      },
    })
  )
);
```

---

## Implementation Steps

### 1. Check Your Point Model Schema

Look at your `prisma/schema.prisma` for the `Point` model:

```prisma
model Point {
  id String @id @default(cuid())
  userId String
  // What other fields exist?
  // value? points? amount?
  // action? type? category?
  // reason? description?
  // hackathonId?
  createdAt DateTime @default(now())
  
  user User @relation(...)
}
```

### 2. Update Points Code

Based on your Point model, update the point creation code in `service.ts`:

**If your model has:**
- `points: Int` field:
  ```typescript
  db.point.create({
    data: {
      userId: member.userId,
      points: 10,
      reason: "Deliverable submission",
    },
  })
  ```

- `value: Int` field:
  ```typescript
  db.point.create({
    data: {
      userId: member.userId,
      value: 10,
      description: "Deliverable submission",
    },
  })
  ```

- `action: String` enum:
  ```typescript
  db.point.create({
    data: {
      userId: member.userId,
      action: "DELIVERABLE_SUBMISSION",
      hackathonId: deliverable.template.hackathonId,
    },
  })
  ```

### 3. Points Breakdown

| Activity | Points | Triggered When |
|----------|--------|----------------|
| Submit Deliverable | 10 | `submitDeliverable()` |
| Update Deliverable | 0 | (No points for updates) |
| Deliverable Approved | 20 | `approveDeliverable()` |
| Deliverable Rejected | 0 | (No penalty) |
| Delete Submission | 0 | (No points deducted) |
| **Total Possible** | **30 per deliverable** | Submit + Approved |

### 4. Example Workflow

```typescript
// Team submits proposal
POST /api/deliverables/123/submit
→ ✅ 10 points to each team member

// Admin approves
POST /api/admin/deliverables/123/approve
→ ✅ 20 points to each team member

// Total: 30 points per member for approved deliverable
```

---

## TODO: Fix Points Integration

1. **Check `prisma/schema.prisma`** - Find your Point model fields
2. **Update `service.ts` lines ~560 and ~390** - Fix the point creation to match your schema
3. **Test** - Submit and approve a deliverable to verify points are awarded

---

## Current Code Location

Points tracking code added at:
- **Line ~560:** `submitDeliverable()` - Awards points on submission
- **Line ~390:** `approveDeliverable()` - Awards bonus points on approval

**Status:** ⚠️ Needs Point model fields correction
