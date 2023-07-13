/** @format */
import { Context } from "../index";
import { profileLoader } from "../utils/Dataloader";

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

    return profileLoader.load(id);
  },
};
