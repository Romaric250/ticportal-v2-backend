import { db } from "../../config/database";
import { DeliverableType, DeliverableStatus, DeliverableContentType } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export class DeliverableService {
  /**
   * Get all deliverable templates
   */
  static async getTemplates(filters?: {
    hackathonId?: string;
    type?: DeliverableType;
  }) {
    const where: Prisma.DeliverableTemplateWhereInput = {};

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
   * Get single template
   */
  static async getTemplateById(templateId: string) {
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
   * Create deliverable template
   */
  static async createTemplate(data: {
    title: string;
    description: string;
    type: DeliverableType;
    customType?: string;
    contentType?: string; // Will be "FILE", "URL", or "TEXT"
    hackathonId?: string;
    dueDate: Date;
    required?: boolean;
  }) {
    const template = await db.deliverableTemplate.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        customType: data.customType || null,
        contentType: (data.contentType as any) || "TEXT",
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

    // Create empty deliverable entry for each team
    const teamDeliverables = teams.map((team) => ({
      teamId: team.id,
      templateId: template.id,
      type: template.type,
      customType: (template as any).customType || null,
      contentType: (template as any).contentType || "TEXT",
      content: "", // Empty initially, teams will fill it
      status: DeliverableStatus.PENDING,
    }));

    // Bulk create team deliverables
    if (teamDeliverables.length > 0) {
      await db.teamDeliverable.createMany({
        data: teamDeliverables as any,
      });
    }

    // TODO: Notify all teams about new requirement

    return template;
  }

  /**
   * Update deliverable template
   */
  static async updateTemplate(templateId: string, data: {
    title?: string;
    description?: string;
    type?: DeliverableType;
    customType?: string;
    contentType?: string;
    dueDate?: Date;
    required?: boolean;
  }) {
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
    if (data.contentType && data.contentType !== (template as any).contentType) {
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
        ...(data.contentType && { contentType: data.contentType as any }),
        ...(data.dueDate && { dueDate: data.dueDate }),
        ...(data.required !== undefined && { required: data.required }),
      },
      include: {
        hackathon: true,
      },
    });

    // If contentType changed, update all empty team deliverables
    if (data.contentType && data.contentType !== (template as any).contentType) {
      await db.teamDeliverable.updateMany({
        where: {
          templateId: templateId,
          content: "", // Only update empty submissions
        },
        data: {
          contentType: data.contentType as any,
        },
      });
    }

    return updated;
  }

  /**
   * Delete deliverable template
   */
  static async deleteTemplate(templateId: string) {
    // Check if template has submissions
    const submissionCount = await db.teamDeliverable.count({
      where: { templateId },
    });

    if (submissionCount > 0) {
      throw new Error(
        "Cannot delete template with existing submissions"
      );
    }

    await db.deliverableTemplate.delete({
      where: { id: templateId },
    });
  }

  /**
   * Get all team deliverables (submissions) with filters
   */
  static async getDeliverables(filters: {
    status?: DeliverableStatus;
    hackathonId?: string;
    teamId?: string;
    search?: string;
  }) {
    const where: Prisma.TeamDeliverableWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.teamId) {
      where.teamId = filters.teamId;
    }

    if (filters.hackathonId) {
      where.template = {
        hackathonId: filters.hackathonId,
      };
    }

    if (filters.search) {
      where.OR = [
        { team: { name: { contains: filters.search, mode: "insensitive" } } },
        { team: { projectTitle: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    const deliverables = await db.teamDeliverable.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            projectTitle: true,
          },
        },
        template: {
          select: {
            id: true,
            title: true,
            type: true,
            dueDate: true,
          },
        },
        reviewer: {
          select: {
            id: true,
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
   * Upload deliverable for team (admin upload)
   */
  static async uploadDeliverable(data: {
    teamId: string;
    templateId: string;
    content: string; // File URL, external URL, or text content
    contentType?: string; // "FILE", "URL", or "TEXT"
    description?: string;
  }) {
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
        customType: (template as any).customType || null,
        contentType: (data.contentType as any) || (template as any).contentType || "TEXT",
        content: data.content,
        description: data.description || null,
        status: DeliverableStatus.PENDING,
      },
      include: {
        team: true,
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
  static async approveDeliverable(deliverableId: string, reviewerId?: string) {
    const deliverable = await db.teamDeliverable.findUnique({
      where: { id: deliverableId },
    });

    if (!deliverable) {
      throw new Error("Deliverable not found");
    }

    // Validate reviewer ID (must be valid MongoDB ObjectID or null)
    let validReviewerId: string | null = null;
    if (reviewerId && reviewerId.length === 24) {
      // MongoDB ObjectID is exactly 24 characters (12 bytes hex)
      validReviewerId = reviewerId;
    }

    const approved = await db.teamDeliverable.update({
      where: { id: deliverableId },
      data: {
        status: DeliverableStatus.APPROVED,
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

    // TODO: Notify team members
    // TODO: Award 25 points to team members

    return approved;
  }

  /**
   * Reject deliverable with feedback
   */
  static async rejectDeliverable(
    deliverableId: string,
    reason: string,
    reviewerId?: string
  ) {
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
    let validReviewerId: string | null = null;
    if (reviewerId && reviewerId.length === 24) {
      // MongoDB ObjectID is exactly 24 characters (12 bytes hex)
      validReviewerId = reviewerId;
    }

    const rejected = await db.teamDeliverable.update({
      where: { id: deliverableId },
      data: {
        status: DeliverableStatus.REJECTED,
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

    // TODO: Notify team members about rejection

    return rejected;
  }

  /**
   * Get team's deliverables
   */
  static async getTeamDeliverables(teamId: string) {
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
   * Submit/Update deliverable (Student/Team action)
   */
  static async submitDeliverable(data: {
    deliverableId: string;
    teamId: string;
    content: string;
    contentType?: string;
    description?: string;
  }) {
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
    if (deliverable.status === DeliverableStatus.APPROVED) {
      throw new Error("Cannot update approved deliverable");
    }

    // Determine if this is a resubmission after rejection
    const wasRejected = deliverable.status === DeliverableStatus.REJECTED;
    const isFirstSubmission = !deliverable.content || deliverable.content.length === 0;

    // Update the deliverable
    // Update the deliverable
    const updated = await db.teamDeliverable.update({
      where: { id: data.deliverableId },
      data: {
        content: data.content,
        contentType: (data.contentType as any) || deliverable.contentType,
        description: data.description || deliverable.description,
        status: DeliverableStatus.PENDING, // Always reset to pending on update
        submittedAt: new Date(), // Update submission time
        reviewedAt: wasRejected ? null : deliverable.reviewedAt, // Clear review if was rejected
        reviewedBy: wasRejected ? null : deliverable.reviewedBy,
        feedback: wasRejected ? null : deliverable.feedback, // Clear feedback if was rejected
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

    // TODO: Notify team members
    // TODO: Award 15 points to team members (first time only)

    return updated;
  }

  /**
   * Get deliverable by ID (for viewing before submission)
   */
  static async getDeliverableById(deliverableId: string, teamId?: string) {
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
  static async checkDeadline(deliverableId: string): Promise<{
    passed: boolean;
    dueDate: Date;
    timeRemaining?: string;
  }> {
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
      } else {
        timeRemaining = `${hours} hour${hours > 1 ? 's' : ''}`;
      }

      return { passed: false, dueDate, timeRemaining };
    }

    return { passed: true, dueDate };
  }

  /**
   * Delete deliverable submission (reset to empty)
   * Admin or team can delete before deadline
   */
  static async deleteDeliverableSubmission(data: {
    deliverableId: string;
    teamId?: string;
    isAdmin?: boolean;
  }) {
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

    // If not admin, check deadline and approval status
    if (!data.isAdmin) {
      const now = new Date();
      if (deliverable.template.dueDate < now) {
        throw new Error("Deadline has passed. Cannot delete submission.");
      }
      
      // Students cannot delete approved deliverables
      if (deliverable.status === DeliverableStatus.APPROVED) {
        throw new Error("Cannot delete approved deliverable");
      }
    }

    // Admin can delete any deliverable (even approved ones)
    // Reset the deliverable to empty state (don't actually delete the record)
    const reset = await db.teamDeliverable.update({
      where: { id: data.deliverableId },
      data: {
        content: "",
        description: null,
        status: DeliverableStatus.PENDING,
        feedback: null,
        reviewedAt: null,
        reviewedBy: null,
        submittedAt: new Date(), // Update timestamp
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
