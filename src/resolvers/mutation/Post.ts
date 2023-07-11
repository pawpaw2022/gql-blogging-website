/** @format */

import { Context } from "../..";
import { canUserMutatePost, getUserFromToken } from "../../utils/JwtAuth";
import { validatePost } from "../../utils/Validation";
interface PostArgs {
  title: string;
  content: string;
  id: string; // for update
}

export const PostMutation = {
  createPost: async (_: any, args: PostArgs, { prisma, auth }: Context) => {
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

  updatePost: async (_: any, args: PostArgs, { prisma, auth }: Context) => {
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
          id: Number(postId),
        },
        data: {
          title,
          content,
        },
      });
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
    { prisma, auth }: Context
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
          id: Number(postId),
        },
      });
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
