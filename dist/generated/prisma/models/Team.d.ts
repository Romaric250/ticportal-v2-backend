import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Team
 * Teams & Collaboration
 */
export type TeamModel = runtime.Types.Result.DefaultSelection<Prisma.$TeamPayload>;
export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
export type TeamMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    squadId: string | null;
    projectTitle: string | null;
    description: string | null;
    createdAt: Date | null;
};
export type TeamMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    squadId: string | null;
    projectTitle: string | null;
    description: string | null;
    createdAt: Date | null;
};
export type TeamCountAggregateOutputType = {
    id: number;
    name: number;
    squadId: number;
    projectTitle: number;
    description: number;
    createdAt: number;
    _all: number;
};
export type TeamMinAggregateInputType = {
    id?: true;
    name?: true;
    squadId?: true;
    projectTitle?: true;
    description?: true;
    createdAt?: true;
};
export type TeamMaxAggregateInputType = {
    id?: true;
    name?: true;
    squadId?: true;
    projectTitle?: true;
    description?: true;
    createdAt?: true;
};
export type TeamCountAggregateInputType = {
    id?: true;
    name?: true;
    squadId?: true;
    projectTitle?: true;
    description?: true;
    createdAt?: true;
    _all?: true;
};
export type TeamAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType;
};
export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
    [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeam[P]> : Prisma.GetScalarType<T[P], AggregateTeam[P]>;
};
export type TeamGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
    orderBy?: Prisma.TeamOrderByWithAggregationInput | Prisma.TeamOrderByWithAggregationInput[];
    by: Prisma.TeamScalarFieldEnum[] | Prisma.TeamScalarFieldEnum;
    having?: Prisma.TeamScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeamCountAggregateInputType | true;
    _min?: TeamMinAggregateInputType;
    _max?: TeamMaxAggregateInputType;
};
export type TeamGroupByOutputType = {
    id: string;
    name: string;
    squadId: string;
    projectTitle: string | null;
    description: string | null;
    createdAt: Date;
    _count: TeamCountAggregateOutputType | null;
    _min: TeamMinAggregateOutputType | null;
    _max: TeamMaxAggregateOutputType | null;
};
type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeamGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeamGroupByOutputType[P]>;
}>>;
export type TeamWhereInput = {
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    id?: Prisma.StringFilter<"Team"> | string;
    name?: Prisma.StringFilter<"Team"> | string;
    squadId?: Prisma.StringFilter<"Team"> | string;
    projectTitle?: Prisma.StringNullableFilter<"Team"> | string | null;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
    squad?: Prisma.XOR<Prisma.SquadScalarRelationFilter, Prisma.SquadWhereInput>;
    members?: Prisma.TeamMemberListRelationFilter;
    chats?: Prisma.TeamChatListRelationFilter;
    submissions?: Prisma.SubmissionListRelationFilter;
    mentorRequests?: Prisma.MentorRequestListRelationFilter;
    mentorAssignments?: Prisma.MentorAssignmentListRelationFilter;
    mentorSessions?: Prisma.MentorSessionListRelationFilter;
    leaderboards?: Prisma.LeaderboardListRelationFilter;
};
export type TeamOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    projectTitle?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    squad?: Prisma.SquadOrderByWithRelationInput;
    members?: Prisma.TeamMemberOrderByRelationAggregateInput;
    chats?: Prisma.TeamChatOrderByRelationAggregateInput;
    submissions?: Prisma.SubmissionOrderByRelationAggregateInput;
    mentorRequests?: Prisma.MentorRequestOrderByRelationAggregateInput;
    mentorAssignments?: Prisma.MentorAssignmentOrderByRelationAggregateInput;
    mentorSessions?: Prisma.MentorSessionOrderByRelationAggregateInput;
    leaderboards?: Prisma.LeaderboardOrderByRelationAggregateInput;
};
export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    OR?: Prisma.TeamWhereInput[];
    NOT?: Prisma.TeamWhereInput | Prisma.TeamWhereInput[];
    name?: Prisma.StringFilter<"Team"> | string;
    squadId?: Prisma.StringFilter<"Team"> | string;
    projectTitle?: Prisma.StringNullableFilter<"Team"> | string | null;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
    squad?: Prisma.XOR<Prisma.SquadScalarRelationFilter, Prisma.SquadWhereInput>;
    members?: Prisma.TeamMemberListRelationFilter;
    chats?: Prisma.TeamChatListRelationFilter;
    submissions?: Prisma.SubmissionListRelationFilter;
    mentorRequests?: Prisma.MentorRequestListRelationFilter;
    mentorAssignments?: Prisma.MentorAssignmentListRelationFilter;
    mentorSessions?: Prisma.MentorSessionListRelationFilter;
    leaderboards?: Prisma.LeaderboardListRelationFilter;
}, "id">;
export type TeamOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    projectTitle?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.TeamCountOrderByAggregateInput;
    _max?: Prisma.TeamMaxOrderByAggregateInput;
    _min?: Prisma.TeamMinOrderByAggregateInput;
};
export type TeamScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeamScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeamScalarWhereWithAggregatesInput | Prisma.TeamScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    squadId?: Prisma.StringWithAggregatesFilter<"Team"> | string;
    projectTitle?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"Team"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Team"> | Date | string;
};
export type TeamCreateInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateManyInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
};
export type TeamUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamUncheckedUpdateManyInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeamListRelationFilter = {
    every?: Prisma.TeamWhereInput;
    some?: Prisma.TeamWhereInput;
    none?: Prisma.TeamWhereInput;
};
export type TeamOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TeamCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    projectTitle?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TeamMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    projectTitle?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TeamMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    projectTitle?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type TeamScalarRelationFilter = {
    is?: Prisma.TeamWhereInput;
    isNot?: Prisma.TeamWhereInput;
};
export type TeamNullableScalarRelationFilter = {
    is?: Prisma.TeamWhereInput | null;
    isNot?: Prisma.TeamWhereInput | null;
};
export type TeamCreateNestedManyWithoutSquadInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSquadInput, Prisma.TeamUncheckedCreateWithoutSquadInput> | Prisma.TeamCreateWithoutSquadInput[] | Prisma.TeamUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSquadInput | Prisma.TeamCreateOrConnectWithoutSquadInput[];
    createMany?: Prisma.TeamCreateManySquadInputEnvelope;
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
};
export type TeamUncheckedCreateNestedManyWithoutSquadInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSquadInput, Prisma.TeamUncheckedCreateWithoutSquadInput> | Prisma.TeamCreateWithoutSquadInput[] | Prisma.TeamUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSquadInput | Prisma.TeamCreateOrConnectWithoutSquadInput[];
    createMany?: Prisma.TeamCreateManySquadInputEnvelope;
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
};
export type TeamUpdateManyWithoutSquadNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSquadInput, Prisma.TeamUncheckedCreateWithoutSquadInput> | Prisma.TeamCreateWithoutSquadInput[] | Prisma.TeamUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSquadInput | Prisma.TeamCreateOrConnectWithoutSquadInput[];
    upsert?: Prisma.TeamUpsertWithWhereUniqueWithoutSquadInput | Prisma.TeamUpsertWithWhereUniqueWithoutSquadInput[];
    createMany?: Prisma.TeamCreateManySquadInputEnvelope;
    set?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    disconnect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    delete?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    update?: Prisma.TeamUpdateWithWhereUniqueWithoutSquadInput | Prisma.TeamUpdateWithWhereUniqueWithoutSquadInput[];
    updateMany?: Prisma.TeamUpdateManyWithWhereWithoutSquadInput | Prisma.TeamUpdateManyWithWhereWithoutSquadInput[];
    deleteMany?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
};
export type TeamUncheckedUpdateManyWithoutSquadNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSquadInput, Prisma.TeamUncheckedCreateWithoutSquadInput> | Prisma.TeamCreateWithoutSquadInput[] | Prisma.TeamUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSquadInput | Prisma.TeamCreateOrConnectWithoutSquadInput[];
    upsert?: Prisma.TeamUpsertWithWhereUniqueWithoutSquadInput | Prisma.TeamUpsertWithWhereUniqueWithoutSquadInput[];
    createMany?: Prisma.TeamCreateManySquadInputEnvelope;
    set?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    disconnect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    delete?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    connect?: Prisma.TeamWhereUniqueInput | Prisma.TeamWhereUniqueInput[];
    update?: Prisma.TeamUpdateWithWhereUniqueWithoutSquadInput | Prisma.TeamUpdateWithWhereUniqueWithoutSquadInput[];
    updateMany?: Prisma.TeamUpdateManyWithWhereWithoutSquadInput | Prisma.TeamUpdateManyWithWhereWithoutSquadInput[];
    deleteMany?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
};
export type TeamCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMembersInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.TeamUpsertWithoutMembersInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMembersInput, Prisma.TeamUpdateWithoutMembersInput>, Prisma.TeamUncheckedUpdateWithoutMembersInput>;
};
export type TeamCreateNestedOneWithoutChatsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutChatsInput, Prisma.TeamUncheckedCreateWithoutChatsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutChatsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutChatsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutChatsInput, Prisma.TeamUncheckedCreateWithoutChatsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutChatsInput;
    upsert?: Prisma.TeamUpsertWithoutChatsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutChatsInput, Prisma.TeamUpdateWithoutChatsInput>, Prisma.TeamUncheckedUpdateWithoutChatsInput>;
};
export type TeamCreateNestedOneWithoutSubmissionsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSubmissionsInput, Prisma.TeamUncheckedCreateWithoutSubmissionsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSubmissionsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutSubmissionsInput, Prisma.TeamUncheckedCreateWithoutSubmissionsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutSubmissionsInput;
    upsert?: Prisma.TeamUpsertWithoutSubmissionsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutSubmissionsInput, Prisma.TeamUpdateWithoutSubmissionsInput>, Prisma.TeamUncheckedUpdateWithoutSubmissionsInput>;
};
export type TeamCreateNestedOneWithoutMentorRequestsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMentorRequestsInput, Prisma.TeamUncheckedCreateWithoutMentorRequestsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMentorRequestsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutMentorRequestsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMentorRequestsInput, Prisma.TeamUncheckedCreateWithoutMentorRequestsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMentorRequestsInput;
    upsert?: Prisma.TeamUpsertWithoutMentorRequestsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMentorRequestsInput, Prisma.TeamUpdateWithoutMentorRequestsInput>, Prisma.TeamUncheckedUpdateWithoutMentorRequestsInput>;
};
export type TeamCreateNestedOneWithoutMentorAssignmentsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMentorAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMentorAssignmentsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMentorAssignmentsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneRequiredWithoutMentorAssignmentsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMentorAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMentorAssignmentsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMentorAssignmentsInput;
    upsert?: Prisma.TeamUpsertWithoutMentorAssignmentsInput;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMentorAssignmentsInput, Prisma.TeamUpdateWithoutMentorAssignmentsInput>, Prisma.TeamUncheckedUpdateWithoutMentorAssignmentsInput>;
};
export type TeamCreateNestedOneWithoutMentorSessionsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMentorSessionsInput, Prisma.TeamUncheckedCreateWithoutMentorSessionsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMentorSessionsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutMentorSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutMentorSessionsInput, Prisma.TeamUncheckedCreateWithoutMentorSessionsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutMentorSessionsInput;
    upsert?: Prisma.TeamUpsertWithoutMentorSessionsInput;
    disconnect?: boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutMentorSessionsInput, Prisma.TeamUpdateWithoutMentorSessionsInput>, Prisma.TeamUncheckedUpdateWithoutMentorSessionsInput>;
};
export type TeamCreateNestedOneWithoutLeaderboardsInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutLeaderboardsInput, Prisma.TeamUncheckedCreateWithoutLeaderboardsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutLeaderboardsInput;
    connect?: Prisma.TeamWhereUniqueInput;
};
export type TeamUpdateOneWithoutLeaderboardsNestedInput = {
    create?: Prisma.XOR<Prisma.TeamCreateWithoutLeaderboardsInput, Prisma.TeamUncheckedCreateWithoutLeaderboardsInput>;
    connectOrCreate?: Prisma.TeamCreateOrConnectWithoutLeaderboardsInput;
    upsert?: Prisma.TeamUpsertWithoutLeaderboardsInput;
    disconnect?: boolean;
    delete?: Prisma.TeamWhereInput | boolean;
    connect?: Prisma.TeamWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeamUpdateToOneWithWhereWithoutLeaderboardsInput, Prisma.TeamUpdateWithoutLeaderboardsInput>, Prisma.TeamUncheckedUpdateWithoutLeaderboardsInput>;
};
export type TeamCreateWithoutSquadInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutSquadInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutSquadInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSquadInput, Prisma.TeamUncheckedCreateWithoutSquadInput>;
};
export type TeamCreateManySquadInputEnvelope = {
    data: Prisma.TeamCreateManySquadInput | Prisma.TeamCreateManySquadInput[];
};
export type TeamUpsertWithWhereUniqueWithoutSquadInput = {
    where: Prisma.TeamWhereUniqueInput;
    update: Prisma.XOR<Prisma.TeamUpdateWithoutSquadInput, Prisma.TeamUncheckedUpdateWithoutSquadInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSquadInput, Prisma.TeamUncheckedCreateWithoutSquadInput>;
};
export type TeamUpdateWithWhereUniqueWithoutSquadInput = {
    where: Prisma.TeamWhereUniqueInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutSquadInput, Prisma.TeamUncheckedUpdateWithoutSquadInput>;
};
export type TeamUpdateManyWithWhereWithoutSquadInput = {
    where: Prisma.TeamScalarWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyWithoutSquadInput>;
};
export type TeamScalarWhereInput = {
    AND?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
    OR?: Prisma.TeamScalarWhereInput[];
    NOT?: Prisma.TeamScalarWhereInput | Prisma.TeamScalarWhereInput[];
    id?: Prisma.StringFilter<"Team"> | string;
    name?: Prisma.StringFilter<"Team"> | string;
    squadId?: Prisma.StringFilter<"Team"> | string;
    projectTitle?: Prisma.StringNullableFilter<"Team"> | string | null;
    description?: Prisma.StringNullableFilter<"Team"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Team"> | Date | string;
};
export type TeamCreateWithoutMembersInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMembersInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMembersInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
};
export type TeamUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMembersInput, Prisma.TeamUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMembersInput, Prisma.TeamUncheckedCreateWithoutMembersInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMembersInput, Prisma.TeamUncheckedUpdateWithoutMembersInput>;
};
export type TeamUpdateWithoutMembersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMembersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutChatsInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutChatsInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutChatsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutChatsInput, Prisma.TeamUncheckedCreateWithoutChatsInput>;
};
export type TeamUpsertWithoutChatsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutChatsInput, Prisma.TeamUncheckedUpdateWithoutChatsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutChatsInput, Prisma.TeamUncheckedCreateWithoutChatsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutChatsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutChatsInput, Prisma.TeamUncheckedUpdateWithoutChatsInput>;
};
export type TeamUpdateWithoutChatsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutChatsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutSubmissionsInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutSubmissionsInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutSubmissionsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSubmissionsInput, Prisma.TeamUncheckedCreateWithoutSubmissionsInput>;
};
export type TeamUpsertWithoutSubmissionsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutSubmissionsInput, Prisma.TeamUncheckedUpdateWithoutSubmissionsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutSubmissionsInput, Prisma.TeamUncheckedCreateWithoutSubmissionsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutSubmissionsInput, Prisma.TeamUncheckedUpdateWithoutSubmissionsInput>;
};
export type TeamUpdateWithoutSubmissionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutSubmissionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutMentorRequestsInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMentorRequestsInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMentorRequestsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMentorRequestsInput, Prisma.TeamUncheckedCreateWithoutMentorRequestsInput>;
};
export type TeamUpsertWithoutMentorRequestsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMentorRequestsInput, Prisma.TeamUncheckedUpdateWithoutMentorRequestsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMentorRequestsInput, Prisma.TeamUncheckedCreateWithoutMentorRequestsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMentorRequestsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMentorRequestsInput, Prisma.TeamUncheckedUpdateWithoutMentorRequestsInput>;
};
export type TeamUpdateWithoutMentorRequestsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMentorRequestsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutMentorAssignmentsInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMentorAssignmentsInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMentorAssignmentsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMentorAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMentorAssignmentsInput>;
};
export type TeamUpsertWithoutMentorAssignmentsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMentorAssignmentsInput, Prisma.TeamUncheckedUpdateWithoutMentorAssignmentsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMentorAssignmentsInput, Prisma.TeamUncheckedCreateWithoutMentorAssignmentsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMentorAssignmentsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMentorAssignmentsInput, Prisma.TeamUncheckedUpdateWithoutMentorAssignmentsInput>;
};
export type TeamUpdateWithoutMentorAssignmentsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMentorAssignmentsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutMentorSessionsInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutMentorSessionsInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutMentorSessionsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMentorSessionsInput, Prisma.TeamUncheckedCreateWithoutMentorSessionsInput>;
};
export type TeamUpsertWithoutMentorSessionsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutMentorSessionsInput, Prisma.TeamUncheckedUpdateWithoutMentorSessionsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutMentorSessionsInput, Prisma.TeamUncheckedCreateWithoutMentorSessionsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutMentorSessionsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutMentorSessionsInput, Prisma.TeamUncheckedUpdateWithoutMentorSessionsInput>;
};
export type TeamUpdateWithoutMentorSessionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutMentorSessionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateWithoutLeaderboardsInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    squad: Prisma.SquadCreateNestedOneWithoutTeamsInput;
    members?: Prisma.TeamMemberCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionCreateNestedManyWithoutTeamInput;
};
export type TeamUncheckedCreateWithoutLeaderboardsInput = {
    id?: string;
    name: string;
    squadId: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
    members?: Prisma.TeamMemberUncheckedCreateNestedManyWithoutTeamInput;
    chats?: Prisma.TeamChatUncheckedCreateNestedManyWithoutTeamInput;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutTeamInput;
    mentorRequests?: Prisma.MentorRequestUncheckedCreateNestedManyWithoutTeamInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedCreateNestedManyWithoutTeamInput;
    mentorSessions?: Prisma.MentorSessionUncheckedCreateNestedManyWithoutTeamInput;
};
export type TeamCreateOrConnectWithoutLeaderboardsInput = {
    where: Prisma.TeamWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeamCreateWithoutLeaderboardsInput, Prisma.TeamUncheckedCreateWithoutLeaderboardsInput>;
};
export type TeamUpsertWithoutLeaderboardsInput = {
    update: Prisma.XOR<Prisma.TeamUpdateWithoutLeaderboardsInput, Prisma.TeamUncheckedUpdateWithoutLeaderboardsInput>;
    create: Prisma.XOR<Prisma.TeamCreateWithoutLeaderboardsInput, Prisma.TeamUncheckedCreateWithoutLeaderboardsInput>;
    where?: Prisma.TeamWhereInput;
};
export type TeamUpdateToOneWithWhereWithoutLeaderboardsInput = {
    where?: Prisma.TeamWhereInput;
    data: Prisma.XOR<Prisma.TeamUpdateWithoutLeaderboardsInput, Prisma.TeamUncheckedUpdateWithoutLeaderboardsInput>;
};
export type TeamUpdateWithoutLeaderboardsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    squad?: Prisma.SquadUpdateOneRequiredWithoutTeamsNestedInput;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutLeaderboardsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    squadId?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamCreateManySquadInput = {
    id?: string;
    name: string;
    projectTitle?: string | null;
    description?: string | null;
    createdAt?: Date | string;
};
export type TeamUpdateWithoutSquadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateWithoutSquadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.TeamMemberUncheckedUpdateManyWithoutTeamNestedInput;
    chats?: Prisma.TeamChatUncheckedUpdateManyWithoutTeamNestedInput;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutTeamNestedInput;
    mentorRequests?: Prisma.MentorRequestUncheckedUpdateManyWithoutTeamNestedInput;
    mentorAssignments?: Prisma.MentorAssignmentUncheckedUpdateManyWithoutTeamNestedInput;
    mentorSessions?: Prisma.MentorSessionUncheckedUpdateManyWithoutTeamNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutTeamNestedInput;
};
export type TeamUncheckedUpdateManyWithoutSquadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    projectTitle?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type TeamCountOutputType
 */
