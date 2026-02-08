import { Router } from 'express';
import { AffiliateController } from "./controller.js";
import { authenticate, authorize } from "../../shared/middleware/auth.js";
import { UserRole } from '@prisma/client';
const router = Router();
const affiliateController = new AffiliateController();
/**
 * Public Routes
 */
// Validate referral code (public for registration flow)
router.get('/validate/:referralCode', affiliateController.validateReferralCode);
// Get all countries (public for registration/payment forms)
router.get('/countries', affiliateController.getCountries);
// Get regions by country (public for registration/payment forms)
router.get('/countries/:countryId/regions', affiliateController.getRegionsByCountry);
/**
 * Admin Routes - Country & Region Management
 */
router.post('/admin/countries', authenticate, authorize([UserRole.ADMIN]), affiliateController.createCountry);
router.get('/admin/countries', authenticate, authorize([UserRole.ADMIN, UserRole.NATIONAL_COORDINATOR]), affiliateController.getCountries);
router.put('/admin/countries/:countryId', authenticate, authorize([UserRole.ADMIN]), affiliateController.updateCountry);
router.delete('/admin/countries/:countryId', authenticate, authorize([UserRole.ADMIN]), affiliateController.deleteCountry);
router.post('/admin/regions', authenticate, authorize([UserRole.ADMIN, UserRole.NATIONAL_COORDINATOR]), affiliateController.createRegion);
router.put('/admin/regions/:regionId', authenticate, authorize([UserRole.ADMIN, UserRole.NATIONAL_COORDINATOR]), affiliateController.updateRegion);
router.delete('/admin/regions/:regionId', authenticate, authorize([UserRole.ADMIN, UserRole.NATIONAL_COORDINATOR]), affiliateController.deleteRegion);
router.get('/admin/countries/:countryId/regions', authenticate, authorize([UserRole.ADMIN, UserRole.NATIONAL_COORDINATOR, UserRole.REGIONAL_COORDINATOR]), affiliateController.getRegionsByCountry);
/**
 * Admin Routes - User Role Management
 */
router.put('/admin/users/role', authenticate, authorize([UserRole.ADMIN]), affiliateController.updateUserRole);
router.post('/admin/affiliates', authenticate, authorize([UserRole.ADMIN, UserRole.AFFILIATE]), affiliateController.createAffiliateProfile);
router.patch('/admin/affiliates/:affiliateId/activate', authenticate, authorize([UserRole.ADMIN, UserRole.NATIONAL_COORDINATOR, UserRole.AFFILIATE]), affiliateController.activateAffiliate);
/**
 * Affiliate Routes - Dashboard & Stats
 */
router.get('/profile', authenticate, authorize([UserRole.AFFILIATE, UserRole.REGIONAL_COORDINATOR, UserRole.NATIONAL_COORDINATOR]), affiliateController.getAffiliateProfile);
router.get('/dashboard', authenticate, authorize([UserRole.AFFILIATE]), affiliateController.getAffiliateDashboard);
router.get('/referrals', authenticate, authorize([UserRole.AFFILIATE, UserRole.REGIONAL_COORDINATOR, UserRole.NATIONAL_COORDINATOR]), affiliateController.getMyReferrals);
router.get('/commissions', authenticate, authorize([UserRole.AFFILIATE, UserRole.REGIONAL_COORDINATOR, UserRole.NATIONAL_COORDINATOR]), affiliateController.getMyCommissions);
router.post('/profile', authenticate, authorize([UserRole.ADMIN, UserRole.AFFILIATE]), affiliateController.createAffiliateProfile);
router.post('/regenerate-code', authenticate, authorize([UserRole.AFFILIATE, UserRole.REGIONAL_COORDINATOR, UserRole.NATIONAL_COORDINATOR]), affiliateController.regenerateReferralCode);
/**
 * Admin Routes - Affiliate Management
 */
router.get('/admin/affiliates', authenticate, authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), affiliateController.listAffiliates);
router.patch('/admin/affiliates/:affiliateId/suspend', authenticate, authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), affiliateController.suspendAffiliate);
router.patch('/admin/affiliates/:affiliateId/unsuspend', authenticate, authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), affiliateController.unsuspendAffiliate);
router.patch('/admin/affiliates/:affiliateId/terminate', authenticate, authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), affiliateController.terminateAffiliate);
router.delete('/admin/affiliates/:affiliateId', authenticate, authorize([UserRole.ADMIN, UserRole.SUPER_ADMIN]), affiliateController.deleteAffiliate);
/**
 * Admin Routes - Financial & Reporting
 */
router.get('/admin/financial-overview', authenticate, authorize([UserRole.ADMIN]), affiliateController.getFinancialOverview);
router.get('/admin/system-ledger', authenticate, authorize([UserRole.ADMIN]), affiliateController.getSystemLedger);
router.get('/admin/payouts', authenticate, authorize([UserRole.ADMIN]), affiliateController.getPayoutBatches);
router.get('/admin/fraud-flags', authenticate, authorize([UserRole.ADMIN]), affiliateController.getFraudFlags);
/**
 * Admin Routes - Commission Tiers
 */
router.get('/admin/commission-tiers', authenticate, authorize([UserRole.ADMIN]), affiliateController.getCommissionTiers);
router.put('/admin/commission-tiers', authenticate, authorize([UserRole.ADMIN]), affiliateController.updateCommissionTiers);
/**
 * Regional Coordinator Routes
 */
router.get('/regional/dashboard', authenticate, authorize([UserRole.REGIONAL_COORDINATOR, UserRole.NATIONAL_COORDINATOR, UserRole.ADMIN]), affiliateController.getRegionalDashboard);
/**
 * National Coordinator Routes
 */
router.get('/national/dashboard', authenticate, authorize([UserRole.NATIONAL_COORDINATOR, UserRole.ADMIN]), affiliateController.getNationalDashboard);
export default router;
//# sourceMappingURL=routes.js.map