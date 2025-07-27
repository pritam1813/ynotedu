import React from "react";
import CreateCourseForm from "./CreateCourseForm";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Category } from "@prisma/client";

export default async function CreateCourseFormWrapper({
  courseId,
}: {
  courseId: string;
}) {
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
        Instructor="78"
        existingCourse={existingCourse}
        isEditing={!!courseId}
      />
    </>
  );
}
