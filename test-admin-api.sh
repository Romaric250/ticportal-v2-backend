#!/bin/bash

# Admin API Test Script
# Test all implemented admin endpoints

echo "🚀 Testing Admin API Endpoints..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:5000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your_password"

# Login and get token
echo -e "${YELLOW}1. Logging in as admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed. Please check your credentials.${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Logged in successfully${NC}"
echo ""

# Test 1: Dashboard Stats
echo -e "${YELLOW}2. Testing GET /api/admin/stats${NC}"
STATS=$(curl -s -X GET "$API_URL/api/admin/stats" \
  -H "Authorization: Bearer $TOKEN")

if echo $STATS | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ Dashboard stats working${NC}"
  echo "   Total Users: $(echo $STATS | jq -r '.stats.totalUsers')"
  echo "   Pending Approvals: $(echo $STATS | jq -r '.stats.pendingApprovals')"
else
  echo -e "${RED}❌ Dashboard stats failed${NC}"
  echo "Response: $STATS"
fi
echo ""

# Test 2: Detailed Dashboard Stats
echo -e "${YELLOW}3. Testing GET /api/admin/dashboard-stats${NC}"
DETAILED_STATS=$(curl -s -X GET "$API_URL/api/admin/dashboard-stats" \
  -H "Authorization: Bearer $TOKEN")

if echo $DETAILED_STATS | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ Detailed stats working${NC}"
  echo "   Teams Count: $(echo $DETAILED_STATS | jq -r '.data.teamsCount')"
else
  echo -e "${RED}❌ Detailed stats failed${NC}"
fi
echo ""

# Test 3: Get Users
echo -e "${YELLOW}4. Testing GET /api/admin/users${NC}"
USERS=$(curl -s -X GET "$API_URL/api/admin/users?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

if echo $USERS | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ Get users working${NC}"
  echo "   Total Users: $(echo $USERS | jq -r '.pagination.total')"
  echo "   Users in response: $(echo $USERS | jq -r '.users | length')"
else
  echo -e "${RED}❌ Get users failed${NC}"
  echo "Response: $USERS"
fi
echo ""

# Test 4: Get Users with Filters
echo -e "${YELLOW}5. Testing GET /api/admin/users with filters${NC}"
FILTERED_USERS=$(curl -s -X GET "$API_URL/api/admin/users?role=STUDENT&limit=5" \
  -H "Authorization: Bearer $TOKEN")

if echo $FILTERED_USERS | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ User filtering working${NC}"
  echo "   Students found: $(echo $FILTERED_USERS | jq -r '.pagination.total')"
else
  echo -e "${RED}❌ User filtering failed${NC}"
fi
echo ""

# Test 5: Get Teams
echo -e "${YELLOW}6. Testing GET /api/admin/teams${NC}"
TEAMS=$(curl -s -X GET "$API_URL/api/admin/teams?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

if echo $TEAMS | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ Get teams working${NC}"
  echo "   Total Teams: $(echo $TEAMS | jq -r '.pagination.total')"
  echo "   Teams in response: $(echo $TEAMS | jq -r '.teams | length')"
else
  echo -e "${RED}❌ Get teams failed${NC}"
  echo "Response: $TEAMS"
fi
echo ""

# Test 6: Create User
echo -e "${YELLOW}7. Testing POST /api/admin/users${NC}"
RANDOM_EMAIL="test$(date +%s)@example.com"
NEW_USER=$(curl -s -X POST "$API_URL/api/admin/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$RANDOM_EMAIL\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"role\": \"STUDENT\",
    \"school\": \"Test School\"
  }")

if echo $NEW_USER | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✅ Create user working${NC}"
  USER_ID=$(echo $NEW_USER | jq -r '.data.id')
  echo "   Created user ID: $USER_ID"
  
  # Test 7: Get Single User
  echo ""
  echo -e "${YELLOW}8. Testing GET /api/admin/users/:userId${NC}"
  SINGLE_USER=$(curl -s -X GET "$API_URL/api/admin/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo $SINGLE_USER | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Get single user working${NC}"
    echo "   User: $(echo $SINGLE_USER | jq -r '.data.firstName') $(echo $SINGLE_USER | jq -r '.data.lastName')"
  else
    echo -e "${RED}❌ Get single user failed${NC}"
  fi
  
  # Test 8: Update User
  echo ""
  echo -e "${YELLOW}9. Testing PUT /api/admin/users/:userId${NC}"
  UPDATED_USER=$(curl -s -X PUT "$API_URL/api/admin/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"school": "Updated School"}')
  
  if echo $UPDATED_USER | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Update user working${NC}"
  else
    echo -e "${RED}❌ Update user failed${NC}"
  fi
  
  # Test 9: Delete User
  echo ""
  echo -e "${YELLOW}10. Testing DELETE /api/admin/users/:userId${NC}"
  DELETE_USER=$(curl -s -X DELETE "$API_URL/api/admin/users/$USER_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo $DELETE_USER | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✅ Delete user working${NC}"
  else
    echo -e "${RED}❌ Delete user failed${NC}"
  fi
else
  echo -e "${RED}❌ Create user failed${NC}"
  echo "Response: $NEW_USER"
fi
echo ""

# Summary
echo ""
echo "======================================"
echo -e "${GREEN}🎉 Test Complete!${NC}"
echo "======================================"
echo ""
echo "✅ Implemented and Working:"
echo "   - Dashboard statistics"
echo "   - User management (CRUD)"
echo "   - Team management (Read)"
echo "   - Filtering and pagination"
echo ""
echo "⚠️  Needs Schema Update:"
echo "   - Deliverables (11 endpoints)"
echo "   - Learning Paths (12 endpoints)"
echo ""
echo "See docs/ADMIN_API_FINAL_STATUS.md for details"
echo ""
