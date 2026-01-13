import { z } from "zod";
import { NotificationType } from "@prisma/client";
export const CreateNotificationSchema = z.object({
    userId: z.string(),
    type: z.nativeEnum(NotificationType),
    title: z.string().min(1).max(200),
    message: z.string().min(1).max(500),
    data: z.record(z.string(), z.any()).optional(),
});
export const MarkNotificationReadSchema = z.object({
    notificationId: z.string(),
});
// Point milestone thresholds
export const POINT_MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
export const isPointMilestone = (points) => {
    return POINT_MILESTONES.includes(points);
};
//# sourceMappingURL=types.js.map