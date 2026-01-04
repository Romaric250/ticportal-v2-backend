import { db } from "../../config/database";

export class HackathonService {
  static async getHackathons() {
    return await db.hackathon.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    });
  }
}