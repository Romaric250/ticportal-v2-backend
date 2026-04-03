import { db } from "../../config/database.js";
export class SquadService {
    static async getSquads() {
        return await db.squad.findMany({
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
    static async getSquadById(id) {
        return await db.squad.findUnique({
            where: { id },
            include: { members: true },
        });
    }
}
//# sourceMappingURL=service.js.map