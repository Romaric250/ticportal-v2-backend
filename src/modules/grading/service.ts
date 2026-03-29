import { GradeStatus, Prisma, TeamRole } from "@prisma/client";
import { db } from "../../config/database";
import { logger } from "../../shared/utils/logger";
import {
  buildEmptySectionScores,
  computeTotalScore,
  parseRubricSections,
  type RubricJson,
  type SectionScoreInput,
} from "./scoring";
import {
  notifyGradeFinalized,
  notifyPeerReviewSubmitted,
  notifyReviewerStatusGranted,
  notifyTeamAssignment,
} from "./notifications";

const REVIEWERS_PER_TEAM = 3;

/** Used for Teams tab sort: prioritize teams that submitted all required deliverables (e.g. 7). */
export const DELIVERABLES_COMPLETE_TARGET = 7;

async function getTeamLeadRegion(teamId: string): Promise<string | null> {
  const lead = await db.teamMember.findFirst({
    where: { teamId, role: TeamRole.LEAD },
    include: { user: { select: { region: true } } },
  });
  const r = lead?.user?.region?.trim();
  if (r) return r;
  const anyMember = await db.teamMember.findFirst({
    where: { teamId },
    include: { user: { select: { region: true } } },
  });
  return anyMember?.user?.region?.trim() || null;
}

function sameRegion(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a?.trim() || !b?.trim()) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

async function getTeamRegionsBatch(teamIds: string[]): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>();
  for (const id of teamIds) map.set(id, null);
  if (teamIds.length === 0) return map;
  const leads = await db.teamMember.findMany({
    where: { teamId: { in: teamIds }, role: TeamRole.LEAD },
    include: { user: { select: { region: true } } },
  });
  for (const row of leads) {
    map.set(row.teamId, row.user.region?.trim() || null);
  }
  const missing = teamIds.filter((id) => !map.get(id));
  if (missing.length === 0) return map;
  const rest = await db.teamMember.findMany({
    where: { teamId: { in: missing } },
    include: { user: { select: { region: true } } },
    orderBy: { joinedAt: "asc" },
  });
  const seen = new Set<string>();
  for (const row of rest) {
    if (seen.has(row.teamId)) continue;
    seen.add(row.teamId);
    if (!map.get(row.teamId)) {
      map.set(row.teamId, row.user.region?.trim() || null);
    }
  }
  return map;
}

/** Reviewer has finished their rubric (submitted, or past admin finalize / publish). */
function isGradeCompleteForReviewer(status: GradeStatus): boolean {
  return (
    status === GradeStatus.SUBMITTED ||
    status === GradeStatus.AVERAGED ||
    status === GradeStatus.PUBLISHED
  );
}

/**
 * Final 0–100 = weighted sum of two 0–100 inputs (rubric average and normalized LB).
 * Rubric total is 0–100; w = leaderboard share % from settings →
 * final = avg×(100−w)% + lbNorm×w% (e.g. w=10 → 90% from reviews, 10% from LB, max final 100).
 */
function blendReviewerAndLeaderboard(avg: number, lbNorm: number, leaderboardWeightPercent: number): number {
  const w = leaderboardWeightPercent / 100;
  const v = avg * (1 - w) + lbNorm * w;
  return Math.min(100, Math.max(0, v));
}

/** Points toward final 0–100 from reviewer average: avg × (100−w)% / 100 */
function reviewerContributionPoints(avg: number, leaderboardWeightPercent: number): number {
  const w = leaderboardWeightPercent / 100;
  return avg * (1 - w);
}

/** Points toward final 0–100 from normalized leaderboard: lbNorm × w% / 100 */
function leaderboardContributionPoints(lbNorm: number, leaderboardWeightPercent: number): number {
  const w = leaderboardWeightPercent / 100;
  return lbNorm * w;
}

