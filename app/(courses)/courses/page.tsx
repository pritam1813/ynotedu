import React, { Suspense } from "react";
import PageLinks from "@/components/common/PageLinks";

import { getBaseUrl } from "@/utils/getBaseUrl";

import CoursePageHeader from "@/components/courseList/CoursePageHeader";
import CoursesSideBar from "@/components/courseList/CoursesSideBar";
import CourseList from "@/components/courseList/CourseList";
import {
  CourseWithCategory,
  CourseWithInstructor,
} from "@/components/CustomCourseList";

import CourseListSortDropDown from "@/components/courseList/CourseListSortDropDown";
import CourseListPerPageDropDown from "@/components/courseList/CourseListPerPageDropDown";
import CourseListPagination from "@/components/courseList/CourseListPagination";

interface CourseDataProps {
  courses: CourseWithInstructor[];
  totalCount: number;
}

export const metadata = {
  title: "Courses || Ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function Courses(props: {
  searchParams?: Promise<{
    category?: string;
    rating?: number;
    level?: string;
    duration?: number;
    price?: number;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  const res = await fetch(`${getBaseUrl()}/api/courses/categories`);
  const data: CourseWithCategory[] = await res.json();

  let coursecount = 0;
  data.forEach((el) => (coursecount += el.courses.length));

  const searchParams = await props.searchParams;
  const category = searchParams?.category || "";
  const rating = searchParams?.rating || undefined;
  const level = searchParams?.level || "";
  const duration = searchParams?.duration || undefined;
  const price = searchParams?.price || undefined;

  // Handle edge cases for page and limit
  let page = searchParams?.page || "1";
  // Ensure page is at least 1
  if (parseInt(page) < 1 || isNaN(parseInt(page))) {
    page = "1";
  }

  const sort = searchParams?.sort || "newest";

  // Parse limit parameter or use default
  let coursesPerPage = 9;
  if (searchParams?.limit) {
    const parsedLimit = parseInt(searchParams.limit);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      coursesPerPage = parsedLimit;
    }
  }

  let queryString = `${getBaseUrl()}/api/courses?`;

  if (category) queryString += `category=${category}&`;
  if (level) queryString += `level=${level}&`;
  if (rating) queryString += `rating=${rating}&`;
  if (price) queryString += `price=${price}&`;
  if (duration) queryString += `duration=${duration}&`;

  queryString += `page=${page}&limit=${coursesPerPage}&sort=${sort}`;

  const neres = await fetch(queryString);
  const filteredCourses: CourseDataProps = await neres.json();

  // Calculate items being shown (for the "Showing X of Y courses" text)
  const startItem = (parseInt(page) - 1) * coursesPerPage + 1;
  const endItem = Math.min(
    startItem + coursesPerPage - 1,
    filteredCourses.totalCount
  );
  const itemsShowing =
    filteredCourses.totalCount > 0 ? endItem - startItem + 1 : 0;

  return (
    <div className="main-content  ">
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />

        <CoursePageHeader coursecount={coursecount} />

        <section className="layout-pt-md layout-pb-lg">
          <div className="container">
            <div className="row y-gap-50">
              <div className="col-xl-3 col-lg-4 lg:d-none">
                <div className="pr-30 lg:pr-0">
                  <CoursesSideBar categories={data} />
                </div>
              </div>

              <div className="col-xl-9 col-lg-8">
                <div className="row y-gap-20 justify-between items-center mb-30">
                  <div className="col-auto">
                    <div className="text-14 lh-12">
                      Showing{" "}
                      <span className="text-dark-1 fw-500">
                        {filteredCourses.totalCount === 0 ? 0 : startItem}
                        {filteredCourses.totalCount > 0 && endItem > startItem
                          ? ` - ${endItem}`
                          : ""}
                      </span>{" "}
                      of{" "}
                      <span className="text-dark-1 fw-500">
                        {filteredCourses.totalCount}{" "}
                      </span>
                      courses
                    </div>
                  </div>

                  <div className="col-auto">
                    <div className="d-flex items-center gap-20">
                      <CourseListPerPageDropDown />
                      <div className="me-2"></div>
                      <CourseListSortDropDown />
                    </div>
                  </div>
                </div>
                <Suspense
                  key={
                    category +
                    rating +
                    level +
                    duration +
                    price +
                    page +
                    sort +
                    coursesPerPage
                  }
                  fallback={<div>Loading...</div>}
                >
                  <CourseList coursesData={filteredCourses.courses} />
                </Suspense>

                {filteredCourses.totalCount > 0 && (
                  <div className="row justify-center pt-90 lg:pt-50">
                    <div className="col-auto">
                      <CourseListPagination
                        totalCount={filteredCourses.totalCount}
                        coursesPerPage={coursesPerPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
