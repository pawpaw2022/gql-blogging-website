/** @format */

import { userLoader } from "../utils/Dataloader";

interface ProfileParent {
  userId: number;
}

export const Profile = {
  user: (parent: ProfileParent, _: any, { prisma }: any) => {
    const { userId } = parent;
    return userLoader.load(userId);
  },
};
