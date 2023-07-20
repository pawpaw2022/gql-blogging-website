/** @format */

import { Context } from "..";
import { userLoader } from "../utils/Dataloader";

interface PostParent {
  authorId: string;
  id: string;
}

export const Post = {
  user: (parent: PostParent, _: any, __: any) => {
    const { authorId } = parent;
    return userLoader.load(authorId);
  },

  likes: async (parent: PostParent, _: any, { redis, prisma }: Context) => {
    const { id } = parent;

    const likes = await prisma.like.findMany({
      where: {
        postId: id,
      },
    });

    // return likes array, need to return the length of the array
    return likes;
  },
};
