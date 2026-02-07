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
   */
  initiatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { phoneNumber, amount, referralCode, countryId } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!phoneNumber || !amount || !countryId) {
        res.status(400).json({ error: 'Phone number, amount, and country ID are required' });
        return;
      }

      const result = await PaymentService.initiatePayment({
        userId,
        phoneNumber,
        amount,
        countryId,
        referralCode
      });

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Error initiating payment:', error);
      res.status(500).json({ error: error.message || 'Failed to initiate payment' });
    }
  };

  /**
   * Check payment status
   */
  checkPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.params;
      const userId = (req as any).user?.id;

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
   */
  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers['x-fapshi-signature'] as string;
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
      res.status(500).json({ error: error.message || 'Failed to fetch payment methods' });
    }
  };

  /**
   * Detect payment method from phone number
   */
  detectPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        res.status(400).json({ error: 'Phone number is required' });
        return;
      }

      const method = fapshiService.detectPaymentMethod(phoneNumber);
      res.status(200).json({ success: true, data: { method } });
    } catch (error: any) {
      logger.error('Error detecting payment method:', error);
      res.status(500).json({ error: error.message || 'Failed to detect payment method' });
    }
  };
}
