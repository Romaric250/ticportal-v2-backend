import { TeamService } from "./service";
export class TeamController {
    static async getTeams(req, res) {
        try {
            const teams = await TeamService.getTeams();
            res.json({ success: true, data: teams });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=controller.js.map