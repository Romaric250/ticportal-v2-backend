# Admin API - Quick Reference

## ✅ WORKING NOW (13 Endpoints)

### Dashboard
```bash
# Get overview stats
GET /api/admin/stats

# Get detailed stats with charts
GET /api/admin/dashboard-stats
```

### Users
```bash
# List users (with pagination & filters)
GET /api/admin/users?page=1&limit=20&role=STUDENT&status=ACTIVE&search=john

# Get single user
GET /api/admin/users/:userId

# Create user
POST /api/admin/users
Body: { email, firstName, lastName, role, school, region }

# Update user
PUT /api/admin/users/:userId
Body: { role, status, school, region, isVerified }

# Delete user
DELETE /api/admin/users/:userId

# Import CSV (placeholder - returns 501)
POST /api/admin/users/import
```

### Teams
```bash
# List teams (with pagination & filters)
GET /api/admin/teams?page=1&limit=20&school=...&search=alpha

# Get single team
GET /api/admin/teams/:teamId

# Update team
PUT /api/admin/teams/:teamId
Body: { name, projectTitle, description }

# Delete team
DELETE /api/admin/teams/:teamId
```

---

## ⚠️ REQUIRES SCHEMA (23 Endpoints)

### Deliverables (11)
```bash
# Admin - Templates
GET /api/admin/deliverable-templates
POST /api/admin/deliverable-templates
PUT /api/admin/deliverable-templates/:id
DELETE /api/admin/deliverable-templates/:id

# Admin - Submissions
GET /api/admin/teams/deliverables
POST /api/admin/teams/:teamId/deliverables
POST /api/admin/teams/deliverables/:id/approve
POST /api/admin/teams/deliverables/:id/reject

# Team - Submit
GET /api/teams/deliverable-templates
GET /api/teams/:teamId/deliverables
POST /api/teams/:teamId/deliverables
```

### Learning Paths (12)
```bash
# Admin - Paths
GET /api/admin/learning-paths
GET /api/admin/learning-paths/:pathId
POST /api/admin/learning-paths
PUT /api/admin/learning-paths/:pathId
DELETE /api/admin/learning-paths/:pathId

# Admin - Modules
POST /api/admin/learning-paths/:pathId/modules
PUT /api/admin/learning-paths/:pathId/modules/:moduleId
DELETE /api/admin/learning-paths/:pathId/modules/:moduleId

# Student - Learn
GET /api/learning-paths
GET /api/learning-paths/:pathId/progress
POST /api/learning-paths/:pathId/modules/:moduleId/complete
```

---

## 🔑 Authentication

All requests require:
```bash
Authorization: Bearer {admin_jwt_token}
```

Get token:
```bash
POST /api/auth/login
Body: { "email": "admin@example.com", "password": "..." }
```

---

## 📊 Response Format

### Success
```json
{
  "success": true,
  "data": {...},
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🧪 Testing

### Quick Test
```bash
# 1. Get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}' \
  | jq -r '.accessToken')

# 2. Test endpoint
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Full Test Suite
```bash
chmod +x test-admin-api.sh
./test-admin-api.sh
```

---

## 🚀 Next Steps

### To Enable Remaining 23 Endpoints:

1. **Update schema.prisma** (copy from ADMIN_API_FINAL_STATUS.md)
2. **Run migrations:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. **Restart server:**
   ```bash
   npm run dev
   ```
4. **Implement services** (already documented in ADMIN_API_COMPLETE.md)

---

## 📖 Documentation

- **Full API Docs:** `docs/ADMIN_API_COMPLETE.md` (36 endpoints)
- **Status Report:** `docs/ADMIN_API_FINAL_STATUS.md`
- **Implementation Plan:** `docs/ADMIN_API_IMPLEMENTATION_PLAN.md`

---

## 🐛 Troubleshooting

### 404 Route Not Found
- Check server restarted
- Verify route: `/api/admin/*`
- Check app.ts has admin routes registered

### 401 Unauthorized
- Token expired (login again)
- Wrong token format
- Missing "Bearer " prefix

### 403 Forbidden
- User doesn't have admin role
- Check user.role in database

### 500 Internal Error
- Check server logs
- Database connection issue
- Missing fields in request

---

**Quick Status:** 13/36 live (36%)  
**Updated:** Jan 8, 2026
