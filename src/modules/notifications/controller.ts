import type { Request, Response } from "express";
import { NotificationService } from "./service";
import { MarkNotificationReadSchema } from "./types";

export class NotificationController {
  static async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await NotificationService.getUserNotifications(userId, page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).userId as string;
      const count = await NotificationService.getUnreadCount(userId);
      res.json({ success: true, count });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).userId as string;
      const { notificationId } = MarkNotificationReadSchema.parse(req.body);

      const notification = await NotificationService.markAsRead(notificationId, userId);
      res.json({ success: true, data: notification });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }

  static async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).userId as string;
      const result = await NotificationService.markAllAsRead(userId);
      res.json({ success: true, data: { count: result.count } });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  static async deleteNotification(req: Request, res: Response) {
    try {
      const userId = (req as any).userId as string;
      const { notificationId } = req.params;

      if (!notificationId) {
        return res.status(400).json({ success: false, message: "Notification ID is required" });
      }

      await NotificationService.deleteNotification(notificationId, userId);
      res.json({ success: true, message: "Notification deleted" });
    } catch (error) {
      res.status(400).json({ success: false, message: (error as Error).message });
    }
  }
}
