# 📚 Learning Paths API - Student Guide

## Student Endpoints

All student endpoints require authentication. Include your JWT token in the Authorization header.

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📖 Table of Contents

1. [Get All Learning Paths](#get-all-learning-paths)
2. [Get Single Learning Path](#get-single-learning-path)
3. [Get Your Progress](#get-your-progress)
4. [Complete a Module](#complete-a-module)
5. [Complete Workflow](#complete-workflow)

---

## 1. Get All Learning Paths

Get all learning paths available to you based on your role.

### Request

```http
GET /api/learning-paths
Authorization: Bearer YOUR_JWT_TOKEN
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "path_123",
      "title": "Web Development Fundamentals",
      "description": "Learn the basics of HTML, CSS, and JavaScript",
      "audience": "STUDENT",
      "isCore": true,
      "order": 1,
      "createdAt": "2024-01-01T00:00:00Z",
      "modules": [
        {
          "id": "module_456",
          "title": "Introduction to HTML",
          "content": "HTML is the backbone...",
          "order": 1,
          "quiz": {
            "questions": [
              {
                "question": "What does HTML stand for?",
                "options": ["Hyper Text Markup Language", "..."],
                "correctAnswer": 0
              }
            ]
          }
        }
      ],
      "_count": {
        "modules": 5
      },
      "userProgress": {
        "completedModules": 2,
        "totalModules": 5,
        "percentComplete": 40,
        "startedAt": "2024-01-05T00:00:00Z",
        "completedAt": null
      }
    }
  ]
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/learning-paths \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

```typescript
// React example
const { data } = await fetch('/api/learning-paths', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
}).then(res => res.json());

console.log('Available paths:', data);
```

---

## 2. Get Single Learning Path

Get detailed information about a specific learning path.

### Request

```http
GET /api/learning-paths/:pathId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `pathId` | string | ID of the learning path |

### Response

```json
{
  "success": true,
  "data": {
    "id": "path_123",
    "title": "Web Development Fundamentals",
    "description": "Learn the basics of HTML, CSS, and JavaScript",
    "audience": "STUDENT",
    "isCore": true,
    "order": 1,
    "modules": [
      {
        "id": "module_456",
        "title": "Introduction to HTML",
        "content": "# HTML Basics\n\nHTML is the standard markup language...",
        "order": 1,
        "quiz": {
          "questions": [
            {
              "question": "What does HTML stand for?",
              "options": [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Home Tool Markup Language"
              ],
              "correctAnswer": 0
            }
          ]
        },
        "isCompleted": false
      },
      {
        "id": "module_457",
        "title": "HTML Elements",
        "content": "# HTML Elements\n\nElements are the building blocks...",
        "order": 2,
        "quiz": null,
        "isCompleted": false
      }
    ]
  }
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/learning-paths/path_123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

```typescript
// React example
const fetchPath = async (pathId: string) => {
  const response = await fetch(`/api/learning-paths/${pathId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const { data } = await response.json();
  return data;
};
```

---

## 3. Get Your Progress

Get your progress for a specific learning path.

### Request

```http
GET /api/learning-paths/:pathId/progress
Authorization: Bearer YOUR_JWT_TOKEN
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `pathId` | string | ID of the learning path |

### Response

```json
{
  "success": true,
  "data": {
    "pathId": "path_123",
    "userId": "user_789",
    "startedAt": "2024-01-05T00:00:00Z",
    "completedAt": null,
    "completedModules": 2,
    "totalModules": 5,
    "percentComplete": 40,
    "modules": [
      {
        "moduleId": "module_456",
        "moduleTitle": "Introduction to HTML",
        "completed": true,
        "completedAt": "2024-01-06T10:30:00Z",
        "quizScore": 85,
        "pointsEarned": 50
      },
      {
        "moduleId": "module_457",
        "moduleTitle": "HTML Elements",
        "completed": true,
        "completedAt": "2024-01-07T14:20:00Z",
        "quizScore": 90,
        "pointsEarned": 50
      },
      {
        "moduleId": "module_458",
        "moduleTitle": "CSS Basics",
        "completed": false,
        "completedAt": null,
        "quizScore": null,
        "pointsEarned": 0
      }
    ]
  }
}
```

### Example

```bash
curl -X GET http://localhost:5000/api/learning-paths/path_123/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

```typescript
// React example with progress bar
const ProgressDisplay = ({ pathId }: { pathId: string }) => {
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await fetch(`/api/learning-paths/${pathId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const { data } = await response.json();
      setProgress(data);
    };

    fetchProgress();
  }, [pathId]);

  if (!progress) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Progress: {progress.percentComplete}%</h2>
      <div className="progress-bar">
        <div style={{ width: `${progress.percentComplete}%` }} />
      </div>
      <p>Completed {progress.completedModules} of {progress.totalModules} modules</p>
    </div>
  );
};
```

---

## 4. Complete a Module

Mark a module as completed and optionally submit quiz score.

### Request

```http
POST /api/learning-paths/:pathId/modules/:moduleId/complete
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Parameters

| Parameter | Location | Type | Required | Description |
|-----------|----------|------|----------|-------------|
| `pathId` | URL | string | Yes | ID of the learning path |
| `moduleId` | URL | string | Yes | ID of the module |
| `quizScore` | Body | number | No | Quiz score (0-100) |

### Request Body

```json
{
  "quizScore": 85
}
```

### Response

```json
{
  "success": true,
  "message": "Module completed successfully",
  "data": {
    "id": "completion_123",
    "userId": "user_789",
    "moduleId": "module_456",
    "completedAt": "2024-01-06T10:30:00Z",
    "quizScore": 85,
    "pointsEarned": 50
  }
}
```

### Points Awarded

- **Complete Module:** 50 points
- **Pass Quiz (>= 70%):** +30 points
- **Perfect Score (100%):** +50 points

### Example

```bash
# Without quiz
curl -X POST http://localhost:5000/api/learning-paths/path_123/modules/module_456/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# With quiz score
curl -X POST http://localhost:5000/api/learning-paths/path_123/modules/module_456/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quizScore": 85}'
```

```typescript
// React example
const completeModule = async (pathId: string, moduleId: string, quizScore?: number) => {
  const response = await fetch(
    `/api/learning-paths/${pathId}/modules/${moduleId}/complete`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizScore }),
    }
  );

  const result = await response.json();
  
  if (result.success) {
    alert(`Module completed! You earned ${result.data.pointsEarned} points!`);
  }
  
  return result;
};
```

---

## 5. Complete Workflow

### Scenario: Student Completes a Learning Path

```typescript
// Step 1: Get all available learning paths
const fetchPaths = async () => {
  const response = await fetch('/api/learning-paths', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const { data } = await response.json();
  return data;
};

// Step 2: Select a path and view details
const paths = await fetchPaths();
const selectedPath = paths[0];

const fetchPathDetails = async (pathId: string) => {
  const response = await fetch(`/api/learning-paths/${pathId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const { data } = await response.json();
  return data;
};

const pathDetails = await fetchPathDetails(selectedPath.id);

// Step 3: Complete modules one by one
for (const module of pathDetails.modules) {
  // Display module content
  console.log('Module:', module.title);
  console.log('Content:', module.content);
  
  // If module has a quiz, take it
  let quizScore;
  if (module.quiz) {
    quizScore = await takeQuiz(module.quiz);
  }
  
  // Mark as complete
  const response = await fetch(
    `/api/learning-paths/${selectedPath.id}/modules/${module.id}/complete`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quizScore }),
    }
  );
  
  const result = await response.json();
  console.log(`Completed! Earned ${result.data.pointsEarned} points`);
}

