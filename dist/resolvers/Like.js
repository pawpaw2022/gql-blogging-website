/** @format */
import { parsePosts } from "../utils/Redis";
export const Like = {
    posts: async (parent, _, { redis }) => {
        const { postId } = parent;
        const posts = await parsePosts(redis);
        const userPosts = posts.filter((post) => post.id === postId);
        return userPosts;
    },
};
