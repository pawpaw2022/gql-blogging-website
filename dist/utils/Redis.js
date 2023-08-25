/** @format */
import { createClient } from "redis";
import { prisma } from "../index";
export const redisStart = async () => {
    const client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
    });
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
    client.expire("posts", 60 * 10); // 10 minutes
    return client;
};
const cachePosts = async (redis) => {
    const posts = await prisma.post.findMany({
        orderBy: {
            updatedAt: "desc",
        },
    });
    const postsString = posts.map((post) => JSON.stringify(post));
    if (postsString.length === 0)
        return posts;
    // store posts in redis lists type
    await redis.lPush("posts", postsString);
    //   console.log(await redis.lRange("posts", 0, -1));
    return posts;
};
export const parsePosts = async (redis) => {
    const cache = await redis.lRange("posts", 0, -1);
    if (cache.length > 0) {
        const posts = cache.map((post) => JSON.parse(post));
        console.log("posts cache hit");
        return posts;
    }
    console.log("posts cache miss");
    const posts = await cachePosts(redis);
    return posts;
};
export const updatePostsOnRedis = async (redis, post) => {
    // update redis cache
    const posts = await parsePosts(redis);
    const updatedPosts = posts.map((p) => {
        if (p.id === post.id) {
            return post;
        }
        return p;
    });
    await redis.del("posts");
    updatedPosts.forEach(async (p) => {
        await redis.lPush("posts", JSON.stringify(p));
    });
};
export const deletePostOnRedis = async (redis, postId) => {
    // update redis cache
    const posts = await parsePosts(redis);
    const updatedPosts = posts.filter((p) => p.id !== postId);
    await redis.del("posts");
    updatedPosts.forEach(async (p) => {
        await redis.lPush("posts", JSON.stringify(p));
    });
};
