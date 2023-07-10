/** @format */

interface PostParent {
  authorId: number;
}

export const Post = {
  user: (parent: PostParent, _: any, { prisma }: any) => {
    const { authorId } = parent;

    return prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
  },
};
