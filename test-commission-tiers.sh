#!/bin/bash

# Test script for commission tiers endpoints
# Make sure you replace YOUR_ADMIN_TOKEN with a valid admin JWT token

API_URL="http://localhost:5000"
ADMIN_TOKEN="YOUR_ADMIN_TOKEN"

echo "========================================"
echo "Testing Commission Tiers Endpoints"
echo "========================================"
echo ""

# Test 1: GET Commission Tiers
echo "1️⃣  Testing GET /api/affiliate/admin/commission-tiers"
echo "----------------------------------------"
curl -X GET "$API_URL/api/affiliate/admin/commission-tiers" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'
echo ""
echo ""

# Test 2: UPDATE Commission Tiers
echo "2️⃣  Testing PUT /api/affiliate/admin/commission-tiers"
echo "----------------------------------------"
curl -X PUT "$API_URL/api/affiliate/admin/commission-tiers" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "STANDARD",
    "affiliateRate": 0.15,
    "regionalRate": 0.05,
    "nationalRate": 0.03
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'
echo ""
echo ""

echo "========================================"
echo "✅ Tests Complete!"
echo "========================================"
echo ""
echo "Expected Results:"
echo "  - Status codes should be 200 (not 401)"
echo "  - No 'Unauthorized' errors"
echo "  - Commission tier data should be returned/updated"
