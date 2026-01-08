# 🛣️ Deliverables API Routes - Fixed!

## ✅ Updated Routes (No Conflicts)

### Admin - Templates (5 endpoints)
```
GET    /api/admin/deliverable-templates
GET    /api/admin/deliverable-templates/:templateId
POST   /api/admin/deliverable-templates
PUT    /api/admin/deliverable-templates/:templateId
DELETE /api/admin/deliverable-templates/:templateId
```

### Admin - Submissions (4 endpoints)
```
GET    /api/admin/deliverables                    ← Changed! (was /admin/teams/deliverables)
POST   /api/admin/deliverables/:teamId            ← Changed! (was /admin/teams/:teamId/deliverables)
POST   /api/admin/deliverables/:deliverableId/approve
POST   /api/admin/deliverables/:deliverableId/reject
```

### Student/Team (2 endpoints)
```
GET    /api/deliverable-templates                 ← Changed! (was /teams/deliverable-templates)
GET    /api/deliverables/team/:teamId             ← Changed! (was /teams/:teamId/deliverables)
```

---

## 🔧 Why Changed?

### Problem
The route `/teams/:teamId/deliverables` was conflicting because:
- When accessing `/teams/deliverables`, Express was treating "deliverables" as the `:teamId` parameter
- This caused "Malformed ObjectID" errors

### Solution
Reorganized routes to avoid parameter conflicts:
- Student routes moved from `/teams/*` to `/deliverable-templates` and `/deliverables/team/*`
- Admin submission routes simplified to `/admin/deliverables/*`

---

## 📋 Updated API Calls

### Admin - Get All Submissions
**Before:**
```bash
GET /api/admin/teams/deliverables?status=PENDING
```

**After:**
```bash
GET /api/admin/deliverables?status=PENDING
```

### Admin - Upload for Team
**Before:**
```bash
POST /api/admin/teams/:teamId/deliverables
```

**After:**
```bash
POST /api/admin/deliverables/:teamId
```

### Students - Get Templates
**Before:**
```bash
GET /api/teams/deliverable-templates
```

**After:**
```bash
GET /api/deliverable-templates
```

### Students - Get Team's Submissions
**Before:**
```bash
GET /api/teams/:teamId/deliverables
```

**After:**
```bash
GET /api/deliverables/team/:teamId
```

---

## 🧪 Test Commands

### 1. Get All Templates
```bash
curl http://localhost:5000/api/admin/deliverable-templates
```

### 2. Create Template
```bash
curl -X POST http://localhost:5000/api/admin/deliverable-templates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Proposal",
    "description": "Submit your proposal",
    "type": "CUSTOM",
    "customType": "Proposal",
    "contentType": "FILE",
    "dueDate": "2026-02-01T00:00:00Z"
  }'
```

### 3. Get All Submissions (Admin)
```bash
curl http://localhost:5000/api/admin/deliverables?status=PENDING
```

### 4. Upload Deliverable for Team (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/deliverables/TEAM_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "TEMPLATE_ID",
    "content": "https://example.com/file.pdf",
    "contentType": "FILE",
    "description": "Team proposal"
  }'
```

### 5. Approve Deliverable
```bash
curl -X POST http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID/approve
```

### 6. Reject Deliverable
```bash
curl -X POST http://localhost:5000/api/admin/deliverables/DELIVERABLE_ID/reject \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Please add more details"
  }'
```

### 7. Get Templates (Student View)
```bash
curl http://localhost:5000/api/deliverable-templates
```

### 8. Get Team's Submissions (Student View)
```bash
curl http://localhost:5000/api/deliverables/team/TEAM_ID_HERE
```

---

## 📊 Complete Route Map

```
/api
├── /admin
│   ├── /deliverable-templates
│   │   ├── GET    /                    List templates
│   │   ├── GET    /:templateId         Get template
│   │   ├── POST   /                    Create template
│   │   ├── PUT    /:templateId         Update template
│   │   └── DELETE /:templateId         Delete template
│   │
│   └── /deliverables
│       ├── GET    /                    List all submissions
│       ├── POST   /:teamId             Upload for team
│       ├── POST   /:id/approve         Approve submission
│       └── POST   /:id/reject          Reject submission
│
├── /deliverable-templates              Student: List templates
└── /deliverables
    └── /team/:teamId                   Student: Team's submissions
```

---

## 🎯 Frontend Route Updates

### Admin Dashboard

```typescript
// Get all submissions
const submissions = await fetch('/api/admin/deliverables?status=PENDING');

// Upload for team
await fetch(`/api/admin/deliverables/${teamId}`, {
  method: 'POST',
  body: JSON.stringify({ templateId, content, contentType })
});

// Approve
await fetch(`/api/admin/deliverables/${deliverableId}/approve`, {
  method: 'POST'
});

// Reject
await fetch(`/api/admin/deliverables/${deliverableId}/reject`, {
  method: 'POST',
  body: JSON.stringify({ reason })
});
```

### Student View

```typescript
// Get available templates
const templates = await fetch('/api/deliverable-templates');

// Get team's submissions
const submissions = await fetch(`/api/deliverables/team/${teamId}`);
```

---

## ✅ Error Fixed

**Before:** 
```
GET /api/teams/deliverables
❌ Error: Malformed ObjectID - "deliverables" treated as teamId
```

**After:**
```
GET /api/deliverables/team/:teamId
✅ Clear parameter separation, no conflicts
```

---

## 📝 Update Your Frontend

If you're using the old routes, update to:

1. `/admin/teams/deliverables` → `/admin/deliverables`
2. `/admin/teams/:id/deliverables` → `/admin/deliverables/:id`
3. `/teams/deliverable-templates` → `/deliverable-templates`
4. `/teams/:id/deliverables` → `/deliverables/team/:id`

---

**Status:** ✅ Routes Fixed!  
**Issue:** Route conflict resolved  
**Date:** January 8, 2026
