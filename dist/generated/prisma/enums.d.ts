export declare const UserRole: {
    readonly STUDENT: "STUDENT";
    readonly MENTOR: "MENTOR";
    readonly JUDGE: "JUDGE";
    readonly SQUAD_LEAD: "SQUAD_LEAD";
    readonly ADMIN: "ADMIN";
    readonly SUPER_ADMIN: "SUPER_ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const OTPType: {
    readonly EMAIL_VERIFICATION: "EMAIL_VERIFICATION";
    readonly PASSWORD_RESET: "PASSWORD_RESET";
};
export type OTPType = (typeof OTPType)[keyof typeof OTPType];
export declare const SquadStatus: {
    readonly PENDING: "PENDING";
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
};
export type SquadStatus = (typeof SquadStatus)[keyof typeof SquadStatus];
export declare const SquadRole: {
    readonly STUDENT: "STUDENT";
    readonly SQUAD_LEAD: "SQUAD_LEAD";
};
export type SquadRole = (typeof SquadRole)[keyof typeof SquadRole];
export declare const TeamRole: {
    readonly MEMBER: "MEMBER";
    readonly LEAD: "LEAD";
};
export type TeamRole = (typeof TeamRole)[keyof typeof TeamRole];
export declare const ResourceType: {
    readonly VIDEO: "VIDEO";
    readonly DOCUMENT: "DOCUMENT";
    readonly QUIZ: "QUIZ";
    readonly ASSIGNMENT: "ASSIGNMENT";
};
export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];
export declare const ProgressStatus: {
    readonly NOT_STARTED: "NOT_STARTED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
};
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];
export declare const HackathonLevel: {
    readonly SCHOOL: "SCHOOL";
    readonly AREA: "AREA";
    readonly REGIONAL: "REGIONAL";
    readonly NATIONAL: "NATIONAL";
};
export type HackathonLevel = (typeof HackathonLevel)[keyof typeof HackathonLevel];
export declare const HackathonStatus: {
    readonly UPCOMING: "UPCOMING";
    readonly ONGOING: "ONGOING";
    readonly COMPLETED: "COMPLETED";
};
export type HackathonStatus = (typeof HackathonStatus)[keyof typeof HackathonStatus];
export declare const MentorRequestStatus: {
    readonly PENDING: "PENDING";
    readonly ASSIGNED: "ASSIGNED";
    readonly REJECTED: "REJECTED";
};
export type MentorRequestStatus = (typeof MentorRequestStatus)[keyof typeof MentorRequestStatus];
export declare const NotificationType: {
    readonly STAGE_REMINDER: "STAGE_REMINDER";
    readonly MENTOR_REQUEST: "MENTOR_REQUEST";
    readonly HACKATHON_UPDATE: "HACKATHON_UPDATE";
    readonly SQUAD_ANNOUNCEMENT: "SQUAD_ANNOUNCEMENT";
    readonly BADGE_NOTIFICATION: "BADGE_NOTIFICATION";
    readonly SUBMISSION_DEADLINE: "SUBMISSION_DEADLINE";
    readonly GENERAL: "GENERAL";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
//# sourceMappingURL=enums.d.ts.map