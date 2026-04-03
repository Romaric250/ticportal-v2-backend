import type { Request, Response } from "express";
/**
 * File Upload Controller for Deliverables
 */
export declare class DeliverableFileController {
    /**
     * POST /api/deliverables/upload
     * Handle file upload for deliverables
     */
    static uploadFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/deliverables/:deliverableId/upload-and-submit
     * Upload file and submit deliverable in one request
     */
    static uploadAndSubmit(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/deliverables/:teamId/upload-and-submit
     * Admin uploads file for team
     */
    static adminUploadAndSubmit(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=file-controller.d.ts.map