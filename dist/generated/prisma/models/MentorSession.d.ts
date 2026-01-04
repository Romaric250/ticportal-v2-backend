import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model MentorSession
 *
 */
export type MentorSessionModel = runtime.Types.Result.DefaultSelection<Prisma.$MentorSessionPayload>;
export type AggregateMentorSession = {
    _count: MentorSessionCountAggregateOutputType | null;
    _avg: MentorSessionAvgAggregateOutputType | null;
    _sum: MentorSessionSumAggregateOutputType | null;
    _min: MentorSessionMinAggregateOutputType | null;
    _max: MentorSessionMaxAggregateOutputType | null;
};
export type MentorSessionAvgAggregateOutputType = {
    duration: number | null;
};
export type MentorSessionSumAggregateOutputType = {
    duration: number | null;
};
export type MentorSessionMinAggregateOutputType = {
    id: string | null;
    assignmentId: string | null;
    date: Date | null;
    duration: number | null;
    notes: string | null;
    teamId: string | null;
};
export type MentorSessionMaxAggregateOutputType = {
    id: string | null;
    assignmentId: string | null;
    date: Date | null;
    duration: number | null;
    notes: string | null;
    teamId: string | null;
};
export type MentorSessionCountAggregateOutputType = {
    id: number;
    assignmentId: number;
    date: number;
    duration: number;
    notes: number;
    teamId: number;
    _all: number;
};
export type MentorSessionAvgAggregateInputType = {
    duration?: true;
};
export type MentorSessionSumAggregateInputType = {
    duration?: true;
};
export type MentorSessionMinAggregateInputType = {
    id?: true;
    assignmentId?: true;
    date?: true;
    duration?: true;
    notes?: true;
    teamId?: true;
};
export type MentorSessionMaxAggregateInputType = {
    id?: true;
    assignmentId?: true;
    date?: true;
    duration?: true;
    notes?: true;
    teamId?: true;
};
export type MentorSessionCountAggregateInputType = {
    id?: true;
    assignmentId?: true;
    date?: true;
    duration?: true;
    notes?: true;
    teamId?: true;
    _all?: true;
};
export type MentorSessionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MentorSession to aggregate.
     */
    where?: Prisma.MentorSessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorSessions to fetch.
     */
    orderBy?: Prisma.MentorSessionOrderByWithRelationInput | Prisma.MentorSessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MentorSessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorSessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorSessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MentorSessions
    **/
    _count?: true | MentorSessionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MentorSessionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MentorSessionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MentorSessionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MentorSessionMaxAggregateInputType;
};
export type GetMentorSessionAggregateType<T extends MentorSessionAggregateArgs> = {
    [P in keyof T & keyof AggregateMentorSession]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMentorSession[P]> : Prisma.GetScalarType<T[P], AggregateMentorSession[P]>;
};
export type MentorSessionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MentorSessionWhereInput;
    orderBy?: Prisma.MentorSessionOrderByWithAggregationInput | Prisma.MentorSessionOrderByWithAggregationInput[];
    by: Prisma.MentorSessionScalarFieldEnum[] | Prisma.MentorSessionScalarFieldEnum;
    having?: Prisma.MentorSessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MentorSessionCountAggregateInputType | true;
    _avg?: MentorSessionAvgAggregateInputType;
    _sum?: MentorSessionSumAggregateInputType;
    _min?: MentorSessionMinAggregateInputType;
    _max?: MentorSessionMaxAggregateInputType;
};
export type MentorSessionGroupByOutputType = {
    id: string;
    assignmentId: string;
    date: Date;
    duration: number;
    notes: string | null;
    teamId: string | null;
    _count: MentorSessionCountAggregateOutputType | null;
    _avg: MentorSessionAvgAggregateOutputType | null;
    _sum: MentorSessionSumAggregateOutputType | null;
    _min: MentorSessionMinAggregateOutputType | null;
    _max: MentorSessionMaxAggregateOutputType | null;
};
type GetMentorSessionGroupByPayload<T extends MentorSessionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MentorSessionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MentorSessionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MentorSessionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MentorSessionGroupByOutputType[P]>;
}>>;
export type MentorSessionWhereInput = {
    AND?: Prisma.MentorSessionWhereInput | Prisma.MentorSessionWhereInput[];
    OR?: Prisma.MentorSessionWhereInput[];
    NOT?: Prisma.MentorSessionWhereInput | Prisma.MentorSessionWhereInput[];
    id?: Prisma.StringFilter<"MentorSession"> | string;
    assignmentId?: Prisma.StringFilter<"MentorSession"> | string;
    date?: Prisma.DateTimeFilter<"MentorSession"> | Date | string;
    duration?: Prisma.IntFilter<"MentorSession"> | number;
    notes?: Prisma.StringNullableFilter<"MentorSession"> | string | null;
    teamId?: Prisma.StringNullableFilter<"MentorSession"> | string | null;
    assignment?: Prisma.XOR<Prisma.MentorAssignmentScalarRelationFilter, Prisma.MentorAssignmentWhereInput>;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
};
export type MentorSessionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    assignmentId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    assignment?: Prisma.MentorAssignmentOrderByWithRelationInput;
    team?: Prisma.TeamOrderByWithRelationInput;
};
export type MentorSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MentorSessionWhereInput | Prisma.MentorSessionWhereInput[];
    OR?: Prisma.MentorSessionWhereInput[];
    NOT?: Prisma.MentorSessionWhereInput | Prisma.MentorSessionWhereInput[];
    assignmentId?: Prisma.StringFilter<"MentorSession"> | string;
    date?: Prisma.DateTimeFilter<"MentorSession"> | Date | string;
    duration?: Prisma.IntFilter<"MentorSession"> | number;
    notes?: Prisma.StringNullableFilter<"MentorSession"> | string | null;
    teamId?: Prisma.StringNullableFilter<"MentorSession"> | string | null;
    assignment?: Prisma.XOR<Prisma.MentorAssignmentScalarRelationFilter, Prisma.MentorAssignmentWhereInput>;
    team?: Prisma.XOR<Prisma.TeamNullableScalarRelationFilter, Prisma.TeamWhereInput> | null;
}, "id">;
export type MentorSessionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    assignmentId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
    _count?: Prisma.MentorSessionCountOrderByAggregateInput;
    _avg?: Prisma.MentorSessionAvgOrderByAggregateInput;
    _max?: Prisma.MentorSessionMaxOrderByAggregateInput;
    _min?: Prisma.MentorSessionMinOrderByAggregateInput;
    _sum?: Prisma.MentorSessionSumOrderByAggregateInput;
};
export type MentorSessionScalarWhereWithAggregatesInput = {
    AND?: Prisma.MentorSessionScalarWhereWithAggregatesInput | Prisma.MentorSessionScalarWhereWithAggregatesInput[];
    OR?: Prisma.MentorSessionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MentorSessionScalarWhereWithAggregatesInput | Prisma.MentorSessionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MentorSession"> | string;
    assignmentId?: Prisma.StringWithAggregatesFilter<"MentorSession"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"MentorSession"> | Date | string;
    duration?: Prisma.IntWithAggregatesFilter<"MentorSession"> | number;
    notes?: Prisma.StringNullableWithAggregatesFilter<"MentorSession"> | string | null;
    teamId?: Prisma.StringNullableWithAggregatesFilter<"MentorSession"> | string | null;
};
export type MentorSessionCreateInput = {
    id?: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
    assignment: Prisma.MentorAssignmentCreateNestedOneWithoutSessionsInput;
    team?: Prisma.TeamCreateNestedOneWithoutMentorSessionsInput;
};
export type MentorSessionUncheckedCreateInput = {
    id?: string;
    assignmentId: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
    teamId?: string | null;
};
export type MentorSessionUpdateInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assignment?: Prisma.MentorAssignmentUpdateOneRequiredWithoutSessionsNestedInput;
    team?: Prisma.TeamUpdateOneWithoutMentorSessionsNestedInput;
};
export type MentorSessionUncheckedUpdateInput = {
    assignmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MentorSessionCreateManyInput = {
    id?: string;
    assignmentId: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
    teamId?: string | null;
};
export type MentorSessionUpdateManyMutationInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MentorSessionUncheckedUpdateManyInput = {
    assignmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MentorSessionListRelationFilter = {
    every?: Prisma.MentorSessionWhereInput;
    some?: Prisma.MentorSessionWhereInput;
    none?: Prisma.MentorSessionWhereInput;
};
export type MentorSessionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MentorSessionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assignmentId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
};
export type MentorSessionAvgOrderByAggregateInput = {
    duration?: Prisma.SortOrder;
};
export type MentorSessionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assignmentId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
};
export type MentorSessionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assignmentId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    duration?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    teamId?: Prisma.SortOrder;
};
export type MentorSessionSumOrderByAggregateInput = {
    duration?: Prisma.SortOrder;
};
export type MentorSessionCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutTeamInput, Prisma.MentorSessionUncheckedCreateWithoutTeamInput> | Prisma.MentorSessionCreateWithoutTeamInput[] | Prisma.MentorSessionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutTeamInput | Prisma.MentorSessionCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MentorSessionCreateManyTeamInputEnvelope;
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
};
export type MentorSessionUncheckedCreateNestedManyWithoutTeamInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutTeamInput, Prisma.MentorSessionUncheckedCreateWithoutTeamInput> | Prisma.MentorSessionCreateWithoutTeamInput[] | Prisma.MentorSessionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutTeamInput | Prisma.MentorSessionCreateOrConnectWithoutTeamInput[];
    createMany?: Prisma.MentorSessionCreateManyTeamInputEnvelope;
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
};
export type MentorSessionUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutTeamInput, Prisma.MentorSessionUncheckedCreateWithoutTeamInput> | Prisma.MentorSessionCreateWithoutTeamInput[] | Prisma.MentorSessionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutTeamInput | Prisma.MentorSessionCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MentorSessionUpsertWithWhereUniqueWithoutTeamInput | Prisma.MentorSessionUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MentorSessionCreateManyTeamInputEnvelope;
    set?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    disconnect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    delete?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    update?: Prisma.MentorSessionUpdateWithWhereUniqueWithoutTeamInput | Prisma.MentorSessionUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MentorSessionUpdateManyWithWhereWithoutTeamInput | Prisma.MentorSessionUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MentorSessionScalarWhereInput | Prisma.MentorSessionScalarWhereInput[];
};
export type MentorSessionUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutTeamInput, Prisma.MentorSessionUncheckedCreateWithoutTeamInput> | Prisma.MentorSessionCreateWithoutTeamInput[] | Prisma.MentorSessionUncheckedCreateWithoutTeamInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutTeamInput | Prisma.MentorSessionCreateOrConnectWithoutTeamInput[];
    upsert?: Prisma.MentorSessionUpsertWithWhereUniqueWithoutTeamInput | Prisma.MentorSessionUpsertWithWhereUniqueWithoutTeamInput[];
    createMany?: Prisma.MentorSessionCreateManyTeamInputEnvelope;
    set?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    disconnect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    delete?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    update?: Prisma.MentorSessionUpdateWithWhereUniqueWithoutTeamInput | Prisma.MentorSessionUpdateWithWhereUniqueWithoutTeamInput[];
    updateMany?: Prisma.MentorSessionUpdateManyWithWhereWithoutTeamInput | Prisma.MentorSessionUpdateManyWithWhereWithoutTeamInput[];
    deleteMany?: Prisma.MentorSessionScalarWhereInput | Prisma.MentorSessionScalarWhereInput[];
};
export type MentorSessionCreateNestedManyWithoutAssignmentInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutAssignmentInput, Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput> | Prisma.MentorSessionCreateWithoutAssignmentInput[] | Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput | Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput[];
    createMany?: Prisma.MentorSessionCreateManyAssignmentInputEnvelope;
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
};
export type MentorSessionUncheckedCreateNestedManyWithoutAssignmentInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutAssignmentInput, Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput> | Prisma.MentorSessionCreateWithoutAssignmentInput[] | Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput | Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput[];
    createMany?: Prisma.MentorSessionCreateManyAssignmentInputEnvelope;
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
};
export type MentorSessionUpdateManyWithoutAssignmentNestedInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutAssignmentInput, Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput> | Prisma.MentorSessionCreateWithoutAssignmentInput[] | Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput | Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput[];
    upsert?: Prisma.MentorSessionUpsertWithWhereUniqueWithoutAssignmentInput | Prisma.MentorSessionUpsertWithWhereUniqueWithoutAssignmentInput[];
    createMany?: Prisma.MentorSessionCreateManyAssignmentInputEnvelope;
    set?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    disconnect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    delete?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    update?: Prisma.MentorSessionUpdateWithWhereUniqueWithoutAssignmentInput | Prisma.MentorSessionUpdateWithWhereUniqueWithoutAssignmentInput[];
    updateMany?: Prisma.MentorSessionUpdateManyWithWhereWithoutAssignmentInput | Prisma.MentorSessionUpdateManyWithWhereWithoutAssignmentInput[];
    deleteMany?: Prisma.MentorSessionScalarWhereInput | Prisma.MentorSessionScalarWhereInput[];
};
export type MentorSessionUncheckedUpdateManyWithoutAssignmentNestedInput = {
    create?: Prisma.XOR<Prisma.MentorSessionCreateWithoutAssignmentInput, Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput> | Prisma.MentorSessionCreateWithoutAssignmentInput[] | Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput[];
    connectOrCreate?: Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput | Prisma.MentorSessionCreateOrConnectWithoutAssignmentInput[];
    upsert?: Prisma.MentorSessionUpsertWithWhereUniqueWithoutAssignmentInput | Prisma.MentorSessionUpsertWithWhereUniqueWithoutAssignmentInput[];
    createMany?: Prisma.MentorSessionCreateManyAssignmentInputEnvelope;
    set?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    disconnect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    delete?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    connect?: Prisma.MentorSessionWhereUniqueInput | Prisma.MentorSessionWhereUniqueInput[];
    update?: Prisma.MentorSessionUpdateWithWhereUniqueWithoutAssignmentInput | Prisma.MentorSessionUpdateWithWhereUniqueWithoutAssignmentInput[];
    updateMany?: Prisma.MentorSessionUpdateManyWithWhereWithoutAssignmentInput | Prisma.MentorSessionUpdateManyWithWhereWithoutAssignmentInput[];
    deleteMany?: Prisma.MentorSessionScalarWhereInput | Prisma.MentorSessionScalarWhereInput[];
};
export type MentorSessionCreateWithoutTeamInput = {
    id?: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
    assignment: Prisma.MentorAssignmentCreateNestedOneWithoutSessionsInput;
};
export type MentorSessionUncheckedCreateWithoutTeamInput = {
    id?: string;
    assignmentId: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
};
export type MentorSessionCreateOrConnectWithoutTeamInput = {
    where: Prisma.MentorSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.MentorSessionCreateWithoutTeamInput, Prisma.MentorSessionUncheckedCreateWithoutTeamInput>;
};
export type MentorSessionCreateManyTeamInputEnvelope = {
    data: Prisma.MentorSessionCreateManyTeamInput | Prisma.MentorSessionCreateManyTeamInput[];
};
export type MentorSessionUpsertWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MentorSessionWhereUniqueInput;
    update: Prisma.XOR<Prisma.MentorSessionUpdateWithoutTeamInput, Prisma.MentorSessionUncheckedUpdateWithoutTeamInput>;
    create: Prisma.XOR<Prisma.MentorSessionCreateWithoutTeamInput, Prisma.MentorSessionUncheckedCreateWithoutTeamInput>;
};
export type MentorSessionUpdateWithWhereUniqueWithoutTeamInput = {
    where: Prisma.MentorSessionWhereUniqueInput;
    data: Prisma.XOR<Prisma.MentorSessionUpdateWithoutTeamInput, Prisma.MentorSessionUncheckedUpdateWithoutTeamInput>;
};
export type MentorSessionUpdateManyWithWhereWithoutTeamInput = {
    where: Prisma.MentorSessionScalarWhereInput;
    data: Prisma.XOR<Prisma.MentorSessionUpdateManyMutationInput, Prisma.MentorSessionUncheckedUpdateManyWithoutTeamInput>;
};
export type MentorSessionScalarWhereInput = {
    AND?: Prisma.MentorSessionScalarWhereInput | Prisma.MentorSessionScalarWhereInput[];
    OR?: Prisma.MentorSessionScalarWhereInput[];
    NOT?: Prisma.MentorSessionScalarWhereInput | Prisma.MentorSessionScalarWhereInput[];
    id?: Prisma.StringFilter<"MentorSession"> | string;
    assignmentId?: Prisma.StringFilter<"MentorSession"> | string;
    date?: Prisma.DateTimeFilter<"MentorSession"> | Date | string;
    duration?: Prisma.IntFilter<"MentorSession"> | number;
    notes?: Prisma.StringNullableFilter<"MentorSession"> | string | null;
    teamId?: Prisma.StringNullableFilter<"MentorSession"> | string | null;
};
export type MentorSessionCreateWithoutAssignmentInput = {
    id?: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
    team?: Prisma.TeamCreateNestedOneWithoutMentorSessionsInput;
};
export type MentorSessionUncheckedCreateWithoutAssignmentInput = {
    id?: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
    teamId?: string | null;
};
export type MentorSessionCreateOrConnectWithoutAssignmentInput = {
    where: Prisma.MentorSessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.MentorSessionCreateWithoutAssignmentInput, Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput>;
};
export type MentorSessionCreateManyAssignmentInputEnvelope = {
    data: Prisma.MentorSessionCreateManyAssignmentInput | Prisma.MentorSessionCreateManyAssignmentInput[];
};
export type MentorSessionUpsertWithWhereUniqueWithoutAssignmentInput = {
    where: Prisma.MentorSessionWhereUniqueInput;
    update: Prisma.XOR<Prisma.MentorSessionUpdateWithoutAssignmentInput, Prisma.MentorSessionUncheckedUpdateWithoutAssignmentInput>;
    create: Prisma.XOR<Prisma.MentorSessionCreateWithoutAssignmentInput, Prisma.MentorSessionUncheckedCreateWithoutAssignmentInput>;
};
export type MentorSessionUpdateWithWhereUniqueWithoutAssignmentInput = {
    where: Prisma.MentorSessionWhereUniqueInput;
    data: Prisma.XOR<Prisma.MentorSessionUpdateWithoutAssignmentInput, Prisma.MentorSessionUncheckedUpdateWithoutAssignmentInput>;
};
export type MentorSessionUpdateManyWithWhereWithoutAssignmentInput = {
    where: Prisma.MentorSessionScalarWhereInput;
    data: Prisma.XOR<Prisma.MentorSessionUpdateManyMutationInput, Prisma.MentorSessionUncheckedUpdateManyWithoutAssignmentInput>;
};
export type MentorSessionCreateManyTeamInput = {
    id?: string;
    assignmentId: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
};
export type MentorSessionUpdateWithoutTeamInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    assignment?: Prisma.MentorAssignmentUpdateOneRequiredWithoutSessionsNestedInput;
};
export type MentorSessionUncheckedUpdateWithoutTeamInput = {
    assignmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MentorSessionUncheckedUpdateManyWithoutTeamInput = {
    assignmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MentorSessionCreateManyAssignmentInput = {
    id?: string;
    date: Date | string;
    duration: number;
    notes?: string | null;
    teamId?: string | null;
};
export type MentorSessionUpdateWithoutAssignmentInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.TeamUpdateOneWithoutMentorSessionsNestedInput;
};
export type MentorSessionUncheckedUpdateWithoutAssignmentInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MentorSessionUncheckedUpdateManyWithoutAssignmentInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    duration?: Prisma.IntFieldUpdateOperationsInput | number;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    teamId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type MentorSessionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    assignmentId?: boolean;
    date?: boolean;
    duration?: boolean;
    notes?: boolean;
    teamId?: boolean;
    assignment?: boolean | Prisma.MentorAssignmentDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.MentorSession$teamArgs<ExtArgs>;
}, ExtArgs["result"]["mentorSession"]>;
export type MentorSessionSelectScalar = {
    id?: boolean;
    assignmentId?: boolean;
    date?: boolean;
    duration?: boolean;
    notes?: boolean;
    teamId?: boolean;
};
export type MentorSessionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "assignmentId" | "date" | "duration" | "notes" | "teamId", ExtArgs["result"]["mentorSession"]>;
export type MentorSessionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assignment?: boolean | Prisma.MentorAssignmentDefaultArgs<ExtArgs>;
    team?: boolean | Prisma.MentorSession$teamArgs<ExtArgs>;
};
export type $MentorSessionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MentorSession";
    objects: {
        assignment: Prisma.$MentorAssignmentPayload<ExtArgs>;
        team: Prisma.$TeamPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        assignmentId: string;
        date: Date;
        duration: number;
        notes: string | null;
        teamId: string | null;
    }, ExtArgs["result"]["mentorSession"]>;
    composites: {};
};
export type MentorSessionGetPayload<S extends boolean | null | undefined | MentorSessionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload, S>;
export type MentorSessionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MentorSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MentorSessionCountAggregateInputType | true;
};
export interface MentorSessionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MentorSession'];
        meta: {
            name: 'MentorSession';
        };
    };
    /**
     * Find zero or one MentorSession that matches the filter.
     * @param {MentorSessionFindUniqueArgs} args - Arguments to find a MentorSession
     * @example
     * // Get one MentorSession
     * const mentorSession = await prisma.mentorSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MentorSessionFindUniqueArgs>(args: Prisma.SelectSubset<T, MentorSessionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MentorSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MentorSessionFindUniqueOrThrowArgs} args - Arguments to find a MentorSession
     * @example
     * // Get one MentorSession
     * const mentorSession = await prisma.mentorSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MentorSessionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MentorSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MentorSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionFindFirstArgs} args - Arguments to find a MentorSession
     * @example
     * // Get one MentorSession
     * const mentorSession = await prisma.mentorSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MentorSessionFindFirstArgs>(args?: Prisma.SelectSubset<T, MentorSessionFindFirstArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MentorSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionFindFirstOrThrowArgs} args - Arguments to find a MentorSession
     * @example
     * // Get one MentorSession
     * const mentorSession = await prisma.mentorSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MentorSessionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MentorSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MentorSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MentorSessions
     * const mentorSessions = await prisma.mentorSession.findMany()
     *
     * // Get first 10 MentorSessions
     * const mentorSessions = await prisma.mentorSession.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const mentorSessionWithIdOnly = await prisma.mentorSession.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MentorSessionFindManyArgs>(args?: Prisma.SelectSubset<T, MentorSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MentorSession.
     * @param {MentorSessionCreateArgs} args - Arguments to create a MentorSession.
     * @example
     * // Create one MentorSession
     * const MentorSession = await prisma.mentorSession.create({
     *   data: {
     *     // ... data to create a MentorSession
     *   }
     * })
     *
     */
    create<T extends MentorSessionCreateArgs>(args: Prisma.SelectSubset<T, MentorSessionCreateArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MentorSessions.
     * @param {MentorSessionCreateManyArgs} args - Arguments to create many MentorSessions.
     * @example
     * // Create many MentorSessions
     * const mentorSession = await prisma.mentorSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MentorSessionCreateManyArgs>(args?: Prisma.SelectSubset<T, MentorSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a MentorSession.
     * @param {MentorSessionDeleteArgs} args - Arguments to delete one MentorSession.
     * @example
     * // Delete one MentorSession
     * const MentorSession = await prisma.mentorSession.delete({
     *   where: {
     *     // ... filter to delete one MentorSession
     *   }
     * })
     *
     */
    delete<T extends MentorSessionDeleteArgs>(args: Prisma.SelectSubset<T, MentorSessionDeleteArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MentorSession.
     * @param {MentorSessionUpdateArgs} args - Arguments to update one MentorSession.
     * @example
     * // Update one MentorSession
     * const mentorSession = await prisma.mentorSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MentorSessionUpdateArgs>(args: Prisma.SelectSubset<T, MentorSessionUpdateArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MentorSessions.
     * @param {MentorSessionDeleteManyArgs} args - Arguments to filter MentorSessions to delete.
     * @example
     * // Delete a few MentorSessions
     * const { count } = await prisma.mentorSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MentorSessionDeleteManyArgs>(args?: Prisma.SelectSubset<T, MentorSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MentorSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MentorSessions
     * const mentorSession = await prisma.mentorSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MentorSessionUpdateManyArgs>(args: Prisma.SelectSubset<T, MentorSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one MentorSession.
     * @param {MentorSessionUpsertArgs} args - Arguments to update or create a MentorSession.
     * @example
     * // Update or create a MentorSession
     * const mentorSession = await prisma.mentorSession.upsert({
     *   create: {
     *     // ... data to create a MentorSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MentorSession we want to update
     *   }
     * })
     */
    upsert<T extends MentorSessionUpsertArgs>(args: Prisma.SelectSubset<T, MentorSessionUpsertArgs<ExtArgs>>): Prisma.Prisma__MentorSessionClient<runtime.Types.Result.GetResult<Prisma.$MentorSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MentorSessions that matches the filter.
     * @param {MentorSessionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const mentorSession = await prisma.mentorSession.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.MentorSessionFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a MentorSession.
     * @param {MentorSessionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const mentorSession = await prisma.mentorSession.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.MentorSessionAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of MentorSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionCountArgs} args - Arguments to filter MentorSessions to count.
     * @example
     * // Count the number of MentorSessions
     * const count = await prisma.mentorSession.count({
     *   where: {
     *     // ... the filter for the MentorSessions we want to count
     *   }
     * })
    **/
    count<T extends MentorSessionCountArgs>(args?: Prisma.Subset<T, MentorSessionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MentorSessionCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MentorSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MentorSessionAggregateArgs>(args: Prisma.Subset<T, MentorSessionAggregateArgs>): Prisma.PrismaPromise<GetMentorSessionAggregateType<T>>;
    /**
     * Group by MentorSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MentorSessionGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MentorSessionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MentorSessionGroupByArgs['orderBy'];
    } : {
        orderBy?: MentorSessionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MentorSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMentorSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MentorSession model
     */
    readonly fields: MentorSessionFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MentorSession.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MentorSessionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    assignment<T extends Prisma.MentorAssignmentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MentorAssignmentDefaultArgs<ExtArgs>>): Prisma.Prisma__MentorAssignmentClient<runtime.Types.Result.GetResult<Prisma.$MentorAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    team<T extends Prisma.MentorSession$teamArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MentorSession$teamArgs<ExtArgs>>): Prisma.Prisma__TeamClient<runtime.Types.Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MentorSession model
 */
export interface MentorSessionFieldRefs {
    readonly id: Prisma.FieldRef<"MentorSession", 'String'>;
    readonly assignmentId: Prisma.FieldRef<"MentorSession", 'String'>;
    readonly date: Prisma.FieldRef<"MentorSession", 'DateTime'>;
    readonly duration: Prisma.FieldRef<"MentorSession", 'Int'>;
    readonly notes: Prisma.FieldRef<"MentorSession", 'String'>;
    readonly teamId: Prisma.FieldRef<"MentorSession", 'String'>;
}
/**
 * MentorSession findUnique
 */
export type MentorSessionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorSession to fetch.
     */
    where: Prisma.MentorSessionWhereUniqueInput;
};
/**
 * MentorSession findUniqueOrThrow
 */
export type MentorSessionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorSession to fetch.
     */
    where: Prisma.MentorSessionWhereUniqueInput;
};
/**
 * MentorSession findFirst
 */
export type MentorSessionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorSession to fetch.
     */
    where?: Prisma.MentorSessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorSessions to fetch.
     */
    orderBy?: Prisma.MentorSessionOrderByWithRelationInput | Prisma.MentorSessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MentorSessions.
     */
    cursor?: Prisma.MentorSessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorSessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorSessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MentorSessions.
     */
    distinct?: Prisma.MentorSessionScalarFieldEnum | Prisma.MentorSessionScalarFieldEnum[];
};
/**
 * MentorSession findFirstOrThrow
 */
export type MentorSessionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorSession to fetch.
     */
    where?: Prisma.MentorSessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorSessions to fetch.
     */
    orderBy?: Prisma.MentorSessionOrderByWithRelationInput | Prisma.MentorSessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MentorSessions.
     */
    cursor?: Prisma.MentorSessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorSessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorSessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MentorSessions.
     */
    distinct?: Prisma.MentorSessionScalarFieldEnum | Prisma.MentorSessionScalarFieldEnum[];
};
/**
 * MentorSession findMany
 */
export type MentorSessionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MentorSessions to fetch.
     */
    where?: Prisma.MentorSessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MentorSessions to fetch.
     */
    orderBy?: Prisma.MentorSessionOrderByWithRelationInput | Prisma.MentorSessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MentorSessions.
     */
    cursor?: Prisma.MentorSessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MentorSessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MentorSessions.
     */
    skip?: number;
    distinct?: Prisma.MentorSessionScalarFieldEnum | Prisma.MentorSessionScalarFieldEnum[];
};
/**
 * MentorSession create
 */
export type MentorSessionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MentorSession.
     */
    data: Prisma.XOR<Prisma.MentorSessionCreateInput, Prisma.MentorSessionUncheckedCreateInput>;
};
/**
 * MentorSession createMany
 */
