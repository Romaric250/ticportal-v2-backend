# Affiliate & Commission System Implementation Guide

## Overview
A comprehensive hierarchical affiliate and commission tracking system for the TiC Summit Training Portal, featuring three-tier commission attribution, payment confirmation, commission lifecycle management, and robust auditability.

## System Architecture

### User Roles
1. **Affiliate**: Front-line referrers earning 9% commission
2. **Regional Coordinator**: Manages affiliates in a region, earns 6% commission
3. **National Coordinator**: Oversees entire country operations, earns 5% commission
4. **Admin**: Full system access

### Database Models

#### Core Models
- **Country**: Stores country-level data, commission rates, pricing
- **Region**: Geographic subdivisions within countries
- **AffiliateProfile**: Affiliate-specific data, referral codes, payment info
- **RegionalCoordinatorProfile**: Regional coordinator data
- **NationalCoordinatorProfile**: National coordinator data

#### Transaction Models
- **StudentReferral**: Tracks each referred student
- **Payment**: Stores payment information and verification
- **Commission**: Individual commission records with lifecycle states
- **PayoutBatch**: Groups commissions for batch payouts
- **FraudFlag**: Flags suspicious activities
- **SystemConfig**: System-wide configuration

## API Endpoints

### Public Endpoints
```
GET /api/affiliate/validate/:referralCode - Validate referral code (for registration)
```

### Admin Endpoints
```
POST /api/affiliate/admin/countries - Create country
GET /api/affiliate/admin/countries - List all countries
POST /api/affiliate/admin/regions - Create region
GET /api/affiliate/admin/countries/:countryId/regions - Get regions by country
PUT /api/affiliate/admin/users/role - Update user role
PATCH /api/affiliate/admin/affiliates/:affiliateId/activate - Activate/deactivate affiliate
```

### Affiliate Endpoints
```
GET /api/affiliate/dashboard - Get affiliate dashboard stats
GET /api/affiliate/referrals - Get own referrals (paginated)
GET /api/affiliate/commissions - Get own commissions (paginated)
```

### Regional Coordinator Endpoints
```
GET /api/affiliate/regional/dashboard - Get regional dashboard
```

### National Coordinator Endpoints
```
GET /api/affiliate/national/dashboard - Get national dashboard
```

## Commission Flow

### 1. Student Registration with Referral Code
```
Student registers → Validates referral code → Creates StudentReferral (PENDING status)
```

### 2. Payment Confirmation
```typescript
// Admin confirms payment
PaymentCommissionService.confirmPayment(paymentId, adminId)
  → Payment status: CONFIRMED
  → Referral status: PAID
  → Creates commissions (PENDING) for affiliate, regional, and national coordinators
  → 30-day cooling period starts
```

### 3. Student Activation
```typescript
// When student logs in or completes first action
PaymentCommissionService.activateReferral(referralId)
  → Referral status: ACTIVATED
  → Commissions status: PENDING → EARNED
```

### 4. Commission Approval (After Cooling Period)
```typescript
// After 30 days, commissions can be approved
PaymentCommissionService.approveCommissions([commissionIds])
  → Checks cooldown period
  → Commission status: EARNED → APPROVED
```

### 5. Payout Batch Creation
```typescript
// Admin creates payout batch
PaymentCommissionService.createPayoutBatch(commissionIds, adminId)
  → Creates PayoutBatch
  → Commission status: APPROVED → QUEUED_FOR_PAYOUT
```

### 6. Payout Completion
```typescript
// After payment processing
PaymentCommissionService.completePayoutBatch(batchId)
  → PayoutBatch status: COMPLETED
  → Commission status: QUEUED_FOR_PAYOUT → PAID
  → Updates totalPaid for profiles
```

## Commission Calculation

### Commission Rates (Configurable per Country)
- **Affiliate**: 9% of commissionable amount
- **Regional Coordinator**: 6% of commissionable amount
- **National Coordinator**: 5% of commissionable amount

### Example Calculation
```
Student Price: 5,000 CFA
Platform Fee: 300 CFA
Commissionable Amount: 4,700 CFA

Affiliate Commission: 4,700 * 0.09 = 423 CFA
Regional Commission: 4,700 * 0.06 = 282 CFA
National Commission: 4,700 * 0.05 = 235 CFA

Total Commissions: 940 CFA
Platform Revenue: 4,700 - 940 = 3,760 CFA
```

## Email Notifications

### Role Change Notification
Sent when a user's role is updated (e.g., promoted to Affiliate, Regional Coordinator, etc.)
- **Subject**: "Your Role Has Been Updated at TiC Summit"
- **Content**: Role details, responsibilities, next steps

### Affiliate Activation Notification
Sent when an affiliate is activated after providing payment details
- **Subject**: "Your Affiliate Account Has Been Activated!"
- **Content**: Referral code, referral link, commission rates, getting started guide

## Key Features

### 1. Referral Code Generation
```typescript
Format: TIC-{REGION}-{NAME}-{YEAR}-{RANDOM}
Example: TIC-NAIROBI-JOHN-2024-A7K3
```

### 2. Dashboard Statistics
- **Affiliate Dashboard**: Total referrals, active referrals, conversion rate, earnings breakdown
- **Regional Dashboard**: Total affiliates, active affiliates, regional stats
- **National Dashboard**: Total regions, affiliates, coordinators, country-wide stats

