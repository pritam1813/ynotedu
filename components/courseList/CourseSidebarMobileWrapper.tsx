"use client";

import React, { useState } from "react";
import CourseSidebarMobile from "./CourseSidebarMobile";
import type { Category, Course } from "@prisma/client";

interface CategoryWithCourses extends Category {
  courses: Course[];
}

export default function CourseSidebarMobileWrapper({
  categories,
}: {
  categories: CategoryWithCourses[];
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  return (
    <>
      <button
        className="button h-50 px-30 -light-7 text-purple-1"
        onClick={toggleFilter}
      >
        <i className="icon-filter mr-10"></i>
        Filter
      </button>

      {/* Mobile Sidebar Filter */}
      <CourseSidebarMobile
        categories={categories}
        isOpen={isFilterOpen}
        onClose={closeFilter}
      />

      {/* Overlay when filter is open */}
      {isFilterOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeFilter}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </>
  );
}
