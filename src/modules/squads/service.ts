import { db } from "../../config/database";

export class SquadService {
  static async getSquads() {
    return await prisma.squad.findMany({
      select: {
        id: true,
        name: true,
        schoolName: true,
        region: true,
        area: true,
        status: true,
      },
    });
  }

  static async getSquadById(id: string) {
    return await prisma.squad.findUnique({
      where: { id },
      include: { members: true, teams: true },
    });
  }
}