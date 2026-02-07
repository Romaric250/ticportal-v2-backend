# Affiliate System API - Final Documentation

## Base URL
```
/api/affiliate
```

---

## 1. Get Affiliate Profile

**GET** `/profile`

**Auth:** Required | **Roles:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "subRole": "AFFILIATE | REGIONAL_COORDINATOR | ASSISTANT_REGIONAL_COORDINATOR | NATIONAL_COORDINATOR | ASSISTANT_NATIONAL_COORDINATOR",
    "referralCode": "string",
    "referralLink": "string",
    "status": "PENDING | ACTIVE | SUSPENDED | TERMINATED",
    "tier": "STANDARD | PREMIUM | VIP",
    "region": {
      "id": "string",
      "name": "string",
      "country": { "id": "string", "name": "string", "code": "string" }
    } | null,
    "country": {
      "id": "string",
      "name": "string",
      "code": "string"
    } | null,
    "totalReferrals": 0,
    "activeReferrals": 0,
    "totalStudents": 0,
    "totalEarned": 0.0,
    "totalPaid": 0.0,
    "bankName": "string?",
    "accountNumber": "string?",
    "accountName": "string?",
    "mobileMoneyNumber": "string?",
    "mobileMoneyProvider": "string?",
    "activatedAt": "datetime?",
    "assignedAt": "datetime?",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

## 2. Create Affiliate Profile

**POST** `/profile`

**Auth:** Required | **Roles:** ADMIN, AFFILIATE

**Request:**
```json
{
  "userId": "string",
  "regionId": "string",
  "subRole": "AFFILIATE",
  "countryId": "string?",
  "status": "PENDING | ACTIVE | SUSPENDED | TERMINATED",
  "tier": "STANDARD | PREMIUM | VIP",
  "bankName": "string?",
  "accountNumber": "string?",
  "accountName": "string?",
  "mobileMoneyNumber": "string?",
  "mobileMoneyProvider": "string?"
}
```

**Field Descriptions:**
- `userId` (required): User ID for the affiliate profile
- `regionId` (required for AFFILIATE/REGIONAL_COORDINATOR): Region ID
- `subRole` (optional): Defaults to AFFILIATE based on user role
- `countryId` (optional, required for NATIONAL_COORDINATOR): Country ID
- `status` (optional): Defaults to PENDING
- `tier` (optional): Affiliate tier (STANDARD, PREMIUM, VIP)
- `bankName` (optional): Bank name for payouts
- `accountNumber` (optional): Bank account number
- `accountName` (optional): Bank account holder name
- `mobileMoneyNumber` (optional): Mobile money number for payouts
- `mobileMoneyProvider` (optional): Mobile money provider (MTN, Vodafone, AirtelTigo, etc.)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "subRole": "AFFILIATE",
    "referralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "referralLink": "https://app.ticportal.com/pay?ref=...",
    "status": "PENDING",
    "tier": "STANDARD",
    "bankName": "Bank of Ghana",
    "accountNumber": "1234567890",
    "accountName": "John Doe",
    "mobileMoneyNumber": "+233241234567",
    "mobileMoneyProvider": "MTN",
    "region": { "id": "string", "name": "string", "country": {...} },
    "user": { "firstName": "string", "lastName": "string", "email": "string" }
  }
}
```

---

## 3. Regenerate Referral Code

**POST** `/regenerate-code`

**Auth:** Required | **Roles:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Response:**
```json
{
  "success": true,
  "data": {
    "oldReferralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "newReferralCode": "TIC-DOUALA-JOHN-2026-Z9A8",
    "newReferralLink": "https://app.ticportal.com/pay?ref=..."
  }
}
```

---

## 4. Validate Referral Code

**GET** `/validate/:referralCode`

**Auth:** None (Public)

**Response:**
```json
{
  "valid": true,
  "affiliateId": "string",
  "affiliateName": "string",
  "regionId": "string?",
  "regionName": "string"
}
```

---

## 5. Get Affiliate Dashboard

**GET** `/dashboard`

**Auth:** Required | **Roles:** AFFILIATE

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "referralCode": "string",
      "referralLink": "string",
      "status": "ACTIVE",
      "tier": "STANDARD",
      "region": "string"
    },
    "stats": {
      "totalReferrals": 0,
      "activeReferrals": 0,
      "pendingActivation": 0,
      "conversionRate": 0.0
    },
    "earnings": {
      "pending": 0.0,
      "earned": 0.0,
      "approved": 0.0,
      "paid": 0.0,
      "total": 0.0
    },
    "recentReferrals": [
      {
        "id": "string",
        "studentName": "string",
        "registeredAt": "datetime",
        "status": "PENDING | PAID | ACTIVATED | REFUNDED | FLAGGED",
        "commissionAmount": 0.0
      }
    ]
  }
}
```

