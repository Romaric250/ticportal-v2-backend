import { DeliverableService } from "../deliverables/service";
/**
 * File Upload Controller for Deliverables
 */
export class DeliverableFileController {
    /**
     * POST /api/deliverables/upload
     * Handle file upload for deliverables
     */
    static async uploadFile(req, res) {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "No file provided",
                });
            }
            // File is already uploaded via uploadthing middleware
            // The file URL is in req.file
            const fileUrl = file.url || `https://uploadthing.com/f/${file.filename}`;
            res.json({
                success: true,
                data: {
                    url: fileUrl,
                    filename: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to upload file",
            });
        }
    }
    /**
     * POST /api/deliverables/:deliverableId/upload-and-submit
     * Upload file and submit deliverable in one request
     */
    static async uploadAndSubmit(req, res) {
        try {
            const { deliverableId } = req.params;
            const { teamId, description } = req.body;
            const file = req.file;
            if (!deliverableId) {
                return res.status(400).json({
                    success: false,
                    message: "Deliverable ID is required",
                });
            }
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "No file provided",
                });
            }
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            // Get file URL from uploadthing
            const fileUrl = file.url || `https://uploadthing.com/f/${file.filename}`;
            // Submit deliverable with file URL (type assertions for validated values)
            const deliverable = await DeliverableService.submitDeliverable({
                deliverableId: deliverableId,
                teamId: teamId,
                content: fileUrl,
                contentType: "FILE",
                description,
            });
            res.json({
                success: true,
                message: "File uploaded and deliverable submitted successfully",
                data: {
                    deliverable,
                    file: {
                        url: fileUrl,
                        filename: file.originalname,
                        size: file.size,
                    },
                },
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("Unauthorized") ? 403 :
                    error.message.includes("Deadline") ? 400 :
                        error.message.includes("approved") ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to upload and submit deliverable",
            });
        }
    }
    /**
     * POST /api/admin/deliverables/:teamId/upload-and-submit
     * Admin uploads file for team
     */
    static async adminUploadAndSubmit(req, res) {
        try {
            const { teamId } = req.params;
            const { templateId, description } = req.body;
            const file = req.file;
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "No file provided",
                });
            }
            if (!templateId) {
                return res.status(400).json({
                    success: false,
                    message: "Template ID is required",
                });
            }
            // Get file URL from uploadthing
            const fileUrl = file.url || `https://uploadthing.com/f/${file.filename}`;
            // Upload deliverable for team
            const deliverable = await DeliverableService.uploadDeliverable({
                teamId: teamId,
                templateId: templateId,
                content: fileUrl,
                contentType: "FILE",
                description,
            });
            res.json({
                success: true,
                message: "File uploaded and deliverable submitted for team",
                data: {
                    deliverable,
                    file: {
                        url: fileUrl,
                        filename: file.originalname,
                        size: file.size,
                    },
                },
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("already submitted") ? 409 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to upload and submit for team",
            });
        }
    }
}
//# sourceMappingURL=file-controller.js.map