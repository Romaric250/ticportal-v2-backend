#!/bin/bash

echo "=========================================="
echo "Commission Tiers Simplification - Migration"
echo "=========================================="
echo ""

echo "⚠️  IMPORTANT: Stop your development server first!"
echo ""
read -p "Press Enter when server is stopped..."
echo ""

echo "1️⃣  Generating Prisma Client..."
npx prisma generate
echo ""

echo "2️⃣  Pushing schema changes to database..."
npx prisma db push
echo ""

echo "=========================================="
echo "✅ Migration Complete!"
echo "=========================================="
echo ""
echo "Summary of Changes:"
echo "  - Removed PREMIUM tier from AffiliateTier enum"
echo "  - Removed VIP tier from AffiliateTier enum"
echo "  - Only STANDARD tier remains"
echo ""
echo "API Changes:"
echo "  - GET /api/affiliate/admin/commission-tiers"
echo "    Returns: { affiliateRate, regionalRate, nationalRate }"
echo ""
echo "  - PUT /api/affiliate/admin/commission-tiers"
echo "    Body: { affiliateRate, regionalRate, nationalRate }"
echo "    (No 'tier' field needed anymore)"
echo ""
echo "You can now restart your development server!"
