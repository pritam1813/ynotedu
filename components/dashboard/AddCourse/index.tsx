import React, { Suspense } from "react";
import Curriculum from "./Curriculum";
import FileUploader from "./FileUploader";
import CreateCourseForm from "./CreateCourseForm";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Category } from "@prisma/client";
import { checkRole } from "@/utils/roles";
import { currentUser } from "@clerk/nextjs/server";
import CreateCourseFormWrapper from "./CreateCourseFormWrapper";
import CourseSections from "./Curriculum";
import CourseContentForm from "./Curriculum";

interface PageProps {
  searchParams: { courseid?: string };
}

interface ExistingCourse {
  id: number;
  thumbnail: string;
  sections?: any[];
}

export default async function AddCourse({ courseId }: { courseId: string }) {
  const hasCourseId = courseId && courseId.trim() !== "";

  // Fetch existing course data if editing
  let existingCourse: ExistingCourse | null = null;
  if (hasCourseId) {
    try {
      const res = await fetch(`${getBaseUrl()}/api/courses/${courseId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        existingCourse = await res.json();
      }
    } catch (error) {
      console.error("Error fetching existing course:", error);
    }
  }

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">
              {hasCourseId ? "Edit Course" : "Create New Course"}
            </h1>
            <div className="mt-10">
              {hasCourseId
                ? "Update your course details, curriculum, and media."
                : "Fill in the basic information to create your course."}
            </div>
          </div>
        </div>

        <div className="row y-gap-60">
          {/* Step 1: Basic Information */}
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">
                  <span className="text-purple-1 mr-10">1.</span>
                  Basic Information
                </h2>
                {hasCourseId && (
                  <span className="ml-auto text-green-1 text-14">✓ Saved</span>
                )}
              </div>

              <div className="py-30 px-30">
                <Suspense key={courseId}>
                  <CreateCourseFormWrapper courseId={courseId} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Step 2: Curriculum - Only show after course is created */}
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">
                  <span className="text-purple-1 mr-10">2.</span>
                  Curriculum
                </h2>
                {!hasCourseId && (
                  <span className="ml-auto text-light-1 text-14">🔒 Save basic info first</span>
                )}
              </div>

              {hasCourseId ? (
                <CourseContentForm
                  courseId={courseId}
                  existingSections={existingCourse?.sections || []}
                />
              ) : (
                <div className="py-60 px-30 text-center">
                  <i className="icon-book text-60 text-light-1 mb-20"></i>
                  <p className="text-light-1">
                    Save the basic information above to add course curriculum.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Media - Only show after course is created */}
          {hasCourseId ? (
            <FileUploader
              courseId={courseId}
              existingThumbnail={existingCourse?.thumbnail || ""}
            />
          ) : (
            <div className="col-12">
              <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
                <div className="d-flex items-center py-20 px-30 border-bottom-light">
                  <h2 className="text-17 lh-1 fw-500">
                    <span className="text-purple-1 mr-10">3.</span>
                    Media
                  </h2>
                  <span className="ml-auto text-light-1 text-14">🔒 Save basic info first</span>
                </div>
                <div className="py-60 px-30 text-center">
                  <i className="icon-image text-60 text-light-1 mb-20"></i>
                  <p className="text-light-1">
                    Save the basic information above to upload course thumbnail.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
