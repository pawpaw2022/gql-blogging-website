/** @format */

import { Context } from "../../..";
import { getUserFromToken } from "../../../utils/JwtAuth";
import { updatePostsOnRedis } from "../../../utils/Redis";

export const CommentMutation = {
  createComment: async (
    _: any,
    args: { postId: string; content: string },
    { prisma, auth, redis }: Context
  ) => {
    const { postId, content } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    try {
      // create Comment
      const comment = await prisma.comment.create({
        data: {
          userId,
          postId,
          content,
        },
      });

      // update post
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          comments: {
            connect: {
              id: comment.id,
            },
          },
        },
      });

      // update user
      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          comments: {
            connect: {
              id: comment.id,
            },
          },
        },
      });

      // update redis cache
      updatePostsOnRedis(redis, post);

      return {
        post,
      };
    } catch (e) {
      //   console.log(e);

      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },

  deleteComment: async (
    _: any,
    args: { commentId: string },
    { prisma, auth, redis }: Context
  ) => {
    const { commentId } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };

    // Step 2: check if user can mutate comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) return { error: { message: "Comment not found." } };

    if (comment.userId !== payload.userId)
      return { error: { message: "You don't own this comment." } };

    try {
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });

      const post = await prisma.post.findUnique({
        where: {
          id: comment.postId,
        },
      });

      // update redis cache
      updatePostsOnRedis(redis, post);

      return {
        post,
      };
    } catch (e) {
      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },

  updateComment: async (
    _: any,
    args: { commentId: string; content: string },
    { prisma, auth, redis }: Context
  ) => {
    const { commentId, content } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };

    // Step 2: check if user can mutate comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) return { error: { message: "Comment not found." } };

    if (comment.userId !== payload.userId)
      return { error: { message: "You don't own this comment." } };

    try {
      await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          content,
        },
      });

      const post = await prisma.post.findUnique({
        where: {
          id: comment.postId,
        },
      });

      // update redis cache
      updatePostsOnRedis(redis, post);

      return {
        post,
      };
    } catch (e) {
      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },
};
