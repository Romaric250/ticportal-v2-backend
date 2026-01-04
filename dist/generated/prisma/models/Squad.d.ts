import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Squad
 * Organizations
 */
export type SquadModel = runtime.Types.Result.DefaultSelection<Prisma.$SquadPayload>;
export type AggregateSquad = {
    _count: SquadCountAggregateOutputType | null;
    _min: SquadMinAggregateOutputType | null;
    _max: SquadMaxAggregateOutputType | null;
};
export type SquadMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    schoolName: string | null;
    region: string | null;
    area: string | null;
    leadId: string | null;
    status: $Enums.SquadStatus | null;
    createdAt: Date | null;
};
export type SquadMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    schoolName: string | null;
    region: string | null;
    area: string | null;
    leadId: string | null;
    status: $Enums.SquadStatus | null;
    createdAt: Date | null;
};
export type SquadCountAggregateOutputType = {
    id: number;
    name: number;
    schoolName: number;
    region: number;
    area: number;
    leadId: number;
    status: number;
    createdAt: number;
    _all: number;
};
export type SquadMinAggregateInputType = {
    id?: true;
    name?: true;
    schoolName?: true;
    region?: true;
    area?: true;
    leadId?: true;
    status?: true;
    createdAt?: true;
};
export type SquadMaxAggregateInputType = {
    id?: true;
    name?: true;
    schoolName?: true;
    region?: true;
    area?: true;
    leadId?: true;
    status?: true;
    createdAt?: true;
};
export type SquadCountAggregateInputType = {
    id?: true;
    name?: true;
    schoolName?: true;
    region?: true;
    area?: true;
    leadId?: true;
    status?: true;
    createdAt?: true;
    _all?: true;
};
export type SquadAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Squad to aggregate.
     */
    where?: Prisma.SquadWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Squads to fetch.
     */
    orderBy?: Prisma.SquadOrderByWithRelationInput | Prisma.SquadOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SquadWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Squads from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Squads.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Squads
    **/
    _count?: true | SquadCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SquadMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SquadMaxAggregateInputType;
};
export type GetSquadAggregateType<T extends SquadAggregateArgs> = {
    [P in keyof T & keyof AggregateSquad]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSquad[P]> : Prisma.GetScalarType<T[P], AggregateSquad[P]>;
};
export type SquadGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SquadWhereInput;
    orderBy?: Prisma.SquadOrderByWithAggregationInput | Prisma.SquadOrderByWithAggregationInput[];
    by: Prisma.SquadScalarFieldEnum[] | Prisma.SquadScalarFieldEnum;
    having?: Prisma.SquadScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SquadCountAggregateInputType | true;
    _min?: SquadMinAggregateInputType;
    _max?: SquadMaxAggregateInputType;
};
export type SquadGroupByOutputType = {
    id: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    leadId: string;
    status: $Enums.SquadStatus;
    createdAt: Date;
    _count: SquadCountAggregateOutputType | null;
    _min: SquadMinAggregateOutputType | null;
    _max: SquadMaxAggregateOutputType | null;
};
type GetSquadGroupByPayload<T extends SquadGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SquadGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SquadGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SquadGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SquadGroupByOutputType[P]>;
}>>;
export type SquadWhereInput = {
    AND?: Prisma.SquadWhereInput | Prisma.SquadWhereInput[];
    OR?: Prisma.SquadWhereInput[];
    NOT?: Prisma.SquadWhereInput | Prisma.SquadWhereInput[];
    id?: Prisma.StringFilter<"Squad"> | string;
    name?: Prisma.StringFilter<"Squad"> | string;
    schoolName?: Prisma.StringFilter<"Squad"> | string;
    region?: Prisma.StringFilter<"Squad"> | string;
    area?: Prisma.StringFilter<"Squad"> | string;
    leadId?: Prisma.StringFilter<"Squad"> | string;
    status?: Prisma.EnumSquadStatusFilter<"Squad"> | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFilter<"Squad"> | Date | string;
    lead?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.SquadMemberListRelationFilter;
    teams?: Prisma.TeamListRelationFilter;
    hackathons?: Prisma.HackathonListRelationFilter;
    leaderboards?: Prisma.LeaderboardListRelationFilter;
};
export type SquadOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    area?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lead?: Prisma.UserOrderByWithRelationInput;
    members?: Prisma.SquadMemberOrderByRelationAggregateInput;
    teams?: Prisma.TeamOrderByRelationAggregateInput;
    hackathons?: Prisma.HackathonOrderByRelationAggregateInput;
    leaderboards?: Prisma.LeaderboardOrderByRelationAggregateInput;
};
export type SquadWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SquadWhereInput | Prisma.SquadWhereInput[];
    OR?: Prisma.SquadWhereInput[];
    NOT?: Prisma.SquadWhereInput | Prisma.SquadWhereInput[];
    name?: Prisma.StringFilter<"Squad"> | string;
    schoolName?: Prisma.StringFilter<"Squad"> | string;
    region?: Prisma.StringFilter<"Squad"> | string;
    area?: Prisma.StringFilter<"Squad"> | string;
    leadId?: Prisma.StringFilter<"Squad"> | string;
    status?: Prisma.EnumSquadStatusFilter<"Squad"> | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFilter<"Squad"> | Date | string;
    lead?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.SquadMemberListRelationFilter;
    teams?: Prisma.TeamListRelationFilter;
    hackathons?: Prisma.HackathonListRelationFilter;
    leaderboards?: Prisma.LeaderboardListRelationFilter;
}, "id">;
export type SquadOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    area?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SquadCountOrderByAggregateInput;
    _max?: Prisma.SquadMaxOrderByAggregateInput;
    _min?: Prisma.SquadMinOrderByAggregateInput;
};
export type SquadScalarWhereWithAggregatesInput = {
    AND?: Prisma.SquadScalarWhereWithAggregatesInput | Prisma.SquadScalarWhereWithAggregatesInput[];
    OR?: Prisma.SquadScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SquadScalarWhereWithAggregatesInput | Prisma.SquadScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Squad"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Squad"> | string;
    schoolName?: Prisma.StringWithAggregatesFilter<"Squad"> | string;
    region?: Prisma.StringWithAggregatesFilter<"Squad"> | string;
    area?: Prisma.StringWithAggregatesFilter<"Squad"> | string;
    leadId?: Prisma.StringWithAggregatesFilter<"Squad"> | string;
    status?: Prisma.EnumSquadStatusWithAggregatesFilter<"Squad"> | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Squad"> | Date | string;
};
export type SquadCreateInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    lead: Prisma.UserCreateNestedOneWithoutSquadsInput;
    members?: Prisma.SquadMemberCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutSquadInput;
};
export type SquadUncheckedCreateInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    leadId: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    members?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonUncheckedCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutSquadInput;
};
export type SquadUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lead?: Prisma.UserUpdateOneRequiredWithoutSquadsNestedInput;
    members?: Prisma.SquadMemberUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutSquadNestedInput;
};
export type SquadUncheckedUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.SquadMemberUncheckedUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUncheckedUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutSquadNestedInput;
};
export type SquadCreateManyInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    leadId: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
};
export type SquadUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SquadUncheckedUpdateManyInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SquadListRelationFilter = {
    every?: Prisma.SquadWhereInput;
    some?: Prisma.SquadWhereInput;
    none?: Prisma.SquadWhereInput;
};
export type SquadOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SquadCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    area?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SquadMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    area?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SquadMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    schoolName?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    area?: Prisma.SortOrder;
    leadId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SquadScalarRelationFilter = {
    is?: Prisma.SquadWhereInput;
    isNot?: Prisma.SquadWhereInput;
};
export type SquadNullableScalarRelationFilter = {
    is?: Prisma.SquadWhereInput | null;
    isNot?: Prisma.SquadWhereInput | null;
};
export type SquadCreateNestedManyWithoutLeadInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutLeadInput, Prisma.SquadUncheckedCreateWithoutLeadInput> | Prisma.SquadCreateWithoutLeadInput[] | Prisma.SquadUncheckedCreateWithoutLeadInput[];
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutLeadInput | Prisma.SquadCreateOrConnectWithoutLeadInput[];
    createMany?: Prisma.SquadCreateManyLeadInputEnvelope;
    connect?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
};
export type SquadUncheckedCreateNestedManyWithoutLeadInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutLeadInput, Prisma.SquadUncheckedCreateWithoutLeadInput> | Prisma.SquadCreateWithoutLeadInput[] | Prisma.SquadUncheckedCreateWithoutLeadInput[];
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutLeadInput | Prisma.SquadCreateOrConnectWithoutLeadInput[];
    createMany?: Prisma.SquadCreateManyLeadInputEnvelope;
    connect?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
};
export type SquadUpdateManyWithoutLeadNestedInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutLeadInput, Prisma.SquadUncheckedCreateWithoutLeadInput> | Prisma.SquadCreateWithoutLeadInput[] | Prisma.SquadUncheckedCreateWithoutLeadInput[];
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutLeadInput | Prisma.SquadCreateOrConnectWithoutLeadInput[];
    upsert?: Prisma.SquadUpsertWithWhereUniqueWithoutLeadInput | Prisma.SquadUpsertWithWhereUniqueWithoutLeadInput[];
    createMany?: Prisma.SquadCreateManyLeadInputEnvelope;
    set?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    disconnect?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    delete?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    connect?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    update?: Prisma.SquadUpdateWithWhereUniqueWithoutLeadInput | Prisma.SquadUpdateWithWhereUniqueWithoutLeadInput[];
    updateMany?: Prisma.SquadUpdateManyWithWhereWithoutLeadInput | Prisma.SquadUpdateManyWithWhereWithoutLeadInput[];
    deleteMany?: Prisma.SquadScalarWhereInput | Prisma.SquadScalarWhereInput[];
};
export type SquadUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutLeadInput, Prisma.SquadUncheckedCreateWithoutLeadInput> | Prisma.SquadCreateWithoutLeadInput[] | Prisma.SquadUncheckedCreateWithoutLeadInput[];
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutLeadInput | Prisma.SquadCreateOrConnectWithoutLeadInput[];
    upsert?: Prisma.SquadUpsertWithWhereUniqueWithoutLeadInput | Prisma.SquadUpsertWithWhereUniqueWithoutLeadInput[];
    createMany?: Prisma.SquadCreateManyLeadInputEnvelope;
    set?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    disconnect?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    delete?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    connect?: Prisma.SquadWhereUniqueInput | Prisma.SquadWhereUniqueInput[];
    update?: Prisma.SquadUpdateWithWhereUniqueWithoutLeadInput | Prisma.SquadUpdateWithWhereUniqueWithoutLeadInput[];
    updateMany?: Prisma.SquadUpdateManyWithWhereWithoutLeadInput | Prisma.SquadUpdateManyWithWhereWithoutLeadInput[];
    deleteMany?: Prisma.SquadScalarWhereInput | Prisma.SquadScalarWhereInput[];
};
export type EnumSquadStatusFieldUpdateOperationsInput = {
    set?: $Enums.SquadStatus;
};
export type SquadCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutMembersInput, Prisma.SquadUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutMembersInput;
    connect?: Prisma.SquadWhereUniqueInput;
};
export type SquadUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutMembersInput, Prisma.SquadUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.SquadUpsertWithoutMembersInput;
    connect?: Prisma.SquadWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SquadUpdateToOneWithWhereWithoutMembersInput, Prisma.SquadUpdateWithoutMembersInput>, Prisma.SquadUncheckedUpdateWithoutMembersInput>;
};
export type SquadCreateNestedOneWithoutTeamsInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutTeamsInput, Prisma.SquadUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutTeamsInput;
    connect?: Prisma.SquadWhereUniqueInput;
};
export type SquadUpdateOneRequiredWithoutTeamsNestedInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutTeamsInput, Prisma.SquadUncheckedCreateWithoutTeamsInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutTeamsInput;
    upsert?: Prisma.SquadUpsertWithoutTeamsInput;
    connect?: Prisma.SquadWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SquadUpdateToOneWithWhereWithoutTeamsInput, Prisma.SquadUpdateWithoutTeamsInput>, Prisma.SquadUncheckedUpdateWithoutTeamsInput>;
};
export type SquadCreateNestedOneWithoutHackathonsInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutHackathonsInput, Prisma.SquadUncheckedCreateWithoutHackathonsInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutHackathonsInput;
    connect?: Prisma.SquadWhereUniqueInput;
};
export type SquadUpdateOneWithoutHackathonsNestedInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutHackathonsInput, Prisma.SquadUncheckedCreateWithoutHackathonsInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutHackathonsInput;
    upsert?: Prisma.SquadUpsertWithoutHackathonsInput;
    disconnect?: boolean;
    delete?: Prisma.SquadWhereInput | boolean;
    connect?: Prisma.SquadWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SquadUpdateToOneWithWhereWithoutHackathonsInput, Prisma.SquadUpdateWithoutHackathonsInput>, Prisma.SquadUncheckedUpdateWithoutHackathonsInput>;
};
export type SquadCreateNestedOneWithoutLeaderboardsInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutLeaderboardsInput, Prisma.SquadUncheckedCreateWithoutLeaderboardsInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutLeaderboardsInput;
    connect?: Prisma.SquadWhereUniqueInput;
};
export type SquadUpdateOneWithoutLeaderboardsNestedInput = {
    create?: Prisma.XOR<Prisma.SquadCreateWithoutLeaderboardsInput, Prisma.SquadUncheckedCreateWithoutLeaderboardsInput>;
    connectOrCreate?: Prisma.SquadCreateOrConnectWithoutLeaderboardsInput;
    upsert?: Prisma.SquadUpsertWithoutLeaderboardsInput;
    disconnect?: boolean;
    delete?: Prisma.SquadWhereInput | boolean;
    connect?: Prisma.SquadWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SquadUpdateToOneWithWhereWithoutLeaderboardsInput, Prisma.SquadUpdateWithoutLeaderboardsInput>, Prisma.SquadUncheckedUpdateWithoutLeaderboardsInput>;
};
export type SquadCreateWithoutLeadInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    members?: Prisma.SquadMemberCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutSquadInput;
};
export type SquadUncheckedCreateWithoutLeadInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    members?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonUncheckedCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutSquadInput;
};
export type SquadCreateOrConnectWithoutLeadInput = {
    where: Prisma.SquadWhereUniqueInput;
    create: Prisma.XOR<Prisma.SquadCreateWithoutLeadInput, Prisma.SquadUncheckedCreateWithoutLeadInput>;
};
export type SquadCreateManyLeadInputEnvelope = {
    data: Prisma.SquadCreateManyLeadInput | Prisma.SquadCreateManyLeadInput[];
};
export type SquadUpsertWithWhereUniqueWithoutLeadInput = {
    where: Prisma.SquadWhereUniqueInput;
    update: Prisma.XOR<Prisma.SquadUpdateWithoutLeadInput, Prisma.SquadUncheckedUpdateWithoutLeadInput>;
    create: Prisma.XOR<Prisma.SquadCreateWithoutLeadInput, Prisma.SquadUncheckedCreateWithoutLeadInput>;
};
export type SquadUpdateWithWhereUniqueWithoutLeadInput = {
    where: Prisma.SquadWhereUniqueInput;
    data: Prisma.XOR<Prisma.SquadUpdateWithoutLeadInput, Prisma.SquadUncheckedUpdateWithoutLeadInput>;
};
export type SquadUpdateManyWithWhereWithoutLeadInput = {
    where: Prisma.SquadScalarWhereInput;
    data: Prisma.XOR<Prisma.SquadUpdateManyMutationInput, Prisma.SquadUncheckedUpdateManyWithoutLeadInput>;
};
export type SquadScalarWhereInput = {
    AND?: Prisma.SquadScalarWhereInput | Prisma.SquadScalarWhereInput[];
    OR?: Prisma.SquadScalarWhereInput[];
    NOT?: Prisma.SquadScalarWhereInput | Prisma.SquadScalarWhereInput[];
    id?: Prisma.StringFilter<"Squad"> | string;
    name?: Prisma.StringFilter<"Squad"> | string;
    schoolName?: Prisma.StringFilter<"Squad"> | string;
    region?: Prisma.StringFilter<"Squad"> | string;
    area?: Prisma.StringFilter<"Squad"> | string;
    leadId?: Prisma.StringFilter<"Squad"> | string;
    status?: Prisma.EnumSquadStatusFilter<"Squad"> | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFilter<"Squad"> | Date | string;
};
export type SquadCreateWithoutMembersInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    lead: Prisma.UserCreateNestedOneWithoutSquadsInput;
    teams?: Prisma.TeamCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutSquadInput;
};
export type SquadUncheckedCreateWithoutMembersInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    leadId: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonUncheckedCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutSquadInput;
};
export type SquadCreateOrConnectWithoutMembersInput = {
    where: Prisma.SquadWhereUniqueInput;
    create: Prisma.XOR<Prisma.SquadCreateWithoutMembersInput, Prisma.SquadUncheckedCreateWithoutMembersInput>;
};
export type SquadUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.SquadUpdateWithoutMembersInput, Prisma.SquadUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.SquadCreateWithoutMembersInput, Prisma.SquadUncheckedCreateWithoutMembersInput>;
    where?: Prisma.SquadWhereInput;
};
export type SquadUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.SquadWhereInput;
    data: Prisma.XOR<Prisma.SquadUpdateWithoutMembersInput, Prisma.SquadUncheckedUpdateWithoutMembersInput>;
};
export type SquadUpdateWithoutMembersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lead?: Prisma.UserUpdateOneRequiredWithoutSquadsNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutSquadNestedInput;
};
export type SquadUncheckedUpdateWithoutMembersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUncheckedUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutSquadNestedInput;
};
export type SquadCreateWithoutTeamsInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    lead: Prisma.UserCreateNestedOneWithoutSquadsInput;
    members?: Prisma.SquadMemberCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutSquadInput;
};
export type SquadUncheckedCreateWithoutTeamsInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    leadId: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    members?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonUncheckedCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutSquadInput;
};
export type SquadCreateOrConnectWithoutTeamsInput = {
    where: Prisma.SquadWhereUniqueInput;
    create: Prisma.XOR<Prisma.SquadCreateWithoutTeamsInput, Prisma.SquadUncheckedCreateWithoutTeamsInput>;
};
export type SquadUpsertWithoutTeamsInput = {
    update: Prisma.XOR<Prisma.SquadUpdateWithoutTeamsInput, Prisma.SquadUncheckedUpdateWithoutTeamsInput>;
    create: Prisma.XOR<Prisma.SquadCreateWithoutTeamsInput, Prisma.SquadUncheckedCreateWithoutTeamsInput>;
    where?: Prisma.SquadWhereInput;
};
export type SquadUpdateToOneWithWhereWithoutTeamsInput = {
    where?: Prisma.SquadWhereInput;
    data: Prisma.XOR<Prisma.SquadUpdateWithoutTeamsInput, Prisma.SquadUncheckedUpdateWithoutTeamsInput>;
};
export type SquadUpdateWithoutTeamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lead?: Prisma.UserUpdateOneRequiredWithoutSquadsNestedInput;
    members?: Prisma.SquadMemberUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutSquadNestedInput;
};
export type SquadUncheckedUpdateWithoutTeamsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.SquadMemberUncheckedUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUncheckedUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutSquadNestedInput;
};
export type SquadCreateWithoutHackathonsInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    lead: Prisma.UserCreateNestedOneWithoutSquadsInput;
    members?: Prisma.SquadMemberCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardCreateNestedManyWithoutSquadInput;
};
export type SquadUncheckedCreateWithoutHackathonsInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    leadId: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    members?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutSquadInput;
    leaderboards?: Prisma.LeaderboardUncheckedCreateNestedManyWithoutSquadInput;
};
export type SquadCreateOrConnectWithoutHackathonsInput = {
    where: Prisma.SquadWhereUniqueInput;
    create: Prisma.XOR<Prisma.SquadCreateWithoutHackathonsInput, Prisma.SquadUncheckedCreateWithoutHackathonsInput>;
};
export type SquadUpsertWithoutHackathonsInput = {
    update: Prisma.XOR<Prisma.SquadUpdateWithoutHackathonsInput, Prisma.SquadUncheckedUpdateWithoutHackathonsInput>;
    create: Prisma.XOR<Prisma.SquadCreateWithoutHackathonsInput, Prisma.SquadUncheckedCreateWithoutHackathonsInput>;
    where?: Prisma.SquadWhereInput;
};
export type SquadUpdateToOneWithWhereWithoutHackathonsInput = {
    where?: Prisma.SquadWhereInput;
    data: Prisma.XOR<Prisma.SquadUpdateWithoutHackathonsInput, Prisma.SquadUncheckedUpdateWithoutHackathonsInput>;
};
export type SquadUpdateWithoutHackathonsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lead?: Prisma.UserUpdateOneRequiredWithoutSquadsNestedInput;
    members?: Prisma.SquadMemberUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutSquadNestedInput;
};
export type SquadUncheckedUpdateWithoutHackathonsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.SquadMemberUncheckedUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutSquadNestedInput;
};
export type SquadCreateWithoutLeaderboardsInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    lead: Prisma.UserCreateNestedOneWithoutSquadsInput;
    members?: Prisma.SquadMemberCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonCreateNestedManyWithoutSquadInput;
};
export type SquadUncheckedCreateWithoutLeaderboardsInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    leadId: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
    members?: Prisma.SquadMemberUncheckedCreateNestedManyWithoutSquadInput;
    teams?: Prisma.TeamUncheckedCreateNestedManyWithoutSquadInput;
    hackathons?: Prisma.HackathonUncheckedCreateNestedManyWithoutSquadInput;
};
export type SquadCreateOrConnectWithoutLeaderboardsInput = {
    where: Prisma.SquadWhereUniqueInput;
    create: Prisma.XOR<Prisma.SquadCreateWithoutLeaderboardsInput, Prisma.SquadUncheckedCreateWithoutLeaderboardsInput>;
};
export type SquadUpsertWithoutLeaderboardsInput = {
    update: Prisma.XOR<Prisma.SquadUpdateWithoutLeaderboardsInput, Prisma.SquadUncheckedUpdateWithoutLeaderboardsInput>;
    create: Prisma.XOR<Prisma.SquadCreateWithoutLeaderboardsInput, Prisma.SquadUncheckedCreateWithoutLeaderboardsInput>;
    where?: Prisma.SquadWhereInput;
};
export type SquadUpdateToOneWithWhereWithoutLeaderboardsInput = {
    where?: Prisma.SquadWhereInput;
    data: Prisma.XOR<Prisma.SquadUpdateWithoutLeaderboardsInput, Prisma.SquadUncheckedUpdateWithoutLeaderboardsInput>;
};
export type SquadUpdateWithoutLeaderboardsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lead?: Prisma.UserUpdateOneRequiredWithoutSquadsNestedInput;
    members?: Prisma.SquadMemberUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUpdateManyWithoutSquadNestedInput;
};
export type SquadUncheckedUpdateWithoutLeaderboardsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    leadId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.SquadMemberUncheckedUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUncheckedUpdateManyWithoutSquadNestedInput;
};
export type SquadCreateManyLeadInput = {
    id?: string;
    name: string;
    schoolName: string;
    region: string;
    area: string;
    status?: $Enums.SquadStatus;
    createdAt?: Date | string;
};
export type SquadUpdateWithoutLeadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.SquadMemberUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUpdateManyWithoutSquadNestedInput;
};
export type SquadUncheckedUpdateWithoutLeadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.SquadMemberUncheckedUpdateManyWithoutSquadNestedInput;
    teams?: Prisma.TeamUncheckedUpdateManyWithoutSquadNestedInput;
    hackathons?: Prisma.HackathonUncheckedUpdateManyWithoutSquadNestedInput;
    leaderboards?: Prisma.LeaderboardUncheckedUpdateManyWithoutSquadNestedInput;
};
export type SquadUncheckedUpdateManyWithoutLeadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    schoolName?: Prisma.StringFieldUpdateOperationsInput | string;
    region?: Prisma.StringFieldUpdateOperationsInput | string;
    area?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumSquadStatusFieldUpdateOperationsInput | $Enums.SquadStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type SquadCountOutputType
 */
