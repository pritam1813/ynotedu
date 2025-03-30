"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function CourseListSortDropDown() {
  const [sortOption, setSortOption] = useState("newest");
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Filter handlers
  function handleFilter(sortby: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (sortby) {
      params.set("sort", sortby);
    } else {
      params.delete(sortby);
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="col-auto">
      <div className="d-flex items-center">
        <div className="text-14 lh-12 fw-500 text-dark-1 mr-20">Sort by:</div>

        <div className="dropdown js-dropdown js-category-active">
          <div className="dropdown__button d-flex items-center text-14 rounded-8 px-20 py-10 text-14 lh-12">
            <span className="js-dropdown-title">
              {sortOptions.find((option) => option.value === sortOption)
                ?.label || "Newest"}
            </span>
            <i className="icon text-9 ml-10 icon-chevron-down"></i>
          </div>

          <div className="dropdown__item">
            <div className="y-gap-15 js-dropdown-list">
              {sortOptions.map((option, index) => (
                <div key={index}>
                  <button
                    className="d-block js-dropdown-link cursor"
                    onClick={() => {
                      setSortOption(option.value);
                      handleFilter(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
