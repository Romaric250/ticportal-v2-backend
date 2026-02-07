# 🔄 IMPORTANT: Referral System Update

## Summary

**The referral system has been updated to apply referrals during PAYMENT, not registration.**

---

## What Changed?

### ❌ OLD SYSTEM (Incorrect)
- Referral codes were captured during **user registration**
- URL: `https://portal.ticsummit.org/register?ref=TIC-ABC-2026`
- Registration form included referral code
- Payment was separate

### ✅ NEW SYSTEM (Correct)
- Referral codes are captured during **payment**
- URL: `https://portal.ticsummit.org/pay?ref=TIC-ABC-2026`
- Registration is simple and separate (no referral codes)
- Payment link is where referral attribution happens

---

## Why This Change?

1. **Better User Flow**: Users can register freely first, then pay later with any affiliate link
2. **More Flexible**: Affiliates can share payment links to registered users
3. **Clearer Separation**: Registration = Account creation, Payment = Money transaction + Referral
4. **Easier Tracking**: Payment is where money changes hands, so referral should be tied to payment

---

## Backend Changes

### ✅ `src/modules/payment/service.ts`
- Updated `initiatePayment()` to accept and process `referralCode` parameter
- Referral code is passed from payment link URL to payment API
- Referral records and commissions are created after successful payment

### ✅ Registration (No changes needed)
- Registration remains simple with no referral code handling
- `POST /api/auth/register` does NOT include referralCode

---

## Frontend Changes Required

### 1. Registration Page (`/register`)
- **Simple form**: Name, Email, Password, Phone Number
- **❌ NO referral code field**
- **❌ NO URL parameter extraction** for referrals
- **No changes** if you already have a simple registration form

### 2. Payment Page (`/pay`)
- **Extract referral code from URL**: `?ref=TIC-ABC-2026`
- **Validate referral code** (optional): Show affiliate info banner
- **Pass referral code to payment API**: Include in payment initiation payload

**Example**:
```typescript
// On payment page load
const referralCode = new URLSearchParams(window.location.search).get('ref');

// When initiating payment
await fetch('/api/payment/initiate', {
  method: 'POST',
  body: JSON.stringify({
    phoneNumber: '237650495499',
    amount: 5300,
    countryId: 'xxx',
    referralCode: referralCode || undefined  // From URL
  })
});
```

### 3. Affiliate Dashboard
- **Update referral link**: Change from `/register?ref=` to `/pay?ref=`
- **Update copy text**: "Share this payment link..." instead of "Share this registration link..."

**Example**:
```typescript
const paymentReferralLink = `https://portal.ticsummit.org/pay?ref=${referralCode}`;
```

---

## Updated Flow

```
┌──────────────────────────────────────────────────────┐
│  STEP 1: USER REGISTERS (No Referral)               │
└──────────────────────────────────────────────────────┘
User visits: https://portal.ticsummit.org/register
  → Fill form (Name, Email, Password, Phone)
  → Submit → Account created
  → ❌ NO referral code involved


┌──────────────────────────────────────────────────────┐
│  STEP 2: AFFILIATE SHARES PAYMENT LINK              │
└──────────────────────────────────────────────────────┘
Affiliate shares: https://portal.ticsummit.org/pay?ref=TIC-ABC-2026
  → Via WhatsApp, email, social media, SMS, etc.


┌──────────────────────────────────────────────────────┐
│  STEP 3: USER CLICKS PAYMENT LINK                   │
└──────────────────────────────────────────────────────┘
Browser opens: https://portal.ticsummit.org/pay?ref=TIC-ABC-2026
  → Frontend extracts: ref = "TIC-ABC-2026"
  → [Optional] Validate & show banner: "Payment via John Doe"


┌──────────────────────────────────────────────────────┐
│  STEP 4: USER COMPLETES PAYMENT                     │
└──────────────────────────────────────────────────────┘
User fills payment form:
  → Select country
  → Enter phone number
  → Click "Pay Now"

Frontend sends to API:
POST /api/payment/initiate
{
  "phoneNumber": "237650495499",
  "amount": 5300,
  "countryId": "xxx",
  "referralCode": "TIC-ABC-2026"  ← From payment URL!
}


┌──────────────────────────────────────────────────────┐
│  STEP 5: BACKEND PROCESSES PAYMENT & REFERRAL       │
└──────────────────────────────────────────────────────┘
  → Payment initiated with Fapshi
  → User approves on phone
  → Payment confirmed
  → ✅ Referral record created
  → ✅ Commissions created (Affiliate 9%, Regional 6%, National 5%)
  → ✅ Email notifications sent
  → ✅ User activated
```

---

## Migration Checklist

### Backend ✅ (Already Done)
- [x] Updated `PaymentService.initiatePayment()` to accept `referralCode`
- [x] Referral logic moved to payment processing
- [x] Registration remains simple (no referral handling)

### Frontend (To Do)
- [ ] Remove referral code extraction from registration page
- [ ] Add referral code extraction to payment page
- [ ] Update affiliate dashboard to show payment links (`/pay?ref=`)
- [ ] Update copy/share buttons to use payment links
- [ ] Update payment initiation to include `referralCode` from URL
- [ ] Add referral banner on payment page (optional)

### Documentation ✅ (Already Done)
- [x] Updated `FRONTEND_INTEGRATION_GUIDE.md`
- [x] Updated `REFERRAL_SYSTEM_QUICK_REFERENCE.md`
- [x] Created `REFERRAL_SYSTEM_UPDATE.md` (this file)

---

## Testing

### Test Scenarios

1. **Registration without referral**
   - Visit `/register`
   - Complete registration
   - ✅ No referral code involved

2. **Direct payment (no referral)**
   - Visit `/pay` (no `?ref` parameter)
   - Complete payment
   - ✅ Payment successful, no commissions created

3. **Payment with referral**
   - Visit `/pay?ref=TIC-ABC-2026`
   - Complete payment
   - ✅ Payment successful, commissions created for affiliate hierarchy

4. **Invalid referral code**
   - Visit `/pay?ref=INVALID-CODE`
   - Complete payment
   - ✅ Payment successful, no commissions created (code invalid)

---

## API Endpoints

### Registration (No change)
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "237650495499"
}
```

### Payment (Now includes referralCode)
```http
POST /api/payment/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "237650495499",
  "amount": 5300,
  "countryId": "xxx-xxx-xxx",
  "referralCode": "TIC-ABC-2026"  // ← NEW: From payment URL
}
```

### Validate Referral (For payment page)
```http
GET /api/affiliate/validate/TIC-ABC-2026

Response:
{
  "success": true,
  "data": {
    "valid": true,
    "affiliateName": "John Doe",
    "regionName": "Littoral",
    "countryName": "Cameroon"
  }
}
```

---

## Support

For questions or issues:
- Review updated documentation in `/docs`
- Check Quick Reference: `REFERRAL_SYSTEM_QUICK_REFERENCE.md`
- Full Guide: `FRONTEND_INTEGRATION_GUIDE.md`
- Contact backend team for API clarifications

---

**Updated**: February 7, 2026  
**Status**: ✅ Backend complete, Frontend pending implementation
