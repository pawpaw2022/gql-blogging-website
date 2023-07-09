/** @format */

interface ProfileParent {
  userId: number;
}

export const Profile = {
  user: (parent: ProfileParent, _: any, { prisma }: any) => {
    const { userId } = parent;
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },
};
