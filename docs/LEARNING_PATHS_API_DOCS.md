# 📚 Learning Paths API - Student Documentation

**Base URL:** `http://localhost:5000/api/learning-paths`

**Authentication:** Required (Bearer token)

---

## Enrollment

### Enroll in Learning Path

```http
POST /api/learning-paths/:pathId/enroll
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in learning path! +5 points",
  "data": {
    "id": "enrollment_123",
    "userId": "user_456",
    "learningPathId": "path_789",
    "enrolledAt": "2024-01-10T10:00:00Z",
    "isAutoEnrolled": false
  }
}
```

**Points:** +5

**Errors:**
- `404` - Learning path not found
- `409` - Already enrolled

---

## Quiz Submission

### Submit Quiz Answers

```http
POST /api/learning-paths/:pathId/modules/:moduleId/submit-quiz
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "answers": [0, 2, 1, 3]
}
```

**Request Body:**
- `answers` - Array of selected answer indices (0-based)

**Response (Passed):**
```json
{
  "success": true,
  "message": "Quiz passed! You scored 85% and earned 80 points! 🎉",
  "data": {
    "id": "completion_123",
    "userId": "user_456",
    "moduleId": "module_789",
    "completedAt": "2024-01-10T10:30:00Z",
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

**Points:**
- Base completion: **50 points**
- Pass quiz (≥70%): **+30 points** (80 total)
- Perfect score (100%): **+50 more** (130 total)

**Errors:**
- `400` - Invalid answers format
- `404` - Module not found
- `409` - Module already completed

---

## Complete Module (No Quiz)

```http
POST /api/learning-paths/:pathId/modules/:moduleId/complete
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Module completed! You earned 50 points!",
  "data": {
    "id": "completion_123",
    "moduleId": "module_789",
    "completedAt": "2024-01-10T10:00:00Z",
    "pointsAwarded": 50
  }
}
```

**Points:** +50

**Errors:**
- `400` - Module has a quiz (use submit-quiz instead)
- `404` - Module not found
- `409` - Module already completed

---

## Get User Progress

```http
GET /api/learning-paths/:pathId/progress
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pathId": "path_123",
    "completedModules": 3,
    "totalModules": 5,
    "percentComplete": 60,
    "averageScore": 85,
    "modules": [
      {
        "moduleId": "module_1",
        "title": "Introduction",
        "isCompleted": true,
        "completedAt": "2024-01-05T10:00:00Z",
        "quizScore": 85,
        "pointsEarned": 80
      }
    ]
  }
}
```

---

## Points Summary

| Action | Points |
|--------|--------|
| Enroll in path (optional) | +5 |
| Complete module (no quiz) | +50 |
| Complete module + pass quiz (≥70%) | +80 |
| Complete module + perfect quiz (100%) | +130 |
| Complete entire learning path | +100 bonus |

### Example: Complete 5-module path
- Enrollment: 5 points
- 5 modules with quizzes (avg 85%): 400 points
- Path completion bonus: 100 points
- **Total: 505 points** 🎉

---

## Notes

### Core Paths
- Students are **automatically enrolled** when path is created
- `isCore: true` paths appear in enrollments immediately

### Optional Paths  
- Students must **manually enroll** using `/enroll` endpoint
- `isCore: false` paths require student action

### Quiz Format
- Questions show options but **NOT** correct answers
- Submit array of selected indices: `[0, 2, 1, 3]`
- Server calculates score and awards points
- Minimum 70% to pass

### Path Completion
- System automatically detects when all modules completed
- Awards +100 bonus points
- Tracked in `LearningPathCompletion` model

---

## Error Codes

| Code | Description |
|------|-------------|
| `400` | Bad request (invalid data) |
| `401` | Not authenticated |
| `404` | Resource not found |
| `409` | Conflict (already enrolled/completed) |
| `500` | Server error |

---

**Ready to use!** 📚✨
