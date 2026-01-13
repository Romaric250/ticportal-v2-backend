import { DeliverableService } from "./service.js";
import { DeliverableType, SubmissionStatus, ReviewStatus } from "@prisma/client";
export class DeliverableController {
    /**
     * GET /api/admin/deliverable-templates
     */
    static async getTemplates(req, res) {
        try {
            const { hackathonId, type } = req.query;
            const templates = await DeliverableService.getTemplates({
                hackathonId: hackathonId,
                type: type,
            });
            res.json({
                success: true,
                data: templates,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get templates",
            });
        }
    }
    /**
     * GET /api/admin/deliverable-templates/:templateId
     */
    static async getTemplateById(req, res) {
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
        }
        catch (error) {
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
    static async createTemplate(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to create template",
            });
        }
    }
    /**
     * PUT /api/admin/deliverable-templates/:templateId
     */
    static async updateTemplate(req, res) {
        try {
            const { templateId } = req.params;
            const { title, description, dueDate, required } = req.body;
            if (!templateId) {
                return res.status(400).json({
                    success: false,
                    message: "Template ID is required",
                });
            }
            const updateData = {};
            if (title)
                updateData.title = title;
            if (description)
                updateData.description = description;
            if (dueDate)
                updateData.dueDate = new Date(dueDate);
            if (required !== undefined)
                updateData.required = required;
            const template = await DeliverableService.updateTemplate(templateId, updateData);
            res.json({
                success: true,
                data: template,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update template",
            });
        }
    }
    /**
     * DELETE /api/admin/deliverable-templates/:templateId
     */
    static async deleteTemplate(req, res) {
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
        }
        catch (error) {
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
    static async getDeliverables(req, res) {
        try {
            const { submissionStatus, reviewStatus, teamId, templateId } = req.query;
            const deliverables = await DeliverableService.getDeliverables({
                submissionStatus: submissionStatus,
                reviewStatus: reviewStatus,
                teamId: teamId,
                templateId: templateId,
            });
            res.json({
                success: true,
                data: deliverables,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get deliverables",
            });
        }
    }
    /**
     * POST /api/admin/teams/:teamId/deliverables
     */
    static async uploadDeliverable(req, res) {
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
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
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
    static async approveDeliverable(req, res) {
        try {
            const { deliverableId } = req.params;
            // Reviewer ID is optional - will be from auth when implemented
            const reviewerId = req.user?.id;
            if (!deliverableId) {
                return res.status(400).json({
                    success: false,
                    message: "Deliverable ID is required",
                });
            }
            const deliverable = await DeliverableService.approveDeliverable(deliverableId, reviewerId);
            res.json({
                success: true,
                message: "Deliverable approved",
                data: deliverable,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to approve deliverable",
            });
        }
    }
    /**
     * POST /api/admin/teams/deliverables/:deliverableId/reject
     */
    static async rejectDeliverable(req, res) {
        try {
            const { deliverableId } = req.params;
            const { reason } = req.body;
            // Reviewer ID is optional - will be from auth when implemented
            const reviewerId = req.user?.id;
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
            const deliverable = await DeliverableService.rejectDeliverable(deliverableId, reason, reviewerId);
            res.json({
                success: true,
                message: "Deliverable rejected",
                data: deliverable,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to reject deliverable",
            });
        }
    }
    /**
     * GET /api/teams/deliverable-templates
     */
    static async getTemplatesForTeams(req, res) {
        try {
            const { hackathonId } = req.query;
            const templates = await DeliverableService.getTemplates({
                hackathonId: hackathonId,
            });
            res.json({
                success: true,
                data: templates,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get templates",
            });
        }
    }
    /**
     * GET /api/deliverables/team/:teamId
     */
    static async getTeamDeliverables(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get team deliverables",
            });
        }
    }
    /**
     * GET /api/deliverables/:deliverableId
     */
    static async getDeliverableById(req, res) {
        try {
            const { deliverableId } = req.params;
            const { teamId } = req.query;
            if (!deliverableId) {
                return res.status(400).json({
                    success: false,
                    message: "Deliverable ID is required",
                });
            }
            const deliverable = await DeliverableService.getDeliverableById(deliverableId, teamId);
            res.json({
                success: true,
                data: deliverable,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("Unauthorized") ? 403 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to get deliverable",
            });
        }
    }
    /**
     * POST /api/deliverables/:deliverableId/submit
     */
    static async submitDeliverable(req, res) {
        try {
            const { deliverableId } = req.params;
            const { teamId, content, contentType, description } = req.body;
            if (!deliverableId) {
                return res.status(400).json({
                    success: false,
                    message: "Deliverable ID is required",
                });
            }
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Content is required",
                });
            }
            const deliverable = await DeliverableService.submitDeliverable({
                deliverableId,
                teamId,
                content,
                contentType,
                description,
            });
            res.json({
                success: true,
                message: "Deliverable submitted successfully",
                data: deliverable,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("Unauthorized") ? 403 :
                    error.message.includes("Deadline") ? 400 :
                        error.message.includes("approved") ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to submit deliverable",
            });
        }
    }
    /**
     * GET /api/deliverables/:deliverableId/deadline
     */
    static async checkDeadline(req, res) {
        try {
            const { deliverableId } = req.params;
            if (!deliverableId) {
                return res.status(400).json({
                    success: false,
                    message: "Deliverable ID is required",
                });
            }
            const deadline = await DeliverableService.checkDeadline(deliverableId);
            res.json({
                success: true,
                data: deadline,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to check deadline",
            });
        }
    }
    /**
     * DELETE /api/deliverables/:deliverableId (Student/Team)
     */
    static async deleteSubmission(req, res) {
        try {
            const { deliverableId } = req.params;
            const { teamId } = req.body;
            if (!deliverableId) {
                return res.status(400).json({
                    success: false,
                    message: "Deliverable ID is required",
                });
            }
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            const deliverable = await DeliverableService.deleteDeliverableSubmission({
                deliverableId,
                teamId,
                isAdmin: false,
            });
            res.json({
                success: true,
                message: "Submission deleted successfully",
                data: deliverable,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("Unauthorized") ? 403 :
                    error.message.includes("Deadline") ? 400 :
                        error.message.includes("approved") ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to delete submission",
            });
        }
    }
    /**
     * DELETE /api/admin/deliverables/:deliverableId (Admin)
     */
    static async adminDeleteSubmission(req, res) {
        try {
            const { deliverableId } = req.params;
            if (!deliverableId) {
                return res.status(400).json({
                    success: false,
                    message: "Deliverable ID is required",
                });
            }
            const deliverable = await DeliverableService.deleteDeliverableSubmission({
                deliverableId,
                isAdmin: true,
            });
            res.json({
                success: true,
                message: "Submission deleted successfully",
                data: deliverable,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("approved") ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to delete submission",
            });
        }
    }
}
//# sourceMappingURL=controller.js.map