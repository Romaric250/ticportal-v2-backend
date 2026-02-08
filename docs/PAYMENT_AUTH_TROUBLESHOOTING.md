# Payment API Authentication Troubleshooting

## Common 401 Unauthorized Error

### Issue
```json
{
  "error": "Unauthorized"
}
```

**Status Code:** 401  
**Endpoint:** `POST /api/payment/initiate`

---

## Root Causes & Solutions

### 1. Missing Authorization Header

**Problem:** Request sent without `Authorization` header

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized - Missing or invalid Authorization header",
    "hint": "Include 'Authorization: Bearer <token>' in request headers"
  }
}
```

**Solution:**

✅ **Include Authorization header in all protected requests:**

```bash
curl -X POST https://api.ticsummit.com/api/payment/initiate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "237650495499",
    "amount": 15000,
    "countryId": "cm-001",
    "referralCode": "abc123xyz"
  }'
```

**Frontend (JavaScript/TypeScript):**

```typescript
const token = localStorage.getItem('accessToken'); // or from your auth store

const response = await fetch('https://api.ticsummit.com/api/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ⚠️ Don't forget this!
  },
  body: JSON.stringify({
    phoneNumber: '237650495499',
    amount: 15000,
    countryId: 'cm-001',
    referralCode: 'abc123xyz'
  })
});
```

---

### 2. Invalid or Expired Token

**Problem:** Token is invalid, malformed, or expired

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token",
    "hint": "Please login again to get a new token"
  }
}
```

**Common Causes:**
- Token expired (check token expiry time)
- Token was manually modified
- Using token from wrong environment (dev vs prod)
- Token was revoked/blacklisted

**Solution:**

✅ **Re-authenticate to get a fresh token:**

```typescript
// 1. Login to get new token
const loginResponse = await fetch('https://api.ticsummit.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const { accessToken, refreshToken } = data;

// 2. Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// 3. Use new token for payment
const paymentResponse = await fetch('https://api.ticsummit.com/api/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({ /* payment data */ })
});
```

---

### 3. Wrong Header Format

**Problem:** Authorization header format is incorrect

**Wrong Formats:**
```
❌ Authorization: YOUR_TOKEN
❌ Authorization: bearer YOUR_TOKEN  (lowercase 'bearer')
❌ Authorization: Token YOUR_TOKEN
❌ Bearer YOUR_TOKEN  (missing 'Authorization:')
```

**Correct Format:**
```
✅ Authorization: Bearer YOUR_TOKEN  (capital 'B' in Bearer)
```

**Example:**
```bash
# ❌ Wrong
curl -H "Authorization: token123abc"

# ❌ Wrong  
curl -H "Bearer token123abc"

# ✅ Correct
curl -H "Authorization: Bearer token123abc"
```

---

### 4. Token Not Stored/Retrieved Properly

**Problem:** Token was not saved after login or is being retrieved incorrectly

**Solution:**

✅ **Proper token management:**

```typescript
// After successful login
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    
    if (result.success) {
      // Store tokens
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      
      // Store user info if needed
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      console.log('✅ Login successful, tokens stored');
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
  }
};

// Before making payment request
const initiatePayment = async (paymentData) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.error('❌ No token found, user needs to login');
    // Redirect to login page
    window.location.href = '/login';
    return;
  }

  const response = await fetch('/api/payment/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(paymentData)
  });

  return response.json();
};
```

---

### 5. CORS Issues (Frontend)

**Problem:** Browser blocks request before Authorization header is sent

**Symptoms:**
- Request works in Postman/cURL but fails in browser
- Network tab shows request but no Authorization header
- CORS error in console

**Solution:**

Backend should have CORS properly configured (already done in `src/app.ts`):

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

Frontend should match:

```typescript
// If using credentials
fetch('/api/payment/initiate', {
  method: 'POST',
  credentials: 'include', // Important for cookies
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

---

## Testing Authentication

### Test Your Token

1. **Get a valid token:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "Test123!"
     }'
   ```

   **Response:**
   ```json
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "refreshToken": "...",
       "user": { "id": "...", "email": "test@example.com" }
     }
   }
   ```

2. **Copy the accessToken**

