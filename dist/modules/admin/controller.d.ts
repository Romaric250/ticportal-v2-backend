import type { Request, Response } from "express";
export declare class AdminController {
    /**
     * GET /api/admin/stats
     */
    static getDashboardStats(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/admin/dashboard-stats
     */
    static getDetailedDashboardStats(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/admin/users
     */
    static getUsers(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/admin/users/:userId
     */
    static getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/users
     */
    static createUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/admin/users/:userId
     */
    static updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/users/:userId
     */
    static deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/admin/teams
     */
    static getTeams(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/admin/teams/:teamId
     */
    static getTeamById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/admin/teams/:teamId
     */
    static updateTeam(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/teams/:teamId
     */
    static deleteTeam(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/users/import
     */
    static importUsersCSV(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/admin/teams/:teamId/members
     */
    static getTeamMembers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/admin/teams/:teamId/members
     */
    static addTeamMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * DELETE /api/admin/teams/:teamId/members/:userId
     */
    static removeTeamMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /api/admin/teams/:teamId/members/:userId
     */
    static updateTeamMemberRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /api/admin/teams/:teamId/submissions
     */
    static getTeamSubmissions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map