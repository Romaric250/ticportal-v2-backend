import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: any;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: any;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: any;
export declare const ModelName: {
    readonly User: "User";
    readonly OTP: "OTP";
    readonly RefreshToken: "RefreshToken";
    readonly Squad: "Squad";
    readonly SquadMember: "SquadMember";
    readonly Team: "Team";
    readonly TeamMember: "TeamMember";
    readonly TeamChat: "TeamChat";
    readonly Stage: "Stage";
    readonly Resource: "Resource";
    readonly Quiz: "Quiz";
    readonly QuizQuestion: "QuizQuestion";
    readonly UserProgress: "UserProgress";
    readonly Hackathon: "Hackathon";
    readonly Submission: "Submission";
    readonly Score: "Score";
    readonly MentorRequest: "MentorRequest";
    readonly MentorAssignment: "MentorAssignment";
    readonly MentorSession: "MentorSession";
    readonly Point: "Point";
    readonly Badge: "Badge";
    readonly UserBadge: "UserBadge";
    readonly Leaderboard: "Leaderboard";
    readonly Notification: "Notification";
    readonly Portfolio: "Portfolio";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly password: "password";
    readonly role: "role";
    readonly firstName: "firstName";
    readonly schoolName: "schoolName";
    readonly lastName: "lastName";
    readonly phone: "phone";
    readonly isVerified: "isVerified";
    readonly lastLogin: "lastLogin";
    readonly squadId: "squadId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const OTPScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly code: "code";
    readonly expiresAt: "expiresAt";
    readonly type: "type";
    readonly createdAt: "createdAt";
};
export type OTPScalarFieldEnum = (typeof OTPScalarFieldEnum)[keyof typeof OTPScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly token: "token";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const SquadScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly schoolName: "schoolName";
    readonly region: "region";
    readonly area: "area";
    readonly leadId: "leadId";
    readonly status: "status";
    readonly createdAt: "createdAt";
};
export type SquadScalarFieldEnum = (typeof SquadScalarFieldEnum)[keyof typeof SquadScalarFieldEnum];
export declare const SquadMemberScalarFieldEnum: {
    readonly id: "id";
    readonly squadId: "squadId";
    readonly userId: "userId";
    readonly role: "role";
    readonly joinedAt: "joinedAt";
};
export type SquadMemberScalarFieldEnum = (typeof SquadMemberScalarFieldEnum)[keyof typeof SquadMemberScalarFieldEnum];
export declare const TeamScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly squadId: "squadId";
    readonly projectTitle: "projectTitle";
    readonly description: "description";
    readonly createdAt: "createdAt";
};
export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum];
export declare const TeamMemberScalarFieldEnum: {
    readonly id: "id";
    readonly teamId: "teamId";
    readonly userId: "userId";
    readonly role: "role";
    readonly joinedAt: "joinedAt";
};
export type TeamMemberScalarFieldEnum = (typeof TeamMemberScalarFieldEnum)[keyof typeof TeamMemberScalarFieldEnum];
export declare const TeamChatScalarFieldEnum: {
    readonly id: "id";
    readonly teamId: "teamId";
    readonly senderId: "senderId";
    readonly message: "message";
    readonly attachments: "attachments";
    readonly createdAt: "createdAt";
};
export type TeamChatScalarFieldEnum = (typeof TeamChatScalarFieldEnum)[keyof typeof TeamChatScalarFieldEnum];
export declare const StageScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly order: "order";
    readonly unlockCriteria: "unlockCriteria";
    readonly description: "description";
};
export type StageScalarFieldEnum = (typeof StageScalarFieldEnum)[keyof typeof StageScalarFieldEnum];
export declare const ResourceScalarFieldEnum: {
    readonly id: "id";
    readonly stageId: "stageId";
    readonly title: "title";
    readonly type: "type";
    readonly url: "url";
    readonly duration: "duration";
    readonly order: "order";
};
export type ResourceScalarFieldEnum = (typeof ResourceScalarFieldEnum)[keyof typeof ResourceScalarFieldEnum];
export declare const QuizScalarFieldEnum: {
    readonly id: "id";
    readonly stageId: "stageId";
    readonly title: "title";
    readonly passingScore: "passingScore";
};
export type QuizScalarFieldEnum = (typeof QuizScalarFieldEnum)[keyof typeof QuizScalarFieldEnum];
export declare const QuizQuestionScalarFieldEnum: {
    readonly id: "id";
    readonly quizId: "quizId";
    readonly question: "question";
    readonly options: "options";
    readonly correctAnswer: "correctAnswer";
    readonly points: "points";
};
export type QuizQuestionScalarFieldEnum = (typeof QuizQuestionScalarFieldEnum)[keyof typeof QuizQuestionScalarFieldEnum];
export declare const UserProgressScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly stageId: "stageId";
    readonly status: "status";
    readonly score: "score";
    readonly completedAt: "completedAt";
};
export type UserProgressScalarFieldEnum = (typeof UserProgressScalarFieldEnum)[keyof typeof UserProgressScalarFieldEnum];
export declare const HackathonScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly level: "level";
    readonly squadId: "squadId";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly status: "status";
};
export type HackathonScalarFieldEnum = (typeof HackathonScalarFieldEnum)[keyof typeof HackathonScalarFieldEnum];
export declare const SubmissionScalarFieldEnum: {
    readonly id: "id";
    readonly hackathonId: "hackathonId";
    readonly teamId: "teamId";
    readonly title: "title";
    readonly description: "description";
    readonly fileUrls: "fileUrls";
    readonly submittedAt: "submittedAt";
};
export type SubmissionScalarFieldEnum = (typeof SubmissionScalarFieldEnum)[keyof typeof SubmissionScalarFieldEnum];
export declare const ScoreScalarFieldEnum: {
    readonly id: "id";
    readonly submissionId: "submissionId";
    readonly judgeId: "judgeId";
    readonly criteria: "criteria";
    readonly score: "score";
    readonly feedback: "feedback";
};
export type ScoreScalarFieldEnum = (typeof ScoreScalarFieldEnum)[keyof typeof ScoreScalarFieldEnum];
export declare const MentorRequestScalarFieldEnum: {
    readonly id: "id";
    readonly teamId: "teamId";
    readonly mentorId: "mentorId";
    readonly status: "status";
    readonly priority: "priority";
    readonly message: "message";
    readonly createdAt: "createdAt";
};
export type MentorRequestScalarFieldEnum = (typeof MentorRequestScalarFieldEnum)[keyof typeof MentorRequestScalarFieldEnum];
export declare const MentorAssignmentScalarFieldEnum: {
    readonly id: "id";
    readonly mentorId: "mentorId";
    readonly teamId: "teamId";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
};
export type MentorAssignmentScalarFieldEnum = (typeof MentorAssignmentScalarFieldEnum)[keyof typeof MentorAssignmentScalarFieldEnum];
export declare const MentorSessionScalarFieldEnum: {
    readonly id: "id";
    readonly assignmentId: "assignmentId";
    readonly date: "date";
    readonly duration: "duration";
    readonly notes: "notes";
    readonly teamId: "teamId";
};
export type MentorSessionScalarFieldEnum = (typeof MentorSessionScalarFieldEnum)[keyof typeof MentorSessionScalarFieldEnum];
export declare const PointScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly amount: "amount";
    readonly reason: "reason";
    readonly createdAt: "createdAt";
};
export type PointScalarFieldEnum = (typeof PointScalarFieldEnum)[keyof typeof PointScalarFieldEnum];
export declare const BadgeScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly imageUrl: "imageUrl";
    readonly criteria: "criteria";
};
export type BadgeScalarFieldEnum = (typeof BadgeScalarFieldEnum)[keyof typeof BadgeScalarFieldEnum];
export declare const UserBadgeScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly badgeId: "badgeId";
    readonly earnedAt: "earnedAt";
};
export type UserBadgeScalarFieldEnum = (typeof UserBadgeScalarFieldEnum)[keyof typeof UserBadgeScalarFieldEnum];
export declare const LeaderboardScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly teamId: "teamId";
    readonly squadId: "squadId";
    readonly points: "points";
    readonly rank: "rank";
    readonly period: "period";
};
export type LeaderboardScalarFieldEnum = (typeof LeaderboardScalarFieldEnum)[keyof typeof LeaderboardScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly title: "title";
    readonly message: "message";
    readonly isRead: "isRead";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const PortfolioScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly bio: "bio";
    readonly skills: "skills";
    readonly achievements: "achievements";
    readonly certificateUrls: "certificateUrls";
    readonly generatedAt: "generatedAt";
};
export type PortfolioScalarFieldEnum = (typeof PortfolioScalarFieldEnum)[keyof typeof PortfolioScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map