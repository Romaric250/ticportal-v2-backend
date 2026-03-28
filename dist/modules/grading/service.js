import { GradeStatus, Prisma } from "@prisma/client";
import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
import { buildEmptySectionScores, computeTotalScore, parseRubricSections, } from "./scoring.js";
import { notifyGradeFinalized, notifyPeerReviewSubmitted, notifyReviewerStatusGranted, notifyTeamAssignment, } from "./notifications.js";
const REVIEWERS_PER_TEAM = 2;
/** Reviewer has finished their rubric (submitted, or past admin finalize / publish). */
function isGradeCompleteForReviewer(status) {
    return (status === GradeStatus.SUBMITTED ||
        status === GradeStatus.AVERAGED ||
        status === GradeStatus.PUBLISHED);
}
/**
 * Final 0–100 = weighted sum of two 0–100 inputs (rubric average and normalized LB).
 * Rubric total is 0–100; w = leaderboard share % from settings →
 * final = avg×(100−w)% + lbNorm×w% (e.g. w=10 → 90% from reviews, 10% from LB, max final 100).
 */
function blendReviewerAndLeaderboard(avg, lbNorm, leaderboardWeightPercent) {
    const w = leaderboardWeightPercent / 100;
    const v = avg * (1 - w) + lbNorm * w;
    return Math.min(100, Math.max(0, v));
}
/** Points toward final 0–100 from reviewer average: avg × (100−w)% / 100 */
function reviewerContributionPoints(avg, leaderboardWeightPercent) {
    const w = leaderboardWeightPercent / 100;
    return avg * (1 - w);
}
/** Points toward final 0–100 from normalized leaderboard: lbNorm × w% / 100 */
function leaderboardContributionPoints(lbNorm, leaderboardWeightPercent) {
    const w = leaderboardWeightPercent / 100;
    return lbNorm * w;
}
function effectiveMaxTeamsPerReviewer(settings) {
    const m = settings.maxTeamsPerReviewer;
    if (m == null || m < 1)
        return null;
    return m;
}
export async function getGradingSettings() {
    let s = await db.gradingSettings.findFirst();
    if (!s) {
        s = await db.gradingSettings.create({
            data: { leaderboardScorePercent: 10, leaderboardPointsMax: 5000 },
        });
    }
    return s;
}
/** True if this reviewer slot can be removed (no submission; team not finalized). */
async function assertCanUnassignReviewer(teamId, reviewerId) {
    const final = await db.teamFinalGrade.findUnique({ where: { teamId } });
    if (final) {
        const err = new Error("Cannot change assignments after the team score is finalized");
        err.statusCode = 400;
        throw err;
    }
    const assignment = await db.teamAssignment.findUnique({
        where: { teamId_reviewerId: { teamId, reviewerId } },
    });
    if (!assignment) {
        const err = new Error("No assignment for this reviewer");
        err.statusCode = 400;
        throw err;
    }
    const grade = await db.grade.findUnique({
        where: { teamId_reviewerId: { teamId, reviewerId } },
    });
    if (!grade)
        return;
    if (grade.status !== GradeStatus.IN_PROGRESS) {
        const err = new Error("Cannot unassign: this review was already submitted or finalized");
        err.statusCode = 400;
        throw err;
    }
    if (grade.submittedAt != null) {
        const err = new Error("Cannot unassign: this review was already submitted");
        err.statusCode = 400;
        throw err;
    }
}
/**
 * TeamAssignment references Grade on the same (teamId, reviewerId). Delete assignment first, then grade,
 * or Prisma rejects the operation (AssignmentGrade relation).
 */
async function removeReviewerFromTeamDb(teamId, reviewerId) {
    await db.$transaction(async (tx) => {
        const other = await tx.teamAssignment.findFirst({
            where: { teamId, reviewerId: { not: reviewerId } },
        });
        if (other) {
            await tx.grade.updateMany({
                where: { teamId, reviewerId: other.reviewerId },
                data: { pairedReviewerUserId: null },
            });
        }
        await tx.teamAssignment.delete({
            where: { teamId_reviewerId: { teamId, reviewerId } },
        });
        await tx.grade.deleteMany({ where: { teamId, reviewerId } });
    });
}
/**
 * Remove a reviewer (draft only), or swap them for someone else while keeping the other reviewer's scores.
 * With `replacementReviewerId`, calls {@link setTeamReviewerPair} — the other reviewer's Grade rows are only updated for pair metadata / upsert, not their scores.
 */
