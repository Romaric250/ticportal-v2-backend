import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
    isSet?: boolean;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
    isSet?: boolean;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    isSet?: boolean;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    isSet?: boolean;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type EnumOTPTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPType | Prisma.EnumOTPTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOTPTypeFilter<$PrismaModel> | $Enums.OTPType;
};
export type EnumOTPTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPType | Prisma.EnumOTPTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOTPTypeWithAggregatesFilter<$PrismaModel> | $Enums.OTPType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOTPTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOTPTypeFilter<$PrismaModel>;
};
export type EnumSquadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadStatus | Prisma.EnumSquadStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadStatusFilter<$PrismaModel> | $Enums.SquadStatus;
};
export type EnumSquadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadStatus | Prisma.EnumSquadStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadStatusWithAggregatesFilter<$PrismaModel> | $Enums.SquadStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSquadStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSquadStatusFilter<$PrismaModel>;
};
export type EnumSquadRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadRole | Prisma.EnumSquadRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadRoleFilter<$PrismaModel> | $Enums.SquadRole;
};
export type EnumSquadRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadRole | Prisma.EnumSquadRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadRoleWithAggregatesFilter<$PrismaModel> | $Enums.SquadRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSquadRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSquadRoleFilter<$PrismaModel>;
};
export type EnumTeamRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | Prisma.EnumTeamRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTeamRoleFilter<$PrismaModel> | $Enums.TeamRole;
};
export type EnumTeamRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | Prisma.EnumTeamRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel> | $Enums.TeamRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTeamRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTeamRoleFilter<$PrismaModel>;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumResourceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | Prisma.EnumResourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumResourceTypeFilter<$PrismaModel> | $Enums.ResourceType;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
    isSet?: boolean;
};
export type EnumResourceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | Prisma.EnumResourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumResourceTypeWithAggregatesFilter<$PrismaModel> | $Enums.ResourceType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumResourceTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumResourceTypeFilter<$PrismaModel>;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    isSet?: boolean;
};
export type EnumProgressStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel> | $Enums.ProgressStatus;
};
export type EnumProgressStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProgressStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgressStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>;
};
export type EnumHackathonLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonLevel | Prisma.EnumHackathonLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonLevelFilter<$PrismaModel> | $Enums.HackathonLevel;
};
export type EnumHackathonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonStatus | Prisma.EnumHackathonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonStatusFilter<$PrismaModel> | $Enums.HackathonStatus;
};
export type EnumHackathonLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonLevel | Prisma.EnumHackathonLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonLevelWithAggregatesFilter<$PrismaModel> | $Enums.HackathonLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHackathonLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHackathonLevelFilter<$PrismaModel>;
};
export type EnumHackathonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonStatus | Prisma.EnumHackathonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonStatusWithAggregatesFilter<$PrismaModel> | $Enums.HackathonStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHackathonStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHackathonStatusFilter<$PrismaModel>;
};
export type EnumMentorRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MentorRequestStatus | Prisma.EnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMentorRequestStatusFilter<$PrismaModel> | $Enums.MentorRequestStatus;
};
export type EnumMentorRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MentorRequestStatus | Prisma.EnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMentorRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.MentorRequestStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMentorRequestStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMentorRequestStatusFilter<$PrismaModel>;
};
export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
    isSet?: boolean;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
    isSet?: boolean;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    isSet?: boolean;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
    isSet?: boolean;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    isSet?: boolean;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumOTPTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPType | Prisma.EnumOTPTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOTPTypeFilter<$PrismaModel> | $Enums.OTPType;
};
export type NestedEnumOTPTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OTPType | Prisma.EnumOTPTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OTPType[] | Prisma.ListEnumOTPTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOTPTypeWithAggregatesFilter<$PrismaModel> | $Enums.OTPType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOTPTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOTPTypeFilter<$PrismaModel>;
};
export type NestedEnumSquadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadStatus | Prisma.EnumSquadStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadStatusFilter<$PrismaModel> | $Enums.SquadStatus;
};
export type NestedEnumSquadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadStatus | Prisma.EnumSquadStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadStatus[] | Prisma.ListEnumSquadStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadStatusWithAggregatesFilter<$PrismaModel> | $Enums.SquadStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSquadStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSquadStatusFilter<$PrismaModel>;
};
export type NestedEnumSquadRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadRole | Prisma.EnumSquadRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadRoleFilter<$PrismaModel> | $Enums.SquadRole;
};
export type NestedEnumSquadRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SquadRole | Prisma.EnumSquadRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SquadRole[] | Prisma.ListEnumSquadRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSquadRoleWithAggregatesFilter<$PrismaModel> | $Enums.SquadRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSquadRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSquadRoleFilter<$PrismaModel>;
};
export type NestedEnumTeamRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | Prisma.EnumTeamRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTeamRoleFilter<$PrismaModel> | $Enums.TeamRole;
};
export type NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | Prisma.EnumTeamRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TeamRole[] | Prisma.ListEnumTeamRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel> | $Enums.TeamRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTeamRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTeamRoleFilter<$PrismaModel>;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumResourceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | Prisma.EnumResourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumResourceTypeFilter<$PrismaModel> | $Enums.ResourceType;
};
export type NestedEnumResourceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | Prisma.EnumResourceTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ResourceType[] | Prisma.ListEnumResourceTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumResourceTypeWithAggregatesFilter<$PrismaModel> | $Enums.ResourceType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumResourceTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumResourceTypeFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    isSet?: boolean;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
    isSet?: boolean;
};
export type NestedEnumProgressStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel> | $Enums.ProgressStatus;
};
export type NestedEnumProgressStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProgressStatus | Prisma.EnumProgressStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProgressStatus[] | Prisma.ListEnumProgressStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProgressStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProgressStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumProgressStatusFilter<$PrismaModel>;
};
export type NestedEnumHackathonLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonLevel | Prisma.EnumHackathonLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonLevelFilter<$PrismaModel> | $Enums.HackathonLevel;
};
export type NestedEnumHackathonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonStatus | Prisma.EnumHackathonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonStatusFilter<$PrismaModel> | $Enums.HackathonStatus;
};
export type NestedEnumHackathonLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonLevel | Prisma.EnumHackathonLevelFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonLevel[] | Prisma.ListEnumHackathonLevelFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonLevelWithAggregatesFilter<$PrismaModel> | $Enums.HackathonLevel;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHackathonLevelFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHackathonLevelFilter<$PrismaModel>;
};
export type NestedEnumHackathonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HackathonStatus | Prisma.EnumHackathonStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HackathonStatus[] | Prisma.ListEnumHackathonStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHackathonStatusWithAggregatesFilter<$PrismaModel> | $Enums.HackathonStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHackathonStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHackathonStatusFilter<$PrismaModel>;
};
export type NestedEnumMentorRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MentorRequestStatus | Prisma.EnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMentorRequestStatusFilter<$PrismaModel> | $Enums.MentorRequestStatus;
};
export type NestedEnumMentorRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MentorRequestStatus | Prisma.EnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MentorRequestStatus[] | Prisma.ListEnumMentorRequestStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMentorRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.MentorRequestStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMentorRequestStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMentorRequestStatusFilter<$PrismaModel>;
};
export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType;
};
export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | Prisma.EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.NotificationType[] | Prisma.ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumNotificationTypeFilter<$PrismaModel>;
};
//# sourceMappingURL=commonInputTypes.d.ts.map