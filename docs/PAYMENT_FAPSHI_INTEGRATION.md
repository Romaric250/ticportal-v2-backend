# Payment & Fapshi Integration Guide

## Overview

The TiC Summit Training Portal uses **Fapshi** as the payment gateway to process student registrations via Mobile Money in Cameroon (MTN and Orange Money).

This guide covers:
- Fapshi setup and configuration
- Payment flow and referral attribution
- API endpoints and usage
- Webhook handling
- Testing and troubleshooting

---

## Table of Contents

1. [Fapshi Setup](#fapshi-setup)
2. [Payment Flow](#payment-flow)
3. [Referral Attribution](#referral-attribution)
4. [API Endpoints](#api-endpoints)
5. [Webhook Integration](#webhook-integration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Fapshi Setup

### 1. Get Fapshi Credentials

1. Sign up at [fapshi.com](https://fapshi.com)
2. Complete KYC verification
3. Get your API credentials from the dashboard:
   - **API Key**: Your secret API key
   - **API User**: Your API username/identifier
   - **Webhook Secret**: For webhook signature verification

### 2. Configure Environment Variables

Add these to your `.env` file:

```env
# Fapshi Payment Gateway
FAPSHI_API_KEY=your_fapshi_api_key_here
FAPSHI_API_USER=your_fapshi_api_user_here
FAPSHI_BASE_URL=https://api.fapshi.com
FAPSHI_WEBHOOK_SECRET=your_webhook_secret_here
```

**Production URL**: `https://api.fapshi.com`  
**Sandbox/Test URL**: `https://sandbox.fapshi.com` (if available)

### 3. Configure Webhook URL

In your Fapshi dashboard, set your webhook URL to:

```
https://yourdomain.com/api/payment/webhook/fapshi
```

This endpoint receives real-time payment status updates from Fapshi.

---

## Payment Flow

### Overview

The payment flow integrates with the referral system. Referrals are applied at payment time, not during user registration.

```
User Registration (No Payment)
        ↓
User Clicks Payment Link (with optional referral code)
        ↓
Payment Initiated → Fapshi API
        ↓
User Completes Payment on Phone
        ↓
Fapshi Webhook → Backend
        ↓
Commission Attribution (if referral present)
        ↓
User Status Updated → Email Notification
```

### Step-by-Step Process

1. **User Registration**
   - User creates account (no payment required)
   - User receives email with payment link

2. **Payment Link**
   - Frontend generates payment link with optional referral code:
     ```
     https://portal.ticsummit.com/payment?referral=abc123xyz
     ```

3. **Payment Initiation**
   - Frontend calls `POST /api/payment/initiate` with:
     - `userId`: Logged-in user ID
     - `phoneNumber`: Mobile Money number (237XXXXXXXXX)
     - `amount`: Payment amount (e.g., 15000 XAF)
     - `countryId`: Country ID (determines pricing)
     - `referralCode`: From URL parameter (optional)

4. **Fapshi Processing**
   - Backend calls Fapshi API to initiate collection
   - User receives mobile money prompt on their phone
   - User enters PIN to confirm payment

5. **Webhook Callback**
   - Fapshi sends webhook to `/api/payment/webhook/fapshi`
   - Backend verifies signature
   - Updates payment status
   - Attributes commissions if referral present
   - Sends email notification to user

---

## Referral Attribution

### How Referrals Work

- Referral code is **captured at payment time** (not registration)
- Referral code comes from the payment link URL parameter
- When payment is confirmed, commissions are automatically attributed to:
  - Referring affiliate
  - Regional coordinator (if applicable)
  - National coordinator (if applicable)

### Commission Structure

```
Student Payment: 15,000 XAF
Platform Fee:    -  300 XAF
────────────────────────────
Commissionable:  14,700 XAF

Commissions (STANDARD tier):
- Affiliate:     10% = 1,470 XAF
- Regional:       3% =   441 XAF
- National:       2% =   294 XAF
```

### Validation

The system automatically validates:
- Referral code exists and belongs to active affiliate
- Affiliate is not suspended
- Referral code is not expired
- User has not already paid (prevents duplicate commissions)

---

## API Endpoints

### Public Endpoints

#### 1. Get Countries

```http
GET /api/affiliate/countries
```

**Response:**
```json
{
  "success": true,
  "data": {
    "countries": [
      {
        "id": "cm-001",
        "name": "Cameroon",
        "code": "CM",
        "currency": "XAF",
        "studentPrice": 15000,
        "platformFee": 300,
        "isActive": true
      }
    ]
  }
}
```

#### 2. Get Regions by Country

```http
GET /api/affiliate/countries/:countryId/regions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "regions": [
      {
        "id": "region-001",
        "name": "Centre",
        "code": "CE",
        "countryId": "cm-001",
        "isActive": true
      },
      {
        "id": "region-002",
        "name": "Littoral",
        "code": "LT",
        "countryId": "cm-001",
        "isActive": true
      }
    ]
  }
}
```

#### 3. Get Supported Payment Methods

```http
GET /api/payment/methods
```

**Response:**
```json
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "MTN",
        "name": "MTN Mobile Money",
        "logo": "...",
        "numberFormat": "237 6XX XXX XXX"
      },
      {
        "id": "ORANGE",
        "name": "Orange Money",
        "logo": "...",
        "numberFormat": "237 6XX XXX XXX"
      }
    ]
  }
}
```

#### 4. Detect Payment Method

```http
POST /api/payment/detect-method
Content-Type: application/json

{
  "phoneNumber": "237650495499"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "method": "MTN",
    "name": "MTN Mobile Money"
  }
}
```

### Protected Endpoints (Require Authentication)

#### 5. Initiate Payment

```http
POST /api/payment/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "237650495499",
  "amount": 15000,
  "countryId": "cm-001",
  "referralCode": "abc123xyz"
}
```

**Request Fields:**
- `phoneNumber` (required): Mobile Money number (237XXXXXXXXX)
- `amount` (required): Payment amount in XAF
- `countryId` (required): Country ID
- `referralCode` (optional): Referral code from payment link

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "payment-uuid",
    "paymentReference": "TIC-1234567890-abc12345",
    "status": "PENDING",
    "amount": 15000,
    "currency": "XAF",
    "phoneNumber": "237650495499",
    "externalTransactionId": "fapshi-txn-123",
    "message": "Please check your phone and enter your PIN to complete the payment"
  }
}
```

**Notes:**
- User receives mobile money prompt on their phone
- Payment status starts as `PENDING`
- Frontend should poll status or wait for webhook update

#### 6. Check Payment Status

```http
GET /api/payment/:paymentId/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "payment-uuid",
    "status": "CONFIRMED",
    "amount": 15000,
    "currency": "XAF",
    "paymentReference": "TIC-1234567890-abc12345",
    "externalTransactionId": "fapshi-txn-123",
    "paidAt": "2025-01-15T10:30:00Z",
    "commissions": {
      "affiliate": { "amount": 1470, "status": "PENDING" },
      "regional": { "amount": 441, "status": "PENDING" },
      "national": { "amount": 294, "status": "PENDING" }
    }
  }
}
```

**Status Values:**
- `PENDING`: Payment initiated, awaiting confirmation
- `CONFIRMED`: Payment successful
- `FAILED`: Payment failed or cancelled
- `REFUNDED`: Payment refunded

#### 7. Get Payment History

```http
GET /api/payment/history?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment-uuid",
        "paymentReference": "TIC-1234567890-abc12345",
        "amount": 15000,
        "status": "CONFIRMED",
        "createdAt": "2025-01-15T10:25:00Z",
        "paidAt": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Admin Endpoints

#### 8. Manually Verify Payment

```http
POST /api/payment/:paymentId/verify
Authorization: Bearer <admin-token>
```

Manually verify a payment that may have failed webhook delivery.

#### 9. Refund Payment

```http
POST /api/payment/:paymentId/refund
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reason": "Duplicate payment"
}
```

---

## Webhook Integration

### Webhook Endpoint

```http
POST /api/payment/webhook/fapshi
Content-Type: application/json
X-Fapshi-Signature: <signature>
```

### Webhook Payload

Fapshi sends webhook events when payment status changes:

```json
{
  "event": "payment.success",
  "transactionId": "fapshi-txn-123",
  "externalId": "TIC-1234567890-abc12345",
  "amount": 15000,
  "status": "SUCCESSFUL",
  "timestamp": "2025-01-15T10:30:00Z",
  "phoneNumber": "237650495499"
}
```

### Webhook Signature Verification

The backend automatically verifies webhook signatures using HMAC-SHA256:

```typescript
const signature = crypto
  .createHmac('sha256', FAPSHI_WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');

if (signature !== receivedSignature) {
  throw new Error('Invalid webhook signature');
}
```

**Important:** Never process webhooks without signature verification.

### Webhook Events

| Event | Description |
|-------|-------------|
| `payment.success` | Payment completed successfully |
| `payment.failed` | Payment failed or cancelled |
| `payment.pending` | Payment initiated, awaiting confirmation |

### Webhook Processing

When webhook is received:

1. **Verify Signature**: Ensure request is from Fapshi
2. **Find Payment**: Look up payment by `externalId` (our payment reference)
3. **Update Status**: Update payment status in database
4. **Process Commissions**: If payment successful and referral present, create commission records
5. **Send Email**: Notify user of payment status
6. **Return 200 OK**: Acknowledge receipt to Fapshi

---

## Testing

### Local Testing with ngrok

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   ```

2. **Start your server**:
   ```bash
   npm run dev
   ```

3. **Expose local server**:
   ```bash
   ngrok http 3000
   ```

4. **Update Fapshi webhook URL** to ngrok URL:
   ```
   https://abc123.ngrok.io/api/payment/webhook/fapshi
   ```

### Test Payment Flow

1. **Get available countries** (public):
   ```bash
   curl -X GET http://localhost:3000/api/affiliate/countries
   ```

2. **Get regions for a country** (public):
   ```bash
   curl -X GET http://localhost:3000/api/affiliate/countries/cm-001/regions
   ```

3. **Register test user**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

4. **Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!"
     }'
   ```

5. **Initiate payment**:
   ```bash
   curl -X POST http://localhost:3000/api/payment/initiate \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "phoneNumber": "237650495499",
       "amount": 15000,
       "countryId": "cm-001",
       "referralCode": "abc123xyz"
     }'
   ```

6. **Check payment status**:
   ```bash
   curl -X GET http://localhost:3000/api/payment/<paymentId>/status \
     -H "Authorization: Bearer <token>"
   ```

### Test Webhook (Manual)

Simulate Fapshi webhook:

```bash
curl -X POST http://localhost:3000/api/payment/webhook/fapshi \
  -H "Content-Type: application/json" \
  -H "X-Fapshi-Signature: <calculate-signature>" \
  -d '{
    "event": "payment.success",
    "transactionId": "test-txn-123",
    "externalId": "TIC-1234567890-abc12345",
    "amount": 15000,
    "status": "SUCCESSFUL",
    "timestamp": "2025-01-15T10:30:00Z",
    "phoneNumber": "237650495499"
  }'
```

---

## Troubleshooting

### Common Issues

#### 1. Payment Stuck in PENDING

**Problem**: Payment initiated but never confirmed.

**Solutions**:
- Check if webhook is configured correctly in Fapshi dashboard
- Verify webhook URL is publicly accessible (use ngrok for local testing)
- Check server logs for webhook delivery errors
- Manually verify payment using admin endpoint

#### 2. Webhook Signature Verification Failed

**Problem**: Webhook rejected due to invalid signature.

**Solutions**:
- Verify `FAPSHI_WEBHOOK_SECRET` is correct in `.env`
- Check if webhook payload is being modified by proxy/middleware
- Ensure raw body is used for signature verification (no JSON parsing before verification)

#### 3. Phone Number Format Error

**Problem**: "Invalid phone number format" error.

**Solutions**:
- Ensure number includes country code: `237XXXXXXXXX`
- Remove spaces, dashes, or parentheses
- Validate format: Must be exactly 12 digits starting with 237

#### 4. Minimum Amount Error

**Problem**: "Minimum payment amount is 100 XAF" error.

**Solutions**:
- Ensure amount is at least 100 XAF
- Check country pricing configuration
- Verify amount includes platform fee

#### 5. Duplicate Payment Error

**Problem**: "User already has an active payment" error.

**Solutions**:
- User can only have one confirmed payment
- Check payment history to see if user already paid
- If payment was refunded, status should be updated to allow new payment

### Debug Mode

Enable detailed logging:

```env
LOG_LEVEL=debug
```

View Fapshi API requests/responses in logs:

```bash
npm run dev | grep "Fapshi"
```

### Contact Support

- **Fapshi Support**: support@fapshi.com
- **API Documentation**: https://docs.fapshi.com
- **Status Page**: https://status.fapshi.com

---

## Best Practices

### Security

1. ✅ **Always verify webhook signatures**
2. ✅ **Never expose API keys in frontend code**
3. ✅ **Use HTTPS in production**
4. ✅ **Validate all inputs (phone numbers, amounts, etc.)**
5. ✅ **Log all payment transactions for audit**

### Performance

1. ✅ **Use idempotency keys to prevent duplicate payments**
2. ✅ **Implement retry logic for failed API calls**
3. ✅ **Cache payment methods/countries to reduce DB queries**
4. ✅ **Use background jobs for commission processing**

### User Experience

1. ✅ **Show clear payment instructions**
2. ✅ **Provide real-time status updates**
3. ✅ **Send email notifications for all payment events**
4. ✅ **Display estimated processing time (usually 30-60 seconds)**
5. ✅ **Offer customer support contact for payment issues**

---

## Quick Reference

### Fapshi API Limits

- **Minimum Amount**: 100 XAF
- **Maximum Amount**: 2,000,000 XAF per transaction
- **Timeout**: 30 seconds per API call
- **Rate Limit**: Contact Fapshi support for current limits

### Phone Number Formats

| Provider | Format | Example |
|----------|--------|---------|
| MTN | 237 6XX XXX XXX | 237 650 495 499 |
| Orange | 237 6XX XXX XXX | 237 690 123 456 |

### Payment Status Flow

```
PENDING → CONFIRMED → (commissioned)
PENDING → FAILED
CONFIRMED → REFUNDED
```

### Commission Calculation

```
Commissionable Amount = Payment Amount - Platform Fee
Affiliate Commission = Commissionable Amount × 10%
Regional Commission = Commissionable Amount × 3%
National Commission = Commissionable Amount × 2%
```

---

## Summary

The Fapshi integration provides:

✅ **Mobile Money payments** (MTN & Orange)  
✅ **Automatic webhook processing**  
✅ **Real-time status updates**  
✅ **Secure signature verification**  
✅ **Commission attribution on payment**  
✅ **Email notifications**  
✅ **Admin verification tools**

For additional help, refer to:
- [Fapshi Official Docs](https://docs.fapshi.com)
- [Complete API Reference](./COMPLETE_API_REFERENCE.md)
- [Affiliate System Guide](./FINAL_AFFILIATE_API.md)

---

**Last Updated**: January 2025  
**Version**: 2.0
