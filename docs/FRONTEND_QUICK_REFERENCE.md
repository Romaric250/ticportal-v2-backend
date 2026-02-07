# Affiliate API Quick Reference - Frontend Integration

## Base URL
```
/api/affiliate
```

---

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Affiliate Profile
```http
GET /api/affiliate/profile
```

**Access:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    subRole: "AFFILIATE" | "REGIONAL_COORDINATOR" | "NATIONAL_COORDINATOR";
    referralCode: string;
    referralLink: string;
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "TERMINATED";
    tier?: "STANDARD" | "PREMIUM" | "VIP";
    regionId?: string;
    countryId?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    mobileMoneyNumber?: string;
    mobileMoneyProvider?: string;
    totalReferrals: number;
    activeReferrals: number;
    totalEarned: number;
    totalPaid: number;
    createdAt: string;
    updatedAt: string;
    region?: {
      id: string;
      name: string;
      country: { id: string; name: string; };
    };
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }
}
```

---

### 2. Create Affiliate Profile
```http
POST /api/affiliate/profile
```

**Access:** AFFILIATE, ADMIN

**Request Body:**
```typescript
{
  userId: string;                    // Required
  regionId?: string;                 // Required for AFFILIATE/REGIONAL_COORDINATOR
  countryId?: string;                // Required for NATIONAL_COORDINATOR
  subRole?: string;                  // Optional, defaults based on user role
  status?: string;                   // Optional, defaults to "PENDING"
  tier?: "STANDARD" | "PREMIUM" | "VIP";  // Optional
  bankName?: string;                 // Optional
  accountNumber?: string;            // Optional
  accountName?: string;              // Optional
  mobileMoneyNumber?: string;        // Optional (e.g., "+233241234567")
  mobileMoneyProvider?: string;      // Optional (e.g., "MTN", "Vodafone")
}
```

**Example:**
```typescript
const createProfile = async () => {
  const response = await fetch('/api/affiliate/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: "60d5ec49f1b2c8b1f8e4e1a1",
      regionId: "60d5ec49f1b2c8b1f8e4e1a2",
      subRole: "AFFILIATE",
      status: "ACTIVE",
      tier: "STANDARD",
      bankName: "Bank of Ghana",
      accountNumber: "1234567890",
      accountName: "John Doe",
      mobileMoneyNumber: "+233241234567",
      mobileMoneyProvider: "MTN"
    })
  });
  return await response.json();
};
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    subRole: string;
    referralCode: string;
    referralLink: string;
    status: string;
    tier?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    mobileMoneyNumber?: string;
    mobileMoneyProvider?: string;
    region: { id: string; name: string; country: {...} };
    user: { firstName: string; lastName: string; email: string; };
  }
}
```

---

### 3. Regenerate Referral Code
```http
POST /api/affiliate/regenerate-code
```

**Access:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**No Request Body Required**

**Response:**
```typescript
{
  success: true,
  data: {
    referralCode: string;
    referralLink: string;
  }
}
```

**Example:**
```typescript
const regenerateCode = async () => {
  const response = await fetch('/api/affiliate/regenerate-code', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

## TypeScript Types

### Request Types
```typescript
interface CreateAffiliateProfileRequest {
  userId: string;
  regionId?: string;
  countryId?: string;
  subRole?: 'AFFILIATE' | 'REGIONAL_COORDINATOR' | 'NATIONAL_COORDINATOR';
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  tier?: 'STANDARD' | 'PREMIUM' | 'VIP';
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  mobileMoneyNumber?: string;
  mobileMoneyProvider?: string;
}
```

### Response Types
```typescript
interface AffiliateProfile {
  id: string;
  userId: string;
  subRole: 'AFFILIATE' | 'REGIONAL_COORDINATOR' | 'NATIONAL_COORDINATOR';
  referralCode: string;
  referralLink: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  tier?: 'STANDARD' | 'PREMIUM' | 'VIP';
  regionId?: string;
  countryId?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  mobileMoneyNumber?: string;
  mobileMoneyProvider?: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
  region?: {
    id: string;
    name: string;
    country: { id: string; name: string; code: string; };
  };
  country?: {
    id: string;
    name: string;
    code: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface AffiliateProfileResponse {
  success: boolean;
  data: AffiliateProfile;
}

interface RegenerateCodeResponse {
  success: boolean;
  data: {
    referralCode: string;
    referralLink: string;
  };
}
```

---

## Validation Rules

### Create Profile Validation
1. **userId**: Required, must be a valid user ID
2. **regionId**: Required for AFFILIATE and REGIONAL_COORDINATOR roles
3. **countryId**: Required for NATIONAL_COORDINATOR role
4. **subRole**: Optional, defaults based on user's role
5. **status**: Optional, defaults to "PENDING"
6. **tier**: Optional, must be one of: STANDARD, PREMIUM, VIP
7. **mobileMoneyNumber**: Should include country code (e.g., "+233...")
8. **mobileMoneyProvider**: Common values: "MTN", "Vodafone", "AirtelTigo"

---

## Error Responses

### 400 Bad Request
```typescript
{
  error: "User ID is required"
}
// or
{
  error: "Region ID is required for Affiliate or Regional Coordinator"
}
```

### 500 Internal Server Error
```typescript
{
  error: "Affiliate profile already exists for this user"
}
// or
{
  error: "Failed to create affiliate profile"
}
```

---

## Usage Examples

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

export const useAffiliateProfile = () => {
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/affiliate/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, refetch: fetchProfile };
};
```

### Vue Composable Example
```typescript
import { ref } from 'vue';

export const useAffiliateProfile = () => {
  const profile = ref<AffiliateProfile | null>(null);
  const loading = ref(false);

  const fetchProfile = async () => {
    loading.value = true;
    try {
      const response = await fetch('/api/affiliate/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        profile.value = data.data;
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      loading.value = false;
    }
  };

  return { profile, loading, fetchProfile };
};
```

---

## Mobile Money Providers
Common providers in Ghana:
- MTN
- Vodafone
- AirtelTigo

Format: "+233XXXXXXXXX"

---

## Notes
1. All timestamps are in ISO 8601 format
2. All monetary values are in the base currency (likely GHS)
3. Referral links are automatically generated with the format: `${CLIENT_URL}/pay?ref=${referralCode}`
4. The referral code format is: `TIC-{REGION}-{FIRSTNAME}-{YEAR}-{RANDOM}`

---

## Support
For additional help or questions, refer to:
- Full API Documentation: `/docs/FINAL_AFFILIATE_API.md`
- System Updates: `/docs/AFFILIATE_SYSTEM_UPDATES.md`
