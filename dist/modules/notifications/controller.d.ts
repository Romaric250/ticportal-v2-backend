import type { Request, Response } from "express";
export declare class NotificationController {
    static getNotifications(req: Request, res: Response): Promise<void>;
    static getUnreadCount(req: Request, res: Response): Promise<void>;
    static markAsRead(req: Request, res: Response): Promise<void>;
    static markAllAsRead(req: Request, res: Response): Promise<void>;
    static deleteNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map