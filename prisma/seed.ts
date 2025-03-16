import { PrismaClient } from "@prisma/client";
import { instructors } from "../data/instructors";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Delete existing data
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

    console.log(
      `Created instructor: ${createdInstructor.name} (ID: ${createdInstructor.id})`
    );
  }

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
