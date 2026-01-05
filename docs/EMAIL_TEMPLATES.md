# Email Templates Documentation

Professional, branded email templates for TIC Portal with clean design and consistent styling.

---

## Design System

### Colors
- **Primary Dark:** `#111827`
- **Primary White:** `#FFFFFF`
- **Gray Backgrounds:** `#f3f4f6`, `#f9fafb`
- **Gray Borders:** `#e5e7eb`

### Typography
- **Font Family:** System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)
- **Body Text:** 16px, line-height 1.6
- **Headings:** Bold, 28px for logo
- **Code:** Courier New, 24px with 4px letter-spacing

### Layout
- **Max Width:** 600px (optimized for all devices)
- **Padding:** Generous spacing (30-40px)
- **Borders:** 2px solid white separators
- **Buttons:** 14px vertical, 28px horizontal padding

---

## Base Template Structure

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Professional, responsive email HTML -->
  </head>
  <body>
    <div class="container">
      <!-- Header with TIC PORTAL logo -->
      <div class="header">
        <div class="logo">TIC PORTAL</div>
      </div>
      
      <!-- Content area (white background) -->
      <div class="content">
        <!-- Dynamic content here -->
      </div>
      
      <!-- Footer with tagline -->
      <div class="footer">
        <p>TIC Summit Portal</p>
        <p>Building Africa's Tech Future</p>
      </div>
    </div>
  </body>
</html>
```

---

## Email Templates

### 1. Email Verification

**Trigger:** User registers

**Function:** `sendVerificationEmail(email, firstName, otp)`

**Content:**
- Greeting with user's first name
- Explanation of verification requirement
- Large OTP code in styled box
- Expiration notice (10 minutes)
- Security note

**Example:**
```
Hello John,

Thank you for joining TIC Portal. Please verify your email address using the code below:

[123456]

This code will expire in 10 minutes.

If you didn't create an account, please ignore this email.
```

---

### 2. Password Reset

**Trigger:** User requests password reset

**Function:** `sendPasswordResetEmail(email, firstName, otp)`

**Content:**
- Greeting
- Reset request confirmation
- OTP code
- Expiration notice
- Security assurance

**Example:**
```
Hello John,

We received a request to reset your password. Use the code below:

[123456]

This code will expire in 10 minutes.

If you didn't request this, please ignore this email and your password will remain unchanged.
```

---

### 3. Welcome Email

**Trigger:** Email verified successfully

**Function:** `sendWelcomeEmail(email, firstName)`

**Content:**
- Welcome message
- Verification confirmation
- Next steps checklist
- Call-to-action button to dashboard

**Example:**
```
Welcome John!

Your email has been verified successfully. You're now part of the TIC Summit community.

Next Steps:
• Complete your profile
• Join or create a squad
• Start your learning journey
• Connect with peers and mentors

We're excited to have you on board!

[Go to Dashboard]
```

---

### 4. Team Invitation

**Trigger:** User added to team

**Function:** `sendTeamInviteEmail(email, firstName, teamName, inviterName)`

**Content:**
- Greeting
- Invitation notification with team and inviter names
- Benefits of team membership
- Call-to-action to view team

**Example:**
```
Hello John,

Alice Smith has added you to the team Team Alpha.

As a team member, you can now:
• Collaborate with teammates
• Participate in hackathons
• Share ideas and resources
• Track team progress

[View Team]
```

---

### 5. Team Role Update

**Trigger:** Member's role changed

**Function:** `sendTeamRoleUpdateEmail(email, firstName, teamName, newRole)`

**Content:**
- Greeting
- Role update notification
- Lead privileges (if promoted to Lead)
- Call-to-action to view team

**Example (Promoted to Lead):**
```
Hello John,

Your role in Team Alpha has been updated to Team Lead.

As Team Lead, you can now:
• Add and remove team members
• Update team information
• Manage team submissions
• Assign member roles

[View Team]
```

**Example (Changed to Member):**
```
Hello John,

Your role in Team Alpha has been updated to Team Member.

[View Team]
```

---

### 6. Team Removal

**Trigger:** User removed from team

**Function:** `sendTeamRemovalEmail(email, firstName, teamName)`

**Content:**
- Greeting
- Removal notification
- Contact information for disputes
- Call-to-action to browse teams

**Example:**
```
Hello John,

You have been removed from the team Team Alpha.

If you believe this was a mistake, please contact your squad leader or a team lead.

[Browse Teams]
```

---

### 7. Squad Invitation

**Trigger:** User invited to join squad

**Function:** `sendSquadInviteEmail(email, firstName, squadName, schoolName)`

**Content:**
- Greeting
- Squad invitation details
- Benefits checklist
- Call-to-action to join

**Example:**
```
Hello John,

You've been invited to join Squad Alpha from University of Buea.

Join your squad to:
• Connect with peers from your school
• Form teams for hackathons
• Access exclusive resources
• Compete in squad challenges

