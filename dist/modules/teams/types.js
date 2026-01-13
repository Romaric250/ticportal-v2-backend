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
// Update Team Schema
export const UpdateTeamSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    profileImage: z.string().url().optional(),
    projectTitle: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
});
// Add Team Member Schema
export const AddTeamMemberSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    role: z.nativeEnum(TeamRole).default(TeamRole.MEMBER),
});
// Update Team Member Role Schema
export const UpdateTeamMemberRoleSchema = z.object({
    role: z.nativeEnum(TeamRole),
});
// Send Team Chat Message Schema
export const SendTeamChatMessageSchema = z.object({
    message: z.string().min(1, "Message cannot be empty").max(2000),
    attachments: z.array(z.string().url()).max(5).optional(),
});
// Search Teams Schema
export const SearchTeamsSchema = z.object({
    query: z.string().min(1, "Search query is required"),
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(20),
});
// Request to Join Team Schema
export const RequestToJoinTeamSchema = z.object({
    message: z.string().max(500).optional(),
});
// Handle Join Request Schema
export const HandleJoinRequestSchema = z.object({
    action: z.enum(["accept", "reject"]),
    message: z.string().max(500).optional(),
});
// Mark Messages as Read Schema
export const MarkMessagesAsReadSchema = z.object({
    messageIds: z.array(z.string()).optional(), // If not provided, mark all as read
});
//# sourceMappingURL=types.js.map