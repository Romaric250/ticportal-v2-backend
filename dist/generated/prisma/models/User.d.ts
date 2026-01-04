import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model User
 * Core user and auth models
 */
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    role: $Enums.UserRole | null;
    firstName: string | null;
    schoolName: string | null;
    lastName: string | null;
    phone: string | null;
    isVerified: boolean | null;
    lastLogin: Date | null;
    squadId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    role: $Enums.UserRole | null;
    firstName: string | null;
    schoolName: string | null;
    lastName: string | null;
    phone: string | null;
    isVerified: boolean | null;
    lastLogin: Date | null;
    squadId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    password: number;
    role: number;
    firstName: number;
    schoolName: number;
    lastName: number;
    phone: number;
    isVerified: number;
    lastLogin: number;
    squadId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    role?: true;
    firstName?: true;
    schoolName?: true;
    lastName?: true;
    phone?: true;
    isVerified?: true;
    lastLogin?: true;
    squadId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    role?: true;
    firstName?: true;
    schoolName?: true;
    lastName?: true;
    phone?: true;
    isVerified?: true;
    lastLogin?: true;
    squadId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    role?: true;
    firstName?: true;
    schoolName?: true;
    lastName?: true;
    phone?: true;
    isVerified?: true;
    lastLogin?: true;
    squadId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone: string | null;
    isVerified: boolean;
    lastLogin: Date | null;
    squadId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    password?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    firstName?: Prisma.StringFilter<"User"> | string;
    schoolName?: Prisma.StringFilter<"User"> | string;
    lastName?: Prisma.StringFilter<"User"> | string;
    phone?: Prisma.StringNullableFilter<"User"> | string | null;
    isVerified?: Prisma.BoolFilter<"User"> | boolean;
    lastLogin?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    squadId?: Prisma.StringNullableFilter<"User"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    otps?: Prisma.OTPListRelationFilter;
    refreshTokens?: Prisma.RefreshTokenListRelationFilter;
    squadMembers?: Prisma.SquadMemberListRelationFilter;
    teamMembers?: Prisma.TeamMemberListRelationFilter;
    teamChats?: Prisma.TeamChatListRelationFilter;
    points?: Prisma.PointListRelationFilter;
    userBadges?: Prisma.UserBadgeListRelationFilter;
    leaderboards?: Prisma.LeaderboardListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    portfolio?: Prisma.XOR<Prisma.PortfolioNullableScalarRelationFilter, Prisma.PortfolioWhereInput> | null;
    squads?: Prisma.SquadListRelationFilter;
    userProgresses?: Prisma.UserProgressListRelationFilter;
    scores?: Prisma.ScoreListRelationFilter;
    mentorRequests?: Prisma.MentorRequestListRelationFilter;
    mentorAssignments?: Prisma.MentorAssignmentListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    lastLogin?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    otps?: Prisma.OTPOrderByRelationAggregateInput;
    refreshTokens?: Prisma.RefreshTokenOrderByRelationAggregateInput;
    squadMembers?: Prisma.SquadMemberOrderByRelationAggregateInput;
    teamMembers?: Prisma.TeamMemberOrderByRelationAggregateInput;
    teamChats?: Prisma.TeamChatOrderByRelationAggregateInput;
    points?: Prisma.PointOrderByRelationAggregateInput;
    userBadges?: Prisma.UserBadgeOrderByRelationAggregateInput;
    leaderboards?: Prisma.LeaderboardOrderByRelationAggregateInput;
    notifications?: Prisma.NotificationOrderByRelationAggregateInput;
    portfolio?: Prisma.PortfolioOrderByWithRelationInput;
    squads?: Prisma.SquadOrderByRelationAggregateInput;
    userProgresses?: Prisma.UserProgressOrderByRelationAggregateInput;
    scores?: Prisma.ScoreOrderByRelationAggregateInput;
    mentorRequests?: Prisma.MentorRequestOrderByRelationAggregateInput;
    mentorAssignments?: Prisma.MentorAssignmentOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    phone?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    password?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    firstName?: Prisma.StringFilter<"User"> | string;
    schoolName?: Prisma.StringFilter<"User"> | string;
    lastName?: Prisma.StringFilter<"User"> | string;
    isVerified?: Prisma.BoolFilter<"User"> | boolean;
    lastLogin?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    squadId?: Prisma.StringNullableFilter<"User"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    otps?: Prisma.OTPListRelationFilter;
    refreshTokens?: Prisma.RefreshTokenListRelationFilter;
    squadMembers?: Prisma.SquadMemberListRelationFilter;
    teamMembers?: Prisma.TeamMemberListRelationFilter;
    teamChats?: Prisma.TeamChatListRelationFilter;
    points?: Prisma.PointListRelationFilter;
    userBadges?: Prisma.UserBadgeListRelationFilter;
    leaderboards?: Prisma.LeaderboardListRelationFilter;
    notifications?: Prisma.NotificationListRelationFilter;
    portfolio?: Prisma.XOR<Prisma.PortfolioNullableScalarRelationFilter, Prisma.PortfolioWhereInput> | null;
    squads?: Prisma.SquadListRelationFilter;
    userProgresses?: Prisma.UserProgressListRelationFilter;
    scores?: Prisma.ScoreListRelationFilter;
    mentorRequests?: Prisma.MentorRequestListRelationFilter;
    mentorAssignments?: Prisma.MentorAssignmentListRelationFilter;
}, "id" | "email" | "phone">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    lastLogin?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    password?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole;
    firstName?: Prisma.StringWithAggregatesFilter<"User"> | string;
    schoolName?: Prisma.StringWithAggregatesFilter<"User"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"User"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    isVerified?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    lastLogin?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    squadId?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserUpdateInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    lastLogin?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    lastLogin?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    isVerified?: Prisma.SortOrder;
    lastLogin?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
    unset?: boolean;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
    unset?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutOtpsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOtpsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutOtpsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOtpsInput;
    upsert?: Prisma.UserUpsertWithoutOtpsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOtpsInput, Prisma.UserUpdateWithoutOtpsInput>, Prisma.UserUncheckedUpdateWithoutOtpsInput>;
};
export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRefreshTokensInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutRefreshTokensInput;
    upsert?: Prisma.UserUpsertWithoutRefreshTokensInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutRefreshTokensInput, Prisma.UserUpdateWithoutRefreshTokensInput>, Prisma.UserUncheckedUpdateWithoutRefreshTokensInput>;
};
export type UserCreateNestedOneWithoutSquadsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSquadsInput, Prisma.UserUncheckedCreateWithoutSquadsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSquadsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSquadsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSquadsInput, Prisma.UserUncheckedCreateWithoutSquadsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSquadsInput;
    upsert?: Prisma.UserUpsertWithoutSquadsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSquadsInput, Prisma.UserUpdateWithoutSquadsInput>, Prisma.UserUncheckedUpdateWithoutSquadsInput>;
};
export type UserCreateNestedOneWithoutSquadMembersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSquadMembersInput, Prisma.UserUncheckedCreateWithoutSquadMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSquadMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSquadMembersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSquadMembersInput, Prisma.UserUncheckedCreateWithoutSquadMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSquadMembersInput;
    upsert?: Prisma.UserUpsertWithoutSquadMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSquadMembersInput, Prisma.UserUpdateWithoutSquadMembersInput>, Prisma.UserUncheckedUpdateWithoutSquadMembersInput>;
};
export type UserCreateNestedOneWithoutTeamMembersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamMembersInput, Prisma.UserUncheckedCreateWithoutTeamMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutTeamMembersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamMembersInput, Prisma.UserUncheckedCreateWithoutTeamMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamMembersInput;
    upsert?: Prisma.UserUpsertWithoutTeamMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTeamMembersInput, Prisma.UserUpdateWithoutTeamMembersInput>, Prisma.UserUncheckedUpdateWithoutTeamMembersInput>;
};
export type UserCreateNestedOneWithoutTeamChatsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamChatsInput, Prisma.UserUncheckedCreateWithoutTeamChatsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamChatsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutTeamChatsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTeamChatsInput, Prisma.UserUncheckedCreateWithoutTeamChatsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTeamChatsInput;
    upsert?: Prisma.UserUpsertWithoutTeamChatsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTeamChatsInput, Prisma.UserUpdateWithoutTeamChatsInput>, Prisma.UserUncheckedUpdateWithoutTeamChatsInput>;
};
export type UserCreateNestedOneWithoutUserProgressesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUserProgressesInput, Prisma.UserUncheckedCreateWithoutUserProgressesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUserProgressesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutUserProgressesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUserProgressesInput, Prisma.UserUncheckedCreateWithoutUserProgressesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUserProgressesInput;
    upsert?: Prisma.UserUpsertWithoutUserProgressesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutUserProgressesInput, Prisma.UserUpdateWithoutUserProgressesInput>, Prisma.UserUncheckedUpdateWithoutUserProgressesInput>;
};
export type UserCreateNestedOneWithoutScoresInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutScoresInput, Prisma.UserUncheckedCreateWithoutScoresInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutScoresInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutScoresNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutScoresInput, Prisma.UserUncheckedCreateWithoutScoresInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutScoresInput;
    upsert?: Prisma.UserUpsertWithoutScoresInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutScoresInput, Prisma.UserUpdateWithoutScoresInput>, Prisma.UserUncheckedUpdateWithoutScoresInput>;
};
export type UserCreateNestedOneWithoutMentorRequestsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMentorRequestsInput, Prisma.UserUncheckedCreateWithoutMentorRequestsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMentorRequestsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutMentorRequestsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMentorRequestsInput, Prisma.UserUncheckedCreateWithoutMentorRequestsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMentorRequestsInput;
    upsert?: Prisma.UserUpsertWithoutMentorRequestsInput;
    disconnect?: boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutMentorRequestsInput, Prisma.UserUpdateWithoutMentorRequestsInput>, Prisma.UserUncheckedUpdateWithoutMentorRequestsInput>;
};
export type UserCreateNestedOneWithoutMentorAssignmentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMentorAssignmentsInput, Prisma.UserUncheckedCreateWithoutMentorAssignmentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMentorAssignmentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutMentorAssignmentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutMentorAssignmentsInput, Prisma.UserUncheckedCreateWithoutMentorAssignmentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutMentorAssignmentsInput;
    upsert?: Prisma.UserUpsertWithoutMentorAssignmentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutMentorAssignmentsInput, Prisma.UserUpdateWithoutMentorAssignmentsInput>, Prisma.UserUncheckedUpdateWithoutMentorAssignmentsInput>;
};
export type UserCreateNestedOneWithoutPointsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPointsInput, Prisma.UserUncheckedCreateWithoutPointsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPointsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPointsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPointsInput, Prisma.UserUncheckedCreateWithoutPointsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPointsInput;
    upsert?: Prisma.UserUpsertWithoutPointsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPointsInput, Prisma.UserUpdateWithoutPointsInput>, Prisma.UserUncheckedUpdateWithoutPointsInput>;
};
export type UserCreateNestedOneWithoutUserBadgesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUserBadgesInput, Prisma.UserUncheckedCreateWithoutUserBadgesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUserBadgesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutUserBadgesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutUserBadgesInput, Prisma.UserUncheckedCreateWithoutUserBadgesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutUserBadgesInput;
    upsert?: Prisma.UserUpsertWithoutUserBadgesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutUserBadgesInput, Prisma.UserUpdateWithoutUserBadgesInput>, Prisma.UserUncheckedUpdateWithoutUserBadgesInput>;
};
export type UserCreateNestedOneWithoutLeaderboardsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutLeaderboardsInput, Prisma.UserUncheckedCreateWithoutLeaderboardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutLeaderboardsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutLeaderboardsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutLeaderboardsInput, Prisma.UserUncheckedCreateWithoutLeaderboardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutLeaderboardsInput;
    upsert?: Prisma.UserUpsertWithoutLeaderboardsInput;
    disconnect?: boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutLeaderboardsInput, Prisma.UserUpdateWithoutLeaderboardsInput>, Prisma.UserUncheckedUpdateWithoutLeaderboardsInput>;
};
export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutNotificationsInput;
    upsert?: Prisma.UserUpsertWithoutNotificationsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutNotificationsInput, Prisma.UserUpdateWithoutNotificationsInput>, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
};
export type UserCreateNestedOneWithoutPortfolioInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPortfolioInput, Prisma.UserUncheckedCreateWithoutPortfolioInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPortfolioInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPortfolioNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPortfolioInput, Prisma.UserUncheckedCreateWithoutPortfolioInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPortfolioInput;
    upsert?: Prisma.UserUpsertWithoutPortfolioInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPortfolioInput, Prisma.UserUpdateWithoutPortfolioInput>, Prisma.UserUncheckedUpdateWithoutPortfolioInput>;
};
export type UserCreateWithoutOtpsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutOtpsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutOtpsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
};
export type UserUpsertWithoutOtpsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOtpsInput, Prisma.UserUncheckedUpdateWithoutOtpsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOtpsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOtpsInput, Prisma.UserUncheckedUpdateWithoutOtpsInput>;
};
export type UserUpdateWithoutOtpsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutOtpsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutRefreshTokensInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
};
export type UserUpsertWithoutRefreshTokensInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutRefreshTokensInput, Prisma.UserUncheckedUpdateWithoutRefreshTokensInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutRefreshTokensInput, Prisma.UserUncheckedCreateWithoutRefreshTokensInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutRefreshTokensInput, Prisma.UserUncheckedUpdateWithoutRefreshTokensInput>;
};
export type UserUpdateWithoutRefreshTokensInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutSquadsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutSquadsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutSquadsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSquadsInput, Prisma.UserUncheckedCreateWithoutSquadsInput>;
};
export type UserUpsertWithoutSquadsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSquadsInput, Prisma.UserUncheckedUpdateWithoutSquadsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSquadsInput, Prisma.UserUncheckedCreateWithoutSquadsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSquadsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSquadsInput, Prisma.UserUncheckedUpdateWithoutSquadsInput>;
};
export type UserUpdateWithoutSquadsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutSquadsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutSquadMembersInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutSquadMembersInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutSquadMembersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSquadMembersInput, Prisma.UserUncheckedCreateWithoutSquadMembersInput>;
};
export type UserUpsertWithoutSquadMembersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSquadMembersInput, Prisma.UserUncheckedUpdateWithoutSquadMembersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSquadMembersInput, Prisma.UserUncheckedCreateWithoutSquadMembersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSquadMembersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSquadMembersInput, Prisma.UserUncheckedUpdateWithoutSquadMembersInput>;
};
export type UserUpdateWithoutSquadMembersInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutSquadMembersInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutTeamMembersInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutTeamMembersInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutTeamMembersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamMembersInput, Prisma.UserUncheckedCreateWithoutTeamMembersInput>;
};
export type UserUpsertWithoutTeamMembersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTeamMembersInput, Prisma.UserUncheckedUpdateWithoutTeamMembersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamMembersInput, Prisma.UserUncheckedCreateWithoutTeamMembersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTeamMembersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTeamMembersInput, Prisma.UserUncheckedUpdateWithoutTeamMembersInput>;
};
export type UserUpdateWithoutTeamMembersInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutTeamMembersInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutTeamChatsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutTeamChatsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutTeamChatsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamChatsInput, Prisma.UserUncheckedCreateWithoutTeamChatsInput>;
};
export type UserUpsertWithoutTeamChatsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTeamChatsInput, Prisma.UserUncheckedUpdateWithoutTeamChatsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTeamChatsInput, Prisma.UserUncheckedCreateWithoutTeamChatsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTeamChatsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTeamChatsInput, Prisma.UserUncheckedUpdateWithoutTeamChatsInput>;
};
export type UserUpdateWithoutTeamChatsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutTeamChatsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutUserProgressesInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutUserProgressesInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutUserProgressesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutUserProgressesInput, Prisma.UserUncheckedCreateWithoutUserProgressesInput>;
};
export type UserUpsertWithoutUserProgressesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutUserProgressesInput, Prisma.UserUncheckedUpdateWithoutUserProgressesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutUserProgressesInput, Prisma.UserUncheckedCreateWithoutUserProgressesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutUserProgressesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutUserProgressesInput, Prisma.UserUncheckedUpdateWithoutUserProgressesInput>;
};
export type UserUpdateWithoutUserProgressesInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutUserProgressesInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutScoresInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutScoresInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutScoresInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutScoresInput, Prisma.UserUncheckedCreateWithoutScoresInput>;
};
export type UserUpsertWithoutScoresInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutScoresInput, Prisma.UserUncheckedUpdateWithoutScoresInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutScoresInput, Prisma.UserUncheckedCreateWithoutScoresInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutScoresInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutScoresInput, Prisma.UserUncheckedUpdateWithoutScoresInput>;
};
export type UserUpdateWithoutScoresInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutScoresInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutMentorRequestsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutMentorRequestsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutMentorRequestsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutMentorRequestsInput, Prisma.UserUncheckedCreateWithoutMentorRequestsInput>;
};
export type UserUpsertWithoutMentorRequestsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutMentorRequestsInput, Prisma.UserUncheckedUpdateWithoutMentorRequestsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutMentorRequestsInput, Prisma.UserUncheckedCreateWithoutMentorRequestsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutMentorRequestsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutMentorRequestsInput, Prisma.UserUncheckedUpdateWithoutMentorRequestsInput>;
};
export type UserUpdateWithoutMentorRequestsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutMentorRequestsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutMentorAssignmentsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutMentorAssignmentsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutMentorAssignmentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutMentorAssignmentsInput, Prisma.UserUncheckedCreateWithoutMentorAssignmentsInput>;
};
export type UserUpsertWithoutMentorAssignmentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutMentorAssignmentsInput, Prisma.UserUncheckedUpdateWithoutMentorAssignmentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutMentorAssignmentsInput, Prisma.UserUncheckedCreateWithoutMentorAssignmentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutMentorAssignmentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutMentorAssignmentsInput, Prisma.UserUncheckedUpdateWithoutMentorAssignmentsInput>;
};
export type UserUpdateWithoutMentorAssignmentsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutMentorAssignmentsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutPointsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutPointsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutPointsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPointsInput, Prisma.UserUncheckedCreateWithoutPointsInput>;
};
export type UserUpsertWithoutPointsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPointsInput, Prisma.UserUncheckedUpdateWithoutPointsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPointsInput, Prisma.UserUncheckedCreateWithoutPointsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPointsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPointsInput, Prisma.UserUncheckedUpdateWithoutPointsInput>;
};
export type UserUpdateWithoutPointsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutPointsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutUserBadgesInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutUserBadgesInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutUserBadgesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutUserBadgesInput, Prisma.UserUncheckedCreateWithoutUserBadgesInput>;
};
export type UserUpsertWithoutUserBadgesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutUserBadgesInput, Prisma.UserUncheckedUpdateWithoutUserBadgesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutUserBadgesInput, Prisma.UserUncheckedCreateWithoutUserBadgesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutUserBadgesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutUserBadgesInput, Prisma.UserUncheckedUpdateWithoutUserBadgesInput>;
};
export type UserUpdateWithoutUserBadgesInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutUserBadgesInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutLeaderboardsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutLeaderboardsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutLeaderboardsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutLeaderboardsInput, Prisma.UserUncheckedCreateWithoutLeaderboardsInput>;
};
export type UserUpsertWithoutLeaderboardsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutLeaderboardsInput, Prisma.UserUncheckedUpdateWithoutLeaderboardsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutLeaderboardsInput, Prisma.UserUncheckedCreateWithoutLeaderboardsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutLeaderboardsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutLeaderboardsInput, Prisma.UserUncheckedUpdateWithoutLeaderboardsInput>;
};
export type UserUpdateWithoutLeaderboardsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutLeaderboardsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutNotificationsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    portfolio?: Prisma.PortfolioUncheckedCreateNestedOneWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutNotificationsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
};
export type UserUpsertWithoutNotificationsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutNotificationsInput, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutNotificationsInput, Prisma.UserUncheckedCreateWithoutNotificationsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutNotificationsInput, Prisma.UserUncheckedUpdateWithoutNotificationsInput>;
};
export type UserUpdateWithoutNotificationsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutNotificationsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    portfolio?: Prisma.PortfolioUncheckedUpdateOneWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
export type UserCreateWithoutPortfolioInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationCreateNestedManyWithoutUserInput;
    squads?: Prisma.SquadCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutMentorInput;
};
export type UserUncheckedCreateWithoutPortfolioInput = {
    id?: string;
    email: string;
    password: string;
    role: $Enums.UserRole;
    firstName: string;
    schoolName: string;
    lastName: string;
    phone?: string | null;
    isVerified?: boolean;
    lastLogin?: Date | string | null;
    squadId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    otps?: Prisma.OTPUncheckedCreateNestedManyWithoutUserInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedCreateNestedManyWithoutUserInput;
    squadMembers?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutUserInput;
    teamMembers?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutUserInput;
    teamChats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutSenderInput;
    points?: Prisma.PointUncheckedCreateNestedManyWithoutUserInput;
    userBadges?: Prisma.UserBadgeUncheckedCreateNestedManyWithoutUserInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutUserInput;
    notifications?: Prisma.NotificationUncheckedCreateNestedManyWithoutUserInput;
    squads?: Prisma.SquadUncheckedCreateNestedManyWithoutLeadInput;
    userProgresses?: Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput;
    scores?: Prisma.ScoreUncheckedCreateNestedManyWithoutJudgeInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutMentorInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutMentorInput;
};
export type UserCreateOrConnectWithoutPortfolioInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPortfolioInput, Prisma.UserUncheckedCreateWithoutPortfolioInput>;
};
export type UserUpsertWithoutPortfolioInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPortfolioInput, Prisma.UserUncheckedUpdateWithoutPortfolioInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPortfolioInput, Prisma.UserUncheckedCreateWithoutPortfolioInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPortfolioInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPortfolioInput, Prisma.UserUncheckedUpdateWithoutPortfolioInput>;
};
export type UserUpdateWithoutPortfolioInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUpdateManyWithoutUserNestedInput;
    squads?: Prisma.SquadUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutMentorNestedInput;
};
export type UserUncheckedUpdateWithoutPortfolioInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    lastLogin?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    otps?: Prisma.OTPUncheckedUpdateManyWithoutUserNestedInput;
    refreshTokens?: Prisma.RefreshTokenUncheckedUpdateManyWithoutUserNestedInput;
    squadMembers?: Prisma.SquadMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamMembers?: Prisma.TeamMemberUncheckedUpdateManyWithoutUserNestedInput;
    teamChats?: Prisma.TeamChatUncheckedUpdateManyWithoutSenderNestedInput;
    points?: Prisma.PointUncheckedUpdateManyWithoutUserNestedInput;
    userBadges?: Prisma.UserBadgeUncheckedUpdateManyWithoutUserNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutUserNestedInput;
    notifications?: Prisma.NotificationUncheckedUpdateManyWithoutUserNestedInput;
    squads?: Prisma.SquadUncheckedUpdateManyWithoutLeadNestedInput;
    userProgresses?: Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput;
    scores?: Prisma.ScoreUncheckedUpdateManyWithoutJudgeNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutMentorNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutMentorNestedInput;
};
/**
 * Count Type UserCountOutputType
 */