// Step 4: Check final progress
const finalProgress = await fetch(
  `/api/learning-paths/${selectedPath.id}/progress`,
  {
    headers: { 'Authorization': `Bearer ${token}` },
  }
).then(res => res.json());

console.log('Path completed!', finalProgress.data);
```

---

## 📊 Complete React Component Example

```typescript
import { useState, useEffect } from 'react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  userProgress?: {
    completedModules: number;
    totalModules: number;
    percentComplete: number;
  };
}

interface Module {
  id: string;
  title: string;
  content: string;
  order: number;
  quiz?: Quiz;
  isCompleted?: boolean;
}

const LearningPathView = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load all paths
  useEffect(() => {
    const fetchPaths = async () => {
      const response = await fetch('/api/learning-paths', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const { data } = await response.json();
      setPaths(data);
    };

    fetchPaths();
  }, []);

  // Complete current module
  const completeModule = async (quizScore?: number) => {
    if (!selectedPath) return;

    const module = selectedPath.modules[currentModuleIndex];
    setLoading(true);

    try {
      const response = await fetch(
        `/api/learning-paths/${selectedPath.id}/modules/${module.id}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quizScore }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(`🎉 Module completed! You earned ${result.data.pointsEarned} points!`);
        
        // Move to next module
        if (currentModuleIndex < selectedPath.modules.length - 1) {
          setCurrentModuleIndex(currentModuleIndex + 1);
        } else {
          alert('🎊 Congratulations! You completed the entire learning path!');
        }
      }
    } catch (error) {
      alert('Failed to complete module');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPath) {
    return (
      <div className="paths-list">
        <h1>Learning Paths</h1>
        {paths.map((path) => (
          <div key={path.id} className="path-card" onClick={() => setSelectedPath(path)}>
            <h2>{path.title}</h2>
            <p>{path.description}</p>
            {path.userProgress && (
              <div className="progress">
                <div className="progress-bar">
                  <div style={{ width: `${path.userProgress.percentComplete}%` }} />
                </div>
                <p>{path.userProgress.percentComplete}% Complete</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  const currentModule = selectedPath.modules[currentModuleIndex];

  return (
    <div className="module-view">
      <button onClick={() => setSelectedPath(null)}>← Back to Paths</button>
      
      <h1>{selectedPath.title}</h1>
      <p>Module {currentModuleIndex + 1} of {selectedPath.modules.length}</p>
      
      <div className="module-content">
        <h2>{currentModule.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
      </div>

      {currentModule.quiz && (
        <div className="quiz">
          <h3>Quiz</h3>
          {/* Quiz component here */}
        </div>
      )}

      <button 
        onClick={() => completeModule()}
        disabled={loading}
      >
        {loading ? 'Completing...' : 'Complete Module'}
      </button>
    </div>
  );
};

export default LearningPathView;
```

---

## 🎯 Summary

### Student Endpoints

| Endpoint | Method | Description | Points |
|----------|--------|-------------|--------|
| `/api/learning-paths` | GET | Get all paths | - |
| `/api/learning-paths/:pathId` | GET | Get path details | - |
| `/api/learning-paths/:pathId/progress` | GET | Get your progress | - |
| `/api/learning-paths/:pathId/modules/:moduleId/complete` | POST | Complete module | 50+ points |

### Points System

- Complete module: **50 points**
- Pass quiz (≥70%): **+30 points**
- Perfect score (100%): **+50 points**
- Complete entire path: **100 bonus points**

---

**Ready to start learning!** 📚✨
