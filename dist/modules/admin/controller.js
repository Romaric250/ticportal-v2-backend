import { AdminService } from "./service";
import { UserRole, UserStatus } from "@prisma/client";
export class AdminController {
    /**
     * GET /api/admin/stats
     */
    static async getDashboardStats(req, res) {
        try {
            const stats = await AdminService.getDashboardStats();
            res.json({
                success: true,
                stats,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get dashboard stats",
            });
        }
    }
    /**
     * GET /api/admin/dashboard-stats
     */
    static async getDetailedDashboardStats(req, res) {
        try {
            const data = await AdminService.getDetailedDashboardStats();
            res.json({
                success: true,
                data,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get detailed stats",
            });
        }
    }
    /**
     * GET /api/admin/users
     */
    static async getUsers(req, res) {
        try {
            const { page, limit, role, jurisdiction, status, search } = req.query;
            const filters = {};
            if (page)
                filters.page = parseInt(page);
            if (limit)
                filters.limit = parseInt(limit);
            if (role)
                filters.role = role;
            if (jurisdiction)
                filters.jurisdiction = jurisdiction;
            if (status)
                filters.status = status;
            if (search)
                filters.search = search;
            const result = await AdminService.getUsers(filters);
            res.json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get users",
            });
        }
    }
    /**
     * GET /api/admin/users/:userId
     */
    static async getUserById(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required",
                });
            }
            const user = await AdminService.getUserById(userId);
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            const statusCode = error.message === "User not found" ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to get user",
            });
        }
    }
    /**
     * POST /api/admin/users
     */
    static async createUser(req, res) {
        try {
            const { email, firstName, lastName, role, school, region, password } = req.body;
            if (!email || !firstName || !lastName || !role) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: email, firstName, lastName, role",
                });
            }
            const user = await AdminService.createUser({
                email,
                firstName,
                lastName,
                role,
                school,
                region,
                password,
            });
            res.status(201).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("already exists") ? 409 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to create user",
            });
        }
    }
    /**
     * PUT /api/admin/users/:userId
     */
    static async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const { role, status, school, region, isVerified } = req.body;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required",
                });
            }
            const user = await AdminService.updateUser(userId, {
                role,
                status,
                school,
                region,
                isVerified,
            });
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update user",
            });
        }
    }
    /**
     * DELETE /api/admin/users/:userId
     */
    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required",
                });
            }
            await AdminService.deleteUser(userId);
            res.json({
                success: true,
                message: "User deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to delete user",
            });
        }
    }
    /**
     * GET /api/admin/teams
     */
    static async getTeams(req, res) {
        try {
            const { page, limit, school, status, search } = req.query;
            const filters = {};
            if (page)
                filters.page = parseInt(page);
            if (limit)
                filters.limit = parseInt(limit);
            if (school)
                filters.school = school;
            if (status)
                filters.status = status;
            if (search)
                filters.search = search;
            const result = await AdminService.getTeams(filters);
            res.json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get teams",
            });
        }
    }
    /**
     * GET /api/admin/teams/:teamId
     */
    static async getTeamById(req, res) {
        try {
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            const team = await AdminService.getTeamById(teamId);
            res.json({
                success: true,
                data: team,
            });
        }
        catch (error) {
            const statusCode = error.message === "Team not found" ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to get team",
            });
        }
    }
    /**
     * PUT /api/admin/teams/:teamId
     */
    static async updateTeam(req, res) {
        try {
            const { teamId } = req.params;
            const { name, projectTitle, description } = req.body;
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            const team = await AdminService.updateTeam(teamId, {
                name,
                projectTitle,
                description,
            });
            res.json({
                success: true,
                data: team,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to update team",
            });
        }
    }
    /**
     * DELETE /api/admin/teams/:teamId
     */
    static async deleteTeam(req, res) {
        try {
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            await AdminService.deleteTeam(teamId);
            res.json({
                success: true,
                message: "Team deleted successfully",
            });
        }
        catch (error) {
            const statusCode = error.message.includes("submissions") ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to delete team",
            });
        }
    }
    /**
     * POST /api/admin/users/import
     */
    static async importUsersCSV(req, res) {
        try {
            // TODO: Implement CSV import
            // This requires multer for file upload
            res.status(501).json({
                success: false,
                message: "CSV import not yet implemented",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to import users",
            });
        }
    }
    /**
     * GET /api/admin/teams/:teamId/members
     */
    static async getTeamMembers(req, res) {
        try {
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            const members = await AdminService.getTeamMembers(teamId);
            res.json({
                success: true,
                data: members,
            });
        }
        catch (error) {
            const statusCode = error.message === "Team not found" ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to get team members",
            });
        }
    }
    /**
     * POST /api/admin/teams/:teamId/members
     */
    static async addTeamMember(req, res) {
        try {
            const { teamId } = req.params;
            const { userId, role } = req.body;
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required",
                });
            }
            const member = await AdminService.addTeamMember(teamId, userId, role);
            res.status(201).json({
                success: true,
                data: member,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 :
                error.message.includes("already a member") ? 409 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to add team member",
            });
        }
    }
    /**
     * DELETE /api/admin/teams/:teamId/members/:userId
     */
    static async removeTeamMember(req, res) {
        try {
            const { teamId, userId } = req.params;
            if (!teamId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID and User ID are required",
                });
            }
            await AdminService.removeTeamMember(teamId, userId);
            res.json({
                success: true,
                message: "Team member removed successfully",
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to remove team member",
            });
        }
    }
    /**
     * PUT /api/admin/teams/:teamId/members/:userId
     */
    static async updateTeamMemberRole(req, res) {
        try {
            const { teamId, userId } = req.params;
            const { role } = req.body;
            if (!teamId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID and User ID are required",
                });
            }
            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: "Role is required",
                });
            }
            const member = await AdminService.updateTeamMemberRole(teamId, userId, role);
            res.json({
                success: true,
                data: member,
            });
        }
        catch (error) {
            const statusCode = error.message.includes("not found") ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || "Failed to update team member role",
            });
        }
    }
    /**
     * GET /api/admin/teams/:teamId/submissions
     */
    static async getTeamSubmissions(req, res) {
        try {
            const { teamId } = req.params;
            if (!teamId) {
                return res.status(400).json({
                    success: false,
                    message: "Team ID is required",
                });
            }
            const submissions = await AdminService.getTeamSubmissions(teamId);
            res.json({
                success: true,
                data: submissions,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Failed to get team submissions",
            });
        }
    }
}
//# sourceMappingURL=controller.js.map