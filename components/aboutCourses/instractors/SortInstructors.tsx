"use client";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortInstructors() {
  const [currentSortingOption, setCurrentSortingOption] = useState("Default");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const sortingOptions = ["Default", "Rating (asc)", "Rating (dsc)"];

  function handleSort(option: string) {
    const params = new URLSearchParams(searchParams);
    if (option) {
      if (option === "Rating (asc)") {
        params.set("sort", "asc");
      } else {
        params.set("sort", "desc");
      }
    } else {
      params.delete("sort");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="col-auto">
      <div className="d-flex items-center">
        <div className="text-14 lh-12 fw-500 text-dark-1 mr-20">Sort by:</div>

        <div
          id="dd33button"
          className="dropdown js-dropdown js-category-active"
        >
          <div
            onClick={() => {
              document
                .getElementById("dd33button")
                .classList.toggle("-is-dd-active");
              document
                .getElementById("dd33content")
                .classList.toggle("-is-el-visible");
            }}
            className="dropdown__button d-flex items-center text-14 rounded-8 px-20 py-10 text-14 lh-12"
            data-el-toggle=".js-category-toggle"
            data-el-toggle-active=".js-category-active"
          >
            <span className="js-dropdown-title">{currentSortingOption}</span>
            <i className="icon text-9 ml-40 icon-chevron-down"></i>
          </div>

          <div
            id="dd33content"
            className="toggle-element -dropdown -dark-bg-dark-2 -dark-border-white-10 js-click-dropdown js-category-toggle"
          >
            <div className="text-14 y-gap-15 js-dropdown-list">
              {sortingOptions.map((elm, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentSortingOption((pre) =>
                      pre == elm ? "Default" : elm
                    );
                    handleSort(elm);
                    document
                      .getElementById("dd33button")
                      .classList.toggle("-is-dd-active");
                    document
                      .getElementById("dd33content")
                      .classList.toggle("-is-el-visible");
                  }}
                >
                  <span
                    className={`d-block js-dropdown-link cursor ${
                      currentSortingOption == elm ? "activeMenu" : ""
                    } `}
                  >
                    {elm}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
