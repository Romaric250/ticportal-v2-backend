import type { Request, Response } from "express";
import multer from "multer";

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Single file upload middleware
export const uploadSingle = upload.single("file");

// Upload handler
export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Generate file URL
    const fileUrl = (file as any).url || `https://uploadthing.com/f/${file.filename}`;

    return res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
};
