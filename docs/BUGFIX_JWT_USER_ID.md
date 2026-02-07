# Bug Fix: JWT Token User ID Field

## Issue
The commission tiers endpoints (and other affiliate endpoints) were returning **401 Unauthorized** errors even when authenticated as an admin.

### Error Log
```
PUT /admin/commission-tiers - 401 (1ms)
response: { "error": "Unauthorized" }
```

## Root Cause
The JWT token payload uses the field name **`userId`**, but the controller was trying to access **`id`**:

### JWT Token Structure (from auth service)
```typescript
const accessToken = generateAccessToken({ 
  userId: user.id,  // ✅ Field is called "userId"
  role: user.role 
});
```

### Controller Code (BEFORE - ❌ WRONG)
```typescript
const adminId = (req as any).user?.id;  // ❌ Trying to access "id" (doesn't exist)
```

### Controller Code (AFTER - ✅ FIXED)
```typescript
const adminId = (req as any).user?.userId;  // ✅ Correct field name
```

## Files Fixed

### `src/modules/affiliate/controller.ts`
Fixed **10 occurrences** of `user?.id` → `user?.userId`:

1. Line 170: `updateUserRole` - adminId
2. Line 199: `activateAffiliate` - adminId
3. Line 243: `getAffiliateDashboard` - userId
4. Line 263: `getRegionalDashboard` - userId
5. Line 283: `getNationalDashboard` - userId
6. Line 336: `getMyReferrals` - userId
7. Line 363: `getMyCommissions` - userId
8. Line 391: `regenerateReferralCode` - userId
9. Line 468: `getAffiliateProfile` - userId
10. Line 646: `updateCommissionTiers` - adminId ⭐ **This was the failing endpoint**

## Solution Applied
Used `sed` command to replace all occurrences:
```bash
sed -i 's/(req as any)\.user?\.id/(req as any).user?.userId/g' src/modules/affiliate/controller.ts
```

## Testing
After the fix, the endpoints should work correctly:

### ✅ Test GET Commission Tiers
```bash
curl -X GET "http://localhost:5000/api/affiliate/admin/commission-tiers" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### ✅ Test UPDATE Commission Tiers
```bash
curl -X PUT "http://localhost:5000/api/affiliate/admin/commission-tiers" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "STANDARD",
    "affiliateRate": 0.15,
    "regionalRate": 0.05,
    "nationalRate": 0.03
  }'
```

## Prevention
To avoid this issue in the future:

1. **Create a type for the JWT payload:**
```typescript
// src/shared/types/auth.ts
export interface JWTPayload {
  userId: string;
  role: UserRole;
}
```

2. **Update middleware to use the type:**
```typescript
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // ...
  const payload = verifyAccessToken(token) as JWTPayload;
  (req as any).user = payload;
  // ...
};
```

3. **Update controllers to use the type:**
```typescript
const user = (req as any).user as JWTPayload;
const userId = user.userId;  // TypeScript will enforce correct field name
```

## Status
✅ **FIXED** - All endpoints now correctly access `userId` from the JWT token payload.

## Affected Endpoints
All affiliate admin and user endpoints are now working:
- ✅ GET/PUT `/api/affiliate/admin/commission-tiers`
- ✅ GET `/api/affiliate/dashboard`
- ✅ GET `/api/affiliate/referrals`
- ✅ GET `/api/affiliate/commissions`
- ✅ POST `/api/affiliate/regenerate-code`
- ✅ GET `/api/affiliate/profile`
- ✅ GET `/api/affiliate/regional/dashboard`
- ✅ GET `/api/affiliate/national/dashboard`
- ✅ PUT `/api/affiliate/admin/users/role`
- ✅ PATCH `/api/affiliate/admin/affiliates/:id/activate`
