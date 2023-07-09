/** @format */

import { Context } from "../index";
import { ErrorReferece } from "../utils/prismaErrCode";

interface UserArgs {
  name: string;
  email: string;
  password: string;
  id: string; // for update
}

interface PostArgs {
  title: string;
  content: string;
  published: boolean;
  id: string; // for update
}

interface ProfileArgs {
  bio: string;
  id: string; // for update
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

  updateUser: async (_: any, args: UserArgs, { prisma }: Context) => {
    const { name, password, email, id } = args;
    try {
      const user = await prisma.user.update({
        where: {
          id: Number(id),
        },
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

  updatePost: async (_: any, args: PostArgs, { prisma }: Context) => {
    const { title, content, published, id } = args;
    try {
      const post = await prisma.post.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
          content,
          published,
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

  updateProfile: async (_: any, args: ProfileArgs, { prisma }: Context) => {
    const { bio, id } = args;
    try {
      const profile = await prisma.profile.update({
        where: {
          id: Number(id),
        },
        data: {
          bio,
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

  deleteUser: async (_: any, args: { id: string }, { prisma }: Context) => {
    const { id } = args;
    try {
      const user = await prisma.user.delete({
        where: {
          id: Number(id),
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
          message: ErrorReferece(e.code),
        },
      };
    }
  },

  deleteProfile: async (_: any, args: { id: string }, { prisma }: Context) => {
    const { id } = args;
    try {
      const profile = await prisma.profile.delete({
        where: {
          id: Number(id),
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
