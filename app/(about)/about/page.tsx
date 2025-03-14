import React from "react";
import About from "@/components/about/About";
import Brands from "@/components/common/Brands";
import Instructors from "@/components/common/Instructors";
import PageLinks from "@/components/common/PageLinks";
import TestimonialsOne from "@/components/common/TestimonialsOne";
import WhyCourse from "@/components/homes/WhyCourse";
import FooterOne from "@/components/layout/footers/FooterOne";

export const metadata = {
  title: "About-1 || Ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with Ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function AboutPage() {
  return (
    <div className="main-content  ">
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />
        <About />
        <WhyCourse />
        <TestimonialsOne />
        <Instructors backgroundColor={undefined} />
        <Brands backgroundColorComponent={undefined} brandsTwo={undefined} />
        <FooterOne />
      </div>
    </div>
  );
}
