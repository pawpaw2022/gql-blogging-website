/** @format */
import jwt from "jsonwebtoken";
export const getUserFromToken = async (token) => {
    // check if user is authenticated
    try {
        const decodedToken = jwt.verify(token, process.env.HASHKEY);
        return decodedToken;
    }
    catch (e) {
        console.log("Token failed verification: ", e.message);
        return null;
    }
};
export const canUserMutatePost = async (prisma, userId, postId) => {
    // check if user can mutate post
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post)
        return { error: { message: "Post not found." } };
    if (post.authorId !== userId)
        return { error: { message: "You do not own this post" } };
    return null; // if return null, user can mutate post
};
