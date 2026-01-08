# Admin API Implementation Plan

## Overview
Complete implementation of admin dashboard APIs, user management, team management, learning paths, and deliverables with notifications and points integration.

## Phase 1: Schema Updates ✅ (Partially Done)

### Models to Add:
1. **DeliverableTemplate** - Admin creates requirements
2. **TeamDeliverable** - Team submissions
3. **LearningPath** - Learning paths/courses
4. **LearningModule** - Individual modules with content
5. **UserLearningProgress** - Track user progress
6. **ModuleCompletion** - Track completed modules

### Enums to Add:
- `UserStatus` (ACTIVE, PENDING, SUSPENDED, INACTIVE)
- `DeliverableType` (PROPOSAL, PROTOTYPE, FINAL_SUBMISSION, DOCUMENTATION)
- `DeliverableStatus` (PENDING, APPROVED, REJECTED)
- `LearningPathAudience` (STUDENTS, MENTORS, EVERYONE)

## Phase 2: Services

### 1. Admin Service (`src/modules/admin/service.ts`)
- `getDashboardStats()` - Dashboard statistics
- `getDetailedDashboardStats()` - Charts data
- `getUsers()` - Get users with filters
- `getUserById()` - Single user
- `createUser()` - Create user (admin)
- `updateUser()` - Update user (admin)
- `deleteUser()` - Delete user
- `getTeams()` - Get all teams (admin)
- `getTeamById()` - Single team
- `updateTeam()` - Update team (admin override)
- `deleteTeam()` - Delete team (admin)
- `importUsersCSV()` - Bulk import

### 2. Deliverable Service (`src/modules/deliverables/service.ts`)
- `getTemplates()` - Get all templates
- `createTemplate()` - Create template
- `updateTemplate()` - Update template
- `deleteTemplate()` - Delete template
- `getDeliverables()` - Get all submissions
- `getTeamDeliverables()` - Get team's submissions
- `uploadDeliverable()` - Upload submission
- `approveDeliverable()` - Approve submission
- `rejectDeliverable()` - Reject submission

### 3. Learning Service (`src/modules/learning/service.ts`)
- `getLearningPaths()` - Get all paths
- `getLearningPathById()` - Single path
- `createLearningPath()` - Create path
- `updateLearningPath()` - Update path
- `deleteLearningPath()` - Delete path
- `addModule()` - Add module to path
- `updateModule()` - Update module
- `deleteModule()` - Delete module
- `getUserProgress()` - Get user progress
- `completeModule()` - Mark module complete

## Phase 3: Controllers

### 1. Admin Controller (`src/modules/admin/controller.ts`)
- Dashboard stats endpoints
- User CRUD endpoints
- Team CRUD endpoints
- CSV import endpoint

### 2. Deliverable Controller (`src/modules/deliverables/controller.ts`)
- Template CRUD endpoints
- Deliverable submission endpoints
- Approve/reject endpoints
- File upload handling

### 3. Learning Controller (`src/modules/learning/controller.ts`)
- Learning path CRUD endpoints
- Module CRUD endpoints
- Progress tracking endpoints
- Quiz submission endpoints

## Phase 4: Routes

### 1. Admin Routes (`src/modules/admin/routes.ts`)
```
GET    /api/admin/stats
GET    /api/admin/dashboard-stats
GET    /api/admin/users
GET    /api/admin/users/:userId
POST   /api/admin/users
PUT    /api/admin/users/:userId
DELETE /api/admin/users/:userId
POST   /api/admin/users/import
GET    /api/admin/teams
GET    /api/admin/teams/:teamId
PUT    /api/admin/teams/:teamId
DELETE /api/admin/teams/:teamId
```

### 2. Deliverable Routes (`src/modules/deliverables/routes.ts`)
```
// Admin routes
GET    /api/admin/deliverable-templates
POST   /api/admin/deliverable-templates
PUT    /api/admin/deliverable-templates/:templateId
DELETE /api/admin/deliverable-templates/:templateId
GET    /api/admin/teams/deliverables
POST   /api/admin/teams/:teamId/deliverables
POST   /api/admin/teams/deliverables/:deliverableId/approve
POST   /api/admin/teams/deliverables/:deliverableId/reject

// Team routes
GET    /api/teams/deliverable-templates
GET    /api/teams/:teamId/deliverables
POST   /api/teams/:teamId/deliverables
```

### 3. Learning Routes (`src/modules/learning/routes.ts`)
```
// Admin routes
GET    /api/admin/learning-paths
GET    /api/admin/learning-paths/:pathId
POST   /api/admin/learning-paths
PUT    /api/admin/learning-paths/:pathId
DELETE /api/admin/learning-paths/:pathId
POST   /api/admin/learning-paths/:pathId/modules
PUT    /api/admin/learning-paths/:pathId/modules/:moduleId
DELETE /api/admin/learning-paths/:pathId/modules/:moduleId

// Student routes
GET    /api/learning-paths
GET    /api/learning-paths/:pathId
POST   /api/learning-paths/:pathId/modules/:moduleId/complete
GET    /api/learning-paths/:pathId/progress
```

## Phase 5: Notifications Integration

### Deliverable Notifications:
- **Deliverable submitted** → Notify admins/reviewers
- **Deliverable approved** → Notify team members
- **Deliverable rejected** → Notify team members with feedback
- **Deadline approaching** → Remind teams (3 days before)

### Learning Path Notifications:
- **Module completed** → Congratulate user
- **Quiz passed** → Notify success
- **Path completed** → Achievement notification
- **New path assigned** → Notify about new course

### User Management Notifications:
- **Account created** → Welcome email + notification
- **Role updated** → Notify about new role
- **Account suspended** → Notify with reason

## Phase 6: Points Integration

### Deliverable Points:
- Submit deliverable on time: **15 points**
- Deliverable approved: **25 points**
- Early submission (>3 days early): **+10 bonus points**

### Learning Points:
- Complete module: **10 points**
- Pass module quiz (>80%): **+5 bonus points**
- Complete entire path: **50 points**
- Complete core path: **+25 bonus points**

### Activity Points:
- First login of day: **2 points**
- Team chat message: **1 point** (max 5/day)
- Profile completed: **10 points** (one-time)

## Phase 7: File Upload Utility

Create `src/shared/utils/fileUpload.ts` for handling deliverable uploads:
- Support multiple file types (PDF, DOC, ZIP)
- Max file size: 10MB
- Store in cloud storage (UploadThing)
- Generate secure URLs

## Implementation Order:

1. ✅ Update schema with new models
2. ✅ Run Prisma generate
3. Create Admin Service
4. Create Deliverable Service
5. Create Learning Service
6. Create Controllers
7. Create Routes
8. Integrate notifications
9. Integrate points
10. Test all endpoints
11. Update Swagger docs

## Testing Checklist:

### Admin APIs:
- [ ] Dashboard stats
- [ ] User CRUD
- [ ] Team CRUD
- [ ] CSV import

### Deliverables:
- [ ] Create template
- [ ] Upload deliverable
- [ ] Approve/reject
- [ ] Get submissions

### Learning:
- [ ] Create path
- [ ] Add modules
- [ ] Complete module
- [ ] Track progress

### Integration:
- [ ] Notifications sent
- [ ] Points awarded
- [ ] File uploads work

## Next Steps:

1. Fix Prisma schema errors
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. Create service files
5. Create controller files
6. Create route files
7. Register routes in app.ts
8. Test with Postman/curl

## Documentation:

Create `docs/ADMIN_API.md` with:
- Complete API reference
- Request/response examples
- Authentication requirements
- Error codes
- Testing commands
