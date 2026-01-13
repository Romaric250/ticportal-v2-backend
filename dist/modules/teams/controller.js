import { TeamService } from "./service";
import { CreateTeamSchema, UpdateTeamSchema, AddTeamMemberSchema, UpdateTeamMemberRoleSchema, SendTeamChatMessageSchema, SearchTeamsSchema, RequestToJoinTeamSchema, HandleJoinRequestSchema, } from "./types";
import { io } from "../../server";
import { emitTeamUpdate, emitTeamMemberAdded, emitTeamMemberRemoved, emitTeamMemberRoleUpdated, } from "../../socket";
export class TeamController {
    static async getTeams(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await TeamService.getTeams(page, limit);
            res.json({ success: true, data: result.teams, pagination: result.pagination });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getTeamById(req, res) {
        try {
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const team = await TeamService.getTeamById(teamId);
            res.json({ success: true, data: team });
        }
        catch (error) {
            const status = error.message === "Team not found" ? 404 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async getUserTeams(req, res) {
        try {
            const userId = req.user?.userId;
            const teams = await TeamService.getUserTeams(userId);
            res.json({ success: true, data: teams });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async createTeam(req, res) {
        try {
            const userId = req.user?.userId;
            // Validate input with better error handling
            const parseResult = CreateTeamSchema.safeParse(req.body);
            if (!parseResult.success) {
                const errors = parseResult.error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors
                });
            }
            const team = await TeamService.createTeam(userId, parseResult.data);
            res.status(201).json({ success: true, data: team });
        }
        catch (error) {
            const status = error.message.includes("must be a member") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async updateTeam(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const input = UpdateTeamSchema.parse(req.body);
            const team = await TeamService.updateTeam(userId, teamId, input);
            // Emit socket event to team members
            const updateData = {};
            if (input.name !== undefined)
                updateData.name = input.name;
            if (input.projectTitle !== undefined)
                updateData.projectTitle = input.projectTitle;
            if (input.description !== undefined)
                updateData.description = input.description;
            if (Object.keys(updateData).length > 0) {
                emitTeamUpdate(io, teamId, updateData);
            }
            res.json({ success: true, data: team });
        }
        catch (error) {
            const status = error.message.includes("Only team leads") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async deleteTeam(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const result = await TeamService.deleteTeam(userId, teamId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            const status = error.message.includes("Only team leads") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async addTeamMember(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const input = AddTeamMemberSchema.parse(req.body);
            const member = await TeamService.addTeamMember(userId, teamId, input);
            // Emit socket event to team members
            emitTeamMemberAdded(io, teamId, {
                userId: member.userId,
                userName: `${member.user.firstName} ${member.user.lastName}`,
                role: member.role,
            });
            res.status(201).json({ success: true, data: member });
        }
        catch (error) {
            const status = error.message.includes("Only team leads") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async updateTeamMemberRole(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId, memberId } = req.params;
            if (!teamId || !memberId) {
                return res.status(400).json({ success: false, message: "Team ID and Member ID are required" });
            }
            const input = UpdateTeamMemberRoleSchema.parse(req.body);
            const member = await TeamService.updateTeamMemberRole(userId, teamId, memberId, input);
            // Emit socket event to team members
            emitTeamMemberRoleUpdated(io, teamId, {
                userId: member.userId,
                userName: `${member.user.firstName} ${member.user.lastName}`,
                newRole: member.role,
            });
            res.json({ success: true, data: member });
        }
        catch (error) {
            const status = error.message.includes("Only team leads") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async removeTeamMember(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId, memberId } = req.params;
            if (!teamId || !memberId) {
                return res.status(400).json({ success: false, message: "Team ID and Member ID are required" });
            }
            const result = await TeamService.removeTeamMember(userId, teamId, memberId);
            // Emit socket event to team members
            emitTeamMemberRemoved(io, teamId, {
                userId: result.userId,
                userName: result.userName,
            });
            res.json({ success: true, data: result });
        }
        catch (error) {
            const status = error.message.includes("Only team leads") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async getTeamChats(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await TeamService.getTeamChats(userId, teamId, page, limit);
            res.json({ success: true, data: result.chats, pagination: result.pagination });
        }
        catch (error) {
            const status = error.message.includes("not a member") ? 403 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async sendTeamChatMessage(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const input = SendTeamChatMessageSchema.parse(req.body);
            const chat = await TeamService.sendTeamChatMessage(teamId, userId, input);
            res.status(201).json({ success: true, data: chat });
        }
        catch (error) {
            const status = error.message.includes("not a member") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async searchTeams(req, res) {
        try {
            const query = req.query.q;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            if (!query) {
                return res.status(400).json({ success: false, message: "Search query is required" });
            }
            const input = SearchTeamsSchema.parse({ query, page, limit });
            const result = await TeamService.searchTeams(input);
            res.json({ success: true, data: result.teams, pagination: result.pagination });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async requestToJoinTeam(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const input = RequestToJoinTeamSchema.parse(req.body);
            const joinRequest = await TeamService.requestToJoinTeam(userId, teamId, input);
            res.status(201).json({ success: true, data: joinRequest, message: "Join request sent successfully" });
        }
        catch (error) {
            const status = error.message.includes("already") ? 400 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async handleJoinRequest(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId, requestId } = req.params;
            if (!teamId || !requestId) {
                return res.status(400).json({ success: false, message: "Team ID and Request ID are required" });
            }
            const input = HandleJoinRequestSchema.parse(req.body);
            const result = await TeamService.handleJoinRequest(userId, teamId, requestId, input);
            res.json({ success: true, data: result });
        }
        catch (error) {
            const status = error.message.includes("Only team leads") ? 403 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async getTeamJoinRequests(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const requests = await TeamService.getTeamJoinRequests(userId, teamId);
            res.json({ success: true, data: requests });
        }
        catch (error) {
            const status = error.message.includes("Only team leads") ? 403 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async getUserJoinRequests(req, res) {
        try {
            const userId = req.user?.userId;
            const requests = await TeamService.getUserJoinRequests(userId);
            res.json({ success: true, data: requests });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getUnreadMessageCount(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const count = await TeamService.getUnreadMessageCount(teamId, userId);
            res.json({ success: true, data: { unreadCount: count } });
        }
        catch (error) {
            const status = error.message.includes("not a member") ? 403 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async markMessagesAsRead(req, res) {
        try {
            const userId = req.user?.userId;
            const { teamId } = req.params;
            const { messageIds } = req.body;
            if (!teamId) {
                return res.status(400).json({ success: false, message: "Team ID is required" });
            }
            const result = await TeamService.markMessagesAsRead(teamId, userId, messageIds);
            res.json({ success: true, data: result });
        }
        catch (error) {
            const status = error.message.includes("not a member") ? 403 : 500;
            res.status(status).json({ success: false, message: error.message });
        }
    }
    static async getUnreadCountsForUserTeams(req, res) {
        try {
            const userId = req.user?.userId;
            const unreadCounts = await TeamService.getUnreadCountsForUserTeams(userId);
            res.json({ success: true, data: unreadCounts });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getTotalUnreadCount(req, res) {
        try {
            const userId = req.user?.userId;
            const totalUnread = await TeamService.getTotalUnreadCount(userId);
            res.json({ success: true, data: { totalUnread } });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
//# sourceMappingURL=controller.js.map