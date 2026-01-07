import { z } from "zod";
import { NotificationType } from "@prisma/client";

export const CreateNotificationSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
  data: z.record(z.string(), z.any()).optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

export const MarkNotificationReadSchema = z.object({
  notificationId: z.string(),
});

export type MarkNotificationReadInput = z.infer<typeof MarkNotificationReadSchema>;

export interface NotificationWithUser {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

// Point milestone thresholds
export const POINT_MILESTONES = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

export const isPointMilestone = (points: number): boolean => {
  return POINT_MILESTONES.includes(points);
};
