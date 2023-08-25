/** @format */
import { userLoader } from "../utils/Dataloader";
export const Profile = {
    user: (parent, _, __) => {
        const { userId } = parent;
        return userLoader.load(userId);
    },
    avatar: async (parent, _, { prisma }) => {
        const { avatarId } = parent;
        if (!avatarId)
            return {
                id: "default",
                url: "",
            };
        const avatar = await prisma.avatar.findUnique({
            where: {
                id: avatarId,
            },
        });
        return avatar;
    },
};
