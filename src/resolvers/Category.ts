/** @format */

interface CategoryParent {
  id: string;
}

export const Category = {
  tags: async (parent: CategoryParent, _: any, { prisma }: any) => {
    const { id: categoryId } = parent;

    const tags = await prisma.tag.findMany({
      where: {
        categoryId,
      },
    });

    return tags;
  },
};
