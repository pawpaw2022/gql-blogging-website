/** @format */

import { Context } from "../../..";
import { canUserMutatePost, getUserFromToken } from "../../../utils/JwtAuth";
import { updatePostsOnRedis } from "../../../utils/Redis";

export const CommentMutation = {};
