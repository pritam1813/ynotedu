import { PrismaClient } from "@prisma/client";
import { instructors } from "../data/instructors";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Delete existing data
  await prisma.socialProfile.deleteMany();
  await prisma.instructor.deleteMany();

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
