import { LearningPathAudience } from "@prisma/client";
import type { Prisma } from "@prisma/client";
export declare class LearningPathService {
    /**
     * Get all learning paths
     */
    static getAllPaths(filters?: {
        audience?: LearningPathAudience;
    }): Promise<({
        _count: {
            modules: number;
            progress: number;
        };
        modules: {
            id: string;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            content: string;
            order: number;
            pathId: string;
            quiz: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        audience: import(".prisma/client").$Enums.LearningPathAudience;
        isCore: boolean;
    })[]>;
    /**
     * Get single learning path
     */
    static getPathById(pathId: string): Promise<{
        modules: {
            id: string;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            content: string;
            order: number;
            pathId: string;
            quiz: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        audience: import(".prisma/client").$Enums.LearningPathAudience;
        isCore: boolean;
    }>;
    /**
     * Create learning path
     */
    static createPath(data: {
        title: string;
        description: string;
        audience: LearningPathAudience;
        isCore?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        audience: import(".prisma/client").$Enums.LearningPathAudience;
        isCore: boolean;
    }>;
    /**
     * Update learning path
     */
    static updatePath(pathId: string, data: {
        title?: string;
        description?: string;
        audience?: LearningPathAudience;
        isCore?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        audience: import(".prisma/client").$Enums.LearningPathAudience;
        isCore: boolean;
    }>;
    /**
     * Delete learning path
     */
    static deletePath(pathId: string): Promise<void>;
    /**
     * Add module to learning path
     */
    static addModule(data: {
        pathId: string;
        title: string;
        content: string;
        order: number;
        quiz?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        content: string;
        order: number;
        pathId: string;
        quiz: Prisma.JsonValue | null;
    }>;
    /**
     * Update module
     */
    static updateModule(moduleId: string, data: {
        title?: string;
        content?: string;
        order?: number;
        quiz?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        content: string;
        order: number;
        pathId: string;
        quiz: Prisma.JsonValue | null;
    }>;
    /**
     * Delete module
     */
    static deleteModule(moduleId: string): Promise<void>;
    /**
     * Get learning paths for user (student view)
     */
    static getPathsForUser(userId: string, userRole: string): Promise<{
        userProgress: {
            userId: string;
            id: string;
            progress: number;
            pathId: string;
            completedModules: number;
            totalModules: number;
            startedAt: Date;
            completedAt: Date | null;
        } | {
            completedModules: number;
            totalModules: number;
            progress: number;
        };
        modules: {
            id: string;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            content: string;
            order: number;
            pathId: string;
            quiz: Prisma.JsonValue | null;
        }[];
        id: string;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        audience: import(".prisma/client").$Enums.LearningPathAudience;
        isCore: boolean;
    }[]>;
    /**
     * Get user progress for a path
     */
    static getUserProgress(userId: string, pathId: string): Promise<{
        completedModuleIds: string[];
        completions: {
            completedAt: Date;
            moduleId: string;
            quizScore: number | null;
        }[];
        userId: string;
        id: string;
        progress: number;
        pathId: string;
        completedModules: number;
        totalModules: number;
        startedAt: Date;
        completedAt: Date | null;
    }>;
    /**
     * Complete module
     */
    static completeModule(data: {
        userId: string;
        moduleId: string;
        quizScore?: number;
    }): Promise<{
        userId: string;
        id: string;
        completedAt: Date;
        moduleId: string;
        quizScore: number | null;
        quizAnswers: Prisma.JsonValue | null;
    }>;
    /**
     * Helper: Update user progress for a path
     */
    private static updateUserProgress;
    /**
     * Helper: Update total modules for all progress records
     */
    private static updateTotalModules;
    /**
     * Enroll user in a learning path
     */
    static enrollUser(userId: string, pathId: string): Promise<{
        userId: string;
        id: string;
        learningPathId: string;
        enrolledAt: Date;
        isAutoEnrolled: boolean;
    }>;
    /**
     * Auto-enroll all students in a core path
     */
    static autoEnrollStudents(pathId: string): Promise<{
        enrolled: number;
    }>;
    /**
     * Submit quiz and complete module
     */
    static submitQuiz(data: {
        userId: string;
        moduleId: string;
        answers: number[];
    }): Promise<{
        pointsAwarded: number;
        quizScore: number;
        passed: boolean;
        userId: string;
        id: string;
        completedAt: Date;
        moduleId: string;
        quizAnswers: Prisma.JsonValue | null;
    }>;
    /**
     * Check and mark path as complete
     */
    static checkPathCompletion(userId: string, pathId: string): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map