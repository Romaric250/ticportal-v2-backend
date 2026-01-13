export declare class DefaultsService {
    /**
     * Get all schools
     */
    static getSchools(): Promise<{
        id: string;
        name: string;
        country: string | null;
        region: string | null;
    }[]>;
    /**
     * Get all regions
     */
    static getRegions(): Promise<{
        id: string;
        name: string;
        country: string | null;
    }[]>;
    /**
     * Get defaults by type
     */
    static getDefaultsByType(type: "school" | "region"): Promise<{
        id: string;
        name: string;
        country: string | null;
    }[]>;
    /**
     * Search schools by name
     */
    static searchSchools(query: string): Promise<{
        id: string;
        name: string;
        country: string | null;
        region: string | null;
    }[]>;
    /**
     * Search regions by name
     */
    static searchRegions(query: string): Promise<{
        id: string;
        name: string;
        country: string | null;
    }[]>;
    /**
     * Search defaults by type and query
     */
    static searchDefaults(type: "school" | "region", query: string): Promise<{
        id: string;
        name: string;
        country: string | null;
    }[]>;
    /**
     * Create a new school (admin only)
     */
    static createSchool(data: {
        name: string;
        region?: string;
        country?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        country: string | null;
        region: string | null;
        updatedAt: Date;
        isActive: boolean;
    }>;
    /**
     * Create a new region (admin only)
     */
    static createRegion(data: {
        name: string;
        country?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        country: string | null;
        updatedAt: Date;
        isActive: boolean;
    }>;
    /**
     * Update school
     */
    static updateSchool(id: string, data: {
        name?: string;
        region?: string;
        country?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        country: string | null;
        region: string | null;
        updatedAt: Date;
        isActive: boolean;
    }>;
    /**
     * Update region
     */
    static updateRegion(id: string, data: {
        name?: string;
        country?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        country: string | null;
        updatedAt: Date;
        isActive: boolean;
    }>;
    /**
     * Delete school (soft delete by setting isActive to false)
     */
    static deleteSchool(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        country: string | null;
        region: string | null;
        updatedAt: Date;
        isActive: boolean;
    }>;
    /**
     * Delete region (soft delete by setting isActive to false)
     */
    static deleteRegion(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        country: string | null;
        updatedAt: Date;
        isActive: boolean;
    }>;
}
//# sourceMappingURL=service.d.ts.map