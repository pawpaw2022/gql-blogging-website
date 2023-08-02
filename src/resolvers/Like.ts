/** @format */

import { Post } from "@prisma/client";
import { Context } from "..";
import { parsePosts } from "../utils/Redis";

interface Like {
  postId: string;
}

export const Like = {
  posts: async (parent: Like, _: any, { redis }: Context) => {
    const { postId } = parent;

    const posts = await parsePosts(redis);

    const userPosts = posts.filter((post: Post) => post.id === postId);

    return userPosts;
  },
};
