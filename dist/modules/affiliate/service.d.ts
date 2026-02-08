import type { CreateCountryInput, CreateRegionInput, UpdateUserRoleInput, ActivateAffiliateInput, AffiliateDashboard, ReferralCodeValidation } from "./types";
import { AffiliateStatus, AffiliateSubRole, AffiliateTier } from "@prisma/client";
export declare class AffiliateService {
    static createCountry(input: CreateCountryInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        status: import(".prisma/client").$Enums.CountryStatus;
        updatedAt: Date;
        platformFee: number;
        code: string;
        studentPrice: number;
        affiliateCommissionRate: number;
        regionalCommissionRate: number;
        nationalCommissionRate: number;
    }>;
    static createRegion(input: CreateRegionInput): Promise<{
        country: {
            id: string;
            createdAt: Date;
            name: string;
            currency: string;
            status: import(".prisma/client").$Enums.CountryStatus;
            updatedAt: Date;
            platformFee: number;
            code: string;
            studentPrice: number;
            affiliateCommissionRate: number;
            regionalCommissionRate: number;
            nationalCommissionRate: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.RegionStatus;
        updatedAt: Date;
        countryId: string;
    }>;
    /**
     * Admin: Update a country
     */
    static updateCountry(countryId: string, input: Partial<CreateCountryInput>): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        status: import(".prisma/client").$Enums.CountryStatus;
        updatedAt: Date;
        platformFee: number;
        code: string;
        studentPrice: number;
        affiliateCommissionRate: number;
        regionalCommissionRate: number;
        nationalCommissionRate: number;
    }>;
    /**
     * Admin: Delete a country (cascades to regions)
     */
    static deleteCountry(countryId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Admin: Update a region
     */
    static updateRegion(regionId: string, input: Partial<CreateRegionInput>): Promise<{
        country: {
            id: string;
            createdAt: Date;
            name: string;
            currency: string;
            status: import(".prisma/client").$Enums.CountryStatus;
            updatedAt: Date;
            platformFee: number;
            code: string;
            studentPrice: number;
            affiliateCommissionRate: number;
            regionalCommissionRate: number;
            nationalCommissionRate: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.RegionStatus;
        updatedAt: Date;
        countryId: string;
    }>;
    /**
     * Admin: Delete a region
     */
    static deleteRegion(regionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    static updateUserRole(adminId: string, input: UpdateUserRoleInput): Promise<{
        success: boolean;
        oldRole: import(".prisma/client").$Enums.UserRole;
        newRole: string;
    }>;
    static activateAffiliate(adminId: string, input: ActivateAffiliateInput): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AffiliateStatus;
        updatedAt: Date;
        countryId: string | null;
        regionId: string | null;
        referralCode: string;
        activatedAt: Date | null;
        subRole: import(".prisma/client").$Enums.AffiliateSubRole;
        referralLink: string;
        tier: import(".prisma/client").$Enums.AffiliateTier;
        activatedBy: string | null;
        assignedAt: Date | null;
        assignedBy: string | null;
        suspendedAt: Date | null;
        suspendedReason: string | null;
        terminatedAt: Date | null;
        terminatedReason: string | null;
        totalReferrals: number;
        activeReferrals: number;
        totalStudents: number;
        totalEarned: number;
        totalPaid: number;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        mobileMoneyNumber: string | null;
        mobileMoneyProvider: string | null;
    }>;
    static validateReferralCode(code: string): Promise<ReferralCodeValidation>;
    static getAffiliateDashboard(userId: string): Promise<AffiliateDashboard>;
    private static generateReferralCode;
    /**
     * Get referrals for a user (affiliate/coordinator)
     */
    static getReferrals(userId: string, status?: string, page?: number, limit?: number): Promise<{
        referrals: ({
            payment: {
                id: string;
                amount: number;
                status: import(".prisma/client").$Enums.PaymentStatus;
                verifiedAt: Date | null;
            } | null;
            student: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                phone: string | null;
            };
            affiliate: ({
                user: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                userId: string;
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.AffiliateStatus;
                updatedAt: Date;
                countryId: string | null;
                regionId: string | null;
                referralCode: string;
                activatedAt: Date | null;
                subRole: import(".prisma/client").$Enums.AffiliateSubRole;
                referralLink: string;
                tier: import(".prisma/client").$Enums.AffiliateTier;
                activatedBy: string | null;
                assignedAt: Date | null;
                assignedBy: string | null;
                suspendedAt: Date | null;
                suspendedReason: string | null;
                terminatedAt: Date | null;
                terminatedReason: string | null;
                totalReferrals: number;
                activeReferrals: number;
                totalStudents: number;
                totalEarned: number;
                totalPaid: number;
                bankName: string | null;
                accountNumber: string | null;
                accountName: string | null;
                mobileMoneyNumber: string | null;
                mobileMoneyProvider: string | null;
            }) | null;
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ReferralStatus;
            updatedAt: Date;
            countryId: string;
            paymentId: string | null;
            studentId: string;
            referrerId: string | null;
            affiliateId: string | null;
            regionId: string;
            referralCode: string | null;
            registeredAt: Date;
            activatedAt: Date | null;
            firstActionAt: Date | null;
            firstActionType: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    /**
     * Get commissions for a user
     */
    static getCommissions(userId: string, status?: string, type?: string, page?: number, limit?: number): Promise<{
        commissions: ({
            affiliateProfile: ({
                user: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                userId: string;
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.AffiliateStatus;
                updatedAt: Date;
                countryId: string | null;
                regionId: string | null;
                referralCode: string;
                activatedAt: Date | null;
                subRole: import(".prisma/client").$Enums.AffiliateSubRole;
                referralLink: string;
                tier: import(".prisma/client").$Enums.AffiliateTier;
                activatedBy: string | null;
                assignedAt: Date | null;
                assignedBy: string | null;
                suspendedAt: Date | null;
                suspendedReason: string | null;
                terminatedAt: Date | null;
                terminatedReason: string | null;
                totalReferrals: number;
                activeReferrals: number;
                totalStudents: number;
                totalEarned: number;
                totalPaid: number;
                bankName: string | null;
                accountNumber: string | null;
                accountName: string | null;
                mobileMoneyNumber: string | null;
                mobileMoneyProvider: string | null;
            }) | null;
            referral: {
                student: {
                    email: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.ReferralStatus;
                updatedAt: Date;
                countryId: string;
                paymentId: string | null;
                studentId: string;
                referrerId: string | null;
                affiliateId: string | null;
                regionId: string;
                referralCode: string | null;
                registeredAt: Date;
                activatedAt: Date | null;
                firstActionAt: Date | null;
                firstActionType: string | null;
            };
            payoutBatch: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.PayoutBatchStatus;
                batchNumber: string;
                totalAmount: number;
                commissionCount: number;
                createdBy: string;
                processedBy: string | null;
                exportUrl: string | null;
                notes: string | null;
                processedAt: Date | null;
            } | null;
        } & {
            userId: string;
            id: string;
            type: import(".prisma/client").$Enums.CommissionType;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CommissionStatus;
            updatedAt: Date;
            referralId: string;
            baseAmount: number;
            percentage: number;
            commissionAmount: number;
            earnedAt: Date | null;
            coolingPeriodEnds: Date | null;
            approvedAt: Date | null;
            approvedBy: string | null;
            paidAt: Date | null;
            revokedAt: Date | null;
            revokedReason: string | null;
            payoutBatchId: string | null;
            affiliateProfileId: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    /**
     * Get Regional Coordinator Dashboard
     */
    static getRegionalCoordinatorDashboard(userId: string): Promise<{
        profile: {
            region: string;
            status: import(".prisma/client").$Enums.AffiliateStatus;
            totalAffiliates: number;
            activeAffiliates: number;
        };
        stats: {
            totalReferrals: number;
            activeReferrals: number;
            conversionRate: number;
        };
        earnings: any;
        affiliates: {
            id: any;
            name: string;
            email: any;
            status: any;
            referralCode: any;
            totalReferrals: any;
        }[];
    }>;
    /**
     * Get National Coordinator Dashboard
     */
    static getNationalCoordinatorDashboard(userId: string): Promise<{
        profile: {
            country: string;
            status: import(".prisma/client").$Enums.AffiliateStatus;
            totalRegions: number;
            totalAffiliates: number;
            activeAffiliates: number;
            totalRegionalCoordinators: number;
        };
        stats: {
            totalReferrals: number;
            activeReferrals: number;
            conversionRate: number;
        };
        earnings: any;
        regions: {
            id: any;
            name: any;
            affiliatesCount: any;
            activeAffiliatesCount: any;
            coordinatorsCount: any;
        }[];
    }>;
    /**
     * Get all countries
     */
    static getCountries(): Promise<{
        _count: {
            affiliates: number;
            regionalCoordinators: number;
            nationalCoordinators: number;
        };
        regions: {
            id: string;
            createdAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.RegionStatus;
            updatedAt: Date;
            countryId: string;
        }[];
        id: string;
        createdAt: Date;
        name: string;
        currency: string;
        status: import(".prisma/client").$Enums.CountryStatus;
        updatedAt: Date;
        platformFee: number;
        code: string;
        studentPrice: number;
        affiliateCommissionRate: number;
        regionalCommissionRate: number;
        nationalCommissionRate: number;
    }[]>;
    /**
     * Get regions by country
     */
    static getRegionsByCountry(countryId: string): Promise<{
        _count: {
            affiliates: number;
            regionalCoordinators: number;
        };
        country: {
            id: string;
            createdAt: Date;
            name: string;
            currency: string;
            status: import(".prisma/client").$Enums.CountryStatus;
            updatedAt: Date;
            platformFee: number;
            code: string;
            studentPrice: number;
            affiliateCommissionRate: number;
            regionalCommissionRate: number;
            nationalCommissionRate: number;
        };
        id: string;
        createdAt: Date;
        name: string;
        status: import(".prisma/client").$Enums.RegionStatus;
        updatedAt: Date;
        countryId: string;
    }[]>;
    /**
     * Get affiliate profile for authenticated user
     */
    static getAffiliateProfile(userId: string): Promise<{
        id: string;
        userId: string;
        subRole: import(".prisma/client").$Enums.AffiliateSubRole;
        referralCode: string;
        referralLink: string;
        status: import(".prisma/client").$Enums.AffiliateStatus;
        tier: "STANDARD";
        commissionRate: number | null;
        region: {
            id: string;
            name: string;
            country: {
                id: string;
                name: string;
                code: string;
            };
        } | null;
        country: {
            id: string;
            name: string;
            code: string;
        } | null;
        totalReferrals: number;
        activeReferrals: number;
        totalStudents: number;
        totalEarned: number;
        totalPaid: number;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        mobileMoneyNumber: string | null;
        mobileMoneyProvider: string | null;
        activatedAt: Date | null;
        assignedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Create affiliate profile manually
     */
    static createAffiliateProfile(userId: string, regionId: string, subRole?: AffiliateSubRole, additionalData?: {
        countryId?: string;
        status?: AffiliateStatus;
        tier?: AffiliateTier;
        bankName?: string;
        accountNumber?: string;
        accountName?: string;
        mobileMoneyNumber?: string;
        mobileMoneyProvider?: string;
    }): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
        region: ({
            country: {
                id: string;
                createdAt: Date;
                name: string;
                currency: string;
                status: import(".prisma/client").$Enums.CountryStatus;
                updatedAt: Date;
                platformFee: number;
                code: string;
                studentPrice: number;
                affiliateCommissionRate: number;
                regionalCommissionRate: number;
                nationalCommissionRate: number;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.RegionStatus;
            updatedAt: Date;
            countryId: string;
        }) | null;
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AffiliateStatus;
        updatedAt: Date;
        countryId: string | null;
        regionId: string | null;
        referralCode: string;
        activatedAt: Date | null;
        subRole: import(".prisma/client").$Enums.AffiliateSubRole;
        referralLink: string;
        tier: import(".prisma/client").$Enums.AffiliateTier;
        activatedBy: string | null;
        assignedAt: Date | null;
        assignedBy: string | null;
        suspendedAt: Date | null;
        suspendedReason: string | null;
        terminatedAt: Date | null;
        terminatedReason: string | null;
        totalReferrals: number;
        activeReferrals: number;
        totalStudents: number;
        totalEarned: number;
        totalPaid: number;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        mobileMoneyNumber: string | null;
        mobileMoneyProvider: string | null;
    }>;
    /**
     * Regenerate referral code for an affiliate
     */
    static regenerateReferralCode(userId: string): Promise<{
        oldReferralCode: string;
        newReferralCode: string;
        newReferralLink: string;
    }>;
    /**
     * Admin: List all affiliates with pagination and filters
     */
    static listAffiliates(params: {
        page?: number;
        limit?: number;
        status?: AffiliateStatus;
        search?: string;
        regionId?: string;
        countryId?: string;
    }): Promise<{
        affiliates: {
            totalEarned: number;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            region: ({
                country: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    currency: string;
                    status: import(".prisma/client").$Enums.CountryStatus;
                    updatedAt: Date;
                    platformFee: number;
                    code: string;
                    studentPrice: number;
                    affiliateCommissionRate: number;
                    regionalCommissionRate: number;
                    nationalCommissionRate: number;
                };
            } & {
                id: string;
                createdAt: Date;
                name: string;
                status: import(".prisma/client").$Enums.RegionStatus;
                updatedAt: Date;
                countryId: string;
            }) | null;
            userId: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.AffiliateStatus;
            updatedAt: Date;
            countryId: string | null;
            regionId: string | null;
            referralCode: string;
            activatedAt: Date | null;
            subRole: import(".prisma/client").$Enums.AffiliateSubRole;
            referralLink: string;
            tier: import(".prisma/client").$Enums.AffiliateTier;
            activatedBy: string | null;
            assignedAt: Date | null;
            assignedBy: string | null;
            suspendedAt: Date | null;
            suspendedReason: string | null;
            terminatedAt: Date | null;
            terminatedReason: string | null;
            totalReferrals: number;
            activeReferrals: number;
            totalStudents: number;
            totalPaid: number;
            bankName: string | null;
            accountNumber: string | null;
            accountName: string | null;
            mobileMoneyNumber: string | null;
            mobileMoneyProvider: string | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    /**
     * Admin: Suspend an affiliate
     */
    static suspendAffiliate(affiliateId: string, reason?: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            username: string | null;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            firstName: string;
            lastName: string;
            bio: string | null;
            phone: string | null;
            profilePhoto: string | null;
            school: string | null;
            grade: string | null;
            country: string | null;
            region: string | null;
            gradDate: Date | null;
            isVerified: boolean;
            lastLogin: Date | null;
            squadId: string | null;
            updatedAt: Date;
        };
        region: ({
            country: {
                id: string;
                createdAt: Date;
                name: string;
                currency: string;
                status: import(".prisma/client").$Enums.CountryStatus;
                updatedAt: Date;
                platformFee: number;
                code: string;
                studentPrice: number;
                affiliateCommissionRate: number;
                regionalCommissionRate: number;
                nationalCommissionRate: number;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.RegionStatus;
            updatedAt: Date;
            countryId: string;
        }) | null;
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AffiliateStatus;
        updatedAt: Date;
        countryId: string | null;
        regionId: string | null;
        referralCode: string;
        activatedAt: Date | null;
        subRole: import(".prisma/client").$Enums.AffiliateSubRole;
        referralLink: string;
        tier: import(".prisma/client").$Enums.AffiliateTier;
        activatedBy: string | null;
        assignedAt: Date | null;
        assignedBy: string | null;
        suspendedAt: Date | null;
        suspendedReason: string | null;
        terminatedAt: Date | null;
        terminatedReason: string | null;
        totalReferrals: number;
        activeReferrals: number;
        totalStudents: number;
        totalEarned: number;
        totalPaid: number;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        mobileMoneyNumber: string | null;
        mobileMoneyProvider: string | null;
    }>;
    /**
     * Admin: Terminate an affiliate
     */
    static terminateAffiliate(affiliateId: string, reason?: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            username: string | null;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            firstName: string;
            lastName: string;
            bio: string | null;
            phone: string | null;
            profilePhoto: string | null;
            school: string | null;
            grade: string | null;
            country: string | null;
            region: string | null;
            gradDate: Date | null;
            isVerified: boolean;
            lastLogin: Date | null;
            squadId: string | null;
            updatedAt: Date;
        };
        region: ({
            country: {
                id: string;
                createdAt: Date;
                name: string;
                currency: string;
                status: import(".prisma/client").$Enums.CountryStatus;
                updatedAt: Date;
                platformFee: number;
                code: string;
                studentPrice: number;
                affiliateCommissionRate: number;
                regionalCommissionRate: number;
                nationalCommissionRate: number;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.RegionStatus;
            updatedAt: Date;
            countryId: string;
        }) | null;
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AffiliateStatus;
        updatedAt: Date;
        countryId: string | null;
        regionId: string | null;
        referralCode: string;
        activatedAt: Date | null;
        subRole: import(".prisma/client").$Enums.AffiliateSubRole;
        referralLink: string;
        tier: import(".prisma/client").$Enums.AffiliateTier;
        activatedBy: string | null;
        assignedAt: Date | null;
        assignedBy: string | null;
        suspendedAt: Date | null;
        suspendedReason: string | null;
        terminatedAt: Date | null;
        terminatedReason: string | null;
        totalReferrals: number;
        activeReferrals: number;
        totalStudents: number;
        totalEarned: number;
        totalPaid: number;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        mobileMoneyNumber: string | null;
        mobileMoneyProvider: string | null;
    }>;
    /**
     * Admin: Delete an affiliate profile
     */
    static deleteAffiliate(affiliateId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Admin: Unsuspend an affiliate
     */
    static unsuspendAffiliate(affiliateId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            username: string | null;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            firstName: string;
            lastName: string;
            bio: string | null;
            phone: string | null;
            profilePhoto: string | null;
            school: string | null;
            grade: string | null;
            country: string | null;
            region: string | null;
            gradDate: Date | null;
            isVerified: boolean;
            lastLogin: Date | null;
            squadId: string | null;
            updatedAt: Date;
        };
        region: ({
            country: {
                id: string;
                createdAt: Date;
                name: string;
                currency: string;
                status: import(".prisma/client").$Enums.CountryStatus;
                updatedAt: Date;
                platformFee: number;
                code: string;
                studentPrice: number;
                affiliateCommissionRate: number;
                regionalCommissionRate: number;
                nationalCommissionRate: number;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.RegionStatus;
            updatedAt: Date;
            countryId: string;
        }) | null;
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AffiliateStatus;
        updatedAt: Date;
        countryId: string | null;
        regionId: string | null;
        referralCode: string;
        activatedAt: Date | null;
        subRole: import(".prisma/client").$Enums.AffiliateSubRole;
        referralLink: string;
        tier: import(".prisma/client").$Enums.AffiliateTier;
        activatedBy: string | null;
        assignedAt: Date | null;
        assignedBy: string | null;
        suspendedAt: Date | null;
        suspendedReason: string | null;
        terminatedAt: Date | null;
        terminatedReason: string | null;
        totalReferrals: number;
        activeReferrals: number;
        totalStudents: number;
        totalEarned: number;
        totalPaid: number;
        bankName: string | null;
        accountNumber: string | null;
        accountName: string | null;
        mobileMoneyNumber: string | null;
        mobileMoneyProvider: string | null;
    }>;
    /**
     * Admin: Get financial overview
     */
    static getFinancialOverview(): Promise<{
        totalRevenue: number;
        commissionsOwed: number;
        commissionsPaid: number;
        ticNetFees: number;
    }>;
    /**
     * Admin: Get system ledger with pagination
     */
    static getSystemLedger(params: {
        page?: number;
        limit?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        entries: {
            id: string;
            transactionId: string;
            student: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            payment: {
                id: string;
                amount: number;
                status: import(".prisma/client").$Enums.PaymentStatus;
                verifiedAt: Date;
            };
            referral: {
                id: string;
                referralCode: string | null;
            } | null;
            affiliateCommission: number;
            regionalCommission: number;
            nationalCommission: number;
            ticNet: number;
            status: string;
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    /**
     * Admin: Get payout batches
     */
    static getPayoutBatches(params: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        payouts: {
            id: string;
            batchNumber: string;
            affiliateId: string | null;
            affiliateCode: string | null;
            affiliateName: string | null;
            affiliateEmail: string | null;
            totalAmount: number;
            commissionCount: number;
            status: import(".prisma/client").$Enums.PayoutBatchStatus;
            createdBy: string;
            processedBy: string | null;
            exportUrl: string | null;
            notes: string | null;
            createdAt: Date;
            processedAt: Date | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    /**
     * Admin: Get fraud flags
     */
    static getFraudFlags(params: {
        page?: number;
        limit?: number;
        severity?: string;
        resolved?: boolean;
        type?: string;
    }): Promise<{
        flags: {
            id: string;
            userId: string;
            type: import(".prisma/client").$Enums.FraudType;
            severity: import(".prisma/client").$Enums.FraudSeverity;
            title: import(".prisma/client").$Enums.FraudType;
            description: string;
            reason: string;
            evidence: import("@prisma/client/runtime/library").JsonValue;
            status: import(".prisma/client").$Enums.FraudFlagStatus;
            affiliateId: string | null;
            affiliateCode: string | null;
            affiliateName: string | null;
            referralId: null;
            transactionId: null;
            flaggedBy: string | null;
            flaggedAt: Date;
            resolvedBy: string | null;
            resolvedAt: Date | null;
            resolution: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    /**
     * Admin: Get commission tier configuration
     */
    static getCommissionTiers(): Promise<string | number | true | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray>;
    /**
     * Admin: Update commission tier configuration
     * Only STANDARD tier is supported
     */
    static updateCommissionTiers(data: {
        affiliateRate: number;
        regionalRate: number;
        nationalRate: number;
    }, updatedBy: string): Promise<{
        affiliateRate: number;
        regionalRate: number;
        nationalRate: number;
    }>;
}
//# sourceMappingURL=service.d.ts.map