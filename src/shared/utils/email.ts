import { Resend } from "resend";
import { env } from "../../config/env";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(`OTP for ${to}: ${text}`); // Log OTP to console

  await resend.emails.send({
    from: env.emailFrom,
    to: [to],
    subject,
    text,
  });
};