import React from "react";
import PageLinks from "@/components/common/PageLinks";
// import Preloader from "@/components/common/Preloader";
import CourseDetailsOne from "@/components/courseSingle/CourseDetailsOne";
import CourseSlider from "@/components/courseSingle/CourseSlider";
// import FooterOne from "@/components/layout/footers/FooterOne";

// import Header from "@/components/layout/headers/Header";

export const metadata = {
  title: "Couese Page || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //   <Preloader/>
  const { id } = await params;
  return (
    <div className="main-content  ">
      {/* <Header/> */}
      <div className="content-wrapper  js-content-wrapper ">
        <PageLinks dark={undefined} />
        <CourseDetailsOne id={id} />
        <CourseSlider />
        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
