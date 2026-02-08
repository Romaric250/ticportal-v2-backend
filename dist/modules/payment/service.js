import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
import { fapshiService } from "../../shared/utils/fapshi.js";
import { PaymentCommissionService } from "../affiliate/payment-commission.service.js";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { sendPaymentSuccessEmail, sendPaymentFailedEmail, sendPaymentPendingEmail } from "../../shared/utils/email.js";
/**
 * Payment Service
 * Handles payment processing, verification, and integration with commission system
 */
export class PaymentService {
    /**
     * Initiate a payment for student registration
     * Referral code is passed here (from payment link), not during registration
     * Can pay for yourself or another user (userId in params)
     */
    static async initiatePayment(params) {
        try {
            const { userId, amount, countryId, referralCode, phoneNumber } = params;
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
            // Generate unique payment reference (use referral code if provided)
            const paymentReference = referralCode
                ? `TIC-${referralCode}-${Date.now()}`
                : `TIC-${Date.now()}-${userId.substring(0, 8)}`;
            // Create payment record
            const payment = await db.payment.create({
                data: {
                    userId,
                    countryId,
                    amount,
                    platformFee,
                    commissionableAmount,
                    paymentReference,
                    paymentMethod: PaymentMethod.MOBILE_MONEY,
                    paymentProvider: 'FAPSHI',
                    status: PaymentStatus.PENDING,
                    metadata: {
                        referralCode: referralCode || null,
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
                    const referralData = {
                        studentId: userId,
                        affiliateId: affiliate.id,
                        countryId,
                        referralCode,
                        paymentId: payment.id,
                        status: 'PENDING'
                    };
                    if (affiliate.regionId) {
                        referralData.regionId = affiliate.regionId;
                    }
                    const referral = await db.studentReferral.create({
                        data: referralData
                    });
                    referralId = referral.id;
                    logger.info({ referralId, affiliateId: affiliate.id }, 'Referral record created');
                }
                else {
                    logger.warn({ referralCode }, 'Invalid or inactive referral code - payment proceeds without referral');
                }
            }
            // Initiate payment with Fapshi - use paymentReference as externalId
            const fapshiResponse = await fapshiService.initiatePayment({
                amount,
                email: user.email,
                userId: user.id,
                externalId: paymentReference, // Use our payment reference (includes referral code if present)
                message: `TiC Summit Training Registration - ${user.firstName} ${user.lastName}`
            });
            // Update payment with Fapshi transaction ID and phone number (if provided)
            const metadataUpdate = {
                ...payment.metadata,
                fapshiLink: fapshiResponse.link,
                fapshiDateInitiated: fapshiResponse.dateInitiated
            };
            if (phoneNumber) {
                metadataUpdate.phoneNumber = phoneNumber;
            }
            await db.payment.update({
                where: { id: payment.id },
                data: {
                    fapshiTransId: fapshiResponse.transId, // Store in dedicated field
                    metadata: metadataUpdate
                }
            });
            logger.info({ paymentId: payment.id, fapshiTransId: fapshiResponse.transId }, 'Payment initiated');
            // Send pending payment email
            try {
                await sendPaymentPendingEmail(user.email, user.firstName, {
                    amount,
                    currency: country.currency,
                    transactionId: fapshiResponse.transId,
                    paymentMethod: 'MOBILE_MONEY',
                    date: new Date()
                });
                logger.info({ paymentId: payment.id, email: user.email }, 'Payment pending email sent');
            }
            catch (emailError) {
                logger.error({ paymentId: payment.id, error: emailError.message }, 'Failed to send payment pending email');
                // Don't throw - payment is initiated, email failure shouldn't block the process
            }
            return {
                paymentId: payment.id,
                paymentReference,
                fapshiTransId: fapshiResponse.transId,
                paymentLink: fapshiResponse.link,
                amount,
                currency: country.currency,
                status: 'PENDING',
                message: fapshiResponse.message
            };
        }
        catch (error) {
            logger.error({ error: error.message, params }, 'Failed to initiate payment');
            throw error;
        }
    }
    /**
     * Check payment status
     */
    static async checkPaymentStatus(paymentId, userId) {
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
                const fapshiTransId = payment.metadata?.fapshiTransId;
                if (fapshiTransId) {
                    const fapshiStatus = await fapshiService.checkPaymentStatus(fapshiTransId);
                    // Update payment status if changed
                    if (fapshiStatus.status.toUpperCase() === 'SUCCESSFUL') {
                        await this.confirmPayment(payment.id);
                    }
                    else if (fapshiStatus.status.toUpperCase() === 'FAILED') {
                        await db.payment.update({
                            where: { id: payment.id },
                            data: { status: PaymentStatus.FAILED }
                        });
                        // Send failure email
                        try {
                            const user = await db.user.findUnique({ where: { id: payment.userId } });
                            if (user) {
                                await sendPaymentFailedEmail(user.email, user.firstName, {
                                    amount: payment.amount,
                                    currency: payment.country.currency,
                                    transactionId: fapshiTransId,
                                    paymentMethod: payment.paymentProvider || 'Mobile Money',
                                    errorMessage: fapshiStatus.message || 'Payment verification failed',
                                    date: payment.createdAt
                                });
                                logger.info({ paymentId: payment.id, email: user.email }, 'Payment failure email sent');
                            }
                        }
                        catch (emailError) {
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
                paymentId: updatedPayment.id,
                paymentReference: updatedPayment.paymentReference,
                amount: updatedPayment.amount,
                status: updatedPayment.status,
                createdAt: updatedPayment.createdAt,
                verifiedAt: updatedPayment.verifiedAt,
                referral: updatedPayment.referral ? {
                    id: updatedPayment.referral.id,
                    status: updatedPayment.referral.status
                } : null
            };
        }
        catch (error) {
            logger.error({ error: error.message, paymentId }, 'Failed to check payment status');
            throw error;
        }
    }
    /**
     * Confirm a payment (internal use)
     */
    static async confirmPayment(paymentId) {
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
            await sendPaymentSuccessEmail(payment.user.email, payment.user.firstName, {
                amount: payment.amount,
                currency: payment.country.currency,
                transactionId: payment.fapshiTransId || payment.paymentReference,
                paymentMethod: payment.paymentProvider || 'Mobile Money',
                date: payment.createdAt
            });
            logger.info({ paymentId, email: payment.user.email }, 'Payment success email sent');
        }
        catch (emailError) {
            logger.error({ paymentId, error: emailError.message }, 'Failed to send payment success email');
            // Don't throw - payment is confirmed, email failure shouldn't block the process
        }
    }
    /**
     * Handle webhook event from Fapshi
     */
    static async handleWebhookEvent(event) {
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
            // Update payment with transaction ID and webhook details
            await db.payment.update({
                where: { id: payment.id },
                data: {
                    fapshiTransId: transactionId, // Store in dedicated field
                    metadata: {
                        ...payment.metadata,
                        webhookReceivedAt: new Date().toISOString()
                    }
                }
            });
            // Process based on status
            if (status === 'CONFIRMED' && payment.status === PaymentStatus.PENDING) {
                await this.confirmPayment(payment.id);
                logger.info({ paymentId: payment.id, externalId }, 'Payment confirmed via webhook');
            }
            else if (status === 'FAILED') {
                await db.payment.update({
                    where: { id: payment.id },
                    data: { status: PaymentStatus.FAILED }
                });
                logger.info({ paymentId: payment.id, externalId }, 'Payment failed via webhook');
                // Send failure email
                try {
                    await sendPaymentFailedEmail(payment.user.email, payment.user.firstName, {
                        amount: payment.amount,
                        currency: payment.country.currency,
                        transactionId: payment.fapshiTransId || payment.paymentReference,
                        paymentMethod: payment.paymentProvider || 'Mobile Money',
                        errorMessage: event.message || 'Payment could not be completed',
                        date: payment.createdAt
                    });
                    logger.info({ paymentId: payment.id, email: payment.user.email }, 'Payment failure email sent');
                }
                catch (emailError) {
                    logger.error({ paymentId: payment.id, error: emailError.message }, 'Failed to send payment failure email');
                }
            }
        }
        catch (error) {
            logger.error({ error: error.message, event }, 'Failed to handle webhook event');
            throw error;
        }
    }
    /**
     * Get payment history for a user
     */
    static async getPaymentHistory(userId, page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const whereClause = { userId };
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
    static async verifyPayment(paymentId, adminId) {
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
        }
        catch (error) {
            logger.error({ error: error.message, paymentId }, 'Failed to verify payment');
            throw error;
        }
    }
    /**
     * Handle payment success callback from Fapshi redirect
     * Called when user is redirected back from payment gateway
     */
    static async handlePaymentSuccessCallback(transId, status) {
        try {
            logger.info({ transId, status }, 'Handling payment success callback');
            // Find payment by Fapshi transaction ID
            const payment = await db.payment.findFirst({
                where: {
                    fapshiTransId: transId
                },
                include: {
                    user: true,
                    country: true
                }
            });
            if (!payment) {
                logger.warn({ transId }, 'Payment not found for transaction ID');
                throw new Error('Payment not found');
            }
            // If payment is already confirmed, return success
            if (payment.status === PaymentStatus.CONFIRMED) {
                logger.info({ paymentId: payment.id, transId }, 'Payment already confirmed');
                return {
                    success: true,
                    paymentId: payment.id,
                    status: 'CONFIRMED',
                    message: 'Payment already confirmed'
                };
            }
            // Update payment status based on callback status
            if (status.toUpperCase() === 'SUCCESSFUL' || status.toUpperCase() === 'SUCCESS') {
                // Confirm payment and trigger commission calculation
                await this.confirmPayment(payment.id);
                logger.info({ paymentId: payment.id, transId }, 'Payment confirmed via redirect callback');
                return {
                    success: true,
                    paymentId: payment.id,
                    status: 'CONFIRMED',
                    message: 'Payment confirmed successfully'
                };
            }
            else if (status.toUpperCase() === 'FAILED') {
                // Update payment status to failed
                await db.payment.update({
                    where: { id: payment.id },
                    data: { status: PaymentStatus.FAILED }
                });
                // Send failure email
                try {
                    await sendPaymentFailedEmail(payment.user.email, payment.user.firstName, {
                        amount: payment.amount,
                        currency: payment.country.currency,
                        transactionId: transId,
                        paymentMethod: payment.paymentProvider || 'Mobile Money',
                        errorMessage: 'Payment was not successful',
                        date: payment.createdAt
                    });
                    logger.info({ paymentId: payment.id, email: payment.user.email }, 'Payment failure email sent');
                }
                catch (emailError) {
                    logger.error({ paymentId: payment.id, error: emailError.message }, 'Failed to send payment failure email');
                }
                logger.info({ paymentId: payment.id, transId }, 'Payment marked as failed');
                return {
                    success: false,
                    paymentId: payment.id,
                    status: 'FAILED',
                    message: 'Payment failed'
                };
            }
            else {
                // Status is PENDING or unknown
                logger.info({ paymentId: payment.id, transId, status }, 'Payment status is pending');
                return {
                    success: true,
                    paymentId: payment.id,
                    status: payment.status,
                    message: 'Payment is still pending'
                };
            }
        }
        catch (error) {
            logger.error({ error: error.message, transId, status }, 'Failed to handle payment success callback');
            throw error;
        }
    }
    /**
     * Check if a user has a confirmed payment (for students)
     */
    static async checkUserPaymentStatus(userId) {
        try {
            const user = await db.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    role: true,
                    email: true
                }
            });
            if (!user) {
                throw new Error('User not found');
            }
            // Only students need to have paid
            if (user.role !== 'STUDENT') {
                return {
                    hasPaid: true,
                    isRequired: false,
                    message: 'Payment not required for this user role'
                };
            }
            // Check if user has a confirmed payment
            const confirmedPayment = await db.payment.findFirst({
                where: {
                    userId: user.id,
                    status: PaymentStatus.CONFIRMED
                },
                include: {
                    country: {
                        select: {
                            name: true,
                            currency: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            if (confirmedPayment) {
                return {
                    hasPaid: true,
                    isRequired: true,
                    payment: {
                        id: confirmedPayment.id,
                        amount: confirmedPayment.amount,
                        currency: confirmedPayment.country.currency,
                        paymentReference: confirmedPayment.paymentReference,
                        verifiedAt: confirmedPayment.verifiedAt,
                        createdAt: confirmedPayment.createdAt
                    },
                    message: 'User has a confirmed payment'
                };
            }
            // Check if user has any pending payment
            const pendingPayment = await db.payment.findFirst({
                where: {
                    userId: user.id,
                    status: PaymentStatus.PENDING
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return {
                hasPaid: false,
                isRequired: true,
                hasPendingPayment: !!pendingPayment,
                pendingPaymentId: pendingPayment?.id || null,
                message: 'User has not completed payment'
            };
        }
        catch (error) {
            logger.error({ error: error.message, userId }, 'Failed to check user payment status');
            throw error;
        }
    }
}
//# sourceMappingURL=service.js.map