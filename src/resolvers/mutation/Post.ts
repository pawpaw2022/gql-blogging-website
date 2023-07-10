/** @format */

import { Context } from "vm";
import { validatePost } from "../../utils/Validation";
interface PostArgs {
  title: string;
  content: string;
  id: string; // for update
}

export const PostMutation = {
  createPost: async (_: any, args: PostArgs, { prisma, user }: Context) => {
    const res = await user;
    // console.log(res);

    const { title, content } = args;

    if (validatePost(title, content)) return validatePost(title, content);

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: res.userId,
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

  updatePost: async (_: any, args: PostArgs, { prisma }: Context) => {
    const { title, content, id } = args;

    if (!validatePost(title, content)) return validatePost(title, content);

    try {
      const post = await prisma.post.update({
        where: {
          id: Number(id),
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

  deletePost: async (_: any, args: { id: string }, { prisma }: Context) => {
    const { id } = args;
    try {
      const post = await prisma.post.delete({
        where: {
          id: Number(id),
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
