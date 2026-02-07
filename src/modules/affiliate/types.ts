import { 
  AffiliateStatus, 
  AffiliateTier, 
  ReferralStatus,
  PaymentStatus,
  PaymentMethod,
  CommissionType,
  CommissionStatus,
  CountryStatus,
  RegionStatus,
  FraudType,
  FraudSeverity,
  FraudFlagStatus
} from "@prisma/client";

export interface CreateCountryInput {
  name: string;
  code: string;
  currency?: string;
  studentPrice?: number;
  platformFee?: number;
  affiliateCommissionRate?: number;
  regionalCommissionRate?: number;
  nationalCommissionRate?: number;
}

export interface CreateRegionInput {
  name: string;
  countryId: string;
}

export interface UpdateUserRoleInput {
  userId: string;
  newRole: string;
  regionId?: string;
  countryId?: string;
}

export interface ActivateAffiliateInput {
  affiliateId: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  mobileMoneyNumber?: string;
  mobileMoneyProvider?: string;
  reason?: string;
}

export interface ConfirmPaymentInput {
  userId: string;
  paymentReference: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentProvider?: string;
  proofUrl?: string;
  countryId: string;
}

export interface CreatePayoutBatchInput {
  minAmount?: number;
  commissionIds?: string[];
}

export interface FlagFraudInput {
  userId: string;
  type: FraudType;
  severity: FraudSeverity;
  reason: string;
  evidence?: any;
}

export interface AffiliateDashboard {
  profile: {
    referralCode: string;
    referralLink: string;
    status: AffiliateStatus;
    tier: AffiliateTier;
    region: string;
  };
  stats: {
    totalReferrals: number;
    activeReferrals: number;
    pendingActivation: number;
    conversionRate: number;
  };
  earnings: {
    pending: number;
    earned: number;
    approved: number;
    paid: number;
    total: number;
  };
  recentReferrals: Array<{
    id: string;
    studentName: string;
    registeredAt: Date;
    status: ReferralStatus;
    commissionAmount: number;
  }>;
}

export interface RegionalDashboard {
  region: {
    id: string;
    name: string;
    country: string;
  };
  stats: {
    totalAffiliates: number;
    activeAffiliates: number;
    totalStudents: number;
    activeStudents: number;
    conversionRate: number;
  };
  earnings: {
    pending: number;
    earned: number;
    approved: number;
    paid: number;
  };
  topAffiliates: Array<{
    id: string;
    name: string;
    referralCount: number;
    conversionRate: number;
    totalEarned: number;
  }>;
}

export interface NationalDashboard {
  country: {
    id: string;
    name: string;
    code: string;
  };
  stats: {
    totalRegions: number;
    totalAffiliates: number;
    totalStudents: number;
    activeStudents: number;
  };
  earnings: {
    pending: number;
    earned: number;
    approved: number;
    paid: number;
  };
  regions: Array<{
    id: string;
    name: string;
    studentCount: number;
    affiliateCount: number;
    conversionRate: number;
    totalCommissions: number;
  }>;
}

export interface AdminCommissionOverview {
  summary: {
    totalCommissionsOwed: number;
    pendingApprovals: number;
    totalPaid: number;
    fraudFlags: number;
  };
  breakdown: {
    affiliate: number;
    regional: number;
    national: number;
  };
  recentCommissions: Array<{
    id: string;
    userId: string;
    userName: string;
    type: CommissionType;
    amount: number;
    status: CommissionStatus;
    createdAt: Date;
  }>;
  pendingPayouts: {
    count: number;
    totalAmount: number;
  };
}

export interface ReferralCodeValidation {
  valid: boolean;
  affiliateId?: string;
  affiliateName?: string;
  regionId?: string;
  regionName?: string;
  message?: string;
}
