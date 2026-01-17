import type { PortfolioOverview } from "./types";
export declare class PortfolioService {
    /**
     * Get complete portfolio overview for user
     */
    static getPortfolioOverview(userId: string): Promise<PortfolioOverview>;
    /**
     * Get profile information
     */
    private static getProfileInfo;
    /**
     * Get hackathon journey phases
     */
    private static getHackathonJourney;
    /**
     * Get featured project
     */
    private static getFeaturedProject;
    /**
     * Get certifications
     */
    private static getCertifications;
    /**
     * Get badges
     */
    private static getBadges;
    /**
     * Get mentor feedback
     */
    private static getMentorFeedback;
    /**
     * Get skills
     */
    private static getSkills;
    /**
     * Calculate level from points
     */
    private static calculateLevelFromPoints;
    /**
     * Generate initials safely
     */
    private static generateInitials;
    /**
     * Get badge color from tier
     */
    private static getBadgeColor;
}
//# sourceMappingURL=service.d.ts.map