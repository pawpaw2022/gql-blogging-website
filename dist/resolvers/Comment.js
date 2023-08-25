/** @format */
import { userLoader } from "../utils/Dataloader";
export const Comment = {
    user: (parent, _, __) => {
        const { userId } = parent;
        return userLoader.load(userId);
    },
};
