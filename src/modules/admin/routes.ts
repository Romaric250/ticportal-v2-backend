import { Router } from "express";
import { AdminController } from "./controller";
import type { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";

const router = Router();

// TEMPORARY: Bypass authentication for testing
// TODO: Add proper authentication middleware
// router.use(authenticate);

// TEMPORARY: Bypass admin check for testing
// const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user) {
//     return res.status(401).json({
//       success: false,
//       message: "Authentication required",
//     });
//   }
  
//   const userRole = (req.user as any).role;
//   if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
//     return res.status(403).json({
//       success: false,
//       message: "Admin access required",
//     });
//   }
  
//   next();
// };

// router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard statistics
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/stats", AdminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/dashboard-stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get detailed dashboard statistics with charts data
 *     responses:
 *       200:
 *         description: Detailed statistics
 */
router.get("/dashboard-stats", AdminController.getDetailedDashboardStats);

// User Management
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin - Users]
 *     summary: Get users with pagination and filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", AdminController.getUsers);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   get:
 *     tags: [Admin - Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/users/:userId", AdminController.getUserById);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     tags: [Admin - Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *               school:
 *                 type: string
 *               region:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 */
router.post("/users", AdminController.createUser);

/**
 * @swagger
 * /api/admin/users/import:
 *   post:
 *     tags: [Admin - Users]
 *     summary: Import users from CSV
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Users imported successfully
 */
router.post("/users/import", AdminController.importUsersCSV);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   put:
 *     tags: [Admin - Users]
 *     summary: Update user details
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               role:
 *                 type: string
 *               status:
 *                 type: string
 *               school:
 *                 type: string
 *               region:
 *                 type: string
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/users/:userId", AdminController.updateUser);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     tags: [Admin - Users]
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/users/:userId", AdminController.deleteUser);

// Team Management
/**
 * @swagger
 * /api/admin/teams:
 *   get:
 *     tags: [Admin - Teams]
 *     summary: Get teams with pagination and filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: school
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of teams
 */
router.get("/teams", AdminController.getTeams);

/**
 * @swagger
 * /api/admin/teams/{teamId}:
 *   get:
 *     tags: [Admin - Teams]
 *     summary: Get team by ID
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team details
 *       404:
 *         description: Team not found
 */
router.get("/teams/:teamId", AdminController.getTeamById);

/**
 * @swagger
 * /api/admin/teams/{teamId}:
 *   put:
 *     tags: [Admin - Teams]
 *     summary: Update team details
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *               name:
 *                 type: string
 *               projectTitle:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 */
router.put("/teams/:teamId", AdminController.updateTeam);

/**
 * @swagger
 * /api/admin/teams/{teamId}:
 *   delete:
 *     tags: [Admin - Teams]
 *     summary: Delete a team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       400:
 *         description: Cannot delete team with submissions
 */
router.delete("/teams/:teamId", AdminController.deleteTeam);

/**
 * @swagger
 * /api/admin/teams/{teamId}/members:
 *   get:
 *     tags: [Admin - Teams]
 *     summary: Get team members
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of team members
 */
router.get("/teams/:teamId/members", AdminController.getTeamMembers);

/**
 * @swagger
 * /api/admin/teams/{teamId}/members:
 *   post:
 *     tags: [Admin - Teams]
 *     summary: Add member to team
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *                 default: MEMBER
 *     responses:
 *       201:
 *         description: Member added successfully
 */
router.post("/teams/:teamId/members", AdminController.addTeamMember);

/**
 * @swagger
 * /api/admin/teams/{teamId}/members/{userId}:
 *   put:
 *     tags: [Admin - Teams]
 *     summary: Update team member role
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member role updated
 */
router.put("/teams/:teamId/members/:userId", AdminController.updateTeamMemberRole);

/**
 * @swagger
 * /api/admin/teams/{teamId}/members/{userId}:
 *   delete:
 *     tags: [Admin - Teams]
 *     summary: Remove member from team
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 */
router.delete("/teams/:teamId/members/:userId", AdminController.removeTeamMember);

/**
 * @swagger
 * /api/admin/teams/{teamId}/submissions:
 *   get:
 *     tags: [Admin - Teams]
 *     summary: Get team submissions
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of submissions
 */
router.get("/teams/:teamId/submissions", AdminController.getTeamSubmissions);

export default router;
