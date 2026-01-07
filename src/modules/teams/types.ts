import { z } from "zod";
import { TeamRole } from "@prisma/client";

// Create Team Schema
export const CreateTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(100),
  school: z.string().min(1, "School is required"),
  profileImage: z.string().url().optional(),
  projectTitle: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;

// Update Team Schema
export const UpdateTeamSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  profileImage: z.string().url().optional(),
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

// Search Teams Schema
export const SearchTeamsSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

export type SearchTeamsInput = z.infer<typeof SearchTeamsSchema>;

// Request to Join Team Schema
export const RequestToJoinTeamSchema = z.object({
  message: z.string().max(500).optional(),
});

export type RequestToJoinTeamInput = z.infer<typeof RequestToJoinTeamSchema>;

// Handle Join Request Schema
export const HandleJoinRequestSchema = z.object({
  action: z.enum(["accept", "reject"]),
  message: z.string().max(500).optional(),
});

export type HandleJoinRequestInput = z.infer<typeof HandleJoinRequestSchema>;

// Mark Messages as Read Schema
export const MarkMessagesAsReadSchema = z.object({
  messageIds: z.array(z.string()).optional(), // If not provided, mark all as read
});

export type MarkMessagesAsReadInput = z.infer<typeof MarkMessagesAsReadSchema>;
