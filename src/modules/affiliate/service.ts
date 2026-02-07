import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import type { 
  CreateCountryInput, 
  CreateRegionInput, 
  UpdateUserRoleInput,
  ActivateAffiliateInput,
  AffiliateDashboard,
  ReferralCodeValidation
} from "./types";
import { UserRole, AffiliateStatus, AffiliateSubRole, AffiliateTier } from "@prisma/client";
import { sendRoleChangeEmail, sendAffiliateActivationEmail } from "../../shared/utils/email";

export class AffiliateService {
  
  static async createCountry(input: CreateCountryInput) {
    const country = await db.country.create({
      data: {
        name: input.name,
        code: input.code,
        currency: input.currency || "CFA",
        studentPrice: input.studentPrice || 5000,
        platformFee: input.platformFee || 300,
        affiliateCommissionRate: input.affiliateCommissionRate || 9,
        regionalCommissionRate: input.regionalCommissionRate || 6,
        nationalCommissionRate: input.nationalCommissionRate || 5,
      }
    });

    logger.info({ countryId: country.id }, "Country created");
    return country;
  }

  static async createRegion(input: CreateRegionInput) {
    const region = await db.region.create({
      data: {
        name: input.name,
        countryId: input.countryId,
      },
      include: {
        country: true
      }
    });

    logger.info({ regionId: region.id }, "Region created");
    return region;
  }

  /**
   * Admin: Update a country
   */
  static async updateCountry(countryId: string, input: Partial<CreateCountryInput>) {
    const country = await db.country.findUnique({
      where: { id: countryId }
    });

    if (!country) {
      throw new Error("Country not found");
    }

    const updated = await db.country.update({
      where: { id: countryId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.code && { code: input.code }),
        ...(input.currency && { currency: input.currency }),
        ...(input.studentPrice !== undefined && { studentPrice: input.studentPrice }),
        ...(input.platformFee !== undefined && { platformFee: input.platformFee }),
        ...(input.affiliateCommissionRate !== undefined && { affiliateCommissionRate: input.affiliateCommissionRate }),
        ...(input.regionalCommissionRate !== undefined && { regionalCommissionRate: input.regionalCommissionRate }),
        ...(input.nationalCommissionRate !== undefined && { nationalCommissionRate: input.nationalCommissionRate }),
      }
    });

