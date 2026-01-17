/**
 * Dashboard Types
 */
export interface DashboardOverview {
    user: {
        id: string;
        name: string;
        avatarUrl: string | null;
        initials: string;
    };
    stats: {
        totalTP: number;
        tpToday: number;
        currentLevel: number;
        levelName: string;
        dayStreak: number;
        levelProgress: {
            percentage: number;
            currentPoints: number;
            nextLevelPoints: number;
            pointsNeeded: number;
            nextLevelName: string;
        };
    };
    nextUp: NextModule | null;
    team: TeamInfo | null;
    upcomingDeadlines: Deadline[];
    recentBadges: RecentBadge[];
    badgeStats: {
        totalBadges: number;
        totalPoints: number;
    };
}
export interface NextModule {
    moduleId: string;
    title: string;
    description: string;
    category: string;
    status: "not_started" | "in_progress" | "completed";
    progress: number;
    lastAccessed: Date | null;
    thumbnailUrl: string | null;
    pathId: string;
    pathName: string;
    estimatedTime: string;
    modulesCompleted: number;
    totalModules: number;
}
export interface TeamInfo {
    id: string;
    name: string;
    initials: string;
    phase: string;
    memberCount: number;
    description: string;
    members: TeamMember[];
    hackathon?: {
        id: string;
        name: string;
        status: string;
    };
}
export interface TeamMember {
    id: string;
    name: string;
    avatarUrl: string | null;
    initials: string;
    role: string;
}
export interface Deadline {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    dueDate: Date;
    variant: "danger" | "info" | "purple";
    type: "hackathon_registration" | "idea_submission" | "mentor_checkin" | "deliverable_submission" | "judging";
    priority: "high" | "medium" | "low";
    hackathonId?: string;
    mentorId?: string;
}
export interface RecentBadge {
    id: string;
    badgeId: string;
    name: string;
    icon: string;
    color: string;
    earnedAt: Date | null;
    points: number;
    locked: boolean;
}
//# sourceMappingURL=types.d.ts.map