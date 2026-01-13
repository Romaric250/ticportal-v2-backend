import { z } from "zod";
export declare const CreateTeamSchema: z.ZodObject<{
    name: z.ZodString;
    school: z.ZodString;
    profileImage: z.ZodOptional<z.ZodString>;
    projectTitle: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export declare const UpdateTeamSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    profileImage: z.ZodOptional<z.ZodString>;
    projectTitle: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
export declare const AddTeamMemberSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        MEMBER: "MEMBER";
        LEAD: "LEAD";
    }>>;
}, z.core.$strip>;
export type AddTeamMemberInput = z.infer<typeof AddTeamMemberSchema>;
export declare const UpdateTeamMemberRoleSchema: z.ZodObject<{
    role: z.ZodEnum<{
        MEMBER: "MEMBER";
        LEAD: "LEAD";
    }>;
}, z.core.$strip>;
export type UpdateTeamMemberRoleInput = z.infer<typeof UpdateTeamMemberRoleSchema>;
export declare const SendTeamChatMessageSchema: z.ZodObject<{
    message: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type SendTeamChatMessageInput = z.infer<typeof SendTeamChatMessageSchema>;
export declare const SearchTeamsSchema: z.ZodObject<{
    query: z.ZodString;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type SearchTeamsInput = z.infer<typeof SearchTeamsSchema>;
export declare const RequestToJoinTeamSchema: z.ZodObject<{
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RequestToJoinTeamInput = z.infer<typeof RequestToJoinTeamSchema>;
export declare const HandleJoinRequestSchema: z.ZodObject<{
    action: z.ZodEnum<{
        accept: "accept";
        reject: "reject";
    }>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type HandleJoinRequestInput = z.infer<typeof HandleJoinRequestSchema>;
export declare const MarkMessagesAsReadSchema: z.ZodObject<{
    messageIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type MarkMessagesAsReadInput = z.infer<typeof MarkMessagesAsReadSchema>;
//# sourceMappingURL=types.d.ts.map