function effectiveMaxTeamsPerReviewer(settings: { maxTeamsPerReviewer?: number | null }): number | null {
  const m = settings.maxTeamsPerReviewer;
  if (m == null || m < 1) return null;
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
async function assertCanUnassignReviewer(teamId: string, reviewerId: string) {
  const final = await db.teamFinalGrade.findUnique({ where: { teamId } });
  if (final) {
    const err = new Error("Cannot change assignments after the team score is finalized");
    (err as { statusCode?: number }).statusCode = 400;
    throw err;
  }

  const assignment = await db.teamAssignment.findUnique({
    where: { teamId_reviewerId: { teamId, reviewerId } },
  });
  if (!assignment) {
    const err = new Error("No assignment for this reviewer");
    (err as { statusCode?: number }).statusCode = 400;
    throw err;
  }

  const grade = await db.grade.findUnique({
    where: { teamId_reviewerId: { teamId, reviewerId } },
  });
  if (!grade) return;

  if (grade.status !== GradeStatus.IN_PROGRESS) {
    const err = new Error("Cannot unassign: this review was already submitted or finalized");
    (err as { statusCode?: number }).statusCode = 400;
    throw err;
  }
  if (grade.submittedAt != null) {
    const err = new Error("Cannot unassign: this review was already submitted");
    (err as { statusCode?: number }).statusCode = 400;
    throw err;
  }
}

/**
 * TeamAssignment references Grade on the same (teamId, reviewerId). Delete assignment first, then grade,
 * or Prisma rejects the operation (AssignmentGrade relation).
 */
async function removeReviewerFromTeamDb(teamId: string, reviewerId: string) {
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
export async function unassignReviewer(
  teamId: string,
  reviewerId: string,
  options?: {
    replacementReviewerId?: string | null;
    assignedBy?: string;
    sendMail?: boolean;
  }
) {
  const raw = options?.replacementReviewerId;
  const replacement = typeof raw === "string" && raw.trim() !== "" ? raw.trim() : null;
  if (replacement) {
    const assignedBy = options?.assignedBy;
    if (!assignedBy) throw new Error("assignedBy required");
    const sendMail = options?.sendMail !== false;
    const current = await db.teamAssignment.findMany({ where: { teamId } });
    const others = current.filter((c) => c.reviewerId !== reviewerId).map((c) => c.reviewerId);
    if (others.length !== REVIEWERS_PER_TEAM - 1) {
      const err = new Error(
        `Replacement requires exactly ${REVIEWERS_PER_TEAM - 1} other reviewer(s) on this team; use manual assign to fix assignments.`
      );
      (err as { statusCode?: number }).statusCode = 400;
      throw err;
    }
    if (replacement === reviewerId || others.includes(replacement)) {
      const err = new Error("Choose a different reviewer for the replacement");
      (err as { statusCode?: number }).statusCode = 400;
      throw err;
    }
    return setTeamReviewerPair(teamId, [...others, replacement], assignedBy, sendMail);
  }

  await assertCanUnassignReviewer(teamId, reviewerId);
  await removeReviewerFromTeamDb(teamId, reviewerId);
  return { teamId, reviewerId };
}

async function assertReviewerHasCapacity(reviewerId: string, maxTeams: number | null) {
  if (maxTeams == null) return;
  const n = await db.teamAssignment.count({ where: { reviewerId } });
  if (n >= maxTeams) {
    const err = new Error(`Reviewer is at the max number of team assignments (${maxTeams})`);
    (err as { statusCode?: number }).statusCode = 400;
    throw err;
  }
}

/** Chunk size for Point groupBy — huge `$in` lists are slow and stress the DB. */
const POINT_USER_ID_CHUNK = 300;

/** Sum of member points per team (batch). Chunks userIds so each query stays index-friendly. */
async function getTeamLeaderboardRawPointsBatch(teamIds: string[]): Promise<Map<string, number>> {
  if (teamIds.length === 0) return new Map();
  const members = await db.teamMember.findMany({
    where: { teamId: { in: teamIds } },
    select: { teamId: true, userId: true },
  });
  const userIds = [...new Set(members.map((m) => m.userId))];
  const rawByTeam = new Map<string, number>();
  for (const id of teamIds) rawByTeam.set(id, 0);
  if (userIds.length === 0) return rawByTeam;

  const byUser = new Map<string, number>();
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

export async function upsertActiveRubric(data: {
  name: string;
  description?: string | null;
  sections: unknown;
  maxScore?: number;
  rubricId?: string | null;
}) {
  const sections = data.sections as RubricJson;
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
        sections: data.sections as Prisma.InputJsonValue,
        maxScore: data.maxScore ?? 100,
        isActive: true,
      },
    });
  }

  return db.gradingRubric.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      sections: data.sections as Prisma.InputJsonValue,
      maxScore: data.maxScore ?? 100,
      isActive: true,
    },
  });
}

export async function setReviewerFlag(userId: string, isReviewer: boolean) {
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
      region: true,
      school: true,
    },
    orderBy: { lastName: "asc" },
  });
}

