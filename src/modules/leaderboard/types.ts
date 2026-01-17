/**
 * Leaderboard Types
 */

export interface LeaderboardQuery {
  page?: number;
  limit?: number;
  search?: string;
  school?: string;
  minTP?: number;
  maxTP?: number;
}

export interface StudentLeaderboardEntry {
  id: string;
  userId: string;
  rank: number;
  name: string;
  school: string;
  avatarUrl: string | null;
  initials: string;
  totalTP: number;
  badges: string[];
  activityTrend: number;
  rankChange: number;
  email?: string;
}

export interface TeamLeaderboardEntry {
  id: string;
  teamId: string;
  rank: number;
  name: string;
  school: string;
  totalTP: number;
  memberCount: number;
  activityTrend: number;
  rankChange: number;
  members?: Array<{
    id: string;
    name: string;
    avatarUrl: string | null;
  }>;
}

export interface SchoolLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  totalTP: number;
  studentCount: number;
  teamCount: number;
  activityTrend: number;
  rankChange: number;
  averageTP: number;
}

export interface UserRankStats {
  userId: string;
  rank: number;
  totalTP: number;
  rankChange: number;
  previousRank?: number;
  tpChange?: number;
  percentile?: number;
}
