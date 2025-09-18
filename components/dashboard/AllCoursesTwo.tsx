import { getBaseUrl } from "@/utils/getBaseUrl";
import React, { Suspense } from "react";
import CourseSearch from "./CourseSearch";
import DashboardCourseCard from "./DashBoardCards/DashboardCourseCard";
import { type Course, type Category } from "@prisma/client";

interface CourseInstructor {
  name: string;
  image: string | null;
}

export type CourseWithDetails = Course & {
  instructor: CourseInstructor;
  category: Category;
};

interface FetchedCourse {
  courses: CourseWithDetails[];
}

export default async function AllCoursesTwo({ search }: { search?: string }) {
  let data: FetchedCourse;
  if (search) {
    const result = await fetch(`${getBaseUrl()}/api/courses?search=${search}`);
    data = await result.json();
  } else {
    const result = await fetch(`${getBaseUrl()}/api/courses`);
    data = await result.json();
  }

  const courses: CourseWithDetails[] = data.courses;

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">All Courses</h1>
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
                    All Courses
                  </button>
                </div>

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <div className="tabs__pane -tab-item-1 is-active">
                    <div className="row y-gap-10 justify-between">
                      <div className="col-auto">
                        <CourseSearch />
                      </div>

                      <div className="col-auto">
                        <div className="d-flex flex-wrap y-gap-10 x-gap-20">
                          <div>
                            <div
                              id="dd14button"
                              className="dropdown js-dropdown js-category-active"
                            >
                              <div
                                className="dropdown__button d-flex items-center text-14 bg-white -dark-bg-dark-2 border-light rounded-8 px-20 py-10 text-14 lh-12"
                                data-el-toggle=".js-category-toggle"
                                data-el-toggle-active=".js-category-active"
                              >
                                <span className="js-dropdown-title"></span>
                                <i className="icon text-9 ml-40 icon-chevron-down"></i>
                              </div>

                              <div
                                id="dd14content"
                                className="toggle-element -dropdown -dark-bg-dark-2 -dark-border-white-10 js-click-dropdown js-category-toggle"
                              >
                                <div className="text-14 y-gap-15 js-dropdown-list"></div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              id="dd15button"
                              className="dropdown js-dropdown js-review-active -is-dd-active -is-el-visible"
                            >
                              <div
                                className="dropdown__button d-flex items-center text-14 bg-white -dark-bg-dark-2 border-light rounded-8 px-20 py-10 text-14 lh-12"
                                data-el-toggle=".js-review-toggle"
                                data-el-toggle-active=".js-review-active"
                              >
                                <span className="js-dropdown-title">
                                  Old Review
                                </span>
                                <i className="icon text-9 ml-40 icon-chevron-down"></i>
                              </div>

                              <div
                                id="dd15content"
                                className="toggle-element -dropdown -dark-bg-dark-2 -dark-border-white-10 js-click-dropdown js-review-toggle"
                              >
                                <div className="text-14 y-gap-15 js-dropdown-list">
                                  <div>
                                    <a
                                      href="#"
                                      className="d-block js-dropdown-link"
                                    >
                                      Animation
                                    </a>
                                  </div>

                                  <div>
                                    <a
                                      href="#"
                                      className="d-block js-dropdown-link"
                                    >
                                      Design
                                    </a>
                                  </div>

                                  <div>
                                    <a
                                      href="#"
                                      className="d-block js-dropdown-link"
                                    >
                                      Illustration
                                    </a>
                                  </div>

                                  <div>
                                    <a
                                      href="#"
                                      className="d-block js-dropdown-link"
                                    >
                                      Business
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Suspense
                      key={search}
                      fallback={<div>No Courses Found</div>}
                    >
                      <div className="row y-gap-30 pt-30">
                        {courses.length == 0 ? (
                          <span>No Courses Found</span>
                        ) : (
                          courses.map((course, index) => (
                            <DashboardCourseCard course={course} key={index} />
                          ))
                        )}
                      </div>
                    </Suspense>

                    <div className="row justify-center pt-30">
                      <div className="col-auto">{/* <Pagination /> */}</div>
                    </div>
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
