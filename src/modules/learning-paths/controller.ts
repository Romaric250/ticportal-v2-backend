import type { Request, Response } from "express";
import { LearningPathService } from "./service";
import { LearningPathAudience } from "@prisma/client";

export class LearningPathController {
  /**
   * GET /api/admin/learning-paths
   */
  static async getAllPaths(req: Request, res: Response) {
    try {
      const { audience } = req.query;

      const paths = await LearningPathService.getAllPaths({
        audience: audience as LearningPathAudience,
      });

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
   * GET /api/admin/learning-paths/:pathId
   */
  static async getPathById(req: Request, res: Response) {
    try {
      const { pathId } = req.params;

      if (!pathId) {
        return res.status(400).json({
          success: false,
          message: "Path ID is required",
        });
      }

      const path = await LearningPathService.getPathById(pathId);

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
   * POST /api/admin/learning-paths
   */
  static async createPath(req: Request, res: Response) {
    try {
      const { title, description, audience, isCore } = req.body;

      if (!title || !description || !audience) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: title, description, audience",
        });
      }

      const path = await LearningPathService.createPath({
        title,
        description,
        audience,
        isCore,
      });

      res.status(201).json({
        success: true,
        data: path,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create learning path",
      });
    }
  }

  /**
   * PUT /api/admin/learning-paths/:pathId
   */
  static async updatePath(req: Request, res: Response) {
    try {
      const { pathId } = req.params;
      const { title, description, audience, isCore } = req.body;

      if (!pathId) {
        return res.status(400).json({
          success: false,
          message: "Path ID is required",
        });
      }

      const path = await LearningPathService.updatePath(pathId, {
        title,
        description,
        audience,
        isCore,
      });

      res.json({
        success: true,
        data: path,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update learning path",
      });
    }
  }

  /**
   * DELETE /api/admin/learning-paths/:pathId
   */
  static async deletePath(req: Request, res: Response) {
    try {
      const { pathId } = req.params;

      if (!pathId) {
        return res.status(400).json({
          success: false,
          message: "Path ID is required",
        });
      }

      await LearningPathService.deletePath(pathId);

      res.json({
        success: true,
        message: "Learning path deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete learning path",
      });
    }
  }

  /**
   * POST /api/admin/learning-paths/:pathId/modules
   */
  static async addModule(req: Request, res: Response) {
    try {
      const { pathId } = req.params;
      const { title, content, order, quiz } = req.body;

      if (!pathId) {
        return res.status(400).json({
          success: false,
          message: "Path ID is required",
        });
      }

      if (!title || !content || order === undefined) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: title, content, order",
        });
      }

      const module = await LearningPathService.addModule({
        pathId,
        title,
        content,
        order,
        quiz,
      });

      res.status(201).json({
        success: true,
        data: module,
      });
    } catch (error: any) {
      const statusCode = 
        error.message.includes("not found") ? 404 :
        error.message.includes("already exists") ? 409 : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to add module",
      });
    }
  }

  /**
   * PUT /api/admin/learning-paths/:pathId/modules/:moduleId
   */
  static async updateModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const { title, content, order, quiz } = req.body;

      if (!moduleId) {
        return res.status(400).json({
          success: false,
          message: "Module ID is required",
        });
      }

      const module = await LearningPathService.updateModule(moduleId, {
        title,
        content,
        order,
        quiz,
      });

      res.json({
        success: true,
        data: module,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update module",
      });
    }
  }

  /**
   * DELETE /api/admin/learning-paths/:pathId/modules/:moduleId
   */
  static async deleteModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;

      if (!moduleId) {
        return res.status(400).json({
          success: false,
          message: "Module ID is required",
        });
      }

      await LearningPathService.deleteModule(moduleId);

      res.json({
        success: true,
        message: "Module deleted successfully",
      });
    } catch (error: any) {
      const statusCode = error.message === "Module not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to delete module",
      });
    }
  }

  /**
   * GET /api/learning-paths (Student view)
   */
  static async getPathsForUser(req: Request, res: Response) {
    try {
      // Your JWT stores userId in the payload, not as user.id
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const paths = await LearningPathService.getPathsForUser(userId, "STUDENT");

      res.json({
        success: true,
        data: paths,
      });
    } catch (error: any) {
      console.error("❌ Error in getPathsForUser:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get learning paths",
      });
    }
  }

  /**
   * GET /api/learning-paths/:pathId/progress
   */
  static async getUserProgress(req: Request, res: Response) {
    try {
      const { pathId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!pathId) {
        return res.status(400).json({
          success: false,
          message: "Path ID is required",
        });
      }

      const progress = await LearningPathService.getUserProgress(userId, pathId);

      res.json({
        success: true,
        data: progress,
      });
    } catch (error: any) {
      const statusCode = error.message === "Learning path not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get progress",
      });
    }
  }

  /**
   * POST /api/learning-paths/:pathId/modules/:moduleId/complete
   */
  static async completeModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const { quizScore } = req.body;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!moduleId) {
        return res.status(400).json({
          success: false,
          message: "Module ID is required",
        });
      }

      const completion = await LearningPathService.completeModule({
        userId,
        moduleId,
        quizScore,
      });

      res.json({
        success: true,
        data: completion,
        message: "Module completed successfully",
      });
    } catch (error: any) {
      const statusCode = 
        error.message.includes("not found") ? 404 :
        error.message.includes("already completed") ? 409 : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to complete module",
      });
    }
  }

  /**
   * POST /api/learning-paths/:pathId/enroll
   */
  static async enrollInPath(req: Request, res: Response) {
    try {
      const { pathId } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!pathId) {
        return res.status(400).json({
          success: false,
          message: "Path ID is required",
        });
      }

      const enrollment = await LearningPathService.enrollUser(userId, pathId);

      res.status(201).json({
        success: true,
        message: "Successfully enrolled in learning path! +5 points",
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
   * POST /api/learning-paths/:pathId/modules/:moduleId/submit-quiz
   */
  static async submitQuiz(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const { answers } = req.body;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (!moduleId) {
        return res.status(400).json({
          success: false,
          message: "Module ID is required",
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
          : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to submit quiz",
      });
    }
  }
}
