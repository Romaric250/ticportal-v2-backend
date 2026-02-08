# Commission Tiers Simplification

## Changes Made

### ✅ Removed PREMIUM and VIP Tiers
The system now only supports the **STANDARD** commission tier for simplicity.

---

## Updated Schema

### Before (3 tiers):
```prisma
enum AffiliateTier {
  STANDARD
  PREMIUM
  VIP
}
```

### After (1 tier):
```prisma
enum AffiliateTier {
  STANDARD
}
```

---

## API Changes

### GET `/api/affiliate/admin/commission-tiers`

**Before Response:**
```json
{
  "success": true,
  "data": {
    "standard": {
      "affiliateRate": 0.09,
      "regionalRate": 0.06,
      "nationalRate": 0.05
    },
    "premium": {
      "affiliateRate": 0.12,
      "regionalRate": 0.08,
      "nationalRate": 0.06
    },
    "vip": {
      "affiliateRate": 0.15,
      "regionalRate": 0.10,
      "nationalRate": 0.08
    }
  }
}
```

**After Response (Simplified):**
```json
{
  "success": true,
  "data": {
    "affiliateRate": 0.09,
    "regionalRate": 0.06,
    "nationalRate": 0.05
  }
}
```

---

### PUT `/api/affiliate/admin/commission-tiers`

**Before Request:**
```json
{
  "tier": "STANDARD",
  "affiliateRate": 0.10,
  "regionalRate": 0.06,
  "nationalRate": 0.05
}
```

**After Request (No tier field needed):**
```json
{
  "affiliateRate": 0.10,
  "regionalRate": 0.06,
  "nationalRate": 0.05
}
```

---

## Default Commission Rates

### STANDARD Tier (Only Tier)
| Role | Default Rate | Percentage |
|------|--------------|------------|
| **Affiliate** | 0.09 | 9% |
| **Regional Coordinator** | 0.06 | 6% |
| **National Coordinator** | 0.05 | 5% |

**Total:** 20% of the commissionable amount

---

## Example Usage

### Get Current Commission Rates
```bash
curl -X GET "http://localhost:5000/api/affiliate/admin/commission-tiers" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "affiliateRate": 0.09,
    "regionalRate": 0.06,
    "nationalRate": 0.05
  }
}
```

### Update Commission Rates
```bash
curl -X PUT "http://localhost:5000/api/affiliate/admin/commission-tiers" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "affiliateRate": 0.10,
    "regionalRate": 0.07,
    "nationalRate": 0.05
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "affiliateRate": 0.10,
    "regionalRate": 0.07,
    "nationalRate": 0.05
  }
}
```

---

## Validation Rules

1. ✅ All rates must be between 0 and 1 (0% to 100%)
2. ✅ Total of all rates cannot exceed 1 (100%)
3. ✅ All three rates are required (affiliateRate, regionalRate, nationalRate)

---

## Migration Required

After making these changes, you need to run Prisma migration:

```bash
npx prisma generate
npx prisma db push
```

Or if using the Prisma migrate tool:

```bash
npx prisma migrate dev --name remove-premium-vip-tiers
```

---

## Files Modified

1. ✅ `prisma/schema.prisma` - Removed PREMIUM and VIP from AffiliateTier enum
2. ✅ `src/modules/affiliate/service.ts` - Simplified tier logic to single STANDARD tier
3. ✅ `src/modules/affiliate/controller.ts` - Removed tier parameter from update request

---

## Benefits

- ✨ **Simpler API** - No need to specify tier when updating rates
- ✨ **Less Confusion** - Only one set of commission rates to manage
- ✨ **Easier Frontend** - No tier selection dropdown needed
- ✨ **Cleaner Code** - Removed unnecessary tier switching logic
