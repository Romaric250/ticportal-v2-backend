# 🚨 Quick Fix: Payment 401 Error

## The Problem
```bash
POST /api/payment/initiate → 401 Unauthorized
```

## The Solution
**You MUST include the Authorization header!**

### ✅ Correct Request
```bash
curl -X POST https://api.ticsummit.com/api/payment/initiate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"237650495499","amount":15000,"countryId":"cm-001"}'
```

### ❌ Wrong (Missing Auth Header)
```bash
curl -X POST https://api.ticsummit.com/api/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"237650495499","amount":15000,"countryId":"cm-001"}'
```

---

## Frontend Quick Fix

### JavaScript/TypeScript
```typescript
// 1. Get token (after login)
const token = localStorage.getItem('accessToken');

// 2. Check token exists
if (!token) {
  window.location.href = '/login';
  return;
}

// 3. Include in ALL payment requests
fetch('/api/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // 🔑 REQUIRED!
  },
  body: JSON.stringify({
    phoneNumber: '237650495499',
    amount: 15000,
    countryId: 'cm-001'
  })
});
```

### React Hook
```typescript
const useAuth = () => {
  const token = localStorage.getItem('accessToken');
  
  const makeAuthRequest = async (url: string, options: RequestInit) => {
    if (!token) {
      window.location.href = '/login';
      throw new Error('Not authenticated');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  };

  return { makeAuthRequest, token };
};

// Usage
const { makeAuthRequest } = useAuth();
await makeAuthRequest('/api/payment/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(paymentData)
});
```

---

## Checklist Before Making Payment Request

- [ ] User logged in? → `POST /api/auth/login`
- [ ] Token stored? → `localStorage.getItem('accessToken')`
- [ ] Token included? → `Authorization: Bearer <token>`
- [ ] Correct format? → Capital 'B' in 'Bearer'
- [ ] Token not expired? → Check at [jwt.io](https://jwt.io)

---

## Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| No Authorization header | `Authorization: Bearer <token>` |
| `Authorization: token123` | `Authorization: Bearer token123` |
| `Authorization: bearer token` | `Authorization: Bearer token` (capital B) |
| `Bearer token123` (no "Authorization:") | `Authorization: Bearer token123` |

---

## Debug Steps

1. **Check server logs** (if 401 error):
   ```bash
   # Look for:
   [WARN] Authentication failed: Missing or invalid Authorization header
   ```

2. **Verify token exists**:
   ```javascript
   console.log('Token:', localStorage.getItem('accessToken'));
   ```

3. **Check token expiry** at [jwt.io](https://jwt.io):
   - Copy your token
   - Paste at jwt.io
   - Check `exp` field (expiry timestamp)

4. **Re-login if needed**:
   ```typescript
   // Clear old token
   localStorage.removeItem('accessToken');
   
   // Login again
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   
   const { data } = await response.json();
   localStorage.setItem('accessToken', data.accessToken);
   ```

---

## Full Working Example

```typescript
// Complete flow from login to payment

// Step 1: Login
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  
  if (result.success) {
    localStorage.setItem('accessToken', result.data.accessToken);
    return result.data.accessToken;
  }
  
  throw new Error('Login failed');
};

// Step 2: Make payment
const initiatePayment = async (paymentData: any) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    throw new Error('Please login first');
  }
  
  const response = await fetch('/api/payment/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 🔑 CRITICAL!
    },
    body: JSON.stringify(paymentData)
  });
  
  if (response.status === 401) {
    // Token expired, need to login again
    localStorage.removeItem('accessToken');
    throw new Error('Session expired, please login again');
  }
  
  return response.json();
};

// Usage
try {
  // Login first (if not already logged in)
  await login('user@example.com', 'password123');
  
  // Then initiate payment
  const result = await initiatePayment({
    phoneNumber: '237650495499',
    amount: 15000,
    countryId: 'cm-001',
    referralCode: 'abc123xyz'
  });
  
  console.log('Payment initiated:', result);
} catch (error) {
  console.error('Error:', error);
}
```

---

## Need More Help?

- 📖 [Full Troubleshooting Guide](./PAYMENT_AUTH_TROUBLESHOOTING.md)
- 📖 [Payment Integration Guide](./PAYMENT_FAPSHI_INTEGRATION.md)
- 📖 [Complete API Reference](./COMPLETE_API_REFERENCE.md)

---

**TL;DR:** Always include `Authorization: Bearer <token>` header in payment requests!
