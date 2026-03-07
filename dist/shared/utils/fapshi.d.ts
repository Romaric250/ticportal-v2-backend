/**
 * Fapshi Payment Gateway Integration
 * Supports MTN Mobile Money and Orange Money payments in Cameroon
 */
export declare class FapshiService {
    private client;
    private apiKey;
    private apiUser;
    constructor();
    /**
     * Initiate a payment collection
     *
     * @param amount - Amount to collect (minimum 100 XAF)
     * @param email - Customer's email address
     * @param userId - Customer's user ID
     * @param externalId - Your unique transaction reference
     * @param redirectUrl - URL to redirect after payment
     * @param message - Optional message to customer
     * @returns Payment initiation response with payment link
     */
    initiatePayment(params: {
        amount: number;
        email: string;
        userId: string;
        externalId: string;
        redirectUrl?: string;
        message?: string;
    }): Promise<FapshiInitiateResponse>;
    /**
     * Check payment status
     *
     * @param transId - Fapshi transaction ID (returned from initiatePayment)
     * @returns Payment status
     */
    checkPaymentStatus(transId: string): Promise<FapshiStatusResponse>;
    /**
     * Verify webhook authenticity
     * Supports: 1) x-fapshi-signature HMAC, 2) apiuser + apikey headers (per Fapshi docs)
     *
     * @param payload - Raw webhook payload (for HMAC)
     * @param signature - Signature from x-fapshi-signature header (optional)
     * @param headers - Request headers for apiuser/apikey (optional)
     * @returns true if valid
     */
    verifyWebhookSignature(payload: string, signature?: string, headers?: Record<string, string | undefined>): boolean;
    /**
     * Process webhook event
     * Handles Fapshi payload: transId, status, externalId, amount, payerName, email, etc.
     *
     * @param event - Webhook event data (object or array of objects)
     * @returns Processed event data (or first event if array)
     */
    processWebhook(event: FapshiWebhookEvent | FapshiWebhookEvent[]): Promise<ProcessedWebhookEvent>;
    /**
     * Map Fapshi status to our internal status
     * Fapshi sends: SUCCESSFUL, FAILED, EXPIRED, PENDING, CREATED
     */
    private mapFapshiStatus;
    /**
     * Get supported payment methods
     */
    getSupportedPaymentMethods(): PaymentMethodInfo[];
}
export interface FapshiInitiateResponse {
    transId: string;
    message: string;
    link: string;
    dateInitiated: string;
}
export interface FapshiStatusResponse {
    transId: string;
    externalId: string;
    status: string;
    amount: number;
    phone: string;
    message: string;
    date: string;
}
export interface FapshiWebhookEvent {
    transId: string;
    externalId?: string;
    status: string;
    amount?: number;
    revenue?: number;
    phone?: string;
    payerName?: string;
    message?: string;
    date?: string;
    [key: string]: unknown;
}
export interface ProcessedWebhookEvent {
    transactionId: string;
    externalId: string;
    status: PaymentStatusEnum;
    amount: number;
    phoneNumber: string;
    message?: string;
    timestamp: Date;
}
export type PaymentStatusEnum = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';
export interface PaymentMethodInfo {
    code: string;
    name: string;
    description: string;
    logo: string;
}
export declare const fapshiService: FapshiService;
//# sourceMappingURL=fapshi.d.ts.map