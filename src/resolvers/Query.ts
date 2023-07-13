/** @format */
import { Context } from "../index";
import { getUserFromToken } from "../utils/JwtAuth";

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

  posts: (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  post: (_: any, { id }: { id: String }, { prisma }: Context) => {
    return prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
  },
};
