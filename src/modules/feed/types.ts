import type { FeedCategory, FeedVisibility, FeedPostStatus, FeedReportReason } from "@prisma/client";

export interface CreatePostInput {
  title?: string;
  content: string;
  category: FeedCategory;
  tags?: string[];
  imageUrls?: string[];  // Changed from imageUrl to imageUrls array
  videoUrl?: string;
  attachments?: PostAttachment[];
  visibility?: FeedVisibility;
  teamId?: string;
  status?: FeedPostStatus;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  category?: FeedCategory;
  tags?: string[];
  imageUrls?: string[];  // Changed from imageUrl to imageUrls array
  videoUrl?: string;
  visibility?: FeedVisibility;
}

export interface PostAttachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  fileType: "document" | "image" | "video" | "other";
}

export interface GetPostsInput {
  category?: FeedCategory | "all";
  visibility?: FeedVisibility;
  page?: number;
  limit?: number;
  includePinned?: boolean;
  teamId?: string;
  authorId?: string;
  tags?: string[];
  search?: string;
  excludePostIds?: string[]; // NEW: Exclude already seen posts
}

export interface CreateCommentInput {
  content: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}

export interface ReportContentInput {
  postId?: string;
  commentId?: string;
  reason: FeedReportReason;
  description?: string;
}

export interface PinPostInput {
  isPinned: boolean;
}

export interface RecordViewInput {
  postId: string;
  duration?: number;
}
