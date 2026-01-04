import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Stage
 * Learning Path
 */
export type StageModel = runtime.Types.Result.DefaultSelection<Prisma.$StagePayload>;
export type AggregateStage = {
    _count: StageCountAggregateOutputType | null;
    _avg: StageAvgAggregateOutputType | null;
    _sum: StageSumAggregateOutputType | null;
    _min: StageMinAggregateOutputType | null;
    _max: StageMaxAggregateOutputType | null;
};
export type StageAvgAggregateOutputType = {
    order: number | null;
};
export type StageSumAggregateOutputType = {
    order: number | null;
};
export type StageMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    order: number | null;
    unlockCriteria: string | null;
    description: string | null;
};
export type StageMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    order: number | null;
    unlockCriteria: string | null;
    description: string | null;
};
export type StageCountAggregateOutputType = {
    id: number;
    name: number;
    order: number;
    unlockCriteria: number;
    description: number;
    _all: number;
};
export type StageAvgAggregateInputType = {
    order?: true;
};
export type StageSumAggregateInputType = {
    order?: true;
};
export type StageMinAggregateInputType = {
    id?: true;
    name?: true;
    order?: true;
    unlockCriteria?: true;
    description?: true;
};
export type StageMaxAggregateInputType = {
    id?: true;
    name?: true;
    order?: true;
    unlockCriteria?: true;
    description?: true;
};
export type StageCountAggregateInputType = {
    id?: true;
    name?: true;
    order?: true;
    unlockCriteria?: true;
    description?: true;
    _all?: true;
};
export type StageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Stage to aggregate.
     */
    where?: Prisma.StageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Stages to fetch.
     */
    orderBy?: Prisma.StageOrderByWithRelationInput | Prisma.StageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.StageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Stages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Stages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Stages
    **/
    _count?: true | StageCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: StageAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: StageSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: StageMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: StageMaxAggregateInputType;
};
export type GetStageAggregateType<T extends StageAggregateArgs> = {
    [P in keyof T & keyof AggregateStage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStage[P]> : Prisma.GetScalarType<T[P], AggregateStage[P]>;
};
export type StageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StageWhereInput;
    orderBy?: Prisma.StageOrderByWithAggregationInput | Prisma.StageOrderByWithAggregationInput[];
    by: Prisma.StageScalarFieldEnum[] | Prisma.StageScalarFieldEnum;
    having?: Prisma.StageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StageCountAggregateInputType | true;
    _avg?: StageAvgAggregateInputType;
    _sum?: StageSumAggregateInputType;
    _min?: StageMinAggregateInputType;
    _max?: StageMaxAggregateInputType;
};
export type StageGroupByOutputType = {
    id: string;
    name: string;
    order: number;
    unlockCriteria: string | null;
    description: string | null;
    _count: StageCountAggregateOutputType | null;
    _avg: StageAvgAggregateOutputType | null;
    _sum: StageSumAggregateOutputType | null;
    _min: StageMinAggregateOutputType | null;
    _max: StageMaxAggregateOutputType | null;
};
type GetStageGroupByPayload<T extends StageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StageGroupByOutputType[P]>;
}>>;
export type StageWhereInput = {
    AND?: Prisma.StageWhereInput | Prisma.StageWhereInput[];
    OR?: Prisma.StageWhereInput[];
    NOT?: Prisma.StageWhereInput | Prisma.StageWhereInput[];
    id?: Prisma.StringFilter<"Stage"> | string;
    name?: Prisma.StringFilter<"Stage"> | string;
    order?: Prisma.IntFilter<"Stage"> | number;
    unlockCriteria?: Prisma.StringNullableFilter<"Stage"> | string | null;
    description?: Prisma.StringNullableFilter<"Stage"> | string | null;
    resources?: Prisma.ResourceListRelationFilter;
    quizzes?: Prisma.QuizListRelationFilter;
    progress?: Prisma.UserProgressListRelationFilter;
};
export type StageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    unlockCriteria?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    resources?: Prisma.ResourceOrderByRelationAggregateInput;
    quizzes?: Prisma.QuizOrderByRelationAggregateInput;
    progress?: Prisma.UserProgressOrderByRelationAggregateInput;
};
export type StageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    order?: number;
    AND?: Prisma.StageWhereInput | Prisma.StageWhereInput[];
    OR?: Prisma.StageWhereInput[];
    NOT?: Prisma.StageWhereInput | Prisma.StageWhereInput[];
    name?: Prisma.StringFilter<"Stage"> | string;
    unlockCriteria?: Prisma.StringNullableFilter<"Stage"> | string | null;
    description?: Prisma.StringNullableFilter<"Stage"> | string | null;
    resources?: Prisma.ResourceListRelationFilter;
    quizzes?: Prisma.QuizListRelationFilter;
    progress?: Prisma.UserProgressListRelationFilter;
}, "id" | "order">;
export type StageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    unlockCriteria?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    _count?: Prisma.StageCountOrderByAggregateInput;
    _avg?: Prisma.StageAvgOrderByAggregateInput;
    _max?: Prisma.StageMaxOrderByAggregateInput;
    _min?: Prisma.StageMinOrderByAggregateInput;
    _sum?: Prisma.StageSumOrderByAggregateInput;
};
export type StageScalarWhereWithAggregatesInput = {
    AND?: Prisma.StageScalarWhereWithAggregatesInput | Prisma.StageScalarWhereWithAggregatesInput[];
    OR?: Prisma.StageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StageScalarWhereWithAggregatesInput | Prisma.StageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Stage"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Stage"> | string;
    order?: Prisma.IntWithAggregatesFilter<"Stage"> | number;
    unlockCriteria?: Prisma.StringNullableWithAggregatesFilter<"Stage"> | string | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"Stage"> | string | null;
};
export type StageCreateInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    resources?: Prisma.ResourceCreateNestedManyWithoutStageInput;
    quizzes?: Prisma.QuizCreateNestedManyWithoutStageInput;
    progress?: Prisma.UserProgressCreateNestedManyWithoutStageInput;
};
export type StageUncheckedCreateInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    resources?: Prisma.ResourceUncheckedCreateNestedManyWithoutStageInput;
    quizzes?: Prisma.QuizUncheckedCreateNestedManyWithoutStageInput;
    progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutStageInput;
};
export type StageUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resources?: Prisma.ResourceUpdateManyWithoutStageNestedInput;
    quizzes?: Prisma.QuizUpdateManyWithoutStageNestedInput;
    progress?: Prisma.UserProgressUpdateManyWithoutStageNestedInput;
};
export type StageUncheckedUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resources?: Prisma.ResourceUncheckedUpdateManyWithoutStageNestedInput;
    quizzes?: Prisma.QuizUncheckedUpdateManyWithoutStageNestedInput;
    progress?: Prisma.UserProgressUncheckedUpdateManyWithoutStageNestedInput;
};
export type StageCreateManyInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
};
export type StageUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StageUncheckedUpdateManyInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    unlockCriteria?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
};
export type StageAvgOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type StageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    unlockCriteria?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
};
export type StageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    unlockCriteria?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
};
export type StageSumOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type StageScalarRelationFilter = {
    is?: Prisma.StageWhereInput;
    isNot?: Prisma.StageWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type StageCreateNestedOneWithoutResourcesInput = {
    create?: Prisma.XOR<Prisma.StageCreateWithoutResourcesInput, Prisma.StageUncheckedCreateWithoutResourcesInput>;
    connectOrCreate?: Prisma.StageCreateOrConnectWithoutResourcesInput;
    connect?: Prisma.StageWhereUniqueInput;
};
export type StageUpdateOneRequiredWithoutResourcesNestedInput = {
    create?: Prisma.XOR<Prisma.StageCreateWithoutResourcesInput, Prisma.StageUncheckedCreateWithoutResourcesInput>;
    connectOrCreate?: Prisma.StageCreateOrConnectWithoutResourcesInput;
    upsert?: Prisma.StageUpsertWithoutResourcesInput;
    connect?: Prisma.StageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StageUpdateToOneWithWhereWithoutResourcesInput, Prisma.StageUpdateWithoutResourcesInput>, Prisma.StageUncheckedUpdateWithoutResourcesInput>;
};
export type StageCreateNestedOneWithoutQuizzesInput = {
    create?: Prisma.XOR<Prisma.StageCreateWithoutQuizzesInput, Prisma.StageUncheckedCreateWithoutQuizzesInput>;
    connectOrCreate?: Prisma.StageCreateOrConnectWithoutQuizzesInput;
    connect?: Prisma.StageWhereUniqueInput;
};
export type StageUpdateOneRequiredWithoutQuizzesNestedInput = {
    create?: Prisma.XOR<Prisma.StageCreateWithoutQuizzesInput, Prisma.StageUncheckedCreateWithoutQuizzesInput>;
    connectOrCreate?: Prisma.StageCreateOrConnectWithoutQuizzesInput;
    upsert?: Prisma.StageUpsertWithoutQuizzesInput;
    connect?: Prisma.StageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StageUpdateToOneWithWhereWithoutQuizzesInput, Prisma.StageUpdateWithoutQuizzesInput>, Prisma.StageUncheckedUpdateWithoutQuizzesInput>;
};
export type StageCreateNestedOneWithoutProgressInput = {
    create?: Prisma.XOR<Prisma.StageCreateWithoutProgressInput, Prisma.StageUncheckedCreateWithoutProgressInput>;
    connectOrCreate?: Prisma.StageCreateOrConnectWithoutProgressInput;
    connect?: Prisma.StageWhereUniqueInput;
};
export type StageUpdateOneRequiredWithoutProgressNestedInput = {
    create?: Prisma.XOR<Prisma.StageCreateWithoutProgressInput, Prisma.StageUncheckedCreateWithoutProgressInput>;
    connectOrCreate?: Prisma.StageCreateOrConnectWithoutProgressInput;
    upsert?: Prisma.StageUpsertWithoutProgressInput;
    connect?: Prisma.StageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.StageUpdateToOneWithWhereWithoutProgressInput, Prisma.StageUpdateWithoutProgressInput>, Prisma.StageUncheckedUpdateWithoutProgressInput>;
};
export type StageCreateWithoutResourcesInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    quizzes?: Prisma.QuizCreateNestedManyWithoutStageInput;
    progress?: Prisma.UserProgressCreateNestedManyWithoutStageInput;
};
export type StageUncheckedCreateWithoutResourcesInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    quizzes?: Prisma.QuizUncheckedCreateNestedManyWithoutStageInput;
    progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutStageInput;
};
export type StageCreateOrConnectWithoutResourcesInput = {
    where: Prisma.StageWhereUniqueInput;
    create: Prisma.XOR<Prisma.StageCreateWithoutResourcesInput, Prisma.StageUncheckedCreateWithoutResourcesInput>;
};
export type StageUpsertWithoutResourcesInput = {
    update: Prisma.XOR<Prisma.StageUpdateWithoutResourcesInput, Prisma.StageUncheckedUpdateWithoutResourcesInput>;
    create: Prisma.XOR<Prisma.StageCreateWithoutResourcesInput, Prisma.StageUncheckedCreateWithoutResourcesInput>;
    where?: Prisma.StageWhereInput;
};
export type StageUpdateToOneWithWhereWithoutResourcesInput = {
    where?: Prisma.StageWhereInput;
    data: Prisma.XOR<Prisma.StageUpdateWithoutResourcesInput, Prisma.StageUncheckedUpdateWithoutResourcesInput>;
};
export type StageUpdateWithoutResourcesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quizzes?: Prisma.QuizUpdateManyWithoutStageNestedInput;
    progress?: Prisma.UserProgressUpdateManyWithoutStageNestedInput;
};
export type StageUncheckedUpdateWithoutResourcesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quizzes?: Prisma.QuizUncheckedUpdateManyWithoutStageNestedInput;
    progress?: Prisma.UserProgressUncheckedUpdateManyWithoutStageNestedInput;
};
export type StageCreateWithoutQuizzesInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    resources?: Prisma.ResourceCreateNestedManyWithoutStageInput;
    progress?: Prisma.UserProgressCreateNestedManyWithoutStageInput;
};
export type StageUncheckedCreateWithoutQuizzesInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    resources?: Prisma.ResourceUncheckedCreateNestedManyWithoutStageInput;
    progress?: Prisma.UserProgressUncheckedCreateNestedManyWithoutStageInput;
};
export type StageCreateOrConnectWithoutQuizzesInput = {
    where: Prisma.StageWhereUniqueInput;
    create: Prisma.XOR<Prisma.StageCreateWithoutQuizzesInput, Prisma.StageUncheckedCreateWithoutQuizzesInput>;
};
export type StageUpsertWithoutQuizzesInput = {
    update: Prisma.XOR<Prisma.StageUpdateWithoutQuizzesInput, Prisma.StageUncheckedUpdateWithoutQuizzesInput>;
    create: Prisma.XOR<Prisma.StageCreateWithoutQuizzesInput, Prisma.StageUncheckedCreateWithoutQuizzesInput>;
    where?: Prisma.StageWhereInput;
};
export type StageUpdateToOneWithWhereWithoutQuizzesInput = {
    where?: Prisma.StageWhereInput;
    data: Prisma.XOR<Prisma.StageUpdateWithoutQuizzesInput, Prisma.StageUncheckedUpdateWithoutQuizzesInput>;
};
export type StageUpdateWithoutQuizzesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resources?: Prisma.ResourceUpdateManyWithoutStageNestedInput;
    progress?: Prisma.UserProgressUpdateManyWithoutStageNestedInput;
};
export type StageUncheckedUpdateWithoutQuizzesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resources?: Prisma.ResourceUncheckedUpdateManyWithoutStageNestedInput;
    progress?: Prisma.UserProgressUncheckedUpdateManyWithoutStageNestedInput;
};
export type StageCreateWithoutProgressInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    resources?: Prisma.ResourceCreateNestedManyWithoutStageInput;
    quizzes?: Prisma.QuizCreateNestedManyWithoutStageInput;
};
export type StageUncheckedCreateWithoutProgressInput = {
    id?: string;
    name: string;
    order: number;
    unlockCriteria?: string | null;
    description?: string | null;
    resources?: Prisma.ResourceUncheckedCreateNestedManyWithoutStageInput;
    quizzes?: Prisma.QuizUncheckedCreateNestedManyWithoutStageInput;
};
export type StageCreateOrConnectWithoutProgressInput = {
    where: Prisma.StageWhereUniqueInput;
    create: Prisma.XOR<Prisma.StageCreateWithoutProgressInput, Prisma.StageUncheckedCreateWithoutProgressInput>;
};
export type StageUpsertWithoutProgressInput = {
    update: Prisma.XOR<Prisma.StageUpdateWithoutProgressInput, Prisma.StageUncheckedUpdateWithoutProgressInput>;
    create: Prisma.XOR<Prisma.StageCreateWithoutProgressInput, Prisma.StageUncheckedCreateWithoutProgressInput>;
    where?: Prisma.StageWhereInput;
};
export type StageUpdateToOneWithWhereWithoutProgressInput = {
    where?: Prisma.StageWhereInput;
    data: Prisma.XOR<Prisma.StageUpdateWithoutProgressInput, Prisma.StageUncheckedUpdateWithoutProgressInput>;
};
export type StageUpdateWithoutProgressInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resources?: Prisma.ResourceUpdateManyWithoutStageNestedInput;
    quizzes?: Prisma.QuizUpdateManyWithoutStageNestedInput;
};
export type StageUncheckedUpdateWithoutProgressInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    unlockCriteria?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    resources?: Prisma.ResourceUncheckedUpdateManyWithoutStageNestedInput;
    quizzes?: Prisma.QuizUncheckedUpdateManyWithoutStageNestedInput;
};
/**
 * Count Type StageCountOutputType
 */
