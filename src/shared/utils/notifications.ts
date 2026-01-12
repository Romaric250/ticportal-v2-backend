import { db } from "../../config/database";
import { io } from "../../server";
import type { NotificationType } from "@prisma/client";

/**
 * Send notification to user
 * Creates notification in DB and emits via Socket.io
 */
export async function sendNotification(data: {
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  metadata?: any;
}) {
  try {
    // Create notification in database
    const notification = await db.notification.create({
      data: {
        userId: data.userId,
        type: data.type as NotificationType,
        title: data.title,
        message: data.message,
      },
    });

    // Emit to user via Socket.io
    io.to(data.userId).emit("notification", {
      ...notification,
      metadata: data.metadata,
    });

    return notification;
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
}

/**
 * Send notification to multiple users
 */
export async function sendNotificationToMultiple(
  userIds: string[],
  data: {
    type: string;
    title: string;
    message: string;
    metadata?: any;
  }
) {
  try {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        sendNotification({
          userId,
          ...data,
        })
      )
    );

    return notifications;
  } catch (error) {
    console.error("Failed to send notifications:", error);
    throw error;
  }
}