---

## 6. Get Regional Coordinator Dashboard

**GET** `/regional/dashboard`

**Auth:** Required | **Roles:** REGIONAL_COORDINATOR, NATIONAL_COORDINATOR, ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "region": "string",
      "status": "ACTIVE",
      "totalAffiliates": 0,
      "activeAffiliates": 0
    },
    "stats": {
      "totalReferrals": 0,
      "activeReferrals": 0,
      "conversionRate": 0.0
    },
    "earnings": {
      "pending": 0.0,
      "earned": 0.0,
      "approved": 0.0,
      "paid": 0.0,
      "total": 0.0
    },
    "affiliates": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "status": "ACTIVE",
        "referralCode": "string",
        "totalReferrals": 0
      }
    ]
  }
}
```

---

## 7. Get National Coordinator Dashboard

**GET** `/national/dashboard`

**Auth:** Required | **Roles:** NATIONAL_COORDINATOR, ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "country": "string",
      "status": "ACTIVE",
      "totalRegions": 0,
      "totalAffiliates": 0,
      "activeAffiliates": 0,
      "totalRegionalCoordinators": 0
    },
    "stats": {
      "totalReferrals": 0,
      "activeReferrals": 0,
      "conversionRate": 0.0
    },
    "earnings": {
      "pending": 0.0,
      "earned": 0.0,
      "approved": 0.0,
      "paid": 0.0,
      "total": 0.0
    },
    "regions": [
      {
        "id": "string",
        "name": "string",
        "affiliatesCount": 0,
        "activeAffiliatesCount": 0,
        "coordinatorsCount": 0
      }
    ]
  }
}
```

---

## 8. Get Referrals

**GET** `/referrals`

**Auth:** Required | **Roles:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Query Params:**
- `status` (optional): PENDING | PAID | ACTIVATED | REFUNDED | FLAGGED
- `page` (optional): default 1
- `limit` (optional): default 20

**Response:**
```json
{
  "success": true,
  "data": {
    "referrals": [
      {
        "id": "string",
        "student": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "phone": "string"
        },
        "payment": {
          "id": "string",
          "amount": 0.0,
          "status": "PENDING | CONFIRMED | FAILED | REFUNDED",
          "verifiedAt": "datetime?"
        },
        "affiliate": {
          "user": { "firstName": "string", "lastName": "string" }
        },
        "registeredAt": "datetime",
        "status": "PENDING | PAID | ACTIVATED | REFUNDED | FLAGGED"
      }
    ],
    "pagination": {
      "total": 0,
      "page": 1,
      "limit": 20,
      "pages": 0
    }
  }
}
```

---

## 9. Get Commissions

**GET** `/commissions`

**Auth:** Required | **Roles:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Query Params:**
- `status` (optional): PENDING | EARNED | LOCKED | APPROVED | PAID | REVOKED
- `type` (optional): AFFILIATE | REGIONAL | NATIONAL
- `page` (optional): default 1
- `limit` (optional): default 20

