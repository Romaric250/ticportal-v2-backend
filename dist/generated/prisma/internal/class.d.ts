import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
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
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
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
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
       * @example
       * ```
       * const [george, bob, alice] = await prisma.$transaction([
       *   prisma.user.create({ data: { name: 'George' } }),
       *   prisma.user.create({ data: { name: 'Bob' } }),
       *   prisma.user.create({ data: { name: 'Alice' } }),
       * ])
       * ```
       *
       * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
       */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
    }): runtime.Types.Utils.JsPromise<R>;
    /**
     * Executes a raw MongoDB command and returns the result of it.
     * @example
     * ```
     * const user = await prisma.$runCommandRaw({
     *   aggregate: 'User',
     *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
     *   explain: false,
     * })
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.oTP`: Exposes CRUD operations for the **OTP** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OTPS
      * const oTPS = await prisma.oTP.findMany()
      * ```
      */
    get oTP(): Prisma.OTPDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RefreshTokens
      * const refreshTokens = await prisma.refreshToken.findMany()
      * ```
      */
    get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.squad`: Exposes CRUD operations for the **Squad** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Squads
      * const squads = await prisma.squad.findMany()
      * ```
      */
    get squad(): Prisma.SquadDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.squadMember`: Exposes CRUD operations for the **SquadMember** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SquadMembers
      * const squadMembers = await prisma.squadMember.findMany()
      * ```
      */
    get squadMember(): Prisma.SquadMemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.team`: Exposes CRUD operations for the **Team** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Teams
      * const teams = await prisma.team.findMany()
      * ```
      */
    get team(): Prisma.TeamDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teamMember`: Exposes CRUD operations for the **TeamMember** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeamMembers
      * const teamMembers = await prisma.teamMember.findMany()
      * ```
      */
    get teamMember(): Prisma.TeamMemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.teamChat`: Exposes CRUD operations for the **TeamChat** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TeamChats
      * const teamChats = await prisma.teamChat.findMany()
      * ```
      */
    get teamChat(): Prisma.TeamChatDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.stage`: Exposes CRUD operations for the **Stage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Stages
      * const stages = await prisma.stage.findMany()
      * ```
      */
    get stage(): Prisma.StageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.resource`: Exposes CRUD operations for the **Resource** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Resources
      * const resources = await prisma.resource.findMany()
      * ```
      */
    get resource(): Prisma.ResourceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.quiz`: Exposes CRUD operations for the **Quiz** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Quizzes
      * const quizzes = await prisma.quiz.findMany()
      * ```
      */
    get quiz(): Prisma.QuizDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.quizQuestion`: Exposes CRUD operations for the **QuizQuestion** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more QuizQuestions
      * const quizQuestions = await prisma.quizQuestion.findMany()
      * ```
      */
    get quizQuestion(): Prisma.QuizQuestionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.userProgress`: Exposes CRUD operations for the **UserProgress** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UserProgresses
      * const userProgresses = await prisma.userProgress.findMany()
      * ```
      */
    get userProgress(): Prisma.UserProgressDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.hackathon`: Exposes CRUD operations for the **Hackathon** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Hackathons
      * const hackathons = await prisma.hackathon.findMany()
      * ```
      */
    get hackathon(): Prisma.HackathonDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.submission`: Exposes CRUD operations for the **Submission** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Submissions
      * const submissions = await prisma.submission.findMany()
      * ```
      */
    get submission(): Prisma.SubmissionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.score`: Exposes CRUD operations for the **Score** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Scores
      * const scores = await prisma.score.findMany()
      * ```
      */
    get score(): Prisma.ScoreDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mentorRequest`: Exposes CRUD operations for the **MentorRequest** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MentorRequests
      * const mentorRequests = await prisma.mentorRequest.findMany()
      * ```
      */
    get mentorRequest(): Prisma.MentorRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mentorAssignment`: Exposes CRUD operations for the **MentorAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MentorAssignments
      * const mentorAssignments = await prisma.mentorAssignment.findMany()
      * ```
      */
    get mentorAssignment(): Prisma.MentorAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mentorSession`: Exposes CRUD operations for the **MentorSession** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MentorSessions
      * const mentorSessions = await prisma.mentorSession.findMany()
      * ```
      */
    get mentorSession(): Prisma.MentorSessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.point`: Exposes CRUD operations for the **Point** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Points
      * const points = await prisma.point.findMany()
      * ```
      */
    get point(): Prisma.PointDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.badge`: Exposes CRUD operations for the **Badge** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Badges
      * const badges = await prisma.badge.findMany()
      * ```
      */
    get badge(): Prisma.BadgeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.userBadge`: Exposes CRUD operations for the **UserBadge** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UserBadges
      * const userBadges = await prisma.userBadge.findMany()
      * ```
      */
    get userBadge(): Prisma.UserBadgeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.leaderboard`: Exposes CRUD operations for the **Leaderboard** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Leaderboards
      * const leaderboards = await prisma.leaderboard.findMany()
      * ```
      */
    get leaderboard(): Prisma.LeaderboardDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Notifications
      * const notifications = await prisma.notification.findMany()
      * ```
      */
    get notification(): Prisma.NotificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.portfolio`: Exposes CRUD operations for the **Portfolio** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Portfolios
      * const portfolios = await prisma.portfolio.findMany()
      * ```
      */
    get portfolio(): Prisma.PortfolioDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map