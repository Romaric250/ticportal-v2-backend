import type { Request, Response } from 'express';
import { PaymentService } from './service';
import { logger } from '../../shared/utils/logger';
import { fapshiService } from '../../shared/utils/fapshi';
import crypto from 'crypto';

/**
 * Payment Controller
 * Handles payment initiation, verification, and webhooks
 */
export class PaymentController {

  /**
   * Initiate a payment
   * Can pay for yourself or another user (userId in body)
   */
  initiatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const authenticatedUserId = (req as any).user?.userId;
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
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack }, 'Error initiating payment');
      res.status(500).json({ success: false, error: { message: error.message || 'Failed to initiate payment' } });
    }
  };

  /**
   * Check payment status
   */
  checkPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.params;
      const userId = (req as any).user?.id;

      console.log("userid", userId)
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const status = await PaymentService.checkPaymentStatus(paymentId as string, userId);
      res.status(200).json({ success: true, data: status });
    } catch (error: any) {
      logger.error('Error checking payment status:', error);
      res.status(500).json({ error: error.message || 'Failed to check payment status' });
    }
  };

  /**
   * Get user's payment history
   */
  getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { page = '1', limit = '20', status } = req.query;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const payments = await PaymentService.getPaymentHistory(
        userId,
        parseInt(page as string),
        parseInt(limit as string),
        status as string | undefined
      );

      res.status(200).json({ success: true, data: payments });
    } catch (error: any) {
      logger.error('Error fetching payment history:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch payment history' });
    }
  };

  /**
   * Webhook handler for Fapshi payment notifications
   * Receives: SUCCESSFUL, FAILED, EXPIRED
   * Verifies via x-fapshi-signature (HMAC) or apiuser/apikey headers
   */
  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers['x-fapshi-signature'] as string | undefined;
      const rawBody = JSON.stringify(req.body);
      const headers: Record<string, string | undefined> = {
        apiuser: req.headers['apiuser'] as string | undefined,
        apikey: req.headers['apikey'] as string | undefined,
      };

      if (!fapshiService.verifyWebhookSignature(rawBody, signature, headers)) {
        logger.warn({ body: req.body }, 'Invalid webhook signature or credentials');
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      const event = await fapshiService.processWebhook(req.body);
      await PaymentService.handleWebhookEvent(event);

      res.status(200).json({
        transId: event.transactionId,
        status: event.status,
        message: 'Webhook processed',
      });
    } catch (error: any) {
      logger.error('Error processing webhook:', error);
      res.status(500).json({ error: error.message || 'Failed to process webhook' });
    }
  };

  /**
   * Admin: Manually verify a payment
   */
  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.params;
      const adminId = (req as any).user?.id;

      if (!adminId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await PaymentService.verifyPayment(paymentId as string, adminId);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error verifying payment:', error);
      res.status(500).json({ error: error.message || 'Failed to verify payment' });
    }
  };

  /**
   * Get supported payment methods
   */
  getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
      const methods = fapshiService.getSupportedPaymentMethods();
      res.status(200).json({ success: true, data: methods });
    } catch (error: any) {
      logger.error('Error fetching payment methods:', error);
      res.status(500).json({ success: false, error: { message: error.message || 'Failed to fetch payment methods' } });
    }
  };

  /**
   * Handle payment success callback from Fapshi redirect
   * Called when user is redirected back from payment gateway
   * POST /api/payment/confirm-success with body: {transId: "xxx", status: "SUCCESSFUL"}
   */
  handlePaymentSuccessCallback = async (req: Request, res: Response): Promise<void> => {
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

      const result = await PaymentService.handlePaymentSuccessCallback(
        transId as string,
        status as string
      );

      logger.info({ transId, status, result }, 'Payment success callback processed');

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
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
  checkUserPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ 
          success: false, 
          error: { message: 'Unauthorized' } 
        });
        return;
      }

      const result = await PaymentService.checkUserPaymentStatus(userId);

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error checking user payment status');
      res.status(500).json({ 
        success: false, 
        error: { message: error.message || 'Failed to check payment status' } 
      });
    }
  };

  /**
   * Admin: Reverse a manual subscription
   * POST /api/payment/admin/reverse-manual-subscription
   */
  reverseManualSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as any).user?.userId || (req as any).user?.id;
      const { userId } = req.body;

      if (!adminId) {
        res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
        return;
      }
      if (!userId) {
        res.status(400).json({
          success: false,
          error: { message: 'userId is required' },
        });
        return;
      }

      const result = await PaymentService.reverseManualSubscription({
        userId,
        adminId,
      });

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error reversing manual subscription');
      res.status(500).json({
        success: false,
        error: { message: error.message || 'Failed to reverse manual subscription' },
      });
    }
  };

  /**
   * Admin: Create manual subscription for a user
   * POST /api/payment/admin/manual-subscription
   */
  createManualSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = (req as any).user?.userId || (req as any).user?.id;
      const { userId, countryId, amount, affiliateId, referralCode } = req.body;

      if (!adminId) {
        res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
        return;
      }
      if (!userId || !countryId || !amount) {
        res.status(400).json({
          success: false,
          error: { message: 'userId, countryId, and amount are required' }
        });
        return;
      }

      const result = await PaymentService.createManualSubscription({
        userId,
        countryId,
        amount: Number(amount),
        affiliateId,
        referralCode,
        adminId
      });

      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error creating manual subscription');
      res.status(500).json({
        success: false,
        error: { message: error.message || 'Failed to create manual subscription' }
      });
    }
  };

  /**
   * Simple status check - returns true/false if student has paid
   * GET /api/payment/status
   */
  getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;

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
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error checking payment status');
      res.status(500).json({ 
        success: false, 
        error: { message: error.message || 'Failed to check payment status' } 
      });
    }
  };
}
