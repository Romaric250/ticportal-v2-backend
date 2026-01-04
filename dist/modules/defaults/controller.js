import { DefaultsService } from "./service";
export class DefaultsController {
    /**
     * Get defaults by type (school or region)
     */
    static async getDefaults(req, res) {
        try {
            const { type } = req.query;
            if (!type || (type !== "school" && type !== "region")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or missing type parameter. Must be 'school' or 'region'",
                });
            }
            const data = await DefaultsService.getDefaultsByType(type);
            res.json({
                success: true,
                data,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Search defaults by type and query
     */
    static async searchDefaults(req, res) {
        try {
            const { type, q } = req.query;
            if (!type || (type !== "school" && type !== "region")) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or missing type parameter. Must be 'school' or 'region'",
                });
            }
            if (!q || typeof q !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Missing or invalid query parameter 'q'",
                });
            }
            const data = await DefaultsService.searchDefaults(type, q);
            res.json({
                success: true,
                data,
                count: data.length,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get all schools
     */
    static async getSchools(_req, res) {
        try {
            const schools = await DefaultsService.getSchools();
            res.json({
                success: true,
                data: schools,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Get all regions
     */
    static async getRegions(_req, res) {
        try {
            const regions = await DefaultsService.getRegions();
            res.json({
                success: true,
                data: regions,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Create school (admin only)
     */
    static async createSchool(req, res) {
        try {
            const { name, region, country } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "School name is required",
                });
            }
            const school = await DefaultsService.createSchool({
                name,
                region,
                country,
            });
            res.status(201).json({
                success: true,
                data: school,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
    /**
     * Create region (admin only)
     */
    static async createRegion(req, res) {
        try {
            const { name, country } = req.body;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Region name is required",
                });
            }
            const region = await DefaultsService.createRegion({ name, country });
            res.status(201).json({
                success: true,
                data: region,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}
//# sourceMappingURL=controller.js.map