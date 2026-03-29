import { Prisma } from "@prisma/client";
import { type SectionScoreInput } from "./scoring";
/** Used for Teams tab sort: prioritize teams that submitted all required deliverables (e.g. 7). */
export declare const DELIVERABLES_COMPLETE_TARGET = 7;
export declare function getGradingSettings(): Promise<{
    id: string;
    updatedAt: Date;
    leaderboardScorePercent: number;
    leaderboardPointsMax: number;
    maxTeamsPerReviewer: number | null;
}>;
/**
 * Remove a reviewer (draft only), or swap them for someone else while keeping the other reviewer's scores.
 * With `replacementReviewerId`, calls {@link setTeamReviewerPair} — the other reviewer's Grade rows are only updated for pair metadata / upsert, not their scores.
 */
export declare function unassignReviewer(teamId: string, reviewerId: string, options?: {
    replacementReviewerId?: string | null;
    assignedBy?: string;
    sendMail?: boolean;
}): Promise<{
    teamId: string;
    reviewerIds: string[];
} | {
    teamId: string;
    reviewerId: string;
}>;
export declare function getActiveRubric(): Promise<{
    id: string;
    createdAt: Date;
    name: string;
    updatedAt: Date;
    description: string | null;
    isActive: boolean;
    sections: Prisma.JsonValue;
    maxScore: number;
} | null>;
export declare function upsertActiveRubric(data: {
    name: string;
    description?: string | null;
    sections: unknown;
    maxScore?: number;
    rubricId?: string | null;
}): Promise<{
    id: string;
    createdAt: Date;
    name: string;
    updatedAt: Date;
    description: string | null;
    isActive: boolean;
    sections: Prisma.JsonValue;
    maxScore: number;
}>;
export declare function setReviewerFlag(userId: string, isReviewer: boolean): Promise<{
    id: string;
    email: string;
    firstName: string;
    isReviewer: boolean;
}>;
export declare function listReviewers(): Promise<{
    id: string;
    email: string;
    role: import(".prisma/client").$Enums.UserRole;
    firstName: string;
    lastName: string;
    school: string | null;
    region: string | null;
    isReviewer: boolean;
}[]>;
export declare function reviewerWorkload(): Promise<{
    assignedCount: number;
    pendingInProgress: number;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}[]>;
/** Teams with assignments where grading is not fully done or no final row (lean select). */
export declare function getPendingGradesTeams(): Promise<{
    teamId: string;
    teamName: string;
    projectTitle: string | null;
    assignmentCount: number;
    gradeCount: number;
    submittedCount: number;
    hasFinal: boolean;
    status: string;
    score1: number | null;
    score2: number | null;
    score3: number | null;
    canFinalize: boolean;
}[]>;
export declare function createAssignmentsForTeam(teamId: string, reviewerIds: string[], assignedBy: string, sendMail: boolean): Promise<{
    teamId: string;
    reviewerIds: string[];
}>;
/**
 * Sets exactly two reviewers for a team: removes previous reviewers not in the new pair when allowed
 * (draft only), then upserts the pair. Use this for manual assign and reviewer swaps.
 */
