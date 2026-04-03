export declare function isPushConfigured(): boolean;
export declare function getVapidPublicKey(): string;
/**
 * Notify subscribers (except author) of a new community message — best-effort, no email.
 */
export declare function notifyCommunityPush(params: {
    excludeUserId: string;
    title: string;
    body: string;
    messageId: string;
    /** Absolute URL for notification click */
    url?: string;
}): Promise<void>;
//# sourceMappingURL=push.d.ts.map