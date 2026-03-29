import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export class LeaderboardService {
    static async getUserRank(userId) {
        try {
            const userPoints = await db.point.aggregate({
                where: { userId },
                _sum: { amount: true },
            });
            const totalTP = userPoints._sum.amount || 0;
            const usersAbove = await db.point.groupBy({
                by: ["userId"],
                _sum: { amount: true },
                having: { amount: { _sum: { gt: totalTP } } },
            });
            const rank = usersAbove.length + 1;
            const totalUsers = await db.user.count({ where: { isVerified: true } });
            const percentile = ((totalUsers - rank + 1) / totalUsers) * 100;
            const oneWeekAgo = new Date(Date.now() - SEVEN_DAYS_MS);
            const previousPoints = await db.point.aggregate({
                where: { userId, createdAt: { lte: oneWeekAgo } },
                _sum: { amount: true },
            });
            const previousTP = previousPoints._sum.amount || 0;
            const tpChange = totalTP - previousTP;
            const previousUsersAbove = await db.point.groupBy({
                by: ["userId"],
                where: { createdAt: { lte: oneWeekAgo } },
                _sum: { amount: true },
                having: { amount: { _sum: { gt: previousTP } } },
            });
            const previousRank = previousUsersAbove.length + 1;
            const rankChange = previousRank - rank;
            return {
                userId,
                rank,
                totalTP,
                rankChange,
                previousRank,
                tpChange,
                percentile: Math.round(percentile * 10) / 10,
            };
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to get user rank");
            throw error;
        }
    }
    static async getStudentsLeaderboard(query) {
        try {
            const { page = 1, limit = 20, search, school, minTP, maxTP } = query;
            const skip = (page - 1) * limit;
            const userPoints = await db.point.groupBy({
                by: ["userId"],
                _sum: { amount: true },
                orderBy: { _sum: { amount: "desc" } },
            });
            let filteredUserPoints = userPoints;
            if (minTP !== undefined || maxTP !== undefined) {
                filteredUserPoints = userPoints.filter((up) => {
                    const tp = up._sum.amount || 0;
                    if (minTP !== undefined && tp < minTP)
                        return false;
                    if (maxTP !== undefined && tp > maxTP)
                        return false;
                    return true;
                });
            }
            const whereClause = {
                id: { in: filteredUserPoints.map((up) => up.userId) },
                isVerified: true,
            };
            if (search) {
                whereClause.OR = [
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ];
            }
            if (school) {
                whereClause.school = { contains: school, mode: "insensitive" };
            }
            const users = await db.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    school: true,
                    profilePhoto: true,
                    userBadges: { select: { badgeId: true } },
                },
            });
            const userMap = new Map(users.map((u) => [u.id, u]));
            const tpMap = new Map(filteredUserPoints.map((up) => [up.userId, up._sum.amount || 0]));
            const matched = [];
            for (const up of filteredUserPoints) {
                const user = userMap.get(up.userId);
                if (user)
                    matched.push({ user, tp: tpMap.get(up.userId) || 0 });
            }
            const total = matched.length;
            const pageSlice = matched.slice(skip, skip + limit);
            const pageUserIds = pageSlice.map((m) => m.user.id);
            const trendMap = await this.batchActivityTrends(pageUserIds);
            let currentRank = skip + 1;
            const leaderboard = pageSlice.map((m, i) => {
                const firstName = m.user.firstName || "";
                const lastName = m.user.lastName || "";
                return {
                    id: m.user.id,
                    userId: m.user.id,
                    rank: skip + i + 1,
                    name: `${firstName} ${lastName}`.trim() || "Unknown",
                    school: m.user.school || "N/A",
                    avatarUrl: m.user.profilePhoto,
                    initials: this.generateInitials(firstName, lastName),
                    totalTP: m.tp,
                    badges: m.user.userBadges.map((ub) => ub.badgeId),
                    activityTrend: trendMap.get(m.user.id) || 0,
                    rankChange: 0,
                    email: m.user.email,
                };
            });
            return {
                students: leaderboard,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        }
        catch (error) {
            logger.error({ error }, "Failed to get students leaderboard");
            throw error;
        }
    }
    static async getTop3Students() {
        try {
            const result = await this.getStudentsLeaderboard({ page: 1, limit: 3 });
            return result.students;
        }
        catch (error) {
            logger.error({ error }, "Failed to get top 3 students");
            throw error;
        }
    }
    static async getTeamsLeaderboard(query) {
        try {
            const { page = 1, limit = 20, search, school } = query;
            const skip = (page - 1) * limit;
            const teams = await db.team.findMany({
                where: {
                    ...(search && { name: { contains: search, mode: "insensitive" } }),
                    ...(school && { school: { contains: school, mode: "insensitive" } }),
                },
                select: {
                    id: true,
                    name: true,
                    school: true,
                    members: {
                        select: {
                            userId: true,
                            user: {
                                select: { id: true, firstName: true, lastName: true },
                            },
                        },
                    },
                },
            });
            const allMemberIds = [...new Set(teams.flatMap((t) => t.members.map((m) => m.userId)))];
            const pointsByUser = new Map();
            if (allMemberIds.length > 0) {
                const aggs = await db.point.groupBy({
                    by: ["userId"],
                    where: { userId: { in: allMemberIds } },
                    _sum: { amount: true },
                });
                for (const a of aggs)
                    pointsByUser.set(a.userId, a._sum.amount || 0);
            }
            const teamScores = teams.map((team) => {
                const totalTP = team.members.reduce((sum, m) => sum + (pointsByUser.get(m.userId) || 0), 0);
                return { team, totalTP };
            });
            teamScores.sort((a, b) => b.totalTP - a.totalTP);
            const total = teamScores.length;
            const pageSlice = teamScores.slice(skip, skip + limit);
            const leaderboard = pageSlice.map((ts, i) => ({
                id: ts.team.id,
                teamId: ts.team.id,
                rank: skip + i + 1,
                name: ts.team.name,
                school: ts.team.school,
                totalTP: ts.totalTP,
                memberCount: ts.team.members.length,
                activityTrend: 0,
                rankChange: 0,
                members: ts.team.members.slice(0, 3).map((m) => ({
                    id: m.user.id,
                    name: `${m.user.firstName} ${m.user.lastName}`.trim(),
                    avatarUrl: null,
                })),
            }));
            return {
                teams: leaderboard,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        }
        catch (error) {
            logger.error({ error }, "Failed to get teams leaderboard");
            throw error;
        }
    }
    static async getTop3Teams() {
        try {
            const result = await this.getTeamsLeaderboard({ page: 1, limit: 3 });
            return result.teams;
        }
        catch (error) {
            logger.error({ error }, "Failed to get top 3 teams");
            throw error;
        }
    }
    static async getSchoolsLeaderboard(query) {
        try {
            const { page = 1, limit = 20, search } = query;
            const skip = (page - 1) * limit;
            const schoolGroups = await db.user.groupBy({
                by: ["school"],
                where: {
                    school: { not: null, ...(search && { contains: search, mode: "insensitive" }) },
                    isVerified: true,
                },
                _count: { id: true },
            });
            const validSchools = schoolGroups.filter((s) => s.school);
            const schoolNames = validSchools.map((s) => s.school);
            const allStudents = schoolNames.length > 0
                ? await db.user.findMany({
                    where: { school: { in: schoolNames }, isVerified: true },
                    select: { id: true, school: true },
                })
                : [];
            const studentIdsBySchool = new Map();
            for (const s of allStudents) {
                if (!s.school)
                    continue;
                const arr = studentIdsBySchool.get(s.school) || [];
                arr.push(s.id);
                studentIdsBySchool.set(s.school, arr);
            }
            const allStudentIds = allStudents.map((s) => s.id);
            const pointsByUser = new Map();
            if (allStudentIds.length > 0) {
                const aggs = await db.point.groupBy({
                    by: ["userId"],
                    where: { userId: { in: allStudentIds } },
                    _sum: { amount: true },
                });
                for (const a of aggs)
                    pointsByUser.set(a.userId, a._sum.amount || 0);
            }
            const teamCountBySchool = new Map();
            if (schoolNames.length > 0) {
                const teamGroups = await db.team.groupBy({
                    by: ["school"],
                    where: { school: { in: schoolNames } },
                    _count: { id: true },
                });
                for (const g of teamGroups)
                    teamCountBySchool.set(g.school, g._count.id);
            }
            const studentCountBySchool = new Map(validSchools.map((s) => [s.school, s._count.id]));
            const scored = validSchools.map((s) => {
                const ids = studentIdsBySchool.get(s.school) || [];
                const totalTP = ids.reduce((sum, id) => sum + (pointsByUser.get(id) || 0), 0);
                const studentCount = studentCountBySchool.get(s.school) || 0;
                return {
                    name: s.school,
                    totalTP,
                    studentCount,
                    teamCount: teamCountBySchool.get(s.school) || 0,
                    averageTP: studentCount > 0 ? totalTP / studentCount : 0,
                };
            });
            scored.sort((a, b) => b.totalTP - a.totalTP);
            const total = scored.length;
            const pageSlice = scored.slice(skip, skip + limit);
            const leaderboard = pageSlice.map((school, i) => ({
                id: school.name,
                rank: skip + i + 1,
                name: school.name,
                totalTP: school.totalTP,
                studentCount: school.studentCount,
                teamCount: school.teamCount,
                activityTrend: 0,
                rankChange: 0,
                averageTP: Math.round(school.averageTP * 10) / 10,
            }));
            return {
                schools: leaderboard,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            };
        }
        catch (error) {
            logger.error({ error }, "Failed to get schools leaderboard");
            throw error;
        }
    }
    static async getTop3Schools() {
        try {
            const result = await this.getSchoolsLeaderboard({ page: 1, limit: 3 });
            return result.schools;
        }
        catch (error) {
            logger.error({ error }, "Failed to get top 3 schools");
            throw error;
        }
    }
    /**
     * Batch activity trends for a set of users (2 queries total instead of 2 per user).
     */
    static async batchActivityTrends(userIds) {
        const map = new Map();
        if (userIds.length === 0)
            return map;
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_MS);
        const fourteenDaysAgo = new Date(now.getTime() - 2 * SEVEN_DAYS_MS);
        const [currentAggs, previousAggs] = await Promise.all([
            db.point.groupBy({
                by: ["userId"],
                where: { userId: { in: userIds }, createdAt: { gte: sevenDaysAgo } },
                _sum: { amount: true },
            }),
            db.point.groupBy({
                by: ["userId"],
                where: { userId: { in: userIds }, createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
                _sum: { amount: true },
            }),
        ]);
        const currentMap = new Map(currentAggs.map((a) => [a.userId, a._sum.amount || 0]));
        const previousMap = new Map(previousAggs.map((a) => [a.userId, a._sum.amount || 0]));
        for (const id of userIds) {
            const current = currentMap.get(id) || 0;
            const previous = previousMap.get(id) || 0;
            if (previous === 0) {
                map.set(id, current > 0 ? 100 : 0);
            }
            else {
                map.set(id, Math.round(((current - previous) / previous) * 100));
            }
        }
        return map;
    }
    static generateInitials(firstName, lastName) {
        const first = firstName?.trim() || "";
        const last = lastName?.trim() || "";
        if (first && last)
            return `${first[0]}${last[0]}`.toUpperCase();
        if (first && first.length >= 2)
            return first.substring(0, 2).toUpperCase();
        if (first)
            return first.toUpperCase();
        if (last && last.length >= 2)
            return last.substring(0, 2).toUpperCase();
        if (last)
            return last.toUpperCase();
        return "??";
    }
}
//# sourceMappingURL=service.js.map