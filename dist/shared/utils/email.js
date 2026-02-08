import { Resend } from "resend";
import { env } from "../../config/env.js";
import { TeamRole } from "@prisma/client";
const resend = new Resend(env.resendApiKey);
// Professional email template with TIC Portal branding
const emailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #111827;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #111827;
    }
    .header {
      background-color: #111827;
      padding: 30px 20px;
      text-align: center;
      border-bottom: 2px solid #ffffff;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 2px;
    }
    .content {
      background-color: #ffffff;
      padding: 30px 25px;
      color: #111827;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 16px 0;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      margin: 16px 0;
      background-color: #111827;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
    }
    .footer {
      background-color: #111827;
      padding: 25px 20px;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
      border-top: 2px solid #ffffff;
    }
    .footer p {
      margin: 5px 0;
      opacity: 0.8;
    }
    .footer a {
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .code-box {
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 14px;
      font-family: 'Courier New', monospace;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 3px;
      margin: 16px 0;
      color: #111827;
    }
    .info-box {
      background-color: #f9fafb;
      border-left: 4px solid #111827;
      padding: 14px;
      margin: 16px 0;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TIC PORTAL</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>TIC Summit Portal</p>
      <p>Building Africa's Tech Future</p>
      <p><a href="https://ticsummit.org" target="_blank">ticsummit.org</a></p>
    </div>
  </div>
</body>
</html>
`;
export const sendEmail = async (to, subject, html) => {
    try {
        console.log(`📧 Sending email to ${to}: ${subject}`);
        const result = await resend.emails.send({
            from: env.emailFrom,
            to: [to],
            subject,
            html,
        });
        console.log(`✅ Email sent successfully:`, result);
        return result;
    }
    catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
        throw error;
    }
};
// Email: Email Verification
export const sendVerificationEmail = async (email, firstName, otp) => {
    try {
        console.log(`🔐 Preparing verification email for ${email} with OTP: ${otp}`);
        const content = `
      <p>Hello ${firstName},</p>
      <p>Thank you for joining TIC Portal. Please verify your email address using the code below:</p>
      <div class="code-box">${otp}</div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `;
        const result = await sendEmail(email, "Verify Your Email - TIC Portal", emailTemplate(content));
        console.log(`✅ Verification email sent successfully to ${email}`);
        return result;
    }
    catch (error) {
        console.error(`❌ Failed to send verification email to ${email}:`, error);
        throw error;
    }
};
// Email: Password Reset
export const sendPasswordResetEmail = async (email, firstName, otp) => {
    try {
        console.log(`🔐 Preparing password reset email for ${email} with OTP: ${otp}`);
        const content = `
      <p>Hello ${firstName},</p>
      <p>We received a request to reset your password. Use the code below:</p>
      <div class="code-box">${otp}</div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
    `;
        const result = await sendEmail(email, "Reset Your Password - TIC Portal", emailTemplate(content));
        console.log(`✅ Password reset email sent successfully to ${email}`);
        return result;
    }
    catch (error) {
        console.error(`❌ Failed to send password reset email to ${email}:`, error);
        throw error;
    }
};
// Email: Welcome Email (after verification)
export const sendWelcomeEmail = async (email, firstName) => {
    const content = `
    <p>Welcome ${firstName}!</p>
    <p>Your email has been verified successfully. You're now part of the TIC Summit community.</p>
    <div class="info-box">
      <p><strong>Next Steps:</strong></p>
      <p>• Complete your profile<br>
      • Join or create a squad<br>
      • Start your learning journey<br>
      • Connect with peers and mentors</p>
    </div>
    <p>We're excited to have you on board!</p>
    <a href="${env.clientUrl}/dashboard" class="button">Go to Dashboard</a>
  `;
    await sendEmail(email, "Welcome to TIC Portal", emailTemplate(content));
};
// Email: Team Created Confirmation
export const sendTeamCreatedEmail = async (email, firstName, teamName) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p>Congratulations! Your team <strong>${teamName}</strong> has been created successfully! 🎉</p>
    <div class="info-box">
      <p><strong>Next Steps:</strong></p>
      <p>• Invite team members to join<br>
      • Set up your team profile<br>
      • Start working on your project<br>
      • Explore hackathon opportunities</p>
    </div>
    <p>🏆 <strong>Get inspired!</strong> Explore past TIC Summit projects at <a href="https://ticsummit.org/hall-of-fame" target="_blank" style="color: #111827; font-weight: 600;">ticsummit.org/hall-of-fame</a></p>
    <a href="${env.clientUrl}/teams/${teamName}" class="button">Go to Team</a>
  `;
    await sendEmail(email, `Team Created: ${teamName}`, emailTemplate(content));
};
// Email: Team Invitation
export const sendTeamInviteEmail = async (email, firstName, teamName, inviterName) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p><strong>${inviterName}</strong> has added you to the team <strong>${teamName}</strong>.</p>
    <div class="info-box">
      <p>As a team member, you can now:</p>
      <p>• Collaborate with teammates<br>
      • Participate in hackathons<br>
      • Share ideas and resources<br>
      • Track team progress</p>
    </div>
    <p>🏆 <strong>Get inspired!</strong> Explore past TIC Summit projects at <a href="https://ticsummit.org/hall-of-fame" target="_blank" style="color: #111827; font-weight: 600;">ticsummit.org/hall-of-fame</a></p>
    <a href="${env.clientUrl}/teams/${teamName}" class="button">View Team</a>
  `;
    await sendEmail(email, `You've Been Added to ${teamName}`, emailTemplate(content));
};
// Email: Team Role Update
export const sendTeamRoleUpdateEmail = async (email, firstName, teamName, newRole) => {
    const roleText = newRole === TeamRole.LEAD ? "Team Lead" : "Team Member";
    const content = `
    <p>Hello ${firstName},</p>
    <p>Your role in <strong>${teamName}</strong> has been updated to <strong>${roleText}</strong>.</p>
    ${newRole === TeamRole.LEAD
        ? `
    <div class="info-box">
      <p>As Team Lead, you can now:</p>
      <p>• Add and remove team members<br>
      • Update team information<br>
      • Manage team submissions<br>
      • Assign member roles</p>
    </div>
    `
        : ""}
    <a href="${env.clientUrl}/teams" class="button">View Team</a>
  `;
    await sendEmail(email, `Your Role Has Been Updated - ${teamName}`, emailTemplate(content));
};
// Email: Team Removal
export const sendTeamRemovalEmail = async (email, firstName, teamName) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p>You have been removed from the team <strong>${teamName}</strong>.</p>
    <p>If you believe this was a mistake, please contact your squad leader or a team lead.</p>
    <a href="${env.clientUrl}/teams" class="button">Browse Teams</a>
  `;
    await sendEmail(email, `Team Update - ${teamName}`, emailTemplate(content));
};
// Email: Squad Invitation
export const sendSquadInviteEmail = async (email, firstName, squadName, schoolName) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p>You've been invited to join <strong>${squadName}</strong> from <strong>${schoolName}</strong>.</p>
    <div class="info-box">
      <p>Join your squad to:</p>
      <p>• Connect with peers from your school<br>
      • Form teams for hackathons<br>
      • Access exclusive resources<br>
      • Compete in squad challenges</p>
    </div>
    <a href="${env.clientUrl}/squads" class="button">Join Squad</a>
  `;
    await sendEmail(email, `Join ${squadName} - TIC Portal`, emailTemplate(content));
};
// Email: Hackathon Reminder
export const sendHackathonReminderEmail = async (email, firstName, hackathonName, daysLeft) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p>Reminder: <strong>${hackathonName}</strong> submission deadline is approaching.</p>
    <div class="info-box">
      <p><strong>${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining</strong></p>
      <p>Make sure your team's submission is ready!</p>
    </div>
    <a href="${env.clientUrl}/hackathons" class="button">Submit Now</a>
  `;
    await sendEmail(email, `Reminder: ${hackathonName} Deadline Approaching`, emailTemplate(content));
};
// Email: Mentor Assignment
export const sendMentorAssignmentEmail = async (email, firstName, teamName, mentorName) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p>Great news! <strong>${mentorName}</strong> has been assigned as a mentor to your team <strong>${teamName}</strong>.</p>
    <div class="info-box">
      <p>Your mentor will help you with:</p>
      <p>• Technical guidance<br>
      • Project planning<br>
      • Best practices<br>
      • Career advice</p>
    </div>
    <a href="${env.clientUrl}/mentorship" class="button">Connect with Mentor</a>
  `;
    await sendEmail(email, "Mentor Assigned to Your Team", emailTemplate(content));
};
// Email: Team Join Request Sent
export const sendTeamJoinRequestEmail = async (email, firstName, teamName, requesterName, message) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p><strong>${requesterName}</strong> has requested to join your team <strong>${teamName}</strong>.</p>
    ${message ? `<div class="info-box"><p><strong>Message from ${requesterName}:</strong></p><p>"${message}"</p></div>` : ""}
    <p>Please review this request and take action.</p>
    <a href="${env.clientUrl}/teams/${teamName}/requests" class="button">Review Request</a>
  `;
    await sendEmail(email, `Join Request for ${teamName}`, emailTemplate(content));
};
// Email: Join Request Accepted
export const sendJoinRequestAcceptedEmail = async (email, firstName, teamName, message) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p>Great news! Your request to join <strong>${teamName}</strong> has been accepted! 🎉</p>
    ${message ? `<div class="info-box"><p><strong>Message from team lead:</strong></p><p>"${message}"</p></div>` : ""}
    <p>You can now collaborate with your team members and access team resources.</p>
    <a href="${env.clientUrl}/teams/${teamName}" class="button">Go to Team</a>
  `;
    await sendEmail(email, `Welcome to ${teamName}!`, emailTemplate(content));
};
// Email: Join Request Rejected
export const sendJoinRequestRejectedEmail = async (email, firstName, teamName, message) => {
    const content = `
    <p>Hello ${firstName},</p>
    <p>Thank you for your interest in joining <strong>${teamName}</strong>.</p>
    <p>Unfortunately, your join request has not been accepted at this time.</p>
    ${message ? `<div class="info-box"><p><strong>Message from team lead:</strong></p><p>"${message}"</p></div>` : ""}
    <p>Don't be discouraged! There are many other teams you can join or you can create your own team.</p>
    <a href="${env.clientUrl}/teams" class="button">Browse Teams</a>
  `;
    await sendEmail(email, `Join Request Update - ${teamName}`, emailTemplate(content));
};
export const sendRoleChangeEmail = async (user, newRole, metadata) => {
    const roleDetails = getRoleDetails(newRole, metadata);
    const content = `
    <h2>🎉 Your Role Has Been Updated!</h2>
    <p>Hello ${user.firstName},</p>
    <p>Great news! Your role on the TIC Summit Portal has been updated.</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>Previous Role:</strong> ${user.role}</p>
      <p style="margin: 10px 0 0 0;"><strong>New Role:</strong> ${newRole}</p>
    </div>

    ${roleDetails.message}

    <div style="margin-top: 30px;">
      <a href="${env.clientUrl}/dashboard" class="button">Access Your Dashboard</a>
    </div>
  `;
    await sendEmail(user.email, `Your Role Has Been Updated - TIC Portal`, emailTemplate(content));
};
function getRoleDetails(role, metadata) {
    switch (role) {
        case "AFFILIATE":
            return {
                message: `
          <h3>Welcome to the TIC Affiliate Program!</h3>
          <p>You can now refer students and earn commissions:</p>
          <div class="info-box">
            <p><strong>Your Referral Code:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${metadata?.referralCode || 'Pending'}</code></p>
            <p><strong>Your Region:</strong> ${metadata?.regionName}, ${metadata?.countryName}</p>
            <p><strong>Commission per Student:</strong> 450 CFA</p>
          </div>
          <p><em>Note: Your account is pending activation. You'll receive another email once activated by an admin.</em></p>
        `
            };
        case "REGIONAL_COORDINATOR":
            return {
                message: `
          <h3>You're Now a Regional Coordinator!</h3>
          <p>You'll oversee affiliates in your region and earn commissions on all regional students.</p>
          <div class="info-box">
            <p><strong>Region:</strong> ${metadata?.regionName}</p>
            <p><strong>Country:</strong> ${metadata?.countryName}</p>
            <p><strong>Commission per Student:</strong> 300 CFA</p>
          </div>
        `
            };
        case "NATIONAL_COORDINATOR":
            return {
                message: `
          <h3>You're Now a National Coordinator!</h3>
          <p>You'll oversee all regions in your country and earn commissions on all national students.</p>
          <div class="info-box">
            <p><strong>Country:</strong> ${metadata?.countryName}</p>
            <p><strong>Commission per Student:</strong> 250 CFA</p>
          </div>
        `
            };
        default:
            return {
                message: `<p>Your account permissions have been updated. Please check your dashboard for details.</p>`
            };
    }
}
export const sendAffiliateActivationEmail = async (user, profile) => {
    const content = `
    <h2>✅ Your Affiliate Account is Now Active!</h2>
    <p>Hello ${user.firstName},</p>
    <p>Congratulations! Your affiliate account has been activated and you can now start referring students.</p>
    
    <div class="success-box" style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #10b981;">📋 Your Affiliate Details</h3>
      <p><strong>Referral Code:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${profile.referralCode}</code></p>
      <p><strong>Referral Link:</strong><br>
        <a href="${profile.referralLink}" style="color: #10b981; word-break: break-all;">${profile.referralLink}</a>
      </p>
      <p><strong>Commission:</strong> 450 CFA per activated student</p>
    </div>

    <h3>🎯 How It Works:</h3>
    <ol style="line-height: 1.8;">
      <li>Share your referral link with potential students</li>
      <li>They sign up using your link</li>
      <li>They pay 5,300 CFA and complete their first action</li>
      <li>You earn 450 CFA commission (paid after 14-day cooling period)</li>
    </ol>

    <div style="margin-top: 30px;">
      <a href="${env.clientUrl}/affiliate/dashboard" class="button" style="background: #10b981;">
        View Affiliate Dashboard
      </a>
    </div>
  `;
    await sendEmail(user.email, `🎉 Your Affiliate Account is Active - TIC Portal`, emailTemplate(content));
};
// Email: Payment Success
export const sendPaymentSuccessEmail = async (email, firstName, paymentDetails) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: paymentDetails.currency,
        minimumFractionDigits: 0,
    }).format(paymentDetails.amount);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(paymentDetails.date);
    const content = `
    <h2>✅ Payment Successful!</h2>
    <p>Hello ${firstName},</p>
    <p>Your payment has been processed successfully. Welcome to TIC Summit Training Portal! 🎉</p>
    
    <div class="success-box" style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #10b981;">💳 Payment Receipt</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;"><strong>Amount:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${paymentDetails.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${paymentDetails.transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Date:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formattedDate}</td>
        </tr>
      </table>
    </div>

    <h3>🚀 What's Next?</h3>
    <div class="info-box">
      <p>Your account is now fully activated! Here's what you can do:</p>
      <ul style="line-height: 1.8; margin: 10px 0;">
        <li>Complete your profile</li>
        <li>Join or create a squad</li>
        <li>Access learning resources</li>
        <li>Connect with mentors and peers</li>
        <li>Participate in hackathons</li>
      </ul>
    </div>

    <p style="margin-top: 20px;">If you have any questions about your payment or need a detailed receipt, please contact our support team.</p>

    <div style="margin-top: 30px;">
      <a href="${env.clientUrl}/dashboard" class="button" style="background: #10b981;">
        Go to Dashboard
      </a>
    </div>
  `;
    await sendEmail(email, `Payment Successful - TIC Portal`, emailTemplate(content));
};
// Email: Payment Failed
export const sendPaymentFailedEmail = async (email, firstName, paymentDetails) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: paymentDetails.currency,
        minimumFractionDigits: 0,
    }).format(paymentDetails.amount);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(paymentDetails.date);
    const content = `
    <h2>❌ Payment Failed</h2>
    <p>Hello ${firstName},</p>
    <p>We're sorry, but your recent payment attempt was unsuccessful.</p>
    
    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #ef4444;">💳 Payment Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;"><strong>Amount:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${paymentDetails.paymentMethod}</td>
        </tr>
        ${paymentDetails.transactionId ? `
        <tr>
          <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${paymentDetails.transactionId}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0;"><strong>Date:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formattedDate}</td>
        </tr>
        ${paymentDetails.errorMessage ? `
        <tr>
          <td style="padding: 8px 0; vertical-align: top;"><strong>Reason:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${paymentDetails.errorMessage}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <h3>🔄 What Can You Do?</h3>
    <div class="info-box">
      <p><strong>Common reasons for payment failure:</strong></p>
      <ul style="line-height: 1.8; margin: 10px 0;">
        <li>Insufficient funds in your account</li>
        <li>Network or connectivity issues</li>
        <li>Incorrect payment details</li>
        <li>Transaction timeout</li>
      </ul>
      <p style="margin-top: 15px;"><strong>Next steps:</strong></p>
      <ul style="line-height: 1.8; margin: 10px 0;">
        <li>Verify your account has sufficient funds</li>
        <li>Check your mobile money PIN is correct</li>
        <li>Ensure you have a stable internet connection</li>
        <li>Try again in a few minutes</li>
      </ul>
    </div>

    <p style="margin-top: 20px;">If you continue to experience issues, please contact our support team with the transaction details above.</p>

    <div style="margin-top: 30px;">
      <a href="${env.clientUrl}/payment" class="button">
        Try Again
      </a>
    </div>

    <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
      <em>Note: If money was deducted from your account but the payment still failed, please contact support immediately with your transaction ID. We'll resolve this within 24 hours.</em>
    </p>
  `;
    await sendEmail(email, `Payment Failed - TIC Portal`, emailTemplate(content));
};
// Email: Payment Pending
export const sendPaymentPendingEmail = async (email, firstName, paymentDetails) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: paymentDetails.currency,
        minimumFractionDigits: 0,
    }).format(paymentDetails.amount);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(paymentDetails.date);
    const content = `
    <h2>⏳ Payment Pending</h2>
    <p>Hello ${firstName},</p>
    <p>Your payment is currently being processed. This usually takes a few minutes.</p>
    
    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #f59e0b;">💳 Payment Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0;"><strong>Amount:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${paymentDetails.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${paymentDetails.transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Date:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formattedDate}</td>
        </tr>
      </table>
    </div>

    <div class="info-box">
      <p><strong>What happens next?</strong></p>
      <ul style="line-height: 1.8; margin: 10px 0;">
        <li>We're verifying your payment with the mobile money provider</li>
        <li>You'll receive a confirmation email once payment is successful</li>
        <li>This typically takes 2-5 minutes</li>
        <li>You can check your payment status on the dashboard</li>
      </ul>
    </div>

    <p style="margin-top: 20px;"><strong>Important:</strong> Please do not make another payment while this one is pending.</p>

    <div style="margin-top: 30px;">
      <a href="${env.clientUrl}/payment/status?txId=${paymentDetails.transactionId}" class="button">
        Check Payment Status
      </a>
    </div>

    <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
      <em>If your payment status doesn't update within 15 minutes, please contact support with your transaction ID.</em>
    </p>
  `;
    await sendEmail(email, `Payment Pending - TIC Portal`, emailTemplate(content));
};
//# sourceMappingURL=email.js.map