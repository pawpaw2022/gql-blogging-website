/** @format */
import { getUserFromToken } from "../../utils/JwtAuth";
export const ProfileMutation = {
    updateProfile: async (_, args, { prisma, auth }) => {
        const { bio, id } = args;
        // Step 1: check if user is logged in
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        // Step 2: check if user can mutate profile
        if (id !== userId)
            return { error: { message: "You do not own this profile" } };
        try {
            const profile = await prisma.profile.update({
                where: {
                    id,
                },
                data: {
                    bio,
                },
            });
            return {
                profile,
            };
        }
        catch (e) {
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    updateUser: async (_, args, { prisma, auth }) => {
        const { bio, firstName, lastName } = args;
        // Step 1: check if user is logged in
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        try {
            const user = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    firstName,
                    lastName,
                },
            });
            const profile = await prisma.profile.update({
                where: {
                    userId,
                },
                data: {
                    bio,
                },
            });
            return {
                profile,
            };
        }
        catch (e) {
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    assignAvatar: async (_, args, { prisma, auth }) => {
        const { avatarId } = args;
        // Step 1: check if user is logged in
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        try {
            const profile = await prisma.profile.update({
                where: {
                    userId,
                },
                data: {
                    avatar: {
                        connect: {
                            id: avatarId,
                        },
                    },
                },
            });
            return {
                profile,
            };
        }
        catch (e) {
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
    unAssignAvatar: async (_, __, { prisma, auth }) => {
        // Step 1: check if user is logged in
        const payload = await getUserFromToken(auth);
        if (!payload)
            return { error: { message: "You need to log in first." } };
        const { userId } = payload;
        const profile = await prisma.profile.findUnique({
            where: {
                userId,
            },
            select: {
                avatar: true,
            },
        });
        if (!profile?.avatar)
            return { error: { message: "You do not have an avatar" } };
        try {
            const profile = await prisma.profile.update({
                where: {
                    userId,
                },
                data: {
                    avatar: {
                        disconnect: true,
                    },
                },
            });
            return {
                profile,
            };
        }
        catch (e) {
            return {
                error: {
                    message: "Prisma Error Code: " + e.code,
                },
            };
        }
    },
};
