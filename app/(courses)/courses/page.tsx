import React from "react";
import PageLinks from "@/components/common/PageLinks";
import CourseListOne from "@/components/courseList/CourseListOne";
// import Preloader from "@/components/common/Preloader";
// import FooterOne from "@/components/layout/footers/FooterOne";
// import Header from "@/components/layout/headers/Header";

export const metadata = {
  title: "Couese-list-1 || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Courses() {
  return (
    <div className="main-content  ">
      {/* <Preloader/>
        <Header/> */}
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />
        <CourseListOne />
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
