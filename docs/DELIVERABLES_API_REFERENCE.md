# 📋 Deliverables API - Quick Reference

## Student/Team Routes (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/deliverable-templates` | View all requirements |
| GET | `/api/deliverables/team/:teamId` | View team's deliverables |
| GET | `/api/deliverables/:deliverableId` | View single deliverable |
| POST | `/api/deliverables/:deliverableId/submit` | Submit or update |
| DELETE | `/api/deliverables/:deliverableId` | Delete submission |
| GET | `/api/deliverables/:deliverableId/deadline` | Check deadline status |

---

## Quick Examples

### 1. View Requirements
```bash
GET /api/deliverable-templates
```

### 2. View Team's Deliverables
```bash
GET /api/deliverables/team/TEAM_ID
```

### 3. Submit Deliverable
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
{
  "teamId": "TEAM_ID",
  "content": "https://...",
  "contentType": "FILE"
}
```

### 4. Update Deliverable
```bash
POST /api/deliverables/DELIVERABLE_ID/submit
{
  "teamId": "TEAM_ID",
  "content": "https://...new-file",
  "contentType": "FILE"
}
```

### 5. Delete Submission
```bash
DELETE /api/deliverables/DELIVERABLE_ID
{
  "teamId": "TEAM_ID"
}
```

### 6. Check Deadline
```bash
GET /api/deliverables/DELIVERABLE_ID/deadline
```

---

## Rules

✅ Can submit multiple times before deadline  
✅ Can delete before deadline  
✅ Cannot submit after deadline  
✅ Cannot delete after deadline  
✅ Cannot update approved deliverables  
✅ Cannot delete approved deliverables  
✅ Updates reset status to PENDING  
✅ Must be team member to submit/delete  

---

## Admin Routes (12 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/deliverable-templates` | List templates |
| POST | `/api/admin/deliverable-templates` | Create template (auto-creates for all teams) |
| PUT | `/api/admin/deliverable-templates/:id` | Update template |
| DELETE | `/api/admin/deliverable-templates/:id` | Delete template |
| GET | `/api/admin/deliverables` | View all submissions |
| POST | `/api/admin/deliverables/:teamId` | Upload for team |
| POST | `/api/admin/deliverables/:id/approve` | Approve submission |
| POST | `/api/admin/deliverables/:id/reject` | Reject with feedback |
| DELETE | `/api/admin/deliverables/:id` | Delete submission |

---

## Content Types

| Type | Use Case | Example |
|------|----------|---------|
| FILE | Upload documents | `https://storage.../file.pdf` |
| URL | External links | `https://github.com/repo` |
| TEXT | Written content | `"Project description..."` |

---

## Status Flow

```
PENDING → (admin reviews) → APPROVED/REJECTED
    ↑                            ↓
    └─────── (team updates/resubmits)

DELETE → Resets to PENDING with empty content
```

---

**See full documentation:**
- `docs/STUDENT_DELIVERABLES.md` - Complete guide
- `docs/DELIVERABLES_DELETE.md` - Delete feature
- `docs/DELIVERABLES_REJECTION_FLOW.md` - Rejection handling