export type UserCountOutputType = {
    otps: number;
    refreshTokens: number;
    squadMembers: number;
    teamMembers: number;
    teamChats: number;
    points: number;
    userBadges: number;
    leaderboards: number;
    notifications: number;
    squads: number;
    userProgresses: number;
    scores: number;
    mentorRequests: number;
    mentorAssignments: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    otps?: boolean | UserCountOutputTypeCountOtpsArgs;
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs;
    squadMembers?: boolean | UserCountOutputTypeCountSquadMembersArgs;
    teamMembers?: boolean | UserCountOutputTypeCountTeamMembersArgs;
    teamChats?: boolean | UserCountOutputTypeCountTeamChatsArgs;
    points?: boolean | UserCountOutputTypeCountPointsArgs;
    userBadges?: boolean | UserCountOutputTypeCountUserBadgesArgs;
    leaderboards?: boolean | UserCountOutputTypeCountLeaderboardsArgs;
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs;
    squads?: boolean | UserCountOutputTypeCountSquadsArgs;
    userProgresses?: boolean | UserCountOutputTypeCountUserProgressesArgs;
    scores?: boolean | UserCountOutputTypeCountScoresArgs;
    mentorRequests?: boolean | UserCountOutputTypeCountMentorRequestsArgs;
    mentorAssignments?: boolean | UserCountOutputTypeCountMentorAssignmentsArgs;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountOtpsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OTPWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RefreshTokenWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountSquadMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SquadMemberWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTeamMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamMemberWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountTeamChatsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamChatWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountPointsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PointWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountUserBadgesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserBadgeWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountLeaderboardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LeaderboardWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NotificationWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountSquadsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SquadWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountUserProgressesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserProgressWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountScoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScoreWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountMentorRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentorRequestWhereInput;
};
/**
 * UserCountOutputType without action
 */
export type UserCountOutputTypeCountMentorAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentorAssignmentWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    password?: boolean;
    role?: boolean;
    firstName?: boolean;
    schoolName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    isVerified?: boolean;
    lastLogin?: boolean;
    squadId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    otps?: boolean | Prisma.User$otpsArgs<ExtArgs>;
    refreshTokens?: boolean | Prisma.User$refreshTokensArgs<ExtArgs>;
    squadMembers?: boolean | Prisma.User$squadMembersArgs<ExtArgs>;
    teamMembers?: boolean | Prisma.User$teamMembersArgs<ExtArgs>;
    teamChats?: boolean | Prisma.User$teamChatsArgs<ExtArgs>;
    points?: boolean | Prisma.User$pointsArgs<ExtArgs>;
    userBadges?: boolean | Prisma.User$userBadgesArgs<ExtArgs>;
    leaderboards?: boolean | Prisma.User$leaderboardsArgs<ExtArgs>;
    notifications?: boolean | Prisma.User$notificationsArgs<ExtArgs>;
    portfolio?: boolean | Prisma.User$portfolioArgs<ExtArgs>;
    squads?: boolean | Prisma.User$squadsArgs<ExtArgs>;
    userProgresses?: boolean | Prisma.User$userProgressesArgs<ExtArgs>;
    scores?: boolean | Prisma.User$scoresArgs<ExtArgs>;
    mentorRequests?: boolean | Prisma.User$mentorRequestsArgs<ExtArgs>;
    mentorAssignments?: boolean | Prisma.User$mentorAssignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    password?: boolean;
    role?: boolean;
    firstName?: boolean;
    schoolName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    isVerified?: boolean;
    lastLogin?: boolean;
    squadId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "password" | "role" | "firstName" | "schoolName" | "lastName" | "phone" | "isVerified" | "lastLogin" | "squadId" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    otps?: boolean | Prisma.User$otpsArgs<ExtArgs>;
    refreshTokens?: boolean | Prisma.User$refreshTokensArgs<ExtArgs>;
    squadMembers?: boolean | Prisma.User$squadMembersArgs<ExtArgs>;
    teamMembers?: boolean | Prisma.User$teamMembersArgs<ExtArgs>;
    teamChats?: boolean | Prisma.User$teamChatsArgs<ExtArgs>;
    points?: boolean | Prisma.User$pointsArgs<ExtArgs>;
    userBadges?: boolean | Prisma.User$userBadgesArgs<ExtArgs>;
    leaderboards?: boolean | Prisma.User$leaderboardsArgs<ExtArgs>;
    notifications?: boolean | Prisma.User$notificationsArgs<ExtArgs>;
    portfolio?: boolean | Prisma.User$portfolioArgs<ExtArgs>;
    squads?: boolean | Prisma.User$squadsArgs<ExtArgs>;
    userProgresses?: boolean | Prisma.User$userProgressesArgs<ExtArgs>;
    scores?: boolean | Prisma.User$scoresArgs<ExtArgs>;
    mentorRequests?: boolean | Prisma.User$mentorRequestsArgs<ExtArgs>;
    mentorAssignments?: boolean | Prisma.User$mentorAssignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        otps: Prisma.$OTPPayload<ExtArgs>[];
        refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[];
        squadMembers: Prisma.$SquadMemberPayload<ExtArgs>[];
        teamMembers: Prisma.$TeamMemberPayload<ExtArgs>[];
        teamChats: Prisma.$TeamChatPayload<ExtArgs>[];
        points: Prisma.$PointPayload<ExtArgs>[];
        userBadges: Prisma.$UserBadgePayload<ExtArgs>[];
        leaderboards: Prisma.$LeaderboardPayload<ExtArgs>[];
        notifications: Prisma.$NotificationPayload<ExtArgs>[];
        portfolio: Prisma.$PortfolioPayload<ExtArgs> | null;
        squads: Prisma.$SquadPayload<ExtArgs>[];
        userProgresses: Prisma.$UserProgressPayload<ExtArgs>[];
        scores: Prisma.$ScorePayload<ExtArgs>[];
        mentorRequests: Prisma.$MentorRequestPayload<ExtArgs>[];
        mentorAssignments: Prisma.$MentorAssignmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        password: string;
        role: $Enums.UserRole;
        firstName: string;
        schoolName: string;
        lastName: string;
        phone: string | null;
        isVerified: boolean;
        lastLogin: Date | null;
        squadId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.UserFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.UserAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for User.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    otps<T extends Prisma.User$otpsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$otpsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OTPPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    refreshTokens<T extends Prisma.User$refreshTokensArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    squadMembers<T extends Prisma.User$squadMembersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$squadMembersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SquadMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teamMembers<T extends Prisma.User$teamMembersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$teamMembersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teamChats<T extends Prisma.User$teamChatsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$teamChatsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamChatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    points<T extends Prisma.User$pointsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$pointsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PointPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    userBadges<T extends Prisma.User$userBadgesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$userBadgesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    leaderboards<T extends Prisma.User$leaderboardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$leaderboardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    notifications<T extends Prisma.User$notificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    portfolio<T extends Prisma.User$portfolioArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$portfolioArgs<ExtArgs>>): Prisma.Prisma__PortfolioClient<runtime.Types.Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    squads<T extends Prisma.User$squadsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$squadsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    userProgresses<T extends Prisma.User$userProgressesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$userProgressesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    scores<T extends Prisma.User$scoresArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$scoresArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    mentorRequests<T extends Prisma.User$mentorRequestsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$mentorRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    mentorAssignments<T extends Prisma.User$mentorAssignmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$mentorAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentorAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the User model
 */
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly password: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'UserRole'>;
    readonly firstName: Prisma.FieldRef<"User", 'String'>;
    readonly schoolName: Prisma.FieldRef<"User", 'String'>;
    readonly lastName: Prisma.FieldRef<"User", 'String'>;
    readonly phone: Prisma.FieldRef<"User", 'String'>;
    readonly isVerified: Prisma.FieldRef<"User", 'Boolean'>;
    readonly lastLogin: Prisma.FieldRef<"User", 'DateTime'>;
    readonly squadId: Prisma.FieldRef<"User", 'String'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
