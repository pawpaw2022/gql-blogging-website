/** @format */
import { Context } from "../index";

interface UserParent {
  id: number;
}

export const User = {
  posts: (parent: UserParent, _: any, { prisma }: Context) => {
    const { id } = parent;
    return prisma.post.findMany({
      where: {
        authorId: id,
      },
    });
  },

  profile: (parent: UserParent, _: any, { prisma }: Context) => {
    const { id } = parent;
    return prisma.profile.findUnique({
      where: {
        userId: id,
      },
    });
  },
};
