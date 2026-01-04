import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 * Core user and auth models
 */
export type User = Prisma.UserModel;
/**
 * Model OTP
 *
 */
export type OTP = Prisma.OTPModel;
/**
 * Model RefreshToken
 *
 */
export type RefreshToken = Prisma.RefreshTokenModel;
/**
 * Model Squad
 * Organizations
 */
export type Squad = Prisma.SquadModel;
/**
 * Model SquadMember
 *
 */
export type SquadMember = Prisma.SquadMemberModel;
/**
 * Model Team
 * Teams & Collaboration
 */
export type Team = Prisma.TeamModel;
/**
 * Model TeamMember
 *
 */
export type TeamMember = Prisma.TeamMemberModel;
/**
 * Model TeamChat
 *
 */
export type TeamChat = Prisma.TeamChatModel;
/**
 * Model Stage
 * Learning Path
 */
export type Stage = Prisma.StageModel;
/**
 * Model Resource
 *
 */
export type Resource = Prisma.ResourceModel;
/**
 * Model Quiz
 *
 */
export type Quiz = Prisma.QuizModel;
/**
 * Model QuizQuestion
 *
 */
export type QuizQuestion = Prisma.QuizQuestionModel;
/**
 * Model UserProgress
 *
 */
export type UserProgress = Prisma.UserProgressModel;
/**
 * Model Hackathon
 * Hackathons
 */
export type Hackathon = Prisma.HackathonModel;
/**
 * Model Submission
 *
 */
export type Submission = Prisma.SubmissionModel;
/**
 * Model Score
 *
 */
export type Score = Prisma.ScoreModel;
/**
 * Model MentorRequest
 * Mentorship
 */
export type MentorRequest = Prisma.MentorRequestModel;
/**
 * Model MentorAssignment
 *
 */
export type MentorAssignment = Prisma.MentorAssignmentModel;
/**
 * Model MentorSession
 *
 */
export type MentorSession = Prisma.MentorSessionModel;
/**
 * Model Point
 * Gamification
 */
export type Point = Prisma.PointModel;
/**
 * Model Badge
 *
 */
export type Badge = Prisma.BadgeModel;
/**
 * Model UserBadge
 *
 */
export type UserBadge = Prisma.UserBadgeModel;
/**
 * Model Leaderboard
 *
 */
export type Leaderboard = Prisma.LeaderboardModel;
/**
 * Model Notification
 * Notifications
 */
export type Notification = Prisma.NotificationModel;
/**
 * Model Portfolio
 * Portfolio
 */
export type Portfolio = Prisma.PortfolioModel;
//# sourceMappingURL=client.d.ts.map