/**
 * User findUnique
 */
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findUniqueOrThrow
 */
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User findFirst
 */
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findFirstOrThrow
 */
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User findMany
 */
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: Prisma.UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: Prisma.UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * User create
 */
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
/**
 * User createMany
 */
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
};
/**
 * User update
 */
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User updateMany
 */
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
};
/**
 * User upsert
 */
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: Prisma.UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
/**
 * User delete
 */
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: Prisma.UserWhereUniqueInput;
};
/**
 * User deleteMany
 */
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: Prisma.UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
};
/**
 * User findRaw
 */
export type UserFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: runtime.InputJsonValue;
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: runtime.InputJsonValue;
};
/**
 * User aggregateRaw
 */
export type UserAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: runtime.InputJsonValue[];
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: runtime.InputJsonValue;
};
/**
 * User.otps
 */
export type User$otpsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OTP
     */
    select?: Prisma.OTPSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the OTP
     */
    omit?: Prisma.OTPOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OTPInclude<ExtArgs> | null;
    where?: Prisma.OTPWhereInput;
    orderBy?: Prisma.OTPOrderByWithRelationInput | Prisma.OTPOrderByWithRelationInput[];
    cursor?: Prisma.OTPWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OTPScalarFieldEnum | Prisma.OTPScalarFieldEnum[];
};
/**
 * User.refreshTokens
 */
