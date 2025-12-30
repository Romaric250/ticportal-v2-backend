import { z } from "zod";

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;