import type { Request, Response } from "express";
export declare class GradingController {
    static getRubric(_req: Request, res: Response): Promise<any>;
    static postRubric(req: Request, res: Response): Promise<any>;
    static setReviewer(req: Request, res: Response): Promise<any>;
    static listReviewers(_req: Request, res: Response): Promise<any>;
    static reviewerWorkload(_req: Request, res: Response): Promise<any>;
    static pendingGrades(_req: Request, res: Response): Promise<any>;
    static autoAssign(req: Request, res: Response): Promise<any>;
    static bulkAssignSameReviewers(req: Request, res: Response): Promise<any>;
    static manualAssign(req: Request, res: Response): Promise<any>;
    static unassignReviewer(req: Request, res: Response): Promise<any>;
    static assignmentsForTeam(req: Request, res: Response): Promise<any>;
    static listAssignments(_req: Request, res: Response): Promise<any>;
    static unassignAllEligible(_req: Request, res: Response): Promise<any>;
    static reviewerAssignments(req: Request, res: Response): Promise<any>;
    static submitGrade(req: Request, res: Response): Promise<any>;
    static getTeamReviews(req: Request, res: Response): Promise<any>;
    static finalize(req: Request, res: Response): Promise<any>;
    static leaderboardConfigGet(_req: Request, res: Response): Promise<any>;
    static leaderboardConfigPost(req: Request, res: Response): Promise<any>;
    static finalizeBulk(req: Request, res: Response): Promise<any>;
    static leaderboardTeams(req: Request, res: Response): Promise<any>;
    static leaderboardApply(req: Request, res: Response): Promise<any>;
    static publish(req: Request, res: Response): Promise<any>;
    static reviewerDashboard(req: Request, res: Response): Promise<any>;
    static gradingReports(req: Request, res: Response): Promise<any>;
    static gradingReportTeamDetail(req: Request, res: Response): Promise<any>;
    static adminDeleteGrade(req: Request, res: Response): Promise<any>;
}
//# sourceMappingURL=controller.d.ts.map