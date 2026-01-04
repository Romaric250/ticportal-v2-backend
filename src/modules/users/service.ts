import { db } from "../../config/database";
import { activityService } from "../../shared/services/activity";
import {
  uploadBase64ToUploadThing,
  validateBase64Image,
  generateProfilePhotoFilename,
} from "../../shared/utils/uploadthing";
import { logger } from "../../shared/utils/logger";
import type { UpdateUserInput, UpdateProfilePhotoInput } from "./types";

export class UserService {
  static async getProfile(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        phone: true,
        profilePhoto: true,
        school: true,
        grade: true,
        country: true,
        gradDate: true,
        role: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });
  }

  static async updateProfile(userId: string, input: UpdateUserInput) {
    // Convert gradDate string to Date if provided
    const data: any = { ...input };
    if (input.gradDate) {
      data.gradDate = new Date(input.gradDate);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        phone: true,
        profilePhoto: true,
        school: true,
        grade: true,
        country: true,
        gradDate: true,
        role: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    // Track profile update activity
    await activityService.trackAuthActivity(userId, "PROFILE_UPDATE");

    return updatedUser;
  }

  static async updateProfilePhoto(
    userId: string,
    input: UpdateProfilePhotoInput,
  ) {
    // Validate base64 image
    const validation = validateBase64Image(input.profilePhoto);
    if (!validation.valid) {
      throw new Error(validation.error || "Invalid image");
    }

    // Generate filename
    const filename = generateProfilePhotoFilename(userId);

    // Upload to UploadThing
    const uploadResult = await uploadBase64ToUploadThing(
      input.profilePhoto,
      filename,
    );

    // Update user with new profile photo URL
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { profilePhoto: uploadResult.url },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profilePhoto: true,
        school: true,
        grade: true,
        country: true,
        role: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    // Track profile photo update
    await activityService.trackAuthActivity(userId, "PROFILE_UPDATE", {
      action: "profile_photo_updated",
    });

    logger.info({ userId, photoUrl: uploadResult.url }, "Profile photo updated");

    return updatedUser;
  }

  static async deleteProfilePhoto(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { profilePhoto: true },
    });

    if (!user?.profilePhoto) {
      throw new Error("No profile photo to delete");
    }

    // Remove from database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { profilePhoto: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profilePhoto: true,
        school: true,
        grade: true,
        country: true,
        role: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    logger.info({ userId }, "Profile photo deleted");

    return updatedUser;
  }
}