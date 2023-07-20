/** @format */

import { Context } from "../../index";

interface TagsArgs {
  name: string;
  id: string;
}

interface AssignTagsArgs {
  postId: string;
  tagId: string;
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
      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },

  assignTags: async (_: any, args: AssignTagsArgs, { prisma }: Context) => {
    const { postId, tagId } = args;

    try {
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          tags: {
            connect: {
              id: tagId,
            },
          },
        },
      });

      return {
        post,
      };
    } catch (e) {
      return {
        error: {
          message: "Prisma Error Code: " + e.code,
        },
      };
    }
  },
};
