# Email Notifications - Quick Reference

## Overview
The TiC Portal now sends automated email notifications for all payment events to keep users informed throughout the payment process.

## Email Types Implemented

### 1. Payment Pending ⏳
**Trigger**: When user initiates payment  
**Purpose**: Confirm payment initiation and set expectations  
**Recipient**: Student who initiated payment  

**Contains**:
- Amount and currency
- Payment method (MTN/Orange)
- Transaction ID
- Expected processing time
- Status check link
- Warning not to duplicate payment

---

### 2. Payment Success ✅
**Trigger**: When payment is confirmed (webhook or manual verification)  
**Purpose**: Confirm payment and activate user access  
**Recipient**: Student whose payment succeeded  

**Contains**:
- Complete payment receipt
- Transaction details (amount, method, ID, date)
- Welcome message
- Next steps (profile, squads, resources)
- Dashboard link

---

### 3. Payment Failed ❌
**Trigger**: When payment fails (webhook or status check)  
**Purpose**: Inform user and guide recovery  
**Recipient**: Student whose payment failed  

**Contains**:
- Payment attempt details
- Error reason/message
- Common failure causes
- Troubleshooting steps
- "Try Again" link
- Support contact info
- Refund policy note

---

## Implementation Details

### Files Modified
- `src/shared/utils/email.ts` - Added 3 new email functions
- `src/modules/payment/service.ts` - Integrated email sending at key points

### Email Functions

```typescript
// Send when payment is initiated
await sendPaymentPendingEmail(email, firstName, {
  amount: 5300,
  currency: 'XAF',
  transactionId: 'FAPSHI-123',
  paymentMethod: 'MTN',
  date: new Date()
});

// Send when payment succeeds
await sendPaymentSuccessEmail(email, firstName, {
  amount: 5300,
  currency: 'XAF',
  transactionId: 'FAPSHI-123',
  paymentMethod: 'MTN Mobile Money',
  date: new Date()
});

// Send when payment fails
await sendPaymentFailedEmail(email, firstName, {
  amount: 5300,
  currency: 'XAF',
  transactionId: 'FAPSHI-123',
  paymentMethod: 'Orange Money',
  errorMessage: 'Insufficient funds',
  date: new Date()
});
```

---

## Email Flow

### Success Path
```
User Clicks "Pay Now"
↓
[PENDING EMAIL] sent immediately
↓
User approves on phone
↓
Fapshi confirms payment
↓
[SUCCESS EMAIL] sent with receipt
↓
User accesses dashboard
```

### Failure Path
```
User Clicks "Pay Now"
↓
[PENDING EMAIL] sent immediately
↓
Payment fails (network/funds/timeout)
↓
[FAILURE EMAIL] sent with guidance
↓
User can retry payment
```

---

## Error Handling

All email operations are **non-blocking**:

```typescript
try {
  await sendPaymentSuccessEmail(...);
  logger.info('Email sent');
} catch (error) {
  logger.error('Email failed');
  // Don't throw - payment still confirmed
}
```

**Why?**
- Email failures shouldn't block payment confirmation
- Payment success is more critical than notification delivery
- Failed emails are logged for monitoring
- Users can still see status in dashboard

---

## Testing

### Local Testing
```bash
# Set test credentials
RESEND_API_KEY=re_test_...
EMAIL_FROM="Test <test@test.com>"

# Initiate test payment
POST /api/payment/initiate

# Check console for email logs
📧 Sending email to user@test.com: Payment Pending
✅ Email sent successfully
```

### Verify Emails
1. Check Resend dashboard for delivery
2. View email in test inbox
3. Verify formatting on mobile/desktop
4. Test all links work correctly

---

## Monitoring

### Logs to Watch
```bash
# Email sending attempts
grep "📧 Sending email" logs/app.log

# Successful sends
grep "✅ Email sent successfully" logs/app.log

# Failed sends
grep "❌ Failed to send email" logs/app.log

# Payment-specific
grep "Payment.*email sent" logs/app.log
```

### Metrics
- Email delivery rate (target: >98%)
- Open rate (target: >40%)
- Click-through rate (target: >20%)
- Bounce rate (target: <2%)

---

## Configuration

### Environment Variables Required
```env
RESEND_API_KEY=your_api_key_here
EMAIL_FROM="TIC Portal <noreply@ticsummit.org>"
CLIENT_URL=https://portal.ticsummit.org
```

### Resend Setup
1. Create account at https://resend.com
2. Verify domain (add DNS records)
3. Generate API key
4. Configure webhook URL (optional)

---

## Email Content

### Design Features
✅ **Branded**: TIC Portal logo and colors  
✅ **Responsive**: Mobile-friendly layout  
✅ **Professional**: Clean, modern design  
✅ **Accessible**: Clear hierarchy, readable fonts  
✅ **Actionable**: Prominent CTA buttons  
✅ **Informative**: All relevant transaction details  

### Personalization
- Uses user's first name
- Includes transaction-specific details
- Provides context-aware next steps
- Links to relevant portal sections

---

## Troubleshooting

### Emails Not Arriving
1. **Check Spam Folder**: May be filtered initially
2. **Verify Domain**: Ensure DNS records configured
3. **Check API Key**: Valid and not expired
4. **Review Logs**: Look for send errors
5. **Resend Limits**: Verify not hitting rate limits

### Template Issues
1. **Test HTML**: Use email testing tools
2. **Check Variables**: All data passed correctly
3. **Verify Links**: All URLs correct and accessible
4. **Mobile View**: Test on various devices

### Timing Issues
1. **Pending Sent Late**: Check payment initiation flow
2. **Success Delayed**: Review webhook handling
3. **Multiple Sends**: Check for duplicate processing

---

## Best Practices

### Do's ✅
- Send immediately after trigger event
- Include all relevant transaction details
- Provide clear next steps
- Log all send attempts
- Use transaction ID for support
- Test on multiple email clients
- Monitor delivery metrics

### Don'ts ❌
- Don't block operations waiting for email
- Don't send duplicate notifications
- Don't include sensitive data (passwords, full card numbers)
- Don't use generic subject lines
- Don't skip error handling
- Don't forget mobile optimization

---

## Future Enhancements

### Planned
- [ ] SMS fallback for critical notifications
- [ ] Email preference management
- [ ] Digest emails (weekly summaries)
- [ ] Rich tracking (opens, clicks)
- [ ] A/B testing for content
- [ ] Localization (FR, EN)
- [ ] Template versioning

### Possible
- [ ] In-app notification mirror
- [ ] WhatsApp notifications
- [ ] Real-time status dashboard
- [ ] Automated retry on failure
- [ ] Smart send time optimization

---

## Support Contacts

**Technical Issues**:  
- Check: `EMAIL_NOTIFICATIONS.md` (full documentation)
- Review: Application logs
- Contact: Technical team

**Email Service Issues**:  
- Dashboard: https://resend.com/dashboard
- Support: support@resend.com
- Docs: https://resend.com/docs

**Content Updates**:  
- Edit: `src/shared/utils/email.ts`
- Test: Local environment first
- Deploy: After thorough testing

---

## Summary

✅ **3 email types** covering full payment lifecycle  
✅ **Non-blocking** operation for reliability  
✅ **Professional** branded templates  
✅ **Comprehensive** error handling and logging  
✅ **Production-ready** with monitoring support  

All payment events now automatically notify users, improving transparency and trust in the payment process.