export type StageCountOutputType = {
    resources: number;
    quizzes: number;
    progress: number;
};
export type StageCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    resources?: boolean | StageCountOutputTypeCountResourcesArgs;
    quizzes?: boolean | StageCountOutputTypeCountQuizzesArgs;
    progress?: boolean | StageCountOutputTypeCountProgressArgs;
};
/**
 * StageCountOutputType without action
 */
export type StageCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StageCountOutputType
     */
    select?: Prisma.StageCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * StageCountOutputType without action
 */
export type StageCountOutputTypeCountResourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ResourceWhereInput;
};
/**
 * StageCountOutputType without action
 */
export type StageCountOutputTypeCountQuizzesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuizWhereInput;
};
/**
 * StageCountOutputType without action
 */
export type StageCountOutputTypeCountProgressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserProgressWhereInput;
};
export type StageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    order?: boolean;
    unlockCriteria?: boolean;
    description?: boolean;
    resources?: boolean | Prisma.Stage$resourcesArgs<ExtArgs>;
    quizzes?: boolean | Prisma.Stage$quizzesArgs<ExtArgs>;
    progress?: boolean | Prisma.Stage$progressArgs<ExtArgs>;
    _count?: boolean | Prisma.StageCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stage"]>;
export type StageSelectScalar = {
    id?: boolean;
    name?: boolean;
    order?: boolean;
    unlockCriteria?: boolean;
    description?: boolean;
};
export type StageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "order" | "unlockCriteria" | "description", ExtArgs["result"]["stage"]>;
export type StageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    resources?: boolean | Prisma.Stage$resourcesArgs<ExtArgs>;
    quizzes?: boolean | Prisma.Stage$quizzesArgs<ExtArgs>;
    progress?: boolean | Prisma.Stage$progressArgs<ExtArgs>;
    _count?: boolean | Prisma.StageCountOutputTypeDefaultArgs<ExtArgs>;
};
export type $StagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Stage";
    objects: {
        resources: Prisma.$ResourcePayload<ExtArgs>[];
        quizzes: Prisma.$QuizPayload<ExtArgs>[];
        progress: Prisma.$UserProgressPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        order: number;
        unlockCriteria: string | null;
        description: string | null;
    }, ExtArgs["result"]["stage"]>;
    composites: {};
};
export type StageGetPayload<S extends boolean | null | undefined | StageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StagePayload, S>;
export type StageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StageCountAggregateInputType | true;
};
export interface StageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Stage'];
        meta: {
            name: 'Stage';
        };
    };
    /**
     * Find zero or one Stage that matches the filter.
     * @param {StageFindUniqueArgs} args - Arguments to find a Stage
     * @example
     * // Get one Stage
     * const stage = await prisma.stage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StageFindUniqueArgs>(args: Prisma.SelectSubset<T, StageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Stage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StageFindUniqueOrThrowArgs} args - Arguments to find a Stage
     * @example
     * // Get one Stage
     * const stage = await prisma.stage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Stage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StageFindFirstArgs} args - Arguments to find a Stage
     * @example
     * // Get one Stage
     * const stage = await prisma.stage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StageFindFirstArgs>(args?: Prisma.SelectSubset<T, StageFindFirstArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Stage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StageFindFirstOrThrowArgs} args - Arguments to find a Stage
     * @example
     * // Get one Stage
     * const stage = await prisma.stage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Stages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stages
     * const stages = await prisma.stage.findMany()
     *
     * // Get first 10 Stages
     * const stages = await prisma.stage.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const stageWithIdOnly = await prisma.stage.findMany({ select: { id: true } })
     *
     */
    findMany<T extends StageFindManyArgs>(args?: Prisma.SelectSubset<T, StageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Stage.
     * @param {StageCreateArgs} args - Arguments to create a Stage.
     * @example
     * // Create one Stage
     * const Stage = await prisma.stage.create({
     *   data: {
     *     // ... data to create a Stage
     *   }
     * })
     *
     */
    create<T extends StageCreateArgs>(args: Prisma.SelectSubset<T, StageCreateArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Stages.
     * @param {StageCreateManyArgs} args - Arguments to create many Stages.
     * @example
     * // Create many Stages
     * const stage = await prisma.stage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends StageCreateManyArgs>(args?: Prisma.SelectSubset<T, StageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a Stage.
     * @param {StageDeleteArgs} args - Arguments to delete one Stage.
     * @example
     * // Delete one Stage
     * const Stage = await prisma.stage.delete({
     *   where: {
     *     // ... filter to delete one Stage
     *   }
     * })
     *
     */
    delete<T extends StageDeleteArgs>(args: Prisma.SelectSubset<T, StageDeleteArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Stage.
     * @param {StageUpdateArgs} args - Arguments to update one Stage.
     * @example
     * // Update one Stage
     * const stage = await prisma.stage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends StageUpdateArgs>(args: Prisma.SelectSubset<T, StageUpdateArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Stages.
     * @param {StageDeleteManyArgs} args - Arguments to filter Stages to delete.
     * @example
     * // Delete a few Stages
     * const { count } = await prisma.stage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends StageDeleteManyArgs>(args?: Prisma.SelectSubset<T, StageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Stages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stages
     * const stage = await prisma.stage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends StageUpdateManyArgs>(args: Prisma.SelectSubset<T, StageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one Stage.
     * @param {StageUpsertArgs} args - Arguments to update or create a Stage.
     * @example
     * // Update or create a Stage
     * const stage = await prisma.stage.upsert({
     *   create: {
     *     // ... data to create a Stage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Stage we want to update
     *   }
     * })
     */
    upsert<T extends StageUpsertArgs>(args: Prisma.SelectSubset<T, StageUpsertArgs<ExtArgs>>): Prisma.Prisma__StageClient<runtime.Types.Result.GetResult<Prisma.$StagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Stages that matches the filter.
     * @param {StageFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const stage = await prisma.stage.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: Prisma.StageFindRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Perform aggregation operations on a Stage.
     * @param {StageAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const stage = await prisma.stage.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: Prisma.StageAggregateRawArgs): Prisma.PrismaPromise<Prisma.JsonObject>;
    /**
     * Count the number of Stages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StageCountArgs} args - Arguments to filter Stages to count.
     * @example
     * // Count the number of Stages
     * const count = await prisma.stage.count({
     *   where: {
     *     // ... the filter for the Stages we want to count
     *   }
     * })
    **/
    count<T extends StageCountArgs>(args?: Prisma.Subset<T, StageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StageCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Stage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StageAggregateArgs>(args: Prisma.Subset<T, StageAggregateArgs>): Prisma.PrismaPromise<GetStageAggregateType<T>>;
    /**
     * Group by Stage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StageGroupByArgs} args - Group by arguments.
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
    groupBy<T extends StageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StageGroupByArgs['orderBy'];
    } : {
        orderBy?: StageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Stage model
     */
    readonly fields: StageFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Stage.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__StageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    resources<T extends Prisma.Stage$resourcesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stage$resourcesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    quizzes<T extends Prisma.Stage$quizzesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stage$quizzesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    progress<T extends Prisma.Stage$progressArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Stage$progressArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Stage model
 */
export interface StageFieldRefs {
    readonly id: Prisma.FieldRef<"Stage", 'String'>;
    readonly name: Prisma.FieldRef<"Stage", 'String'>;
    readonly order: Prisma.FieldRef<"Stage", 'Int'>;
    readonly unlockCriteria: Prisma.FieldRef<"Stage", 'String'>;
    readonly description: Prisma.FieldRef<"Stage", 'String'>;
}
/**
 * Stage findUnique
 */
export type StageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * Filter, which Stage to fetch.
     */
    where: Prisma.StageWhereUniqueInput;
};
/**
 * Stage findUniqueOrThrow
 */
export type StageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * Filter, which Stage to fetch.
     */
    where: Prisma.StageWhereUniqueInput;
};
/**
 * Stage findFirst
 */
export type StageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * Filter, which Stage to fetch.
     */
    where?: Prisma.StageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Stages to fetch.
     */
    orderBy?: Prisma.StageOrderByWithRelationInput | Prisma.StageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Stages.
     */
    cursor?: Prisma.StageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Stages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Stages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Stages.
     */
    distinct?: Prisma.StageScalarFieldEnum | Prisma.StageScalarFieldEnum[];
};
/**
 * Stage findFirstOrThrow
 */
export type StageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * Filter, which Stage to fetch.
     */
    where?: Prisma.StageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Stages to fetch.
     */
    orderBy?: Prisma.StageOrderByWithRelationInput | Prisma.StageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Stages.
     */
    cursor?: Prisma.StageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Stages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Stages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Stages.
     */
    distinct?: Prisma.StageScalarFieldEnum | Prisma.StageScalarFieldEnum[];
};
/**
 * Stage findMany
 */
export type StageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * Filter, which Stages to fetch.
     */
    where?: Prisma.StageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Stages to fetch.
     */
    orderBy?: Prisma.StageOrderByWithRelationInput | Prisma.StageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Stages.
     */
    cursor?: Prisma.StageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Stages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Stages.
     */
    skip?: number;
    distinct?: Prisma.StageScalarFieldEnum | Prisma.StageScalarFieldEnum[];
};
/**
 * Stage create
 */
export type StageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * The data needed to create a Stage.
     */
    data: Prisma.XOR<Prisma.StageCreateInput, Prisma.StageUncheckedCreateInput>;
};
/**
 * Stage createMany
 */
export type StageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Stages.
     */
    data: Prisma.StageCreateManyInput | Prisma.StageCreateManyInput[];
};
/**
 * Stage update
 */
export type StageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * The data needed to update a Stage.
     */
    data: Prisma.XOR<Prisma.StageUpdateInput, Prisma.StageUncheckedUpdateInput>;
    /**
     * Choose, which Stage to update.
     */
    where: Prisma.StageWhereUniqueInput;
};
/**
 * Stage updateMany
 */
export type StageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Stages.
     */
    data: Prisma.XOR<Prisma.StageUpdateManyMutationInput, Prisma.StageUncheckedUpdateManyInput>;
    /**
     * Filter which Stages to update
     */
    where?: Prisma.StageWhereInput;
    /**
     * Limit how many Stages to update.
     */
    limit?: number;
};
/**
 * Stage upsert
 */
