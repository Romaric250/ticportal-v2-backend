# Email Notifications System

This document describes the email notification system integrated into the TiC Summit Training Portal, specifically for the affiliate and payment modules.

## Overview

The portal sends automated email notifications for various events throughout the user journey, including:
- **Payment Events**: Payment initiation, success, failure
- **Affiliate System**: Role changes, affiliate activation
- **User Actions**: Email verification, password reset, team invitations (existing)

## Email Service Setup

### Configuration

Email notifications use **Resend** as the email service provider. Configure the following environment variables:

```bash
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM="TIC Portal <noreply@ticsummit.org>"
CLIENT_URL=https://portal.ticsummit.org
```

### Email Template

All emails use a consistent, branded template with:
- **Professional Design**: Dark header/footer with white content area
- **TIC Portal Branding**: Logo and consistent styling
- **Responsive Layout**: Mobile-friendly design
- **Clear CTAs**: Prominent buttons for user actions

## Payment Email Notifications

### 1. Payment Pending Email

**Sent When**: User initiates a payment via Fapshi

**Purpose**: Inform user that their payment is being processed

**Contains**:
- Amount and currency
- Payment method (MTN/Orange Mobile Money)
- Transaction ID
- Status check link
- Expected processing time (2-5 minutes)
- Warning not to make duplicate payments

**Example**:
```typescript
await sendPaymentPendingEmail(
  user.email,
  user.firstName,
  {
    amount: 5300,
    currency: 'XAF',
    transactionId: 'FAPSHI-123456',
    paymentMethod: 'MTN',
    date: new Date()
  }
);
```

### 2. Payment Success Email

**Sent When**: Payment is confirmed (via webhook or manual verification)

**Purpose**: Confirm successful payment and activate user account

**Contains**:
- Payment receipt with full transaction details
- Amount, payment method, transaction ID, date
- Welcome message
- Next steps (complete profile, join squad, etc.)
- Dashboard access link

**Example**:
```typescript
await sendPaymentSuccessEmail(
  user.email,
  user.firstName,
  {
    amount: 5300,
    currency: 'XAF',
    transactionId: 'FAPSHI-123456',
    paymentMethod: 'MTN Mobile Money',
    date: new Date()
  }
);
```

### 3. Payment Failed Email

**Sent When**: Payment fails (via webhook or status check)

**Purpose**: Inform user of payment failure and guide next steps

**Contains**:
- Payment attempt details
- Transaction ID (if available)
- Error reason/message
- Common failure causes (insufficient funds, network issues, etc.)
- Troubleshooting steps
- "Try Again" link
- Support contact information
- Note about refunds for deducted funds

**Example**:
```typescript
await sendPaymentFailedEmail(
  user.email,
  user.firstName,
  {
    amount: 5300,
    currency: 'XAF',
    transactionId: 'FAPSHI-123456',
    paymentMethod: 'Orange Money',
    errorMessage: 'Insufficient funds',
    date: new Date()
  }
);
```

## Affiliate Email Notifications

### 1. Role Change Email

**Sent When**: User's role is updated to AFFILIATE, REGIONAL_COORDINATOR, or NATIONAL_COORDINATOR

**Purpose**: Inform user of their new role and permissions

**Contains**:
- Previous and new role
- Role-specific details (referral code, region/country, commission rates)
- Activation status note (for affiliates)
- Dashboard access link

**Example**:
```typescript
await sendRoleChangeEmail(
  user,
  'AFFILIATE',
  {
    referralCode: 'REF-ABC123',
    regionName: 'Littoral',
    countryName: 'Cameroon'
  }
);
```

### 2. Affiliate Activation Email

**Sent When**: Admin activates an affiliate account

**Purpose**: Provide affiliate with their referral details and program information

**Contains**:
- Referral code
- Referral link (shareable URL)
- Commission per student (450 CFA)
- Step-by-step earning process
- Cooling period explanation (14 days)
- Affiliate dashboard link

**Example**:
```typescript
await sendAffiliateActivationEmail(
  user,
  {
    referralCode: 'REF-ABC123',
    referralLink: 'https://portal.ticsummit.org/register?ref=REF-ABC123'
  }
);
```

## Email Sending Flow

### Payment Flow

```
1. User Initiates Payment
   ↓
   [sendPaymentPendingEmail] ← Immediate
   ↓
2. Payment Processing (Fapshi)
   ↓
   ┌─────────────────┬─────────────────┐
   │                 │                 │
3a. Payment Success  3b. Payment Failed
   ↓                 ↓
   [sendPaymentSuccessEmail]  [sendPaymentFailedEmail]
   ↓                 ↓
   User Activated    User Notified → Can Retry
```

### Email Triggers

| Trigger Point | Email Type | Priority |
|--------------|------------|----------|
| `PaymentService.initiatePayment()` | Pending | Low (non-blocking) |
| `PaymentService.confirmPayment()` | Success | Medium (non-blocking) |
| `PaymentService.handleWebhookEvent()` (failed) | Failed | Medium (non-blocking) |
| `PaymentService.checkPaymentStatus()` (failed) | Failed | Medium (non-blocking) |
| `AffiliateService.updateUserRole()` | Role Change | High (blocking) |
| `AffiliateService.activateAffiliate()` | Activation | High (blocking) |

