import React from "react";
import About from "@/components/about/About";
import Instructors from "@/components/common/Instructors";
import PageLinks from "@/components/common/PageLinks";
import ClientComponentWrapper from "@/components/about/ClientComponentWrapper";
import WhyCourse from "@/components/homes/WhyCourse";
import FooterOne from "@/components/layout/footers/FooterOne";

export const metadata = {
  title: "About || Ynotedu - Professional LMS Online Education ",
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
        <ClientComponentWrapper />
        <Instructors backgroundColor={undefined} />
        <FooterOne />
      </div>
    </div>
  );
}
