import type { Request, Response } from "express";
export declare class AuthController {
    static register(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static refreshToken(req: Request, res: Response): Promise<void>;
    static logout(req: Request, res: Response): Promise<void>;
    static sendOtp(req: Request, res: Response): Promise<void>;
    static verifyOtp(req: Request, res: Response): Promise<void>;
    static resetPassword(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map