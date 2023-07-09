/** @format */

interface PostParent {
  userId: number;
}

export const Post = {
  user: (parent: PostParent, _: any, { prisma }: any) => {
    const { userId } = parent;
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },
};
