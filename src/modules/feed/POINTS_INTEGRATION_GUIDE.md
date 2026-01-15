/**
   * Toggle like on a post
   */
  static async togglePostLike(userId: string, postId: string) {
    // Find existing like
    const existingLike = await db.feedLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    const post = await db.feedPost.findUnique({
      where: { id: postId },
      select: { authorId: true, likesCount: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    let isLiked: boolean;

    if (existingLike) {
      // Unlike
      await db.feedLike.delete({
        where: { id: existingLike.id },
      });

      await db.feedPost.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });

      isLiked = false;
      logger.info({ userId, postId }, "Post unliked");
    } else {
      // Like
      await db.feedLike.create({
        data: {
          postId,
          userId,
        },
      });

      await db.feedPost.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });

      // 🎯 Award points to the liker
      await FeedPointsService.awardLikeGivenPoints(userId, postId);

      // 🎯 Award points to the post author
      await FeedPointsService.awardLikeReceivedPoints(post.authorId, postId, userId);

      isLiked = true;
      logger.info({ userId, postId }, "Post liked");
    }

    return isLiked;
  }