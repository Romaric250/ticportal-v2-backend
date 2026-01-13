import bcrypt from "bcrypt";
import { db } from "../../config/database.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt.js";
import { sendEmail } from "../../shared/utils/email.js";
import { logger } from "../../shared/utils/logger.js";
import { activityService } from "../../shared/services/activity.js";
import { NotificationService } from "../notifications/service.js";
export class AuthService {
    static async register(input) {
        logger.info({ email: input.email, role: input.role }, "User registration attempt");
        // Check if user already exists
        const existingUser = await db.user.findUnique({ where: { email: input.email } });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(input.password, 10);
        // Create user account (unverified)
        const user = await db.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone ?? null,
                role: input.role,
                isVerified: false, // User must verify email first
            },
        });
        // Generate and send OTP for email verification
        const code = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await db.oTP.create({
            data: {
                userId: user.id,
                code,
                expiresAt,
                type: "EMAIL_VERIFICATION",
            },
        });
        // Send OTP email
        await sendEmail(user.email, "Verify Your Email - TIC Portal", `Welcome to TIC Portal!\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`);
        logger.info({ userId: user.id, email: user.email }, "User registered, OTP sent");
        // Track registration activity
        await activityService.trackAuthActivity(user.id, "REGISTER", {
            email: user.email,
            role: user.role,
        });
        return {
            message: "Registration successful! Please check your email for verification code.",
            email: user.email,
        };
    }
    static async login(input) {
        logger.info({ email: input.email }, "User login attempt");
        const user = await db.user.findUnique({ where: { email: input.email } });
        if (!user || !(await bcrypt.compare(input.password, user.password))) {
            logger.warn({ email: input.email }, "Invalid login credentials");
            throw new Error("Invalid credentials");
        }
        const accessToken = generateAccessToken({ userId: user.id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user.id });
        // Refresh token expires in 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt,
            },
        });
        // Send login notification
        await NotificationService.notifyLogin(user.id);
        logger.info({ userId: user.id }, "User logged in successfully");
        // Track login activity
        await activityService.trackAuthActivity(user.id, "LOGIN");
        return { user, accessToken, refreshToken };
    }
    static async refreshToken(token) {
        const payload = verifyRefreshToken(token);
        const refreshTokenRecord = await db.refreshToken.findUnique({ where: { token } });
        if (!refreshTokenRecord) {
            throw new Error("Invalid refresh token");
        }
        const accessToken = generateAccessToken({ userId: payload.userId, role: payload.role });
        return { accessToken };
    }
    static async logout(token) {
        await db.refreshToken.delete({ where: { token } });
    }
    static generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    static async sendOtp(input) {
        const user = await db.user.findUnique({ where: { email: input.email } });
        if (!user && input.type === "PASSWORD_RESET") {
            throw new Error("User not found");
        }
        if (user && input.type === "EMAIL_VERIFICATION" && user.isVerified) {
            throw new Error("User already verified");
        }
        const code = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await db.oTP.create({
            data: {
                userId: user?.id || "",
                code,
                expiresAt,
                type: input.type,
            },
        });
        const emailSubject = input.type === "EMAIL_VERIFICATION"
            ? "Verify Your Email - TIC Portal"
            : "Password Reset Code - TIC Portal";
        const emailContent = input.type === "EMAIL_VERIFICATION"
            ? `Your email verification code is: ${code}\n\nThis code will expire in 10 minutes.`
            : `Your password reset code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`;
        await sendEmail(input.email, emailSubject, emailContent);
        logger.info({ email: input.email, type: input.type }, "OTP sent successfully");
        return { message: "OTP sent successfully to your email" };
    }
    static async verifyOtp(input) {
        const user = await db.user.findUnique({ where: { email: input.email } });
        if (!user) {
            throw new Error("User not found");
        }
        const otp = await db.oTP.findFirst({
            where: {
                userId: user.id,
                code: input.code,
                type: input.type,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });
        if (!otp) {
            throw new Error("Invalid or expired OTP");
        }
        // Delete the used OTP
        await db.oTP.delete({ where: { id: otp.id } });
        if (input.type === "EMAIL_VERIFICATION") {
            // Mark user as verified
            await db.user.update({
                where: { id: otp.userId },
                data: { isVerified: true },
            });
            // Generate tokens for the verified user
            const accessToken = generateAccessToken({ userId: user.id, role: user.role });
            const refreshToken = generateRefreshToken({ userId: user.id });
            // Save refresh token
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await db.refreshToken.create({
                data: {
                    userId: user.id,
                    token: refreshToken,
                    expiresAt,
                },
            });
            logger.info({ userId: user.id }, "Email verified successfully");
            // Track email verification activity
            await activityService.trackAuthActivity(user.id, "EMAIL_VERIFICATION");
            return {
                message: "Email verified successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                accessToken,
                refreshToken
            };
        }
        // For PASSWORD_RESET, just return success message
        return { message: "OTP verified successfully" };
    }
    static async resetPassword(input) {
        const user = await db.user.findUnique({ where: { email: input.email } });
        if (!user) {
            throw new Error("User not found");
        }
        // Verify OTP
        const otp = await db.oTP.findFirst({
            where: {
                userId: user.id,
                code: input.code,
                type: "PASSWORD_RESET",
                expiresAt: { gt: new Date() },
            },
        });
        if (!otp) {
            throw new Error("Invalid or expired OTP");
        }
        // Delete the used OTP
        await db.oTP.delete({ where: { id: otp.id } });
        // Update password
        const hashedPassword = await bcrypt.hash(input.newPassword, 10);
        await db.user.update({
            where: { email: input.email },
            data: { password: hashedPassword },
        });
        logger.info({ email: input.email }, "Password reset successfully");
        return { message: "Password reset successfully" };
    }
}
//# sourceMappingURL=service.js.map