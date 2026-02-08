import { TeamRole } from "@prisma/client";
export declare const sendEmail: (to: string, subject: string, html: string) => Promise<import("resend").CreateEmailResponse>;
export declare const sendVerificationEmail: (email: string, firstName: string, otp: string) => Promise<import("resend").CreateEmailResponse>;
export declare const sendPasswordResetEmail: (email: string, firstName: string, otp: string) => Promise<import("resend").CreateEmailResponse>;
export declare const sendWelcomeEmail: (email: string, firstName: string) => Promise<void>;
export declare const sendTeamCreatedEmail: (email: string, firstName: string, teamName: string) => Promise<void>;
export declare const sendTeamInviteEmail: (email: string, firstName: string, teamName: string, inviterName: string) => Promise<void>;
export declare const sendTeamRoleUpdateEmail: (email: string, firstName: string, teamName: string, newRole: TeamRole) => Promise<void>;
export declare const sendTeamRemovalEmail: (email: string, firstName: string, teamName: string) => Promise<void>;
export declare const sendSquadInviteEmail: (email: string, firstName: string, squadName: string, schoolName: string) => Promise<void>;
export declare const sendHackathonReminderEmail: (email: string, firstName: string, hackathonName: string, daysLeft: number) => Promise<void>;
export declare const sendMentorAssignmentEmail: (email: string, firstName: string, teamName: string, mentorName: string) => Promise<void>;
export declare const sendTeamJoinRequestEmail: (email: string, firstName: string, teamName: string, requesterName: string, message?: string) => Promise<void>;
export declare const sendJoinRequestAcceptedEmail: (email: string, firstName: string, teamName: string, message?: string) => Promise<void>;
export declare const sendJoinRequestRejectedEmail: (email: string, firstName: string, teamName: string, message?: string) => Promise<void>;
export declare const sendRoleChangeEmail: (user: any, newRole: string, metadata?: any) => Promise<void>;
export declare const sendAffiliateActivationEmail: (user: any, profile: any) => Promise<void>;
export declare const sendPaymentSuccessEmail: (email: string, firstName: string, paymentDetails: {
    amount: number;
    currency: string;
    transactionId: string;
    paymentMethod: string;
    date: Date;
}) => Promise<void>;
export declare const sendPaymentFailedEmail: (email: string, firstName: string, paymentDetails: {
    amount: number;
    currency: string;
    transactionId?: string;
    paymentMethod: string;
    errorMessage?: string;
    date: Date;
}) => Promise<void>;
export declare const sendPaymentPendingEmail: (email: string, firstName: string, paymentDetails: {
    amount: number;
    currency: string;
    transactionId: string;
    paymentMethod: string;
    date: Date;
}) => Promise<void>;
//# sourceMappingURL=email.d.ts.map