/** @format */
import { Context } from "../index";

// Resolvers define how to fetch the types defined in your schema.
export const Query = {
  hello: () => "World",
  users: (_: any, __: any, { prisma }: Context) => {
    return prisma.user.findMany();
  },
  user: (_: any, { id }: { id: String }, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: Number(id),
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

  profiles: (_: any, __: any, { prisma }: Context) => {
    return prisma.profile.findMany();
  },
};
