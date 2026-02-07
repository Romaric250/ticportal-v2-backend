# Frontend Integration Guide - Affiliate & Payment System

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [User Registration with Referrals](#user-registration-with-referrals)
5. [Payment Flow](#payment-flow)
6. [Affiliate Dashboard](#affiliate-dashboard)
7. [Regional Coordinator Dashboard](#regional-coordinator-dashboard)
8. [National Coordinator Dashboard](#national-coordinator-dashboard)
9. [Admin Panel](#admin-panel)
10. [API Endpoints Reference](#api-endpoints-reference)
11. [TypeScript Types](#typescript-types)
12. [UI/UX Guidelines](#uiux-guidelines)
13. [Error Handling](#error-handling)
14. [Testing](#testing)
15. [FAQ - Link-Based Referral System](#faq---link-based-referral-system)

---

## Overview

The TiC Summit Training Portal includes a comprehensive affiliate marketing system with:
- **Hierarchical Structure**: Country → Region → Affiliate
- **Three-Tier Commissions**: Affiliate (9%), Regional (6%), National (5%)
- **Payment Integration**: Fapshi (MTN & Orange Mobile Money)
- **Role-Based Dashboards**: Different views for each role
- **Link-Only Referral System**: No manual code entry required!

### 🚀 Key Feature: Link-Based Referral System

**🔗 Referrals are applied during PAYMENT, not registration!**

Our referral system is **100% link-based** for a seamless user experience:

✅ **User registers normally** → No referral code needed  
✅ **Affiliate shares payment link**: `https://portal.ticsummit.org/pay?ref=TIC-ABC-2026`  
✅ **User clicks payment link** → Code automatically extracted from URL  
✅ **User completes payment** → Commissions created automatically  

❌ **No referral code during registration**  
❌ **No "Enter your referral code" prompt**  
❌ **No copy-paste frustration**

**Why Link-Only Payment Referrals?**
- **Simpler UX**: One click to payment with referral already applied
- **Fewer errors**: No typos or invalid codes
- **Higher conversion**: Less friction = more payments
- **Automatic tracking**: Everything happens behind the scenes
- **Flexible**: Users can register first, pay later with any affiliate link

**For Direct Payment** (no affiliate):  
Users simply visit `https://portal.ticsummit.org/pay` directly. No referral link, no commissions - that's perfectly fine!

---

### 📊 Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    REFERRAL PAYMENT FLOW                         │
└─────────────────────────────────────────────────────────────────┘

STEP 1: USER REGISTERS (No Referral Needed!)
│
├─> User visits: https://portal.ticsummit.org/register
│
├─> Fill registration form:
│   - First Name, Last Name
│   - Email, Password
│   - Phone Number
│   ❌ NO referral code field!
│
├─> Submit → POST /api/auth/register
│   Payload: { ...userData }  (NO referralCode)
│
├─> Success → User account created
│
└─> Redirect to: "Complete Payment" page


STEP 2: AFFILIATE SHARES PAYMENT LINK
│
├─> Affiliate Dashboard: Copy payment referral link
│   Link: https://portal.ticsummit.org/pay?ref=TIC-ABC-2026
│
├─> Share via WhatsApp, email, social media, SMS, etc.
│
│
STEP 3: USER CLICKS PAYMENT LINK (With Referral)
│
├─> Browser opens: https://portal.ticsummit.org/pay?ref=TIC-ABC-2026
│
├─> Frontend extracts: ref = "TIC-ABC-2026"
│   (Automatic, no user action needed!)
│
├─> [OPTIONAL] Validate code & show banner:
│   "🎉 Payment via John Doe (Littoral, Cameroon)"
│
│
STEP 4: USER COMPLETES PAYMENT
│
├─> Select country
│
├─> Enter phone number (auto-detect MTN/Orange)
│
├─> Click "Pay Now" → POST /api/payment/initiate
│   Payload: { phoneNumber, amount, countryId, referralCode: "TIC-ABC-2026" }
│   ↑ Referral code from URL is included here!
│
├─> USSD push sent to phone
│
├─> User approves payment on phone
│
├─> Frontend polls status → GET /api/payment/:id/status
│
├─> Payment confirmed!
│
│
STEP 5: COMMISSIONS CREATED
│
├─> Backend automatically:
│   ✓ Creates affiliate commission (9%)
│   ✓ Creates regional commission (6%)
│   ✓ Creates national commission (5%)
│   ✓ Sends email notifications
│   ✓ Updates dashboards
│
└─> User activated, affiliate earns commission!


┌─────────────────────────────────────────────────────────────────┐
│                   DIRECT PAYMENT FLOW (No Referral)              │
└─────────────────────────────────────────────────────────────────┘

STEP 1: USER REGISTERS
│
├─> User visits: https://portal.ticsummit.org/register
│
├─> Fill registration form
│
├─> Submit → POST /api/auth/register
│
├─> Success → User account created
│
└─> Redirect to payment page


STEP 2: USER PAYS DIRECTLY (No Referral Link)
│
├─> User visits: https://portal.ticsummit.org/pay
│   (No ?ref parameter)
│
├─> Frontend extracts: ref = null
│
├─> Complete payment form
│
├─> Click "Pay Now" → POST /api/payment/initiate
│   Payload: { phoneNumber, amount, countryId }  (NO referralCode)
│
├─> Payment confirmed!
│
│
NO COMMISSIONS CREATED
│
└─> User activated, no affiliate attribution
```

**🔑 Key Difference:**
- **Registration**: Always free, no referral code needed
- **Payment**: This is where referral links are used!
  - Affiliate shares: `https://portal.ticsummit.org/pay?ref=TIC-ABC-2026`
  - User clicks link → Referral automatically applied to payment
  - Commissions created after successful payment

---

## System Architecture

### User Roles

```
┌─────────────────────────────────────────────────┐
│                    ADMIN                         │
│  (Manages countries, regions, roles, payouts)   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           NATIONAL COORDINATOR                   │
│  (Oversees all regions in a country)            │
│  Commission: 5% per student                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           REGIONAL COORDINATOR                   │
│  (Manages affiliates in a region)               │
│  Commission: 6% per student                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                 AFFILIATE                        │
│  (Refers students directly)                     │
│  Commission: 9% per student                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                  STUDENT                         │
│  (Pays 5,300 XAF for training)                  │
└─────────────────────────────────────────────────┘
```

### Registration Flow Types

```
1. NORMAL REGISTRATION (Always the same!)
   User visits: https://portal.ticsummit.org/register
   → Fill form (Name, Email, Password, Phone)
   → Submit registration
   → Account created
   → Redirect to payment page
   ❌ NO referral code during registration!
   
2. DIRECT PAYMENT (No Referral)
   User visits: https://portal.ticsummit.org/pay
   → No referral parameter in URL
   → Complete payment
   → No commissions created
   
3. AFFILIATE PAYMENT (Via Referral Link Only)
   User clicks affiliate's payment link: https://portal.ticsummit.org/pay?ref=TIC-ABC-2026
   → Referral code automatically extracted from URL
   → No manual code entry needed - it's all automatic!
   → Payment completed
   → Commissions created automatically
```

**🔥 Important**: Users **never** manually enter referral codes. Referral codes are applied during **PAYMENT**, not registration!

---

## Authentication & Authorization

### Base URL
```
Production: https://api.ticsummit.org
Development: http://localhost:5000
```

### Headers
All authenticated requests must include:
```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

### Token Management
```typescript
// Store tokens after login
localStorage.setItem('accessToken', response.data.accessToken);
localStorage.setItem('refreshToken', response.data.refreshToken);

// Retrieve for API calls
const token = localStorage.getItem('accessToken');

// Clear on logout
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

---

## User Registration with Referrals

### � Registration is Simple - No Referrals Here!

**Important**: Referral codes are **NOT** used during registration. They are applied during **payment** only.

**Registration Process:**
1. User fills out registration form (Name, Email, Password, Phone)
2. User submits registration
3. Account is created
4. User is redirected to payment page

**No referral code needed!**

---

### Registration Implementation

#### Step 1: Display Registration Form

Simple registration form with basic user information:

```typescript
function RegistrationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: ''
    // ❌ NO referralCode field!
  });
  
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>
      
      {/* Registration Form - NO referral code input! */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        />
        
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        />
        
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
        />
        
        {/* ❌ NO referral code input field! */}
        
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
```

#### Step 2: Submit Registration

**Endpoint**: `POST /api/auth/register`

**Payload**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "237650495499"
}
```

**❌ NO referralCode in payload!**

**Complete Registration Example**:
```typescript
async function handleRegistration(formData: RegistrationFormData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData) // No referralCode!
    });
    
    if (!response.ok) throw new Error('Registration failed');
    
    const data = await response.json();
    // Store tokens
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    // Redirect to payment page
    window.location.href = '/pay';
  } catch (error) {
    console.error('Registration error:', error);
    showNotification('Registration failed. Please try again.', 'error');
  }
}
```

**🎯 Key Point**: Registration is simple and straightforward. Referral attribution happens later during payment!

---

## Payment Flow

### Overview

**🔥 THIS IS WHERE REFERRALS HAPPEN!**

Users pay through Fapshi (MTN or Orange Mobile Money) after registration. **The payment link is where the referral code is applied!**

**Payment Flow:**

1. **User registers** (no referral code involved)
2. **Affiliate shares payment link**: `currentdomain/pay?ref=TIC-ABC-2026`
3. **User clicks payment link** (or visits `/pay` directly without referral)
4. **Frontend extracts referral code from URL** (if present)
5. **User selects country, enters phone number**
6. **System auto-detects payment provider** (MTN/Orange)
7. **Initiate payment with referral code** → USSD push sent to phone
8. **User approves on phone**
9. **Frontend polls status** until confirmed
10. **Success** → User activated + Commissions created (if referred)

**🔗 Referral Link Integration**: 
- Affiliate shares: e.g `https://portal.ticsummit.org/pay?ref=TIC-ABC-2026`
- User clicks link → Referral code extracted from URL
- Frontend passes `referralCode` to payment API
- Backend creates referral record and commissions after successful payment

### Step 1: Get Payment Methods

**Endpoint**: `GET /api/payment/methods`

**Response**: List of supported methods (MTN, Orange) with logos and phone prefixes

### Step 2: Extract Referral Code from Payment URL

**This is where referral codes are captured!**

```typescript
// React/Next.js example
import { useSearchParams } from 'next/navigation';

function PaymentPage() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref'); // Gets "TIC-ABC-2026" or null
  
  // Store referral code in state
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    amount: 5300,
    countryId: '',
    referralCode: referralCode || null // Captured from URL
  });
  
  // If referral code exists, optionally validate and show banner
  useEffect(() => {
    if (referralCode) {
      validateAndShowReferralInfo(referralCode);
    }
  }, [referralCode]);
}
```

```typescript
// Vanilla JavaScript example
function getReferralCodeFromPaymentURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
}

// Usage on payment page load
const referralCode = getReferralCodeFromPaymentURL();
console.log('Payment referral code:', referralCode); // "TIC-ABC-2026" or null
```

### Step 3: Validate Referral Code (Optional but Recommended)

Call `GET /api/affiliate/validate/:code` to verify and show affiliate info:

```typescript
async function validateReferralCode(code: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/affiliate/validate/${code}`);
    const data = await response.json();
    
    if (data.success && data.data.valid) {
      return data.data; // { valid: true, affiliateName: "...", ... }
    }
    return null;
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
}
```

**Display Referral Banner on Payment Page**:
```tsx
{referralCode && referralInfo?.valid && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
      <div>
        <p className="text-sm font-medium text-green-800">
          Payment via referral
        </p>
        <p className="text-sm text-green-700">
          Referred by: {referralInfo.affiliateName} ({referralInfo.regionName}, {referralInfo.countryName})
        </p>
      </div>
    </div>
  </div>
)}
```

### Step 4: Detect Payment Method

**Endpoint**: `POST /api/payment/detect-method`

**Payload**: `{ "phoneNumber": "237650495499" }`

**Response**: `{ "success": true, "data": { "method": "MTN" } }`

Auto-detect when phone number reaches 12 digits (237XXXXXXXXX)

### Step 5: Display Payment Form

Show:
- Country dropdown (with prices)
- Phone number input (with auto-detection)
- Detected payment method badge
- **Referral banner** (if referral code is valid from URL)
- Pay button

### Step 6: Initiate Payment (**THIS IS WHERE REFERRAL CODE IS USED!**)

**Endpoint**: `POST /api/payment/initiate`

**Headers**: `Authorization: Bearer <token>`

**Payload**:
```json
{
  "phoneNumber": "237650495499",
  "amount": 5300,
  "countryId": "xxx-xxx-xxx",
  "referralCode": "TIC-ABC-2026"  // ← FROM PAYMENT URL (?ref parameter)
}
```

**🔥 IMPORTANT**: Pass the `referralCode` from the payment URL here! This is where referral attribution happens.

**Response**:
```json
{
  "success": true,
  "data": {
    "paymentId": "xxx",
    "paymentReference": "TIC-123456",
    "fapshiTransId": "FAPSHI-123",
    "amount": 5300,
    "status": "PENDING"
  }
}
```

**Complete Payment Initiation Example**:
```typescript
async function initiatePayment(
  phoneNumber: string, 
  amount: number, 
  countryId: string,
  referralCode: string | null // From payment URL
) {
  const token = localStorage.getItem('accessToken');
  
  try {
    const payload: any = {
      phoneNumber,
      amount,
      countryId
    };
    
    // Include referralCode if present (from payment URL)
    if (referralCode) {
      payload.referralCode = referralCode;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/payment/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error('Payment initiation failed');
    
    const data = await response.json();
    return data.data; // { paymentId, paymentReference, ... }
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}

// Usage on payment page
const referralCodeFromURL = getReferralCodeFromPaymentURL(); // Get from URL
const result = await initiatePayment(phoneNumber, amount, countryId, referralCodeFromURL);
```

### Step 7: Poll Payment Status

**Endpoint**: `GET /api/payment/:paymentId/status`

Poll every 3 seconds for up to 5 minutes.

**Response statuses**:
- `PENDING` - Keep polling
- `CONFIRMED` - Success! Redirect to dashboard
- `FAILED` - Show error, offer retry

### Step 8: Handle Results

**Success**: Show confirmation, redirect to dashboard after 2 seconds

**Failure**: Show error details, troubleshooting tips, and "Try Again" button

**Timeout**: Show message, link to payment history

---

**🎯 Payment Referral Summary:**
1. Affiliate shares payment link: `https://portal.ticsummit.org/pay?ref=TIC-ABC-2026`
2. User clicks link
3. Frontend extracts `ref` parameter from URL
4. User completes payment form
5. Frontend sends referral code to payment API
6. Backend creates referral record and commissions after successful payment

---

## Affiliate Dashboard

### Get Affiliate Dashboard Data

```typescript
interface AffiliateDashboard {
  profile: {
    id: string;
    userId: string;
    referralCode: string;
    referralLink: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    totalReferrals: number;
    activeReferrals: number;
    totalEarned: number;
    availableBalance: number;
    region: {
      id: string;
      name: string;
      country: {
        id: string;
        name: string;
        currency: string;
      };
    };
  };
  stats: {
    totalReferrals: number;
    pendingReferrals: number;
    paidReferrals: number;
    activatedReferrals: number;
    totalEarnings: number;
    pendingEarnings: number;
    earnedCommissions: number;
    approvedCommissions: number;
    paidCommissions: number;
  };
  recentReferrals: Array<{
    id: string;
    student: {
      firstName: string;
      lastName: string;
      email: string;
    };
    status: string;
    createdAt: string;
    payment: {
      amount: number;
      status: string;
    };
  }>;
  recentCommissions: Array<{
    id: string;
    amount: number;
    status: string;
    earnedAt: string;
    coolingPeriodEnds: string;
  }>;
}

async function getAffiliateDashboard(token: string): Promise<AffiliateDashboard> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/dashboard`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Dashboard error:', error);
    throw error;
  }
}
```

### Affiliate Dashboard UI

```tsx
function AffiliateDashboard() {
  const [dashboard, setDashboard] = useState<AffiliateDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getAffiliateDashboard(accessToken);
      setDashboard(data);
    } catch (error) {
      showNotification('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!dashboard) return <ErrorMessage />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
        <p className="text-gray-600">
          Track your referrals and earnings
        </p>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        {dashboard.profile.status === 'PENDING' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⏳ Your account is pending activation by an admin
            </p>
          </div>
        )}
        {dashboard.profile.status === 'ACTIVE' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              ✅ Your account is active! Start sharing your referral link
            </p>
          </div>
        )}
        {dashboard.profile.status === 'SUSPENDED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              ⛔ Your account is suspended. Contact support for assistance
            </p>
          </div>
        )}
      </div>

      {/* Referral Link Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Your Payment Referral Link</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={dashboard.profile.referralLink}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-50 border rounded-lg"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(dashboard.profile.referralLink);
              showNotification('Copied to clipboard!', 'success');
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Copy Link
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Code:</strong> {dashboard.profile.referralCode}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Region:</strong> {dashboard.profile.region.name}, {dashboard.profile.region.country.name}
        </p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>How it works:</strong> Share this link with potential students. When they 
            click it and complete their payment, you'll earn 9% commission automatically!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Referrals"
          value={dashboard.stats.totalReferrals}
          icon={<UsersIcon />}
          color="blue"
        />
        <StatCard
          title="Active Referrals"
          value={dashboard.stats.activatedReferrals}
          icon={<CheckIcon />}
          color="green"
        />
        <StatCard
          title="Total Earned"
          value={`${dashboard.stats.totalEarnings} ${dashboard.profile.region.country.currency}`}
          icon={<CurrencyIcon />}
          color="purple"
        />
        <StatCard
          title="Available Balance"
          value={`${dashboard.profile.availableBalance} ${dashboard.profile.region.country.currency}`}
          icon={<WalletIcon />}
          color="green"
        />
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">
            {dashboard.stats.pendingEarnings} XAF
          </p>
          <p className="text-xs text-yellow-700 mt-1">In cooling period</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">Earned</p>
          <p className="text-2xl font-bold text-blue-900">
            {dashboard.stats.earnedCommissions} XAF
          </p>
          <p className="text-xs text-blue-700 mt-1">Awaiting approval</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 font-medium">Paid</p>
          <p className="text-2xl font-bold text-green-900">
            {dashboard.stats.paidCommissions} XAF
          </p>
          <p className="text-xs text-green-700 mt-1">Already received</p>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Referrals</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Student</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentReferrals.map((referral) => (
                <tr key={referral.id} className="border-b">
                  <td className="py-3">
                    {referral.student.firstName} {referral.student.lastName}
                  </td>
                  <td className="py-3">{referral.student.email}</td>
                  <td className="py-3">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="py-3">{referral.payment.amount} XAF</td>
                  <td className="py-3">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Commissions</h2>
        <div className="space-y-3">
          {dashboard.recentCommissions.map((commission) => (
            <div
              key={commission.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{commission.amount} XAF</p>
                <p className="text-sm text-gray-600">
                  Earned: {new Date(commission.earnedAt).toLocaleDateString()}
                </p>
                {commission.status === 'PENDING' && (
                  <p className="text-xs text-yellow-600">
                    Cooling ends: {new Date(commission.coolingPeriodEnds).toLocaleDateString()}
                  </p>
                )}
              </div>
              <StatusBadge status={commission.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Get Affiliate Referrals (Paginated)

```typescript
interface ReferralsResponse {
  referrals: Array<{
    id: string;
    student: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
    status: string;
    payment: {
      amount: number;
      status: string;
      createdAt: string;
    };
    createdAt: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

async function getAffiliateReferrals(
  token: string,
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<ReferralsResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/referrals?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch referrals');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Referrals error:', error);
    throw error;
  }
}
```

### Get Affiliate Commissions (Paginated)

```typescript
interface CommissionsResponse {
  commissions: Array<{
    id: string;
    amount: number;
    percentage: number;
    status: string;
    earnedAt: string;
    coolingPeriodEnds: string;
    approvedAt?: string;
    paidAt?: string;
    referral: {
      student: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

async function getAffiliateCommissions(
  token: string,
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<CommissionsResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/commissions?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch commissions');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Commissions error:', error);
    throw error;
  }
}
```

---

## Regional Coordinator Dashboard

### Get Regional Dashboard Data

```typescript
interface RegionalDashboard {
  profile: {
    id: string;
    userId: string;
    status: 'ACTIVE' | 'INACTIVE';
    totalStudents: number;
    totalEarned: number;
    region: {
      id: string;
      name: string;
      country: {
        id: string;
        name: string;
        currency: string;
      };
    };
  };
  stats: {
    totalAffiliates: number;
    activeAffiliates: number;
    totalStudents: number;
    activeStudents: number;
    totalEarnings: number;
    pendingEarnings: number;
    earnedCommissions: number;
    approvedCommissions: number;
    paidCommissions: number;
  };
  affiliates: Array<{
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    status: string;
    totalReferrals: number;
    activeReferrals: number;
  }>;
  recentCommissions: Array<{
    id: string;
    amount: number;
    status: string;
    earnedAt: string;
  }>;
}

async function getRegionalDashboard(token: string): Promise<RegionalDashboard> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/regional/dashboard`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch regional dashboard');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Regional dashboard error:', error);
    throw error;
  }
}
```

### Regional Dashboard UI

```tsx
function RegionalCoordinatorDashboard() {
  const [dashboard, setDashboard] = useState<RegionalDashboard | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Regional Coordinator Dashboard</h1>
      <p className="text-gray-600 mb-8">
        {dashboard?.profile.region.name}, {dashboard?.profile.region.country.name}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Affiliates"
          value={dashboard?.stats.totalAffiliates}
          subtitle={`${dashboard?.stats.activeAffiliates} active`}
        />
        <StatCard
          title="Total Students"
          value={dashboard?.stats.totalStudents}
          subtitle={`${dashboard?.stats.activeStudents} active`}
        />
        <StatCard
          title="Total Earnings"
          value={`${dashboard?.stats.totalEarnings} XAF`}
        />
        <StatCard
          title="Pending Earnings"
          value={`${dashboard?.stats.pendingEarnings} XAF`}
        />
      </div>

      {/* Affiliates Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Affiliates in Your Region</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Referrals</th>
              <th className="text-left py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.affiliates.map((affiliate) => (
              <tr key={affiliate.id} className="border-b">
                <td className="py-3">
                  {affiliate.user.firstName} {affiliate.user.lastName}
                </td>
                <td className="py-3">{affiliate.user.email}</td>
                <td className="py-3">
                  <StatusBadge status={affiliate.status} />
                </td>
                <td className="py-3">{affiliate.totalReferrals}</td>
                <td className="py-3">{affiliate.activeReferrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Commission Breakdown (similar to affiliate) */}
    </div>
  );
}
```

---

## National Coordinator Dashboard

### Get National Dashboard Data

```typescript
interface NationalDashboard {
  profile: {
    id: string;
    userId: string;
    status: 'ACTIVE' | 'INACTIVE';
    totalStudents: number;
    totalEarned: number;
    country: {
      id: string;
      name: string;
      currency: string;
    };
  };
  stats: {
    totalRegions: number;
    totalRegionalCoordinators: number;
    totalAffiliates: number;
    activeAffiliates: number;
    totalStudents: number;
    activeStudents: number;
    totalEarnings: number;
    pendingEarnings: number;
    earnedCommissions: number;
    approvedCommissions: number;
    paidCommissions: number;
  };
  regions: Array<{
    id: string;
    name: string;
    affiliatesCount: number;
    studentsCount: number;
  }>;
  recentCommissions: Array<{
    id: string;
    amount: number;
    status: string;
    earnedAt: string;
  }>;
}

async function getNationalDashboard(token: string): Promise<NationalDashboard> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/national/dashboard`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch national dashboard');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('National dashboard error:', error);
    throw error;
  }
}
```

---

## Admin Panel

### Create Country

```typescript
interface CreateCountryParams {
  name: string;
  code: string; // ISO code (e.g., "CM" for Cameroon)
  currency: string; // e.g., "XAF"
  studentPrice: number; // e.g., 5300
  platformFee: number; // e.g., 300
  affiliateCommissionRate: number; // e.g., 9
  regionalCommissionRate: number; // e.g., 6
  nationalCommissionRate: number; // e.g., 5
}

async function createCountry(
  params: CreateCountryParams,
  token: string
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/admin/countries`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create country');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Create country error:', error);
    throw error;
  }
}
```

### Get Countries

```typescript
async function getCountries(token: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/admin/countries`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fetch countries error:', error);
    throw error;
  }
}
```

### Create Region

```typescript
interface CreateRegionParams {
  name: string;
  countryId: string;
  code: string; // e.g., "LT" for Littoral
}

async function createRegion(
  params: CreateRegionParams,
  token: string
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/admin/regions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create region');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Create region error:', error);
    throw error;
  }
}
```

### Update User Role

```typescript
interface UpdateUserRoleParams {
  userId: string;
  newRole: 'AFFILIATE' | 'REGIONAL_COORDINATOR' | 'NATIONAL_COORDINATOR';
  regionId?: string; // Required for AFFILIATE and REGIONAL_COORDINATOR
  countryId?: string; // Required for NATIONAL_COORDINATOR
}

async function updateUserRole(
  params: UpdateUserRoleParams,
  token: string
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/admin/users/role`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user role');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Update user role error:', error);
    throw error;
  }
}
```

### Activate Affiliate

```typescript
async function activateAffiliate(
  affiliateId: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate/admin/affiliates/${affiliateId}/activate`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to activate affiliate');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Activate affiliate error:', error);
    throw error;
  }
}
```

---

## API Endpoints Reference

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/affiliate/validate/:referralCode` | Validate referral code | No |
| GET | `/api/payment/methods` | Get supported payment methods | No |
| POST | `/api/payment/detect-method` | Detect payment method from phone | No |
| POST | `/api/payment/webhook/fapshi` | Fapshi webhook handler | No (Signature verified) |

### Student Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payment/initiate` | Initiate payment | Yes (Student) |
| GET | `/api/payment/:paymentId/status` | Check payment status | Yes (Student) |
| GET | `/api/payment/history` | Get payment history | Yes (Student) |

### Affiliate Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/affiliate/dashboard` | Get affiliate dashboard | Yes (Affiliate) |
| GET | `/api/affiliate/referrals` | Get affiliate referrals | Yes (Affiliate) |
| GET | `/api/affiliate/commissions` | Get affiliate commissions | Yes (Affiliate) |

### Regional Coordinator Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/affiliate/regional/dashboard` | Get regional dashboard | Yes (Regional) |

### National Coordinator Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/affiliate/national/dashboard` | Get national dashboard | Yes (National) |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/affiliate/admin/countries` | Create country | Yes (Admin) |
| GET | `/api/affiliate/admin/countries` | List countries | Yes (Admin) |
| POST | `/api/affiliate/admin/regions` | Create region | Yes (Admin) |
| GET | `/api/affiliate/admin/countries/:countryId/regions` | Get regions | Yes (Admin) |
| PUT | `/api/affiliate/admin/users/role` | Update user role | Yes (Admin) |
| PATCH | `/api/affiliate/admin/affiliates/:affiliateId/activate` | Activate affiliate | Yes (Admin) |
| POST | `/api/payment/:paymentId/verify` | Manually verify payment | Yes (Admin) |

---

## TypeScript Types

```typescript
// User Roles
export type UserRole = 
  | 'STUDENT'
  | 'AFFILIATE'
  | 'REGIONAL_COORDINATOR'
  | 'NATIONAL_COORDINATOR'
  | 'ADMIN';

// Payment Status
export type PaymentStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'REFUNDED';

// Commission Status
export type CommissionStatus =
  | 'PENDING'
  | 'EARNED'
  | 'APPROVED'
  | 'LOCKED'
  | 'PAID'
  | 'CANCELLED';

// Referral Status
export type ReferralStatus =
  | 'PENDING'
  | 'PAID'
  | 'ACTIVATED'
  | 'CANCELLED';

// Country
export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  studentPrice: number;
  platformFee: number;
  affiliateCommissionRate: number;
  regionalCommissionRate: number;
  nationalCommissionRate: number;
  createdAt: string;
  updatedAt: string;
}

// Region
export interface Region {
  id: string;
  name: string;
  code: string;
  countryId: string;
  country?: Country;
  createdAt: string;
  updatedAt: string;
}

// Payment
export interface Payment {
  id: string;
  userId: string;
  countryId: string;
  amount: number;
  platformFee: number;
  commissionableAmount: number;
  paymentReference: string;
  paymentMethod: string;
  paymentProvider: string;
  status: PaymentStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// Affiliate Profile
export interface AffiliateProfile {
  id: string;
  userId: string;
  regionId: string;
  referralCode: string;
  referralLink: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  availableBalance: number;
  createdAt: string;
  updatedAt: string;
}

// Student Referral
export interface StudentReferral {
  id: string;
  studentId: string;
  affiliateId: string;
  regionId: string;
  countryId: string;
  referralCode: string;
  paymentId: string;
  status: ReferralStatus;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Commission
export interface Commission {
  id: string;
  userId: string;
  referralId: string;
  type: 'AFFILIATE' | 'REGIONAL' | 'NATIONAL';
  baseAmount: number;
  percentage: number;
  commissionAmount: number;
  status: CommissionStatus;
  earnedAt: string;
  coolingPeriodEnds: string;
  approvedAt?: string;
  approvedBy?: string;
  paidAt?: string;
  payoutBatchId?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## UI/UX Guidelines

### 🎨 Registration Page Design (Simple - No Referral)

**Registration is always the same - no referral codes involved!**

```
┌─────────────────────────────────────────────────────────────┐
│                    TiC Summit Portal                         │
│                   Create Your Account                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  First Name    [________________]                            │
│                                                               │
│  Last Name     [________________]                            │
│                                                               │
│  Email         [________________]                            │
│                                                               │
│  Password      [________________]                            │
│                                                               │
│  Phone Number  [________________]                            │
│                                                               │
│  ❌ NO REFERRAL CODE FIELD!                                 │
│                                                               │
│           [ Create Account ]                                 │
│                                                               │
│  Already have an account? Sign in                            │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ✅ Registration form is always the same
- ❌ Never show a "Enter referral code" field
- ❌ Never prompt users to type/paste codes
- 💡 Referrals happen during **payment**, not registration!

---

### 🎨 Payment Page Design (With Referral Link Support)

#### Scenario 1: User Arrives via Payment Referral Link

```
┌─────────────────────────────────────────────────────────────┐
│                    TiC Summit Portal                         │
│                   Complete Your Payment                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🎉  Payment via referral from John Doe                     │
│      Littoral, Cameroon                                      │
└─────────────────────────────────────────────────────────────┘
   ↑ Show this banner if referral code is valid (from URL)

┌─────────────────────────────────────────────────────────────┐
│  Country       [▼ Cameroon - 5,300 XAF               ]      │
│                                                               │
│  Phone Number  [237650495499________________]                │
│                                                               │
│  Payment Method: MTN Mobile Money ✓                          │
│                                                               │
│  ❌ NO REFERRAL CODE INPUT FIELD!                           │
│     (Code is automatically captured from URL)                │
│                                                               │
│           [ Pay Now - 5,300 XAF ]                            │
└─────────────────────────────────────────────────────────────┘
```

#### Scenario 2: Direct Payment (No Referral)

```
┌─────────────────────────────────────────────────────────────┐
│                    TiC Summit Portal                         │
│                   Complete Your Payment                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Country       [▼ Cameroon - 5,300 XAF               ]      │
│                                                               │
│  Phone Number  [237650495499________________]                │
│                                                               │
│  Payment Method: MTN Mobile Money ✓                          │
│                                                               │
│  ❌ NO REFERRAL CODE FIELD!                                 │
│                                                               │
│           [ Pay Now - 5,300 XAF ]                            │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ✅ Payment form is identical for both scenarios
- ✅ Only difference: referral banner shown if code is valid (from URL)
- ❌ Never show a "Enter referral code" field
- 💡 Referral code comes from URL: `/pay?ref=TIC-ABC-2026`

---

### 🎨 Affiliate Dashboard - Payment Referral Link Section

```
┌─────────────────────────────────────────────────────────────┐
│  Your Payment Referral Link                                  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://portal.ticsummit.org/pay?ref=TIC-ABC-2026     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  [ 📋 Copy Link ]  [ 📱 Share on WhatsApp ]  [ ✉️ Email ]   │
│                                                               │
│  ℹ️  Share this link with potential students. When they     │
│     click and complete payment, you'll earn 9% commission!   │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:**
```tsx
function ReferralLinkCard({ referralCode }: { referralCode: string }) {
  const referralLink = `https://portal.ticsummit.org/pay?ref=${referralCode}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Join TiC Summit Training! Register here: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
      
      {/* Link Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <code className="text-sm text-blue-600 break-all">
          {referralLink}
        </code>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {copied ? (
            <>
              <CheckIcon className="h-5 w-5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="h-5 w-5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
        
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span>WhatsApp</span>
        </button>
      </div>
      
      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 Share this link with potential students. When they click and 
          register, you'll earn 9% commission on their payment!
        </p>
      </div>
    </div>
  );
}
```

---

### 🎨 Referral Banner (Registration Page)

```tsx
function ReferralBanner({ 
  affiliateName, 
  regionName, 
  countryName 
}: { 
  affiliateName: string;
  regionName: string;
  countryName: string;
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="bg-blue-100 rounded-full p-3">
            <span className="text-3xl">🎉</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-1">
            You've been referred!
          </h3>
          <p className="text-blue-800 mb-2">
            <strong>{affiliateName}</strong> has invited you to join 
            TiC Summit Training
          </p>
          <p className="text-sm text-blue-600">
            📍 {regionName}, {countryName}
          </p>
        </div>
        
        {/* Badge */}
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
            ✓ Verified
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## Error Handling

### Global Error Handler

```typescript
interface ApiError {
  error: string;
  details?: any;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data.details
        );
      }

      return data.data || data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
const api = new ApiClient(API_BASE_URL);
api.setToken(accessToken);

try {
  const result = await api.request('/api/affiliate/dashboard');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Handle unauthorized - redirect to login
      router.push('/login');
    } else if (error.status === 403) {
      // Handle forbidden - show error
      showNotification('Access denied', 'error');
    } else {
      // Handle other errors
      showNotification(error.message, 'error');
    }
  }
}
```

### Common Error Scenarios

```typescript
// Handle network errors
try {
  const result = await initiatePayment(...);
} catch (error) {
  if (error.message.includes('Network')) {
    showNotification('Network error. Please check your connection.', 'error');
  } else if (error.message.includes('Insufficient funds')) {
    showNotification('Insufficient funds in your account.', 'error');
  } else {
    showNotification(error.message, 'error');
  }
}

// Handle validation errors
if (!phoneNumber.match(/^237\d{9}$/)) {
  showNotification('Invalid phone number format', 'error');
  return;
}

// Handle authorization errors
if (response.status === 401) {
  // Token expired - refresh or redirect to login
  const newToken = await refreshToken();
  if (newToken) {
    // Retry request
  } else {
    router.push('/login');
  }
}
```

---

## Testing

### Test Accounts Setup

```typescript
// Create test users for each role
const testUsers = {
  student: {
    email: 'student@test.com',
    password: 'Test123!',
  },
  affiliate: {
    email: 'affiliate@test.com',
    password: 'Test123!',
    referralCode: 'TIC-TEST-2026',
  },
  regional: {
    email: 'regional@test.com',
    password: 'Test123!',
  },
  national: {
    email: 'national@test.com',
    password: 'Test123!',
  },
  admin: {
    email: 'admin@test.com',
    password: 'Test123!',
  },
};
```

### Test Referral Flow

```typescript
// 1. Test direct registration (no referral)
const directUser = await registerUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@test.com',
  password: 'Test123!',
  phoneNumber: '237650495499',
  referralCode: null, // No referral
});

// 2. Test referral registration
const referredUser = await registerUser({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@test.com',
  password: 'Test123!',
  phoneNumber: '237650495400',
  referralCode: 'TIC-TEST-2026', // With referral
});

// 3. Validate referral was recorded
const affiliateDashboard = await getAffiliateDashboard(affiliateToken);
expect(affiliateDashboard.stats.totalReferrals).toBe(1);
```

### Test Payment Flow

```typescript
// 1. Initiate test payment
const payment = await initiatePayment({
  phoneNumber: '237650495499',
  amount: 5300,
  countryId: testCountryId,
  referralCode: 'TIC-TEST-2026',
}, testUserToken);

expect(payment.status).toBe('PENDING');
expect(payment.paymentId).toBeDefined();

// 2. Simulate webhook (in development)
await simulateWebhook({
  transId: payment.fapshiTransId,
  externalId: payment.paymentReference,
  status: 'SUCCESSFUL',
  amount: 5300,
  phone: '237650495499',
});

// 3. Check payment confirmed
const status = await checkPaymentStatus(payment.paymentId, testUserToken);
expect(status.status).toBe('CONFIRMED');

// 4. Verify commissions created
const commissions = await getAffiliateCommissions(affiliateToken);
expect(commissions.commissions.length).toBeGreaterThan(0);
```

---

## FAQ - Link-Based Referral System

### Q: Why can't users manually enter referral codes?

**A:** We use a **link-only approach** for several reasons:

1. **Better UX**: One click is easier than copying, pasting, and typing codes
2. **Fewer errors**: No typos or invalid code entries
3. **Higher conversion**: Less friction means more successful registrations
4. **Automatic tracking**: Everything happens seamlessly in the background
5. **Mobile-friendly**: Links work perfectly on WhatsApp, SMS, social media

**Real-world example:**  
❌ Old way: "Copy this code: TIC-ABC-2026, then go to the website, click register, paste the code..."  
✅ New way: "Click this link: https://portal.ticsummit.org/register?ref=TIC-ABC-2026"

---

### Q: What if a user bookmarks the registration page with a referral code?

**A:** That's fine! The referral code remains in the URL. When they return and complete registration, the affiliate still gets credited.

---

### Q: What if someone manually edits the URL to change the referral code?

**A:** The backend validates the referral code during registration. If it's invalid, the registration still succeeds but without affiliate attribution (same as direct registration).

---

### Q: Can users register without a referral link?

**A:** Absolutely! Users can directly visit `/register` without any `?ref` parameter. This is called "direct registration" and is completely valid. No commissions are created for these registrations.

---

### Q: What happens if the referral code in the URL is invalid?

**A:** The frontend validation (optional) will show that the code is invalid, but registration still proceeds. The invalid code is stored as-is, and no commissions are created (same outcome as direct registration).

**Best practice:** Show a warning but don't block registration.

---

### Q: How do affiliates share their links?

**A:** Affiliates get their referral link from their dashboard:
- **Copy Link** button copies to clipboard
- **WhatsApp Share** button opens WhatsApp with pre-filled message
- **Email/Social Share** options (optional)

They can share via:
- WhatsApp messages or status
- SMS
- Social media posts (Facebook, Twitter, Instagram)
- Email campaigns
- QR codes (for physical marketing)

---

### Q: Can I add a "Have a referral code?" optional field?

**A:** While technically possible, we **strongly recommend against it** for these reasons:

1. **Confusing UX**: If someone has a code, why didn't they use the link?
2. **Error-prone**: Users might mistype the code
3. **Duplicate attribution**: What if URL has one code but user enters another?
4. **Defeats the purpose**: We designed this to be link-only for simplicity

**Alternative:** If you really need manual entry, create a separate flow:
- Add a "Don't have the link? Enter code here" link
- Opens a modal/form to paste the code
- Redirects to `/register?ref=[code]`

This way, you maintain the link-based primary flow.

---

### Q: How do I test the referral flow in development?

**A:**

1. **Create a test affiliate:**
   ```bash
   POST /api/affiliate/assign-role
   {
     "userId": "test-user-id",
     "role": "AFFILIATE",
     "regionId": "test-region-id"
   }
   ```

2. **Get the referral code from affiliate dashboard:**
   ```bash
   GET /api/affiliate/dashboard
   # Response includes: referralCode: "TIC-ABC-2026"
   ```

3. **Test registration with referral link:**
   - Visit: `http://localhost:3000/register?ref=TIC-ABC-2026`
   - Complete registration
   - Make payment
   - Check affiliate dashboard for new referral

4. **Test direct registration:**
   - Visit: `http://localhost:3000/register` (no ?ref)
   - Complete registration
   - Make payment
   - Verify no commissions created

---

### Q: What if the referral link is shared on a platform that strips query parameters?

**A:** Some platforms (rare cases) might strip `?ref=...` from URLs. Solutions:

1. **Use URL shorteners**: Bitly, TinyURL preserve query parameters
2. **Use hash routing**: `/register#ref=TIC-ABC-2026` (requires frontend changes)
3. **Track externally**: Use UTM parameters + backend correlation

For 99% of cases (WhatsApp, SMS, email, social media), the standard `?ref=` approach works perfectly.

---

### Q: How do I handle expired or deactivated affiliate codes?

**A:** The backend handles this automatically:

- During validation: `GET /api/affiliate/validate/:code` returns `valid: false` if affiliate is suspended
- During registration: The code is stored, but commissions won't be created if the affiliate is inactive
- **Frontend recommendation**: Show a warning but allow registration to proceed

---

### Q: Can I pre-fill other form fields from the URL?

**A:** Yes! You can add additional URL parameters:

```
/register?ref=TIC-ABC-2026&email=john@example.com&name=John+Doe
```

Then extract and pre-fill:
```typescript
const params = new URLSearchParams(window.location.search);
const referralCode = params.get('ref');
const email = params.get('email');
const name = params.get('name');

// Pre-fill form fields
setFormData({
  ...formData,
  email: email || '',
  firstName: name?.split(' ')[0] || '',
  lastName: name?.split(' ')[1] || '',
});
```

**Use case:** Affiliate has user's email from a lead form, creates personalized link.

---

### Q: Should I store the referral code in localStorage/sessionStorage?

**A:** Generally **no**, because:

1. **URL is the source of truth**: The code is in the URL
2. **Creates confusion**: What if user opens two tabs with different codes?
3. **Privacy concerns**: Other scripts might read localStorage
4. **Not needed**: The code is submitted once during registration

**Exception:** If your registration is multi-step across multiple pages and you don't want to keep `?ref` in every URL, you can temporarily store it:

```typescript
// On registration page load
const referralCode = new URLSearchParams(window.location.search).get('ref');
if (referralCode) {
  sessionStorage.setItem('pendingReferralCode', referralCode);
}

// On final registration submit
const code = sessionStorage.getItem('pendingReferralCode');
// Submit with code
// Clear after successful registration
sessionStorage.removeItem('pendingReferralCode');
```

---

### Q: What analytics should I track for referral links?

**A:** Track these events:

1. **Link Click**: When user clicks referral link (UTM parameters)
2. **Registration Started**: User lands on registration page with `?ref`
3. **Validation Attempted**: Call to `/api/affiliate/validate/:code`
4. **Validation Result**: Success/failure of validation
5. **Registration Completed**: With or without valid referral
6. **Payment Initiated**: By referred user
7. **Payment Completed**: Successful payment triggering commissions

**Example with Google Analytics:**
```typescript
// Track landing with referral
if (referralCode) {
  gtag('event', 'referral_landing', {
    'referral_code': referralCode,
    'page': '/register'
  });
}

// Track registration with referral
gtag('event', 'registration_complete', {
  'referral_code': referralCode || 'direct',
  'has_referral': !!referralCode
});
```

---

### Q: Can I create QR codes for referral links?

**A:** Absolutely! QR codes work great for physical marketing:

```typescript
import QRCode from 'qrcode';

async function generateReferralQR(referralCode: string) {
  const referralLink = `https://portal.ticsummit.org/register?ref=${referralCode}`;
  
  const qrCodeDataUrl = await QRCode.toDataURL(referralLink, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  return qrCodeDataUrl; // Use in <img src={qrCodeDataUrl} />
}
```

**Use cases:**
- Printed flyers and posters
- Business cards
- Event badges
- Presentation slides

---

### Q: How do I implement "Copy Link" functionality?

**A:** Here's a robust implementation:

```typescript
function CopyReferralLink({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://portal.ticsummit.org/register?ref=${referralCode}`;
  
  const handleCopy = async () => {
    try {
      // Modern clipboard API
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      // Optional: Show toast notification
      toast.success('Link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {copied ? (
        <>
          <CheckIcon className="h-5 w-5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <ClipboardIcon className="h-5 w-5" />
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
}
```

---

### Q: Need more help?

**A:** Check these resources:

- **Implementation Guide**: See sections above for detailed code examples
- **API Reference**: Complete list of endpoints with examples
- **Backend Source**: `src/modules/affiliate/` and `src/modules/payment/`
- **Support**: Contact the development team

---

## Changelog

**v1.0.0** - February 2026
- Initial release
- Complete affiliate system
- Fapshi payment integration
- Email notifications
- Role-based dashboards

---
