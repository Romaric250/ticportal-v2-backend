import { UserService } from "./service";
import { UpdateUserSchema, UpdateProfilePhotoSchema } from "./types";
import { logger } from "../../shared/utils/logger";
export class UserController {
    static async getProfile(req, res) {
        try {
            const userId = req.user?.userId; // Assume auth middleware sets req.user
            const user = await UserService.getProfile(userId);
            if (!user) {
                return res.status(404).json({ success: false, error: { message: "User not found" } });
            }
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.userId;
            const input = UpdateUserSchema.parse(req.body);
            const user = await UserService.updateProfile(userId, input);
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, error: { message: error.message } });
        }
    }
    static async updateProfilePhoto(req, res) {
        try {
            const userId = req.user?.userId;
            logger.info({ userId }, "Starting profile photo update");
            const input = UpdateProfilePhotoSchema.parse(req.body);
            logger.info({ userId, inputLength: input.profilePhoto?.length }, "Input parsed, uploading to UploadThing");
            const user = await UserService.updateProfilePhoto(userId, input);
            logger.info({ userId, profilePhoto: user.profilePhoto }, "Profile photo updated successfully");
            res.json({ success: true, data: user });
        }
        catch (error) {
            logger.error({ error, userId: req.user?.userId }, "Profile photo update failed");
            res.status(400).json({ success: false, message: error.message });
        }
    }
    static async deleteProfilePhoto(req, res) {
        try {
            const userId = req.user?.userId;
            const user = await UserService.deleteProfilePhoto(userId);
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
//# sourceMappingURL=controller.js.map