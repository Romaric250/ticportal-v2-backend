# Fapshi Payment Integration Guide

## Overview

This guide explains how to integrate and use the Fapshi payment gateway for processing MTN Mobile Money and Orange Money payments in Cameroon.

## Setup

### 1. Get Fapshi Credentials

1. Visit [https://fapshi.com](https://fapshi.com)
2. Create an account or log in
3. Navigate to API Settings
4. Copy your **API Key** and **API User**

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Fapshi Payment Gateway
FAPSHI_API_KEY=your_actual_api_key
FAPSHI_API_USER=your_actual_api_user
FAPSHI_BASE_URL=https://api.fapshi.com
FAPSHI_WEBHOOK_SECRET=generate_random_string_here
```

**Generate Webhook Secret:**
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows (PowerShell)
-join ((48..57) + (97..102) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Configure Webhook in Fapshi Dashboard

1. Log in to your Fapshi dashboard
2. Go to Webhooks / Notifications
3. Add webhook URL: `https://yourdomain.com/api/payment/webhook/fapshi`
4. Select events: `payment.successful`, `payment.failed`
5. Save configuration

## API Endpoints

### 1. Initiate Payment

**Endpoint:** `POST /api/payment/initiate`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "phoneNumber": "237650495499",
  "amount": 5000,
  "countryId": "country_id_here",
  "referralCode": "TIC-CODE-2026" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "payment_id",
    "paymentReference": "TIC-1738704600000-abc123",
    "fapshiTransId": "fapshi_trans_id",
    "amount": 5000,
    "phoneNumber": "237650495499",
    "status": "PENDING",
    "message": "Payment initiated. Please check your phone to approve."
  }
}
```

### 2. Check Payment Status

**Endpoint:** `GET /api/payment/:paymentId/status`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "payment_id",
    "paymentReference": "TIC-1738704600000-abc123",
    "amount": 5000,
    "status": "CONFIRMED",
    "createdAt": "2026-02-05T10:00:00.000Z",
    "verifiedAt": "2026-02-05T10:05:00.000Z",
    "referral": {
      "id": "referral_id",
      "status": "PAID"
    }
  }
}
```

### 3. Get Payment History

**Endpoint:** `GET /api/payment/history?page=1&limit=20&status=CONFIRMED`

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (PENDING, CONFIRMED, FAILED)

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

### 4. Get Payment Methods

**Endpoint:** `GET /api/payment/methods`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "MTN",
      "name": "MTN Mobile Money",
      "description": "Pay with MTN Mobile Money",
      "logo": "mtn-logo.png",
      "phonePrefix": "237650,237651,237652,237653,237654"
    },
    {
      "code": "ORANGE",
      "name": "Orange Money",
      "description": "Pay with Orange Money",
      "logo": "orange-logo.png",
      "phonePrefix": "237655,237656,237657,237658,237659"
    }
  ]
}
```

### 5. Detect Payment Method

**Endpoint:** `POST /api/payment/detect-method`

**Authentication:** Not required

**Request Body:**
```json
{
  "phoneNumber": "237650495499"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "method": "MTN"
  }
}
```

### 6. Webhook Handler

**Endpoint:** `POST /api/payment/webhook/fapshi`

**Authentication:** Signature verification

**Headers:**
- `x-fapshi-signature`: HMAC SHA256 signature

**Request Body:**
```json
{
  "transId": "fapshi_trans_id",
  "externalId": "TIC-1738704600000-abc123",
  "status": "SUCCESSFUL",
  "amount": 5000,
  "phone": "237650495499",
  "message": "Payment successful",
  "date": "2026-02-05T10:05:00.000Z"
}
```

## Payment Flow

### Student Registration Payment Flow

```
1. Student Registration
   ↓
2. Student enters phone number and referral code (optional)
   ↓
3. Frontend calls POST /api/payment/initiate
   ↓
4. Backend creates Payment record
   ↓
5. Backend creates StudentReferral record (if referral code valid)
   ↓
6. Backend calls Fapshi API to initiate payment
   ↓
7. Fapshi sends USSD push to student's phone
   ↓
8. Student approves payment on phone
   ↓
9. Fapshi sends webhook to backend
   ↓
10. Backend confirms payment
   ↓
11. Backend calculates and creates commissions (PENDING status)
   ↓
