# Complete Affiliate System API Reference

## Base URL
```
/api/affiliate
```

---

## Public Endpoints

### Validate Referral Code
```http
GET /validate/:referralCode
```
No authentication required. Returns affiliate info if code is valid.

---

## Affiliate/Coordinator Endpoints

### Get My Profile
```http
GET /profile
Auth: Required | Roles: AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR
```

### Create Profile
```http
POST /profile
Auth: Required | Roles: ADMIN, AFFILIATE
Body: { userId, regionId, subRole, countryId?, status?, tier?, bankName?, accountNumber?, accountName?, mobileMoneyNumber?, mobileMoneyProvider? }
```

### Regenerate Referral Code
```http
POST /regenerate-code
Auth: Required | Roles: AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR
```

### Get My Dashboard
```http
GET /dashboard
Auth: Required | Roles: AFFILIATE
```

### Get My Referrals
```http
GET /referrals?page=1&limit=20&status=PAID
Auth: Required | Roles: AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR
```

### Get My Commissions
```http
GET /commissions?page=1&limit=20&status=APPROVED&type=AFFILIATE
Auth: Required | Roles: AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR
```

### Get Regional Dashboard
```http
GET /regional/dashboard
Auth: Required | Roles: REGIONAL_COORDINATOR, NATIONAL_COORDINATOR, ADMIN
```

### Get National Dashboard
```http
GET /national/dashboard
Auth: Required | Roles: NATIONAL_COORDINATOR, ADMIN
```

---

## Admin Endpoints - Country & Region

### Create Country
```http
POST /admin/countries
Auth: Required | Roles: ADMIN
Body: { code, name, currency?, studentPrice?, platformFee?, affiliateCommissionRate?, regionalCommissionRate?, nationalCommissionRate? }
```

### List Countries
```http
GET /admin/countries
Auth: Required | Roles: ADMIN, NATIONAL_COORDINATOR
```

### ✨ Update Country
```http
PUT /admin/countries/:countryId
Auth: Required | Roles: ADMIN
Body: { name?, code?, currency?, studentPrice?, platformFee?, affiliateCommissionRate?, regionalCommissionRate?, nationalCommissionRate? }
```

### ✨ Delete Country
```http
DELETE /admin/countries/:countryId
Auth: Required | Roles: ADMIN
Note: Deletes country and all associated regions. Will fail if there are existing affiliates or payments.
```

### Create Region
```http
POST /admin/regions
Auth: Required | Roles: ADMIN, NATIONAL_COORDINATOR
Body: { countryId, name }
```

### ✨ Update Region
```http
PUT /admin/regions/:regionId
Auth: Required | Roles: ADMIN, NATIONAL_COORDINATOR
Body: { name?, countryId? }
```

### ✨ Delete Region
```http
DELETE /admin/regions/:regionId
Auth: Required | Roles: ADMIN, NATIONAL_COORDINATOR
Note: Will fail if there are existing affiliates in this region.
```

### List Regions by Country
```http
GET /admin/countries/:countryId/regions
Auth: Required | Roles: ADMIN, NATIONAL_COORDINATOR, REGIONAL_COORDINATOR
```

---

## Admin Endpoints - User & Affiliate Management

### Update User Role
```http
PUT /admin/users/role
Auth: Required | Roles: ADMIN
Body: { userId, newRole, countryId?, regionId?, assignedBy? }
```

### Create Affiliate Profile (Legacy)
```http
POST /admin/affiliates
Auth: Required | Roles: ADMIN, AFFILIATE
Body: { userId, regionId, subRole?, countryId?, ... }
```

### Activate Affiliate
```http
PATCH /admin/affiliates/:affiliateId/activate
Auth: Required | Roles: ADMIN, NATIONAL_COORDINATOR, AFFILIATE
Body: { bankName?, accountNumber?, accountName?, mobileMoneyNumber?, mobileMoneyProvider?, reason? }
```

### ✨ List All Affiliates
```http
GET /admin/affiliates?page=1&limit=20&status=ACTIVE&search=john&regionId=xxx&countryId=xxx
Auth: Required | Roles: ADMIN
```

### ✨ Suspend Affiliate
```http
PATCH /admin/affiliates/:affiliateId/suspend
Auth: Required | Roles: ADMIN
Body: { reason?: string }
```

### ✨ Unsuspend Affiliate
```http
PATCH /admin/affiliates/:affiliateId/unsuspend
Auth: Required | Roles: ADMIN
```

---

## Admin Endpoints - Financial & Reporting

### ✨ Financial Overview
```http
GET /admin/financial-overview
Auth: Required | Roles: ADMIN
Returns: { totalRevenue, commissionsOwed, commissionsPaid, ticNetFees }
```

### ✨ System Ledger
```http
GET /admin/system-ledger?page=1&limit=20&startDate=2026-01-01&endDate=2026-12-31
Auth: Required | Roles: ADMIN
Returns: { entries: [...], pagination: {...} }
```

### ✨ Payout Batches
```http
GET /admin/payouts?page=1&limit=20&status=PENDING
Auth: Required | Roles: ADMIN
Returns: { payouts: [...], pagination: {...} }
```

### ✨ Fraud Flags
```http
GET /admin/fraud-flags?page=1&limit=20&severity=CRITICAL&resolved=false&type=VELOCITY_ABUSE
Auth: Required | Roles: ADMIN
Returns: { flags: [...], pagination: {...} }
```

---

## Admin Endpoints - Commission Configuration

### ✨ Get Commission Tiers
```http
GET /admin/commission-tiers
Auth: Required | Roles: ADMIN
Returns: { standard: {...}, premium: {...}, vip: {...} }
```

### ✨ Update Commission Tiers
```http
PUT /admin/commission-tiers
Auth: Required | Roles: ADMIN
Body: { tier: "STANDARD", affiliateRate: 0.09, regionalRate: 0.06, nationalRate: 0.05 }
Returns: { standard: {...}, premium: {...}, vip: {...} }
```

---

## Legend

- ✨ = New endpoint (just implemented)
- Auth: Required = JWT token required
- Roles: Allowed user roles
- ? = Optional parameter

---

## Standard Response Format

### Success
```json
{
  "success": true,
  "data": {...}
}
```

### Error
```json
{
  "error": "Error message"
}
```

### Pagination
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

---

## Common Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status
- `search`: Search query string
- `startDate`: ISO date string (YYYY-MM-DD)
- `endDate`: ISO date string (YYYY-MM-DD)

---

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Total Endpoints: 31

- Public: 1
- Affiliate/Coordinator: 8
- Admin (Country & Region): 8 ✨ (was 4)
- Admin (User & Affiliate): 5
- Admin (Financial & Reporting): 4
- Admin (Commission Config): 2
- Legacy/Deprecated: 3

---

## Implementation Status

✅ All endpoints implemented and tested
✅ No TypeScript errors
✅ Proper authentication and authorization
✅ Input validation
✅ Error handling
✅ Pagination support
✅ Search and filtering
✅ Ready for frontend integration
