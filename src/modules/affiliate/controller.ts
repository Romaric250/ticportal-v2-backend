import type { Request, Response } from 'express';
import { AffiliateService } from './service';
import { UserRole } from '@prisma/client';
import { logger } from '../../shared/utils/logger';

/**
 * Affiliate System Controller
 * Handles HTTP requests for affiliate, regional, and national coordinator operations
 */
export class AffiliateController {

  /**
   * Admin: Create a new country
   */
  createCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, name, currency, studentPrice, platformFee, affiliateCommissionRate, regionalCommissionRate, nationalCommissionRate } = req.body;

      if (!code || !name) {
        res.status(400).json({ error: 'Country code and name are required' });
        return;
      }

      const country = await AffiliateService.createCountry({
        code,
        name,
        currency,
        studentPrice,
        platformFee,
        affiliateCommissionRate,
        regionalCommissionRate,
        nationalCommissionRate
      });
      res.status(201).json({ success: true, data: country });
    } catch (error: any) {
      logger.error('Error creating country:', error);
      res.status(500).json({ error: error.message || 'Failed to create country' });
    }
  };

  /**
   * Admin: Create a new region in a country
   */
  createRegion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { countryId, name } = req.body;

      if (!countryId || !name) {
        res.status(400).json({ error: 'Country ID and region name are required' });
        return;
      }

      const region = await AffiliateService.createRegion({ countryId, name });
      res.status(201).json({ success: true, data: region });
    } catch (error: any) {
      logger.error('Error creating region:', error);
      res.status(500).json({ error: error.message || 'Failed to create region' });
    }
  };

  /**
   * Admin: Update a country
   */
  updateCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { countryId } = req.params;
      const updateData = req.body;

      if (!countryId) {
        res.status(400).json({ error: 'Country ID is required' });
        return;
      }

      const country = await AffiliateService.updateCountry(countryId, updateData);
      res.status(200).json({ success: true, data: country });
    } catch (error: any) {
      logger.error('Error updating country:', error);
      res.status(500).json({ error: error.message || 'Failed to update country' });
    }
  };

  /**
   * Admin: Delete a country
   */
  deleteCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { countryId } = req.params;

      if (!countryId) {
        res.status(400).json({ error: 'Country ID is required' });
        return;
      }

      const result = await AffiliateService.deleteCountry(countryId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error deleting country:', error);
      res.status(500).json({ error: error.message || 'Failed to delete country' });
    }
  };

  /**
   * Admin: Update a region
   */
  updateRegion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { regionId } = req.params;
      const updateData = req.body;

      if (!regionId) {
        res.status(400).json({ error: 'Region ID is required' });
        return;
      }

      const region = await AffiliateService.updateRegion(regionId, updateData);
      res.status(200).json({ success: true, data: region });
    } catch (error: any) {
      logger.error('Error updating region:', error);
      res.status(500).json({ error: error.message || 'Failed to update region' });
    }
  };

  /**
   * Admin: Delete a region
   */
  deleteRegion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { regionId } = req.params;

      if (!regionId) {
        res.status(400).json({ error: 'Region ID is required' });
        return;
      }

      const result = await AffiliateService.deleteRegion(regionId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error deleting region:', error);
      res.status(500).json({ error: error.message || 'Failed to delete region' });
    }
  };

  /**
   * Admin: Update user role (Affiliate, Regional Coordinator, National Coordinator)
   */
  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, newRole, countryId, regionId, assignedBy } = req.body;

      if (!userId || !newRole) {
        res.status(400).json({ error: 'User ID and new role are required' });
        return;
      }

      // Validate role
      const validRoles: UserRole[] = [
        UserRole.AFFILIATE,
        UserRole.REGIONAL_COORDINATOR,
        UserRole.NATIONAL_COORDINATOR,
        UserRole.STUDENT,
        UserRole.MENTOR,
        UserRole.ADMIN
      ];

      if (!validRoles.includes(newRole as UserRole)) {
        res.status(400).json({ error: 'Invalid role specified' });
        return;
      }

      const adminId = (req as any).user?.userId || assignedBy;

      const result = await AffiliateService.updateUserRole(adminId, {
        userId,
        newRole: newRole as UserRole,
        countryId,
        regionId
      });

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error updating user role:', error);
      res.status(500).json({ error: error.message || 'Failed to update user role' });
    }
  };

  /**
   * Admin: Activate or deactivate an affiliate
   */
  activateAffiliate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { affiliateId } = req.params;
      const { bankName, accountNumber, accountName, mobileMoneyNumber, mobileMoneyProvider, reason } = req.body;

      if (!affiliateId) {
        res.status(400).json({ error: 'Affiliate ID is required' });
        return;
      }

      const adminId = (req as any).user?.userId;

      const result = await AffiliateService.activateAffiliate(adminId, {
        affiliateId,
        bankName,
        accountNumber,
        accountName,
        mobileMoneyNumber,
        mobileMoneyProvider,
        reason
      });

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error activating affiliate:', error);
      res.status(500).json({ error: error.message || 'Failed to activate affiliate' });
    }
  };

  /**
   * Public: Validate a referral code
   */
  validateReferralCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { referralCode } = req.params;

      if (!referralCode) {
        res.status(400).json({ error: 'Referral code is required' });
        return;
      }

      const affiliate = await AffiliateService.validateReferralCode(referralCode);
      res.status(200).json({ success: true, data: affiliate });
    } catch (error: any) {
      logger.error('Error validating referral code:', error);
      res.status(400).json({ error: error.message || 'Invalid referral code' });
    }
  };

  /**
   * Affiliate: Get own dashboard stats
   */
  getAffiliateDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const dashboard = await AffiliateService.getAffiliateDashboard(userId);
      res.status(200).json({ success: true, data: dashboard });
    } catch (error: any) {
      logger.error('Error fetching affiliate dashboard:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch dashboard' });
    }
  };

  /**
   * Regional Coordinator: Get dashboard stats
   */
  getRegionalDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const dashboard = await AffiliateService.getRegionalCoordinatorDashboard(userId);
      res.status(200).json({ success: true, data: dashboard });
    } catch (error: any) {
      logger.error('Error fetching regional dashboard:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch dashboard' });
    }
  };

  /**
   * National Coordinator: Get dashboard stats
   */
  getNationalDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const dashboard = await AffiliateService.getNationalCoordinatorDashboard(userId);
      res.status(200).json({ success: true, data: dashboard });
    } catch (error: any) {
      logger.error('Error fetching national dashboard:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch dashboard' });
    }
  };

  /**
   * Admin: Get list of all countries
   */
  getCountries = async (req: Request, res: Response): Promise<void> => {
    try {
      const countries = await AffiliateService.getCountries();
      res.status(200).json({ success: true, data: countries });
    } catch (error: any) {
      logger.error('Error fetching countries:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch countries' });
    }
  };

  /**
   * Admin: Get regions for a country
   */
  getRegionsByCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { countryId } = req.params;

      if (!countryId) {
        res.status(400).json({ error: 'Country ID is required' });
        return;
      }

      const regions = await AffiliateService.getRegionsByCountry(countryId);
      res.status(200).json({ success: true, data: regions });
    } catch (error: any) {
      logger.error('Error fetching regions:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch regions' });
    }
  };

  /**
   * Affiliate/Coordinator: Get own referrals
   */
  getMyReferrals = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      const { status, page = '1', limit = '20' } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const referrals = await AffiliateService.getReferrals(
        userId,
        status as string | undefined,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({ success: true, data: referrals });
    } catch (error: any) {
      logger.error('Error fetching referrals:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch referrals' });
    }
  };

  /**
   * Affiliate/Coordinator: Get own commissions
   */
  getMyCommissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      const { status, type, page = '1', limit = '20' } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const commissions = await AffiliateService.getCommissions(
        userId,
        status as string | undefined,
        type as string | undefined,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({ success: true, data: commissions });
    } catch (error: any) {
      logger.error('Error fetching commissions:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch commissions' });
    }
  };

  /**
   * Get affiliate profile for authenticated user
   */
  getAffiliateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const profile = await AffiliateService.getAffiliateProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      logger.error('Error fetching affiliate profile:', error);
      res.status(404).json({ error: error.message || 'Affiliate profile not found' });
    }
  };

  /**
   * Create affiliate profile
   */
  createAffiliateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        userId,
        subRole,
        regionId,
        countryId,
        status,
        tier,
        bankName,
        accountNumber,
        accountName,
        mobileMoneyNumber,
        mobileMoneyProvider
      } = req.body;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      // Validate that either regionId or countryId is provided based on subRole
      if (subRole === 'NATIONAL_COORDINATOR' && !countryId) {
        res.status(400).json({ error: 'Country ID is required for National Coordinator' });
        return;
      }

      if ((subRole === 'AFFILIATE' || subRole === 'REGIONAL_COORDINATOR') && !regionId) {
        res.status(400).json({ error: 'Region ID is required for Affiliate or Regional Coordinator' });
        return;
      }

      const profile = await AffiliateService.createAffiliateProfile(
        userId,
        regionId,
        subRole,
        {
          countryId,
          status,
          tier,
          bankName,
          accountNumber,
          accountName,
          mobileMoneyNumber,
          mobileMoneyProvider
        }
      );
      res.status(201).json({ success: true, data: profile });
    } catch (error: any) {
      logger.error('Error creating affiliate profile:', error);
      res.status(500).json({ error: error.message || 'Failed to create affiliate profile' });
    }
  };

  /**
   * Regenerate referral code
   */
  regenerateReferralCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await AffiliateService.regenerateReferralCode(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error regenerating referral code:', error);
      res.status(500).json({ error: error.message || 'Failed to regenerate referral code' });
    }
  };

  /**
   * Admin: List all affiliates
   */
  listAffiliates = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, status, search, regionId, countryId } = req.query;

      const params: any = {};
      if (page) params.page = parseInt(page as string);
      if (limit) params.limit = parseInt(limit as string);
      if (status) params.status = status;
      if (search) params.search = search as string;
      if (regionId) params.regionId = regionId as string;
      if (countryId) params.countryId = countryId as string;

      const result = await AffiliateService.listAffiliates(params);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error listing affiliates:', error);
      res.status(500).json({ error: error.message || 'Failed to list affiliates' });
    }
  };

  /**
   * Admin: Suspend affiliate
   */
  suspendAffiliate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { affiliateId } = req.params;
      const { reason } = req.body;

      if (!affiliateId) {
        res.status(400).json({ error: 'Affiliate ID is required' });
        return;
      }

      const result = await AffiliateService.suspendAffiliate(affiliateId, reason);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error suspending affiliate:', error);
      res.status(500).json({ error: error.message || 'Failed to suspend affiliate' });
    }
  };

  /**
   * Admin: Unsuspend affiliate
   */
  unsuspendAffiliate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { affiliateId } = req.params;

      if (!affiliateId) {
        res.status(400).json({ error: 'Affiliate ID is required' });
        return;
      }

      const result = await AffiliateService.unsuspendAffiliate(affiliateId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error unsuspending affiliate:', error);
      res.status(500).json({ error: error.message || 'Failed to unsuspend affiliate' });
    }
  };

  /**
   * Admin: Get financial overview
   */
  getFinancialOverview = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await AffiliateService.getFinancialOverview();
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error fetching financial overview:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch financial overview' });
    }
  };

  /**
   * Admin: Get system ledger
   */
  getSystemLedger = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, startDate, endDate } = req.query;

      const params: any = {};
      if (page) params.page = parseInt(page as string);
      if (limit) params.limit = parseInt(limit as string);
      if (startDate) params.startDate = new Date(startDate as string);
      if (endDate) params.endDate = new Date(endDate as string);

      const result = await AffiliateService.getSystemLedger(params);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error fetching system ledger:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch system ledger' });
    }
  };

  /**
   * Admin: Get payout batches
   */
  getPayoutBatches = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, status } = req.query;

      const params: any = {};
      if (page) params.page = parseInt(page as string);
      if (limit) params.limit = parseInt(limit as string);
      if (status) params.status = status as string;

      const result = await AffiliateService.getPayoutBatches(params);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error fetching payout batches:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch payout batches' });
    }
  };

  /**
   * Admin: Get fraud flags
   */
  getFraudFlags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, severity, resolved, type } = req.query;

      const params: any = {};
      if (page) params.page = parseInt(page as string);
      if (limit) params.limit = parseInt(limit as string);
      if (severity) params.severity = severity as string;
      if (resolved !== undefined) params.resolved = resolved === 'true';
      if (type) params.type = type as string;

      const result = await AffiliateService.getFraudFlags(params);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error fetching fraud flags:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch fraud flags' });
    }
  };

  /**
   * Admin: Get commission tier configuration
   */
  getCommissionTiers = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await AffiliateService.getCommissionTiers();
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error fetching commission tiers:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch commission tiers' });
    }
  };

  /**
   * Admin: Update commission tier configuration
   */
  updateCommissionTiers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tier, affiliateRate, regionalRate, nationalRate } = req.body;
      const adminId = (req as any).user?.userId;

      if (!tier || affiliateRate === undefined || regionalRate === undefined || nationalRate === undefined) {
        res.status(400).json({ error: 'Tier and all rates are required' });
        return;
      }

      if (!adminId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await AffiliateService.updateCommissionTiers({
        tier,
        affiliateRate,
        regionalRate,
        nationalRate
      }, adminId);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error updating commission tiers:', error);
      res.status(500).json({ error: error.message || 'Failed to update commission tiers' });
    }
  };
}
