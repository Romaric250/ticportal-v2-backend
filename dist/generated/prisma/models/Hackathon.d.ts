import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Hackathon
 * Hackathons
 */
export type HackathonModel = runtime.Types.Result.DefaultSelection<Prisma.$HackathonPayload>;
export type AggregateHackathon = {
    _count: HackathonCountAggregateOutputType | null;
    _min: HackathonMinAggregateOutputType | null;
    _max: HackathonMaxAggregateOutputType | null;
};
export type HackathonMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    level: $Enums.HackathonLevel | null;
    squadId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: $Enums.HackathonStatus | null;
};
export type HackathonMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    level: $Enums.HackathonLevel | null;
    squadId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: $Enums.HackathonStatus | null;
};
export type HackathonCountAggregateOutputType = {
    id: number;
    name: number;
    level: number;
    squadId: number;
    startDate: number;
    endDate: number;
    status: number;
    _all: number;
};
export type HackathonMinAggregateInputType = {
    id?: true;
    name?: true;
    level?: true;
    squadId?: true;
    startDate?: true;
    endDate?: true;
    status?: true;
};
export type HackathonMaxAggregateInputType = {
    id?: true;
    name?: true;
    level?: true;
    squadId?: true;
    startDate?: true;
    endDate?: true;
    status?: true;
};
export type HackathonCountAggregateInputType = {
    id?: true;
    name?: true;
    level?: true;
    squadId?: true;
    startDate?: true;
    endDate?: true;
    status?: true;
    _all?: true;
};
export type HackathonAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Hackathon to aggregate.
     */
    where?: Prisma.HackathonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Hackathons to fetch.
     */
    orderBy?: Prisma.HackathonOrderByWithRelationInput | Prisma.HackathonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.HackathonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Hackathons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Hackathons.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Hackathons
    **/
    _count?: true | HackathonCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: HackathonMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: HackathonMaxAggregateInputType;
};
export type GetHackathonAggregateType<T extends HackathonAggregateArgs> = {
    [P in keyof T & keyof AggregateHackathon]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHackathon[P]> : Prisma.GetScalarType<T[P], AggregateHackathon[P]>;
};
export type HackathonGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HackathonWhereInput;
    orderBy?: Prisma.HackathonOrderByWithAggregationInput | Prisma.HackathonOrderByWithAggregationInput[];
    by: Prisma.HackathonScalarFieldEnum[] | Prisma.HackathonScalarFieldEnum;
    having?: Prisma.HackathonScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HackathonCountAggregateInputType | true;
    _min?: HackathonMinAggregateInputType;
    _max?: HackathonMaxAggregateInputType;
};
export type HackathonGroupByOutputType = {
    id: string;
    name: string;
    level: $Enums.HackathonLevel;
    squadId: string | null;
    startDate: Date;
    endDate: Date;
    status: $Enums.HackathonStatus;
    _count: HackathonCountAggregateOutputType | null;
    _min: HackathonMinAggregateOutputType | null;
    _max: HackathonMaxAggregateOutputType | null;
};
type GetHackathonGroupByPayload<T extends HackathonGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HackathonGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HackathonGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HackathonGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HackathonGroupByOutputType[P]>;
}>>;
export type HackathonWhereInput = {
    AND?: Prisma.HackathonWhereInput | Prisma.HackathonWhereInput[];
    OR?: Prisma.HackathonWhereInput[];
    NOT?: Prisma.HackathonWhereInput | Prisma.HackathonWhereInput[];
    id?: Prisma.StringFilter<"Hackathon"> | string;
    name?: Prisma.StringFilter<"Hackathon"> | string;
    level?: Prisma.EnumHackathonLevelFilter<"Hackathon"> | $Enums.HackathonLevel;
    squadId?: Prisma.StringNullableFilter<"Hackathon"> | string | null;
    startDate?: Prisma.DateTimeFilter<"Hackathon"> | Date | string;
    endDate?: Prisma.DateTimeFilter<"Hackathon"> | Date | string;
    status?: Prisma.EnumHackathonStatusFilter<"Hackathon"> | $Enums.HackathonStatus;
    squad?: Prisma.XOR<Prisma.SquadNullableScalarRelationFilter, Prisma.SquadWhereInput> | null;
    submissions?: Prisma.SubmissionListRelationFilter;
};
export type HackathonOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    squad?: Prisma.SquadOrderByWithRelationInput;
    submissions?: Prisma.SubmissionOrderByRelationAggregateInput;
};
export type HackathonWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.HackathonWhereInput | Prisma.HackathonWhereInput[];
    OR?: Prisma.HackathonWhereInput[];
    NOT?: Prisma.HackathonWhereInput | Prisma.HackathonWhereInput[];
    name?: Prisma.StringFilter<"Hackathon"> | string;
    level?: Prisma.EnumHackathonLevelFilter<"Hackathon"> | $Enums.HackathonLevel;
    squadId?: Prisma.StringNullableFilter<"Hackathon"> | string | null;
    startDate?: Prisma.DateTimeFilter<"Hackathon"> | Date | string;
    endDate?: Prisma.DateTimeFilter<"Hackathon"> | Date | string;
    status?: Prisma.EnumHackathonStatusFilter<"Hackathon"> | $Enums.HackathonStatus;
    squad?: Prisma.XOR<Prisma.SquadNullableScalarRelationFilter, Prisma.SquadWhereInput> | null;
    submissions?: Prisma.SubmissionListRelationFilter;
}, "id">;
export type HackathonOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    _count?: Prisma.HackathonCountOrderByAggregateInput;
    _max?: Prisma.HackathonMaxOrderByAggregateInput;
    _min?: Prisma.HackathonMinOrderByAggregateInput;
};
export type HackathonScalarWhereWithAggregatesInput = {
    AND?: Prisma.HackathonScalarWhereWithAggregatesInput | Prisma.HackathonScalarWhereWithAggregatesInput[];
    OR?: Prisma.HackathonScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HackathonScalarWhereWithAggregatesInput | Prisma.HackathonScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Hackathon"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Hackathon"> | string;
    level?: Prisma.EnumHackathonLevelWithAggregatesFilter<"Hackathon"> | $Enums.HackathonLevel;
    squadId?: Prisma.StringNullableWithAggregatesFilter<"Hackathon"> | string | null;
    startDate?: Prisma.DateTimeWithAggregatesFilter<"Hackathon"> | Date | string;
    endDate?: Prisma.DateTimeWithAggregatesFilter<"Hackathon"> | Date | string;
    status?: Prisma.EnumHackathonStatusWithAggregatesFilter<"Hackathon"> | $Enums.HackathonStatus;
};
export type HackathonCreateInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
    squad?: Prisma.SquadCreateNestedOneWithoutHackathonsInput;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutHackathonInput;
};
export type HackathonUncheckedCreateInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    squadId?: string | null;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutHackathonInput;
};
export type HackathonUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
    squad?: Prisma.SquadUpdateOneWithoutHackathonsNestedInput;
    submissions?: Prisma.SubmissionUpdateManyWithoutHackathonNestedInput;
};
export type HackathonUncheckedUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutHackathonNestedInput;
};
export type HackathonCreateManyInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    squadId?: string | null;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
};
export type HackathonUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
};
export type HackathonUncheckedUpdateManyInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
};
export type HackathonListRelationFilter = {
    every?: Prisma.HackathonWhereInput;
    some?: Prisma.HackathonWhereInput;
    none?: Prisma.HackathonWhereInput;
};
export type HackathonOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type HackathonCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type HackathonMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type HackathonMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    squadId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type HackathonScalarRelationFilter = {
    is?: Prisma.HackathonWhereInput;
    isNot?: Prisma.HackathonWhereInput;
};
export type HackathonCreateNestedManyWithoutSquadInput = {
    create?: Prisma.XOR<Prisma.HackathonCreateWithoutSquadInput, Prisma.HackathonUncheckedCreateWithoutSquadInput> | Prisma.HackathonCreateWithoutSquadInput[] | Prisma.HackathonUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.HackathonCreateOrConnectWithoutSquadInput | Prisma.HackathonCreateOrConnectWithoutSquadInput[];
    createMany?: Prisma.HackathonCreateManySquadInputEnvelope;
    connect?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
};
export type HackathonUncheckedCreateNestedManyWithoutSquadInput = {
    create?: Prisma.XOR<Prisma.HackathonCreateWithoutSquadInput, Prisma.HackathonUncheckedCreateWithoutSquadInput> | Prisma.HackathonCreateWithoutSquadInput[] | Prisma.HackathonUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.HackathonCreateOrConnectWithoutSquadInput | Prisma.HackathonCreateOrConnectWithoutSquadInput[];
    createMany?: Prisma.HackathonCreateManySquadInputEnvelope;
    connect?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
};
export type HackathonUpdateManyWithoutSquadNestedInput = {
    create?: Prisma.XOR<Prisma.HackathonCreateWithoutSquadInput, Prisma.HackathonUncheckedCreateWithoutSquadInput> | Prisma.HackathonCreateWithoutSquadInput[] | Prisma.HackathonUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.HackathonCreateOrConnectWithoutSquadInput | Prisma.HackathonCreateOrConnectWithoutSquadInput[];
    upsert?: Prisma.HackathonUpsertWithWhereUniqueWithoutSquadInput | Prisma.HackathonUpsertWithWhereUniqueWithoutSquadInput[];
    createMany?: Prisma.HackathonCreateManySquadInputEnvelope;
    set?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    disconnect?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    delete?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    connect?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    update?: Prisma.HackathonUpdateWithWhereUniqueWithoutSquadInput | Prisma.HackathonUpdateWithWhereUniqueWithoutSquadInput[];
    updateMany?: Prisma.HackathonUpdateManyWithWhereWithoutSquadInput | Prisma.HackathonUpdateManyWithWhereWithoutSquadInput[];
    deleteMany?: Prisma.HackathonScalarWhereInput | Prisma.HackathonScalarWhereInput[];
};
export type HackathonUncheckedUpdateManyWithoutSquadNestedInput = {
    create?: Prisma.XOR<Prisma.HackathonCreateWithoutSquadInput, Prisma.HackathonUncheckedCreateWithoutSquadInput> | Prisma.HackathonCreateWithoutSquadInput[] | Prisma.HackathonUncheckedCreateWithoutSquadInput[];
    connectOrCreate?: Prisma.HackathonCreateOrConnectWithoutSquadInput | Prisma.HackathonCreateOrConnectWithoutSquadInput[];
    upsert?: Prisma.HackathonUpsertWithWhereUniqueWithoutSquadInput | Prisma.HackathonUpsertWithWhereUniqueWithoutSquadInput[];
    createMany?: Prisma.HackathonCreateManySquadInputEnvelope;
    set?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    disconnect?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    delete?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    connect?: Prisma.HackathonWhereUniqueInput | Prisma.HackathonWhereUniqueInput[];
    update?: Prisma.HackathonUpdateWithWhereUniqueWithoutSquadInput | Prisma.HackathonUpdateWithWhereUniqueWithoutSquadInput[];
    updateMany?: Prisma.HackathonUpdateManyWithWhereWithoutSquadInput | Prisma.HackathonUpdateManyWithWhereWithoutSquadInput[];
    deleteMany?: Prisma.HackathonScalarWhereInput | Prisma.HackathonScalarWhereInput[];
};
export type EnumHackathonLevelFieldUpdateOperationsInput = {
    set?: $Enums.HackathonLevel;
};
export type EnumHackathonStatusFieldUpdateOperationsInput = {
    set?: $Enums.HackathonStatus;
};
export type HackathonCreateNestedOneWithoutSubmissionsInput = {
    create?: Prisma.XOR<Prisma.HackathonCreateWithoutSubmissionsInput, Prisma.HackathonUncheckedCreateWithoutSubmissionsInput>;
    connectOrCreate?: Prisma.HackathonCreateOrConnectWithoutSubmissionsInput;
    connect?: Prisma.HackathonWhereUniqueInput;
};
export type HackathonUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: Prisma.XOR<Prisma.HackathonCreateWithoutSubmissionsInput, Prisma.HackathonUncheckedCreateWithoutSubmissionsInput>;
    connectOrCreate?: Prisma.HackathonCreateOrConnectWithoutSubmissionsInput;
    upsert?: Prisma.HackathonUpsertWithoutSubmissionsInput;
    connect?: Prisma.HackathonWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.HackathonUpdateToOneWithWhereWithoutSubmissionsInput, Prisma.HackathonUpdateWithoutSubmissionsInput>, Prisma.HackathonUncheckedUpdateWithoutSubmissionsInput>;
};
export type HackathonCreateWithoutSquadInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
    submissions?: Prisma.SubmissionCreateNestedManyWithoutHackathonInput;
};
export type HackathonUncheckedCreateWithoutSquadInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
    submissions?: Prisma.SubmissionUncheckedCreateNestedManyWithoutHackathonInput;
};
export type HackathonCreateOrConnectWithoutSquadInput = {
    where: Prisma.HackathonWhereUniqueInput;
    create: Prisma.XOR<Prisma.HackathonCreateWithoutSquadInput, Prisma.HackathonUncheckedCreateWithoutSquadInput>;
};
export type HackathonCreateManySquadInputEnvelope = {
    data: Prisma.HackathonCreateManySquadInput | Prisma.HackathonCreateManySquadInput[];
};
export type HackathonUpsertWithWhereUniqueWithoutSquadInput = {
    where: Prisma.HackathonWhereUniqueInput;
    update: Prisma.XOR<Prisma.HackathonUpdateWithoutSquadInput, Prisma.HackathonUncheckedUpdateWithoutSquadInput>;
    create: Prisma.XOR<Prisma.HackathonCreateWithoutSquadInput, Prisma.HackathonUncheckedCreateWithoutSquadInput>;
};
export type HackathonUpdateWithWhereUniqueWithoutSquadInput = {
    where: Prisma.HackathonWhereUniqueInput;
    data: Prisma.XOR<Prisma.HackathonUpdateWithoutSquadInput, Prisma.HackathonUncheckedUpdateWithoutSquadInput>;
};
export type HackathonUpdateManyWithWhereWithoutSquadInput = {
    where: Prisma.HackathonScalarWhereInput;
    data: Prisma.XOR<Prisma.HackathonUpdateManyMutationInput, Prisma.HackathonUncheckedUpdateManyWithoutSquadInput>;
};
export type HackathonScalarWhereInput = {
    AND?: Prisma.HackathonScalarWhereInput | Prisma.HackathonScalarWhereInput[];
    OR?: Prisma.HackathonScalarWhereInput[];
    NOT?: Prisma.HackathonScalarWhereInput | Prisma.HackathonScalarWhereInput[];
    id?: Prisma.StringFilter<"Hackathon"> | string;
    name?: Prisma.StringFilter<"Hackathon"> | string;
    level?: Prisma.EnumHackathonLevelFilter<"Hackathon"> | $Enums.HackathonLevel;
    squadId?: Prisma.StringNullableFilter<"Hackathon"> | string | null;
    startDate?: Prisma.DateTimeFilter<"Hackathon"> | Date | string;
    endDate?: Prisma.DateTimeFilter<"Hackathon"> | Date | string;
    status?: Prisma.EnumHackathonStatusFilter<"Hackathon"> | $Enums.HackathonStatus;
};
export type HackathonCreateWithoutSubmissionsInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
    squad?: Prisma.SquadCreateNestedOneWithoutHackathonsInput;
};
export type HackathonUncheckedCreateWithoutSubmissionsInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    squadId?: string | null;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
};
export type HackathonCreateOrConnectWithoutSubmissionsInput = {
    where: Prisma.HackathonWhereUniqueInput;
    create: Prisma.XOR<Prisma.HackathonCreateWithoutSubmissionsInput, Prisma.HackathonUncheckedCreateWithoutSubmissionsInput>;
};
export type HackathonUpsertWithoutSubmissionsInput = {
    update: Prisma.XOR<Prisma.HackathonUpdateWithoutSubmissionsInput, Prisma.HackathonUncheckedUpdateWithoutSubmissionsInput>;
    create: Prisma.XOR<Prisma.HackathonCreateWithoutSubmissionsInput, Prisma.HackathonUncheckedCreateWithoutSubmissionsInput>;
    where?: Prisma.HackathonWhereInput;
};
export type HackathonUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: Prisma.HackathonWhereInput;
    data: Prisma.XOR<Prisma.HackathonUpdateWithoutSubmissionsInput, Prisma.HackathonUncheckedUpdateWithoutSubmissionsInput>;
};
export type HackathonUpdateWithoutSubmissionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
    squad?: Prisma.SquadUpdateOneWithoutHackathonsNestedInput;
};
export type HackathonUncheckedUpdateWithoutSubmissionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    squadId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
};
export type HackathonCreateManySquadInput = {
    id?: string;
    name: string;
    level: $Enums.HackathonLevel;
    startDate: Date | string;
    endDate: Date | string;
    status?: $Enums.HackathonStatus;
};
export type HackathonUpdateWithoutSquadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
    submissions?: Prisma.SubmissionUpdateManyWithoutHackathonNestedInput;
};
export type HackathonUncheckedUpdateWithoutSquadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
    submissions?: Prisma.SubmissionUncheckedUpdateManyWithoutHackathonNestedInput;
};
export type HackathonUncheckedUpdateManyWithoutSquadInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.EnumHackathonLevelFieldUpdateOperationsInput | $Enums.HackathonLevel;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumHackathonStatusFieldUpdateOperationsInput | $Enums.HackathonStatus;
};
/**
 * Count Type HackathonCountOutputType
 */
