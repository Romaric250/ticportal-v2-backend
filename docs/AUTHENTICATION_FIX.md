# Authentication Fix Summary

## Date: February 7, 2026

---

## Issue
**Error:** 401 Unauthorized on `POST /api/payment/initiate`

```json
{
  "error": "Unauthorized"
}
```

---

## Root Cause

The 401 error occurs when the `authenticate` middleware doesn't find a valid JWT token in the request. This happens when:

1. **No Authorization header** is sent with the request
2. **Invalid or expired token** is provided
3. **Wrong header format** (not `Bearer <token>`)

---

## Fixes Applied

### 1. Enhanced Authentication Middleware (`src/shared/middleware/auth.ts`)

**Before:**
```typescript
// Generic error, no details
return res.status(401).json({ 
  success: false, 
  error: { message: "Unauthorized" } 
});
```

**After:**
```typescript
// Detailed error with helpful hints
return res.status(401).json({ 
  success: false, 
  error: { 
    message: "Unauthorized - Missing or invalid Authorization header",
    hint: "Include 'Authorization: Bearer <token>' in request headers"
  } 
});
```

### 2. Added Comprehensive Logging

**Authentication logs:**
- ✅ Successful authentication (debug level)
- ⚠️ Missing/invalid Authorization header (warn level)
- ⚠️ Invalid/expired token (warn level)

**Authorization logs:**
- ✅ User authorization check (debug level)
- ⚠️ Insufficient permissions (warn level)

**Example logs:**
```
[DEBUG] User authenticated successfully { userId: 'abc123', userRole: 'STUDENT', url: '/api/payment/initiate' }
[WARN] Authentication failed: Missing or invalid Authorization header { url: '/api/payment/initiate', hasAuthHeader: false }
[WARN] Authentication failed: Invalid or expired token { url: '/api/payment/initiate', error: 'jwt expired' }
```

### 3. Improved Payment Controller (`src/modules/payment/controller.ts`)

**Before:**
```typescript
console.log("Payment route")
console.log("Payment route")
console.log("Payment route")
```

**After:**
```typescript
logger.info({ 
  userId, 
  phoneNumber, 
  amount, 
  countryId, 
  hasReferral: !!referralCode 
}, 'Payment initiation request');

logger.info({ 
  paymentId: result.paymentId, 
  userId 
}, 'Payment initiated successfully');
```

### 4. Consistent Error Response Format

All authentication/authorization errors now follow the same format:

```typescript
{
  "success": false,
  "error": {
    "message": "Clear error message",
    "hint": "Helpful suggestion for resolution"
  }
}
```

---

## Testing the Fix

### 1. Test Without Token (Should Fail with Better Error)

```bash
curl -X POST http://localhost:3000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "237650495499",
    "amount": 15000,
    "countryId": "cm-001"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized - Missing or invalid Authorization header",
    "hint": "Include 'Authorization: Bearer <token>' in request headers"
  }
}
```

### 2. Test With Valid Token (Should Succeed)

```bash
# 1. Login first
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# 2. Copy the accessToken from response

# 3. Make payment request with token
curl -X POST http://localhost:3000/api/payment/initiate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "237650495499",
    "amount": 15000,
    "countryId": "cm-001"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "...",
    "paymentReference": "TIC-...",
    "status": "PENDING",
    "amount": 15000,
    "currency": "XAF",
    "message": "Please check your phone..."
  }
}
```

---

## How to Fix in Frontend

### React/TypeScript Example

```typescript
import { useState, useEffect } from 'react';

const PaymentPage = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage after login
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) {
      // No token, redirect to login
      window.location.href = '/login';
      return;
    }
    setToken(storedToken);
  }, []);

  const initiatePayment = async (paymentData: any) => {
    if (!token) {
      alert('Please login first');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ⚠️ Critical!
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (response.status === 401) {
        // Token expired or invalid
        alert('Session expired, please login again');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }

      if (result.success) {
        console.log('Payment initiated:', result.data);
        // Handle success
      } else {
        console.error('Payment failed:', result.error);
        // Handle error
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <button onClick={() => initiatePayment({
        phoneNumber: '237650495499',
        amount: 15000,
        countryId: 'cm-001'
      })}>
        Pay Now
      </button>
    </div>
  );
};
```

### Axios Example

```typescript
import axios from 'axios';

// Create axios instance with interceptor
const api = axios.create({
  baseURL: 'https://api.ticsummit.com/api'
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Use it
const initiatePayment = async (data: any) => {
  try {
    const response = await api.post('/payment/initiate', data);
    return response.data;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
};
```

---

## Prevention Checklist

To avoid 401 errors in the future:

- [ ] Always include `Authorization: Bearer <token>` header
- [ ] Check if token exists before making requests
- [ ] Handle token expiry gracefully (redirect to login)
- [ ] Store token securely after login
- [ ] Clear token on logout
- [ ] Use interceptors (Axios) or middleware (fetch) to add token automatically
- [ ] Test authentication flow end-to-end
- [ ] Monitor logs for authentication failures

---

## Files Modified

1. ✅ `src/shared/middleware/auth.ts` - Enhanced logging and error messages
2. ✅ `src/modules/payment/controller.ts` - Added detailed logging
3. ✅ `docs/PAYMENT_AUTH_TROUBLESHOOTING.md` - Comprehensive troubleshooting guide

---

## Next Steps

1. **Enable debug logging** in development:
   ```env
   LOG_LEVEL=debug
   ```

2. **Test the complete flow:**
   - Register user
   - Login (get token)
   - Initiate payment (with token)
   - Check logs for authentication details

3. **Update frontend:**
   - Ensure Authorization header is included
   - Add token expiry handling
   - Implement automatic token refresh if needed

4. **Monitor production:**
   - Watch for 401 errors in logs
   - Set up alerts for high 401 rates
   - Track token expiry patterns

---

## Related Documentation

- [Payment Auth Troubleshooting](./PAYMENT_AUTH_TROUBLESHOOTING.md) - Detailed troubleshooting guide
- [Payment & Fapshi Integration](./PAYMENT_FAPSHI_INTEGRATION.md) - Complete payment guide
- [Complete API Reference](./COMPLETE_API_REFERENCE.md) - All API endpoints

---

**Status:** ✅ Fixed  
**Impact:** Better error messages, detailed logging, easier debugging  
**Breaking Changes:** None (only enhancements)

---

**Last Updated:** February 7, 2026