export type TeamCountOutputType = {
    members: number;
    chats: number;
    submissions: number;
    mentorRequests: number;
    mentorAssignments: number;
    mentorSessions: number;
    leaderboards: number;
};
export type TeamCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | TeamCountOutputTypeCountMembersArgs;
    chats?: boolean | TeamCountOutputTypeCountChatsArgs;
    submissions?: boolean | TeamCountOutputTypeCountSubmissionsArgs;
    mentorRequests?: boolean | TeamCountOutputTypeCountMentorRequestsArgs;
    mentorAssignments?: boolean | TeamCountOutputTypeCountMentorAssignmentsArgs;
    mentorSessions?: boolean | TeamCountOutputTypeCountMentorSessionsArgs;
    leaderboards?: boolean | TeamCountOutputTypeCountLeaderboardsArgs;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: Prisma.TeamCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamMemberWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountChatsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamChatWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissionWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMentorRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentorRequestWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMentorAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentorAssignmentWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountMentorSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentorSessionWhereInput;
};
/**
 * TeamCountOutputType without action
 */
export type TeamCountOutputTypeCountLeaderboardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LeaderboardWhereInput;
};
export type TeamSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    squadId?: boolean;
    projectTitle?: boolean;
    description?: boolean;
    createdAt?: boolean;
    squad?: boolean | Prisma.SquadDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Team$membersArgs<ExtArgs>;
    chats?: boolean | Prisma.Team$chatsArgs<ExtArgs>;
    submissions?: boolean | Prisma.Team$submissionsArgs<ExtArgs>;
    mentorRequests?: boolean | Prisma.Team$mentorRequestsArgs<ExtArgs>;
    mentorAssignments?: boolean | Prisma.Team$mentorAssignmentsArgs<ExtArgs>;
    mentorSessions?: boolean | Prisma.Team$mentorSessionsArgs<ExtArgs>;
    leaderboards?: boolean | Prisma.Team$leaderboardsArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["team"]>;
