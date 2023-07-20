/** @format */

import { Context } from "../../index";

interface AvatarArgs {
  url: string;
  id: string;
}

export const AvatarMutation = {
  createAvatar: async (_: any, args: AvatarArgs, { prisma }: Context) => {
    const { url } = args;

    try {
      const avatar = await prisma.avatar.create({
        data: {
          url,
        },
      });

      return {
        avatar,
      };
    } catch (e) {
      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },

  deleteAvatar: async (_: any, args: AvatarArgs, { prisma }: Context) => {
    const { id } = args;

    try {
      const avatar = await prisma.avatar.delete({
        where: {
          id,
        },
      });

      return {
        avatar,
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