export async function reviewerWorkload() {
  const reviewers = await db.user.findMany({
    where: { isReviewer: true },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const counts = await Promise.all(
    reviewers.map(async (r) => {
      const assigned = await db.teamAssignment.count({ where: { reviewerId: r.id } });
      const pending = await db.grade.count({
        where: { reviewerId: r.id, status: GradeStatus.IN_PROGRESS },
      });
      return { ...r, assignedCount: assigned, pendingInProgress: pending };
    })
  );
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
      const readyToFinalize =
        totalGrades >= REVIEWERS_PER_TEAM && submitted >= REVIEWERS_PER_TEAM && !t.teamFinalGrade;
      let status: string;
      if (published) status = "PUBLISHED";
      else if (readyToFinalize) status = "READY_TO_FINALIZE";
      else status = "PENDING";

      const submittedGrades = t.grades
        .filter((g) => g.status === GradeStatus.SUBMITTED && g.totalScore != null)
        .sort((a, b) => a.reviewerId.localeCompare(b.reviewerId));
      const score1 = submittedGrades[0]?.totalScore ?? null;
      const score2 = submittedGrades[1]?.totalScore ?? null;
      const score3 = submittedGrades[2]?.totalScore ?? null;

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
        score3,
        canFinalize: readyToFinalize,
      };
    })
    .filter((x) => x.status !== "PUBLISHED");
}

async function assertNotTeamMember(reviewerId: string, teamId: string) {
  const m = await db.teamMember.findFirst({ where: { teamId, userId: reviewerId } });
  if (m) throw new Error("Reviewer cannot be assigned to their own team");
}

export async function createAssignmentsForTeam(
  teamId: string,
  reviewerIds: string[],
  assignedBy: string,
  sendMail: boolean
) {
  if (reviewerIds.length !== REVIEWERS_PER_TEAM) {
    throw new Error(`Exactly ${REVIEWERS_PER_TEAM} reviewers required per team`);
  }
  const uniq = new Set(reviewerIds);
  if (uniq.size !== reviewerIds.length) throw new Error("Duplicate reviewers");

  const rubric = await getActiveRubric();
  if (!rubric) throw new Error("No active grading rubric. Create one first.");

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });
  if (!team) throw new Error("Team not found");

  for (const rid of reviewerIds) {
    await assertNotTeamMember(rid, teamId);
    const u = await db.user.findUnique({ where: { id: rid }, select: { isReviewer: true } });
    if (!u?.isReviewer) throw new Error(`User ${rid} is not a reviewer`);
  }

  const rubricJson: RubricJson = { sections: parseRubricSections(rubric.sections) };
  const empty = buildEmptySectionScores(rubricJson);

  await db.$transaction(async (tx) => {
    for (const rid of reviewerIds) {
      await tx.teamAssignment.upsert({
        where: { teamId_reviewerId: { teamId, reviewerId: rid } },
        create: { teamId, reviewerId: rid, assignedBy },
        update: {},
      });

      await tx.grade.upsert({
        where: { teamId_reviewerId: { teamId, reviewerId: rid } },
        create: {
          teamId,
          rubricId: rubric.id,
          reviewerId: rid,
          sectionScores: empty as unknown as Prisma.InputJsonValue,
          totalScore: 0,
          status: GradeStatus.IN_PROGRESS,
          pairedReviewerUserId: null,
        },
        update: {
          pairedReviewerUserId: null,
          rubricId: rubric.id,
        },
      });
    }
  });

  if (sendMail) {
    for (const rid of reviewerIds) {
      const u = await db.user.findUnique({ where: { id: rid } });
      if (u) await notifyTeamAssignment(u.email, u.firstName, team.name, team.id);
    }
  }

  return { teamId, reviewerIds };
}

/**
 * Sets exactly two reviewers for a team: removes previous reviewers not in the new pair when allowed
 * (draft only), then upserts the pair. Use this for manual assign and reviewer swaps.
 */
