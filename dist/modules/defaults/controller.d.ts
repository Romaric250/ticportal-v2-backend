import type { Request, Response } from "express";
export declare class DefaultsController {
    /**
     * Get defaults by type (school or region)
     */
    static getDefaults(req: Request, res: Response): Promise<any>;
    /**
     * Search defaults by type and query
     */
    static searchDefaults(req: Request, res: Response): Promise<any>;
    /**
     * Get all schools
     */
    static getSchools(_req: Request, res: Response): Promise<void>;
    /**
     * Get all regions
     */
    static getRegions(_req: Request, res: Response): Promise<void>;
    /**
     * Create school (admin only)
     */
    static createSchool(req: Request, res: Response): Promise<any>;
    /**
     * Create region (admin only)
     */
    static createRegion(req: Request, res: Response): Promise<any>;
}
//# sourceMappingURL=controller.d.ts.map