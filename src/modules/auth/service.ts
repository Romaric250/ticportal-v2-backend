import bcrypt from "bcrypt";
import { db } from "../../config/database";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt";
import { sendEmail } from "../../shared/utils/email";
import { logger } from "../../shared/utils/logger";
import type { RegisterInput, LoginInput, SendOtpInput, VerifyOtpInput, ResetPasswordInput } from "./types";

export class AuthService {
  static async register(input: RegisterInput) {
    logger.info({ email: input.email, role: input.role }, "User registration attempt");

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await db.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        schoolName: input.schoolName,
        phone: input.phone ?? null,
        role: input.role,
      },
    });

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

    logger.info({ userId: user.id }, "User registered successfully");

    return { user, accessToken, refreshToken };
  }

  static async login(input: LoginInput) {
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

    logger.info({ userId: user.id }, "User logged in successfully");

    return { user, accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);
    const refreshTokenRecord = await db.refreshToken.findUnique({ where: { token } });
    if (!refreshTokenRecord) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = generateAccessToken({ userId: payload.userId, role: payload.role });
    return { accessToken };
  }

  static async logout(token: string) {
    await db.refreshToken.delete({ where: { token } });
  }

  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOtp(input: SendOtpInput) {
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

    await sendEmail(input.email, `OTP for ${input.type}`, `Your OTP is ${code}`);
  }

  static async verifyOtp(input: VerifyOtpInput) {
    const otp = await db.oTP.findFirst({
      where: {
        code: input.code,
        type: input.type,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!otp) {
      throw new Error("Invalid or expired OTP");
    }

    if (input.type === "EMAIL_VERIFICATION") {
      await db.user.update({
        where: { id: otp.userId },
        data: { isVerified: true },
      });
    }

    await db.oTP.delete({ where: { id: otp.id } });
  }

  static async resetPassword(input: ResetPasswordInput) {
    await this.verifyOtp({ email: input.email, code: input.code, type: "PASSWORD_RESET" });

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    await db.user.update({
      where: { email: input.email },
      data: { password: hashedPassword },
    });
  }
}