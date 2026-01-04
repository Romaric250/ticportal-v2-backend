import { db } from "../../config/database";
import type { UpdateUserInput } from "./types";

export class UserService {
  static async getProfile(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });
  }

  static async updateProfile(userId: string, input: UpdateUserInput) {
    return await db.user.update({
      where: { id: userId },
      data: input,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });
  }
}