/** @format */
import { canUserMutatePost, getUserFromToken } from "../../../utils/JwtAuth";
import { updatePostsOnRedis } from "../../../utils/Redis";
export const PublishMutation = {
    publishPost: async (_, args, { prisma, auth, redis }) => {
        const { id: postId } = args;
        // Step 1: check if user is logged in
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        // Step 2: check if user can mutate post
        const canMutate = await canUserMutatePost(prisma, userId, postId);
        if (canMutate?.error)
            return canMutate;
        try {
            const post = await prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    published: true,
                },
            });
            // update redis cache
            updatePostsOnRedis(redis, post);
            return {
                post,
            };
        }
        catch (e) {
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    unpublishPost: async (_, args, { prisma, auth, redis }) => {
        const { id: postId } = args;
        // Step 1: check if user is logged in
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        // Step 2: check if user can mutate post
        const canMutate = await canUserMutatePost(prisma, userId, postId);
        if (canMutate?.error)
            return canMutate;
        try {
            const post = await prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    published: false,
                },
            });
            // update redis cache
            updatePostsOnRedis(redis, post);
            return {
                post,
            };
        }
        catch (e) {
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
};
