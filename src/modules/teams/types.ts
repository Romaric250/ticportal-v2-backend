import { z } from "zod";
import { TeamRole } from "@prisma/client";

// Create Team Schema
export const CreateTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(100),
  squadId: z.string().min(1, "Squad ID is required"),
  projectTitle: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;

// Update Team Schema
export const UpdateTeamSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  projectTitle: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
});

export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;

// Add Team Member Schema
export const AddTeamMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.nativeEnum(TeamRole).default(TeamRole.MEMBER),
});

export type AddTeamMemberInput = z.infer<typeof AddTeamMemberSchema>;

// Update Team Member Role Schema
export const UpdateTeamMemberRoleSchema = z.object({
  role: z.nativeEnum(TeamRole),
});

export type UpdateTeamMemberRoleInput = z.infer<typeof UpdateTeamMemberRoleSchema>;

// Send Team Chat Message Schema
export const SendTeamChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000),
  attachments: z.array(z.string().url()).max(5).optional(),
});

export type SendTeamChatMessageInput = z.infer<typeof SendTeamChatMessageSchema>;