export type SquadCountOutputType = {
    members: number;
    teams: number;
    hackathons: number;
    leaderboards: number;
};
export type SquadCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | SquadCountOutputTypeCountMembersArgs;
    teams?: boolean | SquadCountOutputTypeCountTeamsArgs;
    hackathons?: boolean | SquadCountOutputTypeCountHackathonsArgs;
    leaderboards?: boolean | SquadCountOutputTypeCountLeaderboardsArgs;
};
/**
 * SquadCountOutputType without action
 */
export type SquadCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SquadCountOutputType
     */
    select?: Prisma.SquadCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * SquadCountOutputType without action
 */
export type SquadCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SquadMemberWhereInput;
};
/**
 * SquadCountOutputType without action
 */
export type SquadCountOutputTypeCountTeamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeamWhereInput;
};
/**
 * SquadCountOutputType without action
 */
export type SquadCountOutputTypeCountHackathonsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HackathonWhereInput;
};
/**
 * SquadCountOutputType without action
 */
export type SquadCountOutputTypeCountLeaderboardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LeaderboardWhereInput;
};
export type SquadSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    schoolName?: boolean;
    region?: boolean;
    area?: boolean;
    leadId?: boolean;
    status?: boolean;
    createdAt?: boolean;
    lead?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Squad$membersArgs<ExtArgs>;
    teams?: boolean | Prisma.Squad$teamsArgs<ExtArgs>;
    hackathons?: boolean | Prisma.Squad$hackathonsArgs<ExtArgs>;
    leaderboards?: boolean | Prisma.Squad$leaderboardsArgs<ExtArgs>;
    _count?: boolean | Prisma.SquadCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["squad"]>;
