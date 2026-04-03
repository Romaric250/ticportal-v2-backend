import type { Request, Response } from "express";
export declare class CommunityController {
    static listMessages(req: Request, res: Response): Promise<void>;
    static listThread(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static createMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static bulkDeleteMessages(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteMessage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static setPinned(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static vapidPublicKey(_req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static subscribePush(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static unsubscribePush(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=controller.d.ts.map