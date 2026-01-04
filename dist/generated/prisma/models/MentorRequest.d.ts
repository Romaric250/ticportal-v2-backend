import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MentorRequest
 * Mentorship
 */
export type MentorRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$MentorRequestPayload>;
export type AggregateMentorRequest = {
    _count: MentorRequestCountAggregateOutputType | null;
    _avg: MentorRequestAvgAggregateOutputType | null;
    _sum: MentorRequestSumAggregateOutputType | null;
    _min: MentorRequestMinAggregateOutputType | null;
    _max: MentorRequestMaxAggregateOutputType | null;
};
export type MentorRequestAvgAggregateOutputType = {
    priority: number | null;
};
export type MentorRequestSumAggregateOutputType = {
    priority: number | null;
};
export type MentorRequestMinAggregateOutputType = {
    id: string | null;
    teamId: string | null;
    mentorId: string | null;
    status: $Enums.MentorRequestStatus | null;
    priority: number | null;
    message: string | null;
    createdAt: Date | null;
};
export type MentorRequestMaxAggregateOutputType = {
    id: string | null;
    teamId: string | null;
    mentorId: string | null;
    status: $Enums.MentorRequestStatus | null;
    priority: number | null;
    message: string | null;
    createdAt: Date | null;
};
export type MentorRequestCountAggregateOutputType = {
    id: number;
    teamId: number;
    mentorId: number;
    status: number;
    priority: number;
    message: number;
    createdAt: number;
    _all: number;
};
export type MentorRequestAvgAggregateInputType = {
    priority?: true;
};
export type MentorRequestSumAggregateInputType = {
    priority?: true;
};
export type MentorRequestMinAggregateInputType = {
    id?: true;
    teamId?: true;
    mentorId?: true;
    status?: true;
    priority?: true;
    message?: true;
    createdAt?: true;
};
export type MentorRequestMaxAggregateInputType = {
    id?: true;
    teamId?: true;
    mentorId?: true;
    status?: true;
    priority?: true;
    message?: true;
    createdAt?: true;
};
export type MentorRequestCountAggregateInputType = {
    id?: true;
    teamId?: true;
    mentorId?: true;
    status?: true;
    priority?: true;
    message?: true;
    createdAt?: true;
    _all?: true;
};
export type MentorRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MentorRequest to aggregate.
     */
    where?: Prisma.MentorRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorRequests to fetch.
     */
    orderBy?: Prisma.MentorRequestOrderByWithRelationInput | Prisma.MentorRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MentorRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MentorRequests
    **/
    _count?: true | MentorRequestCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MentorRequestAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MentorRequestSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MentorRequestMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MentorRequestMaxAggregateInputType;
};
export type GetMentorRequestAggregateType<T extends MentorRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateMentorRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMentorRequest[P]> : Prisma.GetScalarType<T[P], AggregateMentorRequest[P]>;
};
export type MentorRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentorRequestWhereInput;
    orderBy?: Prisma.MentorRequestOrderByWithAggregationInput | Prisma.MentorRequestOrderByWithAggregationInput[];
    by: Prisma.MentorRequestScalarFieldEnum[] | Prisma.MentorRequestScalarFieldEnum;
    having?: Prisma.MentorRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MentorRequestCountAggregateInputType | true;
    _avg?: MentorRequestAvgAggregateInputType;
    _sum?: MentorRequestSumAggregateInputType;
    _min?: MentorRequestMinAggregateInputType;
    _max?: MentorRequestMaxAggregateInputType;
};
export type MentorRequestGroupByOutputType = {
    id: string;
    teamId: string;
    mentorId: string | null;
    status: $Enums.MentorRequestStatus;
    priority: number;
    message: string | null;
    createdAt: Date;
    _count: MentorRequestCountAggregateOutputType | null;
    _avg: MentorRequestAvgAggregateOutputType | null;
    _sum: MentorRequestSumAggregateOutputType | null;
    _min: MentorRequestMinAggregateOutputType | null;
    _max: MentorRequestMaxAggregateOutputType | null;
};
type GetMentorRequestGroupByPayload<T extends MentorRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MentorRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MentorRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MentorRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MentorRequestGroupByOutputType[P]>;
}>>;
export type MentorRequestWhereInput = {
    AND?: Prisma.MentorRequestWhereInput | Prisma.MentorRequestWhereInput[];
    OR?: Prisma.MentorRequestWhereInput[];
    NOT?: Prisma.MentorRequestWhereInput | Prisma.MentorRequestWhereInput[];
    id?: Prisma.StringFilter<"MentorRequest"> | string;
    teamId?: Prisma.StringFilter<"MentorRequest"> | string;
    mentorId?: Prisma.StringNullableFilter<"MentorRequest"> | string | null;
    status?: Prisma.EnumMentorRequestStatusFilter<"MentorRequest"> | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFilter<"MentorRequest"> | number;
    message?: Prisma.StringNullableFilter<"MentorRequest"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MentorRequest"> | Date | string;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    mentor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type MentorRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    mentorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    team?: Prisma.TeamOrderByWithRelationInput;
    mentor?: Prisma.UserOrderByWithRelationInput;
};
export type MentorRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MentorRequestWhereInput | Prisma.MentorRequestWhereInput[];
    OR?: Prisma.MentorRequestWhereInput[];
    NOT?: Prisma.MentorRequestWhereInput | Prisma.MentorRequestWhereInput[];
    teamId?: Prisma.StringFilter<"MentorRequest"> | string;
    mentorId?: Prisma.StringNullableFilter<"MentorRequest"> | string | null;
    status?: Prisma.EnumMentorRequestStatusFilter<"MentorRequest"> | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFilter<"MentorRequest"> | number;
    message?: Prisma.StringNullableFilter<"MentorRequest"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MentorRequest"> | Date | string;
    team?: Prisma.XOR<Prisma.TeamScalarRelationFilter, Prisma.TeamWhereInput>;
    mentor?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type MentorRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    mentorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.MentorRequestCountOrderByAggregateInput;
    _avg?: Prisma.MentorRequestAvgOrderByAggregateInput;
    _max?: Prisma.MentorRequestMaxOrderByAggregateInput;
    _min?: Prisma.MentorRequestMinOrderByAggregateInput;
    _sum?: Prisma.MentorRequestSumOrderByAggregateInput;
};
export type MentorRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.MentorRequestScalarWhereWithAggregatesInput | Prisma.MentorRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.MentorRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MentorRequestScalarWhereWithAggregatesInput | Prisma.MentorRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MentorRequest"> | string;
    teamId?: Prisma.StringWithAggregatesFilter<"MentorRequest"> | string;
    mentorId?: Prisma.StringNullableWithAggregatesFilter<"MentorRequest"> | string | null;
    status?: Prisma.EnumMentorRequestStatusWithAggregatesFilter<"MentorRequest"> | $Enums.MentorRequestStatus;
    priority?: Prisma.IntWithAggregatesFilter<"MentorRequest"> | number;
    message?: Prisma.StringNullableWithAggregatesFilter<"MentorRequest"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MentorRequest"> | Date | string;
};
export type MentorRequestCreateInput = {
    id?: string;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
    team: Prisma.TeamCreateNestedOneWithoutMentorRequestsInput;
    mentor?: Prisma.UserCreateNestedOneWithoutMentorRequestsInput;
};
export type MentorRequestUncheckedCreateInput = {
    id?: string;
    teamId: string;
    mentorId?: string | null;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
};
export type MentorRequestUpdateInput = {
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    team?: Prisma.TeamUpdateOneRequiredWithoutMentorRequestsNestedInput;
    mentor?: Prisma.UserUpdateOneWithoutMentorRequestsNestedInput;
};
export type MentorRequestUncheckedUpdateInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    mentorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentorRequestCreateManyInput = {
    id?: string;
    teamId: string;
    mentorId?: string | null;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
};
export type MentorRequestUpdateManyMutationInput = {
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentorRequestUncheckedUpdateManyInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    mentorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentorRequestListRelationFilter = {
    every?: Prisma.MentorRequestWhereInput;
    some?: Prisma.MentorRequestWhereInput;
    none?: Prisma.MentorRequestWhereInput;
};
export type MentorRequestOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MentorRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    mentorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MentorRequestAvgOrderByAggregateInput = {
    priority?: Prisma.SortOrder;
};
export type MentorRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    mentorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MentorRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    mentorId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    message?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MentorRequestSumOrderByAggregateInput = {
    priority?: Prisma.SortOrder;
};
export type MentorRequestCreateNestedManyWithoutMentorInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutMentorInput, Prisma.MentorRequestUncheckedCreateWithoutMentorInput> | Prisma.MentorRequestCreateWithoutMentorInput[] | Prisma.MentorRequestUncheckedCreateWithoutMentorInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutMentorInput | Prisma.MentorRequestCreateOrConnectWithoutMentorInput[];
    createMany?: Prisma.MentorRequestCreateManyMentorInputEnvelope;
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
};
export type MentorRequestUncheckedCreateNestedManyWithoutMentorInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutMentorInput, Prisma.MentorRequestUncheckedCreateWithoutMentorInput> | Prisma.MentorRequestCreateWithoutMentorInput[] | Prisma.MentorRequestUncheckedCreateWithoutMentorInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutMentorInput | Prisma.MentorRequestCreateOrConnectWithoutMentorInput[];
    createMany?: Prisma.MentorRequestCreateManyMentorInputEnvelope;
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
};
export type MentorRequestUpdateManyWithoutMentorNestedInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutMentorInput, Prisma.MentorRequestUncheckedCreateWithoutMentorInput> | Prisma.MentorRequestCreateWithoutMentorInput[] | Prisma.MentorRequestUncheckedCreateWithoutMentorInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutMentorInput | Prisma.MentorRequestCreateOrConnectWithoutMentorInput[];
    upsert?: Prisma.MentorRequestUpsertWithWhereUniqueWithoutMentorInput | Prisma.MentorRequestUpsertWithWhereUniqueWithoutMentorInput[];
    createMany?: Prisma.MentorRequestCreateManyMentorInputEnvelope;
    set?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    disconnect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    delete?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    update?: Prisma.MentorRequestUpdateWithWhereUniqueWithoutMentorInput | Prisma.MentorRequestUpdateWithWhereUniqueWithoutMentorInput[];
    updateMany?: Prisma.MentorRequestUpdateManyWithWhereWithoutMentorInput | Prisma.MentorRequestUpdateManyWithWhereWithoutMentorInput[];
    deleteMany?: Prisma.MentorRequestScalarWhereInput | Prisma.MentorRequestScalarWhereInput[];
};
export type MentorRequestUncheckedUpdateManyWithoutMentorNestedInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutMentorInput, Prisma.MentorRequestUncheckedCreateWithoutMentorInput> | Prisma.MentorRequestCreateWithoutMentorInput[] | Prisma.MentorRequestUncheckedCreateWithoutMentorInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutMentorInput | Prisma.MentorRequestCreateOrConnectWithoutMentorInput[];
    upsert?: Prisma.MentorRequestUpsertWithWhereUniqueWithoutMentorInput | Prisma.MentorRequestUpsertWithWhereUniqueWithoutMentorInput[];
    createMany?: Prisma.MentorRequestCreateManyMentorInputEnvelope;
    set?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    disconnect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    delete?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    update?: Prisma.MentorRequestUpdateWithWhereUniqueWithoutMentorInput | Prisma.MentorRequestUpdateWithWhereUniqueWithoutMentorInput[];
    updateMany?: Prisma.MentorRequestUpdateManyWithWhereWithoutMentorInput | Prisma.MentorRequestUpdateManyWithWhereWithoutMentorInput[];
    deleteMany?: Prisma.MentorRequestScalarWhereInput | Prisma.MentorRequestScalarWhereInput[];
};
export type MentorRequestCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutTeamInput, Prisma.MentorRequestUncheckedCreateWithoutTeamInput> | Prisma.MentorRequestCreateWithoutTeamInput[] | Prisma.MentorRequestUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutTeamInput | Prisma.MentorRequestCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MentorRequestCreateManyTeamInputEnvelope;
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
};
export type MentorRequestUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutTeamInput, Prisma.MentorRequestUncheckedCreateWithoutTeamInput> | Prisma.MentorRequestCreateWithoutTeamInput[] | Prisma.MentorRequestUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutTeamInput | Prisma.MentorRequestCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MentorRequestCreateManyTeamInputEnvelope;
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
};
export type MentorRequestUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutTeamInput, Prisma.MentorRequestUncheckedCreateWithoutTeamInput> | Prisma.MentorRequestCreateWithoutTeamInput[] | Prisma.MentorRequestUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutTeamInput | Prisma.MentorRequestCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MentorRequestUpsertWithWhereUniqueWithoutTeamInput | Prisma.MentorRequestUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MentorRequestCreateManyTeamInputEnvelope;
    set?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    disconnect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    delete?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    update?: Prisma.MentorRequestUpdateWithWhereUniqueWithoutTeamInput | Prisma.MentorRequestUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MentorRequestUpdateManyWithWhereWithoutTeamInput | Prisma.MentorRequestUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MentorRequestScalarWhereInput | Prisma.MentorRequestScalarWhereInput[];
};
export type MentorRequestUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MentorRequestCreateWithoutTeamInput, Prisma.MentorRequestUncheckedCreateWithoutTeamInput> | Prisma.MentorRequestCreateWithoutTeamInput[] | Prisma.MentorRequestUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorRequestCreateOrConnectWithoutTeamInput | Prisma.MentorRequestCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MentorRequestUpsertWithWhereUniqueWithoutTeamInput | Prisma.MentorRequestUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MentorRequestCreateManyTeamInputEnvelope;
    set?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    disconnect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    delete?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    connect?: Prisma.MentorRequestWhereUniqueInput | Prisma.MentorRequestWhereUniqueInput[];
    update?: Prisma.MentorRequestUpdateWithWhereUniqueWithoutTeamInput | Prisma.MentorRequestUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MentorRequestUpdateManyWithWhereWithoutTeamInput | Prisma.MentorRequestUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MentorRequestScalarWhereInput | Prisma.MentorRequestScalarWhereInput[];
};
export type EnumMentorRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.MentorRequestStatus;
};
export type MentorRequestCreateWithoutMentorInput = {
    id?: string;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
    team: Prisma.TeamCreateNestedOneWithoutMentorRequestsInput;
};
export type MentorRequestUncheckedCreateWithoutMentorInput = {
    id?: string;
    teamId: string;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
};
export type MentorRequestCreateOrConnectWithoutMentorInput = {
    where: Prisma.MentorRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.MentorRequestCreateWithoutMentorInput, Prisma.MentorRequestUncheckedCreateWithoutMentorInput>;
};
export type MentorRequestCreateManyMentorInputEnvelope = {
    data: Prisma.MentorRequestCreateManyMentorInput | Prisma.MentorRequestCreateManyMentorInput[];
};
export type MentorRequestUpsertWithWhereUniqueWithoutMentorInput = {
    where: Prisma.MentorRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.MentorRequestUpdateWithoutMentorInput, Prisma.MentorRequestUncheckedUpdateWithoutMentorInput>;
    create: Prisma.XOR<Prisma.MentorRequestCreateWithoutMentorInput, Prisma.MentorRequestUncheckedCreateWithoutMentorInput>;
};
export type MentorRequestUpdateWithWhereUniqueWithoutMentorInput = {
    where: Prisma.MentorRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.MentorRequestUpdateWithoutMentorInput, Prisma.MentorRequestUncheckedUpdateWithoutMentorInput>;
};
export type MentorRequestUpdateManyWithWhereWithoutMentorInput = {
    where: Prisma.MentorRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.MentorRequestUpdateManyMutationInput, Prisma.MentorRequestUncheckedUpdateManyWithoutMentorInput>;
};
export type MentorRequestScalarWhereInput = {
    AND?: Prisma.MentorRequestScalarWhereInput | Prisma.MentorRequestScalarWhereInput[];
    OR?: Prisma.MentorRequestScalarWhereInput[];
    NOT?: Prisma.MentorRequestScalarWhereInput | Prisma.MentorRequestScalarWhereInput[];
    id?: Prisma.StringFilter<"MentorRequest"> | string;
    teamId?: Prisma.StringFilter<"MentorRequest"> | string;
    mentorId?: Prisma.StringNullableFilter<"MentorRequest"> | string | null;
    status?: Prisma.EnumMentorRequestStatusFilter<"MentorRequest"> | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFilter<"MentorRequest"> | number;
    message?: Prisma.StringNullableFilter<"MentorRequest"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MentorRequest"> | Date | string;
};
export type MentorRequestCreateWithoutTeamInput = {
    id?: string;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
    mentor?: Prisma.UserCreateNestedOneWithoutMentorRequestsInput;
};
export type MentorRequestUncheckedCreateWithoutTeamInput = {
    id?: string;
    mentorId?: string | null;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
};
export type MentorRequestCreateOrConnectWithoutTeamInput = {
    where: Prisma.MentorRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.MentorRequestCreateWithoutTeamInput, Prisma.MentorRequestUncheckedCreateWithoutTeamInput>;
};
export type MentorRequestCreateManyTeamInputEnvelope = {
    data: Prisma.MentorRequestCreateManyTeamInput | Prisma.MentorRequestCreateManyTeamInput[];
};
export type MentorRequestUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MentorRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.MentorRequestUpdateWithoutTeamInput, Prisma.MentorRequestUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.MentorRequestCreateWithoutTeamInput, Prisma.MentorRequestUncheckedCreateWithoutTeamInput>;
};
export type MentorRequestUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MentorRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.MentorRequestUpdateWithoutTeamInput, Prisma.MentorRequestUncheckedUpdateWithoutTeamInput>;
};
export type MentorRequestUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.MentorRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.MentorRequestUpdateManyMutationInput, Prisma.MentorRequestUncheckedUpdateManyWithoutTeamInput>;
};
export type MentorRequestCreateManyMentorInput = {
    id?: string;
    teamId: string;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
};
export type MentorRequestUpdateWithoutMentorInput = {
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    team?: Prisma.TeamUpdateOneRequiredWithoutMentorRequestsNestedInput;
};
export type MentorRequestUncheckedUpdateWithoutMentorInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentorRequestUncheckedUpdateManyWithoutMentorInput = {
    teamId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentorRequestCreateManyTeamInput = {
    id?: string;
    mentorId?: string | null;
    status?: $Enums.MentorRequestStatus;
    priority?: number;
    message?: string | null;
    createdAt?: Date | string;
};
export type MentorRequestUpdateWithoutTeamInput = {
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mentor?: Prisma.UserUpdateOneWithoutMentorRequestsNestedInput;
};
export type MentorRequestUncheckedUpdateWithoutTeamInput = {
    mentorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentorRequestUncheckedUpdateManyWithoutTeamInput = {
    mentorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumMentorRequestStatusFieldUpdateOperationsInput | $Enums.MentorRequestStatus;
    priority?: Prisma.IntFieldUpdateOperationsInput | number;
    message?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MentorRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    teamId?: boolean;
    mentorId?: boolean;
    status?: boolean;
    priority?: boolean;
    message?: boolean;
    createdAt?: boolean;
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    mentor?: boolean | Prisma.MentorRequest$mentorArgs<ExtArgs>;
}, ExtArgs["result"]["mentorRequest"]>;
export type MentorRequestSelectScalar = {
    id?: boolean;
    teamId?: boolean;
    mentorId?: boolean;
    status?: boolean;
    priority?: boolean;
    message?: boolean;
    createdAt?: boolean;
};
export type MentorRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "teamId" | "mentorId" | "status" | "priority" | "message" | "createdAt", ExtArgs["result"]["mentorRequest"]>;
export type MentorRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    team?: boolean | Prisma.TeamDefaultArgs<ExtArgs>;
    mentor?: boolean | Prisma.MentorRequest$mentorArgs<ExtArgs>;
};
export type $MentorRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MentorRequest";
    objects: {
        team: Prisma.$TeamPayload<ExtArgs>;
        mentor: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        teamId: string;
        mentorId: string | null;
        status: $Enums.MentorRequestStatus;
        priority: number;
        message: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["mentorRequest"]>;
    composites: {};
};
export type MentorRequestGetPayload<S extends boolean | null | undefined | MentorRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload, S>;
export type MentorRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MentorRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MentorRequestCountAggregateInputType | true;
};
export interface MentorRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MentorRequest'];
        meta: {
            name: 'MentorRequest';
        };
    };
    /**
     * Find zero or one MentorRequest that matches the filter.
     * @param {MentorRequestFindUniqueArgs} args - Arguments to find a MentorRequest
     * @example
     * // Get one MentorRequest
     * const mentorRequest = await prisma.mentorRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MentorRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, MentorRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MentorRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MentorRequestFindUniqueOrThrowArgs} args - Arguments to find a MentorRequest
     * @example
     * // Get one MentorRequest
     * const mentorRequest = await prisma.mentorRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MentorRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MentorRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MentorRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorRequestFindFirstArgs} args - Arguments to find a MentorRequest
     * @example
     * // Get one MentorRequest
     * const mentorRequest = await prisma.mentorRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MentorRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, MentorRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MentorRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorRequestFindFirstOrThrowArgs} args - Arguments to find a MentorRequest
     * @example
     * // Get one MentorRequest
     * const mentorRequest = await prisma.mentorRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MentorRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MentorRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MentorRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MentorRequests
     * const mentorRequests = await prisma.mentorRequest.findMany()
     *
     * // Get first 10 MentorRequests
     * const mentorRequests = await prisma.mentorRequest.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const mentorRequestWithIdOnly = await prisma.mentorRequest.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MentorRequestFindManyArgs>(args?: Prisma.SelectSubset<T, MentorRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MentorRequest.
     * @param {MentorRequestCreateArgs} args - Arguments to create a MentorRequest.
     * @example
     * // Create one MentorRequest
     * const MentorRequest = await prisma.mentorRequest.create({
     *   data: {
     *     // ... data to create a MentorRequest
     *   }
     * })
     *
     */
    create<T extends MentorRequestCreateArgs>(args: Prisma.SelectSubset<T, MentorRequestCreateArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MentorRequests.
     * @param {MentorRequestCreateManyArgs} args - Arguments to create many MentorRequests.
     * @example
     * // Create many MentorRequests
     * const mentorRequest = await prisma.mentorRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MentorRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, MentorRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MentorRequest.
     * @param {MentorRequestDeleteArgs} args - Arguments to delete one MentorRequest.
     * @example
     * // Delete one MentorRequest
     * const MentorRequest = await prisma.mentorRequest.delete({
     *   where: {
     *     // ... filter to delete one MentorRequest
     *   }
     * })
     *
     */
    delete<T extends MentorRequestDeleteArgs>(args: Prisma.SelectSubset<T, MentorRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MentorRequest.
     * @param {MentorRequestUpdateArgs} args - Arguments to update one MentorRequest.
     * @example
     * // Update one MentorRequest
     * const mentorRequest = await prisma.mentorRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MentorRequestUpdateArgs>(args: Prisma.SelectSubset<T, MentorRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MentorRequests.
     * @param {MentorRequestDeleteManyArgs} args - Arguments to filter MentorRequests to delete.
     * @example
     * // Delete a few MentorRequests
     * const { count } = await prisma.mentorRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MentorRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, MentorRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MentorRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MentorRequests
     * const mentorRequest = await prisma.mentorRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MentorRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, MentorRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MentorRequest.
     * @param {MentorRequestUpsertArgs} args - Arguments to update or create a MentorRequest.
     * @example
     * // Update or create a MentorRequest
     * const mentorRequest = await prisma.mentorRequest.upsert({
     *   create: {
     *     // ... data to create a MentorRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MentorRequest we want to update
     *   }
     * })
     */
    upsert<T extends MentorRequestUpsertArgs>(args: Prisma.SelectSubset<T, MentorRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__MentorRequestClient<runtime.Types.Result.GetResult<Prisma.$MentorRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MentorRequests that matches the filter.
     * @param {MentorRequestFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const mentorRequest = await prisma.mentorRequest.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.MentorRequestFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a MentorRequest.
     * @param {MentorRequestAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const mentorRequest = await prisma.mentorRequest.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.MentorRequestAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of MentorRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorRequestCountArgs} args - Arguments to filter MentorRequests to count.
     * @example
     * // Count the number of MentorRequests
     * const count = await prisma.mentorRequest.count({
     *   where: {
     *     // ... the filter for the MentorRequests we want to count
     *   }
     * })
    **/
    count<T extends MentorRequestCountArgs>(args?: Prisma.Subset<T, MentorRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MentorRequestCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MentorRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MentorRequestAggregateArgs>(args: Prisma.Subset<T, MentorRequestAggregateArgs>): Prisma.PrismaPromise<GetMentorRequestAggregateType<T>>;
    /**
     * Group by MentorRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorRequestGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MentorRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MentorRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: MentorRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MentorRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMentorRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MentorRequest model
     */
    readonly fields: MentorRequestFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MentorRequest.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MentorRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    team<T extends Prisma.TeamDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TeamDefaultArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    mentor<T extends Prisma.MentorRequest$mentorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MentorRequest$mentorArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MentorRequest model
 */
export interface MentorRequestFieldRefs {
    readonly id: Prisma.FieldRef<"MentorRequest", 'String'>;
    readonly teamId: Prisma.FieldRef<"MentorRequest", 'String'>;
    readonly mentorId: Prisma.FieldRef<"MentorRequest", 'String'>;
    readonly status: Prisma.FieldRef<"MentorRequest", 'MentorRequestStatus'>;
    readonly priority: Prisma.FieldRef<"MentorRequest", 'Int'>;
    readonly message: Prisma.FieldRef<"MentorRequest", 'String'>;
    readonly createdAt: Prisma.FieldRef<"MentorRequest", 'DateTime'>;
}
/**
 * MentorRequest findUnique
 */
export type MentorRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorRequest to fetch.
     */
    where: Prisma.MentorRequestWhereUniqueInput;
};
/**
 * MentorRequest findUniqueOrThrow
 */
export type MentorRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorRequest to fetch.
     */
    where: Prisma.MentorRequestWhereUniqueInput;
};
/**
 * MentorRequest findFirst
 */
export type MentorRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorRequest to fetch.
     */
    where?: Prisma.MentorRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorRequests to fetch.
     */
    orderBy?: Prisma.MentorRequestOrderByWithRelationInput | Prisma.MentorRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MentorRequests.
     */
    cursor?: Prisma.MentorRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MentorRequests.
     */
    distinct?: Prisma.MentorRequestScalarFieldEnum | Prisma.MentorRequestScalarFieldEnum[];
};
/**
 * MentorRequest findFirstOrThrow
 */
export type MentorRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorRequest to fetch.
     */
    where?: Prisma.MentorRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorRequests to fetch.
     */
    orderBy?: Prisma.MentorRequestOrderByWithRelationInput | Prisma.MentorRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MentorRequests.
     */
    cursor?: Prisma.MentorRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MentorRequests.
     */
    distinct?: Prisma.MentorRequestScalarFieldEnum | Prisma.MentorRequestScalarFieldEnum[];
};
/**
 * MentorRequest findMany
 */
export type MentorRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorRequests to fetch.
     */
    where?: Prisma.MentorRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorRequests to fetch.
     */
    orderBy?: Prisma.MentorRequestOrderByWithRelationInput | Prisma.MentorRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MentorRequests.
     */
    cursor?: Prisma.MentorRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorRequests.
     */
    skip?: number;
    distinct?: Prisma.MentorRequestScalarFieldEnum | Prisma.MentorRequestScalarFieldEnum[];
};
/**
 * MentorRequest create
 */
export type MentorRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MentorRequest.
     */
    data: Prisma.XOR<Prisma.MentorRequestCreateInput, Prisma.MentorRequestUncheckedCreateInput>;
};
/**
 * MentorRequest createMany
 */
