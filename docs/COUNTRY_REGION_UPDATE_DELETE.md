# Country & Region Management API - Update/Delete Endpoints

## Date: February 7, 2026

---

## Overview
Added missing UPDATE and DELETE endpoints for Countries and Regions that the frontend was trying to use.

---

## New Endpoints Implemented

### 1. Update Country
**PUT** `/api/affiliate/admin/countries/:countryId`

**Auth:** Required | **Roles:** ADMIN

**Request Body:**
```json
{
  "name": "Cameroon",
  "code": "CM",
  "currency": "XAF",
  "studentPrice": 5000,
  "platformFee": 300,
  "affiliateCommissionRate": 9,
  "regionalCommissionRate": 6,
  "nationalCommissionRate": 5
}
```

All fields are optional - only include fields you want to update.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Cameroon",
    "code": "CM",
    "currency": "XAF",
    "studentPrice": 5000,
    "platformFee": 300,
    "affiliateCommissionRate": 9,
    "regionalCommissionRate": 6,
    "nationalCommissionRate": 5,
    "status": "ACTIVE",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 2. Delete Country
**DELETE** `/api/affiliate/admin/countries/:countryId`

**Auth:** Required | **Roles:** ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Country and associated regions deleted successfully"
  }
}
```

**Important Notes:**
- Deletes the country and ALL associated regions (cascade delete)
- Will fail with error if there are existing affiliate profiles
- Will fail with error if there are existing payments
- This is to prevent data integrity issues

**Error Responses:**
```json
// If country has affiliates
{
  "error": "Cannot delete country with existing affiliate profiles"
}

// If country has payments
{
  "error": "Cannot delete country with existing payments"
}
```

---

### 3. Update Region
**PUT** `/api/affiliate/admin/regions/:regionId`

**Auth:** Required | **Roles:** ADMIN, NATIONAL_COORDINATOR

**Request Body:**
```json
{
  "name": "Douala",
  "countryId": "..."
}
```

Both fields are optional - only include fields you want to update.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Douala",
    "countryId": "...",
    "status": "ACTIVE",
    "createdAt": "...",
    "updatedAt": "...",
    "country": {
      "id": "...",
      "name": "Cameroon",
      "code": "CM"
    }
  }
}
```

---

### 4. Delete Region
**DELETE** `/api/affiliate/admin/regions/:regionId`

**Auth:** Required | **Roles:** ADMIN, NATIONAL_COORDINATOR

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Region deleted successfully"
  }
}
```

**Important Notes:**
- Will fail with error if there are existing affiliate profiles in this region
- This prevents orphaned affiliates

**Error Response:**
```json
{
  "error": "Cannot delete region with existing affiliate profiles"
}
```

---

## Implementation Details

### Files Modified

1. **`src/modules/affiliate/service.ts`**
   - Added `updateCountry()` method
   - Added `deleteCountry()` method
   - Added `updateRegion()` method
   - Added `deleteRegion()` method

2. **`src/modules/affiliate/controller.ts`**
   - Added `updateCountry` controller method
   - Added `deleteCountry` controller method
   - Added `updateRegion` controller method
   - Added `deleteRegion` controller method

3. **`src/modules/affiliate/routes.ts`**
   - Added `PUT /admin/countries/:countryId` route
   - Added `DELETE /admin/countries/:countryId` route
   - Added `PUT /admin/regions/:regionId` route
   - Added `DELETE /admin/regions/:regionId` route

4. **`docs/COMPLETE_API_REFERENCE.md`**
   - Updated with new endpoints
   - Total endpoints increased from 27 to 31

---

## Data Integrity Features

### Country Deletion
- ✅ Checks for existing affiliate profiles
- ✅ Checks for existing payments
- ✅ Cascades to delete all regions
- ✅ Returns clear error messages

### Region Deletion
- ✅ Checks for existing affiliate profiles
- ✅ Returns clear error messages

### Update Operations
- ✅ Validates that resource exists
- ✅ Only updates provided fields
- ✅ Returns updated resource with relations

---

## Database Relations

### Country Relations
```prisma
model Country {
  regions     Region[]
  affiliates  AffiliateProfile[]
  payments    Payment[]
}
```

When deleting a country:
1. Check if `affiliates` array is empty
2. Check if `payments` array is empty
3. If both empty, delete country (regions cascade automatically)

### Region Relations
```prisma
model Region {
  affiliates  AffiliateProfile[]
}
```

When deleting a region:
1. Check if `affiliates` array is empty
2. If empty, delete region

---

## Testing Checklist

- [x] Update country with all fields
- [x] Update country with partial fields
- [x] Delete country with no dependencies
- [x] Attempt to delete country with affiliates (should fail)
- [x] Attempt to delete country with payments (should fail)
- [x] Update region with name
- [x] Update region with countryId (move to different country)
- [x] Delete region with no affiliates
- [x] Attempt to delete region with affiliates (should fail)
- [x] Verify cascade delete (country deletion removes regions)

---

## Error Handling

All endpoints return standardized error responses:

**Validation Error (400):**
```json
{
  "error": "Country ID is required"
}
```

**Not Found (404):**
```json
{
  "error": "Country not found"
}
```

**Conflict (500):**
```json
{
  "error": "Cannot delete country with existing affiliate profiles"
}
```

---

## Frontend Integration Notes

### Updating a Country
```typescript
const updateCountry = async (countryId: string, data: Partial<Country>) => {
  const response = await fetch(`/api/affiliate/admin/countries/${countryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};
```

### Deleting a Country
```typescript
const deleteCountry = async (countryId: string) => {
  const response = await fetch(`/api/affiliate/admin/countries/${countryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!result.success) {
    // Handle error (e.g., has dependencies)
    throw new Error(result.error);
  }
  
  return result;
};
```

### Updating a Region
```typescript
const updateRegion = async (regionId: string, data: { name?: string; countryId?: string }) => {
  const response = await fetch(`/api/affiliate/admin/regions/${regionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return await response.json();
};
```

### Deleting a Region
```typescript
const deleteRegion = async (regionId: string) => {
  const response = await fetch(`/api/affiliate/admin/regions/${regionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  
  if (!result.success) {
    // Handle error (e.g., has affiliates)
    throw new Error(result.error);
  }
  
  return result;
};
```

---

## Best Practices

1. **Always check for dependencies before deletion**
   - Show warning to user if deletion will cascade
   - Provide option to view dependent records

2. **Provide clear feedback**
   - Show success message after update/delete
   - Display specific error messages (e.g., "Cannot delete: 5 affiliates exist")

3. **Confirm destructive actions**
   - Always show confirmation dialog before deletion
   - Especially for country deletion (cascades to regions)

4. **Handle errors gracefully**
   - Parse error messages from API
   - Show user-friendly messages
   - Provide actionable next steps

---

## Summary

✅ 4 new endpoints added for UPDATE and DELETE operations
✅ Full data integrity checks to prevent orphaned records
✅ Clear error messages for constraint violations
✅ Cascade deletion for country → regions
✅ All TypeScript errors resolved
✅ Documentation updated
✅ Ready for frontend integration

**Total Endpoints: 31** (up from 27)
- Country Management: 4 endpoints (GET, POST, PUT, DELETE)
- Region Management: 4 endpoints (GET, POST, PUT, DELETE)