### 3. Fraud Prevention
- **FraudFlag Model**: Tracks suspicious activities
- Flags: duplicate payments, suspicious patterns, policy violations
- Investigation workflow

### 4. Audit Trail
- **UserActivity**: All role changes logged
- Commission lifecycle tracked
- Payment verification history
- Payout batch history

## Usage Examples

### Creating a Country
```typescript
POST /api/affiliate/admin/countries
{
  "code": "CM",
  "name": "Cameroon",
  "currency": "CFA",
  "studentPrice": 5000,
  "platformFee": 300,
  "affiliateCommissionRate": 9,
  "regionalCommissionRate": 6,
  "nationalCommissionRate": 5
}
```

### Creating a Region
```typescript
POST /api/affiliate/admin/regions
{
  "countryId": "country_id_here",
  "name": "Centre Region"
}
```

### Promoting User to Affiliate
```typescript
PUT /api/affiliate/admin/users/role
{
  "userId": "user_id_here",
  "newRole": "AFFILIATE",
  "regionId": "region_id_here"
}
```

### Activating an Affiliate
```typescript
PATCH /api/affiliate/admin/affiliates/:affiliateId/activate
{
  "bankName": "Bank of Africa",
  "accountNumber": "123456789",
  "accountName": "John Doe",
  "mobileMoneyNumber": "+237123456789",
  "mobileMoneyProvider": "MTN Mobile Money"
}
```

### Validating a Referral Code (Public)
```typescript
GET /api/affiliate/validate/TIC-NAIROBI-JOHN-2024-A7K3
```

## Integration Points

### 1. Student Registration Flow
```typescript
// In registration controller
const { referralCode } = req.body;

if (referralCode) {
  // Validate referral code
  const affiliate = await AffiliateService.validateReferralCode(referralCode);
  
  // Create student referral
  await db.studentReferral.create({
    data: {
      studentId: newUser.id,
      affiliateId: affiliate.id,
      regionId: affiliate.regionId,
      countryId: affiliate.region.countryId,
      referralCode: referralCode,
      status: 'PENDING'
    }
  });
}
```

### 2. Payment Confirmation Flow
```typescript
// In payment confirmation controller
await PaymentCommissionService.confirmPayment(paymentId, adminId);
```

### 3. Student First Login/Action
```typescript
// In auth controller or first action handler
const referral = await db.studentReferral.findFirst({
  where: {
    studentId: userId,
    status: 'PAID'
  }
});

if (referral) {
  await PaymentCommissionService.activateReferral(referral.id);
}
```

## Cron Jobs (Future Implementation)

### Daily Jobs
- Auto-approve commissions past cooling period
- Flag suspicious activities
- Send pending commission reminders

### Weekly Jobs
- Generate payout reports
- Send affiliate performance summaries

### Monthly Jobs
- Generate monthly commission reports
- Archive old transactions

## Security Considerations

1. **Role-Based Access Control**: All endpoints protected with role-based middleware
2. **Audit Logging**: All critical actions logged in UserActivity
3. **Commission Validation**: Multiple validation checks before payout
4. **Fraud Detection**: Automated flagging of suspicious patterns
5. **Payment Verification**: Two-step verification (confirmation + activation)

## Testing Checklist

- [ ] Country creation
- [ ] Region creation
- [ ] User role promotion (Student → Affiliate)
- [ ] Affiliate activation with payment details
- [ ] Referral code validation
- [ ] Student registration with referral code
- [ ] Payment confirmation and commission creation
- [ ] Student activation and commission status update
- [ ] Commission approval after cooling period
- [ ] Payout batch creation
- [ ] Payout batch completion
- [ ] Dashboard data accuracy
- [ ] Email notifications
- [ ] Fraud flag creation
- [ ] Audit trail verification

## Next Steps

1. **Create Payment Confirmation Controller**: Integrate `PaymentCommissionService.confirmPayment()`
2. **Add Student Activation Hook**: Detect first login/action and activate referral
3. **Build Cron Jobs**: Automate commission approval and reporting
4. **Implement Fraud Detection**: Add pattern detection algorithms
5. **Create Admin Dashboard**: Build UI for managing affiliates, payouts, etc.
6. **Add Reports**: Generate commission reports, payout summaries
7. **Testing**: Comprehensive testing of all flows
8. **Documentation**: API documentation with Swagger

## Files Created/Modified

### New Files
- `src/modules/affiliate/service.ts` - Core affiliate business logic
- `src/modules/affiliate/controller.ts` - HTTP request handlers
- `src/modules/affiliate/routes.ts` - Route definitions
- `src/modules/affiliate/types.ts` - TypeScript type definitions
- `src/modules/affiliate/payment-commission.service.ts` - Payment & commission logic

### Modified Files
- `prisma/schema.prisma` - Added affiliate system models
- `src/shared/utils/email.ts` - Added affiliate email templates
- `src/app.ts` - Registered affiliate routes

## Support & Maintenance

For questions or issues, contact the development team or refer to:
- API Documentation: `/api/docs`
- Schema Documentation: `prisma/schema.prisma`
- Service Logic: `src/modules/affiliate/service.ts`
