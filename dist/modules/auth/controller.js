import { AuthService } from "./service.js";
import { RegisterSchema, LoginSchema, RefreshTokenSchema, SendOtpSchema, VerifyOtpSchema, ResetPasswordSchema } from "./types.js";
export class AuthController {
    static async register(req, res) {
        try {
            const input = RegisterSchema.parse(req.body);
            const result = await AuthService.register(input);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: { message: error.message } });
        }
    }
    static async login(req, res) {
        try {
            const input = LoginSchema.parse(req.body);
            const result = await AuthService.login(input);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(401).json({ success: false, error: { message: error.message } });
        }
    }
    static async refreshToken(req, res) {
        try {
            const input = RefreshTokenSchema.parse(req.body);
            const result = await AuthService.refreshToken(input.refreshToken);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(401).json({ success: false, error: { message: error.message } });
        }
    }
    static async logout(req, res) {
        try {
            const token = req.body.refreshToken;
            await AuthService.logout(token);
            res.json({ success: true, message: "Logged out" });
        }
        catch (error) {
            res.status(400).json({ success: false, error: { message: error.message } });
        }
    }
    static async sendOtp(req, res) {
        try {
            const input = SendOtpSchema.parse(req.body);
            await AuthService.sendOtp(input);
            res.json({ success: true, message: "OTP sent" });
        }
        catch (error) {
            res.status(400).json({ success: false, error: { message: error.message } });
        }
    }
    static async verifyOtp(req, res) {
        try {
            const input = VerifyOtpSchema.parse(req.body);
            await AuthService.verifyOtp(input);
            res.json({ success: true, message: "OTP verified" });
        }
        catch (error) {
            res.status(400).json({ success: false, error: { message: error.message } });
        }
    }
    static async resetPassword(req, res) {
        try {
            const input = ResetPasswordSchema.parse(req.body);
            await AuthService.resetPassword(input);
            res.json({ success: true, message: "Password reset successful" });
        }
        catch (error) {
            res.status(400).json({ success: false, error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=controller.js.map