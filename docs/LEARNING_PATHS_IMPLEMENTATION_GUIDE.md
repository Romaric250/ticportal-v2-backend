# 📚 Learning Paths System - Complete Implementation Guide

## Overview

Complete learning path system with:
- ✅ Auto-enrollment for core paths
- ✅ Manual enrollment for optional paths
- ✅ Quiz submission and grading
- ✅ Progress tracking
- ✅ Points system integration
- ✅ Path completion bonuses

---

## 🗄️ Step 1: Update Prisma Schema

Add these models to your `schema.prisma`:

```prisma
model LearningEnrollment {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  learningPathId String   @db.ObjectId
  enrolledAt     DateTime @default(now())
  isAutoEnrolled Boolean  @default(false)

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  learningPath   LearningPath @relation(fields: [learningPathId], references: [id], onDelete: Cascade)

  @@unique([userId, learningPathId])
  @@index([userId])
  @@index([learningPathId])
}

model LearningPathCompletion {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  learningPathId String   @db.ObjectId
  completedAt    DateTime @default(now())
  totalScore     Int?

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  learningPath LearningPath @relation(fields: [learningPathId], references: [id], onDelete: Cascade)

  @@unique([userId, learningPathId])
  @@index([userId])
  @@index([learningPathId])
}

// Update ModuleCompletion to include quiz answers
model ModuleCompletion {
  // ...existing fields...
  quizAnswers Json?    // Add this field to store user's quiz answers
}
```

**Then run:**
```bash
npx prisma db push
npx prisma generate
```

---

## 🔧 Step 2: Update Service Methods

Add these methods to `src/modules/learning-paths/service.ts`:

### New Methods to Add:

1. **`enrollUser(userId, pathId)`** - Enroll user in path
2. **`autoEnrollStudents(pathId)`** - Auto-enroll all students (for core paths)
3. **`getUserEnrollments(userId)`** - Get user's enrollments with progress
4. **`submitQuiz(userId, moduleId, answers)`** - Submit quiz and calculate score
5. **`completeModule(userId, moduleId)`** - Complete module without quiz
6. **`checkPathCompletion(userId, pathId)`** - Check if path is complete

### Update `createPath` Method:

```typescript
static async createPath(data: any) {
  const path = await db.learningPath.create({
    data: {
      // ...existing fields
    },
  });

  // ✅ Auto-enroll students if core path
  if (data.isCore) {
    await this.autoEnrollStudents(path.id);
  }

  return path;
}
```

**See:** `docs/LEARNING_PATHS_SERVICE_ADDITIONS.ts` for complete code

---

## 🎮 Step 3: Update Controller

Add student endpoints to `src/modules/learning-paths/controller.ts`:

### Student Endpoints to Add:

1. **`GET /api/learning-paths`** - Get all paths (enrolled + available)
2. **`GET /api/learning-paths/:pathId`** - Get path details
3. **`POST /api/learning-paths/:pathId/enroll`** - Enroll in path
4. **`GET /api/learning-paths/enrolled`** - Get user's enrollments
5. **`GET /api/learning-paths/:pathId/progress`** - Get progress
6. **`GET /api/learning-paths/:pathId/modules/:moduleId`** - Get module
7. **`POST /api/learning-paths/:pathId/modules/:moduleId/complete`** - Complete module
8. **`POST /api/learning-paths/:pathId/modules/:moduleId/submit-quiz`** - Submit quiz

**See:** `docs/LEARNING_PATHS_STUDENT_CONTROLLER.ts` for complete code

---

## 🛣️ Step 4: Update Routes

Update `src/modules/learning-paths/routes.ts`:

```typescript
import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { LearningPathController } from "./controller";
import { LearningPathStudentController } from "./student-controller";

const router = Router();

// Student routes (authenticated)
router.get("/", authenticate, LearningPathStudentController.getAllPaths);
router.get("/enrolled", authenticate, LearningPathStudentController.getEnrollments);
router.get("/:pathId", authenticate, LearningPathStudentController.getPathById);
router.post("/:pathId/enroll", authenticate, LearningPathStudentController.enrollInPath);
router.get("/:pathId/progress", authenticate, LearningPathStudentController.getProgress);
router.get("/:pathId/modules/:moduleId", authenticate, LearningPathStudentController.getModule);
router.post("/:pathId/modules/:moduleId/complete", authenticate, LearningPathStudentController.completeModule);
router.post("/:pathId/modules/:moduleId/submit-quiz", authenticate, LearningPathStudentController.submitQuiz);

// Admin routes
router.get("/admin/paths", authenticate, LearningPathController.getAllPaths);
router.post("/admin/paths", authenticate, LearningPathController.createPath);
router.put("/admin/paths/:pathId", authenticate, LearningPathController.updatePath);
router.delete("/admin/paths/:pathId", authenticate, LearningPathController.deletePath);
router.post("/admin/paths/:pathId/modules", authenticate, LearningPathController.addModule);
router.put("/admin/paths/:pathId/modules/:moduleId", authenticate, LearningPathController.updateModule);
router.delete("/admin/paths/:pathId/modules/:moduleId", authenticate, LearningPathController.deleteModule);

export default router;
```

---

## 🎯 Step 5: Points Configuration

Already configured in `src/shared/constants/points.ts`:

