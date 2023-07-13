/** @format */
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
    { userId }: { userId: String },
    { prisma }: Context
  ) => {
    return prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });
  },

  posts: (_: any, __: any, { redis }: Context) => {
    return parsePosts(redis);
  },

  post: async (_: any, { id }: { id: String }, { redis }: Context) => {
    const posts = await parsePosts(redis);
    const post = posts.find((post: any) => post.id === Number(id));
    return post;
  },
};
