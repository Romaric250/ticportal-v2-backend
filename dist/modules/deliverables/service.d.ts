import { DeliverableType, SubmissionStatus, ReviewStatus } from "@prisma/client";
import { type GDriveCheckResult } from "./gdrive-checker";
/**
 * Deliverable Service
 * Handles all deliverable template and submission operations
 */
export declare class DeliverableService {
    /**
     * Get all deliverable templates
     */
    static getTemplates(filters?: {
        type?: DeliverableType;
        hackathonId?: string;
    }): Promise<({
        _count: {
            deliverables: number;
        };
        hackathon: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        hackathonId: string | null;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        dueDate: Date;
        required: boolean;
    })[]>;
    /**
     * Get deliverable template by ID
     */
    static getTemplateById(templateId: string): Promise<{
        deliverables: ({
            team: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            description: string | null;
            teamId: string;
            submittedAt: Date;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            content: string;
            reviewedBy: string | null;
            reviewedAt: Date | null;
            feedback: string | null;
            templateId: string;
            submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
            reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
        })[];
        hackathon: {
            level: import(".prisma/client").$Enums.HackathonLevel;
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.HackathonStatus;
            squadId: string | null;
            startDate: Date;
            endDate: Date;
        } | null;
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        hackathonId: string | null;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        dueDate: Date;
        required: boolean;
    }>;
    /**
     * Create deliverable template and auto-create empty deliverables for all teams
     */
    static createTemplate(data: {
        title: string;
        description: string;
        type: DeliverableType;
        customType?: string;
        contentType: string;
        hackathonId?: string;
        dueDate: Date;
        required?: boolean;
    }): Promise<{
        hackathon: {
            level: import(".prisma/client").$Enums.HackathonLevel;
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.HackathonStatus;
            squadId: string | null;
            startDate: Date;
            endDate: Date;
        } | null;
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        hackathonId: string | null;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        dueDate: Date;
        required: boolean;
    }>;
    /**
     * Update deliverable template
     */
    static updateTemplate(templateId: string, data: {
        title?: string;
        description?: string;
        type?: DeliverableType;
        customType?: string;
        contentType?: string;
        dueDate?: Date;
        required?: boolean;
    }): Promise<{
        hackathon: {
            level: import(".prisma/client").$Enums.HackathonLevel;
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.HackathonStatus;
            squadId: string | null;
            startDate: Date;
            endDate: Date;
        } | null;
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        createdAt: Date;
        title: string;
        updatedAt: Date;
        description: string;
        hackathonId: string | null;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        dueDate: Date;
        required: boolean;
    }>;
    /**
     * Delete deliverable template
     * Also deletes all associated submissions (teamDeliverables)
     */
    static deleteTemplate(templateId: string): Promise<void>;
    /**
     * Get all deliverables (admin view)
     */
    static getDeliverables(filters?: {
        submissionStatus?: SubmissionStatus;
        reviewStatus?: ReviewStatus;
        teamId?: string;
        templateId?: string;
    }): Promise<({
        team: {
            id: string;
            name: string;
            school: string;
        };
        reviewer: {
            firstName: string;
            lastName: string;
        } | null;
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    })[]>;
    /**
     * Upload deliverable for a team (admin action)
     */
    static uploadDeliverable(data: {
        teamId: string;
        templateId: string;
        content: string;
        contentType: string;
        description?: string;
    }): Promise<{
        team: {
            id: string;
            name: string;
            school: string;
        };
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    }>;
    /**
     * Approve deliverable
     */
    static approveDeliverable(deliverableId: string, reviewerId?: string): Promise<{
        team: {
            id: string;
            name: string;
            school: string;
        };
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    }>;
    /**
     * Reject deliverable with feedback
     */
    static rejectDeliverable(deliverableId: string, reason: string, reviewerId?: string): Promise<{
        team: {
            id: string;
            name: string;
            school: string;
        };
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    }>;
    /**
     * Get team's deliverables
     */
    static getTeamDeliverables(teamId: string): Promise<({
        reviewer: {
            firstName: string;
            lastName: string;
        } | null;
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    })[]>;
    /**
     * Submit or update deliverable (student action)
     */
    static submitDeliverable(data: {
        deliverableId: string;
        teamId: string;
        content: string;
        contentType?: string;
        description?: string;
    }): Promise<{
        team: {
            id: string;
            name: string;
            school: string;
        };
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    }>;
    /**
     * Get deliverable by ID (for viewing before submission)
     */
    static getDeliverableById(deliverableId: string, teamId?: string): Promise<{
        team: {
            id: string;
            name: string;
        };
        reviewer: {
            firstName: string;
            lastName: string;
        } | null;
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    }>;
    /**
     * Check if deadline has passed
     */
    static checkDeadline(deliverableId: string): Promise<{
        passed: boolean;
        dueDate: Date;
        timeRemaining?: string;
    }>;
    /**
     * Delete deliverable submission (reset to empty)
     */
    static deleteDeliverableSubmission(data: {
        deliverableId: string;
        teamId?: string;
        isAdmin?: boolean;
    }): Promise<{
        team: {
            id: string;
            name: string;
            school: string;
        };
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    }>;
    /**
     * Check Google Drive access for a single deliverable.
     */
    static checkDeliverableAccess(deliverableId: string): Promise<{
        deliverableId: string;
        result: GDriveCheckResult;
    }>;
    /**
     * Bulk-check Google Drive access for all URL-type submitted deliverables.
     * Returns per-deliverable results + summary stats.
     */
    static bulkCheckDeliverableAccess(filters?: {
        templateId?: string;
    }): Promise<{
        stats: {
            total: number;
            googleDriveLinks: number;
            accessible: number;
            notAccessible: number;
            checkFailed: number;
            nonGoogleDrive: number;
        };
        items: Array<{
            deliverableId: string;
            teamId: string;
            teamName: string;
            teamSchool: string;
            teamRegion: string;
            members: Array<{
                name: string;
                email: string;
                phone: string;
                school: string;
                region: string;
                role: string;
            }>;
            templateTitle: string;
            templateId: string;
            content: string;
            contentType: string;
            submissionStatus: string;
            reviewStatus: string;
            accessResult: GDriveCheckResult;
        }>;
    }>;
    /**
     * Reject a deliverable for access issues — un-submits it, stores feedback,
     * sends an email to all team members.
     */
    static rejectDeliverableForAccess(deliverableId: string, reviewerId?: string): Promise<{
        team: {
            id: string;
            name: string;
            school: string;
        };
        template: {
            id: string;
            type: import(".prisma/client").$Enums.DeliverableType;
            createdAt: Date;
            title: string;
            updatedAt: Date;
            description: string;
            hackathonId: string | null;
            customType: string | null;
            contentType: import(".prisma/client").$Enums.DeliverableContentType;
            dueDate: Date;
            required: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.DeliverableType;
        description: string | null;
        teamId: string;
        submittedAt: Date;
        customType: string | null;
        contentType: import(".prisma/client").$Enums.DeliverableContentType;
        content: string;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        feedback: string | null;
        templateId: string;
        submissionStatus: import(".prisma/client").$Enums.SubmissionStatus;
        reviewStatus: import(".prisma/client").$Enums.ReviewStatus;
    }>;
}
//# sourceMappingURL=service.d.ts.map