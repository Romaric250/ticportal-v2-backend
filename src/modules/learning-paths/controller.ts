import type { Request, Response } from "express";
import { LearningPathService } from "./service";
import { LearningPathAudience } from "@prisma/client";

export class LearningPathController {
  /**
   * @swagger
   * /api/learning-paths:
   *   get:
   *     summary: Get all learning paths for authenticated user
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of learning paths with enrollment status
   *       401:
   *         description: User not authenticated
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
   * @swagger
   * /api/learning-paths/{pathId}/enroll:
   *   post:
   *     summary: Enroll in a learning path
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *         description: Learning path ID
   *     responses:
   *       201:
   *         description: Successfully enrolled (+5 points)
   *       409:
   *         description: Already enrolled
   *       404:
   *         description: Learning path not found
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
   * @swagger
   * /api/learning-paths/{pathId}/progress:
   *   get:
   *     summary: Get user's progress in a learning path
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Progress details with completed modules
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
   * @swagger
   * /api/learning-paths/{pathId}/modules/{moduleId}/submit-quiz:
   *   post:
   *     summary: Submit quiz answers and complete module
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: moduleId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - answers
   *             properties:
   *               answers:
   *                 type: array
   *                 items:
   *                   type: number
   *                 description: Array of selected answer indices (0-based)
   *                 example: [0, 2, 1, 3]
   *     responses:
   *       200:
   *         description: Quiz submitted successfully (50-130 points based on score)
   *       409:
   *         description: Module already completed
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

  /**
   * @swagger
   * /api/learning-paths/{pathId}/modules/{moduleId}/complete:
   *   post:
   *     summary: Complete a module without quiz
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: moduleId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Module completed successfully (+50 points)
   *       400:
   *         description: Module has a quiz, use submit-quiz endpoint
   *       409:
   *         description: Module already completed
   */
  static async completeModule(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const userId = (req as any).user?.userId;
      const quizScore = req.body?.quizScore; // Optional from body

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
        message: "Module completed successfully! +50 points",
      });
    } catch (error: any) {
      const statusCode = 
        error.message.includes("not found") ? 404 :
        error.message.includes("already completed") ? 409 :
        error.message.includes("quiz") ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to complete module",
      });
    }
  }

      static async createPath(req:Request, res:Response) {
    }
    /**
     * PUT /api/admin/learning-paths/:pathId
     */
    static async updatePath(req:Request, res:Response) {
    }
    /**
     * DELETE /api/admin/learning-paths/:pathId
     */
    static async deletePath(req:Request, res:Response) {
    }

  /**
   * @swagger
   * /api/admin/learning-paths:
   *   get:
   *     summary: Get all learning paths (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all learning paths
   *   post:
   *     summary: Create a new learning path (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *               - audience
   *             properties:
   *               title:
   *                 type: string
   *                 example: "Introduction to Web Development"
   *               description:
   *                 type: string
   *               audience:
   *                 type: string
   *                 enum: [STUDENT, MENTOR, ALL]
   *               isCore:
   *                 type: boolean
   *                 description: If true, all students are auto-enrolled
   *                 default: true
   *               order:
   *                 type: number
   *     responses:
   *       201:
   *         description: Learning path created (students auto-enrolled if isCore)
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
   * @swagger
   * /api/admin/learning-paths/{pathId}:
   *   get:
   *     summary: Get learning path by ID (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Learning path details
   *   put:
   *     summary: Update learning path (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               isCore:
   *                 type: boolean
   *               order:
   *                 type: number
   *     responses:
   *       200:
   *         description: Learning path updated
   *   delete:
   *     summary: Delete learning path (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Learning path deleted
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
   * @swagger
   * /api/admin/learning-paths/{pathId}/modules:
   *   post:
   *     summary: Add module to learning path (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - content
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *                 description: Markdown content
   *               order:
   *                 type: number
   *               quiz:
   *                 type: object
   *                 properties:
   *                   questions:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         question:
   *                           type: string
   *                         options:
   *                           type: array
   *                           items:
   *                             type: string
   *                         correctAnswer:
   *                           type: number
   *     responses:
   *       201:
   *         description: Module added
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
   * @swagger
   * /api/admin/learning-paths/{pathId}/modules/{moduleId}:
   *   put:
   *     summary: Update module (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: moduleId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               content:
   *                 type: string
   *               order:
   *                 type: number
   *               quiz:
   *                 type: object
   *     responses:
   *       200:
   *         description: Module updated
   *   delete:
   *     summary: Delete module (Admin)
   *     tags: [Admin - Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: moduleId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Module deleted
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
   * @swagger
   * /api/learning-paths/{pathId}/modules/{moduleId}/status:
   *   get:
   *     summary: Get module completion status
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: moduleId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Module completion status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     isCompleted:
   *                       type: boolean
   *                     completedAt:
   *                       type: string
   *                       format: date-time
   *                     quizScore:
   *                       type: number
   *       404:
   *         description: Module not found
   */
  static async getModuleStatus(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
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

      const status = await LearningPathService.getModuleStatus(userId, moduleId);

      res.json({
        success: true,
        data: status,
      });
    } catch (error: any) {
      const statusCode = error.message === "Module not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get module status",
      });
    }
  }

  /**
   * @swagger
   * /api/learning-paths/{pathId}/modules:
   *   get:
   *     summary: Get all modules with completion status for a learning path
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of modules with completion status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       title:
   *                         type: string
   *                       content:
   *                         type: string
   *                       order:
   *                         type: number
   *                       hasQuiz:
   *                         type: boolean
   *                       isCompleted:
   *                         type: boolean
   *                       completedAt:
   *                         type: string
   *                         format: date-time
   *                       quizScore:
   *                         type: number
   *       404:
   *         description: Learning path not found
   */
  static async getPathModules(req: Request, res: Response) {
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

      const modules = await LearningPathService.getPathModulesWithStatus(userId, pathId);

      res.json({
        success: true,
        data: modules,
      });
    } catch (error: any) {
      const statusCode = error.message === "Learning path not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get modules",
      });
    }
  }

  /**
   * @swagger
   * /api/learning-paths/{pathId}/complete:
   *   post:
   *     summary: Complete a learning path (all modules must be done)
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Learning path completed successfully (+200 points)
   *       400:
   *         description: Not all modules completed yet
   *       404:
   *         description: Learning path not found
   */
  static async completeLearningPath(req: Request, res: Response) {
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

      const result = await LearningPathService.completeLearningPath(userId, pathId);

      res.json({
        success: true,
        data: result,
        message: `Congratulations! Learning path completed! +${result.pointsAwarded} points 🎉`,
      });
    } catch (error: any) {
      const statusCode = 
        error.message === "Learning path not found" ? 404 :
        error.message.includes("not all modules") ? 400 : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to complete learning path",
      });
    }
  }

  /**
   * @swagger
   * /api/learning-paths/{pathId}/unenroll:
   *   delete:
   *     summary: Unenroll from learning path and delete all progress
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: pathId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully unenrolled and progress deleted
   *       404:
   *         description: Not enrolled in this learning path
   */
  static async unenrollFromPath(req: Request, res: Response) {
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

      await LearningPathService.unenrollFromPath(userId, pathId);

      res.json({
        success: true,
        message: "Successfully unenrolled. All progress has been deleted.",
      });
    } catch (error: any) {
      const statusCode = error.message === "Not enrolled in this learning path" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to unenroll",
      });
    }
  }

  /**
   * @swagger
   * /api/learning-paths/enrollments:
   *   get:
   *     summary: Get enrollment status for all learning paths
   *     tags: [Learning Paths]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all paths with enrollment status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       pathId:
   *                         type: string
   *                       pathTitle:
   *                         type: string
   *                       isEnrolled:
   *                         type: boolean
   *                       isAutoEnrolled:
   *                         type: boolean
   *                       enrolledAt:
   *                         type: string
   *                         format: date-time
   *                       isCompleted:
   *                         type: boolean
   *                       completedAt:
   *                         type: string
   *                         format: date-time
   */
  static async getAllEnrollmentStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const enrollments = await LearningPathService.getAllEnrollmentStatus(userId);

      res.json({
        success: true,
        data: enrollments,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get enrollment status",
      });
    }
  }
}
