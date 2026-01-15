import { LearningPathAudience } from "@prisma/client";
import type { LearningPathStatus, Prisma } from "@prisma/client";
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
        status: import(".prisma/client").$Enums.LearningPathStatus;
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
        status: import(".prisma/client").$Enums.LearningPathStatus;
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
        status?: 'DRAFT' | 'ACTIVE';
    }): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        status: import(".prisma/client").$Enums.LearningPathStatus;
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
        status?: LearningPathStatus;
    }): Promise<{
        path: {
            id: string;
            createdAt: Date;
            title: string;
            status: import(".prisma/client").$Enums.LearningPathStatus;
            updatedAt: Date;
            description: string;
            audience: import(".prisma/client").$Enums.LearningPathAudience;
            isCore: boolean;
        };
        message: string;
    }>;
    /**
     * Unenroll all auto-enrolled students from a path
     */
    private static unenrollAutoEnrolledStudents;
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
        status: import(".prisma/client").$Enums.LearningPathStatus;
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
    /**
     * Complete a module without quiz
     */
    static completeModule(input: {
        userId: string;
        moduleId: string;
        quizScore?: number;
    }): Promise<{
        pointsAwarded: number;
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
    /**
     * Get module completion status for a user
     */
    static getModuleStatus(userId: string, moduleId: string): Promise<{
        isCompleted: boolean;
        completedAt: Date | null;
        quizScore: number | null;
    }>;
    /**
     * Get all modules for a learning path with completion status
     */
    static getPathModulesWithStatus(userId: string, pathId: string): Promise<{
        id: string;
        title: string;
        content: string;
        order: number;
        hasQuiz: boolean;
        quiz: string | number | true | Prisma.JsonObject | Prisma.JsonArray | null;
        isCompleted: boolean;
        completedAt: Date | null;
        quizScore: number | null;
    }[]>;
    /**
     * Complete a learning path (all modules must be completed)
     */
    static completeLearningPath(userId: string, pathId: string): Promise<{
        pointsAwarded: number;
        totalModules: number;
        averageScore: number | null;
        userId: string;
        id: string;
        learningPathId: string;
        completedAt: Date;
        totalScore: number | null;
    }>;
    /**
     * Unenroll from learning path and delete all progress
     */
    static unenrollFromPath(userId: string, pathId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Get enrollment status for all learning paths
     */
    static getAllEnrollmentStatus(userId: string): Promise<{
        pathId: string;
        pathTitle: string;
        pathDescription: string;
        audience: import(".prisma/client").$Enums.LearningPathAudience;
        isCore: boolean;
        isEnrolled: boolean;
        isAutoEnrolled: boolean;
        enrolledAt: Date | null;
        isCompleted: boolean;
        completedAt: Date | null;
        totalScore: number | null;
    }[]>;
    /**
     * Calculate user progress for all enrolled learning paths
     */
    static calculateProgressForAll(userId: string): Promise<{
        pathId: string;
        pathTitle: string;
        totalModules: number;
        completedModules: number;
        progressPercentage: number;
        isCompleted: boolean;
    }[]>;
    /**
     * Calculate user progress in a single learning path
     */
    static calculateProgress(userId: string, pathId: string): Promise<{
        totalModules: number;
        completedModules: number;
        progressPercentage: number;
        isCompleted: boolean;
    }>;
}
//# sourceMappingURL=service.d.ts.map