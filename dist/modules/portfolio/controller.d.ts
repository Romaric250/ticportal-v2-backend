import type { Request, Response } from "express";
export declare class PortfolioController {
    /**
     * GET /api/portfolio
     * Get complete portfolio overview
     */
    static getPortfolioOverview(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map