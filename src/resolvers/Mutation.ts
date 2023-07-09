/** @format */

import { Context } from "../index";
import { ErrorReferece } from "../utils/prismaErrCode";

interface UserArgs {
  name: string;
  email: string;
  password: string;
}

interface PostArgs {
  title: string;
  content: string;
  published: boolean;
}

interface ProfileArgs {
  bio: string;
}

export const Mutation = {
  createUser: async (_: any, args: UserArgs, { prisma }: Context) => {
    const { name, password, email } = args;
    try {
      const user = await prisma.user.create({
        data: {
          name,
          password,
          email,
        },
      });
      return {
        user,
      };
    } catch (e) {
      return {
        error: {
          message: ErrorReferece(e.code),
        },
      };
    }
  },

  createPost: async (_: any, args: PostArgs, { prisma }: Context) => {
    const { title, content, published } = args;

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published: published ? published : false,
          authorId: 1,
        },
      });
      return {
        post,
      };
    } catch (e) {
      return {
        error: {
          message: ErrorReferece(e.code),
        },
      };
    }
  },

  createProfile: async (_: any, args: ProfileArgs, { prisma }: Context) => {
    const { bio } = args;
    try {
      const profile = await prisma.profile.create({
        data: {
          bio,
          userId: 1,
        },
      });
      return {
        profile,
      };
    } catch (e) {
      return {
        error: {
          message: ErrorReferece(e.code),
        },
      };
    }
  },
};
