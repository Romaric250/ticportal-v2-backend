import type { Request, Response } from "express";
export declare class GradingController {
    static getRubric(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static postRubric(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static setReviewer(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static listReviewers(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static reviewerWorkload(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static pendingGrades(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static autoAssign(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static bulkAssignSameReviewers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static manualAssign(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static unassignReviewer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static assignmentsForTeam(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static listAssignments(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static reviewerAssignments(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static submitGrade(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTeamReviews(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static finalize(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static leaderboardConfigGet(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static leaderboardConfigPost(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static finalizeBulk(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static leaderboardTeams(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static leaderboardApply(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static publish(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static reviewerDashboard(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static gradingReports(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static gradingReportTeamDetail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static adminDeleteGrade(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=controller.d.ts.map