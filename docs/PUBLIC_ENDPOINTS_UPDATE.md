# Public Endpoints Update

## Date: February 7, 2026

---

## Change Summary

Added public endpoints for fetching countries and regions to allow unauthenticated access for registration and payment forms.

---

## New Public Endpoints

### 1. Get All Countries

**Endpoint:** `GET /api/affiliate/countries`

**Authentication:** Not required (public)

**Description:** Fetch all active countries with pricing information

**Response:**
```json
{
  "success": true,
  "data": {
    "countries": [
      {
        "id": "cm-001",
        "name": "Cameroon",
        "code": "CM",
        "currency": "XAF",
        "studentPrice": 15000,
        "platformFee": 300,
        "isActive": true
      }
    ]
  }
}
```

**Use Cases:**
- Registration form (country selection)
- Payment form (country and pricing display)
- Currency conversion calculations
- Display available countries to users

---

### 2. Get Regions by Country

**Endpoint:** `GET /api/affiliate/countries/:countryId/regions`

**Authentication:** Not required (public)

**Description:** Fetch all regions for a specific country

**Response:**
```json
{
  "success": true,
  "data": {
    "regions": [
      {
        "id": "region-001",
        "name": "Centre",
        "code": "CE",
        "countryId": "cm-001",
        "isActive": true
      },
      {
        "id": "region-002",
        "name": "Littoral",
        "code": "LT",
        "countryId": "cm-001",
        "isActive": true
      }
    ]
  }
}
```

**Use Cases:**
- Registration form (region selection)
- Affiliate profile creation (region assignment)
- Location-based features
- Regional coordinator assignment

---

## Migration from Admin Routes

### Before (Admin Only)
```typescript
// Required authentication and ADMIN role
GET /api/affiliate/admin/countries
GET /api/affiliate/admin/countries/:countryId/regions
```

### After (Public + Admin)
```typescript
// Public - no authentication required
GET /api/affiliate/countries
GET /api/affiliate/countries/:countryId/regions

// Admin routes still exist for CRUD operations
POST   /api/affiliate/admin/countries           (Admin only)
PUT    /api/affiliate/admin/countries/:id       (Admin only)
DELETE /api/affiliate/admin/countries/:id       (Admin only)
POST   /api/affiliate/admin/regions              (Admin only)
PUT    /api/affiliate/admin/regions/:id          (Admin only)
DELETE /api/affiliate/admin/regions/:id          (Admin only)
```

---

## Implementation Details

### Routes (`src/modules/affiliate/routes.ts`)

Added public routes at the top of the router:

```typescript
/**
 * Public Routes
 */
// Validate referral code (public for registration flow)
router.get('/validate/:referralCode', affiliateController.validateReferralCode);

// Get all countries (public for registration/payment forms)
router.get('/countries', affiliateController.getCountries);

// Get regions by country (public for registration/payment forms)
router.get('/countries/:countryId/regions', affiliateController.getRegionsByCountry);
```

### Controller (`src/modules/affiliate/controller.ts`)

The existing `getCountries()` and `getRegionsByCountry()` methods now serve both:
- Public users (no authentication)
- Admin users (authenticated)

No changes required to controller or service logic.

---

## Frontend Integration

### Example: Fetch Countries on Page Load

```typescript
// No authentication token needed
const response = await fetch('https://api.ticsummit.com/api/affiliate/countries');
const data = await response.json();

if (data.success) {
  const countries = data.data.countries;
  // Populate country dropdown
  countries.forEach(country => {
    console.log(`${country.name}: ${country.studentPrice} ${country.currency}`);
  });
}
```

### Example: Fetch Regions When Country Selected

```typescript
const countryId = 'cm-001';
const response = await fetch(`https://api.ticsummit.com/api/affiliate/countries/${countryId}/regions`);
const data = await response.json();

if (data.success) {
  const regions = data.data.regions;
  // Populate region dropdown
  regions.forEach(region => {
    console.log(region.name);
  });
}
```

### Example: Registration Form Flow

```typescript
// 1. Load countries on page load
useEffect(() => {
  fetchCountries();
}, []);

// 2. When user selects country, load regions
const handleCountryChange = (countryId) => {
  fetchRegions(countryId);
};

// 3. Display pricing based on selected country
const selectedCountry = countries.find(c => c.id === countryId);
console.log(`Price: ${selectedCountry.studentPrice} ${selectedCountry.currency}`);
```

---

## Testing

### cURL Examples

1. **Get all countries:**
   ```bash
   curl -X GET https://api.ticsummit.com/api/affiliate/countries
   ```

2. **Get regions for Cameroon:**
   ```bash
   curl -X GET https://api.ticsummit.com/api/affiliate/countries/cm-001/regions
   ```

3. **Verify no authentication required:**
   ```bash
   # Should work without Authorization header
   curl -X GET https://api.ticsummit.com/api/affiliate/countries
   ```

### Expected Responses

✅ **Success:** Status 200 with country/region data  
✅ **No authentication required:** Works without Bearer token  
✅ **Only active records:** Returns only `isActive: true` records  

---

## Benefits

1. ✅ **Improved UX:** Users can see countries/regions without logging in
2. ✅ **Simplified Frontend:** No need to manage auth tokens for public data
3. ✅ **Better Performance:** Fewer authenticated requests
4. ✅ **SEO Friendly:** Public data can be crawled/indexed
5. ✅ **Mobile App Ready:** Easier to implement in mobile apps

---

## Security Considerations

### Safe to Make Public

✅ **Countries and regions are non-sensitive data**
- No personal information exposed
- Only shows active countries/regions
- No pricing manipulation possible (read-only)
- Admin CRUD operations still protected

### Protected Operations

🔒 **Admin operations remain secure:**
- Creating countries/regions (Admin only)
- Updating countries/regions (Admin only)
- Deleting countries/regions (Admin only)
- Changing pricing (Admin only)

---

## Backward Compatibility

✅ **Fully backward compatible:**
- Existing admin routes still work
- No breaking changes to API contracts
- Frontend can migrate gradually
- Admin dashboard unaffected

---

## Related Documentation

- [Payment & Fapshi Integration](./PAYMENT_FAPSHI_INTEGRATION.md)
- [Complete API Reference](./COMPLETE_API_REFERENCE.md)
- [Affiliate System API](./FINAL_AFFILIATE_API.md)

---

## Summary

Two new public endpoints added for countries and regions:

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/affiliate/countries` | GET | Public | List all countries |
| `/api/affiliate/countries/:id/regions` | GET | Public | List regions by country |

These endpoints enable registration and payment forms to load location data without authentication.

---

**Last Updated:** February 7, 2026  
**Status:** ✅ Implemented and Documented