export type User$refreshTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: Prisma.RefreshTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: Prisma.RefreshTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RefreshTokenInclude<ExtArgs> | null;
    where?: Prisma.RefreshTokenWhereInput;
    orderBy?: Prisma.RefreshTokenOrderByWithRelationInput | Prisma.RefreshTokenOrderByWithRelationInput[];
    cursor?: Prisma.RefreshTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RefreshTokenScalarFieldEnum | Prisma.RefreshTokenScalarFieldEnum[];
};
/**
 * User.squadMembers
 */
export type User$squadMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SquadMember
     */
    select?: Prisma.SquadMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SquadMember
     */
    omit?: Prisma.SquadMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SquadMemberInclude<ExtArgs> | null;
    where?: Prisma.SquadMemberWhereInput;
    orderBy?: Prisma.SquadMemberOrderByWithRelationInput | Prisma.SquadMemberOrderByWithRelationInput[];
    cursor?: Prisma.SquadMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SquadMemberScalarFieldEnum | Prisma.SquadMemberScalarFieldEnum[];
};
/**
 * User.teamMembers
 */
export type User$teamMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: Prisma.TeamMemberSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: Prisma.TeamMemberOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamMemberInclude<ExtArgs> | null;
    where?: Prisma.TeamMemberWhereInput;
    orderBy?: Prisma.TeamMemberOrderByWithRelationInput | Prisma.TeamMemberOrderByWithRelationInput[];
    cursor?: Prisma.TeamMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamMemberScalarFieldEnum | Prisma.TeamMemberScalarFieldEnum[];
};
/**
 * User.teamChats
 */
