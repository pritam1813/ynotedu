import React from "react";
import CreateCourseForm from "./CreateCourseForm";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Category } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";

export default async function CreateCourseFormWrapper({
  courseId,
}: {
  courseId: string;
}) {
  // Get authenticated user
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized: Please sign in to create a course.");
  }

  // Check if user has instructor role in Clerk
  const userRole = user.publicMetadata?.role as string | undefined;

  if (userRole !== "instructor") {
    throw new Error(
      "Access denied: Only users with instructor role can create courses. Please contact support to become an instructor."
    );
  }

  // Ensure User record exists (required for foreign key constraint)
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  // Find or create instructor record for current user
  let instructor = await prisma.instructor.findUnique({
    where: { userId },
  });

  // If instructor role exists in Clerk but not in database, create it automatically
  if (!instructor) {
    console.log(`Creating instructor record for user ${userId}`);
    instructor = await prisma.instructor.create({
      data: {
        userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Instructor",
        image: user.imageUrl || "",
        role: "Instructor",
        rating: 0,
        reviews: 0,
        students: 0,
        courses: 0,
      },
    });
    console.log(`Instructor record created with ID: ${instructor.id}`);
  }

  const res = await fetch(`${getBaseUrl()}/api/courses/categories`);
  const categories: Category[] = await res.json();

  // Fetch existing course data if courseId exists
  let existingCourse = null;
  if (courseId) {
    const result = await fetch(`${getBaseUrl()}/api/courses/${courseId}`);
    existingCourse = await result.json();
    // console.log(data);
  }

  return (
    <>
      <CreateCourseForm
        AvailableCategories={categories}
        Instructor={instructor.id.toString()}
        existingCourse={existingCourse}
        isEditing={!!courseId}
      />
    </>
  );
}