export async function unassignReviewer(teamId, reviewerId, options) {
    const raw = options?.replacementReviewerId;
    const replacement = typeof raw === "string" && raw.trim() !== "" ? raw.trim() : null;
    if (replacement) {
        const assignedBy = options?.assignedBy;
        if (!assignedBy)
            throw new Error("assignedBy required");
        const sendMail = options?.sendMail !== false;
        const current = await db.teamAssignment.findMany({ where: { teamId } });
        const other = current.find((c) => c.reviewerId !== reviewerId);
        if (!other) {
            const err = new Error("This team only has one reviewer assigned. Unassign without replacement, then assign a full pair manually.");
            err.statusCode = 400;
            throw err;
        }
        if (replacement === reviewerId || replacement === other.reviewerId) {
            const err = new Error("Choose a different reviewer for the replacement");
            err.statusCode = 400;
            throw err;
        }
        return setTeamReviewerPair(teamId, [other.reviewerId, replacement], assignedBy, sendMail);
    }
    await assertCanUnassignReviewer(teamId, reviewerId);
    await removeReviewerFromTeamDb(teamId, reviewerId);
    return { teamId, reviewerId };
}
async function assertReviewerHasCapacity(reviewerId, maxTeams) {
    if (maxTeams == null)
        return;
    const n = await db.teamAssignment.count({ where: { reviewerId } });
    if (n >= maxTeams) {
        const err = new Error(`Reviewer is at the max number of team assignments (${maxTeams})`);
        err.statusCode = 400;
        throw err;
    }
}
/** Chunk size for Point groupBy — huge `$in` lists are slow and stress the DB. */
const POINT_USER_ID_CHUNK = 300;
/** Sum of member points per team (batch). Chunks userIds so each query stays index-friendly. */
async function getTeamLeaderboardRawPointsBatch(teamIds) {
    if (teamIds.length === 0)
        return new Map();
    const members = await db.teamMember.findMany({
        where: { teamId: { in: teamIds } },
        select: { teamId: true, userId: true },
    });
    const userIds = [...new Set(members.map((m) => m.userId))];
    const rawByTeam = new Map();
    for (const id of teamIds)
        rawByTeam.set(id, 0);
    if (userIds.length === 0)
        return rawByTeam;
    const byUser = new Map();
    for (let i = 0; i < userIds.length; i += POINT_USER_ID_CHUNK) {
        const slice = userIds.slice(i, i + POINT_USER_ID_CHUNK);
        const aggs = await db.point.groupBy({
            by: ["userId"],
            where: { userId: { in: slice } },
            _sum: { amount: true },
        });
        for (const a of aggs) {
            byUser.set(a.userId, a._sum.amount ?? 0);
        }
    }
    for (const m of members) {
        const add = byUser.get(m.userId) ?? 0;
        rawByTeam.set(m.teamId, (rawByTeam.get(m.teamId) ?? 0) + add);
    }
    return rawByTeam;
}
export async function getActiveRubric() {
    const rubric = await db.gradingRubric.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: "desc" },
    });
    return rubric;
}
export async function upsertActiveRubric(data) {
    const sections = data.sections;
    if (!sections?.sections || !Array.isArray(sections.sections)) {
        throw new Error("Invalid rubric: sections.sections array required");
    }
    await db.gradingRubric.updateMany({ data: { isActive: false } });
    if (data.rubricId) {
        return db.gradingRubric.update({
            where: { id: data.rubricId },
            data: {
                name: data.name,
                description: data.description ?? null,
                sections: data.sections,
                maxScore: data.maxScore ?? 100,
                isActive: true,
            },
        });
    }
    return db.gradingRubric.create({
        data: {
            name: data.name,
            description: data.description ?? null,
            sections: data.sections,
            maxScore: data.maxScore ?? 100,
            isActive: true,
        },
    });
}
export async function setReviewerFlag(userId, isReviewer) {
    const user = await db.user.update({
        where: { id: userId },
        data: { isReviewer },
        select: { id: true, email: true, firstName: true, isReviewer: true },
    });
    await notifyReviewerStatusGranted(user.email, user.firstName, isReviewer);
    return user;
}
export async function listReviewers() {
    return db.user.findMany({
        where: { isReviewer: true },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isReviewer: true,
        },
        orderBy: { lastName: "asc" },
    });
}
export async function reviewerWorkload() {
    const reviewers = await db.user.findMany({
        where: { isReviewer: true },
        select: { id: true, firstName: true, lastName: true, email: true },
    });
    const counts = await Promise.all(reviewers.map(async (r) => {
        const assigned = await db.teamAssignment.count({ where: { reviewerId: r.id } });
        const pending = await db.grade.count({
            where: { reviewerId: r.id, status: GradeStatus.IN_PROGRESS },
        });
        return { ...r, assignedCount: assigned, pendingInProgress: pending };
    }));
    return counts;
}
/** Teams with assignments where grading is not fully done or no final row (lean select). */
export async function getPendingGradesTeams() {
    const teams = await db.team.findMany({
        select: {
            id: true,
            name: true,
            projectTitle: true,
            teamAssignments: { select: { id: true } },
            grades: { select: { status: true, totalScore: true, reviewerId: true } },
            teamFinalGrade: { select: { id: true, publishedAt: true } },
        },
    });
    return teams
        .map((t) => {
        const submitted = t.grades.filter((g) => g.status === GradeStatus.SUBMITTED).length;
        const totalGrades = t.grades.length;
        const published = !!t.teamFinalGrade?.publishedAt;
        const readyToFinalize = totalGrades >= REVIEWERS_PER_TEAM && submitted >= REVIEWERS_PER_TEAM && !t.teamFinalGrade;
        let status;
        if (published)
            status = "PUBLISHED";
        else if (readyToFinalize)
            status = "READY_TO_FINALIZE";
        else
            status = "PENDING";
        const submittedGrades = t.grades
            .filter((g) => g.status === GradeStatus.SUBMITTED && g.totalScore != null)
            .sort((a, b) => a.reviewerId.localeCompare(b.reviewerId));
        const score1 = submittedGrades[0]?.totalScore ?? null;
        const score2 = submittedGrades[1]?.totalScore ?? null;
        return {
            teamId: t.id,
            teamName: t.name,
            projectTitle: t.projectTitle,
            assignmentCount: t.teamAssignments.length,
            gradeCount: totalGrades,
            submittedCount: submitted,
            hasFinal: !!t.teamFinalGrade,
            status,
            score1,
            score2,
            canFinalize: readyToFinalize,
        };
    })
        .filter((x) => x.status !== "PUBLISHED");
}
async function assertNotTeamMember(reviewerId, teamId) {
    const m = await db.teamMember.findFirst({ where: { teamId, userId: reviewerId } });
    if (m)
        throw new Error("Reviewer cannot be assigned to their own team");
}
export async function createAssignmentsForTeam(teamId, reviewerIds, assignedBy, sendMail) {
    if (reviewerIds.length !== REVIEWERS_PER_TEAM) {
        throw new Error(`Exactly ${REVIEWERS_PER_TEAM} reviewers required per team`);
    }
    const uniq = new Set(reviewerIds);
    if (uniq.size !== reviewerIds.length)
        throw new Error("Duplicate reviewers");
    const rubric = await getActiveRubric();
    if (!rubric)
        throw new Error("No active grading rubric. Create one first.");
    const team = await db.team.findUnique({
        where: { id: teamId },
        include: { members: true },
    });
    if (!team)
        throw new Error("Team not found");
    for (const rid of reviewerIds) {
        await assertNotTeamMember(rid, teamId);
        const u = await db.user.findUnique({ where: { id: rid }, select: { isReviewer: true } });
        if (!u?.isReviewer)
            throw new Error(`User ${rid} is not a reviewer`);
    }
    const a = reviewerIds[0];
    const b = reviewerIds[1];
    if (!a || !b)
        throw new Error("Invalid reviewer pair");
    const rubricJson = { sections: parseRubricSections(rubric.sections) };
    const empty = buildEmptySectionScores(rubricJson);
    await db.$transaction(async (tx) => {
        for (const rid of reviewerIds) {
            await tx.teamAssignment.upsert({
                where: { teamId_reviewerId: { teamId, reviewerId: rid } },
                create: { teamId, reviewerId: rid, assignedBy },
                update: {},
            });
            const pairId = rid === a ? b : a;
            await tx.grade.upsert({
                where: { teamId_reviewerId: { teamId, reviewerId: rid } },
                create: {
                    teamId,
                    rubricId: rubric.id,
                    reviewerId: rid,
                    sectionScores: empty,
                    totalScore: 0,
                    status: GradeStatus.IN_PROGRESS,
                    pairedReviewerUserId: pairId,
                },
                update: {
                    pairedReviewerUserId: pairId,
                    rubricId: rubric.id,
                },
            });
        }
    });
    if (sendMail) {
        for (const rid of reviewerIds) {
            const u = await db.user.findUnique({ where: { id: rid } });
            if (u)
                await notifyTeamAssignment(u.email, u.firstName, team.name, team.id);
        }
    }
    return { teamId, reviewerIds };
}
/**
 * Sets exactly two reviewers for a team: removes previous reviewers not in the new pair when allowed
 * (draft only), then upserts the pair. Use this for manual assign and reviewer swaps.
 */
