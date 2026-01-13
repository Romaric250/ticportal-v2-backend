import { NotificationService } from "./service";
import { MarkNotificationReadSchema } from "./types";
export class NotificationController {
    static async getNotifications(req, res) {
        try {
            const userId = req.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await NotificationService.getUserNotifications(userId, page, limit);
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getUnreadCount(req, res) {
        try {
            const userId = req.userId;
            const count = await NotificationService.getUnreadCount(userId);
            res.json({ success: true, count });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async markAsRead(req, res) {
        try {
            const userId = req.userId;
            const { notificationId } = MarkNotificationReadSchema.parse(req.body);
            const notification = await NotificationService.markAsRead(notificationId, userId);
            res.json({ success: true, data: notification });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    static async markAllAsRead(req, res) {
        try {
            const userId = req.userId;
            const result = await NotificationService.markAllAsRead(userId);
            res.json({ success: true, data: { count: result.count } });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async deleteNotification(req, res) {
        try {
            const userId = req.userId;
            const { notificationId } = req.params;
            if (!notificationId) {
                return res.status(400).json({ success: false, message: "Notification ID is required" });
            }
            await NotificationService.deleteNotification(notificationId, userId);
            res.json({ success: true, message: "Notification deleted" });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
//# sourceMappingURL=controller.js.map