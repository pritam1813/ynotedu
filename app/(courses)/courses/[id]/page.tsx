import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Course } from "@prisma/client";
import { CourseWithInstructor } from "@/components/CustomCourseList";
import CourseDetails from "@/components/course/CourseDetails";
import PageLinks from "@/components/common/PageLinks";
import CourseSlider from "@/components/courseSingle/CourseSlider";

type Props = {
  params: Promise<{ id: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${getBaseUrl()}/api/courses/${id}`);

    if (!response.ok) {
      return {
        title: "Course Not Found | Ynotedu",
        description: "The requested course could not be found.",
      };
    }

    const course: Course = await response.json();

    return {
      title: `${course.title} Course | Ynotedu`,
      description: course.description,
    };
  } catch (error) {
    console.error("Error fetching course metadata:", error);
    return {
      title: "Error | Ynotedu",
      description: "An error occurred while loading this course.",
    };
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //   <Preloader/>
  const { id } = await params;

  try {
    const response = await fetch(`${getBaseUrl()}/api/courses/${id}`);

    if (!response.ok) {
      // If 404, use Next.js notFound() function
      if (response.status === 404) {
        notFound();
      }
      // For other errors, throw to be caught by error boundary
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    const course: CourseWithInstructor = await response.json();

    return (
      <div className="main-content">
        <div className="content-wrapper js-content-wrapper">
          <PageLinks dark={undefined} />
          <CourseDetails course={course} />
          <CourseSlider />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
