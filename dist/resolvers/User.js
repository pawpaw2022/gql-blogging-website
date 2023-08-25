import { parsePosts } from "../utils/Redis";
export const User = {
    posts: async (parent, _, { redis }) => {
        const { id } = parent;
        const posts = await parsePosts(redis);
        const userPosts = posts.filter((post) => post.authorId === id);
        return userPosts;
    },
    profile: (parent, _, { prisma }) => {
        const { id } = parent;
        return prisma.profile.findUnique({
            where: {
                userId: id,
            },
        });
    },
    likes: async (parent, _, { prisma }) => {
        const { id: userId } = parent;
        const likes = await prisma.like.findMany({
            where: {
                userId,
            },
        });
        return likes;
    },
    comments: async (parent, _, { prisma }) => {
        const { id: userId } = parent;
        const comments = await prisma.comment.findMany({
            where: {
                userId,
            },
        });
        return comments;
    },
};
