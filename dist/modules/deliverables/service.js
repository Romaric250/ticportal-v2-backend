import { db } from "../../config/database";
import { DeliverableType, SubmissionStatus, ReviewStatus, DeliverableContentType } from "@prisma/client";
import { POINTS_CONFIG } from "../../shared/constants/points";
// import { sendNotification } from "../../shared/utils/notifications";
// Temporary inline notification function until module is properly resolved
async function sendNotification(data) {
    try {
        const notification = await db.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
            },
        });
        console.log(`📧 Notification sent to ${data.userId}: ${data.title}`);
        return notification;
    }
    catch (error) {
        console.error("Failed to send notification:", error);
    }
}
/**
 * Deliverable Service
 * Handles all deliverable template and submission operations
 */
export class DeliverableService {
    /**
     * Get all deliverable templates
     */
    static async getTemplates(filters) {
        const where = {};
        if (filters?.hackathonId) {
            where.hackathonId = filters.hackathonId;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        const templates = await db.deliverableTemplate.findMany({
            where,
            include: {
                hackathon: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        deliverables: true,
                    },
                },
            },
            orderBy: { dueDate: "asc" },
        });
        return templates;
    }
    /**
     * Get deliverable template by ID
     */
    static async getTemplateById(templateId) {
        const template = await db.deliverableTemplate.findUnique({
            where: { id: templateId },
            include: {
                hackathon: true,
                deliverables: {
                    include: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!template) {
            throw new Error("Template not found");
        }
        return template;
    }
    /**
     * Create deliverable template and auto-create empty deliverables for all teams
     */
    static async createTemplate(data) {
        const template = await db.deliverableTemplate.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                customType: data.customType || null,
                contentType: data.contentType || "TEXT",
                hackathonId: data.hackathonId || null,
                dueDate: data.dueDate,
                required: data.required ?? true,
            },
            include: {
                hackathon: true,
            },
        });
        // Auto-create team deliverables for all teams
        const teams = await db.team.findMany({
            select: { id: true },
        });
        // Create empty deliverable for each team
        const deliverables = await Promise.all(teams.map((team) => db.teamDeliverable.create({
            data: {
                teamId: team.id,
                templateId: template.id,
                type: template.type,
                customType: template.customType,
                contentType: template.contentType,
                content: "",
                submissionStatus: SubmissionStatus.NOT_SUBMITTED,
                reviewStatus: ReviewStatus.PENDING,
            },
        })));
        // TODO: Notify all teams about new requirement
        return template;
    }
    /**
     * Update deliverable template
     */
    static async updateTemplate(templateId, data) {
        const template = await db.deliverableTemplate.findUnique({
            where: { id: templateId },
            include: {
                deliverables: {
                    where: {
                        content: {
                            not: "", // Check if any team has submitted content
                        },
                    },
                },
            },
        });
        if (!template) {
            throw new Error("Template not found");
        }
        // Check if contentType is being changed and there are submissions
        if (data.contentType && data.contentType !== template.contentType) {
            if (template.deliverables.length > 0) {
                throw new Error("Cannot change content type - teams have already submitted content");
            }
        }
        const updated = await db.deliverableTemplate.update({
            where: { id: templateId },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.description && { description: data.description }),
                ...(data.type && { type: data.type }),
                ...(data.customType !== undefined && { customType: data.customType }),
                ...(data.contentType && { contentType: data.contentType }),
                ...(data.dueDate && { dueDate: data.dueDate }),
                ...(data.required !== undefined && { required: data.required }),
            },
            include: {
                hackathon: true,
            },
        });
        // If contentType changed, update all empty team deliverables
        if (data.contentType && data.contentType !== template.contentType) {
            await db.teamDeliverable.updateMany({
                where: {
                    templateId: templateId,
                    content: "", // Only update empty submissions
                },
                data: {
                    contentType: data.contentType,
                },
            });
        }
        return updated;
    }
    /**
     * Delete deliverable template
     */
    static async deleteTemplate(templateId) {
        // Check if template has submissions
        const submissionCount = await db.teamDeliverable.count({
            where: { templateId },
        });
        if (submissionCount > 0) {
            throw new Error("Cannot delete template with existing submissions");
        }
        await db.deliverableTemplate.delete({
            where: { id: templateId },
        });
    }
    /**
     * Get all deliverables (admin view)
     */
    static async getDeliverables(filters) {
        const where = {};
        if (filters?.submissionStatus) {
            where.submissionStatus = filters.submissionStatus;
        }
        if (filters?.reviewStatus) {
            where.reviewStatus = filters.reviewStatus;
        }
        if (filters?.teamId) {
            where.teamId = filters.teamId;
        }
        if (filters?.templateId) {
            where.templateId = filters.templateId;
        }
        const deliverables = await db.teamDeliverable.findMany({
            where,
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        school: true,
                    },
                },
                template: true,
                reviewer: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { submittedAt: "desc" },
        });
        return deliverables;
    }
    /**
     * Upload deliverable for a team (admin action)
     */
    static async uploadDeliverable(data) {
        // Check if team exists
        const team = await db.team.findUnique({
            where: { id: data.teamId },
        });
        if (!team) {
            throw new Error("Team not found");
        }
        // Check if template exists
        const template = await db.deliverableTemplate.findUnique({
            where: { id: data.templateId },
        });
        if (!template) {
            throw new Error("Template not found");
        }
        // Check if already submitted
        const existing = await db.teamDeliverable.findFirst({
            where: {
                teamId: data.teamId,
                templateId: data.templateId,
            },
        });
        if (existing) {
            throw new Error("Team has already submitted this deliverable");
        }
        const deliverable = await db.teamDeliverable.create({
            data: {
                teamId: data.teamId,
                templateId: data.templateId,
                type: template.type,
                customType: template.customType,
                contentType: data.contentType || template.contentType,
                content: data.content,
                description: data.description || null,
                submissionStatus: SubmissionStatus.SUBMITTED,
                reviewStatus: ReviewStatus.PENDING,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        school: true,
                    },
                },
                template: true,
            },
        });
        // TODO: Notify team members
        // TODO: Award 15 points to team members
        return deliverable;
    }
    /**
     * Approve deliverable
     */
    static async approveDeliverable(deliverableId, reviewerId) {
        const deliverable = await db.teamDeliverable.findUnique({
            where: { id: deliverableId },
        });
        if (!deliverable) {
            throw new Error("Deliverable not found");
        }
        // Validate reviewer ID (must be valid MongoDB ObjectID or null)
        let validReviewerId = null;
        if (reviewerId && reviewerId.length === 24) {
            // MongoDB ObjectID is exactly 24 characters (12 bytes hex)
            validReviewerId = reviewerId;
        }
        const updated = await db.teamDeliverable.update({
            where: { id: deliverableId },
            data: {
                reviewStatus: ReviewStatus.APPROVED,
                reviewedAt: new Date(),
                reviewedBy: validReviewerId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        school: true,
                    },
                },
                template: true,
            },
        });
        // 🎯 Award bonus points for approved deliverable (20 points per member)
        try {
            const teamMembers = await db.teamMember.findMany({
                where: { teamId: updated.teamId },
                select: { userId: true },
            });
            await Promise.all(teamMembers.map(async (member) => {
                // Create activity record
                await db.userActivity.create({
                    data: {
                        userId: member.userId,
                        type: "HACKATHON",
                        action: "DELIVERABLE_APPROVED",
                        pointsAwarded: POINTS_CONFIG.HACKATHON.DELIVERABLE_APPROVED,
                        metadata: {
                            deliverableId: updated.id,
                            templateId: updated.templateId,
                            title: updated.template.title,
                            reviewerId,
                        },
                    },
                });
                // 🔔 Send notification
                await sendNotification({
                    userId: member.userId,
                    type: "POINTS_AWARDED",
                    title: "Bonus Points! 🌟",
                    message: `Your deliverable "${updated.template.title}" was approved! You earned ${POINTS_CONFIG.HACKATHON.DELIVERABLE_APPROVED} bonus points!`,
                    metadata: {
                        points: POINTS_CONFIG.HACKATHON.DELIVERABLE_APPROVED,
                        action: "DELIVERABLE_APPROVED",
                        deliverableId: updated.id,
                        reviewStatus: "APPROVED",
                    },
                });
            }));
            console.log(`✅ Awarded ${POINTS_CONFIG.HACKATHON.DELIVERABLE_APPROVED} bonus points to team ${updated.teamId}`);
        }
        catch (error) {
            console.error("Failed to award bonus points:", error);
        }
        return updated;
    }
    /**
     * Reject deliverable with feedback
     */
    static async rejectDeliverable(deliverableId, reason, reviewerId) {
        const deliverable = await db.teamDeliverable.findUnique({
            where: { id: deliverableId },
        });
        if (!deliverable) {
            throw new Error("Deliverable not found");
        }
        if (!reason || reason.trim().length === 0) {
            throw new Error("Rejection reason is required");
        }
        // Validate reviewer ID (must be valid MongoDB ObjectID or null)
        let validReviewerId = null;
        if (reviewerId && reviewerId.length === 24) {
            // MongoDB ObjectID is exactly 24 characters (12 bytes hex)
            validReviewerId = reviewerId;
        }
        const rejected = await db.teamDeliverable.update({
            where: { id: deliverableId },
            data: {
                reviewStatus: ReviewStatus.REJECTED,
                feedback: reason,
                reviewedAt: new Date(),
                reviewedBy: validReviewerId,
            },
            include: {
                team: {
                    select: {
                        id: true,
                        name: true,
                        school: true,
                    },
                },
                template: true,
            },
        });
        // 🔔 Send rejection notification to team
        try {
            const teamMembers = await db.teamMember.findMany({
                where: { teamId: rejected.teamId },
                select: { userId: true },
            });
            await Promise.all(teamMembers.map((member) => sendNotification({
                userId: member.userId,
                type: "DELIVERABLE_REJECTED",
                title: "Deliverable Needs Revision ⚠️",
                message: `"${rejected.template.title}" needs revision. Reason: ${reason}`,
                metadata: {
                    deliverableId: rejected.id,
                    reason: reason,
                },
            })));
        }
        catch (error) {
            console.error("Failed to send rejection notification:", error);
        }
        return rejected;
    }
    /**
     * Get team's deliverables
     */
    static async getTeamDeliverables(teamId) {
        const deliverables = await db.teamDeliverable.findMany({
            where: { teamId },
            include: {
                template: true,
                reviewer: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { submittedAt: "desc" },
        });
        return deliverables;
    }
    /**
     * Submit or update deliverable (student action)
     */
    static async submitDeliverable(data) {
        // Get the deliverable
        const deliverable = await db.teamDeliverable.findUnique({
            where: { id: data.deliverableId },
            include: {
                template: true,
                team: true,
            },
        });
        if (!deliverable) {
            throw new Error("Deliverable not found");
        }
        // Check if deliverable belongs to the team
        if (deliverable.teamId !== data.teamId) {
            throw new Error("Unauthorized: This deliverable belongs to another team");
        }
        // Check if deadline has passed
        const now = new Date();
        if (deliverable.template.dueDate < now) {
            throw new Error("Deadline has passed. Cannot submit or update.");
        }
        // Check if already approved
        if (deliverable.reviewStatus === ReviewStatus.APPROVED) {
            throw new Error("Cannot update approved deliverable");
        }
        // Determine if this is a resubmission after rejection
        const wasRejected = deliverable.reviewStatus === ReviewStatus.REJECTED;
        // Update the deliverable
        const updated = await db.teamDeliverable.update({
            where: { id: data.deliverableId },
            data: {
                content: data.content,
                contentType: data.contentType || deliverable.contentType,
                description: data.description || deliverable.description,
                submissionStatus: SubmissionStatus.SUBMITTED,
                reviewStatus: ReviewStatus.PENDING,
                submittedAt: new Date(),
                reviewedAt: wasRejected ? null : deliverable.reviewedAt,
                reviewedBy: wasRejected ? null : deliverable.reviewedBy,
                feedback: wasRejected ? null : deliverable.feedback,
            },
            include: {
                template: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                        school: true,
                    },
                },
            },
        });
        // 📢 Send submission notification to team
        try {
            const teamMembers = await db.teamMember.findMany({
                where: { teamId: data.teamId },
                select: { userId: true },
            });
            await Promise.all(teamMembers.map((member) => sendNotification({
                userId: member.userId,
                type: "DELIVERABLE_SUBMITTED",
                title: "Deliverable Submitted ✅",
                message: `Your team has submitted "${deliverable.template.title}"`,
                metadata: {
                    deliverableId: deliverable.id,
                    templateId: deliverable.templateId,
                },
            })));
        }
        catch (error) {
            console.error("Failed to send submission notification:", error);
        }
        // 🎯 Award points for deliverable submission (10 points per member)
        try {
            const teamMembers = await db.teamMember.findMany({
                where: { teamId: data.teamId },
                select: { userId: true },
            });
            await Promise.all(teamMembers.map(async (member) => {
                // Create activity record
                await db.userActivity.create({
                    data: {
                        userId: member.userId,
                        type: "HACKATHON",
                        action: "DELIVERABLE_SUBMIT",
                        pointsAwarded: POINTS_CONFIG.HACKATHON.DELIVERABLE_SUBMIT,
                        metadata: {
                            deliverableId: deliverable.id,
                            templateId: deliverable.templateId,
                            title: deliverable.template.title,
                        },
                    },
                });
                // 🔔 Send notification
                await sendNotification({
                    userId: member.userId,
                    type: "POINTS_AWARDED",
                    title: "Points Awarded! 🎉",
                    message: `You earned ${POINTS_CONFIG.HACKATHON.DELIVERABLE_SUBMIT} points for submitting "${deliverable.template.title}"`,
                    metadata: {
                        points: POINTS_CONFIG.HACKATHON.DELIVERABLE_SUBMIT,
                        action: "DELIVERABLE_SUBMIT",
                        deliverableId: deliverable.id,
                    },
                });
            }));
            console.log(`✅ Awarded ${POINTS_CONFIG.HACKATHON.DELIVERABLE_SUBMIT} points to team ${data.teamId}`);
        }
        catch (error) {
            console.error("Failed to award points:", error);
        }
        return updated;
    }
    /**
     * Get deliverable by ID (for viewing before submission)
     */
    static async getDeliverableById(deliverableId, teamId) {
        const deliverable = await db.teamDeliverable.findUnique({
            where: { id: deliverableId },
            include: {
                template: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                reviewer: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!deliverable) {
            throw new Error("Deliverable not found");
        }
        // If teamId is provided, verify ownership
        if (teamId && deliverable.teamId !== teamId) {
            throw new Error("Unauthorized: This deliverable belongs to another team");
        }
        return deliverable;
    }
    /**
     * Check if deadline has passed
     */
    static async checkDeadline(deliverableId) {
        const deliverable = await db.teamDeliverable.findUnique({
            where: { id: deliverableId },
            include: {
                template: true,
            },
        });
        if (!deliverable) {
            throw new Error("Deliverable not found");
        }
        const now = new Date();
        const dueDate = deliverable.template.dueDate;
        const passed = dueDate < now;
        if (!passed) {
            const diff = dueDate.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let timeRemaining = "";
            if (days > 0) {
                timeRemaining = `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
            }
            else {
                timeRemaining = `${hours} hour${hours > 1 ? 's' : ''}`;
            }
            return { passed: false, dueDate, timeRemaining };
        }
        return { passed: true, dueDate };
    }
    /**
     * Delete deliverable submission (reset to empty)
     */
    static async deleteDeliverableSubmission(data) {
        // Get the deliverable
        const deliverable = await db.teamDeliverable.findUnique({
            where: { id: data.deliverableId },
            include: {
                template: true,
            },
        });
        if (!deliverable) {
            throw new Error("Deliverable not found");
        }
        // If not admin, check team ownership
        if (!data.isAdmin && data.teamId && deliverable.teamId !== data.teamId) {
            throw new Error("Unauthorized: This deliverable belongs to another team");
        }
        // If not admin, check approval status
        if (!data.isAdmin) {
            // ...existing deadline check...
            if (deliverable.reviewStatus === ReviewStatus.APPROVED) {
                throw new Error("Cannot delete approved deliverable");
            }
        }
        // Reset the deliverable to empty state
        const reset = await db.teamDeliverable.update({
            where: { id: data.deliverableId },
            data: {
                content: "",
                description: null,
                submissionStatus: SubmissionStatus.NOT_SUBMITTED,
                reviewStatus: ReviewStatus.PENDING,
                feedback: null,
                reviewedAt: null,
                reviewedBy: null,
                submittedAt: new Date(),
            },
            include: {
                template: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                        school: true,
                    },
                },
            },
        });
        return reset;
    }
}
//# sourceMappingURL=service.js.map