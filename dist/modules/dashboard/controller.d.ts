import type { Request, Response } from "express";
export declare class DashboardController {
    /**
     * GET /api/dashboard/overview
     * Get complete dashboard overview
     */
    static getDashboardOverview(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map