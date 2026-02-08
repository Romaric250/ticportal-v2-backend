import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import { PaymentStatus, CommissionStatus, CommissionType, ReferralStatus, AffiliateSubRole } from "@prisma/client";
import { sendCommissionEarnedEmail } from "../../shared/utils/email";

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
      // Only set verifiedBy if it's a valid ObjectID (not "system" or other strings)
      const updateData: any = {
        status: PaymentStatus.CONFIRMED,
        verifiedAt: new Date()
      };
      
      // Only set verifiedBy if it's a valid MongoDB ObjectID (24 hex characters)
      if (verifiedBy && /^[0-9a-fA-F]{24}$/.test(verifiedBy)) {
        updateData.verifiedBy = verifiedBy;
      }
      // Otherwise leave it null (system verification)

      const confirmedPayment = await db.payment.update({
        where: { id: paymentId },
        data: updateData
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

        // Update commissions from PENDING to EARNED when payment is confirmed
        await db.commission.updateMany({
          where: {
            referralId: referral.id,
            status: CommissionStatus.PENDING
          },
          data: {
            status: CommissionStatus.EARNED,
            earnedAt: new Date()
          }
        });

        logger.info({ referralId: referral.id }, 'Commissions updated to EARNED status');
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
          payment: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      if (!referral || !referral.payment) {
        throw new Error('Referral or payment not found');
      }

      const commissionableAmount = referral.payment.commissionableAmount;
      const now = new Date();

      // Calculate affiliate commission
      if (referral.affiliate) {
        // Use country rate, fallback to 9% if not set
        // Handle both decimal (0.09) and percentage (9) formats
        let affiliateCommissionRate = country.affiliateCommissionRate ?? 9;
        
        // If rate is less than 1, it's stored as decimal (0.09), convert to percentage (9)
        if (affiliateCommissionRate < 1) {
          affiliateCommissionRate = affiliateCommissionRate * 100;
          logger.warn({
            originalRate: country.affiliateCommissionRate,
            convertedRate: affiliateCommissionRate
          }, 'Commission rate was stored as decimal, converted to percentage');
        }
        
        const affiliateCommissionAmount = (commissionableAmount * affiliateCommissionRate) / 100;

        logger.info({
          referralId: referral.id,
          affiliateId: referral.affiliate.id,
          commissionableAmount,
          rate: affiliateCommissionRate,
          amount: affiliateCommissionAmount
        }, 'Calculating affiliate commission');

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

        logger.info({
          affiliateId: referral.affiliate.id,
          commissionAmount: affiliateCommissionAmount
        }, 'Affiliate commission created and stats updated');

        // Send commission earned email
        if (referral.affiliate.user && referral.payment.user) {
          try {
            await sendCommissionEarnedEmail(
              referral.affiliate.user.email,
              referral.affiliate.user.firstName,
              {
                commissionAmount: affiliateCommissionAmount,
                currency: country.currency,
                commissionType: CommissionType.AFFILIATE,
                studentName: `${referral.payment.user.firstName} ${referral.payment.user.lastName || ''}`.trim(),
                status: CommissionStatus.PENDING,
              }
            );
            logger.info({ affiliateId: referral.affiliate.id, email: referral.affiliate.user.email }, 'Commission earned email sent to affiliate');
          } catch (emailError: any) {
            logger.error({ affiliateId: referral.affiliate.id, error: emailError.message }, 'Failed to send commission earned email to affiliate');
            // Don't throw - commission is created, email failure shouldn't block the process
          }
        }
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
          // Use country rate, fallback to 5% if not set
          // Handle both decimal (0.05) and percentage (5) formats
          let regionalCommissionRate = country.regionalCommissionRate ?? 5;
          
          // If rate is less than 1, it's stored as decimal (0.05), convert to percentage (5)
          if (regionalCommissionRate < 1) {
            regionalCommissionRate = regionalCommissionRate * 100;
            logger.warn({
              originalRate: country.regionalCommissionRate,
              convertedRate: regionalCommissionRate
            }, 'Regional commission rate was stored as decimal, converted to percentage');
          }
          
          const regionalCommissionAmount = (commissionableAmount * regionalCommissionRate) / 100;

          // Distribute to first regional coordinator (or implement round-robin)
          const regionalCoordinator = regionalCoordinators[0];
          
          if (regionalCoordinator) {
            logger.info({
              referralId: referral.id,
              coordinatorId: regionalCoordinator.id,
              commissionableAmount,
              rate: regionalCommissionRate,
              amount: regionalCommissionAmount
            }, 'Calculating regional coordinator commission');

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

            logger.info({
              coordinatorId: regionalCoordinator.id,
              commissionAmount: regionalCommissionAmount
            }, 'Regional coordinator commission created and stats updated');

            // Send commission earned email
            if (regionalCoordinator.user && referral.payment.user) {
              try {
                await sendCommissionEarnedEmail(
                  regionalCoordinator.user.email,
                  regionalCoordinator.user.firstName,
                  {
                    commissionAmount: regionalCommissionAmount,
                    currency: country.currency,
                    commissionType: CommissionType.REGIONAL,
                    studentName: `${referral.payment.user.firstName} ${referral.payment.user.lastName || ''}`.trim(),
                    status: CommissionStatus.PENDING,
                  }
                );
                logger.info({ coordinatorId: regionalCoordinator.id, email: regionalCoordinator.user.email }, 'Commission earned email sent to regional coordinator');
              } catch (emailError: any) {
                logger.error({ coordinatorId: regionalCoordinator.id, error: emailError.message }, 'Failed to send commission earned email to regional coordinator');
                // Don't throw - commission is created, email failure shouldn't block the process
              }
            }
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
        // Use country rate, fallback to 4% if not set
        // Handle both decimal (0.04) and percentage (4) formats
        let nationalCommissionRate = country.nationalCommissionRate ?? 4;
        
        // If rate is less than 1, it's stored as decimal (0.04), convert to percentage (4)
        if (nationalCommissionRate < 1) {
          nationalCommissionRate = nationalCommissionRate * 100;
          logger.warn({
            originalRate: country.nationalCommissionRate,
            convertedRate: nationalCommissionRate
          }, 'National commission rate was stored as decimal, converted to percentage');
        }
        
        const nationalCommissionAmount = (commissionableAmount * nationalCommissionRate) / 100;

        // Distribute to first national coordinator
        const nationalCoordinator = nationalCoordinators[0];

        if (nationalCoordinator) {
          logger.info({
            referralId: referral.id,
            coordinatorId: nationalCoordinator.id,
            commissionableAmount,
            rate: nationalCommissionRate,
            amount: nationalCommissionAmount
          }, 'Calculating national coordinator commission');

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

          logger.info({
            coordinatorId: nationalCoordinator.id,
            commissionAmount: nationalCommissionAmount
          }, 'National coordinator commission created and stats updated');

          // Send commission earned email
          if (nationalCoordinator.user && referral.payment.user) {
            try {
              await sendCommissionEarnedEmail(
                nationalCoordinator.user.email,
                nationalCoordinator.user.firstName,
                {
                  commissionAmount: nationalCommissionAmount,
                  currency: country.currency,
                  commissionType: CommissionType.NATIONAL,
                  studentName: `${referral.payment.user.firstName} ${referral.payment.user.lastName || ''}`.trim(),
                  status: CommissionStatus.PENDING,
                }
              );
              logger.info({ coordinatorId: nationalCoordinator.id, email: nationalCoordinator.user.email }, 'Commission earned email sent to national coordinator');
            } catch (emailError: any) {
              logger.error({ coordinatorId: nationalCoordinator.id, error: emailError.message }, 'Failed to send commission earned email to national coordinator');
              // Don't throw - commission is created, email failure shouldn't block the process
            }
          }
        }
      }

      logger.info({ referralId }, 'Commissions calculated successfully');
    } catch (error: any) {
      logger.error({ 
        referralId, 
        error: error.message,
        stack: error.stack 
      }, 'Error calculating commissions');
      throw error;
    }
  }

  /**
   * Process failed commission calculations
   * This is called by cron job to retry failed commission calculations
   */
  static async processFailedCommissions(): Promise<void> {
    try {
      logger.info('🔄 Starting failed commission processing job');

      // Find confirmed payments without commissions
      const paymentsWithoutCommissions = await db.payment.findMany({
        where: {
          status: PaymentStatus.CONFIRMED,
          verifiedAt: {
            not: null
          }
        },
        include: {
          country: true,
          referral: {
            include: {
              affiliate: true
            }
          }
        }
      });

      let processedCount = 0;
      let errorCount = 0;

      for (const payment of paymentsWithoutCommissions) {
        try {
          // Check if commissions already exist for this payment
          if (!payment.referral) {
            logger.warn({ paymentId: payment.id }, 'Payment has no referral, skipping');
            continue;
          }

          const existingCommissions = await db.commission.findFirst({
            where: {
              referralId: payment.referral.id
            }
          });

          if (existingCommissions) {
            // Commissions already exist, skip
            continue;
          }

          // Calculate commissions for this payment
          logger.info({ 
            paymentId: payment.id, 
            referralId: payment.referral.id 
          }, 'Processing missing commissions for payment');

          await this.calculateCommissions(payment.referral.id, payment.country);

          // Update commissions from PENDING to EARNED
          await db.commission.updateMany({
            where: {
              referralId: payment.referral.id,
              status: CommissionStatus.PENDING
            },
            data: {
              status: CommissionStatus.EARNED,
              earnedAt: new Date()
            }
          });

          processedCount++;
          logger.info({ 
            paymentId: payment.id, 
            referralId: payment.referral.id 
          }, 'Successfully processed commissions for payment');

        } catch (error: any) {
          errorCount++;
          logger.error({ 
            paymentId: payment.id, 
            error: error.message 
          }, 'Failed to process commissions for payment');
        }
      }

      logger.info({ 
        processedCount, 
        errorCount, 
        total: paymentsWithoutCommissions.length 
      }, '✅ Failed commission processing job completed');

    } catch (error: any) {
      logger.error({ 
        error: error.message,
        stack: error.stack 
      }, '❌ Failed commission processing job error');
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
