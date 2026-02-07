import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import { fapshiService, type ProcessedWebhookEvent } from "../../shared/utils/fapshi";
import { PaymentCommissionService } from "../affiliate/payment-commission.service";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { 
  sendPaymentSuccessEmail, 
  sendPaymentFailedEmail,
  sendPaymentPendingEmail 
} from "../../shared/utils/email";

/**
 * Payment Service
 * Handles payment processing, verification, and integration with commission system
 */
export class PaymentService {

  /**
   * Initiate a payment for student registration
   * Referral code is passed here (from payment link), not during registration
   */
  static async initiatePayment(params: {
    userId: string;
    phoneNumber: string;
    amount: number;
    countryId: string;
    referralCode?: string; // Comes from payment link URL, not user registration
  }): Promise<any> {
    try {
      const { userId, phoneNumber, amount, countryId, referralCode } = params;

      logger.info({ userId, countryId, amount, hasReferral: !!referralCode }, 'Initiating payment');

      // Get user details
      const user = await db.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user already has an active payment
      const existingPayment = await db.payment.findFirst({
        where: {
          userId,
          status: PaymentStatus.CONFIRMED
        }
      });

      if (existingPayment) {
        throw new Error('User already has an active payment');
      }

      // Get country details
      const country = await db.country.findUnique({
        where: { id: countryId }
      });

      if (!country) {
        throw new Error('Country not found');
      }

      // Validate amount matches country price
      if (amount < country.studentPrice) {
        throw new Error(`Amount must be at least ${country.studentPrice} ${country.currency}`);
      }

      // Calculate commissionable amount (amount - platform fee)
      const platformFee = country.platformFee || 300;
      const commissionableAmount = amount - platformFee;

      // Generate unique payment reference
      const paymentReference = `TIC-${Date.now()}-${userId.substring(0, 8)}`;

      // Detect payment method from phone number
      const paymentMethod = fapshiService.detectPaymentMethod(phoneNumber);

      // Create payment record
      const payment = await db.payment.create({
        data: {
          userId,
          countryId,
          amount,
          platformFee,
          commissionableAmount,
          paymentReference,
          paymentMethod: paymentMethod === 'MTN' ? PaymentMethod.MOBILE_MONEY : PaymentMethod.MOBILE_MONEY,
          paymentProvider: paymentMethod,
          status: PaymentStatus.PENDING,
          metadata: {
            phoneNumber,
            referralCode: referralCode || null, // Store referral code from payment link
            initiatedAt: new Date().toISOString()
          }
        }
      });

      // Handle referral if provided (from payment link)
      let referralId = null;
      if (referralCode) {
        logger.info({ referralCode, paymentId: payment.id }, 'Processing referral code from payment link');
        
        const affiliate = await db.affiliateProfile.findFirst({
          where: { 
            referralCode,
            status: 'ACTIVE' // Only active affiliates can earn commissions
          },
          include: { region: true }
        });

        if (affiliate) {
          // Create referral record
          const referral = await db.studentReferral.create({
            data: {
              studentId: userId,
              affiliateId: affiliate.id,
              regionId: affiliate.regionId,
              countryId,
              referralCode,
              paymentId: payment.id,
              status: 'PENDING'
            }
          });
          referralId = referral.id;
          logger.info({ referralId, affiliateId: affiliate.id }, 'Referral record created');
        } else {
          logger.warn({ referralCode }, 'Invalid or inactive referral code - payment proceeds without referral');
        }
      }

      // Initiate payment with Fapshi
      const fapshiResponse = await fapshiService.initiatePayment({
        phoneNumber,
        amount,
        externalId: paymentReference,
        message: `TiC Summit Training Registration - ${user.firstName} ${user.lastName}`
      });

      // Update payment with Fapshi transaction ID
      await db.payment.update({
        where: { id: payment.id },
        data: {
          metadata: {
            ...(payment.metadata as any),
            fapshiTransId: fapshiResponse.transId
          }
        }
      });

      logger.info({ paymentId: payment.id, fapshiTransId: fapshiResponse.transId }, 'Payment initiated');

      // Send pending payment email
      try {
        await sendPaymentPendingEmail(
          user.email,
          user.firstName,
          {
            amount,
            currency: country.currency,
            transactionId: fapshiResponse.transId,
            paymentMethod: paymentMethod,
            date: new Date()
          }
        );
        logger.info({ paymentId: payment.id, email: user.email }, 'Payment pending email sent');
      } catch (emailError: any) {
        logger.error({ paymentId: payment.id, error: emailError.message }, 'Failed to send payment pending email');
        // Don't throw - payment is initiated, email failure shouldn't block the process
      }

      return {
        paymentId: payment.id,
        paymentReference,
        fapshiTransId: fapshiResponse.transId,
        amount,
        phoneNumber,
        status: 'PENDING',
        message: fapshiResponse.message
      };
    } catch (error: any) {
      logger.error({ error: error.message, params }, 'Failed to initiate payment');
      throw error;
    }
  }

