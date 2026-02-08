import axios from 'axios';
import crypto from 'crypto';
import { env } from "../../config/env.js";
import { logger } from "../../shared/utils/logger.js";
/**
 * Fapshi Payment Gateway Integration
 * Supports MTN Mobile Money and Orange Money payments in Cameroon
 */
export class FapshiService {
    constructor() {
        this.apiKey = env.fapshiApiKey;
        this.apiUser = env.fapshiApiUser;
        this.client = axios.create({
            baseURL: env.fapshiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
                'apiuser': this.apiUser,
                'apikey': this.apiKey
            },
            timeout: 30000
        });
        // Add request interceptor for logging
        this.client.interceptors.request.use((config) => {
            logger.info({
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data
            }, 'Fapshi API Request');
            return config;
        }, (error) => {
            logger.error({ error }, 'Fapshi API Request Error');
            return Promise.reject(error);
        });
        // Add response interceptor for logging
        this.client.interceptors.response.use((response) => {
            logger.info({
                status: response.status,
                data: response.data
            }, 'Fapshi API Response');
            return response;
        }, (error) => {
            logger.error({
                status: error.response?.status,
                data: error.response?.data
            }, 'Fapshi API Response Error');
            return Promise.reject(error);
        });
    }
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
    async initiatePayment(params) {
        try {
            const { amount, email, userId, externalId, redirectUrl, message } = params;
            // Validate amount (minimum 100 XAF)
            if (amount < 100) {
                throw new Error('Minimum payment amount is 100 XAF');
            }
            const payload = {
                amount: 100,
                email,
                userId,
                externalId,
                redirectUrl: redirectUrl || `${env.frontendUrl}/payment-successful`,
                message: message || `Registration Fee for TiC Summit 20260 - ${externalId}`
            };
            const response = await this.client.post('/initiate-pay', payload);
            console.log(" fapshi response:", response);
            logger.info({
                externalId,
                transId: response.data.transId,
                hasLink: !!response.data.link
            }, 'Fapshi payment initiated');
            return response.data;
        }
        catch (error) {
            logger.error({ error: error.message, params }, 'Failed to initiate Fapshi payment');
            throw new Error(`Fapshi payment initiation failed: ${error.message}`);
        }
    }
    /**
     * Check payment status
     *
     * @param transId - Fapshi transaction ID (returned from initiatePayment)
     * @returns Payment status
     */
    async checkPaymentStatus(transId) {
        try {
            const response = await this.client.get(`/payment-status/${transId}`);
            logger.info({ transId, status: response.data.status }, 'Fapshi payment status checked');
            return response.data;
        }
        catch (error) {
            logger.error({ error: error.message, transId }, 'Failed to check Fapshi payment status');
            throw new Error(`Failed to check payment status: ${error.message}`);
        }
    }
    /**
     * Verify webhook signature
     *
     * @param payload - Raw webhook payload
     * @param signature - Signature from webhook header
     * @returns true if signature is valid
     */
    verifyWebhookSignature(payload, signature) {
        try {
            const expectedSignature = crypto
                .createHmac('sha256', env.fapshiWebhookSecret)
                .update(payload)
                .digest('hex');
            return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
        }
        catch (error) {
            logger.error({ error }, 'Failed to verify webhook signature');
            return false;
        }
    }
    /**
     * Process webhook event
     *
     * @param event - Webhook event data
     * @returns Processed event data
     */
    async processWebhook(event) {
        try {
            const { transId, status, externalId, amount, phone, message } = event;
            logger.info({ transId, externalId, status }, 'Processing Fapshi webhook');
            return {
                transactionId: transId,
                externalId,
                status: this.mapFapshiStatus(status),
                amount,
                phoneNumber: phone,
                ...(message && { message }),
                timestamp: new Date()
            };
        }
        catch (error) {
            logger.error({ error: error.message, event }, 'Failed to process webhook');
            throw new Error(`Failed to process webhook: ${error.message}`);
        }
    }
    /**
     * Map Fapshi status to our internal status
     */
    mapFapshiStatus(fapshiStatus) {
        switch (fapshiStatus.toUpperCase()) {
            case 'SUCCESSFUL':
            case 'SUCCESS':
                return 'CONFIRMED';
            case 'FAILED':
                return 'FAILED';
            case 'PENDING':
                return 'PENDING';
            default:
                return 'PENDING';
        }
    }
    /**
     * Get supported payment methods
     */
    getSupportedPaymentMethods() {
        return [
            {
                code: 'MTN',
                name: 'MTN Mobile Money',
                description: 'Pay with MTN Mobile Money',
                logo: 'mtn-logo.png'
            },
            {
                code: 'ORANGE',
                name: 'Orange Money',
                description: 'Pay with Orange Money',
                logo: 'orange-logo.png'
            }
        ];
    }
}
// Export singleton instance
export const fapshiService = new FapshiService();
//# sourceMappingURL=fapshi.js.map