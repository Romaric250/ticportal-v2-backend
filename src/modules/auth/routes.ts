import { Router } from "express";
import { AuthController } from "./controller";
import { authRateLimit } from "../../shared/middleware/rateLimit";

const router = Router();

router.use(authRateLimit);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               role: { type: string, enum: [STUDENT, MENTOR, JUDGE, SQUAD_LEAD, ADMIN, SUPER_ADMIN] }
 *     responses:
 *       201:
 *         description: User registered
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post("/refresh", AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post("/logout", AuthController.logout);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP for verification or reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               type: { type: string, enum: [EMAIL_VERIFICATION, PASSWORD_RESET] }
 *     responses:
 *       200:
 *         description: OTP sent
 */
router.post("/send-otp", AuthController.sendOtp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               code: { type: string }
 *               type: { type: string, enum: [EMAIL_VERIFICATION, PASSWORD_RESET] }
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post("/verify-otp", AuthController.verifyOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               code: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password reset
 */
router.post("/reset-password", AuthController.resetPassword);

export default router;