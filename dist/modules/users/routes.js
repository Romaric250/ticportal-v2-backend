import { Router } from "express";
import { UserController } from "./controller.js";
const router = Router();
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - User Profile
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     bio:
 *                       type: string
 *                       example: "Software developer"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     profilePhoto:
 *                       type: string
 *                       example: "https://utfs.io/f/abc123.jpg"
 *                     school:
 *                       type: string
 *                       example: "Tech University"
 *                     grade:
 *                       type: string
 *                       example: "Senior"
 *                     country:
 *                       type: string
 *                       example: "USA"
 *                     gradDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-05-15T00:00:00.000Z"
 *                     role:
 *                       type: string
 *                       example: "STUDENT"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: "Unauthorized"
 */
router.get("/profile", UserController.getProfile);
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags:
 *       - User Profile
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: "johndoe"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Software developer passionate about tech"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               school:
 *                 type: string
 *                 example: "MIT"
 *               grade:
 *                 type: string
 *                 example: "Senior"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               gradDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-15T00:00:00.000Z"
 *           examples:
 *             basic:
 *               summary: Basic profile update
 *               value:
 *                 username: "johndoe"
 *                 bio: "Tech enthusiast"
 *             full:
 *               summary: Full profile update
 *               value:
 *                 username: "johndoe"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 bio: "Software developer passionate about tech education"
 *                 school: "MIT"
 *                 grade: "Senior"
 *                 country: "USA"
 *                 gradDate: "2026-05-15T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Updated user profile
 *       400:
 *         description: Validation error
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
 *               invalidUsername:
 *                 summary: Invalid username
 *                 value:
 *                   success: false
 *                   message: "Username must be between 3 and 30 characters"
 *               bioTooLong:
 *                 summary: Bio too long
 *                 value:
 *                   success: false
 *                   message: "Bio must not exceed 500 characters"
 *       409:
 *         description: Conflict - Username already taken
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
 *                   example: "Username already taken"
 *       401:
 *         description: Unauthorized
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
 *                   example: "Unauthorized"
 */
router.put("/profile", UserController.updateProfile);
/**
 * @swagger
 * /api/users/profile-photo:
 *   put:
 *     tags:
 *       - User Profile
 *     summary: Update profile photo
 *     description: Upload a new profile photo (base64 encoded)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profilePhoto
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: byte
 *                 description: Base64 encoded image with data URL prefix (data:image/jpeg;base64,...)
 *                 example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
 *     responses:
 *       200:
 *         description: Profile photo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     profilePhoto:
 *                       type: string
 *                       example: "https://utfs.io/f/profile-abc123.jpg"
 *       400:
 *         description: Validation error
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
 *               invalidFormat:
 *                 summary: Invalid image format
 *                 value:
 *                   success: false
 *                   message: "Invalid image format. Only PNG, JPEG, and GIF are allowed"
 *               tooLarge:
 *                 summary: Image too large
 *                 value:
 *                   success: false
 *                   message: "Image size (5.2MB) exceeds 4MB limit"
 *       401:
 *         description: Unauthorized
 */
router.put("/profile-photo", UserController.updateProfilePhoto);
/**
 * @swagger
 * /api/users/profile-photo:
 *   delete:
 *     tags:
 *       - User Profile
 *     summary: Delete profile photo
 *     description: Remove the user's profile photo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Updated user profile without photo
 *       400:
 *         description: No profile photo to delete
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
 *                   example: "No profile photo to delete"
 *       401:
 *         description: Unauthorized
 */
router.delete("/profile-photo", UserController.deleteProfilePhoto);
/**
 * @swagger
 * /api/users/search:
 *   get:
 *     tags:
 *       - User Search
 *     summary: Search for users
 *     description: Search for users by name, email, username, or school with optional type filter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (name, email, username, or school)
 *         example: "John"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [user, mentor]
 *         description: Filter by user type (user=STUDENT, mentor=MENTOR)
 *         example: "mentor"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Search results
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
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       username:
 *                         type: string
 *                       profilePhoto:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       school:
 *                         type: string
 *                       role:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request - Invalid search parameters
 */
router.get("/search", UserController.searchUsers);
export default router;
//# sourceMappingURL=routes.js.map