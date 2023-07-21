/** @format */

import { Context } from "../../..";
import { getUserFromToken } from "../../../utils/JwtAuth";
import { updatePostsOnRedis } from "../../../utils/Redis";

export const LikeMutation = {
  likePost: async (
    _: any,
    args: { postId: string },
    { prisma, auth, redis }: Context
  ) => {
    const { postId } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    try {
      // create Like
      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      // update post
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            connect: {
              id: like.id,
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
      if (e.code === "P2002") {
        return {
          error: {
            message: "You have already liked this post.",
          },
        };
      }

      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },

  unLikePost: async (
    _: any,
    args: { postId: string },
    { prisma, auth, redis }: Context
  ) => {
    const { postId } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    try {
      // delete Like
      const like = await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      // update post
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      // update redis cache
      updatePostsOnRedis(redis, post);

      return {
        post,
      };
    } catch (e) {
      if (e.code === "P2025") {
        return {
          error: {
            message: "You have not liked this post yet.",
          },
        };
      }

      console.log(e);

      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },
};
