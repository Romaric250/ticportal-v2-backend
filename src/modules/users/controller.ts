import type { Request, Response } from "express";
import { UserService } from "./service";
import { UpdateUserSchema } from "./types";

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId; // Assume auth middleware sets req.user
      const user = await UserService.getProfile(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: { message: "User not found" } });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: (error as Error).message } });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const input = UpdateUserSchema.parse(req.body);
      const user = await UserService.updateProfile(userId, input);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: { message: (error as Error).message } });
    }
  }
}