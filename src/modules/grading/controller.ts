import type { Request, Response } from "express";
import { logger } from "../../shared/utils/logger";
import * as GradingService from "./service";

function uid(req: Request): string | undefined {
  const u = (req as any).user;
  return u?.id || u?.userId;
}

function requireUid(req: Request, res: Response): string | null {
  const id = uid(req);
  if (!id) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return null;
  }
  return id;
}

function isAdminUser(req: Request): boolean {
  const raw = (req as any).user?.role;
  const role = typeof raw === "string" ? raw.replace(/-/g, "_").toUpperCase() : raw;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

function sendErr(res: Response, e: unknown, fallback = 500) {
  const err = e as { statusCode?: number; message?: string };
  const code = typeof err?.statusCode === "number" ? err.statusCode : fallback;
  const message = err?.message || "Server error";
  logger.warn({ err: message }, "grading controller error");
  return res.status(code).json({ success: false, message });
}

export class GradingController {
  static async getRubric(_req: Request, res: Response) {
    try {
      const rubric = await GradingService.getActiveRubric();
      return res.json({ success: true, data: rubric });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async postRubric(req: Request, res: Response) {
    try {
      const { name, description, sections, maxScore, rubricId } = req.body;
      const rubric = await GradingService.upsertActiveRubric({
        name,
        description,
        sections,
        maxScore,
        rubricId,
      });
      return res.json({ success: true, data: rubric });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async setReviewer(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ success: false, message: "userId required" });
      }
      const { isReviewer } = req.body as { isReviewer: boolean };
      if (typeof isReviewer !== "boolean") {
        return res.status(400).json({ success: false, message: "isReviewer boolean required" });
      }
      const user = await GradingService.setReviewerFlag(userId, isReviewer);
      return res.json({ success: true, data: user });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async listReviewers(_req: Request, res: Response) {
    try {
      const data = await GradingService.listReviewers();
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async reviewerWorkload(_req: Request, res: Response) {
    try {
      const data = await GradingService.reviewerWorkload();
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async pendingGrades(_req: Request, res: Response) {
    try {
      const data = await GradingService.getPendingGradesTeams();
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async autoAssign(req: Request, res: Response) {
    try {
      const { excludeReviewerIds, teamIds, sendMail, excludeReviewersSameRegionAsTeam } = req.body || {};
      const assignedBy = requireUid(req, res);
      if (!assignedBy) return;
      const data = await GradingService.autoAssignReviewers({
        excludeReviewerIds,
        teamIds,
        assignedBy,
        sendMail,
        excludeReviewersSameRegionAsTeam: Boolean(excludeReviewersSameRegionAsTeam),
      });
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async bulkAssignSameReviewers(req: Request, res: Response) {
    try {
      const { teamIds, reviewerIds, sendMail, rejectReviewersFromTeamRegion } = req.body as {
        teamIds?: string[];
        reviewerIds?: string[];
        sendMail?: boolean;
        rejectReviewersFromTeamRegion?: boolean;
      };
      if (!Array.isArray(teamIds) || !Array.isArray(reviewerIds)) {
        return res.status(400).json({ success: false, message: "teamIds and reviewerIds arrays required" });
      }
      const assignedBy = requireUid(req, res);
      if (!assignedBy) return;
      const data = await GradingService.bulkAssignReviewersToTeams(
        teamIds,
        reviewerIds,
        assignedBy,
        sendMail !== false,
        { rejectReviewersFromTeamRegion: Boolean(rejectReviewersFromTeamRegion) }
      );
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async manualAssign(req: Request, res: Response) {
    try {
      const { assignments, sendMail } = req.body as {
        assignments: { teamId: string; reviewerIds: string[] }[];
        sendMail?: boolean;
      };
      if (!Array.isArray(assignments)) {
        return res.status(400).json({ success: false, message: "assignments array required" });
      }
      const assignedBy = requireUid(req, res);
      if (!assignedBy) return;
      const data = await GradingService.manualAssign(assignments, assignedBy, sendMail !== false);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async unassignReviewer(req: Request, res: Response) {
    try {
      const { teamId, reviewerId, replacementReviewerId, sendMail } = (req.body || {}) as {
        teamId?: string;
        reviewerId?: string;
        replacementReviewerId?: string | null;
        sendMail?: boolean;
      };
      if (!teamId || !reviewerId) {
        return res.status(400).json({ success: false, message: "teamId and reviewerId required" });
      }
      const assignedBy = requireUid(req, res);
      if (!assignedBy) return;
      const data = await GradingService.unassignReviewer(teamId, reviewerId, {
        assignedBy,
        ...(replacementReviewerId !== undefined && { replacementReviewerId: replacementReviewerId ?? null }),
        ...(sendMail !== undefined && { sendMail }),
      });
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async assignmentsForTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "teamId required" });
      }
      const data = await GradingService.getTeamReviewerAssignments(teamId);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async listAssignments(_req: Request, res: Response) {
    try {
      const data = await GradingService.listAllAssignments();
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async unassignAllEligible(_req: Request, res: Response) {
    try {
      const data = await GradingService.unassignAllEligibleDraftAssignments();
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async reviewerAssignments(req: Request, res: Response) {
    try {
      const id = requireUid(req, res);
      if (!id) return;
      const data = await GradingService.getAssignmentsForReviewer(id);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async submitGrade(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "teamId required" });
      }
      const reviewerId = requireUid(req, res);
      if (!reviewerId) return;
      const body = req.body as { sectionScores: Record<string, unknown>; feedback?: string };
      if (!body?.sectionScores) {
        return res.status(400).json({ success: false, message: "sectionScores required" });
      }
      const data = await GradingService.submitGrade(teamId, reviewerId, {
        sectionScores: body.sectionScores as any,
        feedback: body.feedback ?? null,
      });
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async getTeamReviews(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "teamId required" });
      }
      const viewer = requireUid(req, res);
      if (!viewer) return;
      const data = await GradingService.getTeamReviews(teamId, viewer, isAdminUser(req));
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async finalize(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "teamId required" });
      }
      const data = await GradingService.finalizeTeamGrade(teamId);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async leaderboardConfigGet(_req: Request, res: Response) {
    try {
      const data = await GradingService.getGradingSettings();
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async leaderboardConfigPost(req: Request, res: Response) {
    try {
      const { leaderboardScorePercent, leaderboardPointsMax, maxTeamsPerReviewer } = req.body as {
        leaderboardScorePercent?: number;
        leaderboardPointsMax?: number;
        maxTeamsPerReviewer?: number | null;
      };
      if (
        leaderboardScorePercent == null &&
        leaderboardPointsMax == null &&
        maxTeamsPerReviewer === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Provide at least one setting to update",
        });
      }
      const data = await GradingService.setLeaderboardConfig({
        ...(leaderboardScorePercent != null && {
          leaderboardScorePercent: Number(leaderboardScorePercent),
        }),
        ...(leaderboardPointsMax != null && {
          leaderboardPointsMax: Number(leaderboardPointsMax),
        }),
        ...(maxTeamsPerReviewer !== undefined && {
          maxTeamsPerReviewer:
            maxTeamsPerReviewer === null ? null : Number(maxTeamsPerReviewer),
        }),
      });
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async finalizeBulk(req: Request, res: Response) {
    try {
      const { teamIds } = req.body as { teamIds?: string[] };
      if (!Array.isArray(teamIds)) {
        return res.status(400).json({ success: false, message: "teamIds array required" });
      }
      const data = await GradingService.finalizeTeamGradesBulk(teamIds);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async leaderboardTeams(req: Request, res: Response) {
    try {
      const region = typeof req.query.region === "string" ? req.query.region : undefined;
      const data = await GradingService.getLeaderboardTeamsReport({
        ...(req.query.page != null ? { page: Number(req.query.page) } : {}),
        ...(req.query.limit != null ? { limit: Number(req.query.limit) } : {}),
        ...(region != null && region !== "" ? { region } : {}),
      });
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async leaderboardApply(req: Request, res: Response) {
    try {
      const { teamId } = (req.body || {}) as { teamId?: string };
      const data = await GradingService.applyLeaderboardToFinal(teamId);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async publish(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "teamId required" });
      }
      const data = await GradingService.publishTeamFinal(teamId);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }

  static async reviewerDashboard(req: Request, res: Response) {
    try {
      const id = requireUid(req, res);
      if (!id) return;
      const data = await GradingService.getReviewerDashboard(id);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 403);
    }
  }

  static async gradingReports(req: Request, res: Response) {
    try {
      const region = typeof req.query.region === "string" ? req.query.region : undefined;
      const data = await GradingService.getGradingReports(region && region !== "" ? region : undefined);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async gradingReportTeamDetail(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      if (!teamId) {
        return res.status(400).json({ success: false, message: "teamId required" });
      }
      const data = await GradingService.getGradingReportTeamDetail(teamId);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e);
    }
  }

  static async adminDeleteGrade(req: Request, res: Response) {
    try {
      const { teamId, reviewerId } = req.params;
      if (!teamId || !reviewerId) {
        return res.status(400).json({ success: false, message: "teamId and reviewerId required" });
      }
      const data = await GradingService.adminDeleteReviewerGrade(teamId, reviewerId);
      return res.json({ success: true, data });
    } catch (e) {
      return sendErr(res, e, 400);
    }
  }
}