export type TeamSelectScalar = {
    id?: boolean;
    name?: boolean;
    squadId?: boolean;
    projectTitle?: boolean;
    description?: boolean;
    createdAt?: boolean;
};
export type TeamOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "squadId" | "projectTitle" | "description" | "createdAt", ExtArgs["result"]["team"]>;
export type TeamInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    squad?: boolean | Prisma.SquadDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Team$membersArgs<ExtArgs>;
    chats?: boolean | Prisma.Team$chatsArgs<ExtArgs>;
    submissions?: boolean | Prisma.Team$submissionsArgs<ExtArgs>;
    mentorRequests?: boolean | Prisma.Team$mentorRequestsArgs<ExtArgs>;
    mentorAssignments?: boolean | Prisma.Team$mentorAssignmentsArgs<ExtArgs>;
    mentorSessions?: boolean | Prisma.Team$mentorSessionsArgs<ExtArgs>;
    leaderboards?: boolean | Prisma.Team$leaderboardsArgs<ExtArgs>;
    _count?: boolean | Prisma.TeamCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $TeamPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Team";
    objects: {
        squad: Prisma.$SquadPayload<ExtArgs>;
        members: Prisma.$TeamMemberPayload<ExtArgs>[];
        chats: Prisma.$TeamChatPayload<ExtArgs>[];
        submissions: Prisma.$SubmissionPayload<ExtArgs>[];
        mentorRequests: Prisma.$MentorRequestPayload<ExtArgs>[];
        mentorAssignments: Prisma.$MentorAssignmentPayload<ExtArgs>[];
        mentorSessions: Prisma.$MentorSessionPayload<ExtArgs>[];
        leaderboards: Prisma.$LeaderboardPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        squadId: string;
        projectTitle: string | null;
        description: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["team"]>;
    composites: {};
};
export type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeamPayload, S>;
export type TeamCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeamCountAggregateInputType | true;
};
export interface TeamDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Team'];
        meta: {
            name: 'Team';
        };
    };
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     *
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TeamFindManyArgs>(args?: Prisma.SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     *
     */
    create<T extends TeamCreateArgs>(args: Prisma.SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TeamCreateManyArgs>(args?: Prisma.SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     *
     */
    delete<T extends TeamDeleteArgs>(args: Prisma.SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TeamUpdateArgs>(args: Prisma.SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TeamUpdateManyArgs>(args: Prisma.SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: Prisma.SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Teams that matches the filter.
     * @param {TeamFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const team = await prisma.team.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.TeamFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a Team.
     * @param {TeamAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const team = await prisma.team.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.TeamAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(args?: Prisma.Subset<T, TeamCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeamCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TeamAggregateArgs>(args: Prisma.Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>;
    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
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
    groupBy<T extends TeamGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeamGroupByArgs['orderBy'];
    } : {
        orderBy?: TeamGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Team model
     */
    readonly fields: TeamFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Team.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__TeamClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    squad<T extends Prisma.SquadDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SquadDefaultArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Team$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    chats<T extends Prisma.Team$chatsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$chatsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamChatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    submissions<T extends Prisma.Team$submissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    mentorRequests<T extends Prisma.Team$mentorRequestsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$mentorRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    mentorAssignments<T extends Prisma.Team$mentorAssignmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$mentorAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentorAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    mentorSessions<T extends Prisma.Team$mentorSessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$mentorSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    leaderboards<T extends Prisma.Team$leaderboardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Team$leaderboardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Team model
 */
export interface TeamFieldRefs {
    readonly id: Prisma.FieldRef<"Team", 'String'>;
    readonly name: Prisma.FieldRef<"Team", 'String'>;
    readonly squadId: Prisma.FieldRef<"Team", 'String'>;
    readonly projectTitle: Prisma.FieldRef<"Team", 'String'>;
    readonly description: Prisma.FieldRef<"Team", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Team", 'DateTime'>;
}
/**
 * Team findUnique
 */
export type TeamFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * Filter, which Team to fetch.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team findUniqueOrThrow
 */
export type TeamFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * Filter, which Team to fetch.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team findFirst
 */
export type TeamFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * Filter, which Team to fetch.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Teams.
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Teams.
     */
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Team findFirstOrThrow
 */
export type TeamFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * Filter, which Team to fetch.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Teams.
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Teams.
     */
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Team findMany
 */
export type TeamFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * Filter, which Teams to fetch.
     */
    where?: Prisma.TeamWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Teams to fetch.
     */
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Teams.
     */
    cursor?: Prisma.TeamWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Teams.
     */
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Team create
 */
export type TeamCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * The data needed to create a Team.
     */
    data: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
};
/**
 * Team createMany
 */
export type TeamCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: Prisma.TeamCreateManyInput | Prisma.TeamCreateManyInput[];
};
/**
 * Team update
 */
export type TeamUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * The data needed to update a Team.
     */
    data: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
    /**
     * Choose, which Team to update.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team updateMany
 */
export type TeamUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: Prisma.XOR<Prisma.TeamUpdateManyMutationInput, Prisma.TeamUncheckedUpdateManyInput>;
    /**
     * Filter which Teams to update
     */
    where?: Prisma.TeamWhereInput;
    /**
     * Limit how many Teams to update.
     */
    limit?: number;
};
/**
 * Team upsert
 */
export type TeamUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: Prisma.TeamWhereUniqueInput;
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: Prisma.XOR<Prisma.TeamCreateInput, Prisma.TeamUncheckedCreateInput>;
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.TeamUpdateInput, Prisma.TeamUncheckedUpdateInput>;
};
/**
 * Team delete
 */
export type TeamDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
    /**
     * Filter which Team to delete.
     */
    where: Prisma.TeamWhereUniqueInput;
};
/**
 * Team deleteMany
 */
export type TeamDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: Prisma.TeamWhereInput;
    /**
     * Limit how many Teams to delete.
     */
    limit?: number;
};
/**
 * Team findRaw
 */
export type TeamFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team aggregateRaw
 */
export type TeamAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.members
 */
export type Team$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.chats
 */
export type Team$chatsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.submissions
 */
export type Team$submissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Submission
     */
    select?: Prisma.SubmissionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Submission
     */
    omit?: Prisma.SubmissionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.SubmissionInclude<ExtArgs> | null;
    where?: Prisma.SubmissionWhereInput;
    orderBy?: Prisma.SubmissionOrderByWithRelationInput | Prisma.SubmissionOrderByWithRelationInput[];
    cursor?: Prisma.SubmissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SubmissionScalarFieldEnum | Prisma.SubmissionScalarFieldEnum[];
};
/**
 * Team.mentorRequests
 */
export type Team$mentorRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.mentorAssignments
 */
export type Team$mentorAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team.mentorSessions
 */
export type Team$mentorSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MentorSession
     */
    select?: Prisma.MentorSessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MentorSession
     */
    omit?: Prisma.MentorSessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MentorSessionInclude<ExtArgs> | null;
    where?: Prisma.MentorSessionWhereInput;
    orderBy?: Prisma.MentorSessionOrderByWithRelationInput | Prisma.MentorSessionOrderByWithRelationInput[];
    cursor?: Prisma.MentorSessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MentorSessionScalarFieldEnum | Prisma.MentorSessionScalarFieldEnum[];
};
/**
 * Team.leaderboards
 */
export type Team$leaderboardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Team without action
 */
export type TeamDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: Prisma.TeamSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Team
     */
    omit?: Prisma.TeamOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.TeamInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Team.d.ts.map