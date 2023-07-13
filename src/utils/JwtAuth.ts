/** @format */
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { HASHKEY } from "./HashKey";

interface UserJwtPayload {
  userId: number;
  email: string;
}

export const getUserFromToken = async (token: string) => {
  // check if user is authenticated
  try {
    const decodedToken = jwt.verify(token, HASHKEY) as UserJwtPayload;
    return decodedToken;
  } catch (e) {
    return null;
  }
};
export const canUserMutatePost = async (
  prisma: PrismaClient,
  userId: number,
  postId: string
) => {
  // check if user can mutate post
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId),
    },
  });
  if (!post) return { error: { message: "Post not found." } };
  if (post.authorId !== userId)
    return { error: { message: "You do not own this post" } };
  return null; // if return null, user can mutate post
};
