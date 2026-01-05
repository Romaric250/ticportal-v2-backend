import { Resend } from "resend";
import { env } from "../../config/env";
import { TeamRole } from "@prisma/client";

const resend = new Resend(env.resendApiKey);

// Professional email template with TIC Portal branding
const emailTemplate = (content: string) => `
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
      padding: 40px 20px;
      text-align: center;
      border-bottom: 2px solid #ffffff;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 2px;
    }
    .content {
      background-color: #ffffff;
      padding: 40px 30px;
      color: #111827;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 20px 0;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      margin: 20px 0;
      background-color: #111827;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 16px;
    }
    .footer {
      background-color: #111827;
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      border-top: 2px solid #ffffff;
    }
    .footer p {
      margin: 5px 0;
      opacity: 0.8;
    }
    .code-box {
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 16px;
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 4px;
      margin: 20px 0;
      color: #111827;
    }
    .info-box {
      background-color: #f9fafb;
      border-left: 4px solid #111827;
      padding: 16px;
      margin: 20px 0;
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
    </div>
  </div>
</body>
</html>
`;

export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log(`Sending email to ${to}: ${subject}`);

  await resend.emails.send({
    from: env.emailFrom,
    to: [to],
    subject,
    html,
  });
};

// Email: Email Verification
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  otp: string,
) => {
  const content = `
    <p>Hello ${firstName},</p>
    <p>Thank you for joining TIC Portal. Please verify your email address using the code below:</p>
    <div class="code-box">${otp}</div>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

  await sendEmail(
    email,
    "Verify Your Email - TIC Portal",
    emailTemplate(content),
  );
};

// Email: Password Reset
export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  otp: string,
) => {
  const content = `
    <p>Hello ${firstName},</p>
    <p>We received a request to reset your password. Use the code below:</p>
    <div class="code-box">${otp}</div>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
  `;

  await sendEmail(
    email,
    "Reset Your Password - TIC Portal",
    emailTemplate(content),
  );
};

// Email: Welcome Email (after verification)
export const sendWelcomeEmail = async (email: string, firstName: string) => {
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

// Email: Team Invitation
export const sendTeamInviteEmail = async (
  email: string,
  firstName: string,
  teamName: string,
  inviterName: string,
) => {
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
    <a href="${env.clientUrl}/teams/${teamName}" class="button">View Team</a>
  `;

  await sendEmail(
    email,
    `You've Been Added to ${teamName}`,
    emailTemplate(content),
  );
};

// Email: Team Role Update
export const sendTeamRoleUpdateEmail = async (
  email: string,
  firstName: string,
  teamName: string,
  newRole: TeamRole,
) => {
  const roleText = newRole === TeamRole.LEAD ? "Team Lead" : "Team Member";
  const content = `
    <p>Hello ${firstName},</p>
    <p>Your role in <strong>${teamName}</strong> has been updated to <strong>${roleText}</strong>.</p>
    ${
      newRole === TeamRole.LEAD
        ? `
    <div class="info-box">
      <p>As Team Lead, you can now:</p>
      <p>• Add and remove team members<br>
      • Update team information<br>
      • Manage team submissions<br>
      • Assign member roles</p>
    </div>
    `
        : ""
    }
    <a href="${env.clientUrl}/teams" class="button">View Team</a>
  `;

  await sendEmail(
    email,
    `Your Role Has Been Updated - ${teamName}`,
    emailTemplate(content),
  );
};

// Email: Team Removal
export const sendTeamRemovalEmail = async (
  email: string,
  firstName: string,
  teamName: string,
) => {
  const content = `
    <p>Hello ${firstName},</p>
    <p>You have been removed from the team <strong>${teamName}</strong>.</p>
    <p>If you believe this was a mistake, please contact your squad leader or a team lead.</p>
    <a href="${env.clientUrl}/teams" class="button">Browse Teams</a>
  `;

  await sendEmail(
    email,
    `Team Update - ${teamName}`,
    emailTemplate(content),
  );
};

// Email: Squad Invitation
export const sendSquadInviteEmail = async (
  email: string,
  firstName: string,
  squadName: string,
  schoolName: string,
) => {
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

  await sendEmail(
    email,
    `Join ${squadName} - TIC Portal`,
    emailTemplate(content),
  );
};

// Email: Hackathon Reminder
export const sendHackathonReminderEmail = async (
  email: string,
  firstName: string,
  hackathonName: string,
  daysLeft: number,
) => {
  const content = `
    <p>Hello ${firstName},</p>
    <p>Reminder: <strong>${hackathonName}</strong> submission deadline is approaching.</p>
    <div class="info-box">
      <p><strong>${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining</strong></p>
      <p>Make sure your team's submission is ready!</p>
    </div>
    <a href="${env.clientUrl}/hackathons" class="button">Submit Now</a>
  `;

  await sendEmail(
    email,
    `Reminder: ${hackathonName} Deadline Approaching`,
    emailTemplate(content),
  );
};

// Email: Mentor Assignment
export const sendMentorAssignmentEmail = async (
  email: string,
  firstName: string,
  teamName: string,
  mentorName: string,
) => {
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

  await sendEmail(
    email,
    "Mentor Assigned to Your Team",
    emailTemplate(content),
  );
};