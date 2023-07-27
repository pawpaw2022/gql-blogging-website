/** @format */
import { Post } from "@prisma/client";
import { Context } from "../index";
import { getUserFromToken } from "../utils/JwtAuth";
import { parsePosts } from "../utils/Redis";

// Resolvers define how to fetch the types defined in your schema.
export const Query = {
  hello: () => "World",

  me: async (_: any, __: any, { prisma, auth }: Context) => {
    const payload = await getUserFromToken(auth);
    if (!payload) return { error: { message: "You need to log in first." } };
    const { userId } = payload;

    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },

  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma }: Context
  ) => {
    return prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });
  },

  posts: (_: any, __: any, { redis, prisma }: Context) => {
    // const posts = prisma.post.findMany();
    // return posts;
    return parsePosts(redis);
  },

  post: async (_: any, { id }: { id: string }, { redis }: Context) => {
    const posts = await parsePosts(redis);
    const post = posts.find((post: Post) => post.id === id);
    return post;
  },

  tags: async (_: any, __: any, { prisma }: Context) => {
    return prisma.tag.findMany();
  },

  categories: async (_: any, __: any, { prisma }: Context) => {
    return prisma.category.findMany();
  },

  avatars: async (_: any, __: any, { prisma }: Context) => {
    return prisma.avatar.findMany();
  },
};
