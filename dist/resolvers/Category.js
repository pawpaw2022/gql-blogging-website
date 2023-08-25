/** @format */
export const Category = {
    tags: async (parent, _, { prisma }) => {
        const { id: categoryId } = parent;
        const tags = await prisma.tag.findMany({
            where: {
                categoryId,
            },
        });
        return tags;
    },
};
