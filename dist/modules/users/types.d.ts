import { z } from "zod";
export declare const UpdateUserSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    school: z.ZodOptional<z.ZodString>;
    grade: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    region: z.ZodOptional<z.ZodString>;
    gradDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateProfilePhotoSchema: z.ZodObject<{
    profilePhoto: z.ZodString;
}, z.core.$strip>;
export declare const SearchUsersSchema: z.ZodObject<{
    query: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<{
        user: "user";
        mentor: "mentor";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateProfilePhotoInput = z.infer<typeof UpdateProfilePhotoSchema>;
export type SearchUsersInput = z.infer<typeof SearchUsersSchema>;
//# sourceMappingURL=types.d.ts.map