import { Router } from "express";
import { LearningPathController } from "./controller";

const router = Router();

// TEMPORARY: No authentication for testing
// TODO: Add authentication middleware

// Admin Routes
router.get("/admin/learning-paths", LearningPathController.getAllPaths);
router.get("/admin/learning-paths/:pathId", LearningPathController.getPathById);
router.post("/admin/learning-paths", LearningPathController.createPath);
router.put("/admin/learning-paths/:pathId", LearningPathController.updatePath);
router.delete("/admin/learning-paths/:pathId", LearningPathController.deletePath);

// Admin - Module Management
router.post("/admin/learning-paths/:pathId/modules", LearningPathController.addModule);
router.put("/admin/learning-paths/:pathId/modules/:moduleId", LearningPathController.updateModule);
router.delete("/admin/learning-paths/:pathId/modules/:moduleId", LearningPathController.deleteModule);

// Student Routes
router.get("/learning-paths", LearningPathController.getPathsForUser);
router.get("/learning-paths/:pathId/progress", LearningPathController.getUserProgress);
router.post("/learning-paths/:pathId/modules/:moduleId/complete", LearningPathController.completeModule);

export default router;
