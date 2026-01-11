import { Router } from "express";
import { UTApi } from "uploadthing/server";

const router = Router();
const utapi = new UTApi();

/**
 * POST /upload
 * Upload file from base64 string (like team/user profile uploads)
 */
router.post("/upload", async (req, res) => {
  try {
    const { file, fileName } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file data provided",
      });
    }

    // Upload base64 to uploadthing (same as team profile)
    const uploadedFile = await utapi.uploadFilesFromUrl(file);

    if (!uploadedFile || !uploadedFile.data) {
      throw new Error("Upload failed");
    }

    return res.json({
      success: true,
      data: {
        url: uploadedFile.data.url,
        key: uploadedFile.data.key,
        name: uploadedFile.data.name,
        size: uploadedFile.data.size,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
});

export default router;
