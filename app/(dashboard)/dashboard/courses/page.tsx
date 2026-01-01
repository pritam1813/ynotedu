import React from "react";
import { getInstructorCourses } from "@/app/actions/instructorCourseActions";
import InstructorCourseCard from "@/components/dashboard/InstructorCourseCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Courses || ynotedu - Professional LMS Online Education",
  description: "Manage your courses - create, edit, publish and delete courses.",
};

export default async function DashboardCoursesPage() {
  const result = await getInstructorCourses();

  if (!result.success || !result.courses) {
    return (
      <div className="dashboard__main">
        <div className="dashboard__content bg-light-4">
          <div className="row pb-50 mb-10">
            <div className="col-auto">
              <h1 className="text-30 lh-12 fw-700">My Courses</h1>
            </div>
          </div>

          <div className="row y-gap-30">
            <div className="col-12">
              <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100 py-30 px-30">
                <p className="text-center text-red-1">{result.error || "Failed to load courses"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const courses = result.courses;
  const publishedCount = courses.filter((c) => c.isPublished).length;
  const draftCount = courses.filter((c) => !c.isPublished).length;

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">My Courses</h1>
            <div className="mt-10">
              <Link href="/dshb-listing" className="button -md -purple-1 text-white">
                + Create New Course
              </Link>
            </div>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs">
                <div className="tabs__controls d-flex items-center pt-20 px-30 border-bottom-light js-tabs-controls">
                  <button
                    className="text-light-1 lh-12 tabs__button js-tabs-button is-active"
                    data-tab-target=".-tab-item-1"
                    type="button"
                  >
                    All Courses ({courses.length})
                  </button>
                  <button
                    className="text-light-1 lh-12 tabs__button js-tabs-button ml-30"
                    data-tab-target=".-tab-item-2"
                    type="button"
                  >
                    Published ({publishedCount})
                  </button>
                  <button
                    className="text-light-1 lh-12 tabs__button js-tabs-button ml-30"
                    data-tab-target=".-tab-item-3"
                    type="button"
                  >
                    Drafts ({draftCount})
                  </button>
                </div>

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <div className="tabs__pane -tab-item-1 is-active">
                    {courses.length === 0 ? (
                      <div className="text-center py-60">
                        <i className="icon-book text-60 text-light-1 mb-20"></i>
                        <h3 className="text-20 fw-500 mb-10">No courses yet</h3>
                        <p className="text-light-1 mb-20">Start creating your first course</p>
                        <Link href="/dshb-listing" className="button -md -purple-1 text-white">
                          Create Course
                        </Link>
                      </div>
                    ) : (
                      <div className="row y-gap-30">
                        {courses.map((course) => (
                          <InstructorCourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="tabs__pane -tab-item-2">
                    {publishedCount === 0 ? (
                      <div className="text-center py-60">
                        <p className="text-light-1">No published courses yet</p>
                      </div>
                    ) : (
                      <div className="row y-gap-30">
                        {courses
                          .filter((c) => c.isPublished)
                          .map((course) => (
                            <InstructorCourseCard key={course.id} course={course} />
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="tabs__pane -tab-item-3">
                    {draftCount === 0 ? (
                      <div className="text-center py-60">
                        <p className="text-light-1">No draft courses</p>
                      </div>
                    ) : (
                      <div className="row y-gap-30">
                        {courses
                          .filter((c) => !c.isPublished)
                          .map((course) => (
                            <InstructorCourseCard key={course.id} course={course} />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
