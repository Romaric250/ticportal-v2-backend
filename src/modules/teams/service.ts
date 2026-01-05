import { db } from "../../config/database";
import { TeamRole } from "@prisma/client";
import { activityService } from "../../shared/services/activity";
import { 
  sendTeamInviteEmail, 
  sendTeamRoleUpdateEmail, 
  sendTeamRemovalEmail,
  sendTeamJoinRequestEmail,
  sendJoinRequestAcceptedEmail,
  sendJoinRequestRejectedEmail
} from "../../shared/utils/email";
import { logger } from "../../shared/utils/logger";
import type {
  CreateTeamInput,
  UpdateTeamInput,
  AddTeamMemberInput,
  UpdateTeamMemberRoleInput,
  SendTeamChatMessageInput,
  SearchTeamsInput,
  RequestToJoinTeamInput,
  HandleJoinRequestInput,
} from "./types";

export class TeamService {
  /**
   * Get all teams with pagination
   */
  static async getTeams(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      db.team.findMany({
        skip,
        take: limit,
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  profilePhoto: true,
                },
              },
            },
          },
          _count: {
            select: {
              members: true,
              chats: true,
              submissions: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.team.count(),
    ]);

    return {
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single team by ID
   */
  static async getTeamById(teamId: string) {
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePhoto: true,
                bio: true,
                school: true,
              },
            },
          },
          orderBy: {
            joinedAt: "asc",
          },
        },
        submissions: {
          select: {
            id: true,
            title: true,
            submittedAt: true,
            hackathon: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
          orderBy: {
            submittedAt: "desc",
          },
        },
        mentorAssignments: {
          include: {
            mentor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePhoto: true,
              },
            },
          },
          where: {
            endDate: null, // Active assignments
          },
        },
        _count: {
          select: {
            members: true,
            chats: true,
            submissions: true,
          },
        },
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  }

  /**
   * Get teams for a specific user
   */
  static async getUserTeams(userId: string) {
    const teamMembers = await db.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            _count: {
              select: {
                members: true,
                chats: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return teamMembers.map((tm) => ({
      ...tm.team,
      userRole: tm.role,
      joinedAt: tm.joinedAt,
    }));
  }

  /**
   * Create a new team
   */
  static async createTeam(userId: string, input: CreateTeamInput) {
    // Create team and add creator as team lead
    const team = await db.team.create({
      data: {
        name: input.name,
        school: input.school,
        profileImage: input.profileImage || null,
        projectTitle: input.projectTitle || null,
        description: input.description || null,
        members: {
          create: {
            userId,
            role: TeamRole.LEAD,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
    });

    // Track activity
    await activityService.trackActivity({
      userId,
      action: "TEAM_CREATED",
      metadata: {
        teamId: team.id,
        teamName: team.name,
        school: team.school,
      },
    });

    logger.info({ userId, teamId: team.id }, "Team created");

    return team;
  }

  /**
   * Update team details
   */
  static async updateTeam(userId: string, teamId: string, input: UpdateTeamInput) {
    // Verify user is team lead
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: TeamRole.LEAD,
      },
    });

    if (!member) {
      throw new Error("Only team leads can update team details");
    }

    const team = await db.team.update({
      where: { id: teamId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.profileImage !== undefined && { profileImage: input.profileImage || null }),
        ...(input.projectTitle !== undefined && { projectTitle: input.projectTitle || null }),
        ...(input.description !== undefined && { description: input.description || null }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
    });

    // Track activity
    await activityService.trackActivity({
      userId,
      action: "TEAM_UPDATED",
      metadata: {
        teamId,
        updates: input,
      },
    });

    logger.info({ userId, teamId }, "Team updated");

    return team;
  }

  /**
   * Delete a team
   */
  static async deleteTeam(userId: string, teamId: string) {
    // Verify user is team lead
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: TeamRole.LEAD,
      },
    });

    if (!member) {
      throw new Error("Only team leads can delete teams");
    }

    // Check if team has submissions
    const submissionCount = await db.submission.count({
      where: { teamId },
    });

    if (submissionCount > 0) {
      throw new Error("Cannot delete team with existing submissions");
    }

    // Delete team (cascade will handle members, chats, etc.)
    await db.team.delete({
      where: { id: teamId },
    });

    // Track activity
    await activityService.trackActivity({
      userId,
      action: "TEAM_DELETED",
      metadata: {
        teamId,
      },
    });

    logger.info({ userId, teamId }, "Team deleted");

    return { success: true, message: "Team deleted successfully" };
  }

  /**
   * Add a member to a team
   */
  static async addTeamMember(
    inviterId: string,
    teamId: string,
    input: AddTeamMemberInput,
  ) {
    // Verify inviter is team lead
    const inviter = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: inviterId,
        role: TeamRole.LEAD,
      },
      include: {
        team: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!inviter) {
      throw new Error("Only team leads can add members");
    }

    // Check if user is already a member
    const existingMember = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: input.userId,
      },
    });

    if (existingMember) {
      throw new Error("User is already a team member");
    }

    // Get user details for email
    const user = await db.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Add member
    const teamMember = await db.teamMember.create({
      data: {
        teamId,
        userId: input.userId,
        role: input.role,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true,
          },
        },
      },
    });

    // Send email notification
    await sendTeamInviteEmail(
      user.email,
      user.firstName,
      inviter.team.name,
      `${inviter.user.firstName} ${inviter.user.lastName}`,
    );

    // Track activity for both inviter and new member
    await Promise.all([
      activityService.trackActivity({
        userId: inviterId,
        action: "TEAM_MEMBER_ADDED",
        metadata: {
          teamId,
          newMemberId: input.userId,
          role: input.role,
        },
      }),
      activityService.trackActivity({
        userId: input.userId,
        action: "TEAM_JOINED",
        metadata: {
          teamId,
          role: input.role,
        },
      }),
    ]);

    logger.info({ inviterId, teamId, newMemberId: input.userId }, "Team member added");

    return teamMember;
  }

  /**
   * Update team member role
   */
  static async updateTeamMemberRole(
    userId: string,
    teamId: string,
    memberId: string,
    input: UpdateTeamMemberRoleInput,
  ) {
    // Verify user is team lead
    const userMember = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: TeamRole.LEAD,
      },
    });

    if (!userMember) {
      throw new Error("Only team leads can update member roles");
    }

    // Don't allow changing own role if you're the only lead
    if (userId === memberId && input.role !== TeamRole.LEAD) {
      const leadCount = await db.teamMember.count({
        where: {
          teamId,
          role: TeamRole.LEAD,
        },
      });

      if (leadCount === 1) {
        throw new Error("Cannot demote the only team lead");
      }
    }

    // Find member by TeamMember ID or userId
    const existingMember = await db.teamMember.findFirst({
      where: {
        OR: [
          {
            id: memberId,
            teamId,
          },
          {
            teamId,
            userId: memberId,
          },
        ],
      },
    });

    if (!existingMember) {
      throw new Error("Member not found");
    }

    const actualUserId = existingMember.userId;

    const teamMember = await db.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId: actualUserId,
        },
      },
      data: {
        role: input.role,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
    });

    // Send email notification
    await sendTeamRoleUpdateEmail(
      teamMember.user.email,
      teamMember.user.firstName,
      teamMember.team.name,
      input.role,
    );

    // Track activity
    await activityService.trackActivity({
      userId,
      action: "TEAM_MEMBER_ROLE_UPDATED",
      metadata: {
        teamId,
        memberId: actualUserId,
        newRole: input.role,
      },
    });

    logger.info({ userId, teamId, memberId: actualUserId, newRole: input.role }, "Team member role updated");

    return teamMember;
  }

  /**
   * Remove a team member
   */
  static async removeTeamMember(userId: string, teamId: string, memberId: string) {
    // First, find the member to be removed (supports both TeamMember ID and User ID)
    const memberToRemove = await db.teamMember.findFirst({
      where: {
        OR: [
          {
            id: memberId,
            teamId,
          },
          {
            teamId,
            userId: memberId,
          },
        ],
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!memberToRemove) {
      throw new Error("Member not found");
    }

    // Get the actual userId of the member to be removed
    const actualUserId = memberToRemove.userId;

    // Verify user is team lead or removing themselves
    const userMember = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!userMember) {
      throw new Error("You are not a member of this team");
    }

    const isLead = userMember.role === TeamRole.LEAD;
    const isSelf = userId === actualUserId; // Compare with actual userId

    if (!isLead && !isSelf) {
      throw new Error("Only team leads can remove other members");
    }

    // Don't allow removing the only lead
    if (isSelf && isLead) {
      const leadCount = await db.teamMember.count({
        where: {
          teamId,
          role: TeamRole.LEAD,
        },
      });

      if (leadCount === 1) {
        throw new Error("Cannot remove the only team lead");
      }
    }

    // Remove member
    await db.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: actualUserId,
        },
      },
    });

    // Send email notification if not self-removal
    if (!isSelf) {
      await sendTeamRemovalEmail(
        memberToRemove.user.email,
        memberToRemove.user.firstName,
        memberToRemove.team.name,
      );
    }

    // Track activity
    await Promise.all([
      activityService.trackActivity({
        userId,
        action: isSelf ? "TEAM_LEFT" : "TEAM_MEMBER_REMOVED",
        metadata: {
          teamId,
          memberId: actualUserId,
        },
      }),
      isSelf
        ? null
        : activityService.trackActivity({
            userId: actualUserId,
            action: "REMOVED_FROM_TEAM",
            metadata: {
              teamId,
              removedBy: userId,
            },
          }),
    ]);

    logger.info({ userId, teamId, memberId: actualUserId }, "Team member removed");

    return { 
      success: true, 
      message: "Member removed successfully",
      userId: actualUserId,
      userName: `${memberToRemove.user.firstName}`,
    };
  }

  /**
   * Get team chat messages
   */
  static async getTeamChats(userId: string, teamId: string, page: number = 1, limit: number = 50) {
    // Verify user is a team member
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!member) {
      throw new Error("You are not a member of this team");
    }

    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      db.teamChat.findMany({
        where: { teamId },
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profilePhoto: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.teamChat.count({
        where: { teamId },
      }),
    ]);

    return {
      chats: chats.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Send a team chat message
   */
  static async sendTeamChatMessage(
    teamId: string,
    userId: string,
    input: SendTeamChatMessageInput,
  ) {
    // Verify user is a team member
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!member) {
      throw new Error("You are not a member of this team");
    }

    const chat = await db.teamChat.create({
      data: {
        teamId,
        senderId: userId,
        message: input.message,
        attachments: input.attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePhoto: true,
          },
        },
      },
    });

    // Track activity (no points for chat messages to avoid spam)
    await activityService.trackActivity({
      userId,
      action: "TEAM_MESSAGE_SENT",
      metadata: {
        teamId,
        messageId: chat.id,
      },
      awardPoints: false,
    });

    logger.info({ userId, teamId, chatId: chat.id }, "Team chat message sent");

    return chat;
  }

  /**
   * Check if a user is a member of a team
   */
  static async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const member = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });
    return !!member;
  }

  /**
   * Get a team member by team and user ID
   */
  static async getTeamMember(teamId: string, userId: string) {
    return await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true,
          },
        },
      },
    });
  }

  /**
   * Send a team chat message (non-static version for socket handlers)
   */
  async sendTeamChatMessage(teamId: string, userId: string, message: string, attachments?: string[]) {
    return TeamService.sendTeamChatMessage(teamId, userId, { message, attachments });
  }

  /**
   * Search teams by name, school, or project title
   */
  static async searchTeams(input: SearchTeamsInput) {
    const { query, page = 1, limit = 20 } = input;
    const skip = (page - 1) * limit;

    // Trim the query to remove extra spaces
    const trimmedQuery = query.trim();

    logger.info({ originalQuery: query, trimmedQuery, page, limit }, "Search params received");

    const [teams, total] = await Promise.all([
      db.team.findMany({
        where: {
          OR: [
            { name: { contains: trimmedQuery, mode: "insensitive" } },
            { school: { contains: trimmedQuery, mode: "insensitive" } },
            { projectTitle: { contains: trimmedQuery, mode: "insensitive" } },
            { description: { contains: trimmedQuery, mode: "insensitive" } },
          ],
        },
        skip,
        take: limit,
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
          _count: {
            select: {
              members: true,
              chats: true,
              submissions: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.team.count({
        where: {
          OR: [
            { name: { contains: trimmedQuery, mode: "insensitive" } },
            { school: { contains: trimmedQuery, mode: "insensitive" } },
            { projectTitle: { contains: trimmedQuery, mode: "insensitive" } },
            { description: { contains: trimmedQuery, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    logger.info({ query: trimmedQuery, page, limit, total, teamsFound: teams.length }, "Teams searched");

    // Debug: Log team names for troubleshooting
    if (teams.length > 0) {
      logger.info({ 
        teamNames: teams.map(t => ({ name: t.name, school: t.school, projectTitle: t.projectTitle })) 
      }, "Found teams");
    } else {
      logger.warn({ query: trimmedQuery }, "No teams found for query");
    }

    return {
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Request to join a team
   */
  static async requestToJoinTeam(userId: string, teamId: string, input: RequestToJoinTeamInput) {
    // Check if team exists
    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { role: TeamRole.LEAD },
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    // Check if user is already a member
    const existingMember = await db.teamMember.findFirst({
      where: { teamId, userId },
    });

    if (existingMember) {
      throw new Error("You are already a member of this team");
    }

    // Check if user already has a pending request
    const existingRequest = await db.teamJoinRequest.findFirst({
      where: {
        teamId,
        userId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      throw new Error("You already have a pending join request for this team");
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Create join request
    const joinRequest = await db.teamJoinRequest.create({
      data: {
        teamId,
        userId,
        ...(input.message ? { message: input.message } : {}),
        status: "PENDING",
      },
    });

    // Send email to team leads
    const teamLeads = team.members.filter((m) => m.role === TeamRole.LEAD);
    await Promise.all(
      teamLeads.map((lead) =>
        sendTeamJoinRequestEmail(
          lead.user.email,
          lead.user.firstName,
          team.name,
          `${user.firstName} ${user.lastName}`,
          input.message
        )
      )
    );

    // Track activity
    await activityService.trackActivity({
      userId,
      action: "TEAM_JOIN_REQUESTED",
      metadata: {
        teamId,
        requestId: joinRequest.id,
      },
    });

    logger.info({ userId, teamId, requestId: joinRequest.id }, "Team join request created");

    return joinRequest;
  }

  /**
   * Handle join request (accept/reject)
   */
  static async handleJoinRequest(
    userId: string,
    teamId: string,
    requestId: string,
    input: HandleJoinRequestInput
  ) {
    // Verify user is team lead
    const userMember = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: TeamRole.LEAD,
      },
    });

    if (!userMember) {
      throw new Error("Only team leads can handle join requests");
    }

    // Get the join request
    const joinRequest = await db.teamJoinRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!joinRequest) {
      throw new Error("Join request not found");
    }

    if (joinRequest.teamId !== teamId) {
      throw new Error("Join request does not belong to this team");
    }

    if (joinRequest.status !== "PENDING") {
      throw new Error("Join request has already been handled");
    }

    if (input.action === "accept") {
      // Add user as team member
      await db.teamMember.create({
        data: {
          teamId,
          userId: joinRequest.userId,
          role: TeamRole.MEMBER,
        },
      });

      // Update request status
      await db.teamJoinRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });

      // Send acceptance email
      await sendJoinRequestAcceptedEmail(
        joinRequest.user.email,
        joinRequest.user.firstName,
        joinRequest.team.name,
        input.message
      );

      // Track activity
      await Promise.all([
        activityService.trackActivity({
          userId,
          action: "TEAM_JOIN_REQUEST_ACCEPTED",
          metadata: {
            teamId,
            requestId,
            newMemberId: joinRequest.userId,
          },
        }),
        activityService.trackActivity({
          userId: joinRequest.userId,
          action: "TEAM_JOIN_ACCEPTED",
          metadata: {
            teamId,
            requestId,
          },
        }),
      ]);

      logger.info({ userId, teamId, requestId, newMemberId: joinRequest.userId }, "Join request accepted");

      return { success: true, message: "Join request accepted", member: joinRequest.user };
    } else {
      // Update request status
      await db.teamJoinRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });

      // Send rejection email
      await sendJoinRequestRejectedEmail(
        joinRequest.user.email,
        joinRequest.user.firstName,
        joinRequest.team.name,
        input.message
      );

      // Track activity
      await activityService.trackActivity({
        userId,
        action: "TEAM_JOIN_REQUEST_REJECTED",
        metadata: {
          teamId,
          requestId,
          rejectedUserId: joinRequest.userId,
        },
      });

      logger.info({ userId, teamId, requestId }, "Join request rejected");

      return { success: true, message: "Join request rejected" };
    }
  }

  /**
   * Get pending join requests for a team
   */
  static async getTeamJoinRequests(userId: string, teamId: string) {
    // Verify user is team lead
    const userMember = await db.teamMember.findFirst({
      where: {
        teamId,
        userId,
        role: TeamRole.LEAD,
      },
    });

    if (!userMember) {
      throw new Error("Only team leads can view join requests");
    }

    const requests = await db.teamJoinRequest.findMany({
      where: {
        teamId,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePhoto: true,
            school: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return requests;
  }

  /**
   * Get user's own join requests
   */
  static async getUserJoinRequests(userId: string) {
    const requests = await db.teamJoinRequest.findMany({
      where: {
        userId,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            school: true,
            profileImage: true,
            projectTitle: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return requests;
  }
}