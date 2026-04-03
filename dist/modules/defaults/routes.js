import { Router } from "express";
import { DefaultsController } from "./controller.js";
import { authenticate } from "../../shared/middleware/auth.js";
const router = Router();
/**
 * @swagger
 * /api/defaults:
 *   get:
 *     tags:
 *       - Defaults
 *     summary: Get default schools or regions
 *     description: Retrieve list of default schools or regions based on type parameter
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [school, region]
 *         description: Type of defaults to retrieve
 *         example: school
 *     responses:
 *       200:
 *         description: Defaults retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *             examples:
 *               schools:
 *                 summary: Schools response
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "507f1f77bcf86cd799439011"
 *                       name: "Government Bilingual High School Molyko"
 *                       region: "South West"
 *                       country: "Cameroon"
 *                     - id: "507f1f77bcf86cd799439012"
 *                       name: "Government Technical High School Bamenda"
 *                       region: "North West"
 *                       country: "Cameroon"
 *               regions:
 *                 summary: Regions response
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "507f1f77bcf86cd799439013"
 *                       name: "South West"
 *                       country: "Cameroon"
 *                     - id: "507f1f77bcf86cd799439014"
 *                       name: "North West"
 *                       country: "Cameroon"
 *       400:
 *         description: Invalid or missing type parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid or missing type parameter. Must be 'school' or 'region'"
 */
router.get("/", DefaultsController.getDefaults);
/**
 * @swagger
 * /api/defaults/schools:
 *   get:
 *     tags:
 *       - Defaults
 *     summary: Get all schools
 *     description: Retrieve list of all active schools
 *     responses:
 *       200:
 *         description: Schools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       region:
 *                         type: string
 *                       country:
 *                         type: string
 */
router.get("/schools", DefaultsController.getSchools);
/**
 * @swagger
 * /api/defaults/regions:
 *   get:
 *     tags:
 *       - Defaults
 *     summary: Get all regions
 *     description: Retrieve list of all active regions
 *     responses:
 *       200:
 *         description: Regions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       country:
 *                         type: string
 */
router.get("/regions", DefaultsController.getRegions);
/**
 * @swagger
 * /api/defaults/schools:
 *   post:
 *     tags:
 *       - Defaults
 *     summary: Create a new school (Admin only)
 *     description: Add a new school to the defaults list
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Government Bilingual High School Molyko"
 *               region:
 *                 type: string
 *                 example: "South West"
 *               country:
 *                 type: string
 *                 example: "Cameroon"
 *     responses:
 *       201:
 *         description: School created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/schools", authenticate, DefaultsController.createSchool);
/**
 * @swagger
 * /api/defaults/regions:
 *   post:
 *     tags:
 *       - Defaults
 *     summary: Create a new region (Admin only)
 *     description: Add a new region to the defaults list
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "South West"
 *               country:
 *                 type: string
 *                 example: "Cameroon"
 *     responses:
 *       201:
 *         description: Region created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/regions", authenticate, DefaultsController.createRegion);
/**
 * @swagger
 * /api/defaults/search:
 *   get:
 *     tags:
 *       - Defaults
 *     summary: Search schools or regions
 *     description: Search for schools or regions by name (case-insensitive)
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [school, region]
 *         description: Type of defaults to search
 *         example: school
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (partial match)
 *         example: bilingual
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *                   example: 5
 *             examples:
 *               schools:
 *                 summary: School search results
 *                 value:
 *                   success: true
 *                   count: 3
 *                   data:
 *                     - id: "507f1f77bcf86cd799439011"
 *                       name: "Government Bilingual High School Molyko"
 *                       region: "South West"
 *                       country: "Cameroon"
 *                     - id: "507f1f77bcf86cd799439012"
 *                       name: "Government Bilingual High School Bamenda"
 *                       region: "North West"
 *                       country: "Cameroon"
 *               regions:
 *                 summary: Region search results
 *                 value:
 *                   success: true
 *                   count: 2
 *                   data:
 *                     - id: "507f1f77bcf86cd799439013"
 *                       name: "South West"
 *                       country: "Cameroon"
 *                     - id: "507f1f77bcf86cd799439014"
 *                       name: "North West"
 *                       country: "Cameroon"
 *       400:
 *         description: Invalid or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *             examples:
 *               missingType:
 *                 summary: Missing type parameter
 *                 value:
 *                   success: false
 *                   message: "Invalid or missing type parameter. Must be 'school' or 'region'"
 *               missingQuery:
 *                 summary: Missing query parameter
 *                 value:
 *                   success: false
 *                   message: "Missing or invalid query parameter 'q'"
 */
router.get("/search", DefaultsController.searchDefaults);
export default router;
//# sourceMappingURL=routes.js.map