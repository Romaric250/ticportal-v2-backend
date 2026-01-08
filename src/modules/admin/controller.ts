import type { Request, Response } from "express";
import { AdminService } from "./service";
import { UserRole, UserStatus } from "@prisma/client";

export class AdminController {
  /**
   * GET /api/admin/stats
   */
  static async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      
      res.json({
        success: true,
        stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get dashboard stats",
      });
    }
  }

  /**
   * GET /api/admin/dashboard-stats
   */
  static async getDetailedDashboardStats(req: Request, res: Response) {
    try {
      const data = await AdminService.getDetailedDashboardStats();
      
      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get detailed stats",
      });
    }
  }

  /**
   * GET /api/admin/users
   */
  static async getUsers(req: Request, res: Response) {
    try {
      const { page, limit, role, jurisdiction, status, search } = req.query;

      const filters: any = {};
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);
      if (role) filters.role = role as UserRole;
      if (jurisdiction) filters.jurisdiction = jurisdiction as string;
      if (status) filters.status = status as UserStatus;
      if (search) filters.search = search as string;

      const result = await AdminService.getUsers(filters);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get users",
      });
    }
  }

  /**
   * GET /api/admin/users/:userId
   */
  static async getUserById(req: Request, res: Response) {
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
    } catch (error: any) {
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
  static async createUser(req: Request, res: Response) {
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
    } catch (error: any) {
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
  static async updateUser(req: Request, res: Response) {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update user",
      });
    }
  }

  /**
   * DELETE /api/admin/users/:userId
   */
  static async deleteUser(req: Request, res: Response) {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete user",
      });
    }
  }

  /**
   * GET /api/admin/teams
   */
  static async getTeams(req: Request, res: Response) {
    try {
      const { page, limit, school, status, search } = req.query;

      const filters: any = {};
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);
      if (school) filters.school = school as string;
      if (status) filters.status = status as string;
      if (search) filters.search = search as string;

      const result = await AdminService.getTeams(filters);

      res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get teams",
      });
    }
  }

  /**
   * GET /api/admin/teams/:teamId
   */
  static async getTeamById(req: Request, res: Response) {
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
    } catch (error: any) {
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
  static async updateTeam(req: Request, res: Response) {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update team",
      });
    }
  }

  /**
   * DELETE /api/admin/teams/:teamId
   */
  static async deleteTeam(req: Request, res: Response) {
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
    } catch (error: any) {
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
  static async importUsersCSV(req: Request, res: Response) {
    try {
      // TODO: Implement CSV import
      // This requires multer for file upload
      
      res.status(501).json({
        success: false,
        message: "CSV import not yet implemented",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to import users",
      });
    }
  }
}
