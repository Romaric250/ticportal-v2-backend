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

    console.log("file data:", fileName)

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file data provided",
      });
    }

    // Convert base64 to File object for uploadthing
    const base64Data = file.split(',')[1]; // Remove data:image/png;base64, prefix
    const mimeType = file.split(';')[0].split(':')[1]; // Extract mime type
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a File-like object
    const fileBlob = new File([buffer], fileName || 'upload', { type: mimeType });
    
    // Upload to uploadthing (same as team profile)
    const uploadedFile = await utapi.uploadFiles(fileBlob);
    console.log("uploaded: file", uploadedFile)

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