export type User$teamChatsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamChat
     */
    select?: Prisma.TeamChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TeamChat
     */
    omit?: Prisma.TeamChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamChatInclude<ExtArgs> | null;
    where?: Prisma.TeamChatWhereInput;
    orderBy?: Prisma.TeamChatOrderByWithRelationInput | Prisma.TeamChatOrderByWithRelationInput[];
    cursor?: Prisma.TeamChatWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamChatScalarFieldEnum | Prisma.TeamChatScalarFieldEnum[];
};
/**
 * User.points
 */
export type User$pointsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Point
     */
    select?: Prisma.PointSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Point
     */
    omit?: Prisma.PointOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PointInclude<ExtArgs> | null;
    where?: Prisma.PointWhereInput;
    orderBy?: Prisma.PointOrderByWithRelationInput | Prisma.PointOrderByWithRelationInput[];
    cursor?: Prisma.PointWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PointScalarFieldEnum | Prisma.PointScalarFieldEnum[];
};
/**
 * User.userBadges
 */
export type User$userBadgesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: Prisma.UserBadgeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: Prisma.UserBadgeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserBadgeInclude<ExtArgs> | null;
    where?: Prisma.UserBadgeWhereInput;
    orderBy?: Prisma.UserBadgeOrderByWithRelationInput | Prisma.UserBadgeOrderByWithRelationInput[];
    cursor?: Prisma.UserBadgeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserBadgeScalarFieldEnum | Prisma.UserBadgeScalarFieldEnum[];
};
/**
 * User.leaderboards
 */