export type MentorRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MentorRequests.
     */
    data: Prisma.MentorRequestCreateManyInput | Prisma.MentorRequestCreateManyInput[];
};
/**
 * MentorRequest update
 */
export type MentorRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MentorRequest.
     */
    data: Prisma.XOR<Prisma.MentorRequestUpdateInput, Prisma.MentorRequestUncheckedUpdateInput>;
    /**
     * Choose, which MentorRequest to update.
     */
    where: Prisma.MentorRequestWhereUniqueInput;
};
/**
 * MentorRequest updateMany
 */
export type MentorRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MentorRequests.
     */
    data: Prisma.XOR<Prisma.MentorRequestUpdateManyMutationInput, Prisma.MentorRequestUncheckedUpdateManyInput>;
    /**
     * Filter which MentorRequests to update
     */
    where?: Prisma.MentorRequestWhereInput;
    /**
     * Limit how many MentorRequests to update.
     */
    limit?: number;
};
/**
 * MentorRequest upsert
 */
export type MentorRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MentorRequest to update in case it exists.
     */
    where: Prisma.MentorRequestWhereUniqueInput;
    /**
     * In case the MentorRequest found by the `where` argument doesn't exist, create a new MentorRequest with this data.
     */
    create: Prisma.XOR<Prisma.MentorRequestCreateInput, Prisma.MentorRequestUncheckedCreateInput>;
    /**
     * In case the MentorRequest was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MentorRequestUpdateInput, Prisma.MentorRequestUncheckedUpdateInput>;
};
/**
 * MentorRequest delete
 */
export type MentorRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MentorRequest to delete.
     */
    where: Prisma.MentorRequestWhereUniqueInput;
};
/**
 * MentorRequest deleteMany
 */
export type MentorRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MentorRequests to delete
     */
    where?: Prisma.MentorRequestWhereInput;
    /**
     * Limit how many MentorRequests to delete.
     */
    limit?: number;
};
/**
 * MentorRequest findRaw
 */
export type MentorRequestFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * MentorRequest aggregateRaw
 */
export type MentorRequestAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * MentorRequest.mentor
 */
export type MentorRequest$mentorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * MentorRequest without action
 */
export type MentorRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=MentorRequest.d.ts.map