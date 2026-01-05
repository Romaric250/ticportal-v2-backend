import { Router } from "express";
import { TeamController } from "./controller";
import { cacheMiddleware } from "../../shared/middleware/cache";
import { authenticate } from "../../shared/middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams (paginated)
 *     tags: [Teams]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 */
router.get("/", cacheMiddleware(300), TeamController.getTeams);

/**
 * @swagger
 * /api/teams/my:
 *   get:
 *     summary: Get current user's teams
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User teams retrieved successfully
 */
router.get("/my", authenticate, TeamController.getUserTeams);

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
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
 *               - squadId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               squadId:
 *                 type: string
 *               projectTitle:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Team created successfully
 *       403:
 *         description: User not a member of the squad
 */
router.post("/", authenticate, TeamController.createTeam);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team retrieved successfully
 *       404:
 *         description: Team not found
 */
router.get("/:teamId", cacheMiddleware(60), TeamController.getTeamById);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   put:
 *     summary: Update team details
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: Only team leads can update
 */
router.put("/:teamId", authenticate, TeamController.updateTeam);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       403:
 *         description: Only team leads can delete
 */
router.delete("/:teamId", authenticate, TeamController.deleteTeam);

/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   post:
 *     summary: Add a member to the team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
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
 *                 enum: [MEMBER, LEAD]
 *                 default: MEMBER
 *     responses:
 *       201:
 *         description: Member added successfully
 *       403:
 *         description: Only team leads can add members
 */
router.post("/:teamId/members", authenticate, TeamController.addTeamMember);

/**
 * @swagger
 * /api/teams/{teamId}/members/{memberId}/role:
 *   put:
 *     summary: Update team member role
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
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
 *                 enum: [MEMBER, LEAD]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Only team leads can update roles
 */
router.put("/:teamId/members/:memberId/role", authenticate, TeamController.updateTeamMemberRole);

/**
 * @swagger
 * /api/teams/{teamId}/members/{memberId}:
 *   delete:
 *     summary: Remove a team member
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       403:
 *         description: Unauthorized
 */
router.delete("/:teamId/members/:memberId", authenticate, TeamController.removeTeamMember);

/**
 * @swagger
 * /api/teams/{teamId}/chats:
 *   get:
 *     summary: Get team chat messages
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
 *       403:
 *         description: Not a team member
 */
router.get("/:teamId/chats", authenticate, TeamController.getTeamChats);

/**
 * @swagger
 * /api/teams/{teamId}/chats:
 *   post:
 *     summary: Send a team chat message
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 maxItems: 5
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       403:
 *         description: Not a team member
 */
router.post("/:teamId/chats", authenticate, TeamController.sendTeamChatMessage);

export default router;