## Error Handling

All email sending operations include comprehensive error handling:

```typescript
try {
  await sendPaymentSuccessEmail(...);
  logger.info({ paymentId, email }, 'Payment success email sent');
} catch (emailError: any) {
  logger.error({ paymentId, error: emailError.message }, 'Failed to send payment success email');
  // Don't throw - payment is confirmed, email failure shouldn't block the process
}
```

**Key Principles**:
1. **Non-blocking**: Email failures don't prevent payment confirmation
2. **Logged**: All email attempts (success/failure) are logged
3. **Graceful Degradation**: Critical operations proceed even if emails fail
4. **Retry Logic**: Can be implemented at application level if needed

## Testing Email Notifications

### Development Testing

1. **Use Resend Test Mode**:
   - Set up test domain in Resend dashboard
   - All emails go to test inbox

2. **Local Testing**:
   ```bash
   # Set environment variables
   RESEND_API_KEY=re_test_...
   EMAIL_FROM="Test Portal <test@test.com>"
   CLIENT_URL=http://localhost:3000
   
   # Trigger payment flow
   POST /api/payment/initiate
   ```

3. **Check Logs**:
   ```bash
   # Look for email logs
   📧 Sending email to user@example.com: Payment Pending
   ✅ Email sent successfully
   ```

### Production Testing

1. **Test with Real User**:
   - Create test account
   - Make small test payment
   - Verify all emails received

2. **Monitor Email Delivery**:
   - Check Resend dashboard for delivery rates
   - Monitor bounce/complaint rates
   - Review email logs for failures

## Email Content Customization

### Modifying Email Content

All email templates are in `src/shared/utils/email.ts`:

```typescript
export const sendPaymentSuccessEmail = async (
  email: string,
  firstName: string,
  paymentDetails: {...}
) => {
  const content = `
    <h2>✅ Payment Successful!</h2>
    <p>Hello ${firstName},</p>
    ...
  `;
  
  await sendEmail(email, subject, emailTemplate(content));
};
```

### Adding New Email Types

1. Create email function in `email.ts`:
```typescript
export const sendNewEmail = async (email: string, ...params) => {
  const content = `...`;
  await sendEmail(email, "Subject", emailTemplate(content));
};
```

2. Import in relevant service:
```typescript
import { sendNewEmail } from "../../shared/utils/email";
```

3. Call at appropriate trigger point:
```typescript
try {
  await sendNewEmail(user.email, ...params);
  logger.info('New email sent');
} catch (error) {
  logger.error('Failed to send email');
}
```

## Best Practices

1. **Clear Subject Lines**: Make subject descriptive and actionable
2. **Personalization**: Always use user's first name
3. **Transaction Details**: Include all relevant IDs for support
4. **Clear CTAs**: Provide obvious next steps with buttons
5. **Mobile-Friendly**: Test on mobile devices
6. **Error Recovery**: Always include "Try Again" or support contact
7. **Timing**: Send immediately for critical events (payment confirmation)
8. **Localization**: Consider multiple languages for international users
9. **Privacy**: Never include sensitive data (full card numbers, passwords)
10. **Compliance**: Include unsubscribe link for marketing emails

## Monitoring and Analytics

### Key Metrics to Track

1. **Delivery Rate**: % of emails successfully delivered
2. **Open Rate**: % of emails opened by users
3. **Click-Through Rate**: % of users clicking CTAs
4. **Bounce Rate**: % of emails bouncing
5. **Complaint Rate**: % of spam complaints

### Resend Dashboard

Access metrics at: https://resend.com/dashboard

- View delivery status
- Check email logs
- Monitor API usage
- Review bounce/complaint reports

### Application Logs

```bash
# Search for email logs
grep "📧 Sending email" logs/app.log
grep "✅ Email sent successfully" logs/app.log
grep "❌ Failed to send email" logs/app.log
```

## Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check RESEND_API_KEY is set correctly
   - Verify domain is verified in Resend
   - Check API rate limits

2. **Emails Going to Spam**
   - Configure SPF/DKIM records
   - Warm up new sending domain
   - Avoid spam trigger words

3. **Template Rendering Issues**
   - Test HTML in email client preview tools
   - Validate HTML structure
   - Check CSS compatibility

4. **Timing Issues**
   - Verify webhook configuration
   - Check async job processing
   - Review payment confirmation flow

## Future Enhancements

1. **Email Queue**: Implement job queue (Bull/Redis) for email sending
2. **Templates**: Move to template files (Handlebars/EJS)
3. **Localization**: Multi-language support (i18n)
4. **Analytics**: Integrate email tracking (opens, clicks)
5. **Preferences**: Allow users to manage notification preferences
6. **Digest Emails**: Weekly/monthly summaries for coordinators
7. **SMS Fallback**: Send SMS for critical notifications if email fails
8. **Rich Content**: Add more visual elements (charts, images)

## Support

For issues or questions about email notifications:
- **Technical Support**: Check logs and Resend dashboard
- **Content Updates**: Edit templates in `src/shared/utils/email.ts`
- **Configuration**: Review `.env` file settings
- **API Issues**: Contact Resend support at support@resend.com
