/** @format */

import { Context } from "../../..";
import { canUserMutatePost, getUserFromToken } from "../../../utils/JwtAuth";
import { updatePostsOnRedis } from "../../../utils/Redis";

interface AssignTagsArgs {
  postId: string;
  tagId: string;
}

export const TagAssignMutation = {
  assignTag: async (
    _: any,
    args: AssignTagsArgs,
    { prisma, auth, redis }: Context
  ) => {
    const { postId, tagId } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    // Step 2: check if user can mutate post
    const canMutate = await canUserMutatePost(prisma, userId, postId);
    if (canMutate?.error) return canMutate;

    try {
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          tags: {
            connect: {
              id: tagId,
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
      if (e.code === "P2025") {
        return {
          error: {
            message: "Tag not found. ",
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

  unAssignTag: async (
    _: any,
    args: AssignTagsArgs,
    { prisma, auth }: Context
  ) => {
    const { postId, tagId } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    // Step 2: check if user can mutate post
    const canMutate = await canUserMutatePost(prisma, userId, postId);
    if (canMutate?.error) return canMutate;

    try {
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          tags: {
            disconnect: {
              id: tagId,
            },
          },
        },
      });

      return {
        post,
      };
    } catch (e) {
      if (e.code === "P2025") {
        return {
          error: {
            message: "Tag not found. ",
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
};