  /**
   * Check payment status
   */
  static async checkPaymentStatus(paymentId: string, userId: string): Promise<any> {
    try {
      const payment = await db.payment.findUnique({
        where: { id: paymentId },
        include: {
          referral: true,
          country: true
        }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify user owns this payment
      if (payment.userId !== userId) {
        throw new Error('Unauthorized');
      }

      // If payment is still pending, check with Fapshi
      if (payment.status === PaymentStatus.PENDING) {
        const fapshiTransId = (payment.metadata as any)?.fapshiTransId;
        
        if (fapshiTransId) {
          const fapshiStatus = await fapshiService.checkPaymentStatus(fapshiTransId);
          
          // Update payment status if changed
          if (fapshiStatus.status.toUpperCase() === 'SUCCESSFUL') {
            await this.confirmPayment(payment.id);
          } else if (fapshiStatus.status.toUpperCase() === 'FAILED') {
            await db.payment.update({
              where: { id: payment.id },
              data: { status: PaymentStatus.FAILED }
            });

            // Send failure email
            try {
              const user = await db.user.findUnique({ where: { id: payment.userId } });
              if (user) {
                await sendPaymentFailedEmail(
                  user.email,
                  user.firstName,
                  {
                    amount: payment.amount,
                    currency: payment.country!.currency,
                    transactionId: fapshiTransId,
                    paymentMethod: payment.paymentProvider || 'Mobile Money',
                    errorMessage: fapshiStatus.message || 'Payment verification failed',
                    date: payment.createdAt
                  }
                );
                logger.info({ paymentId: payment.id, email: user.email }, 'Payment failure email sent');
              }
            } catch (emailError: any) {
              logger.error({ paymentId: payment.id, error: emailError.message }, 'Failed to send payment failure email');
            }
          }
        }
      }

      // Re-fetch payment to get updated status
      const updatedPayment = await db.payment.findUnique({
        where: { id: paymentId },
        include: {
          referral: true,
          country: true
        }
      });

      return {
        paymentId: updatedPayment!.id,
        paymentReference: updatedPayment!.paymentReference,
        amount: updatedPayment!.amount,
        status: updatedPayment!.status,
        createdAt: updatedPayment!.createdAt,
        verifiedAt: updatedPayment!.verifiedAt,
        referral: updatedPayment!.referral ? {
          id: updatedPayment!.referral.id,
          status: updatedPayment!.referral.status
        } : null
      };
    } catch (error: any) {
      logger.error({ error: error.message, paymentId }, 'Failed to check payment status');
      throw error;
    }
  }

  /**
   * Confirm a payment (internal use)
   */
  private static async confirmPayment(paymentId: string): Promise<void> {
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: true,
        country: true
      }
    });

    if (!payment || payment.status === PaymentStatus.CONFIRMED) {
      return;
    }

    // Use PaymentCommissionService to confirm payment and calculate commissions
    await PaymentCommissionService.confirmPayment(paymentId, 'system');

