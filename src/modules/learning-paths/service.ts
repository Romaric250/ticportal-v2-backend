import { db } from "../../config/database";
import { LearningPathAudience } from "@prisma/client";
import { POINTS_CONFIG } from "../../shared/constants/points";
import type { Prisma } from "@prisma/client";

export class LearningPathService {
  /**
   * Get all learning paths
   */
  static async getAllPaths(filters?: { audience?: LearningPathAudience }) {
    const where: Prisma.LearningPathWhereInput = {};

    if (filters?.audience) {
      where.audience = filters.audience;
    }

    const paths = await db.learningPath.findMany({
      where,
      include: {
        modules: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            modules: true,
            progress: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return paths;
  }

  /**
   * Get single learning path
   */
  static async getPathById(pathId: string) {
    const path = await db.learningPath.findUnique({
      where: { id: pathId },
      include: {
        modules: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!path) {
      throw new Error("Learning path not found");
    }

    return path;
  }

  /**
   * Create learning path
   */
  static async createPath(data: {
    title: string;
    description: string;
    audience: LearningPathAudience;
    isCore?: boolean;
  }) {
    const template = await db.learningPath.create({
      data: {
        title: data.title,
        description: data.description,
        audience: data.audience,
        isCore: data.isCore ?? false,
      },
    });

    // ✅ Auto-enroll all students if core path
    if (data.isCore) {
      await this.autoEnrollStudents(template.id);
    }

    return template;
  }

  /**
   * Update learning path
   */
  static async updatePath(
    pathId: string,
    data: {
      title?: string;
      description?: string;
      audience?: LearningPathAudience;
      isCore?: boolean;
    }
  ) {
    const path = await db.learningPath.update({
      where: { id: pathId },
      data,
    });

    return path;
  }

  /**
   * Delete learning path
   */
  static async deletePath(pathId: string) {
    // Modules will be cascade deleted
    await db.learningPath.delete({
      where: { id: pathId },
    });
  }

  /**
   * Add module to learning path
   */
  static async addModule(data: {
    pathId: string;
    title: string;
    content: string; // JSON string from novel.sh
    order: number;
    quiz?: any; // Array of quiz questions
  }) {
    // Check if path exists
    const path = await db.learningPath.findUnique({
      where: { id: data.pathId },
    });

    if (!path) {
      throw new Error("Learning path not found");
    }

    // Check if order already exists
    const existingModule = await db.learningModule.findFirst({
      where: {
        pathId: data.pathId,
        order: data.order,
      },
    });

    if (existingModule) {
      throw new Error(`Module with order ${data.order} already exists`);
    }

    const module = await db.learningModule.create({
      data: {
        pathId: data.pathId,
        title: data.title,
        content: data.content,
        order: data.order,
        quiz: data.quiz || null,
      },
    });

    // Update total modules for all user progress
    await this.updateTotalModules(data.pathId);

    return module;
  }

  /**
   * Update module
   */
  static async updateModule(
    moduleId: string,
    data: {
      title?: string;
      content?: string;
      order?: number;
      quiz?: any;
    }
  ) {
    const module = await db.learningModule.update({
      where: { id: moduleId },
      data,
    });

    return module;
  }

  /**
   * Delete module
   */
  static async deleteModule(moduleId: string) {
    const module = await db.learningModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new Error("Module not found");
    }

    await db.learningModule.delete({
      where: { id: moduleId },
    });

    // Update total modules for all user progress
    await this.updateTotalModules(module.pathId);
  }

  /**
   * Get learning paths for user (student view)
   */
  static async getPathsForUser(userId: string, userRole: string) {
    // Determine audience based on role
    const audiences: LearningPathAudience[] = [LearningPathAudience.EVERYONE];

    if (userRole === "STUDENT") {
      audiences.push(LearningPathAudience.STUDENTS);
    } else if (userRole === "MENTOR") {
      audiences.push(LearningPathAudience.MENTORS);
    }

    const paths = await db.learningPath.findMany({
      where: {
        audience: { in: audiences },
      },
      include: {
        modules: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get user's progress for each path
    const pathsWithProgress = await Promise.all(
      paths.map(async (path) => {
        const progress = await db.userLearningProgress.findUnique({
          where: {
            userId_pathId: {
              userId,
              pathId: path.id,
            },
          },
        });

        return {
          ...path,
          userProgress: progress || {
            completedModules: 0,
            totalModules: path.modules.length,
            progress: 0,
          },
        };
      })
    );

    return pathsWithProgress;
  }

  /**
   * Get user progress for a path
   */
  static async getUserProgress(userId: string, pathId: string) {
    let progress = await db.userLearningProgress.findUnique({
      where: {
        userId_pathId: {
          userId,
          pathId,
        },
      },
    });

    if (!progress) {
      // Create initial progress
      const path = await db.learningPath.findUnique({
        where: { id: pathId },
        include: {
          _count: {
            select: { modules: true },
          },
        },
      });

      if (!path) {
        throw new Error("Learning path not found");
      }

      progress = await db.userLearningProgress.create({
        data: {
          userId,
          pathId,
          completedModules: 0,
          totalModules: path._count.modules,
          progress: 0,
        },
      });
    }

    // Get completed module IDs
    const completions = await db.moduleCompletion.findMany({
      where: {
        userId,
        module: {
          pathId,
        },
      },
      select: {
        moduleId: true,
        quizScore: true,
        completedAt: true,
      },
    });

    return {
      ...progress,
      completedModuleIds: completions.map((c) => c.moduleId),
      completions,
    };
  }

  /**
   * Complete module
   */
  // static async completeModule(data: {
  //   userId: string;
  //   moduleId: string;
  //   quizScore?: number;
  // }) {
  //   // Get module
  //   const module = await db.learningModule.findUnique({
  //     where: { id: data.moduleId },
  //   });

  //   if (!module) {
  //     throw new Error("Module not found");
  //   }

  //   // Check if already completed
  //   const existing = await db.moduleCompletion.findUnique({
  //     where: {
  //       userId_moduleId: {
  //         userId: data.userId,
  //         moduleId: data.moduleId,
  //       },
  //     },
  //   });

  //   if (existing) {
  //     throw new Error("Module already completed");
  //   }

  //   // Create completion
  //   const completion = await db.moduleCompletion.create({
  //     data: {
  //       userId: data.userId,
  //       moduleId: data.moduleId,
  //       quizScore: data.quizScore || null,
  //     },
  //   });

  //   // Update user progress
  //   await this.updateUserProgress(data.userId, module.pathId);

  //   // TODO: Award points
  //   // 10 points for completing module
  //   // +5 bonus if quiz score > 80%

  //   return completion;
  // }

  /**
   * Complete a module without quiz
   */
  static async completeModule(input: {
    userId: string;
    moduleId: string;
    quizScore?: number;
  }) {
    const { userId, moduleId, quizScore } = input;

    // Check if module exists and has quiz
    const module = await db.learningModule.findUnique({
      where: { id: moduleId },
      select: {
        id: true,
        quiz: true,
        pathId: true,
      },
    });

    if (!module) {
      throw new Error("Module not found");
    }

    // ✅ If module has a quiz, reject this endpoint
    if (module.quiz && Object.keys(module.quiz).length > 0) {
      throw new Error("This module has a quiz. Please use the submit-quiz endpoint instead.");
    }

    // Check if already completed
    const existingCompletion = await db.moduleCompletion.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
    });

    if (existingCompletion) {
      throw new Error("Module already completed");
    }

    // Create completion record
    const completion = await db.moduleCompletion.create({
      data: {
        userId,
        moduleId,
        completedAt: new Date(),
      },
    });

    // Check if path is complete
    await this.checkPathCompletion(userId, module.pathId);

    console.log(`✅ Module ${moduleId} completed by user ${userId} (+50 points)`);

    return {
      ...completion,
      pointsAwarded: 50,
    };
  }

  /**
   * Helper: Update user progress for a path
   */
  private static async updateUserProgress(userId: string, pathId: string) {
    // Count completed modules
    const completedCount = await db.moduleCompletion.count({
      where: {
        userId,
        module: {
          pathId,
        },
      },
    });

    // Get total modules
    const totalModules = await db.learningModule.count({
      where: { pathId },
    });

    const progress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
    const isCompleted = completedCount === totalModules && totalModules > 0;

    // Update or create progress
    await db.userLearningProgress.upsert({
      where: {
        userId_pathId: {
          userId,
          pathId,
        },
      },
      update: {
        completedModules: completedCount,
        totalModules,
        progress,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId,
        pathId,
        completedModules: completedCount,
        totalModules,
        progress,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // TODO: If just completed, award 50 points
    // TODO: If core path, award +25 bonus points
    // TODO: Send completion notification
  }

  /**
   * Helper: Update total modules for all progress records
   */
  private static async updateTotalModules(pathId: string) {
    const totalModules = await db.learningModule.count({
      where: { pathId },
    });

    await db.userLearningProgress.updateMany({
      where: { pathId },
      data: { totalModules },
    });
  }

  /**
   * Enroll user in a learning path
   */
  static async enrollUser(userId: string, pathId: string) {
    const path = await db.learningPath.findUnique({
      where: { id: pathId },
    });

    if (!path) {
      throw new Error("Learning path not found");
    }

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

    const enrollment = await db.learningEnrollment.create({
      data: {
        userId,
        learningPathId: pathId,
        isAutoEnrolled: false,
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
    const students = await db.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true },
    });

    const existingEnrollments = await db.learningEnrollment.findMany({
      where: { learningPathId: pathId },
      select: { userId: true },
    });

    const enrolledUserIds = new Set(existingEnrollments.map((e) => e.userId));
    const studentsToEnroll = students.filter((s) => !enrolledUserIds.has(s.id));

    if (studentsToEnroll.length === 0) {
      return { enrolled: 0 };
    }

    await db.learningEnrollment.createMany({
      data: studentsToEnroll.map((s) => ({
        userId: s.id,
        learningPathId: pathId,
        isAutoEnrolled: true,
      })),
    });

    console.log(`✅ Auto-enrolled ${studentsToEnroll.length} students in path ${pathId}`);
    return { enrolled: studentsToEnroll.length };
  }

  /**
   * Submit quiz and complete module
   */
  static async submitQuiz(data: {
    userId: string;
    moduleId: string;
    answers: number[];
  }) {
    const module = await db.learningModule.findUnique({
      where: { id: data.moduleId },
      include: { path: true },
    });

    if (!module) {
      throw new Error("Module not found");
    }

    if (!module.quiz) {
      throw new Error("This module does not have a quiz");
    }

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

    const completion = await db.moduleCompletion.create({
      data: {
        userId: data.userId,
        moduleId: data.moduleId,
        quizScore,
        quizAnswers: data.answers,
      },
    });

    // Award points
    let pointsAwarded = POINTS_CONFIG.LEARNING.STAGE_COMPLETE;
    if (quizScore >= 70) {
      pointsAwarded += POINTS_CONFIG.LEARNING.QUIZ_PASS;
    }
    if (quizScore === 100) {
      pointsAwarded += POINTS_CONFIG.LEARNING.QUIZ_PERFECT_SCORE;
    }

    try {
      await db.userActivity.create({
        data: {
          userId: data.userId,
          type: "LEARNING",
          action: "STAGE_COMPLETE",
          pointsAwarded,
        },
      });
    } catch (error) {
      console.error("Failed to award points:", error);
    }

    // Check if path is complete
    await this.checkPathCompletion(data.userId, module.id);

    return {
      ...completion,
      pointsAwarded,
      quizScore,
      passed: quizScore >= 70,
    };
  }

  /**
   * Check and mark path as complete
   */
  static async checkPathCompletion(userId: string, pathId: string) {
    const modules = await db.learningModule.findMany({
      where: { id: pathId },
      select: { id: true },
    });

    const completions = await db.moduleCompletion.findMany({
      where: {
        userId,
        moduleId: { in: modules.map((m) => m.id) },
      },
    });

    if (completions.length === modules.length && modules.length > 0) {
      const existing = await db.learningPathCompletion.findUnique({
        where: {
          userId_learningPathId: {
            userId,
            learningPathId: pathId,
          },
        },
      });

      if (!existing) {
        const scores = completions
          .filter((c) => c.quizScore !== null)
          .map((c) => c.quizScore as number);
        
        const totalScore = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null;

        await db.learningPathCompletion.create({
          data: {
            userId,
            learningPathId: pathId,
            totalScore,
          },
        });

        // Award completion bonus
        try {
          await db.userActivity.create({
            data: {
              userId,
              type: "LEARNING",
              action: "COURSE_COMPLETE",
              pointsAwarded: POINTS_CONFIG.LEARNING.COURSE_COMPLETE,
            },
          });
        } catch (error) {
          console.error("Failed to award completion bonus:", error);
        }

        console.log(`🎉 User ${userId} completed learning path ${pathId}`);
      }
    }
  }

  /**
   * Get module completion status for a user
   */
  static async getModuleStatus(userId: string, moduleId: string) {
    // Check if module exists
    const module = await db.learningModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new Error("Module not found");
    }

    // Check if module is completed
    const completion = await db.moduleCompletion.findUnique({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      select: {
        completedAt: true,
        quizScore: true,
      },
    });

    return {
      isCompleted: !!completion,
      completedAt: completion?.completedAt || null,
      quizScore: completion?.quizScore || null,
    };
  }

  /**
   * Get all modules for a learning path with completion status
   */
  static async getPathModulesWithStatus(userId: string, pathId: string) {
    // Check if learning path exists
    const learningPath = await db.learningPath.findUnique({
      where: { id: pathId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!learningPath) {
      throw new Error("Learning path not found");
    }

    // Get all module completions for this user
    const completions = await db.moduleCompletion.findMany({
      where: {
        userId,
        moduleId: { in: learningPath.modules.map(m => m.id) },
      },
    });

    // Create a map for quick lookup
    const completionMap = new Map(
      completions.map(c => [c.moduleId, c])
    );

    // Map modules with completion status
    const modulesWithStatus = learningPath.modules.map(module => ({
      id: module.id,
      title: module.title,
      content: module.content,
      order: module.order,
      hasQuiz: !!(module.quiz && Object.keys(module.quiz).length > 0),
      quiz: module.quiz || null,
      isCompleted: completionMap.has(module.id),
      completedAt: completionMap.get(module.id)?.completedAt || null,
      quizScore: completionMap.get(module.id)?.quizScore || null,
    }));

    return modulesWithStatus;
  }

  /**
   * Complete a learning path (all modules must be completed)
   */
  static async completeLearningPath(userId: string, pathId: string) {
    // Check if learning path exists
    const path = await db.learningPath.findUnique({
      where: { id: pathId },
      include: {
        modules: true,
      },
    });

    if (!path) {
      throw new Error("Learning path not found");
    }

    // Check if user is enrolled
    const enrollment = await db.learningEnrollment.findFirst({
      where: {
        userId,
        learningPathId: pathId,
      },
    });

    if (!enrollment) {
      throw new Error("Not enrolled in this learning path");
    }

    // Check if all modules are completed
    const completedModules = await db.moduleCompletion.count({
      where: {
        userId,
        moduleId: { in: path.modules.map(m => m.id) },
      },
    });

    if (completedModules < path.modules.length) {
      throw new Error(`You must complete all ${path.modules.length} modules before completing this path. You have completed ${completedModules}/${path.modules.length}.`);
    }

    // Check if already completed
    const existingCompletion = await db.learningPathCompletion.findFirst({
      where: {
        userId,
        learningPathId: pathId,
      },
    });

    if (existingCompletion) {
      throw new Error("Learning path already completed");
    }

    // Calculate total score from all quiz modules
    const moduleCompletions = await db.moduleCompletion.findMany({
      where: {
        userId,
        moduleId: { in: path.modules.map(m => m.id) },
      },
    });

    const scores = moduleCompletions
      .filter(c => c.quizScore !== null)
      .map(c => c.quizScore as number);

    const totalScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

    // Create completion record
    const completion = await db.learningPathCompletion.create({
      data: {
        userId,
        learningPathId: pathId,
        totalScore,
      },
    });

    // Award completion points
    let pointsAwarded = POINTS_CONFIG.LEARNING.COURSE_COMPLETE;
    
    // Bonus for core paths
    if (path.isCore) {
      pointsAwarded += 50; // +50 bonus for core path
    }

    try {
      await db.userActivity.create({
        data: {
          userId,
          type: "LEARNING",
          action: "COURSE_COMPLETE",
          pointsAwarded,
        },
      });
    } catch (error) {
      console.error("Failed to award completion points:", error);
    }

    console.log(`🎉 User ${userId} completed learning path ${pathId} (+${pointsAwarded} points)`);

    return {
      ...completion,
      pointsAwarded,
      totalModules: path.modules.length,
      averageScore: totalScore,
    };
  }

  /**
   * Unenroll from learning path and delete all progress
   */
  static async unenrollFromPath(userId: string, pathId: string) {
    // Check if user is enrolled (try to find with either composite key structure)

    console.log("userid testin", userId)
    const enrollment = await db.learningEnrollment.findFirst({
      where: {
        userId,
        learningPathId: pathId,
      },
    });

    if (!enrollment) {
      throw new Error("Not enrolled in this learning path");
    }

    // Get all modules for this path
    const modules = await db.learningModule.findMany({
      where: { pathId },
      select: { id: true },
    });

    const moduleIds = modules.map(m => m.id);

    // Delete all module completions
    await db.moduleCompletion.deleteMany({
      where: {
        userId,
        moduleId: { in: moduleIds },
      },
    });

    // Delete learning path completion if exists
    await db.learningPathCompletion.deleteMany({
      where: {
        userId,
        learningPathId: pathId,
      },
    });

    // Delete user progress
    await db.userLearningProgress.deleteMany({
      where: {
        userId,
        pathId,
      },
    });

    // Delete enrollment
    await db.learningEnrollment.delete({
      where: {
        id: enrollment.id,
      },
    });

    console.log(`✅ User ${userId} unenrolled from path ${pathId} - all progress deleted`);

    return { success: true };
  }

  /**
   * Get enrollment status for all learning paths
   */
  static async getAllEnrollmentStatus(userId: string) {
    // Get all learning paths
    const allPaths = await db.learningPath.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        audience: true,
        isCore: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all user enrollments
    const enrollments = await db.learningEnrollment.findMany({
      where: { userId },
      select: {
        learningPathId: true,
        isAutoEnrolled: true,
        enrolledAt: true,
      },
    });

    // Get all path completions
    const completions = await db.learningPathCompletion.findMany({
      where: { userId },
      select: {
        learningPathId: true,
        completedAt: true,
        totalScore: true,
      },
    });

    // Create maps for quick lookup
    const enrollmentMap = new Map(
      enrollments.map(e => [e.learningPathId, e])
    );

    const completionMap = new Map(
      completions.map(c => [c.learningPathId, c])
    );

    // Map all paths with enrollment status
    const pathsWithStatus = allPaths.map(path => {
      const enrollment = enrollmentMap.get(path.id);
      const completion = completionMap.get(path.id);

      return {
        pathId: path.id,
        pathTitle: path.title,
        pathDescription: path.description,
        audience: path.audience,
        isCore: path.isCore,
        isEnrolled: !!enrollment,
        isAutoEnrolled: enrollment?.isAutoEnrolled || false,
        enrolledAt: enrollment?.enrolledAt || null,
        isCompleted: !!completion,
        completedAt: completion?.completedAt || null,
        totalScore: completion?.totalScore || null,
      };
    });

    return pathsWithStatus;
  }

  /**
   * Calculate user progress for all enrolled learning paths
   */
  static async calculateProgressForAll(userId: string) {
    // Get all enrolled paths
    const enrollments = await db.learningEnrollment.findMany({
      where: { userId },
      select: {
        learningPathId: true,
      },
    });

    if (enrollments.length === 0) {
      return [];
    }

    const pathIds = enrollments.map(e => e.learningPathId);

    // Get all enrolled paths with modules
    const paths = await db.learningPath.findMany({
      where: {
        id: { in: pathIds },
      },
      include: {
        modules: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all module completions for this user in enrolled paths
    const allModuleIds = paths.flatMap(p => p.modules.map(m => m.id));
    
    const completions = await db.moduleCompletion.findMany({
      where: {
        userId,
        moduleId: { in: allModuleIds },
      },
      select: {
        moduleId: true,
      },
    });

    // Create a set of completed module IDs for quick lookup
    const completedModuleIds = new Set(completions.map(c => c.moduleId));

    // Calculate progress for each path
    const progressData = paths.map(path => {
      const totalModules = path.modules.length;
      const completedModules = path.modules.filter(m => 
        completedModuleIds.has(m.id)
      ).length;

      const progressPercentage = totalModules > 0 
        ? Math.round((completedModules / totalModules) * 100)
        : 0;

      const isCompleted = completedModules === totalModules && totalModules > 0;

      return {
        pathId: path.id,
        pathTitle: path.title,
        totalModules,
        completedModules,
        progressPercentage,
        isCompleted,
      };
    });

    return progressData;
  }

  /**
   * Calculate user progress in a single learning path
   */
  static async calculateProgress(userId: string, pathId: string) {
    // Check if learning path exists
    const path = await db.learningPath.findUnique({
      where: { id: pathId },
      include: {
        modules: {
          select: { id: true },
        },
      },
    });

    if (!path) {
      throw new Error("Learning path not found");
    }

    const totalModules = path.modules.length;

    // Count completed modules for this user
    const completedModules = await db.moduleCompletion.count({
      where: {
        userId,
        moduleId: { in: path.modules.map(m => m.id) },
      },
    });

    // Calculate percentage
    const progressPercentage = totalModules > 0 
      ? Math.round((completedModules / totalModules) * 100)
      : 0;

    const isCompleted = completedModules === totalModules && totalModules > 0;

    console.log(  totalModules,
      completedModules,
      progressPercentage,
      isCompleted,)
    return {
      totalModules,
      completedModules,
      progressPercentage,
      isCompleted,
    };



  }
}
