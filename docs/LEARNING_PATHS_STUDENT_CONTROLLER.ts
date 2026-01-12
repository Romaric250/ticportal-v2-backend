import type { Request, Response } from "express";
import { LearningPathService } from "./service";

export class LearningPathStudentController {
  
  /**
   * GET /api/learning-paths
   * Get all learning paths (enrolled + available)
   */
  static async getAllPaths(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const paths = await LearningPathService.getPathsForUser(userId);

      res.json({
        success: true,
        data: paths,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get learning paths",
      });
    }
  }

  /**
   * GET /api/learning-paths/:pathId
   * Get single learning path details
   */
  static async getPathById(req: Request, res: Response) {
    try {
      const { pathId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const path = await LearningPathService.getPathByIdForUser(userId, pathId);

      res.json({
        success: true,
        data: path,
      });
    } catch (error: any) {
      const statusCode = error.message === "Learning path not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get learning path",
      });
    }
  }

  /**
   * POST /api/learning-paths/:pathId/enroll
   * Enroll in a learning path
   */
  static async enrollInPath(req: Request, res: Response) {
    try {
      const { pathId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const enrollment = await LearningPathService.enrollUser(userId, pathId);

      res.status(201).json({
        success: true,
        message: "Successfully enrolled in learning path",
        data: enrollment,
      });
    } catch (error: any) {
      const statusCode =
        error.message === "Learning path not found"
          ? 404
          : error.message === "Already enrolled in this learning path"
          ? 409
          : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to enroll in learning path",
      });
    }
  }

  /**
   * GET /api/learning-paths/enrolled
   * Get user's enrollments
   */
  static async getEnrollments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const enrollments = await LearningPathService.getUserEnrollments(userId);

      res.json({
        success: true,
        data: enrollments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get enrollments",
      });
    }
  }

  /**
   * GET /api/learning-paths/:pathId/progress
   * Get progress for a specific path
   */
  static async getProgress(req: Request, res: Response) {
    try {
      const { pathId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const progress = await LearningPathService.getUserProgress(userId, pathId);

      res.json({
        success: true,
        data: progress,
      });
    } catch (error: any) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get progress",
      });
    }
  }

  /**
   * POST /api/learning-paths/:pathId/modules/:moduleId/complete
   * Complete a module (no quiz)
   */
  static async completeModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const completion = await LearningPathService.completeModule({
        userId,
        moduleId,
      });

      res.json({
        success: true,
        message: `Module completed! You earned ${completion.pointsAwarded} points!`,
        data: completion,
      });
    } catch (error: any) {
      const statusCode =
        error.message === "Module not found"
          ? 404
          : error.message === "Module already completed"
          ? 409
          : error.message.includes("quiz")
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to complete module",
      });
    }
  }

  /**
   * POST /api/learning-paths/:pathId/modules/:moduleId/submit-quiz
   * Submit quiz answers and complete module
   */
  static async submitQuiz(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const { answers } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: "Quiz answers are required (array of answer indices)",
        });
      }

      const result = await LearningPathService.submitQuiz({
        userId,
        moduleId,
        answers,
      });

      const message = result.passed
        ? `Quiz passed! You scored ${result.quizScore}% and earned ${result.pointsAwarded} points! 🎉`
        : `Quiz completed. You scored ${result.quizScore}%. You earned ${result.pointsAwarded} points.`;

      res.json({
        success: true,
        message,
        data: result,
      });
    } catch (error: any) {
      const statusCode =
        error.message === "Module not found"
          ? 404
          : error.message === "Module already completed"
          ? 409
          : error.message.includes("quiz")
          ? 400
          : error.message.includes("enrolled")
          ? 403
          : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to submit quiz",
      });
    }
  }

  /**
   * GET /api/learning-paths/:pathId/modules/:moduleId
   * Get single module details
   */
  static async getModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const module = await LearningPathService.getModuleForUser(userId, moduleId);

      res.json({
        success: true,
        data: module,
      });
    } catch (error: any) {
      const statusCode =
        error.message === "Module not found"
          ? 404
          : error.message.includes("enrolled")
          ? 403
          : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get module",
      });
    }
  }
}