export declare function setTeamReviewerPair(teamId: string, reviewerIds: string[], assignedBy: string, sendMail: boolean): Promise<{
    teamId: string;
    reviewerIds: string[];
}>;
export declare function autoAssignReviewers(options?: {
    excludeReviewerIds?: string[];
    teamIds?: string[];
    assignedBy?: string;
    sendMail?: boolean;
    /** Skip reviewers whose region matches the team lead region (reduces same-region bias). */
    excludeReviewersSameRegionAsTeam?: boolean;
}): Promise<{
    assigned: number;
    teams: {
        teamId: string;
        reviewerIds: string[];
    }[];
    skipped: {
        teamId: string;
        reason: string;
    }[];
    errors: {
        teamId: string;
        teamName: string | null;
        message: string;
    }[];
}>;
export declare function manualAssign(pairs: {
    teamId: string;
    reviewerIds: string[];
}[], assignedBy: string, sendMail?: boolean): Promise<{
    assigned: number;
    teams: {
        teamId: string;
        reviewerIds: string[];
    }[];
}>;
/** Assign the same N reviewers to many teams (e.g. after filtering by region). */
export declare function bulkAssignReviewersToTeams(teamIds: string[], reviewerIds: string[], assignedBy: string, sendMail: boolean, options?: {
    rejectReviewersFromTeamRegion?: boolean;
}): Promise<{
    assigned: number;
    teams: {
        teamId: string;
        reviewerIds: string[];
    }[];
    errors: {
        teamId: string;
        message: string;
    }[];
}>;
/** Current reviewer assignments for one team (manual assign pre-fill: 0, 1, or 2 reviewers). */
export declare function getTeamReviewerAssignments(teamId: string): Promise<{
    reviewerId: string;
    firstName: string;
    lastName: string;
    email: string;
}[]>;
export declare function listAllAssignments(): Promise<{
    id: string;
    grade: {
        status: import(".prisma/client").$Enums.GradeStatus;
        submittedAt: Date | null;
    } | null;
    team: {
        id: string;
        name: string;
        projectTitle: string | null;
        teamFinalGrade: {
            id: string;
        } | null;
    };
    teamId: string;
    assignedAt: Date;
    reviewerId: string;
    reviewer: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    assigner: {
        id: string;
        firstName: string;
        lastName: string;
    };
}[]>;
export declare function getAssignmentsForReviewer(reviewerId: string): Promise<({
    team: {
        id: string;
        name: string;
        profileImage: string | null;
        projectTitle: string | null;
        description: string | null;
    };
} & {
    id: string;
    teamId: string;
    assignedAt: Date;
    assignedBy: string;
    reviewerId: string;
})[]>;
export declare function submitGrade(teamId: string, reviewerId: string, body: {
    sectionScores: Record<string, SectionScoreInput>;
    feedback?: string | null;
}): Promise<{
    id: string;
    status: import(".prisma/client").$Enums.GradeStatus;
    teamId: string;
    submittedAt: Date | null;
    rubricId: string;
    reviewedAt: Date | null;
    reviewerId: string;
    sectionScores: Prisma.JsonValue;
    totalScore: number;
    feedback: string | null;
    isFirstReview: boolean;
    pairedReviewerUserId: string | null;
}>;
export declare function getTeamReviews(teamId: string, viewerUserId: string, isAdmin: boolean): Promise<{
    id: string;
    reviewer: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    status: import(".prisma/client").$Enums.GradeStatus;
    totalScore: number;
    sectionScores: Prisma.JsonValue;
    feedback: string | null;
    submittedAt: Date | null;
}[] | {
    mine: {
        id: string;
        status: import(".prisma/client").$Enums.GradeStatus;
        totalScore: number;
        sectionScores: Prisma.JsonValue;
        feedback: string | null;
        submittedAt: Date | null;
    } | null;
    others: {
        reviewerName: string;
        submitted: boolean;
        scoresHidden: boolean;
    }[];
    /** Until this reviewer submits, peer progress is hidden (blind review). */
    peersHiddenUntilYouSubmit: boolean;
}>;
export declare function teamLeaderboardPoints(teamId: string): Promise<number>;
export declare function normalizeTeamLeaderboardScores(): Promise<Map<string, number>>;
/**
 * Normalized 0–100 leaderboard contribution for one team only.
 * When cap &gt; 0 (default): uses a single aggregate over that team's members — does NOT scan all teams/points.
 * When cap === 0 (legacy relative mode): falls back to full {@link normalizeTeamLeaderboardScores}.
 */
export declare function getNormalizedLeaderboardScoreForTeam(teamId: string): Promise<number>;
export declare function finalizeTeamGrade(teamId: string): Promise<{
    reviewerAverageScore: number;
    leaderboardScoreNormalized: number;
    leaderboardWeightPercent: number;
    finalScore: number;
    scoreDifferenceWarning: string | null;
}>;
export declare function setLeaderboardConfig(params: {
    leaderboardScorePercent?: number;
    leaderboardPointsMax?: number;
    maxTeamsPerReviewer?: number | null;
}): Promise<{
    id: string;
    updatedAt: Date;
    leaderboardScorePercent: number;
    leaderboardPointsMax: number;
    maxTeamsPerReviewer: number | null;
}>;
export type LeaderboardTeamsPageResult = {
    teams: Array<{
        rank: number;
        teamId: string;
        teamName: string;
        rawLeaderboardPoints: number;
        /** Normalized leaderboard contribution 0–100 (the % used in the blend). */
        normalizedLeaderboard: number;
        leaderboardPointsMax: number;
        leaderboardWeightPercent: number;
        /** First reviewer total score (stable order by reviewerId), null if not submitted yet. */
        score1: number | null;
        /** Second reviewer total score, null if not submitted yet. */
        score2: number | null;
        /** Third reviewer total score (stable order by reviewerId), null if not submitted yet. */
        score3: number | null;
        /** Team region (lead member, else first member). */
        region: string | null;
        /** Average of completed reviewer scores (same basis as finalize). */
        reviewerAverageScore: number | null;
        /** Points toward final 0–100 from reviewers: avg × (100 − leaderboardWeightPercent)%. */
        reviewerContributionPoints: number | null;
        /** Points toward final 0–100 from leaderboard: normalizedLeaderboard × leaderboardWeightPercent%. */
        leaderboardContributionPoints: number;
        /**
         * Blended score 0–100: stored final when finalized, else live preview from reviewer avg + LB using current settings.
         * Best case max is 100 when both reviewer average and normalized LB are 100.
         */
        blendFinal: number | null;
        finalGrade: {
            finalScore: number;
            reviewerAverageScore: number;
            leaderboardScoreNormalized: number;
            leaderboardWeightPercent: number;
            publishedAt: Date | null;
        } | null;
    }>;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
};
/**
 * Full live ranking (blend-based). Used by admin reports and paginated leaderboard API.
 * @param opts.region When set, only teams whose lead (or member) region matches (case-insensitive) are ranked.
 */
