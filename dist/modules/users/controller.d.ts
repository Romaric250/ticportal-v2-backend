import type { Request, Response } from "express";
export declare class UserController {
    static getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static updateProfile(req: Request, res: Response): Promise<void>;
    static updateProfilePhoto(req: Request, res: Response): Promise<void>;
    static deleteProfilePhoto(req: Request, res: Response): Promise<void>;
    static searchUsers(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map