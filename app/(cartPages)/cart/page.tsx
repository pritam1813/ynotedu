import React from "react";
// import BlogsOne from '@/components/blogs/BlogsOne'
import PageLinks from "@/components/common/PageLinks";
import CourseCart from "@/components/cartsAndCheckout/CourseCart";
// import Preloader from '@/components/common/Preloader'
// import FooterOne from '@/components/layout/footers/FooterOne'
// import Header from '@/components/layout/headers/Header'
// import CourseCart from "../../../components/cartsAndCheckout/CourseCart";

export const metadata = {
  title: "Cart || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Cart() {
  return (
    <div className="main-content  ">
      {/* <Preloader/>

        <Header/> */}
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />

        <CourseCart />

        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
