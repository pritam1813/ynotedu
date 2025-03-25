import React from "react";
import Brands from "@/components/common/Brands";
import Categories from "@/components/homes/categories/Categories";
import HomeHero from "@/components/homes/heros/HomeHero";
import Courses from "@/components/homes/courses/Courses";
import TestimonialsOne from "@/components/common/TestimonialsOne";
import FeaturesOne from "@/components/homes/features/FeaturesOne";
import WhyCourse from "@/components/homes/WhyCourse";
import Instructors from "@/components/common/Instructors";
import GetApp from "@/components/homes/GetApp";
import Blog from "@/components/homes/blogs/Blog";
import Join from "@/components/homes/join/Join";

export const metadata = {
  title: "Home || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Home() {
  return (
    <div className="content-wrapper js-content-wrapper overflow-hidden">
      <HomeHero />
      <Brands backgroundColorComponent={null} brandsTwo={null} />
      <Categories />
      <Courses />
      <TestimonialsOne />
      <FeaturesOne />
      <WhyCourse />
      <Instructors backgroundColor={null} />
      <GetApp />
      <Blog />
      <Join />
    </div>
  );
}
