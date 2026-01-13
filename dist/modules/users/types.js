import { z } from "zod";
import { UserRole } from "@prisma/client";
export const UpdateUserSchema = z.object({
    username: z.string().min(3).max(30).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().max(500).optional(),
    phone: z.string().optional(),
    school: z.string().optional(),
    grade: z.string().optional(),
    country: z.string().optional(),
    region: z.string().optional(),
    gradDate: z.string().datetime().optional(),
});
export const UpdateProfilePhotoSchema = z.object({
    profilePhoto: z.string().min(1, "Profile photo is required"),
});
export const SearchUsersSchema = z.object({
    query: z.string().min(1, "Search query is required"),
    type: z.enum(["user", "mentor"]).optional(),
    page: z.number().positive().default(1),
    limit: z.number().positive().max(100).default(20),
});
//# sourceMappingURL=types.js.map