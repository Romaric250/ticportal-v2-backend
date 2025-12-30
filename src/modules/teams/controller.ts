import type { Request, Response } from "express";
import { TeamService } from "./service";

export class TeamController {
  static async getTeams(req: Request, res: Response) {
    try {
      const teams = await TeamService.getTeams();
      res.json({ success: true, data: teams });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: (error as Error).message } });
    }
  }
}