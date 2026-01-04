import { z } from "zod";

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

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateProfilePhotoInput = z.infer<typeof UpdateProfilePhotoSchema>;