export type HackathonCountOutputType = {
    submissions: number;
};
export type HackathonCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    submissions?: boolean | HackathonCountOutputTypeCountSubmissionsArgs;
};
/**
 * HackathonCountOutputType without action
 */
export type HackathonCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HackathonCountOutputType
     */
    select?: Prisma.HackathonCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * HackathonCountOutputType without action
 */
export type HackathonCountOutputTypeCountSubmissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubmissionWhereInput;
};
export type HackathonSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    level?: boolean;
    squadId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    status?: boolean;
    squad?: boolean | Prisma.Hackathon$squadArgs<ExtArgs>;
    submissions?: boolean | Prisma.Hackathon$submissionsArgs<ExtArgs>;
    _count?: boolean | Prisma.HackathonCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["hackathon"]>;
export type HackathonSelectScalar = {
    id?: boolean;
    name?: boolean;
    level?: boolean;
    squadId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    status?: boolean;
};
export type HackathonOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "level" | "squadId" | "startDate" | "endDate" | "status", ExtArgs["result"]["hackathon"]>;
export type HackathonInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    squad?: boolean | Prisma.Hackathon$squadArgs<ExtArgs>;
    submissions?: boolean | Prisma.Hackathon$submissionsArgs<ExtArgs>;
    _count?: boolean | Prisma.HackathonCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $HackathonPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Hackathon";
    objects: {
        squad: Prisma.$SquadPayload<ExtArgs> | null;
        submissions: Prisma.$SubmissionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        level: $Enums.HackathonLevel;
        squadId: string | null;
        startDate: Date;
        endDate: Date;
        status: $Enums.HackathonStatus;
    }, ExtArgs["result"]["hackathon"]>;
    composites: {};
};
export type HackathonGetPayload<S extends boolean | null | undefined | HackathonDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HackathonPayload, S>;
export type HackathonCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HackathonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HackathonCountAggregateInputType | true;
};
export interface HackathonDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Hackathon'];
        meta: {
            name: 'Hackathon';
        };
    };
    /**
     * Find zero or one Hackathon that matches the filter.
     * @param {HackathonFindUniqueArgs} args - Arguments to find a Hackathon
     * @example
     * // Get one Hackathon
     * const hackathon = await prisma.hackathon.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HackathonFindUniqueArgs>(args: Prisma.SelectSubset<T, HackathonFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Hackathon that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HackathonFindUniqueOrThrowArgs} args - Arguments to find a Hackathon
     * @example
     * // Get one Hackathon
     * const hackathon = await prisma.hackathon.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HackathonFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HackathonFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Hackathon that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HackathonFindFirstArgs} args - Arguments to find a Hackathon
     * @example
     * // Get one Hackathon
     * const hackathon = await prisma.hackathon.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HackathonFindFirstArgs>(args?: Prisma.SelectSubset<T, HackathonFindFirstArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Hackathon that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HackathonFindFirstOrThrowArgs} args - Arguments to find a Hackathon
     * @example
     * // Get one Hackathon
     * const hackathon = await prisma.hackathon.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HackathonFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HackathonFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Hackathons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HackathonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Hackathons
     * const hackathons = await prisma.hackathon.findMany()
     *
     * // Get first 10 Hackathons
     * const hackathons = await prisma.hackathon.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const hackathonWithIdOnly = await prisma.hackathon.findMany({ select: { id: true } })
     *
     */
    findMany<T extends HackathonFindManyArgs>(args?: Prisma.SelectSubset<T, HackathonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Hackathon.
     * @param {HackathonCreateArgs} args - Arguments to create a Hackathon.
     * @example
     * // Create one Hackathon
     * const Hackathon = await prisma.hackathon.create({
     *   data: {
     *     // ... data to create a Hackathon
     *   }
     * })
     *
     */
    create<T extends HackathonCreateArgs>(args: Prisma.SelectSubset<T, HackathonCreateArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Hackathons.
     * @param {HackathonCreateManyArgs} args - Arguments to create many Hackathons.
     * @example
     * // Create many Hackathons
     * const hackathon = await prisma.hackathon.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends HackathonCreateManyArgs>(args?: Prisma.SelectSubset<T, HackathonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Hackathon.
     * @param {HackathonDeleteArgs} args - Arguments to delete one Hackathon.
     * @example
     * // Delete one Hackathon
     * const Hackathon = await prisma.hackathon.delete({
     *   where: {
     *     // ... filter to delete one Hackathon
     *   }
     * })
     *
     */
    delete<T extends HackathonDeleteArgs>(args: Prisma.SelectSubset<T, HackathonDeleteArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Hackathon.
     * @param {HackathonUpdateArgs} args - Arguments to update one Hackathon.
     * @example
     * // Update one Hackathon
     * const hackathon = await prisma.hackathon.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends HackathonUpdateArgs>(args: Prisma.SelectSubset<T, HackathonUpdateArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Hackathons.
     * @param {HackathonDeleteManyArgs} args - Arguments to filter Hackathons to delete.
     * @example
     * // Delete a few Hackathons
     * const { count } = await prisma.hackathon.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends HackathonDeleteManyArgs>(args?: Prisma.SelectSubset<T, HackathonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Hackathons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HackathonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Hackathons
     * const hackathon = await prisma.hackathon.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends HackathonUpdateManyArgs>(args: Prisma.SelectSubset<T, HackathonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Hackathon.
     * @param {HackathonUpsertArgs} args - Arguments to update or create a Hackathon.
     * @example
     * // Update or create a Hackathon
     * const hackathon = await prisma.hackathon.upsert({
     *   create: {
     *     // ... data to create a Hackathon
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Hackathon we want to update
     *   }
     * })
     */
    upsert<T extends HackathonUpsertArgs>(args: Prisma.SelectSubset<T, HackathonUpsertArgs<ExtArgs>>): Prisma.Prisma__HackathonClient<runtime.Types.Result.GetResult<Prisma.$HackathonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Hackathons that matches the filter.
     * @param {HackathonFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const hackathon = await prisma.hackathon.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.HackathonFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a Hackathon.
     * @param {HackathonAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const hackathon = await prisma.hackathon.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.HackathonAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of Hackathons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HackathonCountArgs} args - Arguments to filter Hackathons to count.
     * @example
     * // Count the number of Hackathons
     * const count = await prisma.hackathon.count({
     *   where: {
     *     // ... the filter for the Hackathons we want to count
     *   }
     * })
    **/
    count<T extends HackathonCountArgs>(args?: Prisma.Subset<T, HackathonCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HackathonCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Hackathon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HackathonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HackathonAggregateArgs>(args: Prisma.Subset<T, HackathonAggregateArgs>): Prisma.PrismaPromise<GetHackathonAggregateType<T>>;
    /**
     * Group by Hackathon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HackathonGroupByArgs} args - Group by arguments.
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
    groupBy<T extends HackathonGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HackathonGroupByArgs['orderBy'];
    } : {
        orderBy?: HackathonGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HackathonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHackathonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Hackathon model
     */
    readonly fields: HackathonFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Hackathon.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__HackathonClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    squad<T extends Prisma.Hackathon$squadArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Hackathon$squadArgs<ExtArgs>>): Prisma.Prisma__SquadClient<runtime.Types.Result.GetResult<Prisma.$SquadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    submissions<T extends Prisma.Hackathon$submissionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Hackathon$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Hackathon model
 */
export interface HackathonFieldRefs {
    readonly id: Prisma.FieldRef<"Hackathon", 'String'>;
    readonly name: Prisma.FieldRef<"Hackathon", 'String'>;
    readonly level: Prisma.FieldRef<"Hackathon", 'HackathonLevel'>;
    readonly squadId: Prisma.FieldRef<"Hackathon", 'String'>;
    readonly startDate: Prisma.FieldRef<"Hackathon", 'DateTime'>;
    readonly endDate: Prisma.FieldRef<"Hackathon", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Hackathon", 'HackathonStatus'>;
}
/**
 * Hackathon findUnique
 */
export type HackathonFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Hackathon to fetch.
     */
    where: Prisma.HackathonWhereUniqueInput;
};
/**
 * Hackathon findUniqueOrThrow
 */
export type HackathonFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Hackathon to fetch.
     */
    where: Prisma.HackathonWhereUniqueInput;
};
/**
 * Hackathon findFirst
 */
export type HackathonFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Hackathon to fetch.
     */
    where?: Prisma.HackathonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Hackathons to fetch.
     */
    orderBy?: Prisma.HackathonOrderByWithRelationInput | Prisma.HackathonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Hackathons.
     */
    cursor?: Prisma.HackathonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Hackathons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Hackathons.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Hackathons.
     */
    distinct?: Prisma.HackathonScalarFieldEnum | Prisma.HackathonScalarFieldEnum[];
};
/**
 * Hackathon findFirstOrThrow
 */
export type HackathonFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Hackathon to fetch.
     */
    where?: Prisma.HackathonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Hackathons to fetch.
     */
    orderBy?: Prisma.HackathonOrderByWithRelationInput | Prisma.HackathonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Hackathons.
     */
    cursor?: Prisma.HackathonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Hackathons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Hackathons.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Hackathons.
     */
    distinct?: Prisma.HackathonScalarFieldEnum | Prisma.HackathonScalarFieldEnum[];
};
/**
 * Hackathon findMany
 */
export type HackathonFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Hackathons to fetch.
     */
    where?: Prisma.HackathonWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Hackathons to fetch.
     */
    orderBy?: Prisma.HackathonOrderByWithRelationInput | Prisma.HackathonOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Hackathons.
     */
    cursor?: Prisma.HackathonWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Hackathons from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Hackathons.
     */
    skip?: number;
    distinct?: Prisma.HackathonScalarFieldEnum | Prisma.HackathonScalarFieldEnum[];
};
/**
 * Hackathon create
 */
export type HackathonCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a Hackathon.
     */
    data: Prisma.XOR<Prisma.HackathonCreateInput, Prisma.HackathonUncheckedCreateInput>;
};
/**
 * Hackathon createMany
 */
export type HackathonCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Hackathons.
     */
    data: Prisma.HackathonCreateManyInput | Prisma.HackathonCreateManyInput[];
};
/**
 * Hackathon update
 */
export type HackathonUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a Hackathon.
     */
    data: Prisma.XOR<Prisma.HackathonUpdateInput, Prisma.HackathonUncheckedUpdateInput>;
    /**
     * Choose, which Hackathon to update.
     */
    where: Prisma.HackathonWhereUniqueInput;
};
/**
 * Hackathon updateMany
 */
