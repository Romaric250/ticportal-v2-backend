import { db } from "../../config/database.js";
import { UserRole, UserStatus, TeamRole, PaymentStatus, PaymentMethod } from "@prisma/client";
export class AdminService {
    /** Normalize region names to consolidate variants (North West→Northwest, Center→Centre) */
    static normalizeRegionName(region) {
        if (!region || !region.trim())
            return "Unassigned";
        const r = region.trim();
        const lower = r.toLowerCase();
        if (lower === "north west" || lower === "northwest")
            return "Northwest";
        if (lower === "center" || lower === "centre")
            return "Centre";
        return r;
    }
    /**
     * Get students by region with paid counts.
     * Optional `paymentChannel`: `all` | `manual` | `online` — `paid` counts students with at least one confirmed payment in that channel.
     */
    static async getUsersByRegionStats(params) {
        const channel = params?.paymentChannel ?? "all";
        const students = await db.user.findMany({
            where: { role: UserRole.STUDENT },
            select: {
                id: true,
                region: true,
                payments: {
                    where: { status: PaymentStatus.CONFIRMED },
                    select: { paymentMethod: true },
                },
            },
        });
        const byRegion = new Map();
        for (const s of students) {
            const region = this.normalizeRegionName(s.region);
            const cur = byRegion.get(region) || {
                total: 0,
                paidAny: 0,
                paidManualStudents: 0,
                paidOnlineStudents: 0,
            };
            cur.total++;
            if (s.payments.length > 0)
                cur.paidAny++;
            const hasManual = s.payments.some((p) => this.MANUAL_PAYMENT_METHODS.includes(p.paymentMethod));
            const hasOnline = s.payments.some((p) => this.ONLINE_PAYMENT_METHODS.includes(p.paymentMethod));
            if (hasManual)
                cur.paidManualStudents++;
            if (hasOnline)
                cur.paidOnlineStudents++;
            byRegion.set(region, cur);
        }
        return Array.from(byRegion.entries())
            .map(([region, stats]) => {
            let paid = stats.paidAny;
            if (channel === "manual")
                paid = stats.paidManualStudents;
            else if (channel === "online")
                paid = stats.paidOnlineStudents;
            return {
                region,
                total: stats.total,
                paid,
                paidManual: stats.paidManualStudents,
                paidOnline: stats.paidOnlineStudents,
                paymentChannel: channel,
            };
        })
            .sort((a, b) => b.total - a.total);
    }
    /**
     * Get dashboard statistics
     */
    static async getDashboardStats() {
        const [totalUsers, pendingUsers, mentorsAndLeads, totalTeams, activeTeams,] = await Promise.all([
            db.user.count(),
            db.user.count({ where: { status: UserStatus.PENDING } }),
            db.user.count({
                where: {
                    role: {
                        in: [UserRole.MENTOR, UserRole.SQUAD_LEAD, UserRole.JUDGE],
                    },
                },
            }),
            db.team.count(),
            db.team.count({
                where: {
                    members: {
                        some: {},
                    },
                },
            }),
        ]);
        // Calculate change from last month
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthUsers = await db.user.count({
            where: {
                createdAt: { lt: lastMonth },
            },
        });
        const totalUsersChange = totalUsers - lastMonthUsers;
        return {
            totalUsers,
            pendingApprovals: pendingUsers,
            mentorsAndLeads,
            unassignedJudges: 0, // TODO: Implement judge assignment logic
            totalUsersChange,
        };
    }
    /**
     * Get detailed dashboard statistics
     */
    static async getDetailedDashboardStats() {
        // Users by role
        const usersByRole = await db.user.groupBy({
            by: ["role"],
            _count: true,
        });
        // Users by status  
        const usersByStatus = await db.user.groupBy({
            by: ["status"],
            _count: true,
        });
        // Users over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const usersCreatedRecently = await db.user.findMany({
            where: {
                createdAt: { gte: thirtyDaysAgo },
            },
            select: {
                createdAt: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        // Group by date
        const usersOverTimeMap = new Map();
        usersCreatedRecently.forEach((user) => {
            const date = user.createdAt.toISOString().split("T")[0];
            if (date) {
                usersOverTimeMap.set(date, (usersOverTimeMap.get(date) || 0) + 1);
            }
        });
        const usersOverTime = Array.from(usersOverTimeMap.entries())
            .map(([date, count]) => ({
            date,
            users: count,
        }))
            .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date ascending
        const [teamsCount, activeTeams] = await Promise.all([
            db.team.count(),
            db.team.count({
                where: {
                    members: {
                        some: {},
                    },
                },
            }),
        ]);
        return {
            usersByRole: usersByRole.map((r) => ({
                role: r.role,
                count: r._count,
            })),
            usersByStatus: usersByStatus.map((s) => ({
                status: s.status,
                count: s._count,
            })),
            usersOverTime,
            teamsCount,
            activeTeams,
        };
    }
    /**
     * Get users with pagination and filters
     */
    static async getUsers(filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.role) {
            where.role = filters.role;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.jurisdiction && filters.jurisdiction !== "All Regions" && filters.jurisdiction !== "All Areas") {
            where.region = filters.jurisdiction;
        }
        if (filters.search) {
            const searchConditions = [
                { firstName: { contains: filters.search, mode: "insensitive" } },
                { lastName: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
                { school: { contains: filters.search, mode: "insensitive" } },
            ];
            // Only search by ID if the search term is a valid MongoDB ObjectId (24 hex characters)
            if (/^[a-f\d]{24}$/i.test(filters.search)) {
                searchConditions.push({ id: filters.search });
            }
            where.OR = searchConditions;
        }
        if (filters.paymentStatus) {
            where.role = UserRole.STUDENT;
            if (filters.paymentStatus === "paid") {
                where.payments = { some: { status: PaymentStatus.CONFIRMED } };
            }
            else if (filters.paymentStatus === "not_paid") {
                where.NOT = {
                    payments: { some: { status: PaymentStatus.CONFIRMED } },
                };
            }
            else if (filters.paymentStatus === "manual_paid") {
                where.payments = {
                    some: {
                        status: PaymentStatus.CONFIRMED,
                        paymentMethod: { in: this.MANUAL_PAYMENT_METHODS },
                    },
                };
            }
        }
        const [users, total] = await Promise.all([
            db.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    profilePhoto: true,
                    role: true,
                    school: true,
                    region: true,
                    isVerified: true,
                    status: true,
                    createdAt: true,
                    lastLogin: true,
                    teamMembers: {
                        include: {
                            team: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                        take: 1,
                    },
                    payments: {
                        where: { status: PaymentStatus.CONFIRMED },
                        select: { id: true, metadata: true, paymentMethod: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            db.user.count({ where }),
        ]);
        const formattedUsers = users.map((user) => {
            const { payments, ...rest } = user;
            const payment = payments[0];
            const meta = payment?.metadata;
            const isManualSubscription = !!(meta?.manualSubscription);
            const isManualChannelPaid = user.role === "STUDENT" &&
                payments.some((p) => this.MANUAL_PAYMENT_METHODS.includes(p.paymentMethod) ||
                    !!(p.metadata?.manualSubscription));
            return {
                ...rest,
                affiliation: user.teamMembers[0]?.team.name || null,
                jurisdiction: user.region,
                hasPaid: user.role === "STUDENT" ? payments.length > 0 : undefined,
                isManualChannelPaid: user.role === "STUDENT" && payments.length > 0 ? isManualChannelPaid : undefined,
                isManualSubscription: user.role === "STUDENT" && payments.length > 0 ? isManualSubscription : undefined,
            };
        });
        return {
            users: formattedUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get single user by ID
     */
    static async getUserById(userId) {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                teamMembers: {
                    include: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    /**
     * Create user (admin)
     * Returns user and plainPassword for admin to copy (when password was auto-generated)
     */
    static async createUser(data) {
        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        // Generate random password if not provided
        const plainPassword = data.password || Math.random().toString(36).slice(-8);
        // Hash password
        const bcrypt = await import("bcrypt");
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const user = await db.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                school: data.school || null,
                region: data.region || null,
                password: hashedPassword,
                status: UserStatus.ACTIVE,
                isVerified: true,
            },
        });
        return { user, plainPassword: data.password ? undefined : plainPassword };
    }
    /**
     * Admin: Send OTP to email for verification before creating new user
     * Email may not belong to an existing user
     */
    static async sendVerificationOtp(email) {
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        const { sendVerificationEmail } = await import("../../shared/utils/email");
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await db.adminEmailVerification.create({
            data: { email, code, expiresAt },
        });
        await sendVerificationEmail(email, "User", code);
        return { message: "OTP sent successfully to email" };
    }
    /**
     * Admin: Verify OTP and create user
     * Returns user and plainPassword for admin to copy
     */
    static async verifyAndCreateUser(data) {
        const verification = await db.adminEmailVerification.findFirst({
            where: {
                email: data.email,
                code: data.code,
                expiresAt: { gt: new Date() },
            },
        });
        if (!verification) {
            throw new Error("Invalid or expired OTP");
        }
        await db.adminEmailVerification.delete({ where: { id: verification.id } });
        const result = await this.createUser({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            ...(data.school !== undefined && { school: data.school }),
            ...(data.region !== undefined && { region: data.region }),
            ...(data.password !== undefined && { password: data.password }),
        });
        return result;
    }
    /**
     * Update user
     */
    static async updateUser(userId, data) {
        const user = await db.user.update({
            where: { id: userId },
            data,
        });
        // TODO: Send notification about role/status change
        return user;
    }
    /**
     * Bulk delete users
     */
    static async deleteUsers(userIds) {
        const failed = [];
        let deleted = 0;
        for (const userId of userIds) {
            try {
                await this.deleteUser(userId);
                deleted++;
            }
            catch (err) {
                failed.push({ userId, error: err.message || "Unknown error" });
            }
        }
        return { deleted, failed };
    }
    /**
     * Delete user
     * Must delete all records that reference the user (no onDelete: Cascade) before deleting.
     * Runs without transaction to avoid MongoDB server monitor timeout on long bulk deletes.
     * Includes retry logic for transient connection errors.
     */
    static async deleteUser(userId) {
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000;
        const deleteOperations = async () => {
            // Order matters: Commission/Payment reference StudentReferral
            await db.oTP.deleteMany({ where: { userId } });
            await db.refreshToken.deleteMany({ where: { userId } });
            await db.point.deleteMany({ where: { userId } });
            await db.userBadge.deleteMany({ where: { userId } });
            await db.userProgress.deleteMany({ where: { userId } });
            await db.squadMember.deleteMany({ where: { userId } });
            await db.teamMember.deleteMany({ where: { userId } });
            await db.teamJoinRequest.deleteMany({ where: { userId } });
            await db.teamChatRead.deleteMany({ where: { userId } });
            await db.teamChat.deleteMany({ where: { senderId: userId } });
            await db.score.deleteMany({ where: { judgeId: userId } });
            await db.mentorRequest.deleteMany({ where: { mentorId: userId } });
            await db.mentorAssignment.deleteMany({ where: { mentorId: userId } });
            await db.commission.deleteMany({ where: { userId } });
            await db.payment.deleteMany({ where: { userId } });
            await db.studentReferral.deleteMany({
                where: { OR: [{ referrerId: userId }, { studentId: userId }] },
            });
            await db.leaderboard.deleteMany({ where: { userId } });
            await db.portfolio.deleteMany({ where: { userId } });
            await db.affiliateProfile.deleteMany({ where: { userId } });
            await db.teamDeliverable.updateMany({
                where: { reviewedBy: userId },
                data: { reviewedBy: null },
            });
            await db.user.delete({ where: { id: userId } });
        };
        const isTransientError = (err) => {
            const msg = err instanceof Error ? err.message : String(err);
            return (msg.includes("TransientTransactionError") ||
                msg.includes("server monitor timeout") ||
                msg.includes("Connection") && msg.includes("interrupted"));
        };
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                await deleteOperations();
                return;
            }
            catch (err) {
                if (attempt < MAX_RETRIES && isTransientError(err)) {
                    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
                }
                else {
                    throw err;
                }
            }
        }
    }
    static async getTeams(filters) {
        const page = Math.max(filters.page || 1, 1);
        const limit = Math.min(Math.max(Number(filters.limit) || 20, 1), 20);
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.school) {
            where.school = { contains: filters.school, mode: "insensitive" };
        }
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: "insensitive" } },
                { projectTitle: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        const hasNarrowWhere = Boolean(filters.search?.trim() || filters.school);
        const teamSelect = {
            id: true,
            name: true,
            school: true,
            profileImage: true,
            projectTitle: true,
            description: true,
            createdAt: true,
        };
        let teamsRaw;
        let total = null;
        let totalPages = null;
        let hasNextPage;
        if (hasNarrowWhere) {
            const [rows, totalCount] = await Promise.all([
                db.team.findMany({
                    where,
                    skip,
                    take: limit,
                    select: teamSelect,
                    orderBy: { id: "desc" },
                }),
                db.team.count({ where }),
            ]);
            teamsRaw = rows;
            total = totalCount;
            totalPages = Math.ceil(totalCount / limit) || 1;
            hasNextPage = skip + rows.length < totalCount;
        }
        else {
            const rows = await db.team.findMany({
                where,
                skip,
                take: limit + 1,
                select: teamSelect,
                orderBy: { id: "desc" },
            });
            hasNextPage = rows.length > limit;
            teamsRaw = hasNextPage ? rows.slice(0, limit) : rows;
        }
        const teamIds = teamsRaw.map((t) => t.id);
        const assignmentGroup = teamIds.length === 0
            ? []
            : await db.teamAssignment.groupBy({
                by: ["teamId"],
                where: { teamId: { in: teamIds } },
                _count: { _all: true },
            });
        const reviewerAssignmentCountByTeam = new Map(assignmentGroup.map((g) => [g.teamId, g._count._all]));
        const [memberRows, deliverableRows] = await Promise.all([
            teamIds.length === 0
                ? Promise.resolve([])
                : db.teamMember.findMany({
                    where: { teamId: { in: teamIds } },
                    select: { teamId: true },
                }),
            teamIds.length === 0
                ? Promise.resolve([])
                : db.teamDeliverable.findMany({
                    where: { teamId: { in: teamIds } },
                    select: {
                        teamId: true,
                        templateId: true,
                        submissionStatus: true,
                    },
                }),
        ]);
        const memberCountByTeam = new Map();
        for (const m of memberRows) {
            memberCountByTeam.set(m.teamId, (memberCountByTeam.get(m.teamId) ?? 0) + 1);
        }
        const templateIds = [...new Set(deliverableRows.map((r) => r.templateId))];
        const templates = templateIds.length === 0
            ? []
            : await db.deliverableTemplate.findMany({
                where: { id: { in: templateIds } },
                select: { id: true, required: true },
            });
        const requiredByTemplateId = new Map(templates.map((x) => [x.id, x.required]));
        const rowsByTeam = new Map();
        for (const row of deliverableRows) {
            const list = rowsByTeam.get(row.teamId);
            if (list)
                list.push(row);
            else
                rowsByTeam.set(row.teamId, [row]);
        }
        const teams = teamsRaw.map((t) => {
            const rows = rowsByTeam.get(t.id) ?? [];
            const requiredDeliverables = rows.filter((d) => {
                const req = requiredByTemplateId.get(d.templateId);
                return req !== false;
            });
            const submitted = requiredDeliverables.filter((d) => d.submissionStatus === "SUBMITTED");
            return {
                id: t.id,
                name: t.name,
                school: t.school,
                profileImage: t.profileImage,
                projectTitle: t.projectTitle,
                description: t.description,
                createdAt: t.createdAt,
                memberCount: memberCountByTeam.get(t.id) ?? 0,
                deliverableSubmitted: submitted.length,
                deliverableTotal: requiredDeliverables.length,
                reviewerAssignmentCount: reviewerAssignmentCountByTeam.get(t.id) ?? 0,
            };
        });
        const hasPrevPage = page > 1;
        return {
            teams,
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
    /**
     * Get team by ID
     */
    static async getTeamById(teamId) {
        const team = await db.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                                role: true,
                                school: true,
                            },
                        },
                    },
                },
                deliverables: {
                    include: {
                        template: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                type: true,
                                customType: true,
                                contentType: true,
                                dueDate: true,
                                required: true,
                            },
                        },
                    },
                    orderBy: { submittedAt: "desc" },
                },
            },
        });
        if (!team) {
            throw new Error("Team not found");
        }
        return team;
    }
    /**
     * Update team (admin override)
     */
    static async updateTeam(teamId, data) {
        const team = await db.team.update({
            where: { id: teamId },
            data,
        });
        return team;
    }
    /**
     * Delete team (admin only)
     */
    static async deleteTeam(teamId) {
        // Check if team has submissions
        const submissionCount = await db.submission.count({
            where: { teamId },
        });
        if (submissionCount > 0) {
            throw new Error("Cannot delete team with existing submissions");
        }
        await db.team.delete({
            where: { id: teamId },
        });
    }
    /**
     * Get team members
     */
    static async getTeamMembers(teamId) {
        const team = await db.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        if (!team) {
            throw new Error("Team not found");
        }
        return team.members;
    }
    /**
     * Add member to team
     */
    static async addTeamMember(teamId, userId, role) {
        // Check if team exists
        const team = await db.team.findUnique({
            where: { id: teamId },
        });
        if (!team) {
            throw new Error("Team not found");
        }
        // Check if user exists
        const user = await db.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        // Check if already a member
        const existingMember = await db.teamMember.findFirst({
            where: {
                teamId,
                userId,
            },
        });
        if (existingMember) {
            throw new Error("User is already a team member");
        }
        // Add member
        const member = await db.teamMember.create({
            data: {
                userId,
                teamId,
                role: role || TeamRole.MEMBER,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                    },
                },
            },
        });
        return member;
    }
    /**
     * Remove member from team
     */
    static async removeTeamMember(teamId, userId) {
        const member = await db.teamMember.findFirst({
            where: {
                teamId,
                userId,
            },
        });
        if (!member) {
            throw new Error("Team member not found");
        }
        await db.teamMember.delete({
            where: {
                id: member.id,
            },
        });
    }
    /**
     * Update team member role
     */
    static async updateTeamMemberRole(teamId, userId, role) {
        const member = await db.teamMember.findFirst({
            where: {
                teamId,
                userId,
            },
        });
        if (!member) {
            throw new Error("Team member not found");
        }
        const updatedMember = await db.teamMember.update({
            where: {
                teamId_userId: {
                    teamId,
                    userId,
                },
            },
            data: {
                role: role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                    },
                },
            },
        });
        return updatedMember;
    }
    /**
     * Get team submissions/projects
     */
    static async getTeamSubmissions(teamId) {
        const submissions = await db.submission.findMany({
            where: { teamId },
            orderBy: { submittedAt: "desc" },
        });
        return submissions;
    }
}
AdminService.MANUAL_PAYMENT_METHODS = [
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.CASH,
    PaymentMethod.OTHER,
];
AdminService.ONLINE_PAYMENT_METHODS = [
    PaymentMethod.MOBILE_MONEY,
    PaymentMethod.CARD,
];
//# sourceMappingURL=service.js.map