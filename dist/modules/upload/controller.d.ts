import type { Request, Response } from "express";
/**
 * Global File Upload Controller
 * Simple upload endpoint that returns file URL
 */
export declare class FileUploadController {
    /**
     * POST /api/f/upload
     * Upload any file and get URL back
     */
    static upload(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map