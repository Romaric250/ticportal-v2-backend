/**
 * Global File Upload Controller
 * Simple upload endpoint that returns file URL
 */
export class FileUploadController {
    /**
     * POST /api/f/upload
     * Upload any file and get URL back
     */
    static async upload(req, res) {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: "No file provided",
                });
            }
            // File URL from uploadthing or multer
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
}
//# sourceMappingURL=controller.js.map