export declare function getRankedLeaderboardTeamsFull(opts?: {
    region?: string | null;
}): Promise<LeaderboardTeamsPageResult["teams"]>;
/**
 * Paginated admin leaderboard: global rank by blend score (finalized score when present, else live preview).
 * Preview = reviewerAverage × (1 − w) + normalizedLeaderboard × w, capped at 100.
 */
export declare function getLeaderboardTeamsReport(params?: {
    page?: number;
    limit?: number;
    region?: string | null;
}): Promise<LeaderboardTeamsPageResult>;
export declare function finalizeTeamGradesBulk(teamIds: string[]): Promise<{
    succeeded: string[];
    failed: {
        teamId: string;
        message: string;
    }[];
}>;
export declare function applyLeaderboardToFinal(teamId?: string): Promise<{
    updatedCount: number;
    teamIds: string[];
}>;
export declare function publishTeamFinal(teamId: string): Promise<{
    teamId: string;
    published: boolean;
}>;
export declare function getReviewerDashboard(userId: string): Promise<{
    reviewer: {
        id: string;
        name: string;
        email: string;
    };
    assignedTeams: {
        teamId: string;
        teamName: string;
        projectTitle: string | null;
        deliverables: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            content: string;
            submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
            templateTitle: string;
        }[];
        grade: {
            id: string;
            status: import(".prisma/client").$Enums.GradeStatus;
            sectionScores: Prisma.JsonValue;
            totalScore: number;
            feedback: string | null;
        } | null;
        /** @deprecated Use otherReviewers; kept for older clients (first peer when you have submitted). */
        pairedReviewer: {
            name: string;
            submitted: boolean;
        } | null;
        otherReviewers: {
            name: string;
            submitted: boolean;
        }[];
    }[];
    stats: {
        totalAssigned: number;
        completed: number;
        pending: number;
    };
}>;
/** Lean leaderboard payload — single query with explicit selects (fast vs. full include graph). */
export declare function getGradingReports(region?: string | null): Promise<{
    teams: {
        teamId: string;
        teamName: string;
        school: string;
        region: string | null;
        projectTitle: string | null;
        assignmentCount: number;
        finalScore: number | null;
        reviewerAverageScore: number | null;
        publishedAt: string | null;
        rank: number;
        score1: number | null;
        score2: number | null;
        score3: number | null;
        blendFinal: number | null;
        normalizedLeaderboard: number;
        rawLeaderboardPoints: number;
        leaderboardWeightPercent: number;
        reviewerContributionPoints: number | null;
        leaderboardContributionPoints: number;
        reviewers: {
            reviewerId: string;
            reviewerName: string;
            email: string;
            totalScore: number;
            status: import(".prisma/client").$Enums.GradeStatus;
            feedback: string | null;
        }[];
    }[];
    generatedAt: string;
}>;
export declare function getGradingReportTeamDetail(teamId: string): Promise<{
    teamId: string;
    teamName: string;
    teamSchool: string;
    projectTitle: string | null;
    description: string | null;
    createdAt: string;
    members: {
        role: import(".prisma/client").$Enums.TeamRole;
        joinedAt: string;
        userId: string;
        name: string;
        email: string;
        school: string | null;
        region: string | null;
        country: string | null;
        grade: string | null;
    }[];
}>;
//# sourceMappingURL=service.d.ts.map