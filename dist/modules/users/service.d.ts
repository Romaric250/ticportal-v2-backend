import type { UpdateUserInput, UpdateProfilePhotoInput } from "./types";
export declare class UserService {
    static getProfile(userId: string): Promise<{
        id: string;
        country: string | null;
        createdAt: Date;
        region: string | null;
        email: string;
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
    } | null>;
    static updateProfile(userId: string, input: UpdateUserInput): Promise<{
        id: string;
        country: string | null;
        createdAt: Date;
        region: string | null;
        email: string;
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
    }>;
    static updateProfilePhoto(userId: string, input: UpdateProfilePhotoInput): Promise<{
        id: string;
        country: string | null;
        createdAt: Date;
        region: string | null;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        isVerified: boolean;
        lastLogin: Date | null;
    }>;
    static deleteProfilePhoto(userId: string): Promise<{
        id: string;
        country: string | null;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        isVerified: boolean;
        lastLogin: Date | null;
    }>;
}
//# sourceMappingURL=service.d.ts.map