export type SquadSelectScalar = {
    id?: boolean;
    name?: boolean;
    schoolName?: boolean;
    region?: boolean;
    area?: boolean;
    leadId?: boolean;
    status?: boolean;
    createdAt?: boolean;
};
export type SquadOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "schoolName" | "region" | "area" | "leadId" | "status" | "createdAt", ExtArgs["result"]["squad"]>;
export type SquadInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lead?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Squad$membersArgs<ExtArgs>;
    teams?: boolean | Prisma.Squad$teamsArgs<ExtArgs>;
    hackathons?: boolean | Prisma.Squad$hackathonsArgs<ExtArgs>;
    leaderboards?: boolean | Prisma.Squad$leaderboardsArgs<ExtArgs>;
    _count?: boolean | Prisma.SquadCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $SquadPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Squad";
    objects: {
        lead: Prisma.$UserPayload<ExtArgs>;
        members: Prisma.$SquadMemberPayload<ExtArgs>[];
        teams: Prisma.$TeamPayload<ExtArgs>[];
        hackathons: Prisma.$HackathonPayload<ExtArgs>[];
        leaderboards: Prisma.$LeaderboardPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        schoolName: string;
        region: string;
        area: string;
        leadId: string;
        status: $Enums.SquadStatus;
        createdAt: Date;
    }, ExtArgs["result"]["squad"]>;
    composites: {};
};
export type SquadGetPayload<S extends boolean | null | undefined | SquadDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SquadPayload, S>;
export type SquadCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SquadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SquadCountAggregateInputType | true;
};
export interface SquadDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Squad'];
        meta: {
            name: 'Squad';
        };
    };
    /**
     * Find zero or one Squad that matches the filter.
     * @param {SquadFindUniqueArgs} args - Arguments to find a Squad
     * @example
     * // Get one Squad
     * const squad = await prisma.squad.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SquadFindUniqueArgs>(args: Prisma.SelectSubset<T, SquadFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Squad that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SquadFindUniqueOrThrowArgs} args - Arguments to find a Squad
     * @example
     * // Get one Squad
     * const squad = await prisma.squad.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SquadFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SquadFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Squad that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SquadFindFirstArgs} args - Arguments to find a Squad
     * @example
     * // Get one Squad
     * const squad = await prisma.squad.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SquadFindFirstArgs>(args?: Prisma.SelectSubset<T, SquadFindFirstArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Squad that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SquadFindFirstOrThrowArgs} args - Arguments to find a Squad
     * @example
     * // Get one Squad
     * const squad = await prisma.squad.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SquadFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SquadFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Squads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SquadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Squads
     * const squads = await prisma.squad.findMany()
     *
     * // Get first 10 Squads
     * const squads = await prisma.squad.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const squadWithIdOnly = await prisma.squad.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SquadFindManyArgs>(args?: Prisma.SelectSubset<T, SquadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Squad.
     * @param {SquadCreateArgs} args - Arguments to create a Squad.
     * @example
     * // Create one Squad
     * const Squad = await prisma.squad.create({
     *   data: {
     *     // ... data to create a Squad
     *   }
     * })
     *
     */
    create<T extends SquadCreateArgs>(args: Prisma.SelectSubset<T, SquadCreateArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Squads.
     * @param {SquadCreateManyArgs} args - Arguments to create many Squads.
     * @example
     * // Create many Squads
     * const squad = await prisma.squad.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SquadCreateManyArgs>(args?: Prisma.SelectSubset<T, SquadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Squad.
     * @param {SquadDeleteArgs} args - Arguments to delete one Squad.
     * @example
     * // Delete one Squad
     * const Squad = await prisma.squad.delete({
     *   where: {
     *     // ... filter to delete one Squad
     *   }
     * })
     *
     */
    delete<T extends SquadDeleteArgs>(args: Prisma.SelectSubset<T, SquadDeleteArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Squad.
     * @param {SquadUpdateArgs} args - Arguments to update one Squad.
     * @example
     * // Update one Squad
     * const squad = await prisma.squad.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SquadUpdateArgs>(args: Prisma.SelectSubset<T, SquadUpdateArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Squads.
     * @param {SquadDeleteManyArgs} args - Arguments to filter Squads to delete.
     * @example
     * // Delete a few Squads
     * const { count } = await prisma.squad.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SquadDeleteManyArgs>(args?: Prisma.SelectSubset<T, SquadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Squads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SquadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Squads
     * const squad = await prisma.squad.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SquadUpdateManyArgs>(args: Prisma.SelectSubset<T, SquadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Squad.
     * @param {SquadUpsertArgs} args - Arguments to update or create a Squad.
     * @example
     * // Update or create a Squad
     * const squad = await prisma.squad.upsert({
     *   create: {
     *     // ... data to create a Squad
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Squad we want to update
     *   }
     * })
     */
    upsert<T extends SquadUpsertArgs>(args: Prisma.SelectSubset<T, SquadUpsertArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Squads that matches the filter.
     * @param {SquadFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const squad = await prisma.squad.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.SquadFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a Squad.
     * @param {SquadAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const squad = await prisma.squad.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.SquadAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of Squads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SquadCountArgs} args - Arguments to filter Squads to count.
     * @example
     * // Count the number of Squads
     * const count = await prisma.squad.count({
     *   where: {
     *     // ... the filter for the Squads we want to count
     *   }
     * })
    **/
    count<T extends SquadCountArgs>(args?: Prisma.Subset<T, SquadCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SquadCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Squad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SquadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SquadAggregateArgs>(args: Prisma.Subset<T, SquadAggregateArgs>): Prisma.PrismaPromise<GetSquadAggregateType<T>>;
    /**
     * Group by Squad.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SquadGroupByArgs} args - Group by arguments.
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
    groupBy<T extends SquadGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SquadGroupByArgs['orderBy'];
    } : {
        orderBy?: SquadGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SquadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSquadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Squad model
     */
    readonly fields: SquadFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Squad.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SquadClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lead<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Squad$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Squad$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SquadMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    teams<T extends Prisma.Squad$teamsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Squad$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    hackathons<T extends Prisma.Squad$hackathonsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Squad$hackathonsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    leaderboards<T extends Prisma.Squad$leaderboardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Squad$leaderboardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Squad model
 */
export interface SquadFieldRefs {
    readonly id: Prisma.FieldRef<"Squad", 'String'>;
    readonly name: Prisma.FieldRef<"Squad", 'String'>;
    readonly schoolName: Prisma.FieldRef<"Squad", 'String'>;
    readonly region: Prisma.FieldRef<"Squad", 'String'>;
    readonly area: Prisma.FieldRef<"Squad", 'String'>;
    readonly leadId: Prisma.FieldRef<"Squad", 'String'>;
    readonly status: Prisma.FieldRef<"Squad", 'SquadStatus'>;
    readonly createdAt: Prisma.FieldRef<"Squad", 'DateTime'>;
}
/**
 * Squad findUnique
 */
export type SquadFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Squad to fetch.
     */
    where: Prisma.SquadWhereUniqueInput;
};
/**
 * Squad findUniqueOrThrow
 */
export type SquadFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Squad to fetch.
     */
    where: Prisma.SquadWhereUniqueInput;
};
/**
 * Squad findFirst
 */
export type SquadFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Squad to fetch.
     */
    where?: Prisma.SquadWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Squads to fetch.
     */
    orderBy?: Prisma.SquadOrderByWithRelationInput | Prisma.SquadOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Squads.
     */
    cursor?: Prisma.SquadWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Squads from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Squads.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Squads.
     */
    distinct?: Prisma.SquadScalarFieldEnum | Prisma.SquadScalarFieldEnum[];
};
/**
 * Squad findFirstOrThrow
 */
export type SquadFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Squad to fetch.
     */
    where?: Prisma.SquadWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Squads to fetch.
     */
    orderBy?: Prisma.SquadOrderByWithRelationInput | Prisma.SquadOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Squads.
     */
    cursor?: Prisma.SquadWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Squads from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Squads.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Squads.
     */
    distinct?: Prisma.SquadScalarFieldEnum | Prisma.SquadScalarFieldEnum[];
};
/**
 * Squad findMany
 */
export type SquadFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Squads to fetch.
     */
    where?: Prisma.SquadWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Squads to fetch.
     */
    orderBy?: Prisma.SquadOrderByWithRelationInput | Prisma.SquadOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Squads.
     */
    cursor?: Prisma.SquadWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Squads from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Squads.
     */
    skip?: number;
    distinct?: Prisma.SquadScalarFieldEnum | Prisma.SquadScalarFieldEnum[];
};
/**
 * Squad create
 */
export type SquadCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a Squad.
     */
    data: Prisma.XOR<Prisma.SquadCreateInput, Prisma.SquadUncheckedCreateInput>;
};
/**
 * Squad createMany
 */
export type SquadCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Squads.
     */
    data: Prisma.SquadCreateManyInput | Prisma.SquadCreateManyInput[];
};
/**
 * Squad update
 */
export type SquadUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a Squad.
     */
    data: Prisma.XOR<Prisma.SquadUpdateInput, Prisma.SquadUncheckedUpdateInput>;
    /**
     * Choose, which Squad to update.
     */
    where: Prisma.SquadWhereUniqueInput;
};
/**
 * Squad updateMany
 */
export type SquadUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Squads.
     */
    data: Prisma.XOR<Prisma.SquadUpdateManyMutationInput, Prisma.SquadUncheckedUpdateManyInput>;
    /**
     * Filter which Squads to update
     */
    where?: Prisma.SquadWhereInput;
    /**
     * Limit how many Squads to update.
     */
    limit?: number;
};
/**
 * Squad upsert
 */
