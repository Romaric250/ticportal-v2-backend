import { sendEmail } from "../../shared/utils/email";
import { env } from "../../config/env";
import { logger } from "../../shared/utils/logger";

const portalBase = () => env.clientUrl?.replace(/\/$/, "") || "https://portal.ticsummit.org";

export async function notifyReviewerStatusGranted(email: string, firstName: string, granted: boolean) {
  const subject = granted ? "You are now a TIC Summit reviewer" : "Reviewer access updated";
  const html = `
    <p>Hello ${firstName},</p>
    <p>${
      granted
        ? "You have been granted reviewer access. You can sign in to the portal to view assigned teams and submit grades."
        : "Your reviewer access has been revoked. Contact an administrator if this is unexpected."
    }</p>
    <p><a href="${portalBase()}" style="color:#111827;font-weight:600;">Open portal</a></p>
  `;
  try {
    await sendEmail(email, subject, html);
  } catch (e: any) {
    logger.warn({ err: e?.message }, "notifyReviewerStatusGranted failed");
  }
}

export async function notifyTeamAssignment(
  email: string,
  firstName: string,
  teamName: string,
  teamId: string
) {
  const subject = `New team assignment: ${teamName}`;
  const html = `
    <p>Hello ${firstName},</p>
    <p>You have been assigned to review team <strong>${teamName}</strong>.</p>
    <p><a href="${portalBase()}/en/reviewer/grading" style="color:#111827;font-weight:600;">Open grading dashboard</a></p>
  `;
  try {
    await sendEmail(email, subject, html);
  } catch (e: any) {
    logger.warn({ err: e?.message, teamId }, "notifyTeamAssignment failed");
  }
}

export async function notifyPeerReviewSubmitted(
  email: string,
  firstName: string,
  teamName: string,
  otherReviewerName: string
) {
  const subject = `Peer review update — ${teamName}`;
  const html = `
    <p>Hello ${firstName},</p>
    <p>${otherReviewerName} has submitted their review for <strong>${teamName}</strong>.</p>
    <p><a href="${portalBase()}/en/reviewer/grading" style="color:#111827;font-weight:600;">Open grading dashboard</a></p>
  `;
  try {
    await sendEmail(email, subject, html);
  } catch (e: any) {
    logger.warn({ err: e?.message }, "notifyPeerReviewSubmitted failed");
  }
}

export async function notifyGradeFinalized(email: string, firstName: string, teamName: string, finalScore: number) {
  const subject = `Grades finalized — ${teamName}`;
  const html = `
    <p>Hello ${firstName},</p>
    <p>Final grading for <strong>${teamName}</strong> has been published.</p>
    <p>Final score: <strong>${finalScore.toFixed(2)}</strong> / 100</p>
  `;
  try {
    await sendEmail(email, subject, html);
  } catch (e: any) {
    logger.warn({ err: e?.message }, "notifyGradeFinalized failed");
  }
}
