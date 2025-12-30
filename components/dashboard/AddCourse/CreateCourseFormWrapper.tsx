import React from "react";
import CreateCourseForm from "./CreateCourseForm";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Category } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";

// Error display component with consistent styling
function ErrorDisplay({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-800">{title}</h3>
      <p className="text-red-600">{message}</p>
    </div>
  );
}

export default async function CreateCourseFormWrapper({
  courseId,
}: {
  courseId: string;
}) {
  // Get authenticated user
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return (
      <ErrorDisplay
        title="Authentication Required"
        message="Please sign in to create a course."
      />
    );
  }

  // Check if user has instructor role in Clerk
  const userRole = user.publicMetadata?.role as string | undefined;

  if (userRole !== "instructor" && userRole !== "admin") {
    return (
      <ErrorDisplay
        title="Access Denied"
        message="Only users with instructor role can create courses. Please contact support to become an instructor."
      />
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
