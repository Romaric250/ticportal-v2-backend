/**
 * @swagger
 * /api/learning-paths:
 *   get:
 *     summary: Get all learning paths for user
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of learning paths
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
 *                       description:
 *                         type: string
 *                       isCore:
 *                         type: boolean
 *                       isEnrolled:
 *                         type: boolean
 *                       progress:
 *                         type: object
 *                         properties:
 *                           completedModules:
 *                             type: number
 *                           totalModules:
 *                             type: number
 *                           percentComplete:
 *                             type: number
 */
export {};
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
 *     responses:
 *       201:
 *         description: Successfully enrolled (+5 points)
 *       409:
 *         description: Already enrolled
 */
/**
 * @swagger
 * /api/learning-paths/{pathId}/progress:
 *   get:
 *     summary: Get user's progress for a learning path
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
 *         description: Progress details
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
 *                     completedModules:
 *                       type: number
 *                     totalModules:
 *                       type: number
 *                     percentComplete:
 *                       type: number
 *                     modules:
 *                       type: array
 *                       items:
 *                         type: object
 */
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
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Array of selected answer indices
 *                 example: [0, 2, 1, 3]
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     quizScore:
 *                       type: number
 *                     pointsAwarded:
 *                       type: number
 *                       description: 50-130 points (50 base + 30 for pass + 50 for perfect)
 *                     passed:
 *                       type: boolean
 *       409:
 *         description: Module already completed
 */
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
 *         description: Module completed (+50 points)
 *       400:
 *         description: Module has a quiz, use submit-quiz endpoint
 *       409:
 *         description: Module already completed
 */
/**
 * @swagger
 * /api/learning-paths/enrolled:
 *   get:
 *     summary: Get user's enrolled learning paths
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled paths with progress
 */
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
 *               description:
 *                 type: string
 *               audience:
 *                 type: string
 *                 enum: [STUDENT, MENTOR, ALL]
 *               isCore:
 *                 type: boolean
 *                 description: Auto-enroll all students if true
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Learning path created (students auto-enrolled if isCore=true)
 */
/**
 * @swagger
 * /api/admin/learning-paths/{pathId}:
 *   put:
 *     summary: Update a learning path (Admin)
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
 *     summary: Delete a learning path (Admin)
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
/**
 * @swagger
 * /api/admin/learning-paths/{pathId}/modules:
 *   post:
 *     summary: Add a module to learning path (Admin)
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
 *                           description: Index of correct answer (0-based)
 *     responses:
 *       201:
 *         description: Module added successfully
 */
/**
 * @swagger
 * /api/admin/learning-paths/{pathId}/modules/{moduleId}:
 *   put:
 *     summary: Update a module (Admin)
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
 *       required: true
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
 *     summary: Delete a module (Admin)
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
//# sourceMappingURL=swagger.js.map