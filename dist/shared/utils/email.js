import { Resend } from "resend";
import { env } from "../../config/env";
const resend = new Resend(env.resendApiKey);
export const sendEmail = async (to, subject, text) => {
    console.log(`Sending email to ${to}: ${subject}`);
    console.log(`Content: ${text}`); // Log email content to console
    await resend.emails.send({
        from: env.emailFrom,
        to: [to],
        subject,
        text,
    });
};
//# sourceMappingURL=email.js.map