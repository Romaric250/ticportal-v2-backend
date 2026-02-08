import { PaymentService } from "./service.js";
import { logger } from "../../shared/utils/logger.js";
import { fapshiService } from "../../shared/utils/fapshi.js";
import crypto from 'crypto';
/**
 * Payment Controller
 * Handles payment initiation, verification, and webhooks
 */
export class PaymentController {
    constructor() {
        /**
         * Initiate a payment
         * Can pay for yourself or another user (userId in body)
         */
        this.initiatePayment = async (req, res) => {
            try {
                const authenticatedUserId = req.user?.userId;
                const { userId, amount, referralCode, countryId, phoneNumber } = req.body;
                // Log request details for debugging
                logger.info({ authenticatedUserId, userId, amount, countryId, hasReferral: !!referralCode }, 'Payment initiation request');
                if (!authenticatedUserId) {
                    logger.warn('Payment initiation failed: No authenticated user ID in request');
                    res.status(401).json({ success: false, error: { message: 'Unauthorized - user not authenticated' } });
                    return;
                }
                // Use userId from body if provided (paying for another user), otherwise use authenticated user
                const targetUserId = userId || authenticatedUserId;
                if (!amount || !countryId) {
                    logger.warn({ amount, countryId }, 'Payment initiation failed: Missing required fields');
                    res.status(400).json({ success: false, error: { message: 'Amount and country ID are required' } });
                    return;
                }
                const result = await PaymentService.initiatePayment({
                    userId: targetUserId,
                    amount,
                    countryId,
                    referralCode,
                    phoneNumber
                });
                logger.info({ paymentId: result.paymentId, userId: targetUserId, paidBy: authenticatedUserId }, 'Payment initiated successfully');
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                logger.error({ error: error.message, stack: error.stack }, 'Error initiating payment');
                res.status(500).json({ success: false, error: { message: error.message || 'Failed to initiate payment' } });
            }
        };
        /**
         * Check payment status
         */
        this.checkPaymentStatus = async (req, res) => {
            try {
                const { paymentId } = req.params;
                const userId = req.user?.id;
                console.log("userid", userId);
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const status = await PaymentService.checkPaymentStatus(paymentId, userId);
                res.status(200).json({ success: true, data: status });
            }
            catch (error) {
                logger.error('Error checking payment status:', error);
                res.status(500).json({ error: error.message || 'Failed to check payment status' });
            }
        };
        /**
         * Get user's payment history
         */
        this.getPaymentHistory = async (req, res) => {
            try {
                const userId = req.user?.id;
                const { page = '1', limit = '20', status } = req.query;
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const payments = await PaymentService.getPaymentHistory(userId, parseInt(page), parseInt(limit), status);
                res.status(200).json({ success: true, data: payments });
            }
            catch (error) {
                logger.error('Error fetching payment history:', error);
                res.status(500).json({ error: error.message || 'Failed to fetch payment history' });
            }
        };
        /**
         * Webhook handler for Fapshi payment notifications
         */
        this.handleWebhook = async (req, res) => {
            try {
                const signature = req.headers['x-fapshi-signature'];
                const rawBody = JSON.stringify(req.body);
                // Verify webhook signature
                if (!fapshiService.verifyWebhookSignature(rawBody, signature)) {
                    logger.warn({ body: req.body }, 'Invalid webhook signature');
                    res.status(401).json({ error: 'Invalid signature' });
                    return;
                }
                // Process webhook
                const event = await fapshiService.processWebhook(req.body);
                // Update payment status in database
                await PaymentService.handleWebhookEvent(event);
                // Respond to Fapshi
                res.status(200).json({ success: true, message: 'Webhook processed' });
            }
            catch (error) {
                logger.error('Error processing webhook:', error);
                res.status(500).json({ error: error.message || 'Failed to process webhook' });
            }
        };
        /**
         * Admin: Manually verify a payment
         */
        this.verifyPayment = async (req, res) => {
            try {
                const { paymentId } = req.params;
                const adminId = req.user?.id;
                if (!adminId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const result = await PaymentService.verifyPayment(paymentId, adminId);
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                logger.error('Error verifying payment:', error);
                res.status(500).json({ error: error.message || 'Failed to verify payment' });
            }
        };
        /**
         * Get supported payment methods
         */
        this.getPaymentMethods = async (req, res) => {
            try {
                const methods = fapshiService.getSupportedPaymentMethods();
                res.status(200).json({ success: true, data: methods });
            }
            catch (error) {
                logger.error('Error fetching payment methods:', error);
                res.status(500).json({ success: false, error: { message: error.message || 'Failed to fetch payment methods' } });
            }
        };
        /**
         * Handle payment success callback from Fapshi redirect
         * Called when user is redirected back from payment gateway
         * POST /api/payment/confirm-success with body: {transId: "xxx", status: "SUCCESSFUL"}
         */
        this.handlePaymentSuccessCallback = async (req, res) => {
            try {
                const { transId, status } = req.body;
                if (!transId || !status) {
                    logger.warn({ body: req.body }, 'Missing transId or status in payment callback');
                    res.status(400).json({
                        success: false,
                        error: { message: 'transId and status are required in request body' }
                    });
                    return;
                }
                const result = await PaymentService.handlePaymentSuccessCallback(transId, status);
                logger.info({ transId, status, result }, 'Payment success callback processed');
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                logger.error({ error: error.message, body: req.body }, 'Error handling payment success callback');
                res.status(500).json({
                    success: false,
                    error: { message: error.message || 'Failed to process payment callback' }
                });
            }
        };
        /**
         * Check if current user has paid (for students)
         */
        this.checkUserPaymentStatus = async (req, res) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        error: { message: 'Unauthorized' }
                    });
                    return;
                }
                const result = await PaymentService.checkUserPaymentStatus(userId);
                res.status(200).json({ success: true, data: result });
            }
            catch (error) {
                logger.error({ error: error.message }, 'Error checking user payment status');
                res.status(500).json({
                    success: false,
                    error: { message: error.message || 'Failed to check payment status' }
                });
            }
        };
        /**
         * Simple status check - returns true/false if student has paid
         * GET /api/payment/status
         */
        this.getPaymentStatus = async (req, res) => {
            try {
                const userId = req.user?.userId;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        error: { message: 'Unauthorized' }
                    });
                    return;
                }
                const result = await PaymentService.checkUserPaymentStatus(userId);
                // Return simple true/false for hasPaid
                res.status(200).json({
                    success: true,
                    data: {
                        hasPaid: result.hasPaid,
                        isRequired: result.isRequired
                    }
                });
            }
            catch (error) {
                logger.error({ error: error.message }, 'Error checking payment status');
                res.status(500).json({
                    success: false,
                    error: { message: error.message || 'Failed to check payment status' }
                });
            }
        };
    }
}
//# sourceMappingURL=controller.js.map