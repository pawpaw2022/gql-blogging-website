/** @format */
import { canUserMutatePost, getUserFromToken } from "../../../utils/JwtAuth";
import { updatePostsOnRedis } from "../../../utils/Redis";
import { validatePost } from "../../../utils/Validation";
export const TagAssignMutation = {
    assignTag: async (_, args, { prisma, auth, redis }) => {
        const { postId, tagId } = args;
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
                    tags: {
                        connect: {
                            id: tagId,
                        },
                    },
                },
            });
            // update redis cache
            updatePostsOnRedis(redis, post);
            return {
                post,
            };
        }
        catch (e) {
            if (e.code === "P2025") {
                return {
                    error: {
                        message: "Tag not found. ",
                    },
                };
            }
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    unAssignTag: async (_, args, { prisma, auth }) => {
        const { postId, tagId } = args;
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
                    tags: {
                        disconnect: {
                            id: tagId,
                        },
                    },
                },
            });
            return {
                post,
            };
        }
        catch (e) {
            if (e.code === "P2025") {
                return {
                    error: {
                        message: "Tag not found. ",
                    },
                };
            }
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    createPostwTags: async (_, args, { prisma, auth, redis }) => {
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        const { title, content, tagIds } = args;
        if (validatePost(title, content))
            return validatePost(title, content);
        try {
            const post = await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userId,
                },
            });
            for (const tagId of tagIds) {
                await prisma.post.update({
                    where: {
                        id: post.id,
                    },
                    data: {
                        tags: {
                            connect: {
                                id: tagId,
                            },
                        },
                    },
                });
            }
            // update redis cache
            redis.lPush("posts", JSON.stringify(post));
            return {
                post,
            };
        }
        catch (e) {
            console.log(e);
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    updatePostwTags: async (_, args, { prisma, auth, redis }) => {
        const { postId, title, content, tagIds } = args;
        // Step 1: check if user is logged in
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        // Step 2: check if user can mutate post
        const canMutate = await canUserMutatePost(prisma, userId, postId);
        if (canMutate?.error)
            return canMutate;
        if (validatePost(title, content))
            return validatePost(title, content);
        try {
            // find all tags and disconnect them
            const tags = await prisma.tag.findMany({
                where: {
                    posts: {
                        some: {
                            id: postId,
                        },
                    },
                },
            });
            for (const tag of tags) {
                await prisma.post.update({
                    where: {
                        id: postId,
                    },
                    data: {
                        tags: {
                            disconnect: {
                                id: tag.id,
                            },
                        },
                    },
                });
            }
            // connect new tags
            for (const tagId of tagIds) {
                await prisma.post.update({
                    where: {
                        id: postId,
                    },
                    data: {
                        tags: {
                            connect: {
                                id: tagId,
                            },
                        },
                    },
                });
            }
            const post = await prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    title,
                    content,
                },
            });
            // update redis cache
            updatePostsOnRedis(redis, post);
            return {
                post,
            };
        }
        catch (e) {
            console.log(e);
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
};
