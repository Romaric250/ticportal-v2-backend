import { prisma } from "../../config/database";

export class TeamService {
  static async getTeams() {
    return await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        projectTitle: true,
        description: true,
        squadId: true,
      },
    });
  }
}