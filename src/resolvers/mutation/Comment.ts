/** @format */

import { userLoader } from "../../utils/Dataloader";

interface CommentParent {
  userId: string;
}

export const Comment = {
  user: (parent: CommentParent, _: any, __: any) => {
    const { userId } = parent;
    return userLoader.load(userId);
  },
};
