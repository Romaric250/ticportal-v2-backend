import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.2.0
 * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "oTP" | "refreshToken" | "squad" | "squadMember" | "team" | "teamMember" | "teamChat" | "stage" | "resource" | "quiz" | "quizQuestion" | "userProgress" | "hackathon" | "submission" | "score" | "mentorRequest" | "mentorAssignment" | "mentorSession" | "point" | "badge" | "userBadge" | "leaderboard" | "notification" | "portfolio";
        txIsolationLevel: never;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.UserFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.UserAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        OTP: {
            payload: Prisma.$OTPPayload<ExtArgs>;
            fields: Prisma.OTPFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OTPFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OTPFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload>;
                };
                findFirst: {
                    args: Prisma.OTPFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OTPFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload>;
                };
                findMany: {
                    args: Prisma.OTPFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload>[];
                };
                create: {
                    args: Prisma.OTPCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload>;
                };
                createMany: {
                    args: Prisma.OTPCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.OTPDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload>;
                };
                update: {
                    args: Prisma.OTPUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload>;
                };
                deleteMany: {
                    args: Prisma.OTPDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OTPUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.OTPUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OTPPayload>;
                };
                aggregate: {
                    args: Prisma.OTPAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOTP>;
                };
                groupBy: {
                    args: Prisma.OTPGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OTPGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.OTPFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.OTPAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.OTPCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OTPCountAggregateOutputType> | number;
                };
            };
        };
        RefreshToken: {
            payload: Prisma.$RefreshTokenPayload<ExtArgs>;
            fields: Prisma.RefreshTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findFirst: {
                    args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                findMany: {
                    args: Prisma.RefreshTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[];
                };
                create: {
                    args: Prisma.RefreshTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                createMany: {
                    args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.RefreshTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                update: {
                    args: Prisma.RefreshTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.RefreshTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefreshTokenPayload>;
                };
                aggregate: {
                    args: Prisma.RefreshTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefreshToken>;
                };
                groupBy: {
                    args: Prisma.RefreshTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.RefreshTokenFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.RefreshTokenAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.RefreshTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefreshTokenCountAggregateOutputType> | number;
                };
            };
        };
        Squad: {
            payload: Prisma.$SquadPayload<ExtArgs>;
            fields: Prisma.SquadFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SquadFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SquadFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload>;
                };
                findFirst: {
                    args: Prisma.SquadFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SquadFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload>;
                };
                findMany: {
                    args: Prisma.SquadFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload>[];
                };
                create: {
                    args: Prisma.SquadCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload>;
                };
                createMany: {
                    args: Prisma.SquadCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SquadDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload>;
                };
                update: {
                    args: Prisma.SquadUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload>;
                };
                deleteMany: {
                    args: Prisma.SquadDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SquadUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SquadUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadPayload>;
                };
                aggregate: {
                    args: Prisma.SquadAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSquad>;
                };
                groupBy: {
                    args: Prisma.SquadGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SquadGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.SquadFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.SquadAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.SquadCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SquadCountAggregateOutputType> | number;
                };
            };
        };
        SquadMember: {
            payload: Prisma.$SquadMemberPayload<ExtArgs>;
            fields: Prisma.SquadMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SquadMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SquadMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload>;
                };
                findFirst: {
                    args: Prisma.SquadMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SquadMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload>;
                };
                findMany: {
                    args: Prisma.SquadMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload>[];
                };
                create: {
                    args: Prisma.SquadMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload>;
                };
                createMany: {
                    args: Prisma.SquadMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SquadMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload>;
                };
                update: {
                    args: Prisma.SquadMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.SquadMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SquadMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SquadMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SquadMemberPayload>;
                };
                aggregate: {
                    args: Prisma.SquadMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSquadMember>;
                };
                groupBy: {
                    args: Prisma.SquadMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SquadMemberGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.SquadMemberFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.SquadMemberAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.SquadMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SquadMemberCountAggregateOutputType> | number;
                };
            };
        };
        Team: {
            payload: Prisma.$TeamPayload<ExtArgs>;
            fields: Prisma.TeamFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                findFirst: {
                    args: Prisma.TeamFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                findMany: {
                    args: Prisma.TeamFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>[];
                };
                create: {
                    args: Prisma.TeamCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                createMany: {
                    args: Prisma.TeamCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                update: {
                    args: Prisma.TeamUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamPayload>;
                };
                aggregate: {
                    args: Prisma.TeamAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeam>;
                };
                groupBy: {
                    args: Prisma.TeamGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.TeamFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.TeamAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.TeamCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamCountAggregateOutputType> | number;
                };
            };
        };
        TeamMember: {
            payload: Prisma.$TeamMemberPayload<ExtArgs>;
            fields: Prisma.TeamMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                findFirst: {
                    args: Prisma.TeamMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                findMany: {
                    args: Prisma.TeamMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>[];
                };
                create: {
                    args: Prisma.TeamMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                createMany: {
                    args: Prisma.TeamMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                update: {
                    args: Prisma.TeamMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamMemberPayload>;
                };
                aggregate: {
                    args: Prisma.TeamMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeamMember>;
                };
                groupBy: {
                    args: Prisma.TeamMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamMemberGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.TeamMemberFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.TeamMemberAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.TeamMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamMemberCountAggregateOutputType> | number;
                };
            };
        };
        TeamChat: {
            payload: Prisma.$TeamChatPayload<ExtArgs>;
            fields: Prisma.TeamChatFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TeamChatFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TeamChatFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload>;
                };
                findFirst: {
                    args: Prisma.TeamChatFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TeamChatFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload>;
                };
                findMany: {
                    args: Prisma.TeamChatFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload>[];
                };
                create: {
                    args: Prisma.TeamChatCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload>;
                };
                createMany: {
                    args: Prisma.TeamChatCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.TeamChatDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload>;
                };
                update: {
                    args: Prisma.TeamChatUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload>;
                };
                deleteMany: {
                    args: Prisma.TeamChatDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TeamChatUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.TeamChatUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TeamChatPayload>;
                };
                aggregate: {
                    args: Prisma.TeamChatAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTeamChat>;
                };
                groupBy: {
                    args: Prisma.TeamChatGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamChatGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.TeamChatFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.TeamChatAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.TeamChatCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TeamChatCountAggregateOutputType> | number;
                };
            };
        };
        Stage: {
            payload: Prisma.$StagePayload<ExtArgs>;
            fields: Prisma.StageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload>;
                };
                findFirst: {
                    args: Prisma.StageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload>;
                };
                findMany: {
                    args: Prisma.StageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload>[];
                };
                create: {
                    args: Prisma.StageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload>;
                };
                createMany: {
                    args: Prisma.StageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.StageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload>;
                };
                update: {
                    args: Prisma.StageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload>;
                };
                deleteMany: {
                    args: Prisma.StageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.StageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StagePayload>;
                };
                aggregate: {
                    args: Prisma.StageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStage>;
                };
                groupBy: {
                    args: Prisma.StageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StageGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.StageFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.StageAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.StageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StageCountAggregateOutputType> | number;
                };
            };
        };
        Resource: {
            payload: Prisma.$ResourcePayload<ExtArgs>;
            fields: Prisma.ResourceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ResourceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ResourceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload>;
                };
                findFirst: {
                    args: Prisma.ResourceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ResourceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload>;
                };
                findMany: {
                    args: Prisma.ResourceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload>[];
                };
                create: {
                    args: Prisma.ResourceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload>;
                };
                createMany: {
                    args: Prisma.ResourceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ResourceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload>;
                };
                update: {
                    args: Prisma.ResourceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload>;
                };
                deleteMany: {
                    args: Prisma.ResourceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ResourceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ResourceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResourcePayload>;
                };
                aggregate: {
                    args: Prisma.ResourceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateResource>;
                };
                groupBy: {
                    args: Prisma.ResourceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ResourceGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.ResourceFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.ResourceAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.ResourceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ResourceCountAggregateOutputType> | number;
                };
            };
        };
        Quiz: {
            payload: Prisma.$QuizPayload<ExtArgs>;
            fields: Prisma.QuizFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.QuizFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.QuizFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload>;
                };
                findFirst: {
                    args: Prisma.QuizFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.QuizFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload>;
                };
                findMany: {
                    args: Prisma.QuizFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload>[];
                };
                create: {
                    args: Prisma.QuizCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload>;
                };
                createMany: {
                    args: Prisma.QuizCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.QuizDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload>;
                };
                update: {
                    args: Prisma.QuizUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload>;
                };
                deleteMany: {
                    args: Prisma.QuizDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.QuizUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.QuizUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizPayload>;
                };
                aggregate: {
                    args: Prisma.QuizAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateQuiz>;
                };
                groupBy: {
                    args: Prisma.QuizGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuizGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.QuizFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.QuizAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.QuizCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuizCountAggregateOutputType> | number;
                };
            };
        };
        QuizQuestion: {
            payload: Prisma.$QuizQuestionPayload<ExtArgs>;
            fields: Prisma.QuizQuestionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.QuizQuestionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.QuizQuestionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload>;
                };
                findFirst: {
                    args: Prisma.QuizQuestionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.QuizQuestionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload>;
                };
                findMany: {
                    args: Prisma.QuizQuestionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload>[];
                };
                create: {
                    args: Prisma.QuizQuestionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload>;
                };
                createMany: {
                    args: Prisma.QuizQuestionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.QuizQuestionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload>;
                };
                update: {
                    args: Prisma.QuizQuestionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload>;
                };
                deleteMany: {
                    args: Prisma.QuizQuestionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.QuizQuestionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.QuizQuestionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$QuizQuestionPayload>;
                };
                aggregate: {
                    args: Prisma.QuizQuestionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateQuizQuestion>;
                };
                groupBy: {
                    args: Prisma.QuizQuestionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuizQuestionGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.QuizQuestionFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.QuizQuestionAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.QuizQuestionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.QuizQuestionCountAggregateOutputType> | number;
                };
            };
        };
        UserProgress: {
            payload: Prisma.$UserProgressPayload<ExtArgs>;
            fields: Prisma.UserProgressFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserProgressFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserProgressFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>;
                };
                findFirst: {
                    args: Prisma.UserProgressFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserProgressFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>;
                };
                findMany: {
                    args: Prisma.UserProgressFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>[];
                };
                create: {
                    args: Prisma.UserProgressCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>;
                };
                createMany: {
                    args: Prisma.UserProgressCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserProgressDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>;
                };
                update: {
                    args: Prisma.UserProgressUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>;
                };
                deleteMany: {
                    args: Prisma.UserProgressDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserProgressUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserProgressUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserProgressPayload>;
                };
                aggregate: {
                    args: Prisma.UserProgressAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserProgress>;
                };
                groupBy: {
                    args: Prisma.UserProgressGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserProgressGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.UserProgressFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.UserProgressAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.UserProgressCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserProgressCountAggregateOutputType> | number;
                };
            };
        };
        Hackathon: {
            payload: Prisma.$HackathonPayload<ExtArgs>;
            fields: Prisma.HackathonFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HackathonFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HackathonFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload>;
                };
                findFirst: {
                    args: Prisma.HackathonFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HackathonFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload>;
                };
                findMany: {
                    args: Prisma.HackathonFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload>[];
                };
                create: {
                    args: Prisma.HackathonCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload>;
                };
                createMany: {
                    args: Prisma.HackathonCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.HackathonDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload>;
                };
                update: {
                    args: Prisma.HackathonUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload>;
                };
                deleteMany: {
                    args: Prisma.HackathonDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HackathonUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.HackathonUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HackathonPayload>;
                };
                aggregate: {
                    args: Prisma.HackathonAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHackathon>;
                };
                groupBy: {
                    args: Prisma.HackathonGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HackathonGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.HackathonFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.HackathonAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.HackathonCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HackathonCountAggregateOutputType> | number;
                };
            };
        };
        Submission: {
            payload: Prisma.$SubmissionPayload<ExtArgs>;
            fields: Prisma.SubmissionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubmissionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubmissionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload>;
                };
                findFirst: {
                    args: Prisma.SubmissionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubmissionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload>;
                };
                findMany: {
                    args: Prisma.SubmissionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload>[];
                };
                create: {
                    args: Prisma.SubmissionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload>;
                };
                createMany: {
                    args: Prisma.SubmissionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.SubmissionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload>;
                };
                update: {
                    args: Prisma.SubmissionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload>;
                };
                deleteMany: {
                    args: Prisma.SubmissionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubmissionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.SubmissionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubmissionPayload>;
                };
                aggregate: {
                    args: Prisma.SubmissionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubmission>;
                };
                groupBy: {
                    args: Prisma.SubmissionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubmissionGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.SubmissionFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.SubmissionAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.SubmissionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubmissionCountAggregateOutputType> | number;
                };
            };
        };
        Score: {
            payload: Prisma.$ScorePayload<ExtArgs>;
            fields: Prisma.ScoreFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ScoreFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ScoreFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload>;
                };
                findFirst: {
                    args: Prisma.ScoreFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ScoreFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload>;
                };
                findMany: {
                    args: Prisma.ScoreFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload>[];
                };
                create: {
                    args: Prisma.ScoreCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload>;
                };
                createMany: {
                    args: Prisma.ScoreCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.ScoreDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload>;
                };
                update: {
                    args: Prisma.ScoreUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload>;
                };
                deleteMany: {
                    args: Prisma.ScoreDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ScoreUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.ScoreUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScorePayload>;
                };
                aggregate: {
                    args: Prisma.ScoreAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateScore>;
                };
                groupBy: {
                    args: Prisma.ScoreGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScoreGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.ScoreFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.ScoreAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.ScoreCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScoreCountAggregateOutputType> | number;
                };
            };
        };
        MentorRequest: {
            payload: Prisma.$MentorRequestPayload<ExtArgs>;
            fields: Prisma.MentorRequestFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MentorRequestFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MentorRequestFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload>;
                };
                findFirst: {
                    args: Prisma.MentorRequestFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MentorRequestFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload>;
                };
                findMany: {
                    args: Prisma.MentorRequestFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload>[];
                };
                create: {
                    args: Prisma.MentorRequestCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload>;
                };
                createMany: {
                    args: Prisma.MentorRequestCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MentorRequestDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload>;
                };
                update: {
                    args: Prisma.MentorRequestUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload>;
                };
                deleteMany: {
                    args: Prisma.MentorRequestDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MentorRequestUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MentorRequestUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorRequestPayload>;
                };
                aggregate: {
                    args: Prisma.MentorRequestAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMentorRequest>;
                };
                groupBy: {
                    args: Prisma.MentorRequestGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentorRequestGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.MentorRequestFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.MentorRequestAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.MentorRequestCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentorRequestCountAggregateOutputType> | number;
                };
            };
        };
        MentorAssignment: {
            payload: Prisma.$MentorAssignmentPayload<ExtArgs>;
            fields: Prisma.MentorAssignmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MentorAssignmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MentorAssignmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload>;
                };
                findFirst: {
                    args: Prisma.MentorAssignmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MentorAssignmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload>;
                };
                findMany: {
                    args: Prisma.MentorAssignmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload>[];
                };
                create: {
                    args: Prisma.MentorAssignmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload>;
                };
                createMany: {
                    args: Prisma.MentorAssignmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MentorAssignmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload>;
                };
                update: {
                    args: Prisma.MentorAssignmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload>;
                };
                deleteMany: {
                    args: Prisma.MentorAssignmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MentorAssignmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MentorAssignmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorAssignmentPayload>;
                };
                aggregate: {
                    args: Prisma.MentorAssignmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMentorAssignment>;
                };
                groupBy: {
                    args: Prisma.MentorAssignmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentorAssignmentGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.MentorAssignmentFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.MentorAssignmentAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.MentorAssignmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentorAssignmentCountAggregateOutputType> | number;
                };
            };
        };
        MentorSession: {
            payload: Prisma.$MentorSessionPayload<ExtArgs>;
            fields: Prisma.MentorSessionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MentorSessionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MentorSessionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload>;
                };
                findFirst: {
                    args: Prisma.MentorSessionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MentorSessionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload>;
                };
                findMany: {
                    args: Prisma.MentorSessionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload>[];
                };
                create: {
                    args: Prisma.MentorSessionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload>;
                };
                createMany: {
                    args: Prisma.MentorSessionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.MentorSessionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload>;
                };
                update: {
                    args: Prisma.MentorSessionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload>;
                };
                deleteMany: {
                    args: Prisma.MentorSessionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MentorSessionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.MentorSessionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MentorSessionPayload>;
                };
                aggregate: {
                    args: Prisma.MentorSessionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMentorSession>;
                };
                groupBy: {
                    args: Prisma.MentorSessionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentorSessionGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.MentorSessionFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.MentorSessionAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.MentorSessionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MentorSessionCountAggregateOutputType> | number;
                };
            };
        };
        Point: {
            payload: Prisma.$PointPayload<ExtArgs>;
            fields: Prisma.PointFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PointFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PointFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload>;
                };
                findFirst: {
                    args: Prisma.PointFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PointFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload>;
                };
                findMany: {
                    args: Prisma.PointFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload>[];
                };
                create: {
                    args: Prisma.PointCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload>;
                };
                createMany: {
                    args: Prisma.PointCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PointDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload>;
                };
                update: {
                    args: Prisma.PointUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload>;
                };
                deleteMany: {
                    args: Prisma.PointDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PointUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PointUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PointPayload>;
                };
                aggregate: {
                    args: Prisma.PointAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePoint>;
                };
                groupBy: {
                    args: Prisma.PointGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PointGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.PointFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.PointAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.PointCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PointCountAggregateOutputType> | number;
                };
            };
        };
        Badge: {
            payload: Prisma.$BadgePayload<ExtArgs>;
            fields: Prisma.BadgeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BadgeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BadgeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload>;
                };
                findFirst: {
                    args: Prisma.BadgeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BadgeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload>;
                };
                findMany: {
                    args: Prisma.BadgeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload>[];
                };
                create: {
                    args: Prisma.BadgeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload>;
                };
                createMany: {
                    args: Prisma.BadgeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.BadgeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload>;
                };
                update: {
                    args: Prisma.BadgeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload>;
                };
                deleteMany: {
                    args: Prisma.BadgeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BadgeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.BadgeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BadgePayload>;
                };
                aggregate: {
                    args: Prisma.BadgeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBadge>;
                };
                groupBy: {
                    args: Prisma.BadgeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BadgeGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.BadgeFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.BadgeAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.BadgeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BadgeCountAggregateOutputType> | number;
                };
            };
        };
        UserBadge: {
            payload: Prisma.$UserBadgePayload<ExtArgs>;
            fields: Prisma.UserBadgeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserBadgeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserBadgeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload>;
                };
                findFirst: {
                    args: Prisma.UserBadgeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserBadgeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload>;
                };
                findMany: {
                    args: Prisma.UserBadgeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload>[];
                };
                create: {
                    args: Prisma.UserBadgeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload>;
                };
                createMany: {
                    args: Prisma.UserBadgeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.UserBadgeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload>;
                };
                update: {
                    args: Prisma.UserBadgeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload>;
                };
                deleteMany: {
                    args: Prisma.UserBadgeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserBadgeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.UserBadgeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserBadgePayload>;
                };
                aggregate: {
                    args: Prisma.UserBadgeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserBadge>;
                };
                groupBy: {
                    args: Prisma.UserBadgeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserBadgeGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.UserBadgeFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.UserBadgeAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.UserBadgeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserBadgeCountAggregateOutputType> | number;
                };
            };
        };
        Leaderboard: {
            payload: Prisma.$LeaderboardPayload<ExtArgs>;
            fields: Prisma.LeaderboardFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LeaderboardFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LeaderboardFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload>;
                };
                findFirst: {
                    args: Prisma.LeaderboardFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LeaderboardFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload>;
                };
                findMany: {
                    args: Prisma.LeaderboardFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload>[];
                };
                create: {
                    args: Prisma.LeaderboardCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload>;
                };
                createMany: {
                    args: Prisma.LeaderboardCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.LeaderboardDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload>;
                };
                update: {
                    args: Prisma.LeaderboardUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload>;
                };
                deleteMany: {
                    args: Prisma.LeaderboardDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LeaderboardUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.LeaderboardUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LeaderboardPayload>;
                };
                aggregate: {
                    args: Prisma.LeaderboardAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLeaderboard>;
                };
                groupBy: {
                    args: Prisma.LeaderboardGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LeaderboardGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.LeaderboardFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.LeaderboardAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.LeaderboardCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LeaderboardCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.NotificationFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.NotificationAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
        Portfolio: {
            payload: Prisma.$PortfolioPayload<ExtArgs>;
            fields: Prisma.PortfolioFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PortfolioFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PortfolioFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                findFirst: {
                    args: Prisma.PortfolioFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PortfolioFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                findMany: {
                    args: Prisma.PortfolioFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>[];
                };
                create: {
                    args: Prisma.PortfolioCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                createMany: {
                    args: Prisma.PortfolioCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                delete: {
                    args: Prisma.PortfolioDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                update: {
                    args: Prisma.PortfolioUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                deleteMany: {
                    args: Prisma.PortfolioDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PortfolioUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                upsert: {
                    args: Prisma.PortfolioUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PortfolioPayload>;
                };
                aggregate: {
                    args: Prisma.PortfolioAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePortfolio>;
                };
                groupBy: {
                    args: Prisma.PortfolioGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioGroupByOutputType>[];
                };
                findRaw: {
                    args: Prisma.PortfolioFindRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                aggregateRaw: {
                    args: Prisma.PortfolioAggregateRawArgs<ExtArgs>;
                    result: Prisma.JsonObject;
                };
                count: {
                    args: Prisma.PortfolioCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PortfolioCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $runCommandRaw: {
                args: Prisma.InputJsonObject;
                result: JsonObject;
            };
        };
    };
};
/**
 * Enums
 */
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
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'UserRole'
 */
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
/**
 * Reference to a field of type 'UserRole[]'
 */
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'OTPType'
 */
export type EnumOTPTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OTPType'>;
/**
 * Reference to a field of type 'OTPType[]'
 */
export type ListEnumOTPTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OTPType[]'>;
/**
 * Reference to a field of type 'SquadStatus'
 */
export type EnumSquadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SquadStatus'>;
/**
 * Reference to a field of type 'SquadStatus[]'
 */
export type ListEnumSquadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SquadStatus[]'>;
/**
 * Reference to a field of type 'SquadRole'
 */
export type EnumSquadRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SquadRole'>;
/**
 * Reference to a field of type 'SquadRole[]'
 */
export type ListEnumSquadRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SquadRole[]'>;
/**
 * Reference to a field of type 'TeamRole'
 */
export type EnumTeamRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamRole'>;
/**
 * Reference to a field of type 'TeamRole[]'
 */
export type ListEnumTeamRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamRole[]'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'ResourceType'
 */
export type EnumResourceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ResourceType'>;
/**
 * Reference to a field of type 'ResourceType[]'
 */
export type ListEnumResourceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ResourceType[]'>;
/**
 * Reference to a field of type 'ProgressStatus'
 */
export type EnumProgressStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgressStatus'>;
/**
 * Reference to a field of type 'ProgressStatus[]'
 */
export type ListEnumProgressStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProgressStatus[]'>;
/**
 * Reference to a field of type 'HackathonLevel'
 */
export type EnumHackathonLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HackathonLevel'>;
/**
 * Reference to a field of type 'HackathonLevel[]'
 */
export type ListEnumHackathonLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HackathonLevel[]'>;
/**
 * Reference to a field of type 'HackathonStatus'
 */
export type EnumHackathonStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HackathonStatus'>;
/**
 * Reference to a field of type 'HackathonStatus[]'
 */
export type ListEnumHackathonStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HackathonStatus[]'>;
/**
 * Reference to a field of type 'MentorRequestStatus'
 */
export type EnumMentorRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MentorRequestStatus'>;
/**
 * Reference to a field of type 'MentorRequestStatus[]'
 */
export type ListEnumMentorRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MentorRequestStatus[]'>;
/**
 * Reference to a field of type 'NotificationType'
 */
export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>;
/**
 * Reference to a field of type 'NotificationType[]'
 */
export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    oTP?: Prisma.OTPOmit;
    refreshToken?: Prisma.RefreshTokenOmit;
    squad?: Prisma.SquadOmit;
    squadMember?: Prisma.SquadMemberOmit;
    team?: Prisma.TeamOmit;
    teamMember?: Prisma.TeamMemberOmit;
    teamChat?: Prisma.TeamChatOmit;
    stage?: Prisma.StageOmit;
    resource?: Prisma.ResourceOmit;
    quiz?: Prisma.QuizOmit;
    quizQuestion?: Prisma.QuizQuestionOmit;
    userProgress?: Prisma.UserProgressOmit;
    hackathon?: Prisma.HackathonOmit;
    submission?: Prisma.SubmissionOmit;
    score?: Prisma.ScoreOmit;
    mentorRequest?: Prisma.MentorRequestOmit;
    mentorAssignment?: Prisma.MentorAssignmentOmit;
    mentorSession?: Prisma.MentorSessionOmit;
    point?: Prisma.PointOmit;
    badge?: Prisma.BadgeOmit;
    userBadge?: Prisma.UserBadgeOmit;
    leaderboard?: Prisma.LeaderboardOmit;
    notification?: Prisma.NotificationOmit;
    portfolio?: Prisma.PortfolioOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map