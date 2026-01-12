import { db } from "../../config/database";
import { POINTS_CONFIG } from "../../shared/constants/points";

export class LearningPathService {
  
  /**
   * ENROLLMENT METHODS
   */

  /**
   * Enroll user in a learning path
   */
  static async enrollUser(userId: string, pathId: string) {
    // Check if path exists
    const path = await db.learningPath.findUnique({
      where: { id: pathId },
    });

    if (!path) {
      throw new Error("Learning path not found");
    }

    // Check if already enrolled
    const existing = await db.learningEnrollment.findUnique({
      where: {
        userId_learningPathId: {
          userId,
          learningPathId: pathId,
        },
      },
    });

    if (existing) {
      throw new Error("Already enrolled in this learning path");
    }

    // Create enrollment
    const enrollment = await db.learningEnrollment.create({
      data: {
        userId,
        learningPathId: pathId,
        isAutoEnrolled: false,
      },
      include: {
        learningPath: {
          include: {
            modules: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    // Award enrollment points
    try {
      await db.userActivity.create({
        data: {
          userId,
          type: "LEARNING",
          action: "STAGE_START",
          pointsAwarded: POINTS_CONFIG.LEARNING.STAGE_START,
          metadata: {
            pathId,
            pathTitle: path.title,
          },
        },
      });
    } catch (error) {
      console.error("Failed to award enrollment points:", error);
    }

    return enrollment;
  }

  /**
   * Auto-enroll all students in a core path
   */
  static async autoEnrollStudents(pathId: string) {
    // Get all students
    const students = await db.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: { id: true },
    });

    // Get existing enrollments
    const existingEnrollments = await db.learningEnrollment.findMany({
      where: { learningPathId: pathId },
      select: { userId: true },
    });

    const enrolledUserIds = new Set(existingEnrollments.map((e) => e.userId));

    // Enroll students who aren't already enrolled
    const studentsToEnroll = students.filter(
      (student) => !enrolledUserIds.has(student.id)
    );

    if (studentsToEnroll.length === 0) {
      return { enrolled: 0 };
    }

    await db.learningEnrollment.createMany({
      data: studentsToEnroll.map((student) => ({
        userId: student.id,
        learningPathId: pathId,
        isAutoEnrolled: true,
      })),
    });

    console.log(`✅ Auto-enrolled ${studentsToEnroll.length} students in path ${pathId}`);

    return { enrolled: studentsToEnroll.length };
  }

  /**
   * Get user's enrollments
   */
  static async getUserEnrollments(userId: string) {
    const enrollments = await db.learningEnrollment.findMany({
      where: { userId },
      include: {
        learningPath: {
          include: {
            modules: {
              orderBy: { order: "asc" },
            },
            _count: {
              select: { modules: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const completedModules = await db.moduleCompletion.count({
          where: {
            userId,
            moduleId: {
              in: enrollment.learningPath.modules.map((m) => m.id),
            },
          },
        });

        const totalModules = enrollment.learningPath.modules.length;
        const percentComplete =
          totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return {
          ...enrollment,
          progress: {
            completedModules,
            totalModules,
            percentComplete,
          },
        };
      })
    );

    return enrollmentsWithProgress;
  }

  /**
   * QUIZ SUBMISSION METHOD
   */

  /**
   * Submit quiz answers and complete module
   */
  static async submitQuiz(data: {
    userId: string;
    moduleId: string;
    answers: number[]; // Array of selected answer indices
  }) {
    // Get module with quiz
    const module = await db.learningModule.findUnique({
      where: { id: data.moduleId },
      include: {
        learningPath: true,
      },
    });

    if (!module) {
      throw new Error("Module not found");
    }

    if (!module.quiz) {
      throw new Error("This module does not have a quiz");
    }

    // Check if already completed
    const existing = await db.moduleCompletion.findUnique({
      where: {
        userId_moduleId: {
          userId: data.userId,
          moduleId: data.moduleId,
        },
      },
    });

    if (existing) {
      throw new Error("Module already completed");
    }

    // Check enrollment
    const enrollment = await db.learningEnrollment.findUnique({
      where: {
        userId_learningPathId: {
          userId: data.userId,
          learningPathId: module.learningPathId,
        },
      },
    });

    if (!enrollment) {
      throw new Error("Not enrolled in this learning path");
    }

    // Calculate score
    const quiz = module.quiz as any;
    const questions = quiz.questions || [];
    
    let correctCount = 0;
    questions.forEach((question: any, index: number) => {
      if (data.answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const quizScore = questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

    // Create completion record
    const completion = await db.moduleCompletion.create({
      data: {
        userId: data.userId,
        moduleId: data.moduleId,
        quizScore,
        quizAnswers: data.answers,
      },
      include: {
        module: {
          include: {
            learningPath: true,
          },
        },
      },
    });

    // Award points based on score
    let pointsAwarded = POINTS_CONFIG.LEARNING.STAGE_COMPLETE; // Base: 50 points
    
    if (quizScore >= 70) {
      pointsAwarded += POINTS_CONFIG.LEARNING.QUIZ_PASS; // +30 points
    }
    
    if (quizScore === 100) {
      pointsAwarded += POINTS_CONFIG.LEARNING.QUIZ_PERFECT_SCORE; // +50 points (130 total)
    }

    // Create activity record
    try {
      await db.userActivity.create({
        data: {
          userId: data.userId,
          type: "LEARNING",
          action: "STAGE_COMPLETE",
          pointsAwarded,
          metadata: {
            moduleId: data.moduleId,
            moduleTitle: module.title,
            pathId: module.learningPathId,
            pathTitle: module.learningPath.title,
            quizScore,
          },
        },
      });
    } catch (error) {
      console.error("Failed to award points:", error);
    }

    // Check if path is complete
    await this.checkPathCompletion(data.userId, module.learningPathId);

    return {
      ...completion,
      pointsAwarded,
      quizScore,
      passed: quizScore >= 70,
    };
  }

  /**
   * Complete module without quiz
   */
  static async completeModule(data: {
    userId: string;
    moduleId: string;
  }) {
    // Get module
    const module = await db.learningModule.findUnique({
      where: { id: data.moduleId },
      include: {
        learningPath: true,
      },
    });

    if (!module) {
      throw new Error("Module not found");
    }

    // Check if has quiz
    if (module.quiz) {
      throw new Error("This module has a quiz. Use submitQuiz endpoint instead.");
    }

    // Check if already completed
    const existing = await db.moduleCompletion.findUnique({
      where: {
        userId_moduleId: {
          userId: data.userId,
          moduleId: data.moduleId,
        },
      },
    });

    if (existing) {
      throw new Error("Module already completed");
    }

    // Check enrollment
    const enrollment = await db.learningEnrollment.findUnique({
      where: {
        userId_learningPathId: {
          userId: data.userId,
          learningPathId: module.learningPathId,
        },
      },
    });

    if (!enrollment) {
      throw new Error("Not enrolled in this learning path");
    }

    // Create completion
    const completion = await db.moduleCompletion.create({
      data: {
        userId: data.userId,
        moduleId: data.moduleId,
      },
      include: {
        module: {
          include: {
            learningPath: true,
          },
        },
      },
    });

    // Award points (no quiz)
    const pointsAwarded = POINTS_CONFIG.LEARNING.STAGE_COMPLETE; // 50 points

    try {
      await db.userActivity.create({
        data: {
          userId: data.userId,
          type: "LEARNING",
          action: "STAGE_COMPLETE",
          pointsAwarded,
          metadata: {
            moduleId: data.moduleId,
            moduleTitle: module.title,
            pathId: module.learningPathId,
            pathTitle: module.learningPath.title,
          },
        },
      });
    } catch (error) {
      console.error("Failed to award points:", error);
    }

    // Check if path is complete
    await this.checkPathCompletion(data.userId, module.learningPathId);

    return {
      ...completion,
      pointsAwarded,
    };
  }

  /**
   * Check and mark path as complete if all modules done
   */
  static async checkPathCompletion(userId: string, pathId: string) {
    // Get all modules in path
    const modules = await db.learningModule.findMany({
      where: { learningPathId: pathId },
      select: { id: true },
    });

    // Get user's completions
    const completions = await db.moduleCompletion.findMany({
      where: {
        userId,
        moduleId: { in: modules.map((m) => m.id) },
      },
    });

    // Check if all modules completed
    if (completions.length === modules.length && modules.length > 0) {
      // Check if already marked complete
      const existing = await db.learningPathCompletion.findUnique({
        where: {
          userId_learningPathId: {
            userId,
            learningPathId: pathId,
          },
        },
      });

      if (!existing) {
        // Calculate average score
        const scores = completions
          .filter((c) => c.quizScore !== null)
          .map((c) => c.quizScore as number);
        
        const totalScore = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null;

        // Mark path as complete
        await db.learningPathCompletion.create({
          data: {
            userId,
            learningPathId: pathId,
            totalScore,
          },
        });

        // Award bonus points for completing entire path
        try {
          await db.userActivity.create({
            data: {
              userId,
              type: "LEARNING",
              action: "COURSE_COMPLETE",
              pointsAwarded: POINTS_CONFIG.LEARNING.COURSE_COMPLETE, // 100 bonus points
              metadata: {
                pathId,
                totalScore,
              },
            },
          });
        } catch (error) {
          console.error("Failed to award completion bonus:", error);
        }

        console.log(`🎉 User ${userId} completed learning path ${pathId}`);
      }
    }
  }

  // ... existing methods (getAllPaths, getPathById, etc.) ...
}