    logger.info({ countryId }, "Country updated");
    return updated;
  }

  /**
   * Admin: Delete a country (cascades to regions)
   */
  static async deleteCountry(countryId: string) {
    const country = await db.country.findUnique({
      where: { id: countryId },
      include: {
        regions: true,
        affiliates: true,
        payments: true
      }
    });

    if (!country) {
      throw new Error("Country not found");
    }

    // Check if country has dependencies
    if (country.affiliates.length > 0) {
      throw new Error("Cannot delete country with existing affiliate profiles");
    }

    if (country.payments.length > 0) {
      throw new Error("Cannot delete country with existing payments");
    }

    // Delete all regions first (they will be cascade deleted by Prisma if configured)
    await db.country.delete({
      where: { id: countryId }
    });

    logger.info({ countryId, regionsDeleted: country.regions.length }, "Country deleted");
    return { success: true, message: "Country and associated regions deleted successfully" };
  }

  /**
   * Admin: Update a region
   */
  static async updateRegion(regionId: string, input: Partial<CreateRegionInput>) {
    const region = await db.region.findUnique({
      where: { id: regionId }
    });

    if (!region) {
      throw new Error("Region not found");
    }

    const updated = await db.region.update({
      where: { id: regionId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.countryId && { countryId: input.countryId }),
      },
      include: {
        country: true
      }
    });

    logger.info({ regionId }, "Region updated");
    return updated;
  }

  /**
   * Admin: Delete a region
   */
  static async deleteRegion(regionId: string) {
    const region = await db.region.findUnique({
      where: { id: regionId },
      include: {
        affiliates: true
      }
    });

    if (!region) {
      throw new Error("Region not found");
    }

    // Check if region has affiliates
    if (region.affiliates.length > 0) {
      throw new Error("Cannot delete region with existing affiliate profiles");
    }

    await db.region.delete({
      where: { id: regionId }
    });

    logger.info({ regionId }, "Region deleted");
    return { success: true, message: "Region deleted successfully" };
  }

  static async updateUserRole(adminId: string, input: UpdateUserRoleInput) {
    const user = await db.user.findUnique({
      where: { id: input.userId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const oldRole = user.role;
    
    await db.user.update({
      where: { id: input.userId },
      data: { role: input.newRole as UserRole }
    });

    if (input.newRole === "AFFILIATE" && input.regionId) {
      const region = await db.region.findUnique({
        where: { id: input.regionId },
        include: { country: true }
      });

      if (!region) {
        throw new Error("Region not found");
      }

      const referralCode = this.generateReferralCode(user, region);
      const referralLink = `${process.env.CLIENT_URL}/signup?ref=${referralCode}`;

      await db.affiliateProfile.create({
        data: {
          userId: input.userId,
          regionId: input.regionId,
          referralCode,
          referralLink,
          status: AffiliateStatus.PENDING,
          subRole: AffiliateSubRole.AFFILIATE,
          activatedBy: adminId
        }
      });

      await db.userActivity.create({
        data: {
          userId: input.userId,
          type: "GAMIFICATION",
          action: "ROLE_CHANGED_TO_AFFILIATE",
          metadata: {
            oldRole,
            newRole: input.newRole,
            regionId: input.regionId,
            regionName: region.name,
            countryName: region.country.name,
            referralCode,
            changedBy: adminId
          }
        }
      });

      await sendRoleChangeEmail(user, input.newRole as UserRole, {
        regionName: region.name,
        countryName: region.country.name,
        referralCode,
        referralLink
      });
    }

    if (input.newRole === "REGIONAL_COORDINATOR" && input.regionId) {
      const region = await db.region.findUnique({
        where: { id: input.regionId },
        include: { country: true }
      });

      if (!region) {
        throw new Error("Region not found");
      }

      const referralCode = this.generateReferralCode(user, region);
      const referralLink = `${process.env.CLIENT_URL}/pay?ref=${referralCode}`;

      await db.affiliateProfile.create({
        data: {
          userId: input.userId,
          regionId: input.regionId,
          referralCode,
          referralLink,
          status: AffiliateStatus.ACTIVE,
          subRole: AffiliateSubRole.REGIONAL_COORDINATOR,
          assignedAt: new Date(),
          assignedBy: adminId
        }
      });

      await sendRoleChangeEmail(user, input.newRole as UserRole, {
        regionName: region?.name,
        countryName: region?.country.name
      });
    }

    if (input.newRole === "NATIONAL_COORDINATOR" && input.countryId) {
      const country = await db.country.findUnique({
        where: { id: input.countryId }
      });

      if (!country) {
        throw new Error("Country not found");
      }

      // Generate a unique referral code for national coordinator
      const nameSlug = user.firstName.toUpperCase().substring(0, 6);
      const countrySlug = country.code.toUpperCase();
      const year = new Date().getFullYear();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const referralCode = `TIC-${countrySlug}-NC-${nameSlug}-${year}-${random}`;
      const referralLink = `${process.env.CLIENT_URL}/pay?ref=${referralCode}`;

      await db.affiliateProfile.create({
        data: {
          userId: input.userId,
          countryId: input.countryId,
          referralCode,
          referralLink,
          status: AffiliateStatus.ACTIVE,
          subRole: AffiliateSubRole.NATIONAL_COORDINATOR,
          assignedAt: new Date(),
          assignedBy: adminId
        }
      });

      await sendRoleChangeEmail(user, input.newRole as UserRole, {
        countryName: country?.name
      });
    }

    logger.info({ userId: input.userId, oldRole, newRole: input.newRole }, "User role updated");

    return { success: true, oldRole, newRole: input.newRole };
  }

  static async activateAffiliate(adminId: string, input: ActivateAffiliateInput) {
    const profile = await db.affiliateProfile.findUnique({
      where: { id: input.affiliateId },
      include: {
        user: true,
        region: {
          include: { country: true }
        }
      }
    });

    if (!profile) {
      throw new Error("Affiliate profile not found");
    }

    if (profile.status === AffiliateStatus.ACTIVE) {
      throw new Error("Affiliate already active");
    }

    const updatedProfile = await db.affiliateProfile.update({
      where: { id: input.affiliateId },
      data: {
        status: AffiliateStatus.ACTIVE,
        activatedAt: new Date(),
        activatedBy: adminId,
        ...(input.bankName !== undefined && { bankName: input.bankName }),
        ...(input.accountNumber !== undefined && { accountNumber: input.accountNumber }),
        ...(input.accountName !== undefined && { accountName: input.accountName }),
        ...(input.mobileMoneyNumber !== undefined && { mobileMoneyNumber: input.mobileMoneyNumber }),
        ...(input.mobileMoneyProvider !== undefined && { mobileMoneyProvider: input.mobileMoneyProvider })
      }
    });

    await db.userActivity.create({
      data: {
        userId: profile.userId,
        type: "GAMIFICATION",
        action: "AFFILIATE_ACTIVATED",
        metadata: {
          affiliateId: input.affiliateId,
          referralCode: profile.referralCode,
          activatedBy: adminId
        }
      }
    });

    await sendAffiliateActivationEmail(profile.user, profile);

    logger.info({ affiliateId: input.affiliateId }, "Affiliate activated");

    return updatedProfile;
  }

  static async validateReferralCode(code: string): Promise<ReferralCodeValidation> {
    const affiliate = await db.affiliateProfile.findUnique({
      where: { referralCode: code },
      include: {
        user: true,
        region: {
          include: { country: true }
        },
        country: true
      }
    });

    if (!affiliate) {
      return {
        valid: false,
        message: "Invalid referral code"
      };
    }

    if (affiliate.status !== AffiliateStatus.ACTIVE) {
      return {
        valid: false,
        message: "This referral code is not active"
      };
    }

    return {
      valid: true,
      affiliateId: affiliate.id,
      affiliateName: `${affiliate.user.firstName} ${affiliate.user.lastName}`,
      ...(affiliate.regionId && { regionId: affiliate.regionId }),
      regionName: affiliate.region?.name || affiliate.country?.name || "N/A"
    };
  }

  static async getAffiliateDashboard(userId: string): Promise<AffiliateDashboard> {
    const profile = await db.affiliateProfile.findUnique({
      where: { userId },
      include: {
        region: {
          include: { country: true }
        },
        country: true,
        referrals: {
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { registeredAt: 'desc' },
          take: 10
        }
      }
    });

    if (!profile) {
      throw new Error("Affiliate profile not found");
    }

    const commissions = await db.commission.findMany({
      where: {
        affiliateProfileId: profile.id
      }
    });

    const earnings = {
      pending: commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.commissionAmount, 0),
      earned: commissions.filter(c => c.status === 'EARNED').reduce((sum, c) => sum + c.commissionAmount, 0),
      approved: commissions.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + c.commissionAmount, 0),
      paid: commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.commissionAmount, 0),
      total: commissions.reduce((sum, c) => sum + c.commissionAmount, 0)
    };

    const activeReferrals = profile.referrals.filter(r => r.status === 'ACTIVATED').length;
    const pendingActivation = profile.referrals.filter(r => r.status === 'PAID').length;
    const conversionRate = profile.totalReferrals > 0 
      ? (activeReferrals / profile.totalReferrals) * 100 
      : 0;

    const locationName = profile.region 
      ? `${profile.region.name}, ${profile.region.country.name}`
      : profile.country?.name || 'N/A';

    return {
      profile: {
        referralCode: profile.referralCode,
        referralLink: profile.referralLink,
        status: profile.status,
        tier: profile.tier,
        region: locationName
      },
      stats: {
        totalReferrals: profile.totalReferrals,
        activeReferrals,
        pendingActivation,
        conversionRate: Math.round(conversionRate * 10) / 10
      },
      earnings,
      recentReferrals: profile.referrals.map(r => ({
        id: r.id,
        studentName: `${r.student.firstName} ${r.student.lastName}`,
        registeredAt: r.registeredAt,
        status: r.status,
        commissionAmount: 450
      }))
    };
  }

  private static generateReferralCode(user: any, region: any): string {
    const regionSlug = region.name.toUpperCase().replace(/\s+/g, '-').substring(0, 10);
    const nameSlug = user.firstName.toUpperCase().substring(0, 6);
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `TIC-${regionSlug}-${nameSlug}-${year}-${random}`;
  }

  /**
   * Get referrals for a user (affiliate/coordinator)
   */
  static async getReferrals(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    // Get the user's affiliate profile
    const profile = await db.affiliateProfile.findUnique({ where: { userId } });
    
    if (!profile) {
      throw new Error('User does not have an affiliate profile');
    }

    const whereClause: any = {};

    // Filter based on subRole
    if (profile.subRole === AffiliateSubRole.AFFILIATE) {
      whereClause.affiliateId = profile.id;
    } else if (profile.subRole === AffiliateSubRole.REGIONAL_COORDINATOR || profile.subRole === AffiliateSubRole.ASSISTANT_REGIONAL_COORDINATOR) {
      whereClause.regionId = profile.regionId;
    } else if (profile.subRole === AffiliateSubRole.NATIONAL_COORDINATOR || profile.subRole === AffiliateSubRole.ASSISTANT_NATIONAL_COORDINATOR) {
      whereClause.countryId = profile.countryId;
    }

    if (status) {
      whereClause.status = status;
    }

    const [referrals, total] = await Promise.all([
      db.studentReferral.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              verifiedAt: true
            }
          },
          affiliate: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: { registeredAt: 'desc' },
        skip,
        take: limit
      }),
      db.studentReferral.count({ where: whereClause })
    ]);

    return {
      referrals,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get commissions for a user
   */
  static async getCommissions(
    userId: string,
    status?: string,
    type?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId: userId
    };

    if (status) {
      whereClause.status = status;
    }

    if (type) {
      whereClause.type = type;
    }

    const [commissions, total] = await Promise.all([
      db.commission.findMany({
        where: whereClause,
        include: {
          referral: {
            include: {
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          affiliateProfile: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          payoutBatch: true
        },
        orderBy: { earnedAt: 'desc' },
        skip,
        take: limit
      }),
      db.commission.count({ where: whereClause })
    ]);

    return {
      commissions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get Regional Coordinator Dashboard
   */
  static async getRegionalCoordinatorDashboard(userId: string) {
    const profile = await db.affiliateProfile.findUnique({
      where: { userId },
      include: {
        region: {
          include: {
            country: true,
            affiliates: {
              where: {
                subRole: AffiliateSubRole.AFFILIATE
              },
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        commissions: true
      }
    });

    if (!profile || (profile.subRole !== AffiliateSubRole.REGIONAL_COORDINATOR && profile.subRole !== AffiliateSubRole.ASSISTANT_REGIONAL_COORDINATOR)) {
      throw new Error('Regional coordinator profile not found');
    }

    if (!profile.region) {
      throw new Error('Regional coordinator must have a region');
    }

    const affiliatesInRegion = profile.region.affiliates;
    const activeAffiliates = affiliatesInRegion.filter((a: any) => a.status === 'ACTIVE').length;

    // Get referrals for this region
    const totalReferrals = await db.studentReferral.count({
      where: {
        regionId: profile.regionId!
      }
    });

    const activeReferrals = await db.studentReferral.count({
      where: {
        status: 'ACTIVATED',
        regionId: profile.regionId!
      }
    });

    const earnings = profile.commissions.reduce((acc: any, comm: any) => {
      acc[comm.status.toLowerCase()] = (acc[comm.status.toLowerCase()] || 0) + comm.commissionAmount;
      acc.total += comm.commissionAmount;
      return acc;
    }, { pending: 0, earned: 0, approved: 0, paid: 0, total: 0 });

    return {
      profile: {
        region: `${profile.region.name}, ${profile.region.country.name}`,
        status: profile.status,
        totalAffiliates: affiliatesInRegion.length,
        activeAffiliates
      },
      stats: {
        totalReferrals,
        activeReferrals,
        conversionRate: totalReferrals > 0 ? Math.round((activeReferrals / totalReferrals) * 1000) / 10 : 0
      },
      earnings,
      affiliates: affiliatesInRegion.map((a: any) => ({
        id: a.id,
        name: `${a.user.firstName} ${a.user.lastName}`,
        email: a.user.email,
        status: a.status,
        referralCode: a.referralCode,
        totalReferrals: a.totalReferrals
      }))
    };
  }

  /**
   * Get National Coordinator Dashboard
   */
  static async getNationalCoordinatorDashboard(userId: string) {
    const profile = await db.affiliateProfile.findUnique({
      where: { userId },
      include: {
        country: {
          include: {
            regions: {
              include: {
                affiliates: true
              }
            }
          }
        },
        commissions: true
      }
    });

    if (!profile || (profile.subRole !== AffiliateSubRole.NATIONAL_COORDINATOR && profile.subRole !== AffiliateSubRole.ASSISTANT_NATIONAL_COORDINATOR)) {
      throw new Error('National coordinator profile not found');
    }

    if (!profile.country) {
      throw new Error('National coordinator must have a country');
    }

    const totalRegions = profile.country.regions.length;
    const allAffiliates = profile.country.regions.flatMap((r: any) => r.affiliates);
    const totalAffiliates = allAffiliates.filter((a: any) => a.subRole === AffiliateSubRole.AFFILIATE).length;
    const activeAffiliates = allAffiliates.filter((a: any) => a.subRole === AffiliateSubRole.AFFILIATE && a.status === 'ACTIVE').length;
    const totalRegionalCoordinators = allAffiliates.filter(
      (a: any) => a.subRole === AffiliateSubRole.REGIONAL_COORDINATOR || a.subRole === AffiliateSubRole.ASSISTANT_REGIONAL_COORDINATOR
    ).length;

    // Get referrals for this country
    const totalReferrals = await db.studentReferral.count({
      where: {
        countryId: profile.countryId!
      }
    });

    const activeReferrals = await db.studentReferral.count({
      where: {
        status: 'ACTIVATED',
        countryId: profile.countryId!
      }
    });

    const earnings = profile.commissions.reduce((acc: any, comm: any) => {
      acc[comm.status.toLowerCase()] = (acc[comm.status.toLowerCase()] || 0) + comm.commissionAmount;
      acc.total += comm.commissionAmount;
      return acc;
    }, { pending: 0, earned: 0, approved: 0, paid: 0, total: 0 });

    return {
      profile: {
        country: profile.country.name,
        status: profile.status,
        totalRegions,
        totalAffiliates,
        activeAffiliates,
        totalRegionalCoordinators
      },
      stats: {
        totalReferrals,
        activeReferrals,
        conversionRate: totalReferrals > 0 ? Math.round((activeReferrals / totalReferrals) * 1000) / 10 : 0
      },
      earnings,
      regions: profile.country.regions.map((r: any) => ({
        id: r.id,
        name: r.name,
        affiliatesCount: r.affiliates.filter((a: any) => a.subRole === AffiliateSubRole.AFFILIATE).length,
        activeAffiliatesCount: r.affiliates.filter((a: any) => a.subRole === AffiliateSubRole.AFFILIATE && a.status === 'ACTIVE').length,
        coordinatorsCount: r.affiliates.filter((a: any) => a.subRole === AffiliateSubRole.REGIONAL_COORDINATOR || a.subRole === AffiliateSubRole.ASSISTANT_REGIONAL_COORDINATOR).length
      }))
    };
  }

  /**
   * Get all countries
   */
  static async getCountries() {
    const countries = await db.country.findMany({
      include: {
        regions: true
      },
      orderBy: { name: 'asc' }
    });

    // Get counts manually
    const countriesWithCounts = await Promise.all(
      countries.map(async (country) => {
        const affiliatesCount = await db.affiliateProfile.count({
          where: { 
            countryId: country.id,
            subRole: AffiliateSubRole.AFFILIATE
          }
        });
        const regionalCoordinatorsCount = await db.affiliateProfile.count({
          where: { 
            countryId: country.id,
            subRole: {
              in: [AffiliateSubRole.REGIONAL_COORDINATOR, AffiliateSubRole.ASSISTANT_REGIONAL_COORDINATOR]
            }
          }
        });
        const nationalCoordinatorsCount = await db.affiliateProfile.count({
          where: { 
            countryId: country.id,
            subRole: {
              in: [AffiliateSubRole.NATIONAL_COORDINATOR, AffiliateSubRole.ASSISTANT_NATIONAL_COORDINATOR]
            }
          }
        });

        return {
          ...country,
          _count: {
            affiliates: affiliatesCount,
            regionalCoordinators: regionalCoordinatorsCount,
            nationalCoordinators: nationalCoordinatorsCount
          }
        };
      })
    );

    return countriesWithCounts;
  }

  /**
   * Get regions by country
   */
  static async getRegionsByCountry(countryId: string) {
    const regions = await db.region.findMany({
      where: { countryId },
      include: {
        country: true
      },
      orderBy: { name: 'asc' }
    });

    // Get counts manually
    const regionsWithCounts = await Promise.all(
      regions.map(async (region) => {
        const affiliatesCount = await db.affiliateProfile.count({
          where: { 
            regionId: region.id,
            subRole: AffiliateSubRole.AFFILIATE
          }
        });
        const regionalCoordinatorsCount = await db.affiliateProfile.count({
          where: { 
            regionId: region.id,
            subRole: {
              in: [AffiliateSubRole.REGIONAL_COORDINATOR, AffiliateSubRole.ASSISTANT_REGIONAL_COORDINATOR]
            }
          }
        });

        return {
          ...region,
          _count: {
            affiliates: affiliatesCount,
            regionalCoordinators: regionalCoordinatorsCount
          }
        };
      })
    );

    return regionsWithCounts;
  }

  /**
   * Get affiliate profile for authenticated user
   */
  static async getAffiliateProfile(userId: string) {
    const profile = await db.affiliateProfile.findUnique({
      where: { userId },
      include: {
        region: {
          include: { country: true }
        },
        country: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!profile) {
      throw new Error("Affiliate profile not found");
    }

    return {
      id: profile.id,
      userId: profile.userId,
      subRole: profile.subRole,
      referralCode: profile.referralCode,
      referralLink: profile.referralLink,
      status: profile.status,
      tier: profile.tier,
      region: profile.region ? {
        id: profile.region.id,
        name: profile.region.name,
        country: {
          id: profile.region.country.id,
          name: profile.region.country.name,
          code: profile.region.country.code
        }
      } : null,
      country: profile.country ? {
        id: profile.country.id,
        name: profile.country.name,
        code: profile.country.code
      } : null,
      totalReferrals: profile.totalReferrals,
      activeReferrals: profile.activeReferrals,
      totalStudents: profile.totalStudents,
      totalEarned: profile.totalEarned,
      totalPaid: profile.totalPaid,
      bankName: profile.bankName,
      accountNumber: profile.accountNumber,
      accountName: profile.accountName,
      mobileMoneyNumber: profile.mobileMoneyNumber,
      mobileMoneyProvider: profile.mobileMoneyProvider,
      activatedAt: profile.activatedAt,
      assignedAt: profile.assignedAt,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };
  }

  /**
   * Create affiliate profile manually
   */
  static async createAffiliateProfile(
    userId: string, 
    regionId: string, 
    subRole: AffiliateSubRole = AffiliateSubRole.AFFILIATE,
    additionalData?: {
      countryId?: string;
      status?: AffiliateStatus;
      tier?: AffiliateTier;
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
      mobileMoneyNumber?: string;
      mobileMoneyProvider?: string;
    }
  ) {
    // Check if user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    // Check if profile already exists
    const existingProfile = await db.affiliateProfile.findUnique({ where: { userId } });
    if (existingProfile) {
      throw new Error("Affiliate profile already exists for this user");
    }

    // Get region details
    const region = await db.region.findUnique({
      where: { id: regionId },
      include: { country: true }
    });

    if (!region) {
      throw new Error("Region not found");
    }

    // Generate referral code
    const referralCode = this.generateReferralCode(user, region);
    const referralLink = `${process.env.CLIENT_URL}/pay?ref=${referralCode}`;

    // Create profile
    const profile = await db.affiliateProfile.create({
      data: {
        userId,
        regionId,
        ...(additionalData?.countryId && { countryId: additionalData.countryId }),
        subRole,
        referralCode,
        referralLink,
        status: additionalData?.status || AffiliateStatus.PENDING,
        ...(additionalData?.tier && { tier: additionalData.tier }),
        ...(additionalData?.bankName && { bankName: additionalData.bankName }),
        ...(additionalData?.accountNumber && { accountNumber: additionalData.accountNumber }),
        ...(additionalData?.accountName && { accountName: additionalData.accountName }),
        ...(additionalData?.mobileMoneyNumber && { mobileMoneyNumber: additionalData.mobileMoneyNumber }),
        ...(additionalData?.mobileMoneyProvider && { mobileMoneyProvider: additionalData.mobileMoneyProvider })
      },
      include: {
        region: {
          include: { country: true }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    logger.info({ profileId: profile.id, userId, referralCode }, "Affiliate profile created");

    return profile;
  }

  /**
   * Regenerate referral code for an affiliate
   */
  static async regenerateReferralCode(userId: string) {
    const profile = await db.affiliateProfile.findUnique({
      where: { userId },
      include: {
        region: {
          include: { country: true }
        },
        country: true,
        user: true
      }
    });

    if (!profile) {
      throw new Error("Affiliate profile not found");
    }

    let newReferralCode: string;

    // Generate code based on subRole
    if (profile.subRole === AffiliateSubRole.NATIONAL_COORDINATOR || profile.subRole === AffiliateSubRole.ASSISTANT_NATIONAL_COORDINATOR) {
      if (!profile.country) {
        throw new Error("National coordinator must have a country");
      }
      const nameSlug = profile.user.firstName.toUpperCase().substring(0, 6);
      const countrySlug = profile.country.code.toUpperCase();
      const year = new Date().getFullYear();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      newReferralCode = `TIC-${countrySlug}-NC-${nameSlug}-${year}-${random}`;
    } else {
      if (!profile.region) {
        throw new Error("Affiliate/Regional coordinator must have a region");
      }
      newReferralCode = this.generateReferralCode(profile.user, profile.region);
    }

    const newReferralLink = `${process.env.CLIENT_URL}/pay?ref=${newReferralCode}`;

    // Update profile
    const updatedProfile = await db.affiliateProfile.update({
      where: { userId },
      data: {
        referralCode: newReferralCode,
        referralLink: newReferralLink
      }
    });

    logger.info({ 
      profileId: profile.id, 
      userId, 
      oldCode: profile.referralCode, 
      newCode: newReferralCode 
    }, "Referral code regenerated");

    return {
      oldReferralCode: profile.referralCode,
      newReferralCode,
      newReferralLink
    };
  }

  /**
   * Admin: List all affiliates with pagination and filters
   */
  static async listAffiliates(params: {
    page?: number;
    limit?: number;
    status?: AffiliateStatus;
    search?: string;
    regionId?: string;
    countryId?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (params.status) {
      where.status = params.status;
    }
    
    if (params.regionId) {
      where.regionId = params.regionId;
    }
    
    if (params.countryId) {
      where.region = {
        countryId: params.countryId
      };
    }
    
    if (params.search) {
      where.OR = [
        { referralCode: { contains: params.search, mode: 'insensitive' } },
        { user: { firstName: { contains: params.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: params.search, mode: 'insensitive' } } },
        { user: { email: { contains: params.search, mode: 'insensitive' } } }
      ];
    }

    const [affiliates, total] = await Promise.all([
      db.affiliateProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          region: {
            include: {
              country: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.affiliateProfile.count({ where })
    ]);

    return {
      affiliates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin: Suspend an affiliate
   */
  static async suspendAffiliate(affiliateId: string, reason?: string) {
    const profile = await db.affiliateProfile.findUnique({
      where: { id: affiliateId },
      include: { user: true, region: { include: { country: true } } }
    });

    if (!profile) {
      throw new Error("Affiliate profile not found");
    }

    if (profile.status === AffiliateStatus.SUSPENDED) {
      throw new Error("Affiliate is already suspended");
    }

    if (profile.status === AffiliateStatus.TERMINATED) {
      throw new Error("Cannot suspend a terminated affiliate");
    }

    const updated = await db.affiliateProfile.update({
      where: { id: affiliateId },
      data: {
        status: AffiliateStatus.SUSPENDED,
        suspendedAt: new Date(),
        suspendedReason: reason || null,
        updatedAt: new Date()
      },
      include: {
        user: true,
        region: { include: { country: true } }
      }
    });

    logger.info({ affiliateId, reason }, "Affiliate suspended");
    return updated;
  }

  /**
   * Admin: Unsuspend an affiliate
   */
  static async unsuspendAffiliate(affiliateId: string) {
    const profile = await db.affiliateProfile.findUnique({
      where: { id: affiliateId }
    });

    if (!profile) {
      throw new Error("Affiliate profile not found");
    }

    if (profile.status !== AffiliateStatus.SUSPENDED) {
      throw new Error("Affiliate is not suspended");
    }

    const updated = await db.affiliateProfile.update({
      where: { id: affiliateId },
      data: {
        status: AffiliateStatus.ACTIVE,
        suspendedAt: null,
        suspendedReason: null,
        updatedAt: new Date()
      },
      include: {
        user: true,
        region: { include: { country: true } }
      }
    });

    logger.info({ affiliateId }, "Affiliate unsuspended");
    return updated;
  }

  /**
   * Admin: Get financial overview
   */
  static async getFinancialOverview() {
    // Total revenue from confirmed payments
    const totalRevenueResult = await db.payment.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { amount: true }
    });

    // Commissions owed (approved but not paid)
    const commissionsOwedResult = await db.commission.aggregate({
      where: {
        status: 'APPROVED',
        payoutBatchId: null
      },
      _sum: { commissionAmount: true }
    });

    // Commissions paid
    const commissionsPaidResult = await db.commission.aggregate({
      where: { status: 'PAID' },
      _sum: { commissionAmount: true }
    });

    // All commissions (for TIC net calculation)
    const allCommissionsResult = await db.commission.aggregate({
      _sum: { commissionAmount: true }
    });

    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const commissionsOwed = commissionsOwedResult._sum.commissionAmount || 0;
    const commissionsPaid = commissionsPaidResult._sum.commissionAmount || 0;
    const allCommissions = allCommissionsResult._sum.commissionAmount || 0;
    const ticNetFees = totalRevenue - allCommissions;

    return {
      totalRevenue,
      commissionsOwed,
      commissionsPaid,
      ticNetFees
    };
  }

  /**
   * Admin: Get system ledger with pagination
   */
  static async getSystemLedger(params: {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { status: 'CONFIRMED' };
    
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = params.startDate;
      if (params.endDate) where.createdAt.lte = params.endDate;
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          referral: {
            include: {
              commissions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.payment.count({ where })
    ]);

    const entries = payments.map(payment => {
      const referral = payment.referral;
      const commissions = referral?.commissions || [];

      const affiliateCommission = commissions.find((c: any) => c.type === 'AFFILIATE')?.commissionAmount || 0;
      const regionalCommission = commissions.find((c: any) => c.type === 'REGIONAL')?.commissionAmount || 0;
      const nationalCommission = commissions.find((c: any) => c.type === 'NATIONAL')?.commissionAmount || 0;
      
      const totalCommissions = affiliateCommission + regionalCommission + nationalCommission;
      const ticNet = payment.amount - totalCommissions;

      return {
        id: payment.id,
        transactionId: payment.id,
        student: payment.user,
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          verifiedAt: payment.updatedAt
        },
        referral: referral ? {
          id: referral.id,
          referralCode: referral.referralCode
        } : null,
        affiliateCommission,
        regionalCommission,
        nationalCommission,
        ticNet,
        status: payment.status === 'CONFIRMED' && commissions.length > 0 ? 'completed' : 'error',
        createdAt: payment.createdAt
      };
    });

    return {
      entries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin: Get payout batches
   */
  static async getPayoutBatches(params: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }

    const [batches, total] = await Promise.all([
      db.payoutBatch.findMany({
        where,
        skip,
        take: limit,
        include: {
          commissions: {
            take: 1,
            include: {
              affiliateProfile: {
                include: {
                  user: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      db.payoutBatch.count({ where })
    ]);

    const payouts = batches.map(batch => {
      const firstCommission = batch.commissions[0];
      const affiliate = firstCommission?.affiliateProfile;

      return {
        id: batch.id,
        batchNumber: batch.batchNumber,
        affiliateId: affiliate?.id || null,
        affiliateCode: affiliate?.referralCode || null,
        affiliateName: affiliate ? `${affiliate.user.firstName} ${affiliate.user.lastName}` : null,
        affiliateEmail: affiliate?.user.email || null,
        totalAmount: batch.totalAmount,
        commissionCount: batch.commissionCount,
        status: batch.status,
        createdBy: batch.createdBy,
        processedBy: batch.processedBy,
        exportUrl: batch.exportUrl,
        notes: batch.notes,
        createdAt: batch.createdAt,
        processedAt: batch.processedAt
      };
    });

    return {
      payouts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin: Get fraud flags
   */
  static async getFraudFlags(params: {
    page?: number;
    limit?: number;
    severity?: string;
    resolved?: boolean;
    type?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (params.severity) {
      where.severity = params.severity;
    }
    
    if (params.type) {
      where.type = params.type;
    }
    
    if (params.resolved !== undefined) {
      if (params.resolved) {
        where.status = { in: ['RESOLVED', 'DISMISSED'] };
      } else {
        where.status = { in: ['PENDING', 'INVESTIGATING'] };
      }
    }

    const [flags, total] = await Promise.all([
      db.fraudFlag.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { 
            severity: 'desc'
          },
          { flaggedAt: 'desc' }
        ]
      }),
      db.fraudFlag.count({ where })
    ]);

    const flagsData = await Promise.all(flags.map(async flag => {
      // Get user and affiliate info separately
      const user = await db.user.findUnique({
        where: { id: flag.userId },
        include: {
          affiliateProfile: true
        }
      });

      const affiliate = user?.affiliateProfile;
      
      // Generate title and description based on type
      let title = flag.type;
      let description = flag.reason;

      return {
        id: flag.id,
        userId: flag.userId,
        type: flag.type,
        severity: flag.severity,
        title,
        description,
        reason: flag.reason,
        evidence: flag.evidence,
        status: flag.status,
        affiliateId: affiliate?.id || null,
        affiliateCode: affiliate?.referralCode || null,
        affiliateName: affiliate && user ? `${user.firstName} ${user.lastName}` : null,
        referralId: null,
        transactionId: null,
        flaggedBy: flag.flaggedBy,
        flaggedAt: flag.flaggedAt,
        resolvedBy: flag.resolvedBy,
        resolvedAt: flag.resolvedAt,
        resolution: flag.resolution,
        createdAt: flag.createdAt,
        updatedAt: flag.updatedAt
      };
    }));

    return {
      flags: flagsData,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin: Get commission tier configuration
   */
  static async getCommissionTiers() {
    // Try to get from SystemConfig first
    const config = await db.systemConfig.findUnique({
      where: { key: 'commission_tiers' }
    });

    if (config && config.value) {
      return config.value;
    }

    // Return default values
    return {
      standard: {
        affiliateRate: 0.09,
        regionalRate: 0.06,
        nationalRate: 0.05
      },
      premium: {
        affiliateRate: 0.12,
        regionalRate: 0.08,
        nationalRate: 0.06
      },
      vip: {
        affiliateRate: 0.15,
        regionalRate: 0.10,
        nationalRate: 0.08
      }
    };
  }

  /**
   * Admin: Update commission tier configuration
   */
  static async updateCommissionTiers(data: {
    tier: 'STANDARD' | 'PREMIUM' | 'VIP';
    affiliateRate: number;
    regionalRate: number;
    nationalRate: number;
  }, updatedBy: string) {
    // Validate rates
    if (data.affiliateRate < 0 || data.affiliateRate > 1 ||
        data.regionalRate < 0 || data.regionalRate > 1 ||
        data.nationalRate < 0 || data.nationalRate > 1) {
      throw new Error("Commission rates must be between 0 and 1");
    }

    const totalRate = data.affiliateRate + data.regionalRate + data.nationalRate;
    if (totalRate > 1) {
      throw new Error("Total commission rate cannot exceed 100%");
    }

    // Get current config
    const currentConfig: any = await this.getCommissionTiers();

    // Update the specified tier
    const tierKey = data.tier.toLowerCase() as 'standard' | 'premium' | 'vip';
    currentConfig[tierKey] = {
      affiliateRate: data.affiliateRate,
      regionalRate: data.regionalRate,
      nationalRate: data.nationalRate
    };

    // Save to database
    await db.systemConfig.upsert({
      where: { key: 'commission_tiers' },
      create: {
        key: 'commission_tiers',
        value: currentConfig,
        updatedBy
      },
      update: {
        value: currentConfig,
        updatedBy,
        updatedAt: new Date()
      }
    });

    logger.info({ tier: data.tier, rates: data }, "Commission tiers updated");
    return currentConfig;
  }
}
