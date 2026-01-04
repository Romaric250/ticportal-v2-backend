import { z } from "zod";
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        STUDENT: "STUDENT";
        MENTOR: "MENTOR";
        JUDGE: "JUDGE";
        SQUAD_LEAD: "SQUAD_LEAD";
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
    }>;
}, z.core.$strip>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export declare const SendOtpSchema: z.ZodObject<{
    email: z.ZodString;
    type: z.ZodEnum<{
        EMAIL_VERIFICATION: "EMAIL_VERIFICATION";
        PASSWORD_RESET: "PASSWORD_RESET";
    }>;
}, z.core.$strip>;
export declare const VerifyOtpSchema: z.ZodObject<{
    email: z.ZodString;
    code: z.ZodString;
    type: z.ZodEnum<{
        EMAIL_VERIFICATION: "EMAIL_VERIFICATION";
        PASSWORD_RESET: "PASSWORD_RESET";
    }>;
}, z.core.$strip>;
export declare const ResetPasswordSchema: z.ZodObject<{
    email: z.ZodString;
    code: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type SendOtpInput = z.infer<typeof SendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
//# sourceMappingURL=types.d.ts.map