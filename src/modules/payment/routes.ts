import { Router } from 'express';
import { PaymentController } from './controller';
import { authenticate, authorize } from '../../shared/middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();
const paymentController = new PaymentController();

/**
 * Public routes
 */
// Get supported payment methods
router.get('/methods', paymentController.getPaymentMethods);

// Webhook endpoint (no auth required - verified by signature)
router.post('/webhook/fapshi', paymentController.handleWebhook);

// Payment success callback from Fapshi redirect (no auth required)
// Frontend calls this after redirect: POST /confirm-success with {transId, status}
router.post('/confirm-success', paymentController.handlePaymentSuccessCallback);

/**
 * Protected routes - Student
 */
// Initiate a payment
router.post(
  '/initiate',
  authenticate,
  paymentController.initiatePayment
);

// Check payment status
router.get(
  '/:paymentId/status',
  authenticate,
  paymentController.checkPaymentStatus
);

// Get payment history
router.get(
  '/history',
  authenticate,
  paymentController.getPaymentHistory
);

// Check if user has paid (for students) - detailed response
router.get(
  '/check-status',
  authenticate,
  paymentController.checkUserPaymentStatus
);

// Simple payment status check - returns true/false
router.get(
  '/status',
  authenticate,
  paymentController.getPaymentStatus
);

/**
 * Admin routes
 */
// Manually verify a payment
router.post(
  '/:paymentId/verify',
  authenticate,
  authorize([UserRole.ADMIN]),
  paymentController.verifyPayment
);

export default router;
