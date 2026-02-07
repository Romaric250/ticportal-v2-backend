# Affiliate Profile API

## Schema Updates

### Unified AffiliateProfile Model
All affiliate, regional coordinator, and national coordinator profiles are now consolidated into a single `AffiliateProfile` model with a `subRole` field.

```typescript
model AffiliateProfile {
  id                  String
  userId              String
  subRole             AffiliateSubRole  // AFFILIATE | REGIONAL_COORDINATOR | ASSISTANT_REGIONAL_COORDINATOR | NATIONAL_COORDINATOR | ASSISTANT_NATIONAL_COORDINATOR
  
  // Region (for AFFILIATE and REGIONAL_COORDINATOR)
  regionId            String?
  region              Region?
  
  // Country (for NATIONAL_COORDINATOR)
  countryId           String?
  country             Country?
  
  referralCode        String
  referralLink        String
  status              AffiliateStatus   // PENDING | ACTIVE | SUSPENDED | TERMINATED
  tier                AffiliateTier     // STANDARD | PREMIUM | VIP
  
  activatedAt         DateTime?
  activatedBy         String?
  assignedAt          DateTime?
  assignedBy          String?
  
  totalReferrals      Int
  activeReferrals     Int
  totalStudents       Int
  totalEarned         Float
  totalPaid           Float
  
  // Payment details
  bankName            String?
  accountNumber       String?
  accountName         String?
  mobileMoneyNumber   String?
  mobileMoneyProvider String?
  
  createdAt           DateTime
  updatedAt           DateTime
}
```

## API Endpoint

### GET /api/affiliate/profile

**Description:** Fetch the authenticated user's affiliate profile.

**Authentication:** Required (Bearer token)

**Authorization:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Request:**
```http
GET /api/affiliate/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "subRole": "AFFILIATE",
    "referralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "referralLink": "https://app.ticportal.com/pay?ref=TIC-DOUALA-JOHN-2026-X1Y2",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "region": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Douala",
      "country": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
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

**Response for Regional Coordinator:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "subRole": "REGIONAL_COORDINATOR",
    "referralCode": "TIC-DOUALA-JANE-2026-A1B2",
    "referralLink": "https://app.ticportal.com/pay?ref=TIC-DOUALA-JANE-2026-A1B2",
    "status": "ACTIVE",
    "tier": "PREMIUM",
    "region": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Douala",
      "country": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Cameroon",
        "code": "CM"
      }
    },
    "country": null,
    "totalReferrals": 150,
    "activeReferrals": 120,
    "totalStudents": 150,
    "totalEarned": 45000.0,
    "totalPaid": 20000.0,
    "assignedAt": "2026-01-05T09:00:00.000Z",
    ...
  }
}
```

**Response for National Coordinator:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "subRole": "NATIONAL_COORDINATOR",
    "referralCode": "TIC-CM-NC-SARAH-2026-Z9Y8",
    "referralLink": "https://app.ticportal.com/pay?ref=TIC-CM-NC-SARAH-2026-Z9Y8",
    "status": "ACTIVE",
    "tier": "VIP",
    "region": null,
    "country": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Cameroon",
      "code": "CM"
    },
    "totalReferrals": 500,
    "activeReferrals": 450,
    "totalStudents": 500,
    "totalEarned": 125000.0,
    "totalPaid": 60000.0,
    "assignedAt": "2026-01-01T00:00:00.000Z",
    ...
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "error": "Affiliate profile not found"
}
```

## Key Changes

1. **Unified Model:** All affiliate roles now use a single `AffiliateProfile` table with `subRole` field.
2. **Flexible Location:** `regionId` for affiliates/regional coordinators, `countryId` for national coordinators.
3. **Referral Codes:** All roles get unique referral codes for tracking.
4. **Single Endpoint:** One `/profile` endpoint serves all affiliate role types.
5. **Commission Reference:** `Commission` model now uses `affiliateProfileId` instead of separate fields.

## Frontend Integration

```typescript
// Fetch affiliate profile
const response = await fetch('/api/affiliate/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const { data } = await response.json();

// Check role type
if (data.subRole === 'AFFILIATE') {
  // Display affiliate dashboard
} else if (data.subRole === 'REGIONAL_COORDINATOR') {
  // Display regional coordinator dashboard
} else if (data.subRole === 'NATIONAL_COORDINATOR') {
  // Display national coordinator dashboard
}

// Generate payment link with referral
const paymentLink = data.referralLink; // e.g., https://app.ticportal.com/pay?ref=TIC-DOUALA-JOHN-2026-X1Y2
```

## Migration Notes

- Existing `regionalCoordinatorProfile` and `nationalCoordinatorProfile` tables are removed.
- All coordinator profiles migrated to `AffiliateProfile` with appropriate `subRole`.
- Commission tracking updated to use `affiliateProfileId` instead of role-specific IDs.

## API Endpoint

### GET /api/affiliate/profile

**Description:** Fetch the authenticated user's affiliate profile.

**Authentication:** Required (Bearer token)

**Authorization:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Request:**
```http
GET /api/affiliate/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "subRole": "AFFILIATE",
    "referralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "referralLink": "https://app.ticportal.com/pay?ref=TIC-DOUALA-JOHN-2026-X1Y2",
    "status": "ACTIVE",
    "tier": "STANDARD",
    "region": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Douala",
      "country": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
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

### POST /api/affiliate/admin/affiliates

**Description:** Create a new affiliate profile (Admin only).

**Authentication:** Required (Bearer token)

**Authorization:** ADMIN

**Request:**
```http
POST /api/affiliate/admin/affiliates
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "regionId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "subRole": "AFFILIATE"  // Optional, defaults to AFFILIATE
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "subRole": "AFFILIATE",
    "referralCode": "TIC-DOUALA-JOHN-2026-X1Y2",
    "referralLink": "https://app.ticportal.com/pay?ref=TIC-DOUALA-JOHN-2026-X1Y2",
    "status": "PENDING",
    "region": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Douala",
      "country": {
        "name": "Cameroon"
      }
    },
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }
}
```

### POST /api/affiliate/regenerate-code

**Description:** Regenerate referral code for authenticated user.

**Authentication:** Required (Bearer token)

**Authorization:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Request:**
```http
POST /api/affiliate/regenerate-code
Authorization: Bearer <token>
```

**Response (200 OK):**
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
