import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Leaderboard
 *
 */
export type LeaderboardModel = runtime.Types.Result.DefaultSelection<Prisma.$LeaderboardPayload>;
export type AggregateLeaderboard = {
    _count: LeaderboardCountAggregateOutputType | null;
    _avg: LeaderboardAvgAggregateOutputType | null;
    _sum: LeaderboardSumAggregateOutputType | null;
    _min: LeaderboardMinAggregateOutputType | null;
    _max: LeaderboardMaxAggregateOutputType | null;
};
export type LeaderboardAvgAggregateOutputType = {
    points: number | null;
    rank: number | null;
};
export type LeaderboardSumAggregateOutputType = {
    points: number | null;
    rank: number | null;
};
export type LeaderboardMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    teamId: string | null;
    squadId: string | null;
    points: number | null;
    rank: number | null;
    period: string | null;
};
export type LeaderboardMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    teamId: string | null;
    squadId: string | null;
    points: number | null;
    rank: number | null;
    period: string | null;
};
export type LeaderboardCountAggregateOutputType = {
    id: number;
    userId: number;
    teamId: number;
    squadId: number;
    points: number;
    rank: number;
    period: number;
    _all: number;
};
export type LeaderboardAvgAggregateInputType = {
    points?: true;
    rank?: true;
};
export type LeaderboardSumAggregateInputType = {
    points?: true;
    rank?: true;
};
export type LeaderboardMinAggregateInputType = {
    id?: true;
    userId?: true;
    teamId?: true;
    squadId?: true;
    points?: true;
    rank?: true;
    period?: true;
};
export type LeaderboardMaxAggregateInputType = {
    id?: true;
    userId?: true;
    teamId?: true;
    squadId?: true;
    points?: true;
    rank?: true;
    period?: true;
};
export type LeaderboardCountAggregateInputType = {
    id?: true;
    userId?: true;
    teamId?: true;
    squadId?: true;
    points?: true;
    rank?: true;
    period?: true;
    _all?: true;
};
export type LeaderboardAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Leaderboard to aggregate.
     */
    where?: Prisma.LeaderboardWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: Prisma.LeaderboardOrderByWithRelationInput | Prisma.LeaderboardOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.LeaderboardWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Leaderboards.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Leaderboards
    **/
    _count?: true | LeaderboardCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: LeaderboardAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: LeaderboardSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: LeaderboardMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: LeaderboardMaxAggregateInputType;
};
export type GetLeaderboardAggregateType<T extends LeaderboardAggregateArgs> = {
    [P in keyof T & keyof AggregateLeaderboard]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLeaderboard[P]> : Prisma.GetScalarType<T[P], AggregateLeaderboard[P]>;
};
export type LeaderboardGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LeaderboardWhereInput;
    orderBy?: Prisma.LeaderboardOrderByWithAggregationInput | Prisma.LeaderboardOrderByWithAggregationInput[];
    by: Prisma.LeaderboardScalarFieldEnum[] | Prisma.LeaderboardScalarFieldEnum;
    having?: Prisma.LeaderboardScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LeaderboardCountAggregateInputType | true;
    _avg?: LeaderboardAvgAggregateInputType;
    _sum?: LeaderboardSumAggregateInputType;
    _min?: LeaderboardMinAggregateInputType;
    _max?: LeaderboardMaxAggregateInputType;
};
export type LeaderboardGroupByOutputType = {
    id: string;
    userId: string | null;
    teamId: string | null;
    squadId: string | null;
    points: number;
    rank: number;
    period: string;
    _count: LeaderboardCountAggregateOutputType | null;
    _avg: LeaderboardAvgAggregateOutputType | null;
    _sum: LeaderboardSumAggregateOutputType | null;
    _min: LeaderboardMinAggregateOutputType | null;
    _max: LeaderboardMaxAggregateOutputType | null;
};
type GetLeaderboardGroupByPayload<T extends LeaderboardGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LeaderboardGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LeaderboardGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LeaderboardGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LeaderboardGroupByOutputType[P]>;
}>>;
export type LeaderboardWhereInput = {
    AND?: Prisma.LeaderboardWhereInput | Prisma.LeaderboardWhereInput[];
    OR?: Prisma.LeaderboardWhereInput[];
    NOT?: Prisma.LeaderboardWhereInput | Prisma.LeaderboardWhereInput[];
    id?: Prisma.StringFilter<"Leaderboard"> | string;
    userId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    teamId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    squadId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    points?: Prisma.IntFilter<"Leaderboard"> | number;
    rank?: Prisma.IntFilter<"Leaderboard"> | number;
    period?: Prisma.StringFilter<"Leaderboard"> | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    squad?: Prisma.XOR<Prisma.SquadNullableScalarRelationFilter, Prisma.SquadWhereInput> | null;
};
export type LeaderboardOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    rank?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
    squad?: Prisma.SquadOrderByWithRelationInput;
};
export type LeaderboardWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LeaderboardWhereInput | Prisma.LeaderboardWhereInput[];
    OR?: Prisma.LeaderboardWhereInput[];
    NOT?: Prisma.LeaderboardWhereInput | Prisma.LeaderboardWhereInput[];
    userId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    teamId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    squadId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    points?: Prisma.IntFilter<"Leaderboard"> | number;
    rank?: Prisma.IntFilter<"Leaderboard"> | number;
    period?: Prisma.StringFilter<"Leaderboard"> | string;
    user?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
    squad?: Prisma.XOR<Prisma.SquadNullableScalarRelationFilter, Prisma.SquadWhereInput> | null;
}, "id">;
export type LeaderboardOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    rank?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
    _count?: Prisma.LeaderboardCountOrderByAggregateInput;
    _avg?: Prisma.LeaderboardAvgOrderByAggregateInput;
    _max?: Prisma.LeaderboardMaxOrderByAggregateInput;
    _min?: Prisma.LeaderboardMinOrderByAggregateInput;
    _sum?: Prisma.LeaderboardSumOrderByAggregateInput;
};
export type LeaderboardScalarWhereWithAggregatesInput = {
    AND?: Prisma.LeaderboardScalarWhereWithAggregatesInput | Prisma.LeaderboardScalarWhereWithAggregatesInput[];
    OR?: Prisma.LeaderboardScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LeaderboardScalarWhereWithAggregatesInput | Prisma.LeaderboardScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Leaderboard"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"Leaderboard"> | string | null;
    teamId?: Prisma.StringNullableWithAggregatesFilter<"Leaderboard"> | string | null;
    squadId?: Prisma.StringNullableWithAggregatesFilter<"Leaderboard"> | string | null;
    points?: Prisma.IntWithAggregatesFilter<"Leaderboard"> | number;
    rank?: Prisma.IntWithAggregatesFilter<"Leaderboard"> | number;
    period?: Prisma.StringWithAggregatesFilter<"Leaderboard"> | string;
};
export type LeaderboardCreateInput = {
    id?: string;
    points: number;
    rank: number;
    period: string;
    user?: Prisma.UserCreateNestedOneWithoutLeaderboardsInput;
    team?: Prisma.TeamCreateNestedOneWithoutLeaderboardsInput;
    squad?: Prisma.SquadCreateNestedOneWithoutLeaderboardsInput;
};
export type LeaderboardUncheckedCreateInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    squadId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardUpdateInput = {
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneWithoutLeaderboardsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutLeaderboardsNestedInput;
    squad?: Prisma.SquadUpdateOneWithoutLeaderboardsNestedInput;
};
export type LeaderboardUncheckedUpdateInput = {
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardCreateManyInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    squadId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardUpdateManyMutationInput = {
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardUncheckedUpdateManyInput = {
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardListRelationFilter = {
    every?: Prisma.LeaderboardWhereInput;
    some?: Prisma.LeaderboardWhereInput;
    none?: Prisma.LeaderboardWhereInput;
};
export type LeaderboardOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LeaderboardCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    rank?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
};
export type LeaderboardAvgOrderByAggregateInput = {
    points?: Prisma.SortOrder;
    rank?: Prisma.SortOrder;
};
export type LeaderboardMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    rank?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
};
export type LeaderboardMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    points?: Prisma.SortOrder;
    rank?: Prisma.SortOrder;
    period?: Prisma.SortOrder;
};
export type LeaderboardSumOrderByAggregateInput = {
    points?: Prisma.SortOrder;
    rank?: Prisma.SortOrder;
};
export type LeaderboardCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutUserInput, Prisma.LeaderboardUncheckedCreateWithoutUserInput> | Prisma.LeaderboardCreateWithoutUserInput[] | Prisma.LeaderboardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutUserInput | Prisma.LeaderboardCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.LeaderboardCreateManyUserInputEnvelope;
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
};
export type LeaderboardUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutUserInput, Prisma.LeaderboardUncheckedCreateWithoutUserInput> | Prisma.LeaderboardCreateWithoutUserInput[] | Prisma.LeaderboardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutUserInput | Prisma.LeaderboardCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.LeaderboardCreateManyUserInputEnvelope;
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
};
export type LeaderboardUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutUserInput, Prisma.LeaderboardUncheckedCreateWithoutUserInput> | Prisma.LeaderboardCreateWithoutUserInput[] | Prisma.LeaderboardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutUserInput | Prisma.LeaderboardCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.LeaderboardUpsertWithWhereUniqueWithoutUserInput | Prisma.LeaderboardUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.LeaderboardCreateManyUserInputEnvelope;
    set?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    disconnect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    delete?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    update?: Prisma.LeaderboardUpdateWithWhereUniqueWithoutUserInput | Prisma.LeaderboardUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.LeaderboardUpdateManyWithWhereWithoutUserInput | Prisma.LeaderboardUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
};
export type LeaderboardUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutUserInput, Prisma.LeaderboardUncheckedCreateWithoutUserInput> | Prisma.LeaderboardCreateWithoutUserInput[] | Prisma.LeaderboardUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutUserInput | Prisma.LeaderboardCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.LeaderboardUpsertWithWhereUniqueWithoutUserInput | Prisma.LeaderboardUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.LeaderboardCreateManyUserInputEnvelope;
    set?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    disconnect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    delete?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    update?: Prisma.LeaderboardUpdateWithWhereUniqueWithoutUserInput | Prisma.LeaderboardUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.LeaderboardUpdateManyWithWhereWithoutUserInput | Prisma.LeaderboardUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
};
export type LeaderboardCreateNestedManyWithoutSquadInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutSquadInput, Prisma.LeaderboardUncheckedCreateWithoutSquadInput> | Prisma.LeaderboardCreateWithoutSquadInput[] | Prisma.LeaderboardUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutSquadInput | Prisma.LeaderboardCreateOrConnectWithoutSquadInput[];
    createMany?: Prisma.LeaderboardCreateManySquadInputEnvelope;
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
};
export type LeaderboardUncheckedCreateNestedManyWithoutSquadInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutSquadInput, Prisma.LeaderboardUncheckedCreateWithoutSquadInput> | Prisma.LeaderboardCreateWithoutSquadInput[] | Prisma.LeaderboardUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutSquadInput | Prisma.LeaderboardCreateOrConnectWithoutSquadInput[];
    createMany?: Prisma.LeaderboardCreateManySquadInputEnvelope;
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
};
export type LeaderboardUpdateManyWithoutSquadNestedInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutSquadInput, Prisma.LeaderboardUncheckedCreateWithoutSquadInput> | Prisma.LeaderboardCreateWithoutSquadInput[] | Prisma.LeaderboardUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutSquadInput | Prisma.LeaderboardCreateOrConnectWithoutSquadInput[];
    upsert?: Prisma.LeaderboardUpsertWithWhereUniqueWithoutSquadInput | Prisma.LeaderboardUpsertWithWhereUniqueWithoutSquadInput[];
    createMany?: Prisma.LeaderboardCreateManySquadInputEnvelope;
    set?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    disconnect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    delete?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    update?: Prisma.LeaderboardUpdateWithWhereUniqueWithoutSquadInput | Prisma.LeaderboardUpdateWithWhereUniqueWithoutSquadInput[];
    updateMany?: Prisma.LeaderboardUpdateManyWithWhereWithoutSquadInput | Prisma.LeaderboardUpdateManyWithWhereWithoutSquadInput[];
    deleteMany?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
};
export type LeaderboardUncheckedUpdateManyWithoutSquadNestedInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutSquadInput, Prisma.LeaderboardUncheckedCreateWithoutSquadInput> | Prisma.LeaderboardCreateWithoutSquadInput[] | Prisma.LeaderboardUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutSquadInput | Prisma.LeaderboardCreateOrConnectWithoutSquadInput[];
    upsert?: Prisma.LeaderboardUpsertWithWhereUniqueWithoutSquadInput | Prisma.LeaderboardUpsertWithWhereUniqueWithoutSquadInput[];
    createMany?: Prisma.LeaderboardCreateManySquadInputEnvelope;
    set?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    disconnect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    delete?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    update?: Prisma.LeaderboardUpdateWithWhereUniqueWithoutSquadInput | Prisma.LeaderboardUpdateWithWhereUniqueWithoutSquadInput[];
    updateMany?: Prisma.LeaderboardUpdateManyWithWhereWithoutSquadInput | Prisma.LeaderboardUpdateManyWithWhereWithoutSquadInput[];
    deleteMany?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
};
export type LeaderboardCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutTeamInput, Prisma.LeaderboardUncheckedCreateWithoutTeamInput> | Prisma.LeaderboardCreateWithoutTeamInput[] | Prisma.LeaderboardUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutTeamInput | Prisma.LeaderboardCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.LeaderboardCreateManyTeamInputEnvelope;
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
};
export type LeaderboardUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutTeamInput, Prisma.LeaderboardUncheckedCreateWithoutTeamInput> | Prisma.LeaderboardCreateWithoutTeamInput[] | Prisma.LeaderboardUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutTeamInput | Prisma.LeaderboardCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.LeaderboardCreateManyTeamInputEnvelope;
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
};
export type LeaderboardUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutTeamInput, Prisma.LeaderboardUncheckedCreateWithoutTeamInput> | Prisma.LeaderboardCreateWithoutTeamInput[] | Prisma.LeaderboardUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutTeamInput | Prisma.LeaderboardCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.LeaderboardUpsertWithWhereUniqueWithoutTeamInput | Prisma.LeaderboardUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.LeaderboardCreateManyTeamInputEnvelope;
    set?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    disconnect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    delete?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    update?: Prisma.LeaderboardUpdateWithWhereUniqueWithoutTeamInput | Prisma.LeaderboardUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.LeaderboardUpdateManyWithWhereWithoutTeamInput | Prisma.LeaderboardUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
};
export type LeaderboardUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.LeaderboardCreateWithoutTeamInput, Prisma.LeaderboardUncheckedCreateWithoutTeamInput> | Prisma.LeaderboardCreateWithoutTeamInput[] | Prisma.LeaderboardUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.LeaderboardCreateOrConnectWithoutTeamInput | Prisma.LeaderboardCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.LeaderboardUpsertWithWhereUniqueWithoutTeamInput | Prisma.LeaderboardUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.LeaderboardCreateManyTeamInputEnvelope;
    set?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    disconnect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    delete?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    connect?: Prisma.LeaderboardWhereUniqueInput | Prisma.LeaderboardWhereUniqueInput[];
    update?: Prisma.LeaderboardUpdateWithWhereUniqueWithoutTeamInput | Prisma.LeaderboardUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.LeaderboardUpdateManyWithWhereWithoutTeamInput | Prisma.LeaderboardUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
};
export type LeaderboardCreateWithoutUserInput = {
    id?: string;
    points: number;
    rank: number;
    period: string;
    team?: Prisma.TeamCreateNestedOneWithoutLeaderboardsInput;
    squad?: Prisma.SquadCreateNestedOneWithoutLeaderboardsInput;
};
export type LeaderboardUncheckedCreateWithoutUserInput = {
    id?: string;
    teamId?: string | null;
    squadId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardCreateOrConnectWithoutUserInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    create: Prisma.XOR<Prisma.LeaderboardCreateWithoutUserInput, Prisma.LeaderboardUncheckedCreateWithoutUserInput>;
};
export type LeaderboardCreateManyUserInputEnvelope = {
    data: Prisma.LeaderboardCreateManyUserInput | Prisma.LeaderboardCreateManyUserInput[];
};
export type LeaderboardUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    update: Prisma.XOR<Prisma.LeaderboardUpdateWithoutUserInput, Prisma.LeaderboardUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.LeaderboardCreateWithoutUserInput, Prisma.LeaderboardUncheckedCreateWithoutUserInput>;
};
export type LeaderboardUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    data: Prisma.XOR<Prisma.LeaderboardUpdateWithoutUserInput, Prisma.LeaderboardUncheckedUpdateWithoutUserInput>;
};
export type LeaderboardUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.LeaderboardScalarWhereInput;
    data: Prisma.XOR<Prisma.LeaderboardUpdateManyMutationInput, Prisma.LeaderboardUncheckedUpdateManyWithoutUserInput>;
};
export type LeaderboardScalarWhereInput = {
    AND?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
    OR?: Prisma.LeaderboardScalarWhereInput[];
    NOT?: Prisma.LeaderboardScalarWhereInput | Prisma.LeaderboardScalarWhereInput[];
    id?: Prisma.StringFilter<"Leaderboard"> | string;
    userId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    teamId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    squadId?: Prisma.StringNullableFilter<"Leaderboard"> | string | null;
    points?: Prisma.IntFilter<"Leaderboard"> | number;
    rank?: Prisma.IntFilter<"Leaderboard"> | number;
    period?: Prisma.StringFilter<"Leaderboard"> | string;
};
export type LeaderboardCreateWithoutSquadInput = {
    id?: string;
    points: number;
    rank: number;
    period: string;
    user?: Prisma.UserCreateNestedOneWithoutLeaderboardsInput;
    team?: Prisma.TeamCreateNestedOneWithoutLeaderboardsInput;
};
export type LeaderboardUncheckedCreateWithoutSquadInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardCreateOrConnectWithoutSquadInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    create: Prisma.XOR<Prisma.LeaderboardCreateWithoutSquadInput, Prisma.LeaderboardUncheckedCreateWithoutSquadInput>;
};
export type LeaderboardCreateManySquadInputEnvelope = {
    data: Prisma.LeaderboardCreateManySquadInput | Prisma.LeaderboardCreateManySquadInput[];
};
export type LeaderboardUpsertWithWhereUniqueWithoutSquadInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    update: Prisma.XOR<Prisma.LeaderboardUpdateWithoutSquadInput, Prisma.LeaderboardUncheckedUpdateWithoutSquadInput>;
    create: Prisma.XOR<Prisma.LeaderboardCreateWithoutSquadInput, Prisma.LeaderboardUncheckedCreateWithoutSquadInput>;
};
export type LeaderboardUpdateWithWhereUniqueWithoutSquadInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    data: Prisma.XOR<Prisma.LeaderboardUpdateWithoutSquadInput, Prisma.LeaderboardUncheckedUpdateWithoutSquadInput>;
};
export type LeaderboardUpdateManyWithWhereWithoutSquadInput = {
    where: Prisma.LeaderboardScalarWhereInput;
    data: Prisma.XOR<Prisma.LeaderboardUpdateManyMutationInput, Prisma.LeaderboardUncheckedUpdateManyWithoutSquadInput>;
};
export type LeaderboardCreateWithoutTeamInput = {
    id?: string;
    points: number;
    rank: number;
    period: string;
    user?: Prisma.UserCreateNestedOneWithoutLeaderboardsInput;
    squad?: Prisma.SquadCreateNestedOneWithoutLeaderboardsInput;
};
export type LeaderboardUncheckedCreateWithoutTeamInput = {
    id?: string;
    userId?: string | null;
    squadId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardCreateOrConnectWithoutTeamInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    create: Prisma.XOR<Prisma.LeaderboardCreateWithoutTeamInput, Prisma.LeaderboardUncheckedCreateWithoutTeamInput>;
};
export type LeaderboardCreateManyTeamInputEnvelope = {
    data: Prisma.LeaderboardCreateManyTeamInput | Prisma.LeaderboardCreateManyTeamInput[];
};
export type LeaderboardUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    update: Prisma.XOR<Prisma.LeaderboardUpdateWithoutTeamInput, Prisma.LeaderboardUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.LeaderboardCreateWithoutTeamInput, Prisma.LeaderboardUncheckedCreateWithoutTeamInput>;
};
export type LeaderboardUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.LeaderboardWhereUniqueInput;
    data: Prisma.XOR<Prisma.LeaderboardUpdateWithoutTeamInput, Prisma.LeaderboardUncheckedUpdateWithoutTeamInput>;
};
export type LeaderboardUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.LeaderboardScalarWhereInput;
    data: Prisma.XOR<Prisma.LeaderboardUpdateManyMutationInput, Prisma.LeaderboardUncheckedUpdateManyWithoutTeamInput>;
};
export type LeaderboardCreateManyUserInput = {
    id?: string;
    teamId?: string | null;
    squadId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardUpdateWithoutUserInput = {
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    team?: Prisma.TeamUpdateOneWithoutLeaderboardsNestedInput;
    squad?: Prisma.SquadUpdateOneWithoutLeaderboardsNestedInput;
};
export type LeaderboardUncheckedUpdateWithoutUserInput = {
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardUncheckedUpdateManyWithoutUserInput = {
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardCreateManySquadInput = {
    id?: string;
    userId?: string | null;
    teamId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardUpdateWithoutSquadInput = {
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneWithoutLeaderboardsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutLeaderboardsNestedInput;
};
export type LeaderboardUncheckedUpdateWithoutSquadInput = {
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardUncheckedUpdateManyWithoutSquadInput = {
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardCreateManyTeamInput = {
    id?: string;
    userId?: string | null;
    squadId?: string | null;
    points: number;
    rank: number;
    period: string;
};
export type LeaderboardUpdateWithoutTeamInput = {
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneWithoutLeaderboardsNestedInput;
    squad?: Prisma.SquadUpdateOneWithoutLeaderboardsNestedInput;
};
export type LeaderboardUncheckedUpdateWithoutTeamInput = {
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardUncheckedUpdateManyWithoutTeamInput = {
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    points?: Prisma.IntFieldUpdateOperationsInput | number;
    rank?: Prisma.IntFieldUpdateOperationsInput | number;
    period?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type LeaderboardSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    teamId?: boolean;
    squadId?: boolean;
    points?: boolean;
    rank?: boolean;
    period?: boolean;
    user?: boolean | Prisma.Leaderboard$userArgs<ExtArgs>;
    team?: boolean | Prisma.Leaderboard$teamArgs<ExtArgs>;
    squad?: boolean | Prisma.Leaderboard$squadArgs<ExtArgs>;
}, ExtArgs["result"]["leaderboard"]>;
export type LeaderboardSelectScalar = {
    id?: boolean;
    userId?: boolean;
    teamId?: boolean;
    squadId?: boolean;
    points?: boolean;
    rank?: boolean;
    period?: boolean;
};
export type LeaderboardOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "teamId" | "squadId" | "points" | "rank" | "period", ExtArgs["result"]["leaderboard"]>;
export type LeaderboardInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.Leaderboard$userArgs<ExtArgs>;
    team?: boolean | Prisma.Leaderboard$teamArgs<ExtArgs>;
    squad?: boolean | Prisma.Leaderboard$squadArgs<ExtArgs>;
};
export type $LeaderboardPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Leaderboard";
    objects: {
        user: Prisma.$UserPayload<ExtArgs> | null;
        team: Prisma.$TeamPayload<ExtArgs> | null;
        squad: Prisma.$SquadPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string | null;
        teamId: string | null;
        squadId: string | null;
        points: number;
        rank: number;
        period: string;
    }, ExtArgs["result"]["leaderboard"]>;
    composites: {};
};
export type LeaderboardGetPayload<S extends boolean | null | undefined | LeaderboardDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload, S>;
export type LeaderboardCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LeaderboardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LeaderboardCountAggregateInputType | true;
};
export interface LeaderboardDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Leaderboard'];
        meta: {
            name: 'Leaderboard';
        };
    };
    /**
     * Find zero or one Leaderboard that matches the filter.
     * @param {LeaderboardFindUniqueArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeaderboardFindUniqueArgs>(args: Prisma.SelectSubset<T, LeaderboardFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Leaderboard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeaderboardFindUniqueOrThrowArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeaderboardFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LeaderboardFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Leaderboard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardFindFirstArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeaderboardFindFirstArgs>(args?: Prisma.SelectSubset<T, LeaderboardFindFirstArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Leaderboard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardFindFirstOrThrowArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeaderboardFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LeaderboardFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Leaderboards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leaderboards
     * const leaderboards = await prisma.leaderboard.findMany()
     *
     * // Get first 10 Leaderboards
     * const leaderboards = await prisma.leaderboard.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const leaderboardWithIdOnly = await prisma.leaderboard.findMany({ select: { id: true } })
     *
     */
    findMany<T extends LeaderboardFindManyArgs>(args?: Prisma.SelectSubset<T, LeaderboardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Leaderboard.
     * @param {LeaderboardCreateArgs} args - Arguments to create a Leaderboard.
     * @example
     * // Create one Leaderboard
     * const Leaderboard = await prisma.leaderboard.create({
     *   data: {
     *     // ... data to create a Leaderboard
     *   }
     * })
     *
     */
    create<T extends LeaderboardCreateArgs>(args: Prisma.SelectSubset<T, LeaderboardCreateArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Leaderboards.
     * @param {LeaderboardCreateManyArgs} args - Arguments to create many Leaderboards.
     * @example
     * // Create many Leaderboards
     * const leaderboard = await prisma.leaderboard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends LeaderboardCreateManyArgs>(args?: Prisma.SelectSubset<T, LeaderboardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Leaderboard.
     * @param {LeaderboardDeleteArgs} args - Arguments to delete one Leaderboard.
     * @example
     * // Delete one Leaderboard
     * const Leaderboard = await prisma.leaderboard.delete({
     *   where: {
     *     // ... filter to delete one Leaderboard
     *   }
     * })
     *
     */
    delete<T extends LeaderboardDeleteArgs>(args: Prisma.SelectSubset<T, LeaderboardDeleteArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Leaderboard.
     * @param {LeaderboardUpdateArgs} args - Arguments to update one Leaderboard.
     * @example
     * // Update one Leaderboard
     * const leaderboard = await prisma.leaderboard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends LeaderboardUpdateArgs>(args: Prisma.SelectSubset<T, LeaderboardUpdateArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Leaderboards.
     * @param {LeaderboardDeleteManyArgs} args - Arguments to filter Leaderboards to delete.
     * @example
     * // Delete a few Leaderboards
     * const { count } = await prisma.leaderboard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends LeaderboardDeleteManyArgs>(args?: Prisma.SelectSubset<T, LeaderboardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Leaderboards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leaderboards
     * const leaderboard = await prisma.leaderboard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends LeaderboardUpdateManyArgs>(args: Prisma.SelectSubset<T, LeaderboardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Leaderboard.
     * @param {LeaderboardUpsertArgs} args - Arguments to update or create a Leaderboard.
     * @example
     * // Update or create a Leaderboard
     * const leaderboard = await prisma.leaderboard.upsert({
     *   create: {
     *     // ... data to create a Leaderboard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Leaderboard we want to update
     *   }
     * })
     */
    upsert<T extends LeaderboardUpsertArgs>(args: Prisma.SelectSubset<T, LeaderboardUpsertArgs<ExtArgs>>): Prisma.Prisma__LeaderboardClient<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Leaderboards that matches the filter.
     * @param {LeaderboardFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const leaderboard = await prisma.leaderboard.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.LeaderboardFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a Leaderboard.
     * @param {LeaderboardAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const leaderboard = await prisma.leaderboard.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.LeaderboardAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of Leaderboards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardCountArgs} args - Arguments to filter Leaderboards to count.
     * @example
     * // Count the number of Leaderboards
     * const count = await prisma.leaderboard.count({
     *   where: {
     *     // ... the filter for the Leaderboards we want to count
     *   }
     * })
    **/
    count<T extends LeaderboardCountArgs>(args?: Prisma.Subset<T, LeaderboardCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LeaderboardCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Leaderboard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LeaderboardAggregateArgs>(args: Prisma.Subset<T, LeaderboardAggregateArgs>): Prisma.PrismaPromise<GetLeaderboardAggregateType<T>>;
    /**
     * Group by Leaderboard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardGroupByArgs} args - Group by arguments.
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
    groupBy<T extends LeaderboardGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LeaderboardGroupByArgs['orderBy'];
    } : {
        orderBy?: LeaderboardGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LeaderboardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeaderboardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Leaderboard model
     */
    readonly fields: LeaderboardFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Leaderboard.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__LeaderboardClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.Leaderboard$userArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Leaderboard$userArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.Leaderboard$teamArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Leaderboard$teamArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    squad<T extends Prisma.Leaderboard$squadArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Leaderboard$squadArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the Leaderboard model
 */
export interface LeaderboardFieldRefs {
    readonly id: Prisma.FieldRef<"Leaderboard", 'String'>;
    readonly userId: Prisma.FieldRef<"Leaderboard", 'String'>;
    readonly teamId: Prisma.FieldRef<"Leaderboard", 'String'>;
    readonly squadId: Prisma.FieldRef<"Leaderboard", 'String'>;
    readonly points: Prisma.FieldRef<"Leaderboard", 'Int'>;
    readonly rank: Prisma.FieldRef<"Leaderboard", 'Int'>;
    readonly period: Prisma.FieldRef<"Leaderboard", 'String'>;
}
/**
 * Leaderboard findUnique
 */
export type LeaderboardFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Leaderboard to fetch.
     */
    where: Prisma.LeaderboardWhereUniqueInput;
};
/**
 * Leaderboard findUniqueOrThrow
 */
export type LeaderboardFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Leaderboard to fetch.
     */
    where: Prisma.LeaderboardWhereUniqueInput;
};
/**
 * Leaderboard findFirst
 */
export type LeaderboardFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Leaderboard to fetch.
     */
    where?: Prisma.LeaderboardWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: Prisma.LeaderboardOrderByWithRelationInput | Prisma.LeaderboardOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Leaderboards.
     */
    cursor?: Prisma.LeaderboardWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Leaderboards.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Leaderboards.
     */
    distinct?: Prisma.LeaderboardScalarFieldEnum | Prisma.LeaderboardScalarFieldEnum[];
};
/**
 * Leaderboard findFirstOrThrow
 */
export type LeaderboardFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Leaderboard to fetch.
     */
    where?: Prisma.LeaderboardWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: Prisma.LeaderboardOrderByWithRelationInput | Prisma.LeaderboardOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Leaderboards.
     */
    cursor?: Prisma.LeaderboardWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Leaderboards.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Leaderboards.
     */
    distinct?: Prisma.LeaderboardScalarFieldEnum | Prisma.LeaderboardScalarFieldEnum[];
};
/**
 * Leaderboard findMany
 */
export type LeaderboardFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Leaderboards to fetch.
     */
    where?: Prisma.LeaderboardWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: Prisma.LeaderboardOrderByWithRelationInput | Prisma.LeaderboardOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Leaderboards.
     */
    cursor?: Prisma.LeaderboardWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Leaderboards.
     */
    skip?: number;
    distinct?: Prisma.LeaderboardScalarFieldEnum | Prisma.LeaderboardScalarFieldEnum[];
};
/**
 * Leaderboard create
 */
export type LeaderboardCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a Leaderboard.
     */
    data: Prisma.XOR<Prisma.LeaderboardCreateInput, Prisma.LeaderboardUncheckedCreateInput>;
};
/**
 * Leaderboard createMany
 */
export type LeaderboardCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leaderboards.
     */
    data: Prisma.LeaderboardCreateManyInput | Prisma.LeaderboardCreateManyInput[];
};
/**
 * Leaderboard update
 */
export type LeaderboardUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a Leaderboard.
     */
    data: Prisma.XOR<Prisma.LeaderboardUpdateInput, Prisma.LeaderboardUncheckedUpdateInput>;
    /**
     * Choose, which Leaderboard to update.
     */
    where: Prisma.LeaderboardWhereUniqueInput;
};
/**
 * Leaderboard updateMany
 */
export type LeaderboardUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Leaderboards.
     */
    data: Prisma.XOR<Prisma.LeaderboardUpdateManyMutationInput, Prisma.LeaderboardUncheckedUpdateManyInput>;
    /**
     * Filter which Leaderboards to update
     */
    where?: Prisma.LeaderboardWhereInput;
    /**
     * Limit how many Leaderboards to update.
     */
    limit?: number;
};
/**
 * Leaderboard upsert
 */
export type LeaderboardUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the Leaderboard to update in case it exists.
     */
    where: Prisma.LeaderboardWhereUniqueInput;
    /**
     * In case the Leaderboard found by the `where` argument doesn't exist, create a new Leaderboard with this data.
     */
    create: Prisma.XOR<Prisma.LeaderboardCreateInput, Prisma.LeaderboardUncheckedCreateInput>;
    /**
     * In case the Leaderboard was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.LeaderboardUpdateInput, Prisma.LeaderboardUncheckedUpdateInput>;
};
/**
 * Leaderboard delete
 */
export type LeaderboardDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which Leaderboard to delete.
     */
    where: Prisma.LeaderboardWhereUniqueInput;
};
/**
 * Leaderboard deleteMany
 */
export type LeaderboardDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Leaderboards to delete
     */
    where?: Prisma.LeaderboardWhereInput;
    /**
     * Limit how many Leaderboards to delete.
     */
    limit?: number;
};
/**
 * Leaderboard findRaw
 */
export type LeaderboardFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Leaderboard aggregateRaw
 */
export type LeaderboardAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Leaderboard.user
 */
export type Leaderboard$userArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.UserWhereInput;
};
/**
 * Leaderboard.team
 */
export type Leaderboard$teamArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.TeamWhereInput;
};
/**
 * Leaderboard.squad
 */
export type Leaderboard$squadArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * Leaderboard without action
 */
export type LeaderboardDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=Leaderboard.d.ts.map