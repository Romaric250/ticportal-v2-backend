import { SquadService } from "./service";
export class SquadController {
    static async getSquads(req, res) {
        try {
            const squads = await SquadService.getSquads();
            res.json({ success: true, data: squads });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
    static async getSquad(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, error: { message: "ID required" } });
            }
            const squad = await SquadService.getSquadById(id);
            if (!squad) {
                return res.status(404).json({ success: false, error: { message: "Squad not found" } });
            }
            res.json({ success: true, data: squad });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=controller.js.map