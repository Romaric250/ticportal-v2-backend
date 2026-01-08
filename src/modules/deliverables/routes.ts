import { Router } from "express";
import { DeliverableController } from "./controller";

const router = Router();

// TEMPORARY: No authentication for testing
// TODO: Add authentication middleware

// Admin Routes - Deliverable Templates
router.get("/admin/deliverable-templates", DeliverableController.getTemplates);
router.get("/admin/deliverable-templates/:templateId", DeliverableController.getTemplateById);
router.post("/admin/deliverable-templates", DeliverableController.createTemplate);
router.put("/admin/deliverable-templates/:templateId", DeliverableController.updateTemplate);
router.delete("/admin/deliverable-templates/:templateId", DeliverableController.deleteTemplate);

// Admin Routes - Deliverable Submissions
router.get("/admin/deliverables", DeliverableController.getDeliverables); // Changed from /admin/teams/deliverables
router.post("/admin/deliverables/:teamId", DeliverableController.uploadDeliverable); // Changed route
router.post("/admin/deliverables/:deliverableId/approve", DeliverableController.approveDeliverable);
router.post("/admin/deliverables/:deliverableId/reject", DeliverableController.rejectDeliverable);

// Team/Student Routes
router.get("/deliverable-templates", DeliverableController.getTemplatesForTeams); // Changed from /teams/deliverable-templates
router.get("/deliverables/team/:teamId", DeliverableController.getTeamDeliverables); // Changed to avoid conflict

export default router;
