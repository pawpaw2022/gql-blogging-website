/** @format */
export const AvatarMutation = {
    createAvatar: async (_, args, { prisma }) => {
        const { url } = args;
        try {
            const avatar = await prisma.avatar.create({
                data: {
                    url,
                },
            });
            return {
                avatar,
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
    deleteAvatar: async (_, args, { prisma }) => {
        const { id } = args;
        try {
            const avatar = await prisma.avatar.delete({
                where: {
                    id,
                },
            });
            return {
                avatar,
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
