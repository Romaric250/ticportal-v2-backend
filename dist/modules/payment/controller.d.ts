import type { Request, Response } from 'express';
/**
 * Payment Controller
 * Handles payment initiation, verification, and webhooks
 */
export declare class PaymentController {
    /**
     * Initiate a payment
     * Can pay for yourself or another user (userId in body)
     */
    initiatePayment: (req: Request, res: Response) => Promise<void>;
    /**
     * Check payment status
     */
    checkPaymentStatus: (req: Request, res: Response) => Promise<void>;
    /**
     * Get user's payment history
     */
    getPaymentHistory: (req: Request, res: Response) => Promise<void>;
    /**
     * Webhook handler for Fapshi payment notifications
     */
    handleWebhook: (req: Request, res: Response) => Promise<void>;
    /**
     * Admin: Manually verify a payment
     */
    verifyPayment: (req: Request, res: Response) => Promise<void>;
    /**
     * Get supported payment methods
     */
    getPaymentMethods: (req: Request, res: Response) => Promise<void>;
    /**
     * Handle payment success callback from Fapshi redirect
     * Called when user is redirected back from payment gateway
     * POST /api/payment/confirm-success with body: {transId: "xxx", status: "SUCCESSFUL"}
     */
    handlePaymentSuccessCallback: (req: Request, res: Response) => Promise<void>;
    /**
     * Check if current user has paid (for students)
     */
    checkUserPaymentStatus: (req: Request, res: Response) => Promise<void>;
    /**
     * Simple status check - returns true/false if student has paid
     * GET /api/payment/status
     */
    getPaymentStatus: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map