12. Backend updates StudentReferral status to PAID
   ↓
13. Student can now access platform
```

### Commission Activation Flow

```
1. Student completes first action on platform (login, complete profile, etc.)
   ↓
2. Backend calls PaymentCommissionService.activateReferral()
   ↓
3. StudentReferral status → ACTIVATED
   ↓
4. All related commissions status → EARNED
   ↓
5. After 30-day cooling period, admin can approve commissions
   ↓
6. Commission status → APPROVED
   ↓
7. Admin creates payout batch
   ↓
8. Commission status → LOCKED (in batch)
   ↓
9. Admin processes payout
   ↓
10. Commission status → PAID
```

## Phone Number Formats

### MTN Mobile Money
- **Prefixes:** 650, 651, 652, 653, 654, 67, 68
- **Format:** 237XXXXXXXXX
- **Example:** 237650495499

### Orange Money
- **Prefixes:** 655, 656, 657, 658, 659, 69
- **Format:** 237XXXXXXXXX
- **Example:** 237655123456

## Error Handling

### Common Errors

```typescript
// Minimum amount error
{
  "error": "Minimum payment amount is 100 XAF"
}

// Invalid phone format
{
  "error": "Invalid phone number format. Must be 237XXXXXXXXX"
}

// Payment not found
{
  "error": "Payment not found"
}

// Already confirmed
{
  "error": "Payment already confirmed"
}

// Invalid signature (webhook)
{
  "error": "Invalid signature"
}
```

## Testing

### Test Phone Numbers (Sandbox)

Fapshi provides test phone numbers for sandbox testing:

```typescript
// MTN Test Numbers
const mtnTest = "237650000001";  // Will succeed
const mtnTestFail = "237650000002";  // Will fail

// Orange Test Numbers
const orangeTest = "237655000001";  // Will succeed
const orangeTestFail = "237655000002";  // Will fail
```

### Testing Webhooks Locally

Use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm run dev

# In another terminal, expose port 5000
ngrok http 5000

# Use the ngrok URL in Fapshi webhook settings
# Example: https://abc123.ngrok.io/api/payment/webhook/fapshi
```

## Security

### Webhook Signature Verification

All webhooks are verified using HMAC SHA256:

```typescript
const signature = crypto
  .createHmac('sha256', FAPSHI_WEBHOOK_SECRET)
  .update(rawPayload)
  .digest('hex');

// Compare signatures using timing-safe comparison
crypto.timingSafeEqual(
  Buffer.from(receivedSignature),
  Buffer.from(expectedSignature)
);
```

### Best Practices

1. **Never expose API credentials** in frontend code
2. **Always verify webhook signatures** before processing
3. **Use HTTPS** in production for webhook endpoints
4. **Implement rate limiting** on payment endpoints
5. **Log all payment activities** for audit trail
6. **Handle idempotency** - same payment reference should not be processed twice

## Troubleshooting

### Payment Stuck in PENDING

1. Check Fapshi transaction status:
   ```bash
   GET https://api.fapshi.com/payment-status/{transId}
   ```

2. Manually verify payment if confirmed on Fapshi:
   ```bash
   POST /api/payment/{paymentId}/verify
   ```

### Webhook Not Received

1. Check webhook URL is publicly accessible
2. Verify webhook secret matches in Fapshi dashboard
3. Check server logs for webhook errors
4. Test webhook manually:
   ```bash
   curl -X POST http://localhost:5000/api/payment/webhook/fapshi \
     -H "Content-Type: application/json" \
     -H "x-fapshi-signature: your_signature" \
     -d '{"transId":"test","externalId":"TIC-123","status":"SUCCESSFUL","amount":5000,"phone":"237650495499"}'
   ```

### Commission Not Calculated

1. Check payment status is CONFIRMED
2. Verify StudentReferral was created
3. Check PaymentCommissionService logs
4. Ensure Country has commission rates configured

## Support

- **Fapshi Support:** support@fapshi.com
- **Documentation:** https://docs.fapshi.com
- **Status Page:** https://status.fapshi.com

## Changelog

### v1.0.0 (2026-02-05)
- Initial Fapshi integration
- Support for MTN and Orange Money
- Webhook handling
- Commission calculation on payment confirmation
- Phone number validation and detection
