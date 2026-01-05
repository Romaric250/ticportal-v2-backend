import type { Request, Response } from "express";
import { UserService } from "./service";
import { UpdateUserSchema, UpdateProfilePhotoSchema, SearchUsersSchema } from "./types";
import { logger } from "../../shared/utils/logger";

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
      
      logger.info({ userId }, "Starting profile photo update");
      
      const input = UpdateProfilePhotoSchema.parse(req.body);
      
      logger.info({ userId, inputLength: input.profilePhoto?.length }, "Input parsed, uploading to UploadThing");
      
      const user = await UserService.updateProfilePhoto(userId, input);
      
      logger.info({ userId, profilePhoto: user.profilePhoto }, "Profile photo updated successfully");
      
      res.json({ success: true, data: user });
    } catch (error) {
      logger.error({ error, userId: (req as any).user?.userId }, "Profile photo update failed");
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

  static async searchUsers(req: Request, res: Response) {
    try {
      const { q, type, page, limit } = req.query;
      
      const input = SearchUsersSchema.parse({
        query: q,
        type: type as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });

      const result = await UserService.searchUsers(input);
      res.json({ success: true, data: result.users, pagination: result.pagination });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }
}