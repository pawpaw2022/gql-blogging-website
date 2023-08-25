import { getUserFromToken } from "../utils/JwtAuth";
import { parsePosts } from "../utils/Redis";
// Resolvers define how to fetch the types defined in your schema.
export const Query = {
    hello: () => "World",
    me: async (_, __, { prisma, auth }) => {
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    },
    profile: async (_, { userId }, { prisma }) => {
        return prisma.profile.findUnique({
            where: {
                userId: userId,
            },
        });
    },
    posts: (_, __, { redis, prisma }) => {
        // const posts = prisma.post.findMany();
        // return posts;
        return parsePosts(redis);
    },
    post: async (_, { id }, { redis }) => {
        const posts = await parsePosts(redis);
        const post = posts.find((post) => post.id === id);
        return post;
    },
    tags: async (_, __, { prisma }) => {
        return prisma.tag.findMany();
    },
    categories: async (_, __, { prisma }) => {
        return prisma.category.findMany();
    },
    avatars: async (_, __, { prisma }) => {
        return prisma.avatar.findMany();
    },
};
