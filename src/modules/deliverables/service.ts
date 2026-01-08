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

    // TODO: Notify all teams about new requirement

    return template;
  }

  /**
   * Update deliverable template
   */
  static async updateTemplate(
    templateId: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: Date;
      required?: boolean;
    }
  ) {
    const template = await db.deliverableTemplate.update({
      where: { id: templateId },
      data,
    });

    // TODO: Notify teams about changes

    return template;
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
  static async approveDeliverable(deliverableId: string, reviewerId: string) {
    const deliverable = await db.teamDeliverable.update({
      where: { id: deliverableId },
      data: {
        status: DeliverableStatus.APPROVED,
        reviewedAt: new Date(),
        reviewedBy: reviewerId,
      },
      include: {
        team: {
          include: {
            members: true,
          },
        },
        template: true,
      },
    });

    // TODO: Notify team members
    // TODO: Award 25 points to all team members
    // TODO: Check if submitted early (>3 days before) and award +10 bonus

    return deliverable;
  }

  /**
   * Reject deliverable
   */
  static async rejectDeliverable(
    deliverableId: string,
    reviewerId: string,
    reason: string
  ) {
    const deliverable = await db.teamDeliverable.update({
      where: { id: deliverableId },
      data: {
        status: DeliverableStatus.REJECTED,
        feedback: reason,
        reviewedAt: new Date(),
        reviewedBy: reviewerId,
      },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    // TODO: Notify team members with feedback

    return deliverable;
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
}