**Response:**
```json
{
  "success": true,
  "data": {
    "commissions": [
      {
        "id": "string",
        "type": "AFFILIATE | REGIONAL | NATIONAL",
        "baseAmount": 0.0,
        "percentage": 0.0,
        "commissionAmount": 0.0,
        "status": "PENDING | EARNED | LOCKED | APPROVED | PAID | REVOKED",
        "earnedAt": "datetime",
        "coolingPeriodEnds": "datetime",
        "approvedAt": "datetime?",
        "paidAt": "datetime?",
        "referral": {
          "student": { "firstName": "string", "lastName": "string", "email": "string" }
        },
        "affiliateProfile": {...},
        "payoutBatch": {...}
      }
    ],
    "pagination": {
      "total": 0,
      "page": 1,
      "limit": 20,
      "pages": 0
    }
  }
}
```

---

## 10. Get Countries

**GET** `/admin/countries`

**Auth:** Required | **Roles:** ADMIN, NATIONAL_COORDINATOR

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "currency": "string",
      "status": "ACTIVE | SUSPENDED | INACTIVE",
      "studentPrice": 0.0,
      "platformFee": 0.0,
      "affiliateCommissionRate": 0.0,
      "regionalCommissionRate": 0.0,
      "nationalCommissionRate": 0.0,
      "regions": [...],
      "_count": {
        "affiliates": 0,
        "regionalCoordinators": 0,
        "nationalCoordinators": 0
      }
    }
  ]
}
```

---

## 11. Get Regions by Country

**GET** `/admin/countries/:countryId/regions`

**Auth:** Required | **Roles:** ADMIN, NATIONAL_COORDINATOR, REGIONAL_COORDINATOR

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "countryId": "string",
      "status": "ACTIVE | SUSPENDED | INACTIVE",
      "country": {...},
      "_count": {
        "affiliates": 0,
        "regionalCoordinators": 0
      }
    }
  ]
}
```

---

## 12. Create Country

**POST** `/admin/countries`

**Auth:** Required | **Roles:** ADMIN

**Request:**
```json
{
  "code": "string",
  "name": "string",
  "currency": "string?",
  "studentPrice": 0.0,
  "platformFee": 0.0,
  "affiliateCommissionRate": 0.0,
  "regionalCommissionRate": 0.0,
  "nationalCommissionRate": 0.0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "code": "string",
    "name": "string",
    "currency": "string",
    "studentPrice": 0.0,
    "platformFee": 0.0,
    "affiliateCommissionRate": 0.0,
    "regionalCommissionRate": 0.0,
    "nationalCommissionRate": 0.0,
    "status": "ACTIVE"
  }
}
```

---

## 13. Create Region

**POST** `/admin/regions`

**Auth:** Required | **Roles:** ADMIN, NATIONAL_COORDINATOR

**Request:**
```json
{
  "countryId": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "countryId": "string",
    "status": "ACTIVE",
    "country": {...}
  }
}
```

---

## 14. Update User Role

**PUT** `/admin/users/role`

**Auth:** Required | **Roles:** ADMIN

**Request:**
```json
{
  "userId": "string",
  "newRole": "AFFILIATE | REGIONAL_COORDINATOR | NATIONAL_COORDINATOR | STUDENT | MENTOR | ADMIN",
  "regionId": "string?",  // Required for AFFILIATE & REGIONAL_COORDINATOR
  "countryId": "string?"  // Required for NATIONAL_COORDINATOR
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "oldRole": "STUDENT",
    "newRole": "AFFILIATE"
  }
}
```

---

## 15. Activate Affiliate

**PATCH** `/admin/affiliates/:affiliateId/activate`

**Auth:** Required | **Roles:** ADMIN, NATIONAL_COORDINATOR, AFFILIATE

**Request:**
```json
{
  "bankName": "string?",
  "accountNumber": "string?",
  "accountName": "string?",
  "mobileMoneyNumber": "string?",
  "mobileMoneyProvider": "string?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "ACTIVE",
    "activatedAt": "datetime",
    ...
  }
}
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "error": "Error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error message"
}
```

---

## Notes

1. **Referral Links:** Use format `/pay?ref=REFERRAL_CODE` for payment referrals
2. **SubRoles:** Determine dashboard/UI based on `subRole` field in profile
3. **Payment Flow:** Referral code applied during payment, not registration
4. **Commission Status Flow:** PENDING → EARNED (on activation) → APPROVED (after cooling) → PAID (on payout)
5. **Cooling Period:** 30 days from payment confirmation
