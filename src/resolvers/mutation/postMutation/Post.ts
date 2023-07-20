/** @format */

import { Context } from "../../..";
import { canUserMutatePost, getUserFromToken } from "../../../utils/JwtAuth";
import { deletePostOnRedis, updatePostsOnRedis } from "../../../utils/Redis";
import { validatePost } from "../../../utils/Validation";
export interface PostArgs {
  title: string;
  content: string;
  id: string; // for update
}

export const PostMutation = {
  createPost: async (
    _: any,
    args: PostArgs,
    { prisma, auth, redis }: Context
  ) => {
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    const { title, content } = args;

    if (validatePost(title, content)) return validatePost(title, content);

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: userId,
        },
      });

      // update redis cache
      redis.lPush("posts", JSON.stringify(post));

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

  updatePost: async (
    _: any,
    args: PostArgs,
    { prisma, auth, redis }: Context
  ) => {
    const { title, content, id: postId } = args;

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
          title,
          content,
        },
      });

      // update redis cache
      await updatePostsOnRedis(redis, post);

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

  deletePost: async (
    _: any,
    args: { id: string },
    { prisma, auth, redis }: Context
  ) => {
    const { id: postId } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    // Step 2: check if user can mutate post
    const canMutate = await canUserMutatePost(prisma, userId, postId);
    if (canMutate?.error) return canMutate;

    try {
      const post = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      // update redis cache
      await deletePostOnRedis(redis, post.id);

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
