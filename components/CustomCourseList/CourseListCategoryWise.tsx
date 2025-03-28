"use client";
import React, { useState } from "react";
import { CourseWithCategory } from ".";
import CourseCard from "./CourseCard";

export default function CourseListCategoryWise({
  categories,
}: {
  categories: CourseWithCategory[];
}) {
  // setting active category as the first category with courses length not equals to 0
  const [activeCategory, setActiveCategory] = useState<CourseWithCategory>(
    categories.filter((catgory) => catgory.courses.length != 0)[0]
  );

  return (
    <>
      <div className="tabs__controls flex-wrap  pt-50 d-flex justify-center x-gap-10 js-tabs-controls">
        {categories
          .filter((catgory) => catgory.courses.length != 0)
          .slice(0, 7)
          .map((category) => (
            <div key={category.id}>
              <div
                onClick={() => {
                  console.log(activeCategory.courses.length);

                  setActiveCategory(category);
                }}
              >
                <button
                  className={`tabs__button px-15 py-8 rounded-8 js-tabs-button ${
                    activeCategory == category ? "tabActive" : ""
                  } `}
                  data-tab-target=".-tab-item-2"
                  type="button"
                >
                  {category.label}
                </button>
              </div>
            </div>
          ))}
      </div>
      <div
        className="pt-60 m-auto row y-gap-30 container pl-0 pr-0"
        data-aos="fade-right"
        data-aos-offset="80"
        data-aos-duration={800}
      >
        {activeCategory.courses.length != 0 &&
          activeCategory.courses.map((course, index) => (
            <CourseCard
              key={index}
              data={course}
              // index={index}
              data-aos="fade-right"
              data-aos-duration={(index + 1) * 300}
            />
          ))}
      </div>
    </>
  );
}
