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
                amount,
                email,
                userId,
                externalId,
                redirectUrl: redirectUrl || `${env.frontendUrl}/payment-successful`,
                message: message || `Registration Fee for TiC Summit 2026 - ${externalId}`
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
     * Verify webhook authenticity
     * Supports: 1) x-fapshi-signature HMAC, 2) apiuser + apikey headers (per Fapshi docs)
     *
     * @param payload - Raw webhook payload (for HMAC)
     * @param signature - Signature from x-fapshi-signature header (optional)
     * @param headers - Request headers for apiuser/apikey (optional)
     * @returns true if valid
     */
    verifyWebhookSignature(payload, signature, headers) {
        // 1. HMAC signature (if webhook secret configured)
        if (signature && env.fapshiWebhookSecret) {
            try {
                const expectedSignature = crypto
                    .createHmac('sha256', env.fapshiWebhookSecret)
                    .update(payload)
                    .digest('hex');
                if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
                    return true;
                }
            }
            catch (error) {
                logger.error({ error }, 'Failed to verify webhook signature');
            }
        }
        // 2. apiuser + apikey headers (per Fapshi webhook docs)
        if (headers?.apiuser && headers?.apikey) {
            if (headers.apiuser === env.fapshiApiUser && headers.apikey === env.fapshiApiKey) {
                return true;
            }
        }
        return false;
    }
    /**
     * Process webhook event
     * Handles Fapshi payload: transId, status, externalId, amount, payerName, email, etc.
     *
     * @param event - Webhook event data (object or array of objects)
     * @returns Processed event data (or first event if array)
     */
    async processWebhook(event) {
        try {
            const raw = Array.isArray(event) ? event[0] : event;
            if (!raw) {
                throw new Error('Empty webhook payload');
            }
            const transId = raw.transId;
            const status = raw.status;
            const externalId = raw.externalId ?? raw.externalId;
            const amount = raw.amount ?? raw.revenue ?? 0;
            const phone = raw.phone ?? raw.payerName ?? '';
            logger.info({ transId, externalId, status }, 'Processing Fapshi webhook');
            if (!externalId) {
                throw new Error('Webhook missing externalId (payment reference)');
            }
            return {
                transactionId: transId,
                externalId,
                status: this.mapFapshiStatus(status),
                amount,
                phoneNumber: phone,
                ...(raw.message && { message: raw.message }),
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
     * Fapshi sends: SUCCESSFUL, FAILED, EXPIRED, PENDING, CREATED
     */
    mapFapshiStatus(fapshiStatus) {
        switch (fapshiStatus.toUpperCase()) {
            case 'SUCCESSFUL':
            case 'SUCCESS':
                return 'CONFIRMED';
            case 'FAILED':
            case 'EXPIRED':
                return 'FAILED';
            case 'PENDING':
            case 'CREATED':
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