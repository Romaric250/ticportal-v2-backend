import { z } from "zod";
export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
    role: z.enum(["STUDENT", "MENTOR", "JUDGE", "SQUAD_LEAD", "ADMIN", "SUPER_ADMIN"]),
});
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export const RefreshTokenSchema = z.object({
    refreshToken: z.string(),
});
export const SendOtpSchema = z.object({
    email: z.string().email(),
    type: z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET"]),
});
export const VerifyOtpSchema = z.object({
    email: z.string().email(),
    code: z.string(),
    type: z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET"]),
});
export const ResetPasswordSchema = z.object({
    email: z.string().email(),
    code: z.string(),
    newPassword: z.string().min(6),
});
//# sourceMappingURL=types.js.map