    logger.info({ paymentId }, 'Payment confirmed and commissions calculated');

    // Send success email
    try {
      const metadata = payment.metadata as any;
      await sendPaymentSuccessEmail(
        payment.user!.email,
        payment.user!.firstName,
        {
          amount: payment.amount,
          currency: payment.country!.currency,
          transactionId: metadata?.fapshiTransId || payment.paymentReference,
          paymentMethod: payment.paymentProvider || 'Mobile Money',
          date: payment.createdAt
        }
      );
      logger.info({ paymentId, email: payment.user!.email }, 'Payment success email sent');
    } catch (emailError: any) {
      logger.error({ paymentId, error: emailError.message }, 'Failed to send payment success email');
      // Don't throw - payment is confirmed, email failure shouldn't block the process
    }
  }

  /**
   * Handle webhook event from Fapshi
   */
  static async handleWebhookEvent(event: ProcessedWebhookEvent): Promise<void> {
    try {
      const { externalId, status, amount, transactionId } = event;

      // Find payment by reference
      const payment = await db.payment.findUnique({
        where: { paymentReference: externalId },
        include: {
          user: true,
          country: true
        }
      });

      if (!payment) {
        logger.warn({ externalId }, 'Payment not found for webhook event');
        return;
      }

      // Update payment metadata with transaction details
      await db.payment.update({
        where: { id: payment.id },
        data: {
          metadata: {
            ...(payment.metadata as any),
            fapshiTransId: transactionId,
            webhookReceivedAt: new Date().toISOString()
          }
        }
      });

      // Process based on status
      if (status === 'CONFIRMED' && payment.status === PaymentStatus.PENDING) {
        await this.confirmPayment(payment.id);
        logger.info({ paymentId: payment.id, externalId }, 'Payment confirmed via webhook');
      } else if (status === 'FAILED') {
        await db.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.FAILED }
        });
        logger.info({ paymentId: payment.id, externalId }, 'Payment failed via webhook');

        // Send failure email
        try {
          const metadata = payment.metadata as any;
          await sendPaymentFailedEmail(
            payment.user!.email,
            payment.user!.firstName,
            {
              amount: payment.amount,
              currency: payment.country!.currency,
              transactionId: metadata?.fapshiTransId || payment.paymentReference,
              paymentMethod: payment.paymentProvider || 'Mobile Money',
              errorMessage: event.message || 'Payment could not be completed',
              date: payment.createdAt
            }
          );
          logger.info({ paymentId: payment.id, email: payment.user!.email }, 'Payment failure email sent');
        } catch (emailError: any) {
          logger.error({ paymentId: payment.id, error: emailError.message }, 'Failed to send payment failure email');
        }
      }
    } catch (error: any) {
      logger.error({ error: error.message, event }, 'Failed to handle webhook event');
      throw error;
    }
  }

  /**
   * Get payment history for a user
   */
  static async getPaymentHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const whereClause: any = { userId };
    if (status) {
      whereClause.status = status;
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where: whereClause,
        include: {
          country: {
            select: {
              name: true,
              currency: true
            }
          },
          referral: {
            select: {
              id: true,
              status: true,
              referralCode: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.payment.count({ where: whereClause })
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin: Manually verify a payment
   */
  static async verifyPayment(paymentId: string, adminId: string): Promise<any> {
    try {
      const payment = await db.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status === PaymentStatus.CONFIRMED) {
        throw new Error('Payment already confirmed');
      }

      // Confirm payment and trigger commission calculation
      await PaymentCommissionService.confirmPayment(paymentId, adminId);

      logger.info({ paymentId, adminId }, 'Payment manually verified');

      return {
        paymentId,
        status: 'CONFIRMED',
        message: 'Payment verified successfully'
      };
    } catch (error: any) {
      logger.error({ error: error.message, paymentId }, 'Failed to verify payment');
      throw error;
    }
  }
}
