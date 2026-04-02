import { Router } from "express";
import multer from "multer";
import { env } from "../../config/env.js";
import { logger } from "../../shared/utils/logger.js";
import { uploadBufferWithUploadThing } from "./uploadthingService.js";
const router = Router();
const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
});
/**
 * POST /api/f/upload
 * Accepts a file via FormData, uploads to UploadThing via UTApi,
 * and returns the file URL.
 */
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!env.uploadthingToken) {
            logger.error("UPLOADTHING_TOKEN is missing or empty");
            return res.status(500).json({
                success: false,
                message: "File uploads are not configured on the server.",
            });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file provided. Please select a file and try again.",
            });
        }
        const safeName = (file.originalname || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
        const uploaded = await uploadBufferWithUploadThing({
            buffer: file.buffer,
            filename: safeName,
            mimeType: file.mimetype || "application/octet-stream",
        });
        return res.json({
            success: true,
            data: uploaded,
        });
    }
    catch (error) {
        logger.error({ err: error.message, stack: error.stack, cause: error.cause }, "File upload failed");
        return res.status(500).json({
            success: false,
            message: "Error uploading file. Please try again.",
        });
    }
});
export default router;
//# sourceMappingURL=routes.js.map