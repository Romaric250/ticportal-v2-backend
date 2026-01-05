import type { Request, Response } from "express";
import { TeamService } from "./service";
import {
  CreateTeamSchema,
  UpdateTeamSchema,
  AddTeamMemberSchema,
  UpdateTeamMemberRoleSchema,
  SendTeamChatMessageSchema,
} from "./types";
import { io } from "../../server";
import {
  emitTeamUpdate,
  emitTeamMemberAdded,
  emitTeamMemberRemoved,
  emitTeamMemberRoleUpdated,
} from "../../socket";

export class TeamController {
  static async getTeams(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await TeamService.getTeams(page, limit);
      res.json({ success: true, data: result.teams, pagination: result.pagination });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  static async getTeamById(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "Team ID is required" });
      }
      const team = await TeamService.getTeamById(teamId);
      res.json({ success: true, data: team });
    } catch (error) {
      const status = (error as Error).message === "Team not found" ? 404 : 500;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async getUserTeams(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const teams = await TeamService.getUserTeams(userId);
      res.json({ success: true, data: teams });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  static async createTeam(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      // Validate input with better error handling
      const parseResult = CreateTeamSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errors = parseResult.error.issues.map((err: any) => ({
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
    } catch (error) {
      const status = (error as Error).message.includes("must be a member") ? 403 : 400;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async updateTeam(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "Team ID is required" });
      }
      const input = UpdateTeamSchema.parse(req.body);
      const team = await TeamService.updateTeam(userId, teamId, input);

      // Emit socket event to team members
      const updateData: { name?: string; projectTitle?: string; description?: string } = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.projectTitle !== undefined) updateData.projectTitle = input.projectTitle;
      if (input.description !== undefined) updateData.description = input.description;
      
      if (Object.keys(updateData).length > 0) {
        emitTeamUpdate(io, teamId, updateData);
      }

      res.json({ success: true, data: team });
    } catch (error) {
      const status = (error as Error).message.includes("Only team leads") ? 403 : 400;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async deleteTeam(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "Team ID is required" });
      }
      const result = await TeamService.deleteTeam(userId, teamId);
      res.json({ success: true, data: result });
    } catch (error) {
      const status = (error as Error).message.includes("Only team leads") ? 403 : 400;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async addTeamMember(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
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
    } catch (error) {
      const status = (error as Error).message.includes("Only team leads") ? 403 : 400;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async updateTeamMemberRole(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
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
    } catch (error) {
      const status = (error as Error).message.includes("Only team leads") ? 403 : 400;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async removeTeamMember(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
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
    } catch (error) {
      const status = (error as Error).message.includes("Only team leads") ? 403 : 400;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async getTeamChats(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "Team ID is required" });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await TeamService.getTeamChats(userId, teamId, page, limit);
      res.json({ success: true, data: result.chats, pagination: result.pagination });
    } catch (error) {
      const status = (error as Error).message.includes("not a member") ? 403 : 500;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }

  static async sendTeamChatMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "Team ID is required" });
      }
      const input = SendTeamChatMessageSchema.parse(req.body);
      const chat = await TeamService.sendTeamChatMessage(userId, teamId, input);
      res.status(201).json({ success: true, data: chat });
    } catch (error) {
      const status = (error as Error).message.includes("not a member") ? 403 : 400;
      res.status(status).json({ success: false, message: (error as Error).message });
    }
  }
}