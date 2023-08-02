/** @format */

// insertAvatarData.js (or insertAvatarData.ts if using TypeScript)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteExistingAvatars() {
  try {
    const deletedAvatars = await prisma.avatar.deleteMany();

    console.log("Deleted existing avatar data:", deletedAvatars);
  } catch (error) {
    console.error("Error deleting existing avatar data:", error);
  }
}

async function insertAvatarData() {
  try {
    await deleteExistingAvatars();

    const avatarData = [
      {
        url: "https://i.postimg.cc/3x4cmWBd/man.png",
      },
      {
        url: "https://i.postimg.cc/brwkpdgz/woman-1.png",
      },
      {
        url: "https://i.postimg.cc/k5GVhLTH/man-1.png",
      },
      {
        url: "https://i.postimg.cc/3JCNn3F1/woman-2.png",
      },
      {
        url: "https://i.postimg.cc/LsJXVLXK/man-2.png",
      },
      {
        url: "https://i.postimg.cc/k4FzLY10/woman-3.png",
      },
      {
        url: "https://i.postimg.cc/wB1XstY3/man-3.png",
      },
      {
        url: "https://i.postimg.cc/cCFjLgNT/woman-4.png",
      },
      {
        url: "https://i.postimg.cc/C5BXPM8K/boy.png",
      },
      {
        url: "https://i.postimg.cc/kXhzrbsg/woman.png",
      },
    ];

    const createdAvatars = await prisma.avatar.createMany({
      data: avatarData.map((avatar) => ({ url: avatar.url })),
    });

    console.log("Inserted avatar data:", createdAvatars);
  } catch (error) {
    console.error("Error inserting avatar data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the function to insert the data
insertAvatarData();