export type StageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * The filter to search for the Stage to update in case it exists.
     */
    where: Prisma.StageWhereUniqueInput;
    /**
     * In case the Stage found by the `where` argument doesn't exist, create a new Stage with this data.
     */
    create: Prisma.XOR<Prisma.StageCreateInput, Prisma.StageUncheckedCreateInput>;
    /**
     * In case the Stage was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.StageUpdateInput, Prisma.StageUncheckedUpdateInput>;
};
/**
 * Stage delete
 */
export type StageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
    /**
     * Filter which Stage to delete.
     */
    where: Prisma.StageWhereUniqueInput;
};
/**
 * Stage deleteMany
 */
export type StageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Stages to delete
     */
    where?: Prisma.StageWhereInput;
    /**
     * Limit how many Stages to delete.
     */
    limit?: number;
};
/**
 * Stage findRaw
 */
export type StageFindRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Stage aggregateRaw
 */
export type StageAggregateRawArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Stage.resources
 */
export type Stage$resourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resource
     */
    select?: Prisma.ResourceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Resource
     */
    omit?: Prisma.ResourceOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResourceInclude<ExtArgs> | null;
    where?: Prisma.ResourceWhereInput;
    orderBy?: Prisma.ResourceOrderByWithRelationInput | Prisma.ResourceOrderByWithRelationInput[];
    cursor?: Prisma.ResourceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ResourceScalarFieldEnum | Prisma.ResourceScalarFieldEnum[];
};
/**
 * Stage.quizzes
 */
export type Stage$quizzesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: Prisma.QuizSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Quiz
     */
    omit?: Prisma.QuizOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.QuizInclude<ExtArgs> | null;
    where?: Prisma.QuizWhereInput;
    orderBy?: Prisma.QuizOrderByWithRelationInput | Prisma.QuizOrderByWithRelationInput[];
    cursor?: Prisma.QuizWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuizScalarFieldEnum | Prisma.QuizScalarFieldEnum[];
};
/**
 * Stage.progress
 */
export type Stage$progressArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Stage without action
 */
export type StageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Stage
     */
    select?: Prisma.StageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Stage
     */
    omit?: Prisma.StageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.StageInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Stage.d.ts.map