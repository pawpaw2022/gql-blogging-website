/** @format */

import { userLoader } from "../utils/Dataloader";

interface PostParent {
  authorId: number;
}

export const Post = {
  user: (parent: PostParent, _: any, { prisma }: any) => {
    const { authorId } = parent;

    return userLoader.load(authorId);
  },
};
