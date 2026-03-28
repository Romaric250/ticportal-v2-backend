export declare function notifyReviewerStatusGranted(email: string, firstName: string, granted: boolean): Promise<void>;
export declare function notifyTeamAssignment(email: string, firstName: string, teamName: string, teamId: string): Promise<void>;
export declare function notifyPeerReviewSubmitted(email: string, firstName: string, teamName: string, otherReviewerName: string): Promise<void>;
export declare function notifyGradeFinalized(email: string, firstName: string, teamName: string, finalScore: number): Promise<void>;
//# sourceMappingURL=notifications.d.ts.map