export type SquadUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the Squad to update in case it exists.
     */
    where: Prisma.SquadWhereUniqueInput;
    /**
     * In case the Squad found by the `where` argument doesn't exist, create a new Squad with this data.
     */
    create: Prisma.XOR<Prisma.SquadCreateInput, Prisma.SquadUncheckedCreateInput>;
    /**
     * In case the Squad was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SquadUpdateInput, Prisma.SquadUncheckedUpdateInput>;
};
/**
 * Squad delete
 */
export type SquadDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which Squad to delete.
     */
    where: Prisma.SquadWhereUniqueInput;
};
/**
 * Squad deleteMany
 */
export type SquadDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Squads to delete
     */
    where?: Prisma.SquadWhereInput;
    /**
     * Limit how many Squads to delete.
     */
    limit?: number;
};
/**
 * Squad findRaw
 */
export type SquadFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Squad aggregateRaw
 */
export type SquadAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Squad.members
 */
export type Squad$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Squad.teams
 */
export type Squad$teamsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    orderBy?: Prisma.TeamOrderByWithRelationInput | Prisma.TeamOrderByWithRelationInput[];
    cursor?: Prisma.TeamWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeamScalarFieldEnum | Prisma.TeamScalarFieldEnum[];
};
/**
 * Squad.hackathons
 */
export type Squad$hackathonsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hackathon
     */
    select?: Prisma.HackathonSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Hackathon
     */
    omit?: Prisma.HackathonOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.HackathonInclude<ExtArgs> | null;
    where?: Prisma.HackathonWhereInput;
    orderBy?: Prisma.HackathonOrderByWithRelationInput | Prisma.HackathonOrderByWithRelationInput[];
    cursor?: Prisma.HackathonWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HackathonScalarFieldEnum | Prisma.HackathonScalarFieldEnum[];
};
/**
 * Squad.leaderboards
 */
export type Squad$leaderboardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Squad without action
 */
export type SquadDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=Squad.d.ts.map