import type { UpdateUserInput, UpdateProfilePhotoInput, SearchUsersInput } from "./types";
export declare class UserService {
    static getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        username: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        bio: string | null;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        country: string | null;
        region: string | null;
        gradDate: Date | null;
        isVerified: boolean;
        lastLogin: Date | null;
    } | null>;
    static updateProfile(userId: string, input: UpdateUserInput): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        username: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        bio: string | null;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        country: string | null;
        region: string | null;
        gradDate: Date | null;
        isVerified: boolean;
        lastLogin: Date | null;
    }>;
    static updateProfilePhoto(userId: string, input: UpdateProfilePhotoInput): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        country: string | null;
        region: string | null;
        isVerified: boolean;
        lastLogin: Date | null;
    }>;
    static deleteProfilePhoto(userId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        school: string | null;
        grade: string | null;
        country: string | null;
        isVerified: boolean;
        lastLogin: Date | null;
    }>;
    static searchUsers(input: SearchUsersInput): Promise<{
        users: {
            id: string;
            email: string;
            username: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            firstName: string;
            lastName: string;
            bio: string | null;
            profilePhoto: string | null;
            school: string | null;
            grade: string | null;
            country: string | null;
            region: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
//# sourceMappingURL=service.d.ts.map