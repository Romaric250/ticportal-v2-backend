import { Router } from "express";
import { uploadSingle, handleFileUpload } from "../../middleware/upload";

const router = Router();

/**
 * POST /upload
 * Global file upload endpoint
 * Use as: POST /api/f/upload
 */
router.post("/upload", uploadSingle, handleFileUpload);

export default router;
