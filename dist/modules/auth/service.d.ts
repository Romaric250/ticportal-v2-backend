import type { RegisterInput, LoginInput, SendOtpInput, VerifyOtpInput, ResetPasswordInput } from "./types";
export declare class AuthService {
    static register(input: RegisterInput): Promise<{
        message: string;
        email: string;
    }>;
    static login(input: LoginInput): Promise<{
        user: {
            id: string;
            country: string | null;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            username: string | null;
            bio: string | null;
            profilePhoto: string | null;
            school: string | null;
            grade: string | null;
            gradDate: Date | null;
            isVerified: boolean;
            lastLogin: Date | null;
            squadId: string | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    static refreshToken(token: string): Promise<{
        accessToken: string;
    }>;
    static logout(token: string): Promise<void>;
    static generateOtp(): string;
    static sendOtp(input: SendOtpInput): Promise<{
        message: string;
    }>;
    static verifyOtp(input: VerifyOtpInput): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        accessToken: string;
        refreshToken: string;
    } | {
        message: string;
        user?: never;
        accessToken?: never;
        refreshToken?: never;
    }>;
    static resetPassword(input: ResetPasswordInput): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=service.d.ts.map