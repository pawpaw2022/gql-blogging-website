/** @format */
import { userLoader } from "../utils/Dataloader";
export const Post = {
    user: (parent, _, __) => {
        const { authorId } = parent;
        return userLoader.load(authorId);
    },
    likes: async (parent, _, { prisma }) => {
        const { id } = parent;
        const likes = await prisma.like.findMany({
            where: {
                postId: id,
            },
        });
        // return likes array, need to return the length of the array
        return likes;
    },
    tags: async (parent, _, { prisma }) => {
        const { id: postId } = parent;
        const tags = await prisma.tag.findMany({
            where: {
                posts: {
                    some: {
                        id: postId,
                    },
                },
            },
        });
        return tags;
    },
    comments: async (parent, _, { prisma }) => {
        const { id: postId } = parent;
        const comments = await prisma.comment.findMany({
            where: {
                postId,
            },
        });
        return comments;
    },
};
