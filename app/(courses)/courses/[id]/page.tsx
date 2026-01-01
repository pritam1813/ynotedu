import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Course } from "@prisma/client";
import { CourseWithInstructor } from "@/components/CustomCourseList";
import CourseDetails from "@/components/course/CourseDetails";
import PageLinks from "@/components/common/PageLinks";
import CourseSlider from "@/components/courseSingle/CourseSlider";
import { prisma } from "@/lib/client";

type Props = {
  params: Promise<{ id: string }>;
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
  const { id } = await params;
  const { userId } = await auth();
  const courseIdInt = parseInt(id);

  try {
    const response = await fetch(`${getBaseUrl()}/api/courses/${id}`);
    // const resp = await fetch(`${getBaseUrl()}/api/enrollments/${id}`, {
    //   cache: 'no-cache'
    // });

    // const data = await resp.json();

    // console.log(data);
    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    const course: CourseWithInstructor = await response.json();

    // Check enrollment directly using Prisma (avoids cookie forwarding issues with fetch)
    let isEnrolled = false;
    if (userId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: courseIdInt,
          },
        },
        select: { status: true },
      });
      isEnrolled = enrollment?.status === "ACTIVE";
    }

    // Check if current user is the owner (instructor) of this course
    const isOwner = userId ? course.instructor?.userId === userId : false;

    return (
      <div className="main-content">
        <div className="content-wrapper js-content-wrapper">
          <PageLinks dark={undefined} />
          <CourseDetails course={course} isOwner={isOwner} isEnrolled={isEnrolled} />
          <CourseSlider />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading course:", error);
    throw error;
  }
}
