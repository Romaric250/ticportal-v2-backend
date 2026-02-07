import axios from 'axios';
import type { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { env } from '../../config/env';
import { logger } from '../../shared/utils/logger';

/**
 * Fapshi Payment Gateway Integration
 * Supports MTN Mobile Money and Orange Money payments in Cameroon
 */
export class FapshiService {
  private client: AxiosInstance;
  private apiKey: string;
  private apiUser: string;

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
    this.client.interceptors.request.use(
      (config) => {
        logger.info({ 
          method: config.method?.toUpperCase(), 
          url: config.url,
          data: config.data 
        }, 'Fapshi API Request');
        return config;
      },
      (error) => {
        logger.error({ error }, 'Fapshi API Request Error');
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info({ 
          status: response.status,
          data: response.data 
        }, 'Fapshi API Response');
        return response;
      },
      (error) => {
        logger.error({ 
          status: error.response?.status,
          data: error.response?.data 
        }, 'Fapshi API Response Error');
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initiate a payment collection
   * 
   * @param phoneNumber - Customer's phone number (e.g., "237650495499")
   * @param amount - Amount to collect (minimum 100 XAF)
   * @param externalId - Your unique transaction reference
   * @param message - Optional message to customer
   * @returns Payment initiation response
   */
  async initiatePayment(params: {
    phoneNumber: string;
    amount: number;
    externalId: string;
    message?: string;
  }): Promise<FapshiInitiateResponse> {
    try {
      const { phoneNumber, amount, externalId, message } = params;

      // Validate amount (minimum 100 XAF)
      if (amount < 100) {
        throw new Error('Minimum payment amount is 100 XAF');
      }

      // Validate phone number format (must start with country code, e.g., 237)
      if (!phoneNumber.match(/^237\d{9}$/)) {
        throw new Error('Invalid phone number format. Must be 237XXXXXXXXX');
      }

      const payload = {
        phone: phoneNumber,
        amount: amount,
        externalId: externalId,
        message: message || `Payment for TiC Summit Training - ${externalId}`
      };

      const response = await this.client.post<FapshiInitiateResponse>(
        '/initiate-pay',
        payload
      );

      logger.info({ externalId, transId: response.data.transId }, 'Fapshi payment initiated');

      return response.data;
    } catch (error: any) {
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
  async checkPaymentStatus(transId: string): Promise<FapshiStatusResponse> {
    try {
      const response = await this.client.get<FapshiStatusResponse>(
        `/payment-status/${transId}`
      );

      logger.info({ transId, status: response.data.status }, 'Fapshi payment status checked');

      return response.data;
    } catch (error: any) {
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
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', env.fapshiWebhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
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
  async processWebhook(event: FapshiWebhookEvent): Promise<ProcessedWebhookEvent> {
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
    } catch (error: any) {
      logger.error({ error: error.message, event }, 'Failed to process webhook');
      throw new Error(`Failed to process webhook: ${error.message}`);
    }
  }

  /**
   * Map Fapshi status to our internal status
   */
  private mapFapshiStatus(fapshiStatus: string): PaymentStatusEnum {
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
  getSupportedPaymentMethods(): PaymentMethodInfo[] {
    return [
      {
        code: 'MTN',
        name: 'MTN Mobile Money',
        description: 'Pay with MTN Mobile Money',
        logo: 'mtn-logo.png',
        phonePrefix: '237650,237651,237652,237653,237654'
      },
      {
        code: 'ORANGE',
        name: 'Orange Money',
        description: 'Pay with Orange Money',
        logo: 'orange-logo.png',
        phonePrefix: '237655,237656,237657,237658,237659'
      }
    ];
  }

  /**
   * Detect payment method from phone number
   */
  detectPaymentMethod(phoneNumber: string): 'MTN' | 'ORANGE' | 'UNKNOWN' {
    // Remove country code if present
    const phone = phoneNumber.replace(/^237/, '');
    
    // MTN prefixes: 650, 651, 652, 653, 654, 67, 68
    if (phone.match(/^(650|651|652|653|654|67|68)/)) {
      return 'MTN';
    }
    
    // Orange prefixes: 655, 656, 657, 658, 659, 69
    if (phone.match(/^(655|656|657|658|659|69)/)) {
      return 'ORANGE';
    }
    
    return 'UNKNOWN';
  }
}

// Types and Interfaces

export interface FapshiInitiateResponse {
  transId: string;
  status: string;
  message: string;
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
  externalId: string;
  status: string;
  amount: number;
  phone: string;
  message?: string;
  date?: string;
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
  phonePrefix: string;
}

// Export singleton instance
export const fapshiService = new FapshiService();