export type User$leaderboardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: Prisma.LeaderboardSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: Prisma.LeaderboardOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.LeaderboardInclude<ExtArgs> | null;
    where?: Prisma.LeaderboardWhereInput;
    orderBy?: Prisma.LeaderboardOrderByWithRelationInput | Prisma.LeaderboardOrderByWithRelationInput[];
    cursor?: Prisma.LeaderboardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LeaderboardScalarFieldEnum | Prisma.LeaderboardScalarFieldEnum[];
};
/**
 * User.notifications
 */
export type User$notificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: Prisma.NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: Prisma.NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.NotificationInclude<ExtArgs> | null;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput | Prisma.NotificationOrderByWithRelationInput[];
    cursor?: Prisma.NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NotificationScalarFieldEnum | Prisma.NotificationScalarFieldEnum[];
};
/**
 * User.portfolio
 */
export type User$portfolioArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: Prisma.PortfolioSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: Prisma.PortfolioOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PortfolioInclude<ExtArgs> | null;
    where?: Prisma.PortfolioWhereInput;
};
/**
 * User.squads
 */
export type User$squadsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Squad
     */
    select?: Prisma.SquadSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Squad
     */
    omit?: Prisma.SquadOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SquadInclude<ExtArgs> | null;
    where?: Prisma.SquadWhereInput;
    orderBy?: Prisma.SquadOrderByWithRelationInput | Prisma.SquadOrderByWithRelationInput[];
    cursor?: Prisma.SquadWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SquadScalarFieldEnum | Prisma.SquadScalarFieldEnum[];
};
/**
 * User.userProgresses
 */
