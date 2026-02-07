# Referral System Quick Reference

> **⚡ TL;DR**: Use payment links only. Referrals are applied during **PAYMENT**, not registration!

---

## 🔗 How It Works

### For Affiliates:
1. Get payment referral link from dashboard: `https://portal.ticsummit.org/pay?ref=TIC-ABC-2026`
2. Share link (WhatsApp, social media, email, etc.)
3. Earn 9% commission when referred users **pay** (not register)

### For Users:
1. Register normally (no referral code needed)
2. Click affiliate's **payment link**
3. Complete payment (code extracted automatically from URL)
4. Done! Affiliate gets credited automatically

---

## ✅ DO

```typescript
// PAYMENT PAGE: Extract referral code from URL
const referralCode = new URLSearchParams(window.location.search).get('ref');

// Include in payment payload
const payload = {
  phoneNumber: "237650495499",
  amount: 5300,
  countryId: "xxx-xxx-xxx",
  referralCode: referralCode || undefined  // undefined if no referral
};

// Send to payment API
await fetch('/api/payment/initiate', {
  method: 'POST',
  body: JSON.stringify(payload)
});
```

## ❌ DON'T

```typescript
// ❌ DON'T add referral code to registration
const registrationPayload = {
  firstName: "Jane",
  email: "jane@example.com",
  referralCode: "TIC-ABC-2026" // ❌ NO! Registration is separate!
};

// ❌ DON'T add a manual referral code input field (anywhere!)
<input 
  type="text" 
  placeholder="Enter referral code (optional)" 
  name="referralCode" 
/>

// ❌ DON'T ask users to type codes
"Have a referral code? Enter it here:"
```

---

## 🎯 Key Endpoints

### Validate Referral Code (Optional - for payment page)
```typescript
GET /api/affiliate/validate/:code

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

### Register (No Referral Code!)
```typescript
POST /api/auth/register

Body:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "237650495499"
  // ❌ NO referralCode here!
}
```

### Initiate Payment (WITH Referral Code!)
```typescript
POST /api/payment/initiate
Headers: { Authorization: Bearer <token> }

Body:
{
  "phoneNumber": "237650495499",
  "amount": 5300,
  "countryId": "xxx-xxx-xxx",
  "referralCode": "TIC-ABC-2026"  // ← From payment URL (?ref parameter)
}
```

---

## 🎨 UI Components

### Payment Referral Banner (Show if code is valid)
```tsx
<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
  <p className="text-green-900 font-medium">
    🎉 Payment via referral from {affiliateName}
  </p>
  <p className="text-green-700 text-sm">
    {regionName}, {countryName}
  </p>
</div>
```

### Copy Payment Link Button
```tsx
<button onClick={async () => {
  const paymentLink = `https://portal.ticsummit.org/pay?ref=${referralCode}`;
  await navigator.clipboard.writeText(paymentLink);
  setCopied(true);
}}>
  {copied ? '✓ Copied!' : '📋 Copy Payment Link'}
</button>
```

---

## 🚨 Common Mistakes

| ❌ Mistake | ✅ Solution |
|-----------|-----------|
| Adding referral code to registration | Referrals only during payment! |
| Using `/register?ref=` URLs | Use `/pay?ref=` URLs |
| Passing `referralCode` in registration API | Registration has no referral code |
| Forgetting `referralCode` in payment API | Extract from payment URL and pass to API |
| Blocking payment if code is invalid | Allow payment, just no commission |

---

## 📱 Share Methods

```typescript
// Payment referral link
const paymentLink = `https://portal.ticsummit.org/pay?ref=${referralCode}`;

// Copy to clipboard
await navigator.clipboard.writeText(paymentLink);

// WhatsApp
const message = encodeURIComponent(`Complete your TiC Summit payment: ${paymentLink}`);
window.open(`https://wa.me/?text=${message}`, '_blank');

// Email
window.location.href = `mailto:?subject=Complete TiC Summit Payment&body=${paymentLink}`;

// QR Code
import QRCode from 'qrcode';
const qrCode = await QRCode.toDataURL(paymentLink);
```

---

## 🧪 Testing Checklist

- [ ] Test registration (no referral code involved)
- [ ] Test direct payment: `/pay` (no `?ref`)
- [ ] Test payment with referral: `/pay?ref=TIC-TEST-2026`
- [ ] Verify banner shows for valid codes on payment page
- [ ] Verify commission created after payment (with referral)
- [ ] Verify no commission created (without referral)
- [ ] Test copy payment link functionality
- [ ] Test share buttons (WhatsApp, email, etc.)

---

## 💡 Flow Summary

```
1. USER REGISTERS
   POST /api/auth/register
   Body: { ...userData }  // NO referralCode!
   
2. AFFILIATE SHARES PAYMENT LINK
   https://portal.ticsummit.org/pay?ref=TIC-ABC-2026
   
3. USER CLICKS PAYMENT LINK
   Browser opens: /pay?ref=TIC-ABC-2026
   Frontend extracts: ref = "TIC-ABC-2026"
   
4. [OPTIONAL] VALIDATE & SHOW BANNER
   GET /api/affiliate/validate/TIC-ABC-2026
   → Show "Payment via John Doe"
   
5. USER PAYS
   POST /api/payment/initiate
   Body: { phoneNumber, amount, countryId, referralCode: "TIC-ABC-2026" }
   ✅ referralCode included here!
   
6. PAYMENT CONFIRMED
   → Backend creates commissions automatically
   → Affiliate gets 9%, Regional 6%, National 5%
```

---

## 📞 Need Help?

- **Full Guide**: See `FRONTEND_INTEGRATION_GUIDE.md`
- **API Docs**: See `API_ENDPOINTS_REFERENCE.md`
- **Email Setup**: See `EMAIL_NOTIFICATIONS.md`
- **Payment Integration**: See `FAPSHI_INTEGRATION.md`

---

**Remember: Payment links only! Referrals happen during PAYMENT, not registration! 🔗💰**
