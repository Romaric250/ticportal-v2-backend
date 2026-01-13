import { HackathonService } from "./service.js";
export class HackathonController {
    static async getHackathons(req, res) {
        try {
            const hackathons = await HackathonService.getHackathons();
            res.json({ success: true, data: hackathons });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=controller.js.map