3. **Test payment endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/payment/initiate \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{
       "phoneNumber": "237650495499",
       "amount": 15000,
       "countryId": "cm-001"
     }'
   ```

4. **Check response:**
   - ✅ Success: `{ "success": true, "data": { ... } }`
   - ❌ 401: Token issue (see solutions above)
   - ❌ 400: Missing required fields
   - ❌ 500: Server error

---

## Debugging Tips

### Enable Detailed Logging

Set in `.env`:
```env
LOG_LEVEL=debug
```

Restart server and check logs for authentication details:

```bash
npm run dev
```

Look for log entries:
```
[DEBUG] User authenticated successfully { userId: '...', userRole: 'STUDENT', url: '/api/payment/initiate' }
[WARN] Authentication failed: Missing or invalid Authorization header
[WARN] Authentication failed: Invalid or expired token
```

### Check Token Expiry

Decode your JWT token at [jwt.io](https://jwt.io) to check:
- `exp` (expiry timestamp)
- `iat` (issued at)
- `id` (user ID)
- `role` (user role)

**Example token payload:**
```json
{
  "id": "user-123",
  "email": "test@example.com",
  "role": "STUDENT",
  "iat": 1707321600,
  "exp": 1707408000
}
```

Check if current time is before `exp`:
```javascript
const currentTime = Math.floor(Date.now() / 1000);
const isExpired = currentTime > tokenPayload.exp;
console.log('Token expired?', isExpired);
```

### Test with Postman

1. **Login Request:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "Test123!"
     }
     ```

2. **Copy accessToken from response**

3. **Payment Request:**
   - Method: POST
   - URL: `http://localhost:3000/api/payment/initiate`
   - Headers:
     - `Content-Type: application/json`
     - `Authorization: Bearer YOUR_TOKEN_HERE` ⚠️
   - Body (JSON):
     ```json
     {
       "phoneNumber": "237650495499",
       "amount": 15000,
       "countryId": "cm-001",
       "referralCode": "abc123xyz"
     }
     ```

---

## Quick Checklist

Before making a payment request, verify:

- [ ] User is logged in
- [ ] Access token is stored (localStorage/sessionStorage)
- [ ] Token is not expired
- [ ] Authorization header is included: `Authorization: Bearer <token>`
- [ ] Header format is correct (capital 'B' in Bearer)
- [ ] Content-Type header is set: `Content-Type: application/json`
- [ ] Request body includes: `phoneNumber`, `amount`, `countryId`
- [ ] Backend server is running
- [ ] Correct API endpoint: `POST /api/payment/initiate` (not just `/initiate`)

---

## Common Frontend Mistakes

### ❌ Mistake 1: Forgetting to add Authorization header
```typescript
fetch('/api/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // ❌ Missing Authorization header!
  },
  body: JSON.stringify(data)
});
```

### ✅ Correct:
```typescript
const token = localStorage.getItem('accessToken');

fetch('/api/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ✅ Added!
  },
  body: JSON.stringify(data)
});
```

### ❌ Mistake 2: Not checking if token exists
```typescript
const token = localStorage.getItem('accessToken'); // might be null!

fetch('/api/payment/initiate', {
  headers: {
    'Authorization': `Bearer ${token}` // ❌ "Bearer null" if no token
  }
});
```

### ✅ Correct:
```typescript
const token = localStorage.getItem('accessToken');

if (!token) {
  // Redirect to login
  window.location.href = '/login';
  return;
}

fetch('/api/payment/initiate', {
  headers: {
    'Authorization': `Bearer ${token}` // ✅ Safe
  }
});
```

### ❌ Mistake 3: Using old/cached token after logout
```typescript
// User logs out but token still in localStorage
localStorage.clear(); // or removeItem('accessToken')

// Later, old code tries to use cached token
const token = localStorage.getItem('accessToken'); // null now
```

### ✅ Correct:
```typescript
// Proper logout
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Always check before making requests
const makeAuthenticatedRequest = async (url, options) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.error('No token, redirecting to login');
    window.location.href = '/login';
    return;
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```

---

## Summary

The 401 error happens when:
1. **No Authorization header** → Add `Authorization: Bearer <token>`
2. **Invalid/expired token** → Login again to get new token
3. **Wrong header format** → Use `Bearer` (capital B)
4. **Token not stored properly** → Check localStorage after login

**Quick Fix:**
```typescript
// 1. Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { data } = await loginRes.json();
localStorage.setItem('accessToken', data.accessToken);

// 2. Use token for payment
const token = localStorage.getItem('accessToken');
const paymentRes = await fetch('/api/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ⚠️ Required!
  },
  body: JSON.stringify({ phoneNumber, amount, countryId })
});
```

---

**For more help:**
- [Payment & Fapshi Integration Guide](./PAYMENT_FAPSHI_INTEGRATION.md)
- [Complete API Reference](./COMPLETE_API_REFERENCE.md)
- Check server logs with `LOG_LEVEL=debug`

---

**Last Updated:** February 7, 2026
