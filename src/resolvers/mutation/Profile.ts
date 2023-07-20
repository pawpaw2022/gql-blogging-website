/** @format */

import { Context } from "../../index";
import { canUserMutatePost, getUserFromToken } from "../../utils/JwtAuth";

interface ProfileArgs {
  bio: string;
  id: string; // for update
}

export const ProfileMutation = {
  updateProfile: async (
    _: any,
    args: ProfileArgs,
    { prisma, auth }: Context
  ) => {
    const { bio, id } = args;

    // Step 1: check if user is logged in
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    // Step 2: check if user can mutate profile
    if (id !== userId)
      return { error: { message: "You do not own this profile" } };

    try {
      const profile = await prisma.profile.update({
        where: {
          id,
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
