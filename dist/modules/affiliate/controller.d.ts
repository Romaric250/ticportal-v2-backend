import type { Request, Response } from 'express';
/**
 * Affiliate System Controller
 * Handles HTTP requests for affiliate, regional, and national coordinator operations
 */
export declare class AffiliateController {
    /**
     * Admin: Create a new country
     */
    createCountry: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Create a new region in a country
     */
    createRegion: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Update a country
     */
    updateCountry: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Delete a country
     */
    deleteCountry: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Update a region
     */
    updateRegion: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Delete a region
     */
    deleteRegion: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Update user role (Affiliate, Regional Coordinator, National Coordinator)
     */
    updateUserRole: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Activate or deactivate an affiliate
     */
    activateAffiliate: (req: Request, res: Response) => Promise<void>;
    /**
     * Public: Validate a referral code
     */
    validateReferralCode: (req: Request, res: Response) => Promise<void>;
    /**
     * Affiliate: Get own dashboard stats
     */
    getAffiliateDashboard: (req: Request, res: Response) => Promise<void>;
    /**
     * Regional Coordinator: Get dashboard stats
     */
    getRegionalDashboard: (req: Request, res: Response) => Promise<void>;
    /**
     * National Coordinator: Get dashboard stats
     */
    getNationalDashboard: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Get list of all countries
     */
    getCountries: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Get regions for a country
     */
    getRegionsByCountry: (req: Request, res: Response) => Promise<void>;
    /**
     * Affiliate/Coordinator: Get own referrals
     */
    getMyReferrals: (req: Request, res: Response) => Promise<void>;
    /**
     * Affiliate/Coordinator: Get own commissions
     */
    getMyCommissions: (req: Request, res: Response) => Promise<void>;
    /**
     * Get affiliate profile for authenticated user
     */
    getAffiliateProfile: (req: Request, res: Response) => Promise<void>;
    /**
     * Create affiliate profile
     */
    createAffiliateProfile: (req: Request, res: Response) => Promise<void>;
    /**
     * Regenerate referral code
     */
    regenerateReferralCode: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: List all affiliates
     */
    listAffiliates: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Suspend affiliate
     */
    suspendAffiliate: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Unsuspend affiliate
     */
    unsuspendAffiliate: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Terminate affiliate
     */
    terminateAffiliate: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Delete affiliate
     */
    deleteAffiliate: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Get financial overview
     */
    getFinancialOverview: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Get system ledger
     */
    getSystemLedger: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Get payout batches
     */
    getPayoutBatches: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Get fraud flags
     */
    getFraudFlags: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Get commission tier configuration
     */
    getCommissionTiers: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Update commission tier configuration
     * Only STANDARD tier is supported
     */
    updateCommissionTiers: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map