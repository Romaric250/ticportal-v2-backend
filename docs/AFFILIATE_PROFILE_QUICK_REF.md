# Affiliate Profile API - Quick Reference

## Endpoint
```
GET /api/affiliate/profile
POST /api/affiliate/admin/affiliates (Admin only)
POST /api/affiliate/regenerate-code
```

## 1. Get Profile
**GET /api/affiliate/profile**

### Auth
- **Required:** Yes (Bearer token)
- **Roles:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

### Request
```bash
curl -X GET https://api.ticportal.com/api/affiliate/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "subRole": "AFFILIATE",
    "referralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "referralLink": "https://app.ticportal.com/pay?ref=TIC-DOUALA-JOHN-2026-X1Y2",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "region": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Douala",
      "country": {
        "id": "507f1f77bcf86cd799439014",
        "name": "Cameroon",
        "code": "CM"
      }
    },
    "country": null,
    "totalReferrals": 25,
    "activeReferrals": 20,
    "totalStudents": 25,
    "totalEarned": 11250.0,
    "totalPaid": 5000.0,
    "bankName": "Bank of Africa",
    "accountNumber": "1234567890",
    "accountName": "John Doe",
    "mobileMoneyNumber": "+237677123456",
    "mobileMoneyProvider": "MTN",
    "activatedAt": "2026-01-15T10:30:00.000Z",
    "assignedAt": null,
    "createdAt": "2026-01-10T08:00:00.000Z",
    "updatedAt": "2026-02-07T12:30:00.000Z"
  }
}
```

## 2. Create Profile (Admin)
**POST /api/affiliate/admin/affiliates**

### Auth
- **Required:** Yes (Bearer token)
- **Roles:** ADMIN

### Request
```bash
curl -X POST https://api.ticportal.com/api/affiliate/admin/affiliates \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439012",
    "regionId": "507f1f77bcf86cd799439013",
    "subRole": "AFFILIATE"
  }'
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "referralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "status": "PENDING",
    "tier": "STANDARD",
    "region": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Douala",
      "country": {
        "id": "507f1f77bcf86cd799439014",
        "name": "Cameroon",
        "code": "CM"
      }
    },
    "country": null,
    "totalReferrals": 0,
    "activeReferrals": 0,
    "totalStudents": 0,
    "totalEarned": 0.0,
    "totalPaid": 0.0,
    "bankName": null,
    "accountNumber": null,
    "accountName": null,
    "mobileMoneyNumber": null,
    "mobileMoneyProvider": null,
    "activatedAt": null,
    "assignedAt": null,
    "createdAt": "2026-01-10T08:00:00.000Z",
    "updatedAt": "2026-01-10T08:00:00.000Z"
  }
}
```

## 3. Regenerate Code
**POST /api/affiliate/regenerate-code**

### Auth
- **Required:** Yes (Bearer token)
- **Roles:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

### Request
```bash
curl -X POST https://api.ticportal.com/api/affiliate/regenerate-code \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "oldReferralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "newReferralCode": "TIC-DOUALA-JOHN-2026-Z9A8",
    "newReferralLink": "https://app.ticportal.com/pay?ref=TIC-DOUALA-JOHN-2026-Z9A8"
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Affiliate profile not found"
}
```

## SubRoles
- `AFFILIATE` - Regular affiliate with regional scope
- `REGIONAL_COORDINATOR` - Manages affiliates in a region
- `ASSISTANT_REGIONAL_COORDINATOR` - Assists regional coordinator
- `NATIONAL_COORDINATOR` - Manages all regions in a country
- `ASSISTANT_NATIONAL_COORDINATOR` - Assists national coordinator

## Status Values
- `PENDING` - Profile created, awaiting activation
- `ACTIVE` - Profile active and operational
- `SUSPENDED` - Temporarily suspended
- `TERMINATED` - Permanently terminated

## Tier Values
- `STANDARD` - Basic tier
- `PREMIUM` - Enhanced benefits
- `VIP` - Highest tier with maximum benefits

## Fields by Role

### AFFILIATE
- Has `region` (not null)
- Has `regionId` (not null)
- `country` is null
- `countryId` is null

### REGIONAL_COORDINATOR
- Has `region` (not null)
- Has `regionId` (not null)
- `country` is null
- `countryId` is null

### NATIONAL_COORDINATOR
- `region` is null
- `regionId` is null
- Has `country` (not null)
- Has `countryId` (not null)

## Frontend Usage

```typescript
// Fetch profile
const response = await fetch('/api/affiliate/profile', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
});

const { data } = await response.json();

// Check role
if (data.subRole === 'AFFILIATE') {
  // Show affiliate UI
} else if (data.subRole.includes('REGIONAL')) {
  // Show regional coordinator UI
} else if (data.subRole.includes('NATIONAL')) {
  // Show national coordinator UI
}

// Use referral link
const paymentUrl = data.referralLink;
```

## Related Endpoints
- `GET /api/affiliate/dashboard` - Affiliate dashboard stats
- `GET /api/affiliate/regional/dashboard` - Regional coordinator dashboard
- `GET /api/affiliate/national/dashboard` - National coordinator dashboard
- `GET /api/affiliate/referrals` - List referrals
- `GET /api/affiliate/commissions` - List commissions