```typescript
LEARNING: {
  STAGE_START: 5,           // Enroll in path
  STAGE_COMPLETE: 50,       // Complete module
  QUIZ_PASS: 30,            // Pass quiz (≥70%)
  QUIZ_PERFECT_SCORE: 50,   // Perfect quiz (100%)
  COURSE_COMPLETE: 100,     // Complete entire path
}
```

---

## 🧪 Step 6: Testing

### Test Auto-Enrollment

```bash
# 1. Create a core path
curl -X POST http://localhost:5000/api/admin/learning-paths \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Core Web Development",
    "description": "Essential web skills",
    "audience": "STUDENT",
    "isCore": true
  }'

# → All existing students automatically enrolled!
```

### Test Manual Enrollment

```bash
# 1. Create optional path
curl -X POST http://localhost:5000/api/admin/learning-paths \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced React",
    "description": "Master React",
    "audience": "STUDENT",
    "isCore": false
  }'

# 2. Student enrolls manually
curl -X POST http://localhost:5000/api/learning-paths/PATH_ID/enroll \
  -H "Authorization: Bearer STUDENT_TOKEN"

# → Student enrolled! +5 points
```

### Test Quiz Submission

```bash
# 1. Submit quiz
curl -X POST http://localhost:5000/api/learning-paths/PATH_ID/modules/MODULE_ID/submit-quiz \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [0, 2, 1, 3]
  }'

# → Response includes score and points earned
```

---

## 📖 Step 7: Documentation

### For Backend Developers:
- **Prisma Schema:** `docs/LEARNING_PATHS_PRISMA_SCHEMA.prisma`
- **Service Methods:** `docs/LEARNING_PATHS_SERVICE_ADDITIONS.ts`
- **Controller:** `docs/LEARNING_PATHS_STUDENT_CONTROLLER.ts`

### For Frontend Developers:
- **Complete API Docs:** `docs/LEARNING_PATHS_COMPLETE_STUDENT_API.md`
- **Frontend Guide:** `docs/LEARNING_PATHS_FRONTEND_GUIDE.md`

---

## 🎮 Complete Workflow

### Admin Creates Core Path

```typescript
POST /api/admin/learning-paths
{
  "title": "Web Fundamentals",
  "description": "Learn HTML, CSS, JS",
  "audience": "STUDENT",
  "isCore": true
}

// ✅ Path created
// ✅ All students automatically enrolled
// ✅ Background job runs: autoEnrollStudents(pathId)
```

### Student Completes Path

```typescript
// 1. View enrolled paths
GET /api/learning-paths/enrolled
// → Shows "Web Fundamentals" (auto-enrolled)

// 2. Get path details
GET /api/learning-paths/PATH_ID
// → 5 modules shown

// 3. Get module content
GET /api/learning-paths/PATH_ID/modules/MODULE_1
// → Module content + quiz questions

// 4. Submit quiz
POST /api/learning-paths/PATH_ID/modules/MODULE_1/submit-quiz
{ "answers": [0, 2, 1] }
// → Score: 100%, Points: +130 (50 + 30 + 50)

// 5. Complete remaining modules...

// 6. Path automatically marked complete
// → +100 bonus points!
// → Total: 555 points for completing path!
```

---

## 🎯 Points Breakdown Example

**Complete 5-module path (all with quizzes):**

| Action | Points |
|--------|--------|
| Auto-enrolled (core path) | 0 |
| Module 1 (85% quiz) | 80 |
| Module 2 (90% quiz) | 80 |
| Module 3 (100% quiz) | 130 |
| Module 4 (75% quiz) | 80 |
| Module 5 (95% quiz) | 80 |
| Path completion bonus | 100 |
| **Total** | **550 points** |

---

## ✅ Implementation Checklist

### Backend
- [ ] Update Prisma schema
- [ ] Run `prisma db push` and `prisma generate`
- [ ] Add enrollment methods to service
- [ ] Add quiz submission methods to service
- [ ] Update `createPath` to auto-enroll
- [ ] Create student controller
- [ ] Update routes
- [ ] Test auto-enrollment
- [ ] Test manual enrollment
- [ ] Test quiz submission
- [ ] Test points awarding

### Frontend
- [ ] Copy types from frontend guide
- [ ] Create `useLearningPaths` hook
- [ ] Create `LearningPathsList` component
- [ ] Create `LearningPathView` component
- [ ] Create `ModuleView` component
- [ ] Add routes to router
- [ ] Style components
- [ ] Test enrollment flow
- [ ] Test quiz submission
- [ ] Test progress tracking

---

## 📊 API Summary

### Student Endpoints

| Endpoint | Method | Description | Points |
|----------|--------|-------------|--------|
| `/api/learning-paths` | GET | Get all paths | - |
| `/api/learning-paths/:pathId` | GET | Get path details | - |
| `/api/learning-paths/:pathId/enroll` | POST | Enroll in path | +5 |
| `/api/learning-paths/enrolled` | GET | Get enrollments | - |
| `/api/learning-paths/:pathId/progress` | GET | Get progress | - |
| `/api/learning-paths/:pathId/modules/:moduleId` | GET | Get module | - |
| `/api/learning-paths/:pathId/modules/:moduleId/complete` | POST | Complete (no quiz) | +50 |
| `/api/learning-paths/:pathId/modules/:moduleId/submit-quiz` | POST | Submit quiz | +50-130 |

---

## 🚀 Ready to Implement!

1. Start with Prisma schema updates
2. Add service methods
3. Create student controller
4. Update routes
5. Test backend
6. Build frontend
7. Deploy!

**All documentation files ready in `docs/` folder!** 📚✨
