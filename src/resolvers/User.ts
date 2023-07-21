/** @format */
import { Context } from "../index";
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

    return prisma.profile.findUnique({
      where: {
        userId: id,
      },
    });
  },

  likes: async (parent: UserParent, _: any, { prisma }: Context) => {
    const { id: userId } = parent;

    const likes = await prisma.like.findMany({
      where: {
        userId,
      },
    });

    return likes;
  },

  comments: async (parent: UserParent, _: any, { prisma }: Context) => {
    const { id: userId } = parent;

    const comments = await prisma.comment.findMany({
      where: {
        userId,
      },
    });

    return comments;
  },
};
