/** @format */

import { Context } from "../../index";

interface TagsArgs {
  name: string;
  id: string;
}

export const TagMutation = {
  createTag: async (_: any, args: TagsArgs, { prisma }: Context) => {
    const { name } = args;

    // capitalize first letter
    const capitalizedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
      const tag = await prisma.tag.create({
        data: {
          name: capitalizedName,
        },
      });

      return {
        tag,
      };
    } catch (e) {
      if (e.code === "P2002") {
        return {
          error: {
            message: "Tag already exists.",
          },
        };
      }

      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },

  deleteTag: async (_: any, args: TagsArgs, { prisma }: Context) => {
    const { id } = args;

    try {
      const tag = await prisma.tag.delete({
        where: {
          id,
        },
      });

      return {
        tag,
      };
    } catch (e) {
      if (e.code === "P2002") {
        return {
          error: {
            message: "Tag does not exist.",
          },
        };
      }

      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },
};
