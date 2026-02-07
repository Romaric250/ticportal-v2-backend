# Affiliate Profile Consolidation - Implementation Summary

## Overview
Successfully consolidated the separate `AffiliateProfile`, `RegionalCoordinatorProfile`, and `NationalCoordinatorProfile` models into a single unified `AffiliateProfile` model with a `subRole` field. Added a GET API endpoint to fetch affiliate profiles for frontend use.

## Changes Made

### 1. Schema Changes (prisma/schema.prisma)

**Removed:**
- `RegionalCoordinatorProfile` model
- `NationalCoordinatorProfile` model
- `CoordinatorStatus` enum
- References in `User`, `Region`, and `Country` models

**Updated:**
- `AffiliateProfile` model now includes:
  - `subRole` field (AffiliateSubRole enum)
  - Optional `regionId` and `countryId` fields
  - `assignedAt` and `assignedBy` fields
  - `totalStudents` field
  - All relevant fields from coordinator profiles

**Added:**
- `AffiliateSubRole` enum:
  - AFFILIATE
  - REGIONAL_COORDINATOR
  - ASSISTANT_REGIONAL_COORDINATOR
  - NATIONAL_COORDINATOR
  - ASSISTANT_NATIONAL_COORDINATOR

**Commission Model:**
- Changed from separate `affiliateId`, `regionalCoordinatorId`, `nationalCoordinatorId` fields
- Now uses single `affiliateProfileId` field

### 2. Service Updates (src/modules/affiliate/service.ts)

**Updated Methods:**
- `updateUserRole()` - Now creates unified AffiliateProfile with appropriate subRole for all coordinator types
- `validateReferralCode()` - Handles nullable region/country fields
- `getAffiliateDashboard()` - Updated to work with unified model
- `getReferrals()` - Uses subRole to determine filtering logic
- `getCommissions()` - References `affiliateProfileId` instead of role-specific IDs
- `getRegionalCoordinatorDashboard()` - Uses unified profile with subRole check
- `getNationalCoordinatorDashboard()` - Uses unified profile with subRole check
- `getCountries()` - Updated counting logic for unified profiles
- `getRegionsByCountry()` - Updated counting logic for unified profiles

**Added Method:**
- `getAffiliateProfile(userId)` - New method to fetch complete affiliate profile for authenticated user

### 3. Controller Updates (src/modules/affiliate/controller.ts)

**Added Method:**
- `getAffiliateProfile()` - Controller handler for GET /api/affiliate/profile endpoint

### 4. Routes Updates (src/modules/affiliate/routes.ts)

**Added Route:**
```typescript
GET /api/affiliate/profile
- Authentication: Required
- Authorization: AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR
- Returns: Complete affiliate profile for authenticated user
```

### 5. Documentation

**Created:**
- `docs/AFFILIATE_PROFILE_API.md` - Concise API documentation including:
  - Unified AffiliateProfile schema
  - GET /api/affiliate/profile endpoint details
  - Request/response examples for all subRoles
  - Error responses
  - Frontend integration examples
  - Migration notes

## API Endpoint

### GET /api/affiliate/profile

**URL:** `/api/affiliate/profile`

**Method:** GET

**Auth:** Required (Bearer token)

**Roles:** AFFILIATE, REGIONAL_COORDINATOR, NATIONAL_COORDINATOR

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "subRole": "AFFILIATE | REGIONAL_COORDINATOR | NATIONAL_COORDINATOR | ...",
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
    "totalReferrals": "number",
    "activeReferrals": "number",
    "totalStudents": "number",
    "totalEarned": "number",
    "totalPaid": "number",
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

## Benefits

1. **Simplified Schema:** One table instead of three
2. **Easier Queries:** Single profile lookup for any affiliate role
3. **Consistent Structure:** All roles share the same data structure
4. **Flexible Roles:** Easy to add new sub-roles (e.g., assistant coordinators)
5. **Better Maintenance:** Less code duplication
6. **Commission Tracking:** Simpler relationship with single foreign key

## Migration Impact

**Breaking Changes:**
- Old `regionalCoordinatorProfile` and `nationalCoordinatorProfile` queries will fail
- Commission queries using old foreign keys need updating
- Frontend code checking separate profile tables needs refactoring

**Data Migration Required:**
- Existing regional/national coordinator profiles must be migrated to unified AffiliateProfile
- Update their `subRole` field appropriately
- Migrate commission references to new `affiliateProfileId`

## Frontend Integration Example

```typescript
// Fetch profile
const { data } = await fetchAffiliateProfile();

// Determine dashboard to show
switch (data.subRole) {
  case 'AFFILIATE':
    return <AffiliateDashboard profile={data} />;
  case 'REGIONAL_COORDINATOR':
  case 'ASSISTANT_REGIONAL_COORDINATOR':
    return <RegionalCoordinatorDashboard profile={data} />;
  case 'NATIONAL_COORDINATOR':
  case 'ASSISTANT_NATIONAL_COORDINATOR':
    return <NationalCoordinatorDashboard profile={data} />;
}

// Use referral link
const referralLink = data.referralLink;
// e.g., https://app.ticportal.com/pay?ref=TIC-DOUALA-JOHN-2026-X1Y2
```

## Testing Checklist

- [ ] Test affiliate profile creation
- [ ] Test regional coordinator assignment
- [ ] Test national coordinator assignment
- [ ] Test GET /api/affiliate/profile for each subRole
- [ ] Test referral code validation
- [ ] Test commission attribution
- [ ] Test dashboard endpoints for all roles
- [ ] Test migration from old schema to new
- [ ] Verify all frontend integrations

## Files Modified

1. `prisma/schema.prisma` - Schema consolidation
2. `src/modules/affiliate/service.ts` - Service logic updates
3. `src/modules/affiliate/controller.ts` - Added getAffiliateProfile method
4. `src/modules/affiliate/routes.ts` - Added /profile route
5. `docs/AFFILIATE_PROFILE_API.md` - New API documentation

## Completion Status

✅ Schema consolidated  
✅ Service methods updated  
✅ Controller method added  
✅ Route added  
✅ Documentation created  
✅ No TypeScript errors  
✅ Prisma client generated  

**Status:** Implementation Complete ✨
