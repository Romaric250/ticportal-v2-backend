import type { Request, Response } from "express";
export declare class TeamController {
    static getTeams(req: Request, res: Response): Promise<void>;
    static getTeamById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserTeams(req: Request, res: Response): Promise<void>;
    static createTeam(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateTeam(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteTeam(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static addTeamMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateTeamMemberRole(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static removeTeamMember(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTeamChats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static sendTeamChatMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static searchTeams(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static requestToJoinTeam(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static handleJoinRequest(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTeamJoinRequests(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUserJoinRequests(req: Request, res: Response): Promise<void>;
    static getUnreadMessageCount(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static markMessagesAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUnreadCountsForUserTeams(req: Request, res: Response): Promise<void>;
    static getTotalUnreadCount(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map