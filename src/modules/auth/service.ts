import bcrypt from "bcrypt";
import { prisma } from "../../config/database";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt";
import type { RegisterInput, LoginInput } from "./types";

export class AuthService {
  static async register(input: RegisterInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: input.role,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
      },
    });

    return { user, accessToken, refreshToken };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
      },
    });

    return { user, accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);
    const refreshTokenRecord = await prisma.refreshToken.findUnique({ where: { token } });
    if (!refreshTokenRecord) {
      throw new Error("Invalid refresh token");
    }

    const accessToken = generateAccessToken({ userId: payload.userId, role: payload.role });
    return { accessToken };
  }

  static async logout(token: string) {
    await prisma.refreshToken.delete({ where: { token } });
  }
}