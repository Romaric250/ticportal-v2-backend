# Authentication API Documentation

Base URL: `http://localhost:5000/api/auth`

## Overview

OTP-based authentication system. All responses follow this format:

**Success:**
```json
{ "success": true, "data": {...} }
```

**Error:**
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

---

## Endpoints

### 1. Register
`POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** OTP sent to email (valid for 10 minutes)

---

### 2. Verify Email
`POST /api/auth/verify-otp`

```json
{
  "email": "user@example.com",
  "code": "123456",
  "type": "EMAIL_VERIFICATION"
}
```

**Response:** Returns user data + tokens (user is now logged in)

---

### 3. Login
`POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** Returns user data + tokens

---

### 4. Refresh Token
`POST /api/auth/refresh`

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** Returns new access token + refresh token

---

### 5. Logout
`POST /api/auth/logout`

**Headers:** `Authorization: Bearer <accessToken>`

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 6. Forgot Password
`POST /api/auth/forgot-password`

```json
{
  "email": "user@example.com"
}
```

**Response:** OTP sent to email (if exists)

---

### 7. Reset Password
`POST /api/auth/reset-password`

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

---

## Key Information

**Token Expiration:**
- Access Token: 15 minutes
- Refresh Token: 7 days
- OTP: 10 minutes

**Authentication Header:**
```
Authorization: Bearer <accessToken>
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input
- `UNAUTHORIZED` - Invalid/missing token
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Email already exists

---

## Quick Start Examples

**Registration + Verification:**
```javascript
// 1. Register
await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, firstName, lastName })
});

// 2. Verify with OTP from email
const res = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, code: otp, type: 'EMAIL_VERIFICATION' })
});
const { data } = await res.json();
// Store: data.accessToken, data.refreshToken
```

**Making Authenticated Requests:**
```javascript
fetch('/api/users/profile', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```
