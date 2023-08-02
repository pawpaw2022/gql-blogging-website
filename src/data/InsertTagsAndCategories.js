/** @format */

// import the Prisma client
import { PrismaClient } from "@prisma/client";

// Instantiate the Prisma client
const prisma = new PrismaClient();

// Sample data for categories and tags
const postCategories = [
  {
    category: "Engineering",
    tags: [
      "Mechanical",
      "Electrical",
      "Software",
      "Civil",
      "Chemical",
      "Aerospace",
    ],
  },
  {
    category: "Technology",
    tags: ["AI", "IoT", "Cloud", "Security", "Data", "Web", "Mobile", "VR"],
  },
  {
    category: "Science",
    tags: ["Physics", "Chemistry", "Biology", "Astronomy", "Math", "Computer"],
  },
  {
    category: "Business",
    tags: [
      "Startups",
      "Marketing",
      "Finance",
      "E-commerce",
      "Leadership",
      "Sales",
    ],
  },
  {
    category: "Design",
    tags: [
      "Graphic",
      "UI/UX",
      "Illustration",
      "Photography",
      "Animation",
      "Typography",
    ],
  },
  {
    category: "Health",
    tags: ["Fitness", "Mental", "Nutrition", "Yoga", "Wellness"],
  },
  {
    category: "Travel",
    tags: ["Destinations", "Tips", "Adventure", "Food", "Photography"],
  },
  {
    category: "Lifestyle",
    tags: ["Fashion", "Beauty", "Home", "Parenting", "Self-Care"],
  },
  {
    category: "Entertainment",
    tags: ["Movies", "Music", "Games", "Celebrities"],
  },
  {
    category: "Education",
    tags: ["Learning", "Study", "Courses", "Resources"],
  },
];

async function deleteExistingData() {
  try {
    // Delete all tags
    await prisma.tag.deleteMany();

    // Delete all categories
    await prisma.category.deleteMany();

    console.log("Deleted existing data: categories and tags");
  } catch (error) {
    console.error("Error deleting existing data:", error);
  }
}

async function insertCategoriesAndTags() {
  try {
    // First, delete all existing data
    await deleteExistingData();

    for (const categoryData of postCategories) {
      // Insert the category
      const createdCategory = await prisma.category.create({
        data: {
          name: categoryData.category,
        },
      });

      console.log("Inserted Category:", createdCategory);

      // Insert the tags associated with the category
      for (const tagName of categoryData.tags) {
        const createdTag = await prisma.tag.create({
          data: {
            name: tagName,
            categoryId: createdCategory.id,
          },
        });

        console.log("Inserted Tag:", createdTag);
      }
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertCategoriesAndTags();
