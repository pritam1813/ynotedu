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

export default async function AddCourse({ courseId }: { courseId: string }) {
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  //WIll use later
  // const userRole = await checkRole("instructor");
  // let instructorId: null | string = null;
  // if (userRole) {
  //   const user = await currentUser();
  //   instructorId = user.id;
  // }
  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Create New Course</h1>
            <div className="mt-10">
              Lorem ipsum dolor sit amet, consectetur.
            </div>
          </div>
        </div>

        <div className="row y-gap-60">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">Basic Information</h2>
              </div>

              <div className="py-30 px-30">
                <Suspense key={courseId}>
                  <CreateCourseFormWrapper courseId={courseId} />
                </Suspense>
                {/* <CreateCourseForm
                  AvailableCategories={categories}
                  Instructor="78"
                  existingCourse={existingCourse}
                  isEditing={!!courseId}
                /> */}

                {/* <div className="row y-gap-20 justify-between pt-15">
                  <div className="col-auto">
                    <button className="button -md -outline-purple-1 text-purple-1">
                      Prev
                    </button>
                  </div>

                  <div className="col-auto">
                    <button className="button -md -purple-1 text-white">
                      Next
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">Curriculum</h2>
              </div>

              {/* <Curriculum /> */}
              {/* <CourseSections courseId={courseId} /> */}
              <CourseContentForm courseId={courseId} />
            </div>
          </div>
          <FileUploader courseId={courseId} />
          {/* <Media /> */}
        </div>
      </div>

      {/* <FooterNine /> */}
    </div>
  );
}
