import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import { PaymentStatus, CommissionStatus, CommissionType, ReferralStatus, AffiliateSubRole } from "@prisma/client";

/**
 * Payment and Commission Service
 * Handles payment confirmation and commission calculation/distribution
 */
export class PaymentCommissionService {

  /**
   * Process a payment confirmation and trigger commission calculation
   */
  static async confirmPayment(paymentId: string, verifiedBy: string): Promise<any> {
    try {
      // Get payment details
      const payment = await db.payment.findUnique({
        where: { id: paymentId },
        include: {
          country: true,
          user: true
        }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status === PaymentStatus.CONFIRMED) {
        throw new Error('Payment already confirmed');
      }

      // Update payment status
      const confirmedPayment = await db.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.CONFIRMED,
          verifiedAt: new Date(),
          verifiedBy: verifiedBy
        }
      });

      // Find referral associated with this payment
      const referral = await db.studentReferral.findUnique({
        where: { paymentId: paymentId }
      });

      // Update referral status to PAID
      if (referral) {
        await db.studentReferral.update({
          where: { id: referral.id },
          data: {
            status: ReferralStatus.PAID
          }
        });

        // Calculate and create commissions
        await this.calculateCommissions(referral.id, payment.country);
      }

      logger.info({ paymentId, referralId: referral?.id }, 'Payment confirmed and commissions calculated');

