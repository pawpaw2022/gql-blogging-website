/** @format */

import { createClient } from "redis";
import { prisma } from "../index";
import { Post } from "@prisma/client";

type RedisClient = ReturnType<typeof createClient>;

export const redisStart = async (): Promise<RedisClient> => {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client;
};

const cachePosts = async (redis: RedisClient) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  const postsString = posts.map((post: Post) => JSON.stringify(post));

  // store posts in redis lists type
  await redis.lPush("posts", postsString);
  //   console.log(await redis.lRange("posts", 0, -1));

  return posts;
};

export const parsePosts = async (redis: RedisClient): Promise<Post[]> => {
  const cache = await redis.lRange("posts", 0, -1);

  if (cache.length > 0) {
    const posts = cache.map((post: string) => JSON.parse(post));
    return posts;
  }

  const posts = await cachePosts(redis);

  return posts;
};

export const updatePostsOnRedis = async (redis: RedisClient, post: Post) => {
  // update redis cache
  const posts = await parsePosts(redis);

  const updatedPosts = posts.map((p: Post) => {
    if (p.id === post.id) {
      return post;
    }
    return p;
  });

  await redis.del("posts");
  updatedPosts.forEach(async (p: Post) => {
    await redis.lPush("posts", JSON.stringify(p));
  });
};

export const deletePostOnRedis = async (redis: RedisClient, postId: Number) => {
  // update redis cache
  const posts = await parsePosts(redis);

  const updatedPosts = posts.filter((p: Post) => p.id !== postId);

  await redis.del("posts");
  updatedPosts.forEach(async (p: Post) => {
    await redis.lPush("posts", JSON.stringify(p));
  });
};
