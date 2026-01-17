/**
 * Portfolio Types
 */

export interface PortfolioOverview {
  profile: ProfileInfo;
  hackathonJourney: HackathonPhase[];
  featuredProject: FeaturedProject | null;
  certifications: Certification[];
  badges: BadgeInfo[];
  mentorFeedback: MentorFeedback[];
  skills: Skill[];
}

export interface ProfileInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
  school: string | null;
  grade: number | null;
  level: number;
  levelTitle: string;
  totalXP: number;
  globalRank: number;
  hoursLogged: number;
  bio: string | null;
}

export interface HackathonPhase {
  id: string;
  phase: string;
  status: "completed" | "in_progress" | "pending" | "locked";
  completedAt?: Date;
  startedAt?: Date;
  scheduledDate?: Date;
  description: string;
  tags?: string[];
  icon: string;
  progress: number;
  teamMembers?: TeamMemberInfo[];
  milestones?: Milestone[];
  modulesCompleted?: number;
  totalModules?: number;
}

export interface TeamMemberInfo {
  id: string;
  name: string;
  avatarUrl: string | null;
  initials: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
}

export interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  thumbnailUrl: string | null;
  imageUrl: string | null;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  hackathonId?: string;
  hackathonName?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  issuedAt: Date;
  certificateUrl: string | null;
  icon: string;
  type: "course_completion" | "achievement" | "hackathon" | "mentorship";
}

export interface BadgeInfo {
  id: string;
  badgeId: string;
  name: string;
  icon: string;
  color: string;
  earnedAt: Date | null;
  locked: boolean;
  points?: number;
  category?: string;
  tier?: string;
}

export interface MentorFeedback {
  id: string;
  mentor: MentorInfo;
  feedback: string;
  createdAt: Date;
  rating: number;
}

export interface MentorInfo {
  id: string;
  name: string;
  avatarUrl: string | null;
  title: string | null;
  company: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}
