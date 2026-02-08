import { type ProcessedWebhookEvent } from "../../shared/utils/fapshi";
/**
 * Payment Service
 * Handles payment processing, verification, and integration with commission system
 */
export declare class PaymentService {
    /**
     * Initiate a payment for student registration
     * Referral code is passed here (from payment link), not during registration
     * Can pay for yourself or another user (userId in params)
     */
    static initiatePayment(params: {
        userId: string;
        amount: number;
        countryId: string;
        referralCode?: string;
        phoneNumber?: string;
    }): Promise<any>;
    /**
     * Check payment status
     */
    static checkPaymentStatus(paymentId: string, userId: string): Promise<any>;
    /**
     * Confirm a payment (internal use)
     */
    private static confirmPayment;
    /**
     * Handle webhook event from Fapshi
     */
    static handleWebhookEvent(event: ProcessedWebhookEvent): Promise<void>;
    /**
     * Get payment history for a user
     */
    static getPaymentHistory(userId: string, page?: number, limit?: number, status?: string): Promise<any>;
    /**
     * Admin: Manually verify a payment
     */
    static verifyPayment(paymentId: string, adminId: string): Promise<any>;
    /**
     * Handle payment success callback from Fapshi redirect
     * Called when user is redirected back from payment gateway
     */
    static handlePaymentSuccessCallback(transId: string, status: string): Promise<any>;
    /**
     * Check if a user has a confirmed payment (for students)
     */
    static checkUserPaymentStatus(userId: string): Promise<any>;
}
//# sourceMappingURL=service.d.ts.map