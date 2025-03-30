import React, { Suspense } from "react";
import PageLinks from "@/components/common/PageLinks";

import { getBaseUrl } from "@/utils/getBaseUrl";

import CoursePageHeader from "@/components/courseList/CoursePageHeader";
import CoursesSideBar from "@/components/courseList/CoursesSideBar";
import CourseList from "@/components/courseList/CourseList";
import { CourseWithCategory } from "@/components/CustomCourseList";

import CourseListSortDropDown from "@/components/courseList/CourseListSortDropDown";
import CourseListPagination from "@/components/courseList/CourseListPagination";

import type { Course } from "@prisma/client";

interface CourseDataProps {
  coursesData: Course[];
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
  const page = searchParams?.page || "1";
  const sort = searchParams?.sort || "newest";
  const coursesPerPage = 9;
  // console.log(searchParams);

  let queryString = `${getBaseUrl()}/api/courses?`;

  if (category) queryString += `category=${category}&`;
  if (level) queryString += `level=${level}&`;
  if (rating) queryString += `rating=${rating}&`;
  if (price) queryString += `price=${price}&`;
  if (duration) queryString += `duration=${duration}&`;

  queryString += `page=${page}&limit=${coursesPerPage}&sort=${sort}`;

  const neres = await fetch(queryString);
  const filteredCourses: CourseDataProps = await neres.json();

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
                    {/* <div className="text-14 lh-12">
                      Showing{" "}
                      <span className="text-dark-1 fw-500">
                        {coursesPerPage}
                      </span>{" "}
                      of{" "}
                      <span className="text-dark-1 fw-500">
                        {filteredCourses.totalCount}{" "}
                      </span>
                      courses
                    </div> */}
                    <div className="text-14 lh-12">Available Courses</div>
                  </div>

                  <CourseListSortDropDown />
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
                  <CourseList
                    category={category}
                    rating={rating}
                    level={level}
                    duration={duration}
                    price={price}
                    page={page}
                    sort={sort}
                    limit={coursesPerPage}
                  />
                </Suspense>

                <div className="row justify-center pt-90 lg:pt-50">
                  <div className="col-auto">
                    <CourseListPagination
                      totalCount={filteredCourses.totalCount}
                      coursesPerPage={coursesPerPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
