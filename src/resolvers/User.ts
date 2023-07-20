/** @format */
import { Context } from "../index";
import { profileLoader } from "../utils/Dataloader";
import { parsePosts } from "../utils/Redis";

interface UserParent {
  id: string;
}

export const User = {
  posts: async (parent: UserParent, _: any, { redis }: Context) => {
    const { id } = parent;

    const posts = await parsePosts(redis);

    const userPosts = posts.filter((post: any) => post.authorId === id);

    return userPosts;
  },

  profile: (parent: UserParent, _: any, { prisma }: Context) => {
    const { id } = parent;

    return profileLoader.load(id);
  },

  likes: async (parent: UserParent, _: any, { prisma }: Context) => {
    const { id } = parent;

    const likes = await prisma.like.findMany({
      where: {
        userId: id,
      },
    });

    return likes;
  },
};
