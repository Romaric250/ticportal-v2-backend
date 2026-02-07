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

// Detect payment method from phone number
router.post('/detect-method', paymentController.detectPaymentMethod);

// Webhook endpoint (no auth required - verified by signature)
router.post('/webhook/fapshi', paymentController.handleWebhook);

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
