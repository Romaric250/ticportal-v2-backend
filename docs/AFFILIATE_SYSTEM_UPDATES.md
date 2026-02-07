# Affiliate System Updates - Summary

## Date: 2024-01-XX

---

## Overview
The affiliate system has been refactored to use a unified `AffiliateProfile` model with enhanced features, including support for all profile fields during creation, improved payment integration, and streamlined API endpoints.

---

## Major Changes

### 1. **Unified AffiliateProfile Model**
- Consolidated `AffiliateProfile`, `RegionalCoordinatorProfile`, and `NationalCoordinatorProfile` into a single `AffiliateProfile` model.
- Added `subRole` field to distinguish between:
  - `AFFILIATE`
  - `REGIONAL_COORDINATOR`
  - `ASSISTANT_REGIONAL_COORDINATOR`
  - `NATIONAL_COORDINATOR`
  - `ASSISTANT_NATIONAL_COORDINATOR`

### 2. **Enhanced Profile Fields**
The `AffiliateProfile` model now includes:
- **Payment Information:**
  - `bankName`
  - `accountNumber`
  - `accountName`
  - `mobileMoneyNumber`
  - `mobileMoneyProvider`
- **Status and Tier:**
  - `status`: PENDING, ACTIVE, SUSPENDED, TERMINATED
  - `tier`: STANDARD, PREMIUM, VIP
- **Location:**
  - `regionId` (for affiliates and regional coordinators)
  - `countryId` (for national coordinators)

### 3. **Updated API Endpoints**

#### Create Affiliate Profile
- **Old:** `POST /api/admin/affiliates` (limited fields)
- **New:** `POST /api/affiliate/profile` (accepts all fields)

**New Request Body:**
```json
{
  "userId": "string",
  "regionId": "string",
  "subRole": "AFFILIATE",
  "countryId": "string?",
  "status": "ACTIVE",
  "tier": "STANDARD",
  "bankName": "Bank of Ghana",
  "accountNumber": "1234567890",
  "accountName": "John Doe",
  "mobileMoneyNumber": "+233241234567",
  "mobileMoneyProvider": "MTN"
}
```

#### Get Affiliate Profile
- **Endpoint:** `GET /api/affiliate/profile`
- **Access:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR
- Returns complete profile with all fields

#### Regenerate Referral Code
- **Endpoint:** `POST /api/affiliate/regenerate-code`
- **Access:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR
- Generates a new unique referral code

### 4. **Commission System Updates**
- Commission attribution now uses `affiliateProfileId` instead of separate profile IDs
- Updated commission calculation logic to support unified model
- Enhanced commission tracking with stats aggregation

### 5. **Role-Based Access Control**
- Both `AFFILIATE` and `ADMIN` roles can create affiliate profiles
- Profile creation validates required fields based on `subRole`:
  - `NATIONAL_COORDINATOR`: Requires `countryId`
  - `AFFILIATE` / `REGIONAL_COORDINATOR`: Requires `regionId`

---

## Database Schema Changes

### AffiliateProfile Model
```prisma
model AffiliateProfile {
  id                    String            @id @default(auto()) @map("_id") @db.ObjectId
  userId                String            @unique @db.ObjectId
  regionId              String?           @db.ObjectId
  countryId             String?           @db.ObjectId
  subRole               AffiliateSubRole
  referralCode          String            @unique
  referralLink          String?
  status                AffiliateStatus   @default(PENDING)
  tier                  AffiliateTier?
  bankName              String?
  accountNumber         String?
  accountName           String?
  mobileMoneyNumber     String?
  mobileMoneyProvider   String?
  totalReferrals        Int               @default(0)
  activeReferrals       Int               @default(0)
  totalStudents         Int               @default(0)
  totalEarned           Float             @default(0.0)
  totalPaid             Float             @default(0.0)
  activatedAt           DateTime?
  activatedBy           String?           @db.ObjectId
  assignedAt            DateTime?
  assignedBy            String?           @db.ObjectId
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt
  
  user                  User              @relation(fields: [userId], references: [id])
  region                Region?           @relation(fields: [regionId], references: [id])
  country               Country?          @relation(fields: [countryId], references: [id])
  commissions           Commission[]
}
```

### Commission Model Updates
```prisma
model Commission {
  // ... existing fields
  affiliateProfileId    String?           @db.ObjectId
  affiliateProfile      AffiliateProfile? @relation(fields: [affiliateProfileId], references: [id])
}
```

---

## Migration Steps

1. **Run Prisma Migration:**
   ```bash
   npx prisma migrate dev --name unify-affiliate-profiles
   ```

2. **Data Migration (if needed):**
   - Existing affiliate profiles will be preserved
   - Set `subRole` based on existing role mappings
   - Update commission references to use `affiliateProfileId`

3. **Update Frontend:**
   - Use new endpoint `/api/affiliate/profile` for creating profiles
   - Include all required fields in form submissions
   - Update UI to display new fields (bank details, mobile money, tier)

---

## API Changes for Frontend Integration

### Creating an Affiliate Profile
**Before:**
```typescript
POST /api/admin/affiliates
{
  "userId": "...",
  "regionId": "..."
}
```

**After:**
```typescript
POST /api/affiliate/profile
{
  "userId": "...",
  "regionId": "...",
  "subRole": "AFFILIATE",
  "status": "ACTIVE",
  "tier": "STANDARD",
  "bankName": "Bank of Ghana",
  "accountNumber": "1234567890",
  "accountName": "John Doe",
  "mobileMoneyNumber": "+233241234567",
  "mobileMoneyProvider": "MTN"
}
```

### Fetching Affiliate Profile
```typescript
GET /api/affiliate/profile
// Returns complete profile with all fields
```

### Regenerating Referral Code
```typescript
POST /api/affiliate/regenerate-code
// Returns new referral code and link
```

---

## Testing Checklist

- [ ] Create affiliate profile with all fields
- [ ] Create affiliate profile with minimal fields
- [ ] Fetch affiliate profile
- [ ] Regenerate referral code
- [ ] Validate region/country requirements based on subRole
- [ ] Test commission attribution with new schema
- [ ] Verify payment information is stored and retrieved correctly
- [ ] Test role-based access control

---

## Documentation Files
- **API Documentation:** `/docs/FINAL_AFFILIATE_API.md`
- **System Architecture:** `/docs/AFFILIATE_SYSTEM_ARCHITECTURE.md`
- **Implementation Guide:** `/docs/AFFILIATE_IMPLEMENTATION_GUIDE.md`
- **Commission Logic:** `/docs/COMMISSION_CALCULATION.md`

---

## Breaking Changes
1. ⚠️ Endpoint URL changed from `/api/admin/affiliates` to `/api/affiliate/profile`
2. ⚠️ Request body now accepts additional optional fields
3. ⚠️ Commission model references `affiliateProfileId` instead of separate profile IDs

---

## Backward Compatibility
- Existing affiliate profiles remain functional
- Old API endpoints are deprecated but may continue to work until explicitly removed
- Commission calculations updated to work with both old and new schemas during transition

---

## Next Steps
1. Update frontend to use new endpoints
2. Add UI for payment information fields
3. Implement tier-based commission rates
4. Add admin dashboard for managing affiliate profiles
5. Create reports for commission tracking

---

## Support
For questions or issues, contact the backend team or refer to the complete documentation in `/docs/`.
