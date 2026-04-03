import type { Request, Response } from "express";
export declare class LearningPathController {
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
    static getPathsForUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static enrollInPath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static getUserProgress(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static submitQuiz(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static completeModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createPath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/admin/learning-paths/:pathId
     */
    static updatePath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/learning-paths/:pathId
     */
    static deletePath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static getAllPaths(req: Request, res: Response): Promise<void>;
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
    static getPathById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static addModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static updateModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/learning-paths/:pathId/modules/:moduleId
     */
    static deleteModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static getModuleStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static getPathModules(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static completeLearningPath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static unenrollFromPath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    static getAllEnrollmentStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @swagger
     * /api/learning-paths/calculate-progress:
     *   get:
     *     summary: Calculate user progress for all enrolled learning paths
     *     tags: [Learning Paths]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Progress calculation for all enrolled paths
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
     *                       totalModules:
     *                         type: number
     *                       completedModules:
     *                         type: number
     *                       progressPercentage:
     *                         type: number
     *                       isCompleted:
     *                         type: boolean
     */
    static calculateProgress(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map