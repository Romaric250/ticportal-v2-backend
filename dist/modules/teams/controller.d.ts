import type { Request, Response } from "express";
export declare class TeamController {
    static getTeams(req: Request, res: Response): Promise<void>;
    static getTeamById(req: Request, res: Response): Promise<any>;
    static getUserTeams(req: Request, res: Response): Promise<void>;
    static createTeam(req: Request, res: Response): Promise<any>;
    static updateTeam(req: Request, res: Response): Promise<any>;
    static deleteTeam(req: Request, res: Response): Promise<any>;
    static addTeamMember(req: Request, res: Response): Promise<any>;
    static updateTeamMemberRole(req: Request, res: Response): Promise<any>;
    static removeTeamMember(req: Request, res: Response): Promise<any>;
    static getTeamChats(req: Request, res: Response): Promise<any>;
    static sendTeamChatMessage(req: Request, res: Response): Promise<any>;
    static searchTeams(req: Request, res: Response): Promise<any>;
    static requestToJoinTeam(req: Request, res: Response): Promise<any>;
    static handleJoinRequest(req: Request, res: Response): Promise<any>;
    static getTeamJoinRequests(req: Request, res: Response): Promise<any>;
    static getUserJoinRequests(req: Request, res: Response): Promise<void>;
    static getUnreadMessageCount(req: Request, res: Response): Promise<any>;
    static markMessagesAsRead(req: Request, res: Response): Promise<any>;
    static getUnreadCountsForUserTeams(req: Request, res: Response): Promise<void>;
    static getTotalUnreadCount(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map