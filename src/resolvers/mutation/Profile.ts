/** @format */

import { Context } from "vm";

interface ProfileArgs {
  bio: string;
  id: string; // for update
}

export const ProfileMutation = {
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
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },
};
