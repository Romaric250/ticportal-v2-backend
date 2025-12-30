import type { Request, Response } from "express";
import { HackathonService } from "./service";

export class HackathonController {
  static async getHackathons(req: Request, res: Response) {
    try {
      const hackathons = await HackathonService.getHackathons();
      res.json({ success: true, data: hackathons });
    } catch (error) {
      res.status(500).json({ success: false, error: { message: (error as Error).message } });
    }
  }
}