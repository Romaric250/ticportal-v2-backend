import { db } from "../../config/database";
import { LearningPathAudience } from "@prisma/client";
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
    const path = await db.learningPath.create({
      data: {
        title: data.title,
        description: data.description,
        audience: data.audience,
        isCore: data.isCore ?? false,
      },
    });

    // TODO: If isCore, assign to all users matching audience
    // TODO: Notify users about new course

    return path;
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
  static async completeModule(data: {
    userId: string;
    moduleId: string;
    quizScore?: number;
  }) {
    // Get module
    const module = await db.learningModule.findUnique({
      where: { id: data.moduleId },
    });

    if (!module) {
      throw new Error("Module not found");
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

    // Create completion
    const completion = await db.moduleCompletion.create({
      data: {
        userId: data.userId,
        moduleId: data.moduleId,
        quizScore: data.quizScore || null,
      },
    });

    // Update user progress
    await this.updateUserProgress(data.userId, module.pathId);

    // TODO: Award points
    // 10 points for completing module
    // +5 bonus if quiz score > 80%

    return completion;
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
}