export type User$userProgressesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: Prisma.UserProgressSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: Prisma.UserProgressOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserProgressInclude<ExtArgs> | null;
    where?: Prisma.UserProgressWhereInput;
    orderBy?: Prisma.UserProgressOrderByWithRelationInput | Prisma.UserProgressOrderByWithRelationInput[];
    cursor?: Prisma.UserProgressWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserProgressScalarFieldEnum | Prisma.UserProgressScalarFieldEnum[];
};
/**
 * User.scores
 */
export type User$scoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Score
     */
    select?: Prisma.ScoreSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Score
     */
    omit?: Prisma.ScoreOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScoreInclude<ExtArgs> | null;
    where?: Prisma.ScoreWhereInput;
    orderBy?: Prisma.ScoreOrderByWithRelationInput | Prisma.ScoreOrderByWithRelationInput[];
    cursor?: Prisma.ScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ScoreScalarFieldEnum | Prisma.ScoreScalarFieldEnum[];
};
/**
 * User.mentorRequests
 */
export type User$mentorRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorRequest
     */
    select?: Prisma.MentorRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MentorRequest
     */
    omit?: Prisma.MentorRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MentorRequestInclude<ExtArgs> | null;
    where?: Prisma.MentorRequestWhereInput;
    orderBy?: Prisma.MentorRequestOrderByWithRelationInput | Prisma.MentorRequestOrderByWithRelationInput[];
    cursor?: Prisma.MentorRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MentorRequestScalarFieldEnum | Prisma.MentorRequestScalarFieldEnum[];
};
/**
 * User.mentorAssignments
 */
export type User$mentorAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorAssignment
     */
    select?: Prisma.MentorAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MentorAssignment
     */
    omit?: Prisma.MentorAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MentorAssignmentInclude<ExtArgs> | null;
    where?: Prisma.MentorAssignmentWhereInput;
    orderBy?: Prisma.MentorAssignmentOrderByWithRelationInput | Prisma.MentorAssignmentOrderByWithRelationInput[];
    cursor?: Prisma.MentorAssignmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MentorAssignmentScalarFieldEnum | Prisma.MentorAssignmentScalarFieldEnum[];
};
/**
 * User without action
 */
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=User.d.ts.map