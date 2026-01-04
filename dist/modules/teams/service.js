import { db } from "../../config/database";
export class TeamService {
    static async getTeams() {
        return await db.team.findMany({
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
//# sourceMappingURL=service.js.map