export type MentorSessionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MentorSessions.
     */
    data: Prisma.MentorSessionCreateManyInput | Prisma.MentorSessionCreateManyInput[];
};
/**
 * MentorSession update
 */
export type MentorSessionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MentorSession.
     */
    data: Prisma.XOR<Prisma.MentorSessionUpdateInput, Prisma.MentorSessionUncheckedUpdateInput>;
    /**
     * Choose, which MentorSession to update.
     */
    where: Prisma.MentorSessionWhereUniqueInput;
};
/**
 * MentorSession updateMany
 */
export type MentorSessionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MentorSessions.
     */
    data: Prisma.XOR<Prisma.MentorSessionUpdateManyMutationInput, Prisma.MentorSessionUncheckedUpdateManyInput>;
    /**
     * Filter which MentorSessions to update
     */
    where?: Prisma.MentorSessionWhereInput;
    /**
     * Limit how many MentorSessions to update.
     */
    limit?: number;
};
/**
 * MentorSession upsert
 */
export type MentorSessionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MentorSession to update in case it exists.
     */
    where: Prisma.MentorSessionWhereUniqueInput;
    /**
     * In case the MentorSession found by the `where` argument doesn't exist, create a new MentorSession with this data.
     */
    create: Prisma.XOR<Prisma.MentorSessionCreateInput, Prisma.MentorSessionUncheckedCreateInput>;
    /**
     * In case the MentorSession was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MentorSessionUpdateInput, Prisma.MentorSessionUncheckedUpdateInput>;
};
/**
 * MentorSession delete
 */
export type MentorSessionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MentorSession to delete.
     */
    where: Prisma.MentorSessionWhereUniqueInput;
};
/**
 * MentorSession deleteMany
 */
export type MentorSessionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MentorSessions to delete
     */
    where?: Prisma.MentorSessionWhereInput;
    /**
     * Limit how many MentorSessions to delete.
     */
    limit?: number;
};
/**
 * MentorSession findRaw
 */
export type MentorSessionFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * MentorSession aggregateRaw
 */
export type MentorSessionAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * MentorSession.team
 */
export type MentorSession$teamArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * MentorSession without action
 */
export type MentorSessionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=MentorSession.d.ts.map