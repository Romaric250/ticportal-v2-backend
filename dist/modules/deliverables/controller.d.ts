import type { Request, Response } from "express";
export declare class DeliverableController {
    /**
     * GET /api/admin/deliverable-templates
     */
    static getTemplates(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/admin/deliverable-templates/:templateId
     */
    static getTemplateById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/deliverable-templates
     */
    static createTemplate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/admin/deliverable-templates/:templateId
     */
    static updateTemplate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/deliverable-templates/:templateId
     */
    static deleteTemplate(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/admin/teams/deliverables
     */
    static getDeliverables(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/admin/teams/:teamId/deliverables
     */
    static uploadDeliverable(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/teams/deliverables/:deliverableId/approve
     */
    static approveDeliverable(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/teams/deliverables/:deliverableId/reject
     */
    static rejectDeliverable(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/teams/deliverable-templates
     */
    static getTemplatesForTeams(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/deliverables/team/:teamId
     */
    static getTeamDeliverables(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/deliverables/:deliverableId
     */
    static getDeliverableById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/deliverables/:deliverableId/submit
     */
    static submitDeliverable(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/deliverables/:deliverableId/deadline
     */
    static checkDeadline(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/deliverables/:deliverableId (Student/Team)
     */
    static deleteSubmission(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/deliverables/:deliverableId (Admin)
     */
    static adminDeleteSubmission(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map