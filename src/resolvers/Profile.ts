/** @format */

import { userLoader } from "../utils/Dataloader";

interface ProfileParent {
  userId: string;
  avatarId: string;
}

export const Profile = {
  user: (parent: ProfileParent, _: any, __: any) => {
    const { userId } = parent;
    return userLoader.load(userId);
  },

  avatar: async (parent: ProfileParent, _: any, { prisma }: any) => {
    const { avatarId } = parent;

    const avatar = await prisma.avatar.findUnique({
      where: {
        id: avatarId,
      },
    });

    return avatar;
  },
};
