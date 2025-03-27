import React from "react";
import PageLinks from "@/components/common/PageLinks";
import CourseListOne from "@/components/courseList/CourseListOne";
// import Preloader from "@/components/common/Preloader";
// import FooterOne from "@/components/layout/footers/FooterOne";
// import Header from "@/components/layout/headers/Header";

export const metadata = {
  title: "Courses || Ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Courses() {
  // const categories = await fetch(
  //   "http://localhost:3000/api/courses/categories"
  // );
  // const categoriesData = await categories.json();
  // const courses = await fetch("http://localhost:3000/api/courses");
  // const coursesData = await courses.json();
  return (
    <div className="main-content  ">
      {/* <Preloader/>
        <Header/> */}
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />
        {/* <CourseListOne categories={categoriesData} courses={coursesData} /> */}
        <CourseListOne />
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
