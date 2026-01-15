import { TeamRole } from "@prisma/client";
export declare const sendEmail: (to: string, subject: string, html: string) => Promise<void>;
export declare const sendVerificationEmail: (email: string, firstName: string, otp: string) => Promise<void>;
export declare const sendPasswordResetEmail: (email: string, firstName: string, otp: string) => Promise<void>;
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
//# sourceMappingURL=email.d.ts.map