[Join Squad]
```

---

### 8. Hackathon Reminder

**Trigger:** Approaching submission deadline

**Function:** `sendHackathonReminderEmail(email, firstName, hackathonName, daysLeft)`

**Content:**
- Greeting
- Deadline reminder
- Days remaining (highlighted)
- Call-to-action to submit

**Example:**
```
Hello John,

Reminder: AI Innovation Challenge submission deadline is approaching.

3 days remaining

Make sure your team's submission is ready!

[Submit Now]
```

---

### 9. Mentor Assignment

**Trigger:** Mentor assigned to team

**Function:** `sendMentorAssignmentEmail(email, firstName, teamName, mentorName)`

**Content:**
- Greeting
- Assignment announcement
- Mentor benefits checklist
- Call-to-action to connect

**Example:**
```
Hello John,

Great news! Dr. Sarah Johnson has been assigned as a mentor to your team Team Alpha.

Your mentor will help you with:
• Technical guidance
• Project planning
• Best practices
• Career advice

[Connect with Mentor]
```

---

## UI Components

### Code Box (for OTPs)
```html
<div class="code-box">123456</div>
```
- Large, centered text
- Monospace font
- Letter-spaced for readability
- Light gray background with border

### Info Box (for lists/highlights)
```html
<div class="info-box">
  <p><strong>Title:</strong></p>
  <p>• Bullet point 1<br>
  • Bullet point 2<br>
  • Bullet point 3</p>
</div>
```
- Light background
- Dark left border accent
- Structured information display

### Call-to-Action Button
```html
<a href="URL" class="button">Button Text</a>
```
- Dark background, white text
- Rounded corners
- Bold, prominent
- Hover-friendly

---

## Usage in Code

### Basic Email Send

```typescript
import { sendWelcomeEmail } from './shared/utils/email';

// After user verification
await sendWelcomeEmail(user.email, user.firstName);
```

### Team Invitation Flow

```typescript
import { sendTeamInviteEmail } from './shared/utils/email';

// After adding member to team
await sendTeamInviteEmail(
  newMember.email,
  newMember.firstName,
  team.name,
  inviter.fullName
);
```

---

## Testing Emails

### Local Development

Emails are logged to console in development:
```
Sending email to john@example.com: Welcome to TIC Portal
```

### Using Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/emails)
2. View sent emails
3. Preview HTML rendering
4. Check delivery status

### Test Email Function

```typescript
// Test all email templates
async function testEmails() {
  const testEmail = "test@example.com";
  
  await sendVerificationEmail(testEmail, "John", "123456");
  await sendWelcomeEmail(testEmail, "John");
  await sendTeamInviteEmail(testEmail, "John", "Team Alpha", "Alice");
  // ... test other templates
}
```

---

## Best Practices

### ✅ Do

- Keep content concise and scannable
- Use clear call-to-action buttons
- Maintain consistent branding
- Test on multiple email clients
- Include relevant information only
- Use proper greeting with first name
- Provide context for all notifications

### ❌ Don't

- Use emojis or icons
- Include too much text
- Use multiple colors
- Add unnecessary images
- Send without user consent
- Forget unsubscribe options (for marketing)
- Use generic greetings

---

## Email Client Compatibility

Tested and optimized for:
- ✅ Gmail (Web, iOS, Android)
- ✅ Outlook (Web, Desktop)
- ✅ Apple Mail (macOS, iOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Mobile email clients

---

## Customization

### Update Colors

Edit `src/shared/utils/email.ts`:

```typescript
const emailTemplate = (content: string) => `
  <style>
    .header { background-color: #YOUR_COLOR; }
    .button { background-color: #YOUR_COLOR; }
  </style>
`;
```

### Add New Template

```typescript
export const sendCustomEmail = async (
  email: string,
  firstName: string,
  customData: any,
) => {
  const content = `
    <p>Hello ${firstName},</p>
    <p>Your custom content here</p>
  `;

  await sendEmail(
    email,
    "Your Subject",
    emailTemplate(content),
  );
};
```

---

## Environment Setup

Required environment variables:

```env
RESEND_API_KEY=re_...
EMAIL_FROM=no-reply@yourdomain.com
CLIENT_URL=http://localhost:3000
```

---

## Monitoring

### Email Delivery Tracking

```typescript
// Log email sends
logger.info({
  to: email,
  subject: subject,
  template: 'welcome',
  timestamp: new Date()
}, 'Email sent');
```

### Error Handling

```typescript
try {
  await sendWelcomeEmail(email, firstName);
} catch (error) {
  logger.error({ error, email }, 'Failed to send welcome email');
  // Don't block user flow on email failure
}
```

---

## Future Enhancements

- 🔲 Add email preferences/unsubscribe
- 🔲 Email templates in multiple languages
- 🔲 A/B testing for email copy
- 🔲 Rich email analytics
- 🔲 Email scheduling
- 🔲 Batch email sending
- 🔲 Email template versioning