export async function setTeamReviewerPair(
  teamId: string,
  reviewerIds: string[],
  assignedBy: string,
  sendMail: boolean
) {
  if (reviewerIds.length !== REVIEWERS_PER_TEAM) {
    throw new Error(`Exactly ${REVIEWERS_PER_TEAM} reviewers required per team`);
  }
  const uniq = new Set(reviewerIds);
  if (uniq.size !== reviewerIds.length) throw new Error("Duplicate reviewers");

  const settings = await getGradingSettings();
  const maxTeams = effectiveMaxTeamsPerReviewer(settings);

  const current = await db.teamAssignment.findMany({ where: { teamId } });
  const initialIds = new Set(current.map((c) => c.reviewerId));
  const newSet = new Set(reviewerIds);

  for (const rid of reviewerIds) {
    await assertNotTeamMember(rid, teamId);
    const u = await db.user.findUnique({ where: { id: rid }, select: { isReviewer: true } });
    if (!u?.isReviewer) throw new Error(`User ${rid} is not a reviewer`);
  }

  for (const rid of reviewerIds) {
    if (initialIds.has(rid)) continue;
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

export async function autoAssignReviewers(options?: {
  excludeReviewerIds?: string[];
  teamIds?: string[];
  assignedBy?: string;
  sendMail?: boolean;
  /** Skip reviewers whose region matches the team lead region (reduces same-region bias). */
  excludeReviewersSameRegionAsTeam?: boolean;
}): Promise<{
  assigned: number;
  teams: { teamId: string; reviewerIds: string[] }[];
  skipped: { teamId: string; reason: string }[];
  errors: { teamId: string; teamName: string | null; message: string }[];
}> {
  const exclude = new Set(options?.excludeReviewerIds ?? []);
  const rubric = await getActiveRubric();
  if (!rubric) throw new Error("No active grading rubric");

  const settings = await getGradingSettings();
  const maxTeams = effectiveMaxTeamsPerReviewer(settings);

  const reviewers = await db.user.findMany({
    where: {
      isReviewer: true,
      ...(exclude.size > 0 ? { id: { notIn: [...exclude] } } : {}),
    },
    select: { id: true, region: true },
  });
  if (reviewers.length < REVIEWERS_PER_TEAM) {
    throw new Error(`Not enough reviewers (need at least ${REVIEWERS_PER_TEAM}, excluding blocked list)`);
  }

  const teamWhere = options?.teamIds?.length ? { id: { in: options.teamIds } } : {};
  const teams = await db.team.findMany({
    where: teamWhere,
    include: {
      members: { select: { userId: true } },
      teamAssignments: { select: { reviewerId: true } },
    },
  });

  const load = new Map<string, number>();
  for (const r of reviewers) load.set(r.id, 0);
  const counts = await db.teamAssignment.groupBy({
    by: ["reviewerId"],
    _count: { _all: true },
  });
  for (const row of counts) {
    load.set(row.reviewerId, row._count._all);
  }

  const assignedBy = options?.assignedBy ?? reviewers[0]!.id;
  const sendMail = options?.sendMail !== false;
  const excludeSameRegion = options?.excludeReviewersSameRegionAsTeam === true;
  const results: { teamId: string; reviewerIds: string[] }[] = [];
  const skipped: { teamId: string; reason: string }[] = [];
  const errors: { teamId: string; teamName: string | null; message: string }[] = [];

  for (const team of teams) {
    const n = team.teamAssignments.length;
    if (n >= REVIEWERS_PER_TEAM) continue;

    const needed = REVIEWERS_PER_TEAM - n;
    const memberIds = new Set(team.members.map((m) => m.userId));
    const existingIds = new Set(team.teamAssignments.map((t) => t.reviewerId));
    const existingList = team.teamAssignments.map((t) => t.reviewerId);

    let teamRegion: string | null = null;
    if (excludeSameRegion) {
      teamRegion = await getTeamLeadRegion(team.id);
    }

    let candidates = reviewers
      .filter((r) => {
        if (memberIds.has(r.id) || existingIds.has(r.id)) return false;
        if (excludeSameRegion && teamRegion && sameRegion(r.region, teamRegion)) return false;
        return true;
      })
      .map((r) => ({ id: r.id, w: load.get(r.id) ?? 0 }))
      .sort((x, y) => x.w - y.w);

    if (maxTeams != null) {
      candidates = candidates.filter((c) => c.w < maxTeams);
    }

    if (candidates.length < needed) {
      skipped.push({ teamId: team.id, reason: "not_enough_eligible_reviewers" });
      logger.warn(
        { teamId: team.id, needed, available: candidates.length },
        "autoAssign: not enough eligible reviewers for team"
      );
      continue;
    }

    const pick: string[] = [];
    for (const c of candidates) {
      if (pick.length >= needed) break;
      pick.push(c.id);
    }
    if (pick.length < needed) {
      skipped.push({ teamId: team.id, reason: "not_enough_eligible_reviewers" });
      continue;
    }

    try {
      const allIds = [...existingList, ...pick];
      await setTeamReviewerPair(team.id, allIds, assignedBy, sendMail);
      for (const id of pick) {
        load.set(id, (load.get(id) ?? 0) + 1);
      }
      results.push({ teamId: team.id, reviewerIds: allIds });
    } catch (e) {
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

export async function manualAssign(
  pairs: { teamId: string; reviewerIds: string[] }[],
  assignedBy: string,
  sendMail = true
) {
  const out: { teamId: string; reviewerIds: string[] }[] = [];
  for (const p of pairs) {
    const r = await setTeamReviewerPair(p.teamId, p.reviewerIds, assignedBy, sendMail);
    out.push(r);
  }
  return { assigned: out.length, teams: out };
}

/** Assign the same N reviewers to many teams (e.g. after filtering by region). */
export async function bulkAssignReviewersToTeams(
  teamIds: string[],
  reviewerIds: string[],
  assignedBy: string,
  sendMail: boolean,
  options?: { rejectReviewersFromTeamRegion?: boolean }
) {
  if (!teamIds.length) throw new Error("teamIds required");
  if (reviewerIds.length !== REVIEWERS_PER_TEAM) {
    throw new Error(`Exactly ${REVIEWERS_PER_TEAM} reviewers required`);
  }
  const uniq = new Set(reviewerIds);
  if (uniq.size !== reviewerIds.length) throw new Error("Duplicate reviewers");
  const results: { teamId: string; reviewerIds: string[] }[] = [];
  const errors: { teamId: string; message: string }[] = [];
  for (const teamId of teamIds) {
    try {
      if (options?.rejectReviewersFromTeamRegion) {
        const tr = await getTeamLeadRegion(teamId);
        for (const rid of reviewerIds) {
          const u = await db.user.findUnique({ where: { id: rid }, select: { region: true } });
          if (sameRegion(u?.region, tr)) {
            throw new Error(`Reviewer is from the same region as this team`);
          }
        }
      }
      await setTeamReviewerPair(teamId, reviewerIds, assignedBy, sendMail);
      results.push({ teamId, reviewerIds });
    } catch (e) {
      errors.push({ teamId, message: e instanceof Error ? e.message : String(e) });
    }
  }
  return { assigned: results.length, teams: results, errors };
}

/** Current reviewer assignments for one team (manual assign pre-fill: 0, 1, or 2 reviewers). */
export async function getTeamReviewerAssignments(teamId: string) {
  const team = await db.team.findUnique({ where: { id: teamId }, select: { id: true } });
  if (!team) {
    const err = new Error("Team not found");
    (err as { statusCode?: number }).statusCode = 404;
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

export async function getAssignmentsForReviewer(reviewerId: string) {
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

export async function submitGrade(
  teamId: string,
  reviewerId: string,
  body: { sectionScores: Record<string, SectionScoreInput>; feedback?: string | null }
) {
  const assignment = await db.teamAssignment.findUnique({
    where: { teamId_reviewerId: { teamId, reviewerId } },
  });
  if (!assignment) throw new Error("You are not assigned to this team");

  await assertNotTeamMember(reviewerId, teamId);

  const grade = await db.grade.findUnique({
    where: { teamId_reviewerId: { teamId, reviewerId } },
    include: { rubric: true },
  });
  if (!grade) throw new Error("Grade record missing — contact admin");

  const rubricJson: RubricJson = { sections: parseRubricSections(grade.rubric.sections) };
  const { total, errors } = computeTotalScore(rubricJson, body.sectionScores);
  if (errors.length) {
    const err = new Error(errors.join("; "));
    (err as any).statusCode = 400;
    throw err;
  }

  const updated = await db.grade.update({
    where: { id: grade.id },
    data: {
      sectionScores: body.sectionScores as unknown as Prisma.InputJsonValue,
      totalScore: total,
      feedback: body.feedback ?? null,
      status: GradeStatus.SUBMITTED,
      submittedAt: new Date(),
    },
  });

  const others = await db.teamAssignment.findMany({
    where: { teamId, reviewerId: { not: reviewerId } },
    select: { reviewerId: true },
  });
  const reviewer = await db.user.findUnique({ where: { id: reviewerId } });
  const team = await db.team.findUnique({ where: { id: teamId } });
  if (reviewer && team) {
    const pairName = `${reviewer.firstName} ${reviewer.lastName}`;
    for (const o of others) {
      const other = await db.user.findUnique({ where: { id: o.reviewerId } });
      if (other) await notifyPeerReviewSubmitted(other.email, other.firstName, team.name, pairName);
    }
  }

  return updated;
}

export async function getTeamReviews(teamId: string, viewerUserId: string, isAdmin: boolean) {
  if (!isAdmin) {
    const assignment = await db.teamAssignment.findUnique({
      where: { teamId_reviewerId: { teamId, reviewerId: viewerUserId } },
    });
    if (!assignment) {
      const err = new Error("Not assigned to review this team");
      (err as any).statusCode = 403;
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
  const viewerSubmitted = mine?.status === GradeStatus.SUBMITTED;

  const others =
    viewerSubmitted || !mine
      ? grades
          .filter((g) => g.reviewerId !== viewerUserId)
          .map((g) => ({
            reviewerName: `${g.reviewer.firstName} ${g.reviewer.lastName}`,
            submitted: g.status === GradeStatus.SUBMITTED,
            scoresHidden: true,
          }))
      : [];

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
    /** Until this reviewer submits, peer progress is hidden (blind review). */
    peersHiddenUntilYouSubmit: mine ? !viewerSubmitted : false,
  };
}

export async function teamLeaderboardPoints(teamId: string): Promise<number> {
  const members = await db.teamMember.findMany({ where: { teamId }, select: { userId: true } });
  if (!members.length) return 0;
  const ids = members.map((m) => m.userId);
  const agg = await db.point.aggregate({
    where: { userId: { in: ids } },
    _sum: { amount: true },
  });
  return agg._sum.amount ?? 0;
}

/** 0–100 scale: cap &gt; 0 → min(100, raw/cap*100); cap === 0 → relative to highest team. */
function computeNormalizedLeaderboard(
  rawByTeam: Map<string, number>,
  teamIds: string[],
  cap: number
): Map<string, number> {
  const norm = new Map<string, number>();
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
    if (raw > max) max = raw;
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
function effectiveLeaderboardCap(settings: { leaderboardPointsMax?: number | null }): number {
  const v = settings.leaderboardPointsMax;
  if (v === undefined || v === null) return 5000;
  return v;
}

export async function normalizeTeamLeaderboardScores(): Promise<Map<string, number>> {
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
export async function getNormalizedLeaderboardScoreForTeam(teamId: string): Promise<number> {
  const settings = await getGradingSettings();
  const cap = effectiveLeaderboardCap(settings);
  const raw = await teamLeaderboardPoints(teamId);

  if (cap > 0) {
    return Math.min(100, (raw / cap) * 100);
  }

  const norm = await normalizeTeamLeaderboardScores();
  return norm.get(teamId) ?? 0;
}

export async function finalizeTeamGrade(teamId: string) {
  const rubric = await getActiveRubric();
  if (!rubric) throw new Error("No active rubric");

  const grades = await db.grade.findMany({
    where: { teamId, status: GradeStatus.SUBMITTED },
  });
  if (grades.length < REVIEWERS_PER_TEAM) {
    throw new Error(`All ${REVIEWERS_PER_TEAM} reviewers must submit before finalizing`);
  }

  const scores = grades.map((g) => g.totalScore);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  let diffPct = 0;
  if (scores.length >= 2) {
    let maxPairDiff = 0;
    for (let i = 0; i < scores.length; i++) {
      for (let j = i + 1; j < scores.length; j++) {
        const s0 = scores[i] ?? 0;
        const s1 = scores[j] ?? 0;
        const mid = (s0 + s1) / 2;
        const d = mid > 0 ? (Math.abs(s0 - s1) / mid) * 100 : s0 !== s1 ? 100 : 0;
        if (d > maxPairDiff) maxPairDiff = d;
      }
    }
    diffPct = maxPairDiff;
  }

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

export async function setLeaderboardConfig(params: {
  leaderboardScorePercent?: number;
  leaderboardPointsMax?: number;
  maxTeamsPerReviewer?: number | null;
}) {
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
export async function getRankedLeaderboardTeamsFull(opts?: {
  region?: string | null;
}): Promise<LeaderboardTeamsPageResult["teams"]> {
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
  const teamRegions = await getTeamRegionsBatch(teamIds);

  let rawByTeam: Map<string, number>;
  let norm: Map<string, number>;

  if (cap > 0) {
    rawByTeam = await getTeamLeaderboardRawPointsBatch(teamIds);
    norm = computeNormalizedLeaderboard(rawByTeam, teamIds, cap);
  } else {
    rawByTeam = await getTeamLeaderboardRawPointsBatch(teamIds);
    const fullNorm = await normalizeTeamLeaderboardScores();
    norm = new Map<string, number>();
    for (const id of teamIds) {
      norm.set(id, fullNorm.get(id) ?? 0);
    }
  }

  const maxCap = effectiveLeaderboardCap(settings);

  type FinalGradeRow = {
    finalScore: number;
    reviewerAverageScore: number;
    leaderboardScoreNormalized: number;
    leaderboardWeightPercent: number;
    publishedAt: Date | null;
  };

  type Enriched = {
    teamId: string;
    teamName: string;
    region: string | null;
    rawLeaderboardPoints: number;
    normalizedLeaderboard: number;
    leaderboardPointsMax: number;
    leaderboardWeightPercent: number;
    score1: number | null;
    score2: number | null;
    score3: number | null;
    reviewerAverageScore: number | null;
    reviewerContributionPoints: number | null;
    leaderboardContributionPoints: number;
    blendFinal: number | null;
    finalGrade: FinalGradeRow | null;
    sortKey: number;
  };

  const enriched: Enriched[] = [];

  for (const t of allTeams) {
    const lb = norm.get(t.id) ?? 0;
    const fg = t.teamFinalGrade;

    const done = t.grades
      .filter((g) => isGradeCompleteForReviewer(g.status))
      .sort((a, b) => a.reviewerId.localeCompare(b.reviewerId));
    const scores = done.map((g) => g.totalScore);
    const score1 = scores[0] ?? null;
    const score2 = scores[1] ?? null;
    const score3 = scores[2] ?? null;
    const teamRegion = teamRegions.get(t.id) ?? null;

    const finiteScores = scores.filter((s): s is number => typeof s === "number" && Number.isFinite(s));

    /** Unweighted mean of submitted reviewer totals (rubric 0–100). */
    let reviewerAverageScore: number | null = null;
    if (finiteScores.length > 0) {
      reviewerAverageScore = finiteScores.reduce((a, b) => a + b, 0) / finiteScores.length;
    }

    const allReviewersComplete =
      done.length >= REVIEWERS_PER_TEAM &&
      score1 != null &&
      score2 != null &&
      score3 != null &&
      Number.isFinite(score1) &&
      Number.isFinite(score2) &&
      Number.isFinite(score3);

    let blendFinal: number | null = null;
    let reviewerContributionPts: number | null = null;
    let leaderboardContributionPts: number;
    /** Weight % for LB shown on row: current settings when live; else stored on final grade. */
    let rowLeaderboardWeightPercent = lbWeightPct;

    if (allReviewersComplete) {
      /**
       * All reviews in: always derive Final, Wtd rev, and LB pts from **live** scores and **live** normalized LB.
       */
      rowLeaderboardWeightPercent = lbWeightPct;
      reviewerContributionPts = reviewerContributionPoints(reviewerAverageScore!, lbWeightPct);
      leaderboardContributionPts = leaderboardContributionPoints(lb, lbWeightPct);
      blendFinal = blendReviewerAndLeaderboard(reviewerAverageScore!, lb, lbWeightPct);
    } else if (fg) {
      blendFinal = Math.min(100, Math.max(0, fg.finalScore));
      rowLeaderboardWeightPercent = fg.leaderboardWeightPercent;
      reviewerContributionPts = reviewerContributionPoints(fg.reviewerAverageScore, fg.leaderboardWeightPercent);
      leaderboardContributionPts = leaderboardContributionPoints(fg.leaderboardScoreNormalized, fg.leaderboardWeightPercent);
    } else if (reviewerAverageScore != null) {
      /** One reviewer or partial: live preview with current settings. */
      reviewerContributionPts = reviewerContributionPoints(reviewerAverageScore, lbWeightPct);
      leaderboardContributionPts = leaderboardContributionPoints(lb, lbWeightPct);
      blendFinal = blendReviewerAndLeaderboard(reviewerAverageScore, lb, lbWeightPct);
    } else {
      leaderboardContributionPts = leaderboardContributionPoints(lb, lbWeightPct);
    }

    const sortKey = blendFinal != null ? blendFinal : -Infinity;

    enriched.push({
      teamId: t.id,
      teamName: t.name,
      region: teamRegion,
      rawLeaderboardPoints: rawByTeam.get(t.id) ?? 0,
      normalizedLeaderboard: lb,
      leaderboardPointsMax: maxCap,
      leaderboardWeightPercent: rowLeaderboardWeightPercent,
      score1,
      score2,
      score3,
      reviewerAverageScore,
      reviewerContributionPoints: reviewerContributionPts,
      leaderboardContributionPoints: leaderboardContributionPts,
      blendFinal,
      finalGrade: fg,
      sortKey,
    });
  }

  let ranked = enriched;
  if (opts?.region?.trim()) {
    const want = opts.region.trim().toLowerCase();
    ranked = enriched.filter((r) => (r.region ?? "").toLowerCase() === want);
  }

  ranked.sort((a, b) => b.sortKey - a.sortKey);

  return ranked.map((row, i) => {
    const { sortKey, ...rest } = row;
    return { ...rest, rank: i + 1 };
  });
}

/**
 * Paginated admin leaderboard: global rank by blend score (finalized score when present, else live preview).
 * Preview = reviewerAverage × (1 − w) + normalizedLeaderboard × w, capped at 100.
 */
export async function getLeaderboardTeamsReport(params?: {
  page?: number;
  limit?: number;
  region?: string | null;
}): Promise<LeaderboardTeamsPageResult> {
  const page = Math.max(1, Math.floor(Number(params?.page) || 1));
  const limit = Math.min(
    LEADERBOARD_TEAMS_MAX_LIMIT,
    Math.max(1, Math.floor(Number(params?.limit) || LEADERBOARD_TEAMS_DEFAULT_LIMIT))
  );

  const ranked = await getRankedLeaderboardTeamsFull(
    params?.region != null && params.region !== "" ? { region: params.region } : {}
  );
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

export async function finalizeTeamGradesBulk(teamIds: string[]) {
  const unique = [...new Set(teamIds.filter(Boolean))];
  const succeeded: string[] = [];
  const failed: { teamId: string; message: string }[] = [];
  for (const teamId of unique) {
    try {
      await finalizeTeamGrade(teamId);
      succeeded.push(teamId);
    } catch (e) {
      failed.push({
        teamId,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return { succeeded, failed };
}

export async function applyLeaderboardToFinal(teamId?: string) {
  const settings = await getGradingSettings();
  const w = settings.leaderboardScorePercent / 100;
  const norm = await normalizeTeamLeaderboardScores();
  const finals = teamId
    ? await db.teamFinalGrade.findMany({ where: { teamId } })
    : await db.teamFinalGrade.findMany();

  const updated: string[] = [];
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

export async function publishTeamFinal(teamId: string) {
  const fg = await db.teamFinalGrade.findUnique({ where: { teamId } });
  if (!fg) throw new Error("Finalize grades before publishing");

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: { members: { include: { user: true } } },
  });
  if (!team) throw new Error("Team not found");

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

export async function getReviewerDashboard(userId: string) {
  const reviewer = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true, isReviewer: true },
  });
  if (!reviewer?.isReviewer) throw new Error("Not a reviewer");

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

    const otherAssignments = await db.teamAssignment.findMany({
      where: { teamId: a.teamId, reviewerId: { not: userId } },
      include: { reviewer: { select: { firstName: true, lastName: true } } },
    });

    const otherReviewers: { name: string; submitted: boolean }[] = [];
    for (const asg of otherAssignments) {
      const pg = await db.grade.findUnique({
        where: { teamId_reviewerId: { teamId: a.teamId, reviewerId: asg.reviewerId } },
      });
      otherReviewers.push({
        name: `${asg.reviewer.firstName} ${asg.reviewer.lastName}`,
        submitted: pg?.status === GradeStatus.SUBMITTED,
      });
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
      /** @deprecated Use otherReviewers; kept for older clients (first peer when you have submitted). */
      pairedReviewer: otherReviewers[0] ?? null,
      otherReviewers,
    });
  }

  const totalAssigned = assignedTeams.length;
  const completed = assignedTeams.filter((t) =>
    t.grade?.status ? isGradeCompleteForReviewer(t.grade.status as GradeStatus) : false
  ).length;

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
export async function getGradingReports(region?: string | null) {
  const [rankedLb, teams] = await Promise.all([
    getRankedLeaderboardTeamsFull(region != null && region !== "" ? { region } : {}),
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
      if (!t) return null;
      const finalScore = t.teamFinalGrade?.finalScore ?? null;
      const publishedAt = t.teamFinalGrade?.publishedAt?.toISOString() ?? null;
      /** Prefer live average from ranking row (matches S1/S2); fall back to stored final. */
      const reviewerAverageScore =
        lb.reviewerAverageScore ?? t.teamFinalGrade?.reviewerAverageScore ?? null;
      return {
        teamId: t.id,
        teamName: t.name,
        school: t.school,
        region: lb.region ?? null,
        projectTitle: t.projectTitle,
        assignmentCount: t.teamAssignments.length,
        finalScore,
        reviewerAverageScore,
        publishedAt,
        rank: lb.rank,
        score1: lb.score1,
        score2: lb.score2,
        score3: lb.score3,
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
    .filter((r): r is NonNullable<typeof r> => r != null);

  return { teams: rows, generatedAt: new Date().toISOString() };
}

export async function getGradingReportTeamDetail(teamId: string) {
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
    const err = new Error("Team not found") as Error & { statusCode?: number };
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
