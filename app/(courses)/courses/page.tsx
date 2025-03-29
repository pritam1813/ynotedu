import React, { Suspense } from "react";
import PageLinks from "@/components/common/PageLinks";

import { getBaseUrl } from "@/utils/getBaseUrl";

import CoursePageHeader from "@/components/courseList/CoursePageHeader";
import CoursesSideBar from "@/components/courseList/CoursesSideBar";
import CourseList from "@/components/courseList/CourseList";

export const metadata = {
  title: "Courses || Ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function Courses(props: {
  searchParams?: Promise<{
    category?: string;
    page?: string;
  }>;
}) {
  const res = await fetch(`${getBaseUrl()}/api/courses/categories`);
  const data = await res.json();
  const searchParams = await props.searchParams;
  const category = searchParams?.category || "";

  return (
    <div className="main-content  ">
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />

        <CoursePageHeader />

        <section className="layout-pt-md layout-pb-lg">
          <div className="container">
            <div className="row y-gap-50">
              <div className="col-xl-3 col-lg-4 lg:d-none">
                <div className="pr-30 lg:pr-0">
                  <CoursesSideBar categories={data} />
                </div>
              </div>

              <div className="col-xl-9 col-lg-8">
                <Suspense key={category} fallback={<div>Loading...</div>}>
                  <CourseList category={category} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
