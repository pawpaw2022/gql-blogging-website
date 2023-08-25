/** @format */
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

interface UserJwtPayload {
  userId: string;
  email: string;
}

export const getUserFromToken = async (token: string) => {
  // check if user is authenticated
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.HASHKEY
    ) as UserJwtPayload;
    return decodedToken;
  } catch (e) {
    console.log("Token failed verification: ", e.message);

    return null;
  }
};

export const canUserMutatePost = async (
  prisma: PrismaClient,
  userId: string,
  postId: string
) => {
  // check if user can mutate post
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) return { error: { message: "Post not found." } };
  if (post.authorId !== userId)
    return { error: { message: "You do not own this post" } };
  return null; // if return null, user can mutate post
};
