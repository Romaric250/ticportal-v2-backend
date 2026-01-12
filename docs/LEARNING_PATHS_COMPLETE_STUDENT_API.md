# 📚 Learning Paths - Complete Student API

## Overview

Complete learning path system with enrollment, quiz submission, and progress tracking.

**Base URL:** `http://localhost:5000/api`

**Authentication:** Required for all endpoints

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Table of Contents

1. [Enrollment System](#enrollment-system)
2. [Get All Paths](#1-get-all-paths)
3. [Get Single Path](#2-get-single-path)
4. [Enroll in Path](#3-enroll-in-path)
5. [Get My Enrollments](#4-get-my-enrollments)
6. [Get My Progress](#5-get-my-progress)
7. [Get Module Details](#6-get-module-details)
8. [Complete Module (No Quiz)](#7-complete-module-no-quiz)
9. [Submit Quiz](#8-submit-quiz)
10. [Points System](#points-system)
11. [Complete Workflow](#complete-workflow)

---

## Enrollment System

### Core Paths (Auto-Enrollment)
- **isCore: true** - Students are automatically enrolled when path is created
- No manual enrollment needed
- Appears in "My Enrollments" automatically

### Optional Paths (Manual Enrollment)
- **isCore: false** - Students must manually enroll
- Use `/api/learning-paths/:pathId/enroll` endpoint
- Browse available paths first

---

## API Endpoints

### 1. Get All Paths

Get all learning paths (enrolled + available).

```http
GET /api/learning-paths
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "path_123",
      "title": "Web Development Fundamentals",
      "description": "Learn HTML, CSS, JavaScript",
      "audience": "STUDENT",
      "isCore": true,
      "order": 1,
      "isEnrolled": true,
      "isCompleted": false,
      "progress": {
        "completedModules": 2,
        "totalModules": 5,
        "percentComplete": 40
      },
      "_count": {
        "modules": 5
      }
    },
    {
      "id": "path_456",
      "title": "Advanced React",
      "description": "Master React hooks, context, etc.",
      "audience": "STUDENT",
      "isCore": false,
      "order": 2,
      "isEnrolled": false,
      "isCompleted": false,
      "_count": {
        "modules": 8
      }
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:5000/api/learning-paths \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```typescript
const paths = await fetch('/api/learning-paths', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());
```

---

### 2. Get Single Path

Get detailed information about a learning path.

```http
GET /api/learning-paths/:pathId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "path_123",
    "title": "Web Development Fundamentals",
    "description": "Learn the basics...",
    "isCore": true,
    "isEnrolled": true,
    "modules": [
      {
        "id": "module_1",
        "title": "Introduction to HTML",
        "content": "# HTML Basics\n\nHTML is...",
        "order": 1,
        "hasQuiz": true,
        "isCompleted": false,
        "quiz": {
          "questions": [
            {
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language",
                "Hyperlinks and Text Markup Language"
              ],
              "correctAnswer": 0
            }
          ]
        }
      }
    ]
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:5000/api/learning-paths/path_123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Enroll in Path

Enroll in a non-core learning path.

```http
POST /api/learning-paths/:pathId/enroll
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully enrolled in learning path",
  "data": {
    "id": "enrollment_789",
    "userId": "user_123",
    "learningPathId": "path_456",
    "enrolledAt": "2024-01-10T10:00:00Z",
    "isAutoEnrolled": false,
    "learningPath": {
      "id": "path_456",
      "title": "Advanced React",
      "modules": [...]
    }
  }
}
```

**Points Earned:** +5 points for enrolling

**Example:**

```bash
curl -X POST http://localhost:5000/api/learning-paths/path_456/enroll \
  -H "Authorization: Bearer YOUR_TOKEN"
```

```typescript
const enroll = async (pathId: string) => {
  const response = await fetch(`/api/learning-paths/${pathId}/enroll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  
  if (result.success) {
    alert('Enrolled successfully! +5 points');
  }
};
```

---

### 4. Get My Enrollments

Get all your enrolled learning paths.

```http
GET /api/learning-paths/enrolled
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment_123",
      "userId": "user_789",
      "learningPathId": "path_123",
      "enrolledAt": "2024-01-01T00:00:00Z",
      "isAutoEnrolled": true,
      "learningPath": {
        "id": "path_123",
        "title": "Web Development Fundamentals",
        "isCore": true,
        "modules": [...],
        "_count": {
          "modules": 5
        }
      },
      "progress": {
        "completedModules": 2,
        "totalModules": 5,
        "percentComplete": 40
      }
    }
  ]
}
```

**Example:**

```bash
curl -X GET http://localhost:5000/api/learning-paths/enrolled \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Get My Progress

Get your progress for a specific path.

```http
GET /api/learning-paths/:pathId/progress
```

**Response:**

```json
{
  "success": true,
  "data": {
    "pathId": "path_123",
    "userId": "user_789",
    "enrolledAt": "2024-01-01T00:00:00Z",
    "completedAt": null,
    "completedModules": 2,
    "totalModules": 5,
    "percentComplete": 40,
    "averageScore": 87,
    "modules": [
      {
        "moduleId": "module_1",
        "title": "Introduction to HTML",
        "isCompleted": true,
        "completedAt": "2024-01-05T10:00:00Z",
        "quizScore": 85,
        "pointsEarned": 80
      },
      {
        "moduleId": "module_2",
        "title": "HTML Elements",
        "isCompleted": true,
        "completedAt": "2024-01-06T14:00:00Z",
        "quizScore": 90,
        "pointsEarned": 80
      },
      {
        "moduleId": "module_3",
        "title": "CSS Basics",
        "isCompleted": false,
        "completedAt": null,
        "quizScore": null,
        "pointsEarned": 0
      }
    ]
  }
}
```

**Example:**

```bash
curl -X GET http://localhost:5000/api/learning-paths/path_123/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. Get Module Details

Get detailed content for a specific module.

```http
GET /api/learning-paths/:pathId/modules/:moduleId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "module_1",
    "title": "Introduction to HTML",
    "content": "# HTML Basics\n\nHTML is the standard markup language...",
    "order": 1,
    "hasQuiz": true,
    "isCompleted": false,
    "completedAt": null,
    "quizScore": null,
    "quiz": {
      "questions": [
        {
          "question": "What does HTML stand for?",
          "options": [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language"
          ]
        }
      ]
    }
  }
}
```

**Note:** `correctAnswer` field is NOT included when fetching the module. It's only validated on submission.

**Example:**

```bash
curl -X GET http://localhost:5000/api/learning-paths/path_123/modules/module_1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Complete Module (No Quiz)

Complete a module that doesn't have a quiz.

```http
POST /api/learning-paths/:pathId/modules/:moduleId/complete
```

**Response:**

```json
{
  "success": true,
  "message": "Module completed! You earned 50 points!",
  "data": {
    "id": "completion_123",
    "userId": "user_789",
    "moduleId": "module_2",
    "completedAt": "2024-01-06T10:00:00Z",
    "quizScore": null,
    "pointsAwarded": 50
  }
}
```

**Points Earned:** 50 points

**Example:**

```bash
curl -X POST http://localhost:5000/api/learning-paths/path_123/modules/module_2/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. Submit Quiz

Submit quiz answers and complete a module with a quiz.

```http
POST /api/learning-paths/:pathId/modules/:moduleId/submit-quiz
Content-Type: application/json
```

**Request Body:**

```json
{
  "answers": [0, 2, 1, 3]
}
```

**Note:** `answers` is an array of selected answer indices (0-based).

**Response (Passed):**

```json
{
  "success": true,
  "message": "Quiz passed! You scored 85% and earned 80 points! 🎉",
  "data": {
    "id": "completion_456",
    "userId": "user_789",
    "moduleId": "module_1",
    "completedAt": "2024-01-05T10:00:00Z",
    "quizScore": 85,
    "quizAnswers": [0, 2, 1, 3],
    "pointsAwarded": 80,
    "passed": true
  }
}
```

**Response (Failed):**

```json
{
  "success": true,
  "message": "Quiz completed. You scored 55%. You earned 50 points.",
  "data": {
    "quizScore": 55,
    "pointsAwarded": 50,
    "passed": false
  }
}
```

**Points Breakdown:**
- Base completion: **50 points**
- Pass quiz (≥70%): **+30 points** (80 total)
- Perfect score (100%): **+50 more points** (130 total!)

**Example:**

```bash
curl -X POST http://localhost:5000/api/learning-paths/path_123/modules/module_1/submit-quiz \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"answers": [0, 2, 1, 3]}'
```

```typescript
const submitQuiz = async (pathId: string, moduleId: string, answers: number[]) => {
  const response = await fetch(
    `/api/learning-paths/${pathId}/modules/${moduleId}/submit-quiz`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    }
  );

  const result = await response.json();
  
  if (result.success) {
    if (result.data.passed) {
      alert(`🎉 You passed! Score: ${result.data.quizScore}% - Earned ${result.data.pointsAwarded} points!`);
    } else {
      alert(`Score: ${result.data.quizScore}% - Earned ${result.data.pointsAwarded} points. Keep learning!`);
    }
  }
};
```

---

## Points System

### Enrollment
- Enroll in path: **+5 points**

### Module Completion
- Complete module (no quiz): **50 points**
- Complete module + pass quiz (≥70%): **80 points** (50 + 30)
- Complete module + perfect quiz (100%): **130 points** (50 + 30 + 50)

### Path Completion
- Complete entire learning path: **+100 bonus points**

### Example Calculation

**Path with 5 modules (all with quizzes):**
- Enrollment: 5 points
- Module 1 (85%): 80 points
- Module 2 (90%): 80 points
- Module 3 (100%): 130 points
- Module 4 (75%): 80 points
- Module 5 (95%): 80 points
- Path completion bonus: 100 points

**Total: 555 points!** 🎉

---

## Complete Workflow

### Scenario: Student completes a learning path

```typescript
// Step 1: Get all paths
const paths = await fetch('/api/learning-paths', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// Step 2: Choose a path
const path = paths.data.find(p => !p.isEnrolled && !p.isCore);

// Step 3: Enroll (if not core)
if (!path.isCore) {
  await fetch(`/api/learning-paths/${path.id}/enroll`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

// Step 4: Get path details
const pathDetails = await fetch(`/api/learning-paths/${path.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// Step 5: Loop through modules
for (const module of pathDetails.data.modules) {
  // Get module content
  const moduleData = await fetch(
    `/api/learning-paths/${path.id}/modules/${module.id}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  ).then(res => res.json());

  // Display content to user
  console.log(moduleData.data.content);

  // If has quiz, take it
  if (moduleData.data.hasQuiz) {
    const userAnswers = await showQuiz(moduleData.data.quiz);
    
    const result = await fetch(
      `/api/learning-paths/${path.id}/modules/${module.id}/submit-quiz`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: userAnswers }),
      }
    ).then(res => res.json());

    console.log(result.message);
  } else {
    // No quiz, just complete
    await fetch(
      `/api/learning-paths/${path.id}/modules/${module.id}/complete`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );
  }
}

// Step 6: Check final progress
const finalProgress = await fetch(
  `/api/learning-paths/${path.id}/progress`,
  { headers: { 'Authorization': `Bearer ${token}` } }
).then(res => res.json());

if (finalProgress.data.percentComplete === 100) {
  console.log('🎊 Path completed! +100 bonus points!');
}
```

---

## Error Handling

### Common Errors

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Not enrolled in this learning path"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Module not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "Module already completed"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "This module has a quiz. Use submitQuiz endpoint instead."
}
```

---

## Summary

### All Student Endpoints

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

**Ready to build the frontend!** 🚀📚
