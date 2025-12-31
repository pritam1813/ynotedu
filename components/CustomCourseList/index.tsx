import React from "react";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Category, Course, Instructor, Meeting, DemoLink } from "@prisma/client";
import CourseListCategoryWise from "./CourseListCategoryWise";

export interface CourseWithInstructor extends Course {
  instructor: Instructor;
  meetings?: Meeting[];
  demoLink?: DemoLink | null;
}

export interface CourseWithCategory extends Category {
  courses: CourseWithInstructor[];
}

export const revalidate = 3600;

export default async function CustomCourseListHome() {
  const data = await fetch(`${getBaseUrl()}/api/courses/categories`);
  const categories: CourseWithCategory[] = await data.json();

  // console.log(categories[0].courses);

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="row justify-center text-center">
        <div className="col-auto">
          <div className="sectionTitle ">
            <h2 className="sectionTitle__title sm:text-24">
              Our Most Popular Courses
            </h2>

            <p className="sectionTitle__text ">
              10,000+ unique online course list designs
            </p>
          </div>
        </div>
      </div>

      {categories.length >= 0 && (
        <CourseListCategoryWise
          categories={categories.filter(
            (catgory) => catgory.courses.length >= 7
          )}
        />
      )}
    </section>
  );
}
