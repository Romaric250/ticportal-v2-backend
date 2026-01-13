import type { Request, Response } from "express";
export declare class LearningPathController {
    /**
     * GET /api/admin/learning-paths
     */
    static getAllPaths(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/admin/learning-paths/:pathId
     */
    static getPathById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/learning-paths
     */
    static createPath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/admin/learning-paths/:pathId
     */
    static updatePath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/learning-paths/:pathId
     */
    static deletePath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/learning-paths/:pathId/modules
     */
    static addModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/admin/learning-paths/:pathId/modules/:moduleId
     */
    static updateModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/learning-paths/:pathId/modules/:moduleId
     */
    static deleteModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/learning-paths (Student view)
     */
    static getPathsForUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/learning-paths/:pathId/progress
     */
    static getUserProgress(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/learning-paths/:pathId/modules/:moduleId/complete
     */
    static completeModule(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/learning-paths/:pathId/enroll
     */
    static enrollInPath(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/learning-paths/:pathId/modules/:moduleId/submit-quiz
     */
    static submitQuiz(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map