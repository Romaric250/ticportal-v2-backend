import type { Request, Response } from "express";
import { UserService } from "./service";
import { UpdateUserSchema, UpdateProfilePhotoSchema } from "./types";

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

  static async updateProfilePhoto(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const input = UpdateProfilePhotoSchema.parse(req.body);
      const user = await UserService.updateProfilePhoto(userId, input);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  static async deleteProfilePhoto(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const user = await UserService.deleteProfilePhoto(userId);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }
}