import React from "react";

import JoinToday from "@/components/aboutCourses/become/JoinToday";
import PageHeading from "@/components/aboutCourses/become/PageHeading";
import Tabs from "@/components/aboutCourses/become/Tabs";
import Instructors from "@/components/common/Instructors";
import LearningCommon from "@/components/common/LearningCommon";
import PageLinks from "@/components/common/PageLinks";
import FooterOne from "@/components/layout/footers/FooterOne";

export const metadata = {
  title: "Become Instructor || Ynotedu - Professional LMS Online Education",
  description:
    "Elevate your e-learning content with Ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function InstructorBecome() {
  return (
    <div className="main-content  ">
      {/* <Preloader/>
        <Header/> */}
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />
        <PageHeading />
        <section className=" layout-pb-lg">
          <div className="container">
            <Tabs />
            <LearningCommon />
          </div>
        </section>

        <JoinToday />

        <Instructors backgroundColor={undefined} />

        <FooterOne />
      </div>
    </div>
  );
}
