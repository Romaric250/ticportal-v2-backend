/**
 * Payment and Commission Service
 * Handles payment confirmation and commission calculation/distribution
 */
export declare class PaymentCommissionService {
    /**
     * Process a payment confirmation and trigger commission calculation
     */
    static confirmPayment(paymentId: string, verifiedBy: string): Promise<any>;
    /**
     * Calculate commissions for a referral
     */
    static calculateCommissions(referralId: string, country: any): Promise<void>;
    /**
     * Process failed commission calculations
     * This is called by cron job to retry failed commission calculations
     */
    static processFailedCommissions(): Promise<void>;
    /**
     * Activate a referral (student activated on platform)
     */
    static activateReferral(referralId: string): Promise<void>;
    /**
     * Approve commissions after cooling period
     */
    static approveCommissions(commissionIds: string[]): Promise<void>;
    /**
     * Create a payout batch
     */
    static createPayoutBatch(commissionIds: string[], createdBy: string): Promise<any>;
    /**
     * Mark payout batch as completed
     */
    static completePayoutBatch(batchId: string): Promise<void>;
    /**
     * Get approved commissions ready for payout
     */
    static getApprovedCommissionsForPayout(limit?: number): Promise<any[]>;
}
//# sourceMappingURL=payment-commission.service.d.ts.map