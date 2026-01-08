import type { Request, Response } from "express";
import { DeliverableService } from "./service";
import { DeliverableType, DeliverableStatus } from "@prisma/client";

export class DeliverableController {
  /**
   * GET /api/admin/deliverable-templates
   */
  static async getTemplates(req: Request, res: Response) {
    try {
      const { hackathonId, type } = req.query;

      const templates = await DeliverableService.getTemplates({
        hackathonId: hackathonId as string,
        type: type as DeliverableType,
      });

      res.json({
        success: true,
        data: templates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get templates",
      });
    }
  }

  /**
   * GET /api/admin/deliverable-templates/:templateId
   */
  static async getTemplateById(req: Request, res: Response) {
    try {
      const { templateId } = req.params;

      if (!templateId) {
        return res.status(400).json({
          success: false,
          message: "Template ID is required",
        });
      }

      const template = await DeliverableService.getTemplateById(templateId);

      res.json({
        success: true,
        data: template,
      });
    } catch (error: any) {
      const statusCode = error.message === "Template not found" ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get template",
      });
    }
  }

  /**
   * POST /api/admin/deliverable-templates
   */
  static async createTemplate(req: Request, res: Response) {
    try {
      const { title, description, type, customType, contentType, hackathonId, dueDate, required } = req.body;

      if (!title || !description || !dueDate) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: title, description, dueDate",
        });
      }

      // Validate type - if CUSTOM, customType is required
      const deliverableType = type || "CUSTOM";
      if (deliverableType === "CUSTOM" && !customType) {
        return res.status(400).json({
          success: false,
          message: "customType is required when type is CUSTOM",
        });
      }

      const template = await DeliverableService.createTemplate({
        title,
        description,
        type: deliverableType,
        customType,
        contentType: contentType || "TEXT",
        hackathonId,
        dueDate: new Date(dueDate),
        required,
      });

      res.status(201).json({
        success: true,
        data: template,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create template",
      });
    }
  }

  /**
   * PUT /api/admin/deliverable-templates/:templateId
   */
  static async updateTemplate(req: Request, res: Response) {
    try {
      const { templateId } = req.params;
      const { title, description, dueDate, required } = req.body;

      if (!templateId) {
        return res.status(400).json({
          success: false,
          message: "Template ID is required",
        });
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (dueDate) updateData.dueDate = new Date(dueDate);
      if (required !== undefined) updateData.required = required;

      const template = await DeliverableService.updateTemplate(templateId, updateData);

      res.json({
        success: true,
        data: template,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update template",
      });
    }
  }

  /**
   * DELETE /api/admin/deliverable-templates/:templateId
   */
  static async deleteTemplate(req: Request, res: Response) {
    try {
      const { templateId } = req.params;

      if (!templateId) {
        return res.status(400).json({
          success: false,
          message: "Template ID is required",
        });
      }

      await DeliverableService.deleteTemplate(templateId);

      res.json({
        success: true,
        message: "Template deleted successfully",
      });
    } catch (error: any) {
      const statusCode = error.message.includes("submissions") ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to delete template",
      });
    }
  }

  /**
   * GET /api/admin/teams/deliverables
   */
  static async getDeliverables(req: Request, res: Response) {
    try {
      const { status, hackathonId, teamId, search } = req.query;

      const deliverables = await DeliverableService.getDeliverables({
        status: status as DeliverableStatus,
        hackathonId: hackathonId as string,
        teamId: teamId as string,
        search: search as string,
      });

      res.json({
        success: true,
        data: deliverables,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get deliverables",
      });
    }
  }

  /**
   * POST /api/admin/teams/:teamId/deliverables
   */
  static async uploadDeliverable(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const { templateId, content, contentType, description } = req.body;

      if (!teamId) {
        return res.status(400).json({
          success: false,
          message: "Team ID is required",
        });
      }

      if (!templateId || !content) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: templateId, content",
        });
      }

      const deliverable = await DeliverableService.uploadDeliverable({
        teamId,
        templateId,
        content,
        contentType: contentType || "TEXT",
        description,
      });

      res.status(201).json({
        success: true,
        data: deliverable,
      });
    } catch (error: any) {
      const statusCode = 
        error.message.includes("not found") ? 404 :
        error.message.includes("already submitted") ? 409 : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to upload deliverable",
      });
    }
  }

  /**
   * POST /api/admin/teams/deliverables/:deliverableId/approve
   */
  static async approveDeliverable(req: Request, res: Response) {
    try {
      const { deliverableId } = req.params;
      const reviewerId = (req as any).user?.id; // Get from auth middleware

      if (!deliverableId) {
        return res.status(400).json({
          success: false,
          message: "Deliverable ID is required",
        });
      }

      if (!reviewerId) {
        return res.status(401).json({
          success: false,
          message: "Reviewer ID not found",
        });
      }

      const deliverable = await DeliverableService.approveDeliverable(
        deliverableId,
        reviewerId
      );

      res.json({
        success: true,
        message: "Deliverable approved",
        data: deliverable,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to approve deliverable",
      });
    }
  }

  /**
   * POST /api/admin/teams/deliverables/:deliverableId/reject
   */
  static async rejectDeliverable(req: Request, res: Response) {
    try {
      const { deliverableId } = req.params;
      const { reason } = req.body;
      const reviewerId = (req as any).user?.id; // Get from auth middleware

      if (!deliverableId) {
        return res.status(400).json({
          success: false,
          message: "Deliverable ID is required",
        });
      }

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      if (!reviewerId) {
        return res.status(401).json({
          success: false,
          message: "Reviewer ID not found",
        });
      }

      const deliverable = await DeliverableService.rejectDeliverable(
        deliverableId,
        reviewerId,
        reason
      );

      res.json({
        success: true,
        message: "Deliverable rejected",
        data: deliverable,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to reject deliverable",
      });
    }
  }

  /**
   * GET /api/teams/deliverable-templates
   */
  static async getTemplatesForTeams(req: Request, res: Response) {
    try {
      const { hackathonId } = req.query;

      const templates = await DeliverableService.getTemplates({
        hackathonId: hackathonId as string,
      });

      res.json({
        success: true,
        data: templates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get templates",
      });
    }
  }

  /**
   * GET /api/teams/:teamId/deliverables
   */
  static async getTeamDeliverables(req: Request, res: Response) {
    try {
      const { teamId } = req.params;

      if (!teamId) {
        return res.status(400).json({
          success: false,
          message: "Team ID is required",
        });
      }

      const deliverables = await DeliverableService.getTeamDeliverables(teamId);

      res.json({
        success: true,
        data: deliverables,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get team deliverables",
      });
    }
  }
}
