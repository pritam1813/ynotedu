import { PrismaClient } from "@prisma/client";
import { instructors } from "../data/instructors";
import { courseDummyData } from "../data/courseDummyData";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Delete existing data
  await prisma.course.deleteMany();
  await prisma.socialProfile.deleteMany();
  await prisma.categoryInstructor.deleteMany();
  await prisma.category.deleteMany();
  await prisma.instructor.deleteMany();

  // Create categories
  const categories = [
    { label: "Animation" },
    { label: "Design" },
    { label: "Illustration" },
    { label: "Business" },
    { label: "Web Development" },
    { label: "Data Science" },
    { label: "Mobile App Development" },
    { label: "Cybersecurity" },
    { label: "DevOps & Cloud Computing" },
    { label: "Programming" },
    { label: "Photography" },
    { label: "Art" },
    { label: "Writing" },
  ];

  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  );

  console.log(`Created ${createdCategories.length} categories`);

  // Map category labels to their IDs for easy lookup
  const categoryMap: Record<string, number> = createdCategories.reduce(
    (map: Record<string, number>, category) => {
      map[category.label] = category.id;
      return map;
    },
    {}
  );

  // Seed instructors
  const createdInstructors: Record<number, number> = {};

  for (const instructor of instructors) {
    const createdInstructor = await prisma.instructor.create({
      data: {
        name: instructor.name,
        role: instructor.role,
        image: instructor.image,
        rating: instructor.rating,
        reviews: instructor.reviews,
        students: instructor.students,
        courses: instructor.courses,
        socialProfile: {
          create: instructor.socialProfile.map((profile) => ({
            icon: profile.icon,
            url: profile.url,
          })),
        },
        categories: {
          create: instructor.category
            ? [
                {
                  category: {
                    connect: { id: categoryMap[instructor.category] },
                  },
                },
              ]
            : [],
        },
      },
    });

    // Map original instructor ID to created instructor ID
    createdInstructors[instructor.id] = createdInstructor.id;

    console.log(
      `Created instructor: ${createdInstructor.name} (ID: ${createdInstructor.id})`
    );
  }

  // Seed courses
  console.log("Starting to seed courses...");
  let courseCount = 0;

  for (const course of courseDummyData) {
    // Find the instructor ID in our database
    // If the instructorId doesn't exist in our mapping, use the first instructor
    const instructorId =
      createdInstructors[course.instructorId] ||
      Object.values(createdInstructors)[0];

    // Find the category name from categoryId
    let categoryId;

    // Handle Web Development
    if (course.categoryId === 1) {
      categoryId =
        categoryMap["Web Development"] || Object.values(categoryMap)[0];
    }
    // Handle Data Science
    else if (course.categoryId === 2) {
      categoryId = categoryMap["Data Science"] || Object.values(categoryMap)[0];
    }
    // Handle Mobile App Development
    else if (course.categoryId === 3) {
      categoryId =
        categoryMap["Mobile App Development"] || Object.values(categoryMap)[0];
    }
    // Handle Cybersecurity
    else if (course.categoryId === 4) {
      categoryId =
        categoryMap["Cybersecurity"] || Object.values(categoryMap)[0];
    }
    // Handle DevOps & Cloud Computing
    else if (course.categoryId === 5) {
      categoryId =
        categoryMap["DevOps & Cloud Computing"] ||
        Object.values(categoryMap)[0];
    }
    // If none of those match, try to match with other categories
    else if (course.categoryId === 6) {
      categoryId = categoryMap["Programming"] || Object.values(categoryMap)[0];
    } else if (course.categoryId === 7) {
      categoryId = categoryMap["Photography"] || Object.values(categoryMap)[0];
    } else if (course.categoryId === 8) {
      categoryId = categoryMap["Art"] || Object.values(categoryMap)[0];
    } else if (course.categoryId === 9) {
      categoryId = categoryMap["Writing"] || Object.values(categoryMap)[0];
    }
    // Default case
    else {
      // Use first category as fallback
      categoryId = Object.values(categoryMap)[0];
    }

    // Create the course
    await prisma.course.create({
      data: {
        title: course.title,
        description: course.description,
        level: course.level,
        rating: course.rating,
        reviews: course.reviews,
        language: course.language,
        duration: course.duration,
        price: course.price,
        thumbnail: course.thumbnail,
        isPopular: course.isPopular,
        isFeatured: course.isFeatured,
        lessons: course.lessons,
        students: course.students,
        instructorId,
        categoryId,
      },
    });

    courseCount++;
  }

  console.log(`Created ${courseCount} courses successfully!`);
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
