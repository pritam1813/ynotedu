import React from "react";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Category, Course, Instructor } from "@prisma/client";
import CourseListCategoryWise from "./CourseListCategoryWise";

export interface CourseWithInstructor extends Course {
  instructor: Instructor;
}

export interface CourseWithCategory extends Category {
  courses: CourseWithInstructor[];
}

export const revalidate = 3600;

export default async function CustomCourseListHome() {
  const url = `${getBaseUrl()}/api/courses/categories`;
  let categories: CourseWithCategory[] = [];

  try {
    console.log(`[HOMEPAGE FETCH START] Requesting URL: ${url}`);
    const res = await fetch(url);
    console.log(
      `[HOMEPAGE FETCH RESPONSE] Status: ${res.status} ${res.statusText}`
    );

    const contentType = res.headers.get("content-type");
    console.log(`[HOMEPAGE FETCH RESPONSE] Content-Type: ${contentType}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[HOMEPAGE FETCH ERROR] HTTP ${res.status} ${res.statusText} from ${url}:`
      );
      console.error(errorText);
    } else if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text();
      console.error(
        `[HOMEPAGE FETCH ERROR] Expected JSON but received Content-Type '${contentType}' from ${url}:`
      );
      console.error(responseText);
    } else {
      const data = await res.json();
      categories = Array.isArray(data) ? data : [];
      console.log(
        `[HOMEPAGE FETCH SUCCESS] Received ${categories.length} categories.`
      );
    }
  } catch (error) {
    console.error(
      `[HOMEPAGE FETCH EXCEPTION] Exception during fetch to ${url}:`,
      error
    );
  }

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

      {categories.length > 0 && (
        <CourseListCategoryWise
          categories={categories.filter(
            (catgory) => catgory.courses && catgory.courses.length >= 7
          )}
        />
      )}
    </section>
  );
}