      return confirmedPayment;
    } catch (error) {
      logger.error({ paymentId, error }, 'Error confirming payment');
      throw error;
    }
  }

  /**
   * Calculate commissions for a referral
   */
  static async calculateCommissions(referralId: string, country: any): Promise<void> {
    try {
      const referral = await db.studentReferral.findUnique({
        where: { id: referralId },
        include: {
          affiliate: {
            include: {
              user: true,
              region: {
                include: {
                  country: true
                }
              }
            }
          },
          payment: true
        }
      });

      if (!referral || !referral.payment) {
        throw new Error('Referral or payment not found');
      }

      const commissionableAmount = referral.payment.commissionableAmount;
      const now = new Date();

      // Calculate affiliate commission
      if (referral.affiliate) {
        const affiliateCommissionRate = country.affiliateCommissionRate || 9;
        const affiliateCommissionAmount = (commissionableAmount * affiliateCommissionRate) / 100;

        await db.commission.create({
          data: {
            userId: referral.affiliate.userId,
            referralId: referral.id,
            type: CommissionType.AFFILIATE,
            baseAmount: commissionableAmount,
            percentage: affiliateCommissionRate,
            commissionAmount: affiliateCommissionAmount,
            status: CommissionStatus.PENDING,
            earnedAt: now,
            coolingPeriodEnds: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
            affiliateProfileId: referral.affiliate.id
          }
        });

        // Update affiliate stats
        await db.affiliateProfile.update({
          where: { id: referral.affiliate.id },
          data: {
            totalReferrals: { increment: 1 },
            totalEarned: { increment: affiliateCommissionAmount }
          }
        });
      }

      // Calculate regional coordinator commission
      if (referral.affiliate?.region) {
        // Find regional coordinators in the affiliate's region
        const regionalCoordinators = await db.affiliateProfile.findMany({
          where: {
            regionId: referral.affiliate.regionId,
            subRole: {
              in: [AffiliateSubRole.REGIONAL_COORDINATOR, AffiliateSubRole.ASSISTANT_REGIONAL_COORDINATOR]
            },
            status: 'ACTIVE'
          },
          include: {
            user: true
          }
        });

        if (regionalCoordinators.length > 0) {
          const regionalCommissionRate = country.regionalCommissionRate || 6;
          const regionalCommissionAmount = (commissionableAmount * regionalCommissionRate) / 100;

          // Distribute to first regional coordinator (or implement round-robin)
          const regionalCoordinator = regionalCoordinators[0];
          
          if (regionalCoordinator) {
            await db.commission.create({
              data: {
                userId: regionalCoordinator.userId,
                referralId: referral.id,
                type: CommissionType.REGIONAL,
                baseAmount: commissionableAmount,
                percentage: regionalCommissionRate,
                commissionAmount: regionalCommissionAmount,
                status: CommissionStatus.PENDING,
                earnedAt: now,
                coolingPeriodEnds: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                affiliateProfileId: regionalCoordinator.id
              }
            });

            // Update regional coordinator stats
            await db.affiliateProfile.update({
              where: { id: regionalCoordinator.id },
              data: {
                totalStudents: { increment: 1 },
                totalEarned: { increment: regionalCommissionAmount }
              }
            });
          }
        }
      }

      // Calculate national coordinator commission
      const nationalCoordinators = await db.affiliateProfile.findMany({
        where: {
          countryId: referral.countryId,
          subRole: {
            in: [AffiliateSubRole.NATIONAL_COORDINATOR, AffiliateSubRole.ASSISTANT_NATIONAL_COORDINATOR]
          },
          status: 'ACTIVE'
        },
        include: {
          user: true
        }
      });

      if (nationalCoordinators.length > 0) {
        const nationalCommissionRate = country.nationalCommissionRate || 5;
        const nationalCommissionAmount = (commissionableAmount * nationalCommissionRate) / 100;

        // Distribute to first national coordinator
        const nationalCoordinator = nationalCoordinators[0];

        if (nationalCoordinator) {
          await db.commission.create({
            data: {
              userId: nationalCoordinator.userId,
              referralId: referral.id,
              type: CommissionType.NATIONAL,
              baseAmount: commissionableAmount,
              percentage: nationalCommissionRate,
              commissionAmount: nationalCommissionAmount,
              status: CommissionStatus.PENDING,
              earnedAt: now,
              coolingPeriodEnds: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
              affiliateProfileId: nationalCoordinator.id
            }
          });

          // Update national coordinator stats
          await db.affiliateProfile.update({
            where: { id: nationalCoordinator.id },
            data: {
              totalStudents: { increment: 1 },
              totalEarned: { increment: nationalCommissionAmount }
            }
          });
        }
      }

      logger.info({ referralId }, 'Commissions calculated successfully');
    } catch (error) {
      logger.error({ referralId, error }, 'Error calculating commissions');
      throw error;
    }
  }

  /**
   * Activate a referral (student activated on platform)
   */
  static async activateReferral(referralId: string): Promise<void> {
    try {
      const referral = await db.studentReferral.findUnique({
        where: { id: referralId }
      });

      if (!referral) {
        throw new Error('Referral not found');
      }

      if (referral.status !== ReferralStatus.PAID) {
        throw new Error('Referral must be in PAID status before activation');
      }

      // Update referral status
      await db.studentReferral.update({
        where: { id: referralId },
        data: {
          status: ReferralStatus.ACTIVATED,
          activatedAt: new Date()
        }
      });

      // Update all related commissions from PENDING to EARNED
      await db.commission.updateMany({
        where: {
          referralId: referralId,
          status: CommissionStatus.PENDING
        },
        data: {
          status: CommissionStatus.EARNED
        }
      });

      logger.info({ referralId }, 'Referral activated and commissions updated to EARNED');
    } catch (error) {
      logger.error({ referralId, error }, 'Error activating referral');
      throw error;
    }
  }

  /**
   * Approve commissions after cooling period
   */
  static async approveCommissions(commissionIds: string[]): Promise<void> {
    try {
      const now = new Date();

      for (const commissionId of commissionIds) {
        const commission = await db.commission.findUnique({
          where: { id: commissionId }
        });

        if (!commission) {
          logger.warn({ commissionId }, 'Commission not found');
          continue;
        }

        if (commission.status !== CommissionStatus.EARNED) {
          logger.warn({ commissionId, status: commission.status }, 'Commission not in EARNED status');
          continue;
        }

        if (commission.coolingPeriodEnds && commission.coolingPeriodEnds > now) {
          logger.warn({ commissionId, coolingPeriodEnds: commission.coolingPeriodEnds }, 'Commission still in cooling period');
          continue;
        }

        // Approve commission
        await db.commission.update({
          where: { id: commissionId },
          data: {
            status: CommissionStatus.APPROVED,
            approvedAt: now
          }
        });

        logger.info({ commissionId }, 'Commission approved');
      }
    } catch (error) {
      logger.error({ commissionIds, error }, 'Error approving commissions');
      throw error;
    }
  }

  /**
   * Create a payout batch
   */
  static async createPayoutBatch(commissionIds: string[], createdBy: string): Promise<any> {
    try {
      // Get all commissions
      const commissions = await db.commission.findMany({
        where: {
          id: { in: commissionIds },
          status: CommissionStatus.APPROVED
        }
      });

      if (commissions.length === 0) {
        throw new Error('No approved commissions found');
      }

      const totalAmount = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);

      // Create payout batch
      const batch = await db.payoutBatch.create({
        data: {
          batchNumber: `BATCH-${Date.now()}`,
          totalAmount,
          commissionCount: commissions.length,
          status: 'PENDING',
          createdBy
        }
      });

      // Update commissions with batch ID
      await db.commission.updateMany({
        where: { id: { in: commissionIds } },
        data: {
          payoutBatchId: batch.id,
          status: CommissionStatus.LOCKED
        }
      });

      logger.info({ batchId: batch.id, totalAmount, count: commissions.length }, 'Payout batch created');

      return batch;
    } catch (error) {
      logger.error({ commissionIds, error }, 'Error creating payout batch');
      throw error;
    }
  }

  /**
   * Mark payout batch as completed
   */
  static async completePayoutBatch(batchId: string): Promise<void> {
    try {
      const batch = await db.payoutBatch.findUnique({
        where: { id: batchId }
      });

      if (!batch) {
        throw new Error('Payout batch not found');
      }

      // Update batch status
      await db.payoutBatch.update({
        where: { id: batchId },
        data: {
          status: 'COMPLETED',
          processedAt: new Date()
        }
      });

      // Update all commissions in this batch
      await db.commission.updateMany({
        where: { payoutBatchId: batchId },
        data: {
          status: CommissionStatus.PAID,
          paidAt: new Date()
        }
      });

      // Update total paid for all users involved
      const commissions = await db.commission.findMany({
        where: { payoutBatchId: batchId }
      });

      for (const commission of commissions) {
        if (commission.affiliateProfileId) {
          await db.affiliateProfile.update({
            where: { id: commission.affiliateProfileId },
            data: { totalPaid: { increment: commission.commissionAmount } }
          });
        }
      }

      logger.info({ batchId }, 'Payout batch completed');
    } catch (error) {
      logger.error({ batchId, error }, 'Error completing payout batch');
      throw error;
    }
  }

  /**
   * Get approved commissions ready for payout
   */
  static async getApprovedCommissionsForPayout(limit: number = 100): Promise<any[]> {
    const commissions = await db.commission.findMany({
      where: {
        status: CommissionStatus.APPROVED,
        payoutBatchId: null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        affiliateProfile: true,
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
        }
      },
      take: limit,
      orderBy: { approvedAt: 'asc' }
    });

    return commissions;
  }
}
