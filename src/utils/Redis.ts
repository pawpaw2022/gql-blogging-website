/** @format */

import { createClient } from "redis";
import { prisma } from "../index";
import { Post } from "@prisma/client";

type RedisClient = ReturnType<typeof createClient>;

export const redisStart = async (): Promise<RedisClient> => {
  const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  client.expire("posts", 60 * 10); // 10 minutes

  return client;
};

const cachePosts = async (redis: RedisClient) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  const postsString = posts.map((post: Post) => JSON.stringify(post));

  if (postsString.length === 0) return posts;

  // store posts in redis lists type
  await redis.lPush("posts", postsString);
  //   console.log(await redis.lRange("posts", 0, -1));

  return posts;
};

export const parsePosts = async (redis: RedisClient): Promise<Post[]> => {
  const cache = await redis.lRange("posts", 0, -1);

  if (cache.length > 0) {
    const posts = cache.map((post: string) => JSON.parse(post));
    console.log("posts cache hit");

    return posts;
  }

  console.log("posts cache miss");

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

export const deletePostOnRedis = async (redis: RedisClient, postId: String) => {
  // update redis cache
  const posts = await parsePosts(redis);

  const updatedPosts = posts.filter((p: Post) => p.id !== postId);

  await redis.del("posts");
  updatedPosts.forEach(async (p: Post) => {
    await redis.lPush("posts", JSON.stringify(p));
  });
};
