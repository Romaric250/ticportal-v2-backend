# 🎨 Learning Paths - Frontend Quick Guide

## React + TypeScript Implementation

### Table of Contents
1. [Types](#types)
2. [API Hook](#api-hook)
3. [Main Components](#main-components)
4. [Usage Examples](#usage-examples)

---

## Types

```typescript
// types/learning.ts

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  audience: 'STUDENT' | 'MENTOR' | 'ALL';
  isCore: boolean;
  order: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  progress?: {
    completedModules: number;
    totalModules: number;
    percentComplete: number;
  };
  _count?: {
    modules: number;
  };
  modules?: LearningModule[];
}

export interface LearningModule {
  id: string;
  title: string;
  content: string;
  order: number;
  hasQuiz: boolean;
  isCompleted?: boolean;
  completedAt?: string;
  quizScore?: number;
  quiz?: Quiz;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer?: number; // Not sent from API, only for validation
}

export interface ModuleCompletion {
  id: string;
  moduleId: string;
  quizScore?: number;
  pointsAwarded: number;
  passed?: boolean;
  completedAt: string;
}

export interface Enrollment {
  id: string;
  learningPathId: string;
  enrolledAt: string;
  isAutoEnrolled: boolean;
  learningPath: LearningPath;
  progress: {
    completedModules: number;
    totalModules: number;
    percentComplete: number;
  };
}
```

---

## API Hook

```typescript
// hooks/useLearningPaths.ts

import { useState, useCallback } from 'react';
import { LearningPath, LearningModule, ModuleCompletion, Enrollment } from '../types/learning';

const API_BASE = '/api/learning-paths';

export const useLearningPaths = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token'); // Or use your auth context

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Get all paths
  const getAllPaths = useCallback(async (): Promise<LearningPath[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE, { headers });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get single path
  const getPath = useCallback(async (pathId: string): Promise<LearningPath> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${pathId}`, { headers });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Enroll in path
  const enrollInPath = useCallback(async (pathId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${pathId}/enroll`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get enrollments
  const getEnrollments = useCallback(async (): Promise<Enrollment[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/enrolled`, { headers });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get progress
  const getProgress = useCallback(async (pathId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${pathId}/progress`, { headers });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Get module
  const getModule = useCallback(async (pathId: string, moduleId: string): Promise<LearningModule> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${pathId}/modules/${moduleId}`, { headers });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Complete module (no quiz)
  const completeModule = useCallback(async (pathId: string, moduleId: string): Promise<ModuleCompletion> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${pathId}/modules/${moduleId}/complete`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Submit quiz
  const submitQuiz = useCallback(async (
    pathId: string,
    moduleId: string,
    answers: number[]
  ): Promise<ModuleCompletion> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${pathId}/modules/${moduleId}/submit-quiz`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    error,
    getAllPaths,
    getPath,
    enrollInPath,
    getEnrollments,
    getProgress,
    getModule,
    completeModule,
    submitQuiz,
  };
};
```

---

## Main Components

### 1. Learning Paths List

```typescript
// components/LearningPathsList.tsx

import { useEffect, useState } from 'react';
import { useLearningPaths } from '../hooks/useLearningPaths';
import { LearningPath } from '../types/learning';

export const LearningPathsList = () => {
  const { getAllPaths, enrollInPath, loading } = useLearningPaths();
  const [paths, setPaths] = useState<LearningPath[]>([]);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    const data = await getAllPaths();
    setPaths(data);
  };

  const handleEnroll = async (pathId: string) => {
    try {
      await enrollInPath(pathId);
      alert('Enrolled successfully! +5 points');
      loadPaths(); // Reload to update enrollment status
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="paths-container">
      <h1>Learning Paths</h1>
      
      <div className="paths-grid">
        {paths.map((path) => (
          <div key={path.id} className="path-card">
            <div className="path-header">
              <h2>{path.title}</h2>
              {path.isCore && <span className="badge-core">Core</span>}
            </div>
            
            <p>{path.description}</p>
            
            <div className="path-stats">
              <span>📚 {path._count?.modules} modules</span>
              {path.progress && (
                <span>✅ {path.progress.percentComplete}% complete</span>
              )}
            </div>

            {path.progress && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${path.progress.percentComplete}%` }}
                />
              </div>
            )}

            {path.isEnrolled ? (
              <button
                onClick={() => window.location.href = `/learning/${path.id}`}
                className="btn-primary"
              >
                {path.progress?.percentComplete === 100 ? 'Review' : 'Continue Learning'}
              </button>
            ) : (
              <button
                onClick={() => handleEnroll(path.id)}
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 2. Learning Path View (Module List)

```typescript
// components/LearningPathView.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLearningPaths } from '../hooks/useLearningPaths';
import { LearningPath } from '../types/learning';

export const LearningPathView = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { getPath, getProgress } = useLearningPaths();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    loadPathData();
  }, [pathId]);

  const loadPathData = async () => {
    if (!pathId) return;
    const pathData = await getPath(pathId);
    const progressData = await getProgress(pathId);
    setPath(pathData);
    setProgress(progressData);
  };

  if (!path) return <div>Loading...</div>;

  return (
    <div className="path-view">
      <h1>{path.title}</h1>
      <p>{path.description}</p>

      {progress && (
        <div className="progress-summary">
          <h3>Your Progress: {progress.percentComplete}%</h3>
          <div className="progress-bar">
            <div style={{ width: `${progress.percentComplete}%` }} />
          </div>
          <p>
            {progress.completedModules} of {progress.totalModules} modules completed
          </p>
        </div>
      )}

      <div className="modules-list">
        {path.modules?.map((module, index) => {
          const moduleProgress = progress?.modules.find(
            (m: any) => m.moduleId === module.id
          );

          return (
            <div
              key={module.id}
              className={`module-card ${moduleProgress?.isCompleted ? 'completed' : ''}`}
            >
              <div className="module-header">
                <span className="module-number">{index + 1}</span>
                <h3>{module.title}</h3>
                {moduleProgress?.isCompleted && <span className="✅</span>}
              </div>

              {moduleProgress?.quizScore !== null && (
                <div className="module-score">
                  Quiz Score: {moduleProgress.quizScore}%
                </div>
              )}

              <button
                onClick={() =>
                  window.location.href = `/learning/${pathId}/module/${module.id}`
                }
                className="btn-primary"
              >
                {moduleProgress?.isCompleted ? 'Review' : 'Start Module'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### 3. Module View with Quiz

```typescript
// components/ModuleView.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearningPaths } from '../hooks/useLearningPaths';
import { LearningModule } from '../types/learning';
import ReactMarkdown from 'react-markdown';

export const ModuleView = () => {
  const { pathId, moduleId } = useParams<{ pathId: string; moduleId: string }>();
  const navigate = useNavigate();
  const { getModule, completeModule, submitQuiz, loading } = useLearningPaths();
  
  const [module, setModule] = useState<LearningModule | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  const loadModule = async () => {
    if (!pathId || !moduleId) return;
    const data = await getModule(pathId, moduleId);
    setModule(data);
    if (data.quiz) {
      setSelectedAnswers(new Array(data.quiz.questions.length).fill(-1));
    }
  };

  const handleComplete = async () => {
    if (!pathId || !moduleId) return;

    try {
      const result = await completeModule(pathId, moduleId);
      alert(`Module completed! +${result.pointsAwarded} points! 🎉`);
      navigate(`/learning/${pathId}`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!pathId || !moduleId) return;

    // Validate all questions answered
    if (selectedAnswers.includes(-1)) {
      alert('Please answer all questions');
      return;
    }

    try {
      const result = await submitQuiz(pathId, moduleId, selectedAnswers);
      setQuizResult(result);
      
      setTimeout(() => {
        navigate(`/learning/${pathId}`);
      }, 3000);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!module) return <div>Loading...</div>;

  if (quizResult) {
    return (
      <div className="quiz-result">
        <h2>{quizResult.passed ? '🎉 Quiz Passed!' : '📚 Keep Learning!'}</h2>
        <div className="score">
          <h3>Your Score: {quizResult.quizScore}%</h3>
          <p>Points Earned: +{quizResult.pointsAwarded}</p>
        </div>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="module-view">
      <button onClick={() => navigate(`/learning/${pathId}`)}>
        ← Back to Path
      </button>

      <h1>{module.title}</h1>

      <div className="module-content">
        <ReactMarkdown>{module.content}</ReactMarkdown>
      </div>

      {module.hasQuiz && !showQuiz && (
        <button onClick={() => setShowQuiz(true)} className="btn-primary">
          Take Quiz
        </button>
      )}

      {showQuiz && module.quiz && (
        <div className="quiz-section">
          <h2>Quiz</h2>
          {module.quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="quiz-question">
              <h3>
                {qIndex + 1}. {question.question}
              </h3>
              <div className="quiz-options">
                {question.options.map((option, oIndex) => (
                  <label key={oIndex} className="quiz-option">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={selectedAnswers[qIndex] === oIndex}
                      onChange={() => {
                        const newAnswers = [...selectedAnswers];
                        newAnswers[qIndex] = oIndex;
                        setSelectedAnswers(newAnswers);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmitQuiz}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      )}

      {!module.hasQuiz && (
        <button
          onClick={handleComplete}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Completing...' : 'Complete Module'}
        </button>
      )}
    </div>
  );
};
```

---

## Usage Examples

### Basic Styling (CSS)

```css
/* styles/learning.css */

.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.path-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-core {
  background: #4CAF50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

.module-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.module-card.completed {
  background: #f1f8f4;
  border-color: #4CAF50;
}

.quiz-question {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.quiz-option {
  display: block;
  padding: 10px;
  margin: 5px 0;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.quiz-option:hover {
  border-color: #4CAF50;
}

.quiz-option input[type="radio"] {
  margin-right: 10px;
}
```

---

## Summary

### Quick Start Checklist

1. ✅ Copy types to `types/learning.ts`
2. ✅ Copy hook to `hooks/useLearningPaths.ts`
3. ✅ Create `LearningPathsList` component
4. ✅ Create `LearningPathView` component
5. ✅ Create `ModuleView` component
6. ✅ Add routes to your router
7. ✅ Style with CSS

### Routes to Add

```typescript
<Route path="/learning" element={<LearningPathsList />} />
<Route path="/learning/:pathId" element={<LearningPathView />} />
<Route path="/learning/:pathId/module/:moduleId" element={<ModuleView />} />
```

---

**Frontend ready to build!** 🎨🚀
