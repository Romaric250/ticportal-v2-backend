import { db } from "../../config/database";

export class DefaultsService {
  /**
   * Get all schools
   */
  static async getSchools() {
    return await db.defaultSchool.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        region: true,
        country: true,
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get all regions
   */
  static async getRegions() {
    return await db.defaultRegion.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        country: true,
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get defaults by type
   */
  static async getDefaultsByType(type: "school" | "region") {
    if (type === "school") {
      return await this.getSchools();
    } else if (type === "region") {
      return await this.getRegions();
    } else {
      throw new Error("Invalid type. Must be 'school' or 'region'");
    }
  }

  /**
   * Search schools by name
   */
  static async searchSchools(query: string) {
    return await db.defaultSchool.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        region: true,
        country: true,
      },
      orderBy: { name: "asc" },
      take: 20, // Limit results to 20
    });
  }

  /**
   * Search regions by name
   */
  static async searchRegions(query: string) {
    return await db.defaultRegion.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        country: true,
      },
      orderBy: { name: "asc" },
      take: 20, // Limit results to 20
    });
  }

  /**
   * Search defaults by type and query
   */
  static async searchDefaults(type: "school" | "region", query: string) {
    if (type === "school") {
      return await this.searchSchools(query);
    } else if (type === "region") {
      return await this.searchRegions(query);
    } else {
      throw new Error("Invalid type. Must be 'school' or 'region'");
    }
  }

  /**
   * Create a new school (admin only)
   */
  static async createSchool(data: {
    name: string;
    region?: string;
    country?: string;
  }) {
    return await db.defaultSchool.create({
      data: {
        name: data.name,
        ...(data.region ? { region: data.region } : {}),
        ...(data.country ? { country: data.country } : {}),
      },
    });
  }

  /**
   * Create a new region (admin only)
   */
  static async createRegion(data: { name: string; country?: string }) {
    return await db.defaultRegion.create({
      data: {
        name: data.name,
        ...(data.country ? { country: data.country } : {}),
      },
    });
  }

  /**
   * Update school
   */
  static async updateSchool(
    id: string,
    data: { name?: string; region?: string; country?: string; isActive?: boolean },
  ) {
    return await db.defaultSchool.update({
      where: { id },
      data,
    });
  }

  /**
   * Update region
   */
  static async updateRegion(
    id: string,
    data: { name?: string; country?: string; isActive?: boolean },
  ) {
    return await db.defaultRegion.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete school (soft delete by setting isActive to false)
   */
  static async deleteSchool(id: string) {
    return await db.defaultSchool.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Delete region (soft delete by setting isActive to false)
   */
  static async deleteRegion(id: string) {
    return await db.defaultRegion.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
