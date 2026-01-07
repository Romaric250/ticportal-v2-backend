import { db } from "../../config/database";
import { NotificationType } from "@prisma/client";
import { CreateNotificationInput, POINT_MILESTONES, isPointMilestone } from "./types";
import { logger } from "../../shared/utils/logger";
import { io } from "../../server";
import { emitNotification, emitUnreadCountUpdate } from "../../socket/events/notifications";

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(input: CreateNotificationInput) {
    // Calculate expiration time (30 days default for unread)
    const notification = await db.notification.create({
      data: {
        ...input,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    logger.info(
      { notificationId: notification.id, userId: input.userId, type: input.type },
      "📬 [NOTIFICATION] Created new notification"
    );

    // Emit real-time notification
    if (io) {
      emitNotification(io, input.userId, notification);
      
      // Update unread count
      const unreadCount = await this.getUnreadCount(input.userId);
      emitUnreadCountUpdate(io, input.userId, unreadCount);
    }

    return notification;
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        where: { 
          userId,
          expiresAt: { gt: new Date() }, // Only non-expired
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.notification.count({ 
        where: { 
          userId,
          expiresAt: { gt: new Date() },
        },
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return db.notification.count({
      where: { 
        userId, 
        isRead: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  /**
   * Mark notification as read (and set expiration to 1 minute)
   */
  static async markAsRead(notificationId: string, userId: string) {
    const notification = await db.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    const updatedNotification = await db.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 1000), // Expire in 1 minute
      },
    });

    logger.info(
      { notificationId, userId },
      "✅ [NOTIFICATION] Marked as read - will auto-delete in 1 minute"
    );

    // Update unread count
    if (io) {
      const unreadCount = await this.getUnreadCount(userId);
      emitUnreadCountUpdate(io, userId, unreadCount);
    }

    return updatedNotification;
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    const result = await db.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 1000), // Expire in 1 minute
      },
    });

    logger.info(
      { userId, count: result.count },
      "✅ [NOTIFICATION] Marked all as read - will auto-delete in 1 minute"
    );

    // Update unread count
    if (io) {
      emitUnreadCountUpdate(io, userId, 0);
    }

    return result;
  }

  /**
   * Delete expired notifications (called by cron job)
   */
  static async cleanupExpiredNotifications() {
    const result = await db.notification.deleteMany({
      where: {
        expiresAt: { lte: new Date() },
      },
    });

    if (result.count > 0) {
      logger.info(
        { deletedCount: result.count },
        "🗑️ [NOTIFICATION] Cleaned up expired notifications"
      );
    }

    return result.count;
  }

  /**
   * Delete a specific notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    const notification = await db.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    await db.notification.delete({
      where: { id: notificationId },
    });

    logger.info({ notificationId, userId }, "🗑️ [NOTIFICATION] Deleted notification");
    
    // Update unread count
    if (io && !notification.isRead) {
      const unreadCount = await this.getUnreadCount(userId);
      emitUnreadCountUpdate(io, userId, unreadCount);
    }
  }

  // ========== Specific Notification Creators ==========

  /**
   * Create point milestone notification
   */
  static async notifyPointMilestone(userId: string, points: number, reason: string) {
    if (!isPointMilestone(points)) {
      return; // Not a milestone
    }

    await this.createNotification({
      userId,
      type: NotificationType.POINTS_MILESTONE,
      title: `🎉 Milestone Reached: ${points} Points!`,
      message: `Congratulations! You've reached ${points} points. Keep up the great work!`,
      data: { points, reason },
    });
  }

  /**
   * Create points earned notification (10+ points)
   */
  static async notifyPointsEarned(userId: string, points: number, reason: string) {
    if (points < 10) {
      return; // Only notify for 10+ points
    }

    await this.createNotification({
      userId,
      type: NotificationType.POINTS_EARNED,
      title: `+${points} Points Earned!`,
      message: `You earned ${points} points for: ${reason}`,
      data: { points, reason },
    });
  }

  /**
   * Create team member added notification
   */
  static async notifyTeamMemberAdded(userId: string, teamName: string, teamId: string) {
    await this.createNotification({
      userId,
      type: NotificationType.TEAM_MEMBER_ADDED,
      title: "Added to Team",
      message: `You've been added to ${teamName}`,
      data: { teamId, teamName },
    });
  }

  /**
   * Create team member removed notification
   */
  static async notifyTeamMemberRemoved(userId: string, teamName: string) {
    await this.createNotification({
      userId,
      type: NotificationType.TEAM_MEMBER_REMOVED,
      title: "Removed from Team",
      message: `You've been removed from ${teamName}`,
      data: { teamName },
    });
  }

  /**
   * Create team role updated notification
   */
  static async notifyTeamRoleUpdated(userId: string, teamName: string, newRole: string, teamId: string) {
    await this.createNotification({
      userId,
      type: NotificationType.TEAM_ROLE_UPDATED,
      title: "Team Role Updated",
      message: `Your role in ${teamName} has been updated to ${newRole}`,
      data: { teamId, teamName, newRole },
    });
  }

  /**
   * Create team join request notification (for team leads)
   */
  static async notifyTeamJoinRequest(
    teamLeadId: string,
    requesterName: string,
    teamName: string,
    teamId: string,
    requestId: string
  ) {
    await this.createNotification({
      userId: teamLeadId,
      type: NotificationType.TEAM_JOIN_REQUEST,
      title: "New Team Join Request",
      message: `${requesterName} wants to join ${teamName}`,
      data: { teamId, teamName, requestId, requesterName },
    });
  }

  /**
   * Create team join approved notification
   */
  static async notifyTeamJoinApproved(userId: string, teamName: string, teamId: string) {
    await this.createNotification({
      userId,
      type: NotificationType.TEAM_JOIN_APPROVED,
      title: "Join Request Approved",
      message: `Your request to join ${teamName} has been approved!`,
      data: { teamId, teamName },
    });
  }

  /**
   * Create team join rejected notification
   */
  static async notifyTeamJoinRejected(userId: string, teamName: string) {
    await this.createNotification({
      userId,
      type: NotificationType.TEAM_JOIN_REJECTED,
      title: "Join Request Declined",
      message: `Your request to join ${teamName} was declined`,
      data: { teamName },
    });
  }

  /**
   * Create mentor assigned notification
   */
  static async notifyMentorAssigned(
    userId: string,
    mentorName: string,
    teamName: string,
    teamId: string
  ) {
    await this.createNotification({
      userId,
      type: NotificationType.MENTOR_ASSIGNED,
      title: "Mentor Assigned",
      message: `${mentorName} is now your team's mentor for ${teamName}`,
      data: { teamId, teamName, mentorName },
    });
  }

  /**
   * Create badge earned notification
   */
  static async notifyBadgeEarned(userId: string, badgeName: string, badgeId: string) {
    await this.createNotification({
      userId,
      type: NotificationType.BADGE_EARNED,
      title: "Badge Earned!",
      message: `Congratulations! You've earned the "${badgeName}" badge`,
      data: { badgeId, badgeName },
    });
  }

  /**
   * Create hackathon reminder notification
   */
  static async notifyHackathonReminder(
    userId: string,
    hackathonName: string,
    hackathonId: string,
    daysLeft: number
  ) {
    await this.createNotification({
      userId,
      type: NotificationType.HACKATHON_REMINDER,
      title: "Hackathon Deadline Approaching",
      message: `${hackathonName} submission deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
      data: { hackathonId, hackathonName, daysLeft },
    });
  }

  /**
   * Create stage completed notification
   */
  static async notifyStageCompleted(userId: string, stageName: string, stageId: string) {
    await this.createNotification({
      userId,
      type: NotificationType.STAGE_COMPLETED,
      title: "Stage Completed!",
      message: `Great job! You've completed ${stageName}`,
      data: { stageId, stageName },
    });
  }

  /**
   * Create quiz passed notification
   */
  static async notifyQuizPassed(userId: string, quizName: string, score: number) {
    await this.createNotification({
      userId,
      type: NotificationType.QUIZ_PASSED,
      title: "Quiz Passed!",
      message: `Congratulations! You passed ${quizName} with a score of ${score}%`,
      data: { quizName, score },
    });
  }
}
