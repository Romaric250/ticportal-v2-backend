import { db } from "../../config/database.js";
import { logger } from "../../shared/utils/logger.js";
export class LeaderboardService {
    /**
     * Get current user's rank and stats
     */
    static async getUserRank(userId) {
        try {
            // Get user's total points
            const userPoints = await db.point.aggregate({
                where: { userId },
                _sum: { amount: true },
            });
            const totalTP = userPoints._sum.amount || 0;
            // Get user's rank (count users with more points + 1)
            const usersAbove = await db.point.groupBy({
                by: ["userId"],
                _sum: { amount: true },
                having: {
                    amount: { _sum: { gt: totalTP } },
                },
            });
            const rank = usersAbove.length + 1;
            // Get total users for percentile
            const totalUsers = await db.user.count({
                where: { isVerified: true },
            });
            const percentile = ((totalUsers - rank + 1) / totalUsers) * 100;
            // Calculate rank change (compare with last week)
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const previousPoints = await db.point.aggregate({
                where: {
                    userId,
                    createdAt: { lte: oneWeekAgo },
                },
                _sum: { amount: true },
            });
            const previousTP = previousPoints._sum.amount || 0;
            const tpChange = totalTP - previousTP;
            // Calculate previous rank
            const previousUsersAbove = await db.point.groupBy({
                by: ["userId"],
                where: { createdAt: { lte: oneWeekAgo } },
                _sum: { amount: true },
                having: {
                    amount: { _sum: { gt: previousTP } },
                },
            });
            const previousRank = previousUsersAbove.length + 1;
            const rankChange = previousRank - rank; // Positive = moved up
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
    /**
     * Get students leaderboard
     */
    static async getStudentsLeaderboard(query) {
        try {
            const { page = 1, limit = 20, search, school, minTP, maxTP, } = query;
            const skip = (page - 1) * limit;
            // Get all users with their total points
            const userPoints = await db.point.groupBy({
                by: ["userId"],
                _sum: { amount: true },
                orderBy: { _sum: { amount: "desc" } },
            });
            // Build where clause for filtering
            const whereClause = {
                id: { in: userPoints.map((up) => up.userId) },
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
            // Filter by TP range
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
            // Get users
            const users = await db.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    school: true,
                    profilePhoto: true,
                    userBadges: {
                        select: {
                            badgeId: true,
                        },
                    },
                },
            });
            // Map users to points and calculate ranks
            const userMap = new Map(users.map((u) => [u.id, u]));
            let currentRank = 1;
            let previousTP = -1;
            let sameRankCount = 0;
            const leaderboard = [];
            for (const up of filteredUserPoints) {
                const user = userMap.get(up.userId);
                if (!user)
                    continue;
                const totalTP = up._sum.amount || 0;
                // Handle ties
                if (totalTP === previousTP) {
                    sameRankCount++;
                }
                else {
                    currentRank += sameRankCount;
                    sameRankCount = 1;
                    previousTP = totalTP;
                }
                // Calculate activity trend (last 7 days vs previous 7 days)
                const activityTrend = await this.calculateActivityTrend(user.id);
                // Calculate rank change
                const rankChange = await this.calculateRankChange(user.id, totalTP);
                // Generate initials safely
                const firstName = user.firstName || "";
                const lastName = user.lastName || "";
                const initials = this.generateInitials(firstName, lastName);
                const entry = {
                    id: up.userId,
                    userId: user.id,
                    rank: currentRank,
                    name: `${user.firstName} ${user.lastName}`,
                    school: user.school || "N/A",
                    avatarUrl: user.profilePhoto,
                    initials,
                    totalTP,
                    badges: user.userBadges.map((ub) => ub.badgeId),
                    activityTrend,
                    rankChange,
                    email: user.email,
                };
                leaderboard.push(entry);
            }
            // Apply pagination
            const paginatedData = leaderboard.slice(skip, skip + limit);
            return {
                students: paginatedData,
                pagination: {
                    page,
                    limit,
                    total: leaderboard.length,
                    totalPages: Math.ceil(leaderboard.length / limit),
                },
            };
        }
        catch (error) {
            logger.error({ error }, "Failed to get students leaderboard");
            throw error;
        }
    }
    /**
     * Get top 3 students
     */
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
    /**
     * Get teams leaderboard
     */
    static async getTeamsLeaderboard(query) {
        try {
            const { page = 1, limit = 20, search, school } = query;
            const skip = (page - 1) * limit;
            // Get all teams with member points
            const teams = await db.team.findMany({
                where: {
                    ...(search && {
                        name: { contains: search, mode: "insensitive" },
                    }),
                    ...(school && {
                        school: { contains: school, mode: "insensitive" },
                    }),
                },
                include: {
                    members: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profilePhoto: true,
                                },
                            },
                        },
                    },
                },
            });
            // Calculate total TP for each team
            const teamScores = await Promise.all(teams.map(async (team) => {
                const memberIds = team.members.map((m) => m.userId);
                const totalPoints = await db.point.aggregate({
                    where: {
                        userId: { in: memberIds },
                    },
                    _sum: { amount: true },
                });
                const totalTP = totalPoints._sum.amount || 0;
                // Calculate activity trend
                const activityTrend = await this.calculateTeamActivityTrend(memberIds);
                // Calculate rank change
                const rankChange = await this.calculateTeamRankChange(team.id, totalTP);
                return {
                    team,
                    totalTP,
                    activityTrend,
                    rankChange,
                };
            }));
            // Sort by totalTP descending
            teamScores.sort((a, b) => b.totalTP - a.totalTP);
            // Calculate ranks
            let currentRank = 1;
            let previousTP = -1;
            let sameRankCount = 0;
            const leaderboard = teamScores.map((ts) => {
                const totalTP = ts.totalTP;
                // Handle ties
                if (totalTP === previousTP) {
                    sameRankCount++;
                }
                else {
                    currentRank += sameRankCount;
                    sameRankCount = 1;
                    previousTP = totalTP;
                }
                return {
                    id: ts.team.id,
                    teamId: ts.team.id,
                    rank: currentRank,
                    name: ts.team.name,
                    school: ts.team.school,
                    totalTP,
                    memberCount: ts.team.members.length,
                    activityTrend: ts.activityTrend,
                    rankChange: ts.rankChange,
                    members: ts.team.members.slice(0, 3).map((m) => ({
                        id: m.user.id,
                        name: `${m.user.firstName} ${m.user.lastName}`,
                        avatarUrl: m.user.profilePhoto,
                    })),
                };
            });
            // Apply pagination
            const paginatedData = leaderboard.slice(skip, skip + limit);
            return {
                teams: paginatedData,
                pagination: {
                    page,
                    limit,
                    total: leaderboard.length,
                    totalPages: Math.ceil(leaderboard.length / limit),
                },
            };
        }
        catch (error) {
            logger.error({ error }, "Failed to get teams leaderboard");
            throw error;
        }
    }
    /**
     * Get top 3 teams
     */
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
    /**
     * Get schools leaderboard
     */
    static async getSchoolsLeaderboard(query) {
        try {
            const { page = 1, limit = 20, search } = query;
            const skip = (page - 1) * limit;
            // Get all schools with students
            const schools = await db.user.groupBy({
                by: ["school"],
                where: {
                    school: {
                        not: null,
                        ...(search && { contains: search, mode: "insensitive" }),
                    },
                    isVerified: true,
                },
                _count: { id: true },
            });
            // Calculate total TP for each school
            const schoolScores = await Promise.all(schools.map(async (school) => {
                if (!school.school)
                    return null;
                // Get all students from this school
                const students = await db.user.findMany({
                    where: {
                        school: school.school,
                        isVerified: true,
                    },
                    select: { id: true },
                });
                const studentIds = students.map((s) => s.id);
                // Get total points
                const totalPoints = await db.point.aggregate({
                    where: {
                        userId: { in: studentIds },
                    },
                    _sum: { amount: true },
                });
                const totalTP = totalPoints._sum.amount || 0;
                // Get team count
                const teamCount = await db.team.count({
                    where: { school: school.school },
                });
                // Calculate activity trend
                const activityTrend = await this.calculateSchoolActivityTrend(studentIds);
                // Calculate rank change
                const rankChange = await this.calculateSchoolRankChange(school.school, totalTP);
                return {
                    name: school.school,
                    totalTP,
                    studentCount: school._count.id,
                    teamCount,
                    activityTrend,
                    rankChange,
                    averageTP: totalTP / school._count.id,
                };
            }));
            // Filter nulls and sort
            const validSchools = schoolScores.filter((s) => s !== null);
            validSchools.sort((a, b) => b.totalTP - a.totalTP);
            // Calculate ranks
            let currentRank = 1;
            let previousTP = -1;
            let sameRankCount = 0;
            const leaderboard = validSchools.map((school) => {
                const totalTP = school.totalTP;
                // Handle ties
                if (totalTP === previousTP) {
                    sameRankCount++;
                }
                else {
                    currentRank += sameRankCount;
                    sameRankCount = 1;
                    previousTP = totalTP;
                }
                return {
                    id: school.name,
                    rank: currentRank,
                    name: school.name,
                    totalTP,
                    studentCount: school.studentCount,
                    teamCount: school.teamCount,
                    activityTrend: school.activityTrend,
                    rankChange: school.rankChange,
                    averageTP: Math.round(school.averageTP * 10) / 10,
                };
            });
            // Apply pagination
            const paginatedData = leaderboard.slice(skip, skip + limit);
            return {
                schools: paginatedData,
                pagination: {
                    page,
                    limit,
                    total: leaderboard.length,
                    totalPages: Math.ceil(leaderboard.length / limit),
                },
            };
        }
        catch (error) {
            logger.error({ error }, "Failed to get schools leaderboard");
            throw error;
        }
    }
    /**
     * Get top 3 schools
     */
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
    // ==================== HELPER METHODS ====================
    /**
     * Generate user initials safely
     */
    static generateInitials(firstName, lastName) {
        const first = firstName?.trim() || "";
        const last = lastName?.trim() || "";
        if (first && last) {
            // Both names available: "John Doe" → "JD"
            return `${first[0]}${last[0]}`.toUpperCase();
        }
        else if (first && first.length >= 2) {
            // Only first name: "John" → "JO"
            return first.substring(0, 2).toUpperCase();
        }
        else if (first && first.length === 1) {
            // First name too short: "J" → "J"
            return first.toUpperCase();
        }
        else if (last && last.length >= 2) {
            // Only last name: "Doe" → "DO"
            return last.substring(0, 2).toUpperCase();
        }
        else if (last && last.length === 1) {
            // Last name too short: "D" → "D"
            return last.toUpperCase();
        }
        else {
            // No names available
            return "??";
        }
    }
    /**
     * Calculate activity trend for user (last 7 days vs previous 7 days)
     */
    static async calculateActivityTrend(userId) {
        try {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const [currentPeriod, previousPeriod] = await Promise.all([
                db.point.aggregate({
                    where: {
                        userId,
                        createdAt: { gte: sevenDaysAgo },
                    },
                    _sum: { amount: true },
                }),
                db.point.aggregate({
                    where: {
                        userId,
                        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
                    },
                    _sum: { amount: true },
                }),
            ]);
            const current = currentPeriod._sum.amount || 0;
            const previous = previousPeriod._sum.amount || 0;
            if (previous === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to calculate activity trend");
            return 0;
        }
    }
    /**
     * Calculate rank change for user
     */
    static async calculateRankChange(userId, currentTP) {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const previousPoints = await db.point.aggregate({
                where: {
                    userId,
                    createdAt: { lte: oneWeekAgo },
                },
                _sum: { amount: true },
            });
            const previousTP = previousPoints._sum.amount || 0;
            const previousUsersAbove = await db.point.groupBy({
                by: ["userId"],
                where: { createdAt: { lte: oneWeekAgo } },
                _sum: { amount: true },
                having: {
                    amount: { _sum: { gt: previousTP } },
                },
            });
            const previousRank = previousUsersAbove.length + 1;
            const currentUsersAbove = await db.point.groupBy({
                by: ["userId"],
                _sum: { amount: true },
                having: {
                    amount: { _sum: { gt: currentTP } },
                },
            });
            const currentRank = currentUsersAbove.length + 1;
            return previousRank - currentRank; // Positive = moved up
        }
        catch (error) {
            logger.error({ error, userId }, "Failed to calculate rank change");
            return 0;
        }
    }
    /**
     * Calculate activity trend for team
     */
    static async calculateTeamActivityTrend(memberIds) {
        try {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const [currentPeriod, previousPeriod] = await Promise.all([
                db.point.aggregate({
                    where: {
                        userId: { in: memberIds },
                        createdAt: { gte: sevenDaysAgo },
                    },
                    _sum: { amount: true },
                }),
                db.point.aggregate({
                    where: {
                        userId: { in: memberIds },
                        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
                    },
                    _sum: { amount: true },
                }),
            ]);
            const current = currentPeriod._sum.amount || 0;
            const previous = previousPeriod._sum.amount || 0;
            if (previous === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        }
        catch (error) {
            logger.error({ error }, "Failed to calculate team activity trend");
            return 0;
        }
    }
    /**
     * Calculate rank change for team
     */
    static async calculateTeamRankChange(teamId, currentTP) {
        // Simplified implementation - can be enhanced
        return 0;
    }
    /**
     * Calculate activity trend for school
     */
    static async calculateSchoolActivityTrend(studentIds) {
        try {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const [currentPeriod, previousPeriod] = await Promise.all([
                db.point.aggregate({
                    where: {
                        userId: { in: studentIds },
                        createdAt: { gte: sevenDaysAgo },
                    },
                    _sum: { amount: true },
                }),
                db.point.aggregate({
                    where: {
                        userId: { in: studentIds },
                        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
                    },
                    _sum: { amount: true },
                }),
            ]);
            const current = currentPeriod._sum.amount || 0;
            const previous = previousPeriod._sum.amount || 0;
            if (previous === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        }
        catch (error) {
            logger.error({ error }, "Failed to calculate school activity trend");
            return 0;
        }
    }
    /**
     * Calculate rank change for school
     */
    static async calculateSchoolRankChange(schoolName, currentTP) {
        // Simplified implementation - can be enhanced
        return 0;
    }
}
//# sourceMappingURL=service.js.map