import { Router } from "express";
import { DeliverableController } from "./controller";
import { DeliverableFileController } from "./file-controller";
import multer from "multer";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// TEMPORARY: No authentication for testing
// TODO: Add authentication middleware

// ==================== ADMIN ROUTES ====================

// Admin - Deliverable Templates
router.get("/admin/deliverable-templates", DeliverableController.getTemplates);
router.get("/admin/deliverable-templates/:templateId", DeliverableController.getTemplateById);
router.post("/admin/deliverable-templates", DeliverableController.createTemplate);
router.put("/admin/deliverable-templates/:templateId", DeliverableController.updateTemplate);
router.delete("/admin/deliverable-templates/:templateId", DeliverableController.deleteTemplate);

// Admin - Deliverable Submissions Management (New Routes)
router.get("/admin/deliverables", DeliverableController.getDeliverables);
router.post("/admin/deliverables/:teamId", DeliverableController.uploadDeliverable);
router.post("/admin/deliverables/:deliverableId/approve", DeliverableController.approveDeliverable);
router.post("/admin/deliverables/:deliverableId/reject", DeliverableController.rejectDeliverable);
router.delete("/admin/deliverables/:deliverableId", DeliverableController.adminDeleteSubmission);

// Admin - Deliverable Submissions Management (Old Routes - For Backward Compatibility)
router.get("/admin/teams/deliverables", DeliverableController.getDeliverables);
router.post("/admin/teams/:teamId/deliverables", DeliverableController.uploadDeliverable);
router.post("/admin/teams/deliverables/:deliverableId/approve", DeliverableController.approveDeliverable);
router.post("/admin/teams/deliverables/:deliverableId/reject", DeliverableController.rejectDeliverable);
router.delete("/admin/teams/deliverables/:deliverableId", DeliverableController.adminDeleteSubmission);

// ==================== STUDENT/TEAM ROUTES ====================

// Get available templates (what teams need to submit)
router.get("/deliverable-templates", DeliverableController.getTemplatesForTeams);

// Get team's deliverables (all their submissions)
router.get("/deliverables/team/:teamId", DeliverableController.getTeamDeliverables);

// Get single deliverable details
router.get("/deliverables/:deliverableId", DeliverableController.getDeliverableById);

// Submit or update deliverable (before deadline)
router.post("/deliverables/:deliverableId/submit", DeliverableController.submitDeliverable);

// Delete submission (reset to empty)
router.delete("/deliverables/:deliverableId", DeliverableController.deleteSubmission);

// Check if deadline has passed
router.get("/deliverables/:deliverableId/deadline", DeliverableController.checkDeadline);

// ============================================
// FILE UPLOAD ROUTES
// ============================================

// General file upload endpoint
router.post("/deliverables/upload", upload.single("file"), DeliverableFileController.uploadFile);

// Student: Upload file and submit deliverable in one request
router.post("/deliverables/:deliverableId/upload-and-submit", 
  upload.single("file"), 
  DeliverableFileController.uploadAndSubmit
);

// Admin: Upload file for team
router.post("/admin/deliverables/:teamId/upload-and-submit", 
  upload.single("file"), 
  DeliverableFileController.adminUploadAndSubmit
);

export default router;
