import React from "react";
import PageLinks from "@/components/common/PageLinks";
import CourseCheckOut from "@/components/cartsAndCheckout/CourseCheckout";
// import Preloader from '@/components/common/Preloader'
// import FooterOne from '@/components/layout/footers/FooterOne'
// import Header from '@/components/layout/headers/Header'

export const metadata = {
  title: "Course-checkout || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Checkout() {
  return (
    <div className="main-content  ">
      {/* <Preloader/>

        <Header/> */}
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />

        <CourseCheckOut />

        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