export async function setTeamReviewerPair(teamId, reviewerIds, assignedBy, sendMail) {
    if (reviewerIds.length !== REVIEWERS_PER_TEAM) {
        throw new Error(`Exactly ${REVIEWERS_PER_TEAM} reviewers required per team`);
    }
    const uniq = new Set(reviewerIds);
    if (uniq.size !== reviewerIds.length)
        throw new Error("Duplicate reviewers");
    const settings = await getGradingSettings();
    const maxTeams = effectiveMaxTeamsPerReviewer(settings);
    const current = await db.teamAssignment.findMany({ where: { teamId } });
    const initialIds = new Set(current.map((c) => c.reviewerId));
    const newSet = new Set(reviewerIds);
    for (const rid of reviewerIds) {
        await assertNotTeamMember(rid, teamId);
        const u = await db.user.findUnique({ where: { id: rid }, select: { isReviewer: true } });
        if (!u?.isReviewer)
            throw new Error(`User ${rid} is not a reviewer`);
    }
    for (const rid of reviewerIds) {
        if (initialIds.has(rid))
            continue;
        await assertReviewerHasCapacity(rid, maxTeams);
    }
    const toRemove = current.filter((c) => !newSet.has(c.reviewerId));
    for (const c of toRemove) {
        await assertCanUnassignReviewer(teamId, c.reviewerId);
    }
    for (const c of toRemove) {
        await removeReviewerFromTeamDb(teamId, c.reviewerId);
    }
    return createAssignmentsForTeam(teamId, reviewerIds, assignedBy, sendMail);
}
export async function autoAssignReviewers(options) {
    const exclude = new Set(options?.excludeReviewerIds ?? []);
    const rubric = await getActiveRubric();
    if (!rubric)
        throw new Error("No active grading rubric");
    const settings = await getGradingSettings();
    const maxTeams = effectiveMaxTeamsPerReviewer(settings);
    const reviewers = await db.user.findMany({
        where: {
            isReviewer: true,
            ...(exclude.size > 0 ? { id: { notIn: [...exclude] } } : {}),
        },
        select: { id: true },
    });
    if (reviewers.length < REVIEWERS_PER_TEAM) {
        throw new Error("Not enough reviewers (need at least 2, excluding blocked list)");
    }
    const teamWhere = options?.teamIds?.length ? { id: { in: options.teamIds } } : {};
    const teams = await db.team.findMany({
        where: teamWhere,
        include: {
            members: { select: { userId: true } },
            teamAssignments: { select: { reviewerId: true } },
        },
    });
    const load = new Map();
    for (const r of reviewers)
        load.set(r.id, 0);
    const counts = await db.teamAssignment.groupBy({
        by: ["reviewerId"],
        _count: { _all: true },
    });
    for (const row of counts) {
        load.set(row.reviewerId, row._count._all);
    }
    const assignedBy = options?.assignedBy ?? reviewers[0].id;
    const sendMail = options?.sendMail !== false;
    const results = [];
    const skipped = [];
    const errors = [];
    for (const team of teams) {
        const n = team.teamAssignments.length;
        if (n >= REVIEWERS_PER_TEAM)
            continue;
        const needed = REVIEWERS_PER_TEAM - n;
        const memberIds = new Set(team.members.map((m) => m.userId));
        const existingIds = new Set(team.teamAssignments.map((t) => t.reviewerId));
        let candidates = reviewers
            .filter((r) => !memberIds.has(r.id) && !existingIds.has(r.id))
            .map((r) => ({ id: r.id, w: load.get(r.id) ?? 0 }))
            .sort((x, y) => x.w - y.w);
        if (maxTeams != null) {
            candidates = candidates.filter((c) => c.w < maxTeams);
        }
        if (candidates.length < needed) {
            skipped.push({ teamId: team.id, reason: "not_enough_eligible_reviewers" });
            logger.warn({ teamId: team.id, needed, available: candidates.length }, "autoAssign: not enough eligible reviewers for team");
            continue;
        }
        const pick = [];
        for (const c of candidates) {
            if (pick.length >= needed)
                break;
            pick.push(c.id);
        }
        if (pick.length < needed) {
            skipped.push({ teamId: team.id, reason: "not_enough_eligible_reviewers" });
            continue;
        }
        try {
            if (n === 0) {
                const a = pick[0];
                const b = pick[1];
                await setTeamReviewerPair(team.id, [a, b], assignedBy, sendMail);
                load.set(a, (load.get(a) ?? 0) + 1);
                load.set(b, (load.get(b) ?? 0) + 1);
                results.push({ teamId: team.id, reviewerIds: [a, b] });
            }
            else {
                const existing = team.teamAssignments[0].reviewerId;
                const newR = pick[0];
                await setTeamReviewerPair(team.id, [existing, newR], assignedBy, sendMail);
                load.set(newR, (load.get(newR) ?? 0) + 1);
                results.push({ teamId: team.id, reviewerIds: [existing, newR] });
            }
        }
        catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            errors.push({
                teamId: team.id,
                teamName: team.name ?? null,
                message,
            });
            logger.warn({ teamId: team.id, err: message }, "autoAssign: team assignment failed");
        }
    }
    return { assigned: results.length, teams: results, skipped, errors };
}
export async function manualAssign(pairs, assignedBy, sendMail = true) {
    const out = [];
    for (const p of pairs) {
        const r = await setTeamReviewerPair(p.teamId, p.reviewerIds, assignedBy, sendMail);
        out.push(r);
    }
    return { assigned: out.length, teams: out };
}
/** Current reviewer assignments for one team (manual assign pre-fill: 0, 1, or 2 reviewers). */
export async function getTeamReviewerAssignments(teamId) {
    const team = await db.team.findUnique({ where: { id: teamId }, select: { id: true } });
    if (!team) {
        const err = new Error("Team not found");
        err.statusCode = 404;
        throw err;
    }
    const rows = await db.teamAssignment.findMany({
        where: { teamId },
        select: {
            reviewerId: true,
            reviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { assignedAt: "asc" },
    });
    return rows.map((r) => ({
        reviewerId: r.reviewerId,
        firstName: r.reviewer.firstName,
        lastName: r.reviewer.lastName,
        email: r.reviewer.email,
    }));
}
export async function listAllAssignments() {
    return db.teamAssignment.findMany({
        select: {
            id: true,
            assignedAt: true,
            teamId: true,
            reviewerId: true,
            team: {
                select: {
                    id: true,
                    name: true,
                    projectTitle: true,
                    teamFinalGrade: { select: { id: true } },
                },
            },
            reviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
            assigner: { select: { id: true, firstName: true, lastName: true } },
            grade: { select: { status: true, submittedAt: true } },
        },
        orderBy: { assignedAt: "desc" },
    });
}
export async function getAssignmentsForReviewer(reviewerId) {
    return db.teamAssignment.findMany({
        where: { reviewerId },
        include: {
            team: {
                select: {
                    id: true,
                    name: true,
                    projectTitle: true,
                    description: true,
                    profileImage: true,
                },
            },
        },
        orderBy: { assignedAt: "desc" },
    });
}
export async function submitGrade(teamId, reviewerId, body) {
    const assignment = await db.teamAssignment.findUnique({
        where: { teamId_reviewerId: { teamId, reviewerId } },
    });
    if (!assignment)
        throw new Error("You are not assigned to this team");
    await assertNotTeamMember(reviewerId, teamId);
    const grade = await db.grade.findUnique({
        where: { teamId_reviewerId: { teamId, reviewerId } },
        include: { rubric: true },
    });
    if (!grade)
        throw new Error("Grade record missing — contact admin");
    const rubricJson = { sections: parseRubricSections(grade.rubric.sections) };
    const { total, errors } = computeTotalScore(rubricJson, body.sectionScores);
    if (errors.length) {
        const err = new Error(errors.join("; "));
        err.statusCode = 400;
        throw err;
    }
    const updated = await db.grade.update({
        where: { id: grade.id },
        data: {
            sectionScores: body.sectionScores,
            totalScore: total,
            feedback: body.feedback ?? null,
            status: GradeStatus.SUBMITTED,
            submittedAt: new Date(),
        },
    });
    const pairId = grade.pairedReviewerUserId;
    if (pairId) {
        const other = await db.user.findUnique({ where: { id: pairId } });
        const reviewer = await db.user.findUnique({ where: { id: reviewerId } });
        const team = await db.team.findUnique({ where: { id: teamId } });
        if (other && reviewer && team) {
            const pairName = `${reviewer.firstName} ${reviewer.lastName}`;
            await notifyPeerReviewSubmitted(other.email, other.firstName, team.name, pairName);
        }
    }
    return updated;
}
export async function getTeamReviews(teamId, viewerUserId, isAdmin) {
    if (!isAdmin) {
        const assignment = await db.teamAssignment.findUnique({
            where: { teamId_reviewerId: { teamId, reviewerId: viewerUserId } },
        });
        if (!assignment) {
            const err = new Error("Not assigned to review this team");
            err.statusCode = 403;
            throw err;
        }
    }
    const grades = await db.grade.findMany({
        where: { teamId },
        include: {
            reviewer: { select: { id: true, firstName: true, lastName: true, email: true } },
            rubric: true,
        },
    });
    if (isAdmin) {
        return grades.map((g) => ({
            id: g.id,
            reviewer: g.reviewer,
            status: g.status,
            totalScore: g.totalScore,
            sectionScores: g.sectionScores,
            feedback: g.feedback,
            submittedAt: g.submittedAt,
        }));
    }
    const mine = grades.find((g) => g.reviewerId === viewerUserId);
    const others = grades
        .filter((g) => g.reviewerId !== viewerUserId)
        .map((g) => ({
        reviewerName: `${g.reviewer.firstName} ${g.reviewer.lastName}`,
        submitted: g.status === GradeStatus.SUBMITTED,
        scoresHidden: true,
    }));
    return {
        mine: mine
            ? {
                id: mine.id,
                status: mine.status,
                totalScore: mine.totalScore,
                sectionScores: mine.sectionScores,
                feedback: mine.feedback,
                submittedAt: mine.submittedAt,
            }
            : null,
        others,
    };
}
export async function teamLeaderboardPoints(teamId) {
    const members = await db.teamMember.findMany({ where: { teamId }, select: { userId: true } });
    if (!members.length)
        return 0;
    const ids = members.map((m) => m.userId);
    const agg = await db.point.aggregate({
        where: { userId: { in: ids } },
        _sum: { amount: true },
    });
    return agg._sum.amount ?? 0;
}
/** 0–100 scale: cap &gt; 0 → min(100, raw/cap*100); cap === 0 → relative to highest team. */
function computeNormalizedLeaderboard(rawByTeam, teamIds, cap) {
    const norm = new Map();
    if (cap > 0) {
        for (const tid of teamIds) {
            const raw = rawByTeam.get(tid) ?? 0;
            norm.set(tid, Math.min(100, (raw / cap) * 100));
        }
        return norm;
    }
    let max = 0;
    for (const tid of teamIds) {
        const raw = rawByTeam.get(tid) ?? 0;
        if (raw > max)
            max = raw;
    }
    for (const tid of teamIds) {
        const raw = rawByTeam.get(tid) ?? 0;
        norm.set(tid, max > 0 ? Math.min(100, (raw / max) * 100) : 0);
    }
    return norm;
}
/**
 * 0–100 scale for blending into final grade. Uses `leaderboardPointsMax` from settings:
 * normalized = min(100, (rawPoints / max) * 100). If max is 0, falls back to relative-to-highest-team scaling.
 */
function effectiveLeaderboardCap(settings) {
    const v = settings.leaderboardPointsMax;
    if (v === undefined || v === null)
        return 5000;
    return v;
}
export async function normalizeTeamLeaderboardScores() {
    const settings = await getGradingSettings();
    const cap = effectiveLeaderboardCap(settings);
    const teams = await db.team.findMany({ select: { id: true } });
    const teamIds = teams.map((t) => t.id);
    const rawByTeam = await getTeamLeaderboardRawPointsBatch(teamIds);
    return computeNormalizedLeaderboard(rawByTeam, teamIds, cap);
}
/**
 * Normalized 0–100 leaderboard contribution for one team only.
 * When cap &gt; 0 (default): uses a single aggregate over that team's members — does NOT scan all teams/points.
 * When cap === 0 (legacy relative mode): falls back to full {@link normalizeTeamLeaderboardScores}.
 */
export async function getNormalizedLeaderboardScoreForTeam(teamId) {
    const settings = await getGradingSettings();
    const cap = effectiveLeaderboardCap(settings);
    const raw = await teamLeaderboardPoints(teamId);
    if (cap > 0) {
        return Math.min(100, (raw / cap) * 100);
    }
    const norm = await normalizeTeamLeaderboardScores();
    return norm.get(teamId) ?? 0;
}
export async function finalizeTeamGrade(teamId) {
    const rubric = await getActiveRubric();
    if (!rubric)
        throw new Error("No active rubric");
    const grades = await db.grade.findMany({
        where: { teamId, status: GradeStatus.SUBMITTED },
    });
    if (grades.length < REVIEWERS_PER_TEAM) {
        throw new Error("Both reviewers must submit before finalizing");
    }
    const scores = grades.map((g) => g.totalScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const s0 = scores[0] ?? 0;
    const s1 = scores[1] ?? 0;
    const mid = (s0 + s1) / 2;
    const diffPct = mid > 0 ? (Math.abs(s0 - s1) / mid) * 100 : s0 !== s1 ? 100 : 0;
    const settings = await getGradingSettings();
    const lbNorm = await getNormalizedLeaderboardScoreForTeam(teamId);
    const finalScore = blendReviewerAndLeaderboard(avg, lbNorm, settings.leaderboardScorePercent);
    await db.$transaction(async (tx) => {
        await tx.grade.updateMany({
            where: { teamId, id: { in: grades.map((g) => g.id) } },
            data: { status: GradeStatus.AVERAGED, reviewedAt: new Date() },
        });
        await tx.teamFinalGrade.upsert({
            where: { teamId },
            create: {
                teamId,
                rubricId: rubric.id,
                reviewerAverageScore: avg,
                leaderboardScoreNormalized: lbNorm,
                leaderboardWeightPercent: settings.leaderboardScorePercent,
                finalScore,
            },
            update: {
                rubricId: rubric.id,
                reviewerAverageScore: avg,
                leaderboardScoreNormalized: lbNorm,
                leaderboardWeightPercent: settings.leaderboardScorePercent,
                finalScore,
            },
        });
    });
    return {
        reviewerAverageScore: avg,
        leaderboardScoreNormalized: lbNorm,
        leaderboardWeightPercent: settings.leaderboardScorePercent,
        finalScore,
        scoreDifferenceWarning: diffPct > 20 ? `Reviewer scores differ by ${diffPct.toFixed(1)}%` : null,
    };
}
export async function setLeaderboardConfig(params) {
    if (params.leaderboardScorePercent != null) {
        if (params.leaderboardScorePercent < 0 || params.leaderboardScorePercent > 100) {
            throw new Error("leaderboardScorePercent must be 0–100");
        }
    }
    if (params.leaderboardPointsMax != null && params.leaderboardPointsMax < 0) {
        throw new Error("leaderboardPointsMax must be >= 0 (use 0 for legacy relative scaling)");
    }
    if (params.maxTeamsPerReviewer !== undefined && params.maxTeamsPerReviewer !== null) {
        if (params.maxTeamsPerReviewer < 1) {
            throw new Error("maxTeamsPerReviewer must be >= 1 or null (unlimited)");
        }
    }
    const settings = await getGradingSettings();
    return db.gradingSettings.update({
        where: { id: settings.id },
        data: {
            ...(params.leaderboardScorePercent != null && {
                leaderboardScorePercent: params.leaderboardScorePercent,
            }),
            ...(params.leaderboardPointsMax != null && {
                leaderboardPointsMax: params.leaderboardPointsMax,
            }),
            ...(params.maxTeamsPerReviewer !== undefined && {
                maxTeamsPerReviewer: params.maxTeamsPerReviewer,
            }),
        },
    });
}
const LEADERBOARD_TEAMS_MAX_LIMIT = 100;
const LEADERBOARD_TEAMS_DEFAULT_LIMIT = 20;
/**
 * Full live ranking (blend-based). Used by admin reports and paginated leaderboard API.
 */
export async function getRankedLeaderboardTeamsFull() {
    const settings = await getGradingSettings();
    const lbWeightPct = settings.leaderboardScorePercent;
    const cap = effectiveLeaderboardCap(settings);
    const allTeams = await db.team.findMany({
        select: {
            id: true,
            name: true,
            teamFinalGrade: {
                select: {
                    finalScore: true,
                    reviewerAverageScore: true,
                    leaderboardScoreNormalized: true,
                    leaderboardWeightPercent: true,
                    publishedAt: true,
                },
            },
            grades: {
                select: {
                    reviewerId: true,
                    totalScore: true,
                    status: true,
                },
            },
        },
    });
    const teamIds = allTeams.map((t) => t.id);
    let rawByTeam;
    let norm;
    if (cap > 0) {
        rawByTeam = await getTeamLeaderboardRawPointsBatch(teamIds);
        norm = computeNormalizedLeaderboard(rawByTeam, teamIds, cap);
    }
    else {
        rawByTeam = await getTeamLeaderboardRawPointsBatch(teamIds);
        const fullNorm = await normalizeTeamLeaderboardScores();
        norm = new Map();
        for (const id of teamIds) {
            norm.set(id, fullNorm.get(id) ?? 0);
        }
    }
    const maxCap = effectiveLeaderboardCap(settings);
    const enriched = [];
    for (const t of allTeams) {
        const lb = norm.get(t.id) ?? 0;
        const fg = t.teamFinalGrade;
        const done = t.grades
            .filter((g) => isGradeCompleteForReviewer(g.status))
            .sort((a, b) => a.reviewerId.localeCompare(b.reviewerId));
        const scores = done.map((g) => g.totalScore);
        const score1 = scores[0] ?? null;
        const score2 = scores[1] ?? null;
        const finiteScores = scores.filter((s) => typeof s === "number" && Number.isFinite(s));
        /** Unweighted mean of submitted reviewer totals (rubric 0–100). */
        let reviewerAverageScore = null;
        if (finiteScores.length > 0) {
            reviewerAverageScore = finiteScores.reduce((a, b) => a + b, 0) / finiteScores.length;
        }
        const bothReviewersComplete = done.length >= REVIEWERS_PER_TEAM &&
            score1 != null &&
            score2 != null &&
            Number.isFinite(score1) &&
            Number.isFinite(score2);
        let blendFinal = null;
        let reviewerContributionPts = null;
        let leaderboardContributionPts;
        /** Weight % for LB shown on row: current settings when live; else stored on final grade. */
        let rowLeaderboardWeightPercent = lbWeightPct;
        if (bothReviewersComplete) {
            /**
             * Both reviews in: always derive Final, Wtd rev, and LB pts from **live** S1/S2 and **live** normalized LB
             * so Rev avg / Wtd rev / LB pts / Final stay consistent. Stored TeamFinalGrade does not override the report.
             */
            rowLeaderboardWeightPercent = lbWeightPct;
            reviewerContributionPts = reviewerContributionPoints(reviewerAverageScore, lbWeightPct);
            leaderboardContributionPts = leaderboardContributionPoints(lb, lbWeightPct);
            blendFinal = blendReviewerAndLeaderboard(reviewerAverageScore, lb, lbWeightPct);
        }
        else if (fg) {
            blendFinal = Math.min(100, Math.max(0, fg.finalScore));
            rowLeaderboardWeightPercent = fg.leaderboardWeightPercent;
            reviewerContributionPts = reviewerContributionPoints(fg.reviewerAverageScore, fg.leaderboardWeightPercent);
            leaderboardContributionPts = leaderboardContributionPoints(fg.leaderboardScoreNormalized, fg.leaderboardWeightPercent);
        }
        else if (reviewerAverageScore != null) {
            /** One reviewer or partial: live preview with current settings. */
            reviewerContributionPts = reviewerContributionPoints(reviewerAverageScore, lbWeightPct);
            leaderboardContributionPts = leaderboardContributionPoints(lb, lbWeightPct);
            blendFinal = blendReviewerAndLeaderboard(reviewerAverageScore, lb, lbWeightPct);
        }
        else {
            leaderboardContributionPts = leaderboardContributionPoints(lb, lbWeightPct);
        }
        const sortKey = blendFinal != null ? blendFinal : -Infinity;
        enriched.push({
            teamId: t.id,
            teamName: t.name,
            rawLeaderboardPoints: rawByTeam.get(t.id) ?? 0,
            normalizedLeaderboard: lb,
            leaderboardPointsMax: maxCap,
            leaderboardWeightPercent: rowLeaderboardWeightPercent,
            score1,
            score2,
            reviewerAverageScore,
            reviewerContributionPoints: reviewerContributionPts,
            leaderboardContributionPoints: leaderboardContributionPts,
            blendFinal,
            finalGrade: fg,
            sortKey,
        });
    }
    enriched.sort((a, b) => b.sortKey - a.sortKey);
    return enriched.map((row, i) => {
        const { sortKey, ...rest } = row;
        return { ...rest, rank: i + 1 };
    });
}
/**
 * Paginated admin leaderboard: global rank by blend score (finalized score when present, else live preview).
 * Preview = reviewerAverage × (1 − w) + normalizedLeaderboard × w, capped at 100.
 */
export async function getLeaderboardTeamsReport(params) {
    const page = Math.max(1, Math.floor(Number(params?.page) || 1));
    const limit = Math.min(LEADERBOARD_TEAMS_MAX_LIMIT, Math.max(1, Math.floor(Number(params?.limit) || LEADERBOARD_TEAMS_DEFAULT_LIMIT)));
    const ranked = await getRankedLeaderboardTeamsFull();
    const total = ranked.length;
    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const pageRows = ranked.slice(skip, skip + limit);
    const hasNextPage = skip + pageRows.length < total;
    const hasPrevPage = page > 1;
    return {
        teams: pageRows,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage,
            hasPrevPage,
        },
    };
}
export async function finalizeTeamGradesBulk(teamIds) {
    const unique = [...new Set(teamIds.filter(Boolean))];
    const succeeded = [];
    const failed = [];
    for (const teamId of unique) {
        try {
            await finalizeTeamGrade(teamId);
            succeeded.push(teamId);
        }
        catch (e) {
            failed.push({
                teamId,
                message: e instanceof Error ? e.message : String(e),
            });
        }
    }
    return { succeeded, failed };
}
export async function applyLeaderboardToFinal(teamId) {
    const settings = await getGradingSettings();
    const w = settings.leaderboardScorePercent / 100;
    const norm = await normalizeTeamLeaderboardScores();
    const finals = teamId
        ? await db.teamFinalGrade.findMany({ where: { teamId } })
        : await db.teamFinalGrade.findMany();
    const updated = [];
    for (const fg of finals) {
        const lb = norm.get(fg.teamId) ?? 0;
        const avg = fg.reviewerAverageScore;
        const finalScore = blendReviewerAndLeaderboard(avg, lb, settings.leaderboardScorePercent);
        await db.teamFinalGrade.update({
            where: { teamId: fg.teamId },
            data: {
                leaderboardScoreNormalized: lb,
                leaderboardWeightPercent: settings.leaderboardScorePercent,
                finalScore,
            },
        });
        updated.push(fg.teamId);
    }
    return { updatedCount: updated.length, teamIds: updated };
}
export async function publishTeamFinal(teamId) {
    const fg = await db.teamFinalGrade.findUnique({ where: { teamId } });
    if (!fg)
        throw new Error("Finalize grades before publishing");
    const team = await db.team.findUnique({
        where: { id: teamId },
        include: { members: { include: { user: true } } },
    });
    if (!team)
        throw new Error("Team not found");
    await db.$transaction(async (tx) => {
        await tx.grade.updateMany({
            where: { teamId },
            data: { status: GradeStatus.PUBLISHED },
        });
        await tx.teamFinalGrade.update({
            where: { teamId },
            data: { publishedAt: new Date() },
        });
    });
    for (const m of team.members) {
        await notifyGradeFinalized(m.user.email, m.user.firstName, team.name, fg.finalScore);
    }
    return { teamId, published: true };
}
export async function getReviewerDashboard(userId) {
    const reviewer = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, firstName: true, lastName: true, isReviewer: true },
    });
    if (!reviewer?.isReviewer)
        throw new Error("Not a reviewer");
    const assignments = await getAssignmentsForReviewer(userId);
    const assignedTeams = [];
    for (const a of assignments) {
        const grade = await db.grade.findUnique({
            where: { teamId_reviewerId: { teamId: a.teamId, reviewerId: userId } },
        });
        const deliverables = await db.teamDeliverable.findMany({
            where: { teamId: a.teamId },
            include: { template: { select: { title: true } } },
        });
        let pairedReviewer = null;
        if (grade?.pairedReviewerUserId) {
            const p = await db.user.findUnique({ where: { id: grade.pairedReviewerUserId } });
            const pg = await db.grade.findUnique({
                where: {
                    teamId_reviewerId: { teamId: a.teamId, reviewerId: grade.pairedReviewerUserId },
                },
            });
            if (p) {
                pairedReviewer = {
                    name: `${p.firstName} ${p.lastName}`,
                    submitted: pg?.status === GradeStatus.SUBMITTED,
                };
            }
        }
        assignedTeams.push({
            teamId: a.team.id,
            teamName: a.team.name,
            projectTitle: a.team.projectTitle,
            deliverables: deliverables.map((d) => ({
                id: d.id,
                type: d.type,
                contentType: d.contentType,
                content: d.content,
                submissionStatus: d.submissionStatus,
                templateTitle: d.template?.title,
            })),
            grade: grade
                ? {
                    id: grade.id,
                    status: grade.status,
                    sectionScores: grade.sectionScores,
                    totalScore: grade.totalScore,
                    feedback: grade.feedback ?? null,
                }
                : null,
            pairedReviewer,
        });
    }
    const totalAssigned = assignedTeams.length;
    const completed = assignedTeams.filter((t) => t.grade?.status ? isGradeCompleteForReviewer(t.grade.status) : false).length;
    return {
        reviewer: {
            id: reviewer.id,
            name: `${reviewer.firstName} ${reviewer.lastName}`,
            email: reviewer.email,
        },
        assignedTeams,
        stats: {
            totalAssigned,
            completed,
            pending: totalAssigned - completed,
        },
    };
}
/** Lean leaderboard payload — single query with explicit selects (fast vs. full include graph). */
export async function getGradingReports() {
    const [rankedLb, teams] = await Promise.all([
        getRankedLeaderboardTeamsFull(),
        db.team.findMany({
            select: {
                id: true,
                name: true,
                school: true,
                projectTitle: true,
                teamAssignments: { select: { id: true } },
                teamFinalGrade: {
                    select: {
                        finalScore: true,
                        publishedAt: true,
                        reviewerAverageScore: true,
                    },
                },
                grades: {
                    select: {
                        totalScore: true,
                        feedback: true,
                        status: true,
                        reviewer: {
                            select: { id: true, firstName: true, lastName: true, email: true },
                        },
                    },
                },
            },
        }),
    ]);
    const detailById = new Map(teams.map((t) => [t.id, t]));
    const rows = rankedLb
        .map((lb) => {
        const t = detailById.get(lb.teamId);
        if (!t)
            return null;
        const finalScore = t.teamFinalGrade?.finalScore ?? null;
        const publishedAt = t.teamFinalGrade?.publishedAt?.toISOString() ?? null;
        /** Prefer live average from ranking row (matches S1/S2); fall back to stored final. */
        const reviewerAverageScore = lb.reviewerAverageScore ?? t.teamFinalGrade?.reviewerAverageScore ?? null;
        return {
            teamId: t.id,
            teamName: t.name,
            school: t.school,
            projectTitle: t.projectTitle,
            assignmentCount: t.teamAssignments.length,
            finalScore,
            reviewerAverageScore,
            publishedAt,
            rank: lb.rank,
            score1: lb.score1,
            score2: lb.score2,
            blendFinal: lb.blendFinal,
            normalizedLeaderboard: lb.normalizedLeaderboard,
            rawLeaderboardPoints: lb.rawLeaderboardPoints,
            leaderboardWeightPercent: lb.leaderboardWeightPercent,
            reviewerContributionPoints: lb.reviewerContributionPoints,
            leaderboardContributionPoints: lb.leaderboardContributionPoints,
            reviewers: t.grades.map((g) => ({
                reviewerId: g.reviewer.id,
                reviewerName: `${g.reviewer.firstName} ${g.reviewer.lastName}`.trim(),
                email: g.reviewer.email,
                totalScore: g.totalScore,
                status: g.status,
                feedback: g.feedback ?? null,
            })),
        };
    })
        .filter((r) => r != null);
    return { teams: rows, generatedAt: new Date().toISOString() };
}
export async function getGradingReportTeamDetail(teamId) {
    const team = await db.team.findUnique({
        where: { id: teamId },
        select: {
            id: true,
            name: true,
            school: true,
            projectTitle: true,
            description: true,
            createdAt: true,
            members: {
                select: {
                    role: true,
                    joinedAt: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            school: true,
                            region: true,
                            country: true,
                            grade: true,
                        },
                    },
                },
            },
        },
    });
    if (!team) {
        const err = new Error("Team not found");
        err.statusCode = 404;
        throw err;
    }
    return {
        teamId: team.id,
        teamName: team.name,
        teamSchool: team.school,
        projectTitle: team.projectTitle,
        description: team.description,
        createdAt: team.createdAt.toISOString(),
        members: team.members.map((m) => ({
            role: m.role,
            joinedAt: m.joinedAt.toISOString(),
            userId: m.user.id,
            name: `${m.user.firstName} ${m.user.lastName}`.trim(),
            email: m.user.email,
            school: m.user.school,
            region: m.user.region,
            country: m.user.country,
            grade: m.user.grade,
        })),
    };
}
//# sourceMappingURL=service.js.map