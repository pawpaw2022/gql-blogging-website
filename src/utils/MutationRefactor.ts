/** @format */

import { UserAuth } from "../resolvers/mutation/Auth";
import { AvatarMutation } from "../resolvers/mutation/Avatar";
import { ProfileMutation } from "../resolvers/mutation/Profile";
import { TagMutation } from "../resolvers/mutation/Tag";
import { CommentMutation } from "../resolvers/mutation/postMutation/Comment";
import { LikeMutation } from "../resolvers/mutation/postMutation/Like";
import { PostMutation } from "../resolvers/mutation/postMutation/Post";
import { PublishMutation } from "../resolvers/mutation/postMutation/Publish";
import { TagAssignMutation } from "../resolvers/mutation/postMutation/TagAssign";

export const AllMutations = {
  ...UserAuth,
  ...PostMutation,
  ...LikeMutation,
  ...TagAssignMutation,
  ...CommentMutation,
  ...PublishMutation,
  ...ProfileMutation,
  ...TagMutation,
  ...AvatarMutation,
};