export type HackathonUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Hackathons.
     */
    data: Prisma.XOR<Prisma.HackathonUpdateManyMutationInput, Prisma.HackathonUncheckedUpdateManyInput>;
    /**
     * Filter which Hackathons to update
     */
    where?: Prisma.HackathonWhereInput;
    /**
     * Limit how many Hackathons to update.
     */
    limit?: number;
};
/**
 * Hackathon upsert
 */
export type HackathonUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the Hackathon to update in case it exists.
     */
    where: Prisma.HackathonWhereUniqueInput;
    /**
     * In case the Hackathon found by the `where` argument doesn't exist, create a new Hackathon with this data.
     */
    create: Prisma.XOR<Prisma.HackathonCreateInput, Prisma.HackathonUncheckedCreateInput>;
    /**
     * In case the Hackathon was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.HackathonUpdateInput, Prisma.HackathonUncheckedUpdateInput>;
};
/**
 * Hackathon delete
 */
export type HackathonDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which Hackathon to delete.
     */
    where: Prisma.HackathonWhereUniqueInput;
};
/**
 * Hackathon deleteMany
 */
export type HackathonDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Hackathons to delete
     */
    where?: Prisma.HackathonWhereInput;
    /**
     * Limit how many Hackathons to delete.
     */
    limit?: number;
};
/**
 * Hackathon findRaw
 */
export type HackathonFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Hackathon aggregateRaw
 */
export type HackathonAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Hackathon.squad
 */
export type Hackathon$squadArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Hackathon.submissions
 */
export type Hackathon$submissionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Hackathon without action
 */
export type HackathonDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=Hackathon.d.ts.map