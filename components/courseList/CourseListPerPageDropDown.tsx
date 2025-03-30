"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function CourseListPerPageDropDown() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Get initial value from URL or default to 9
  const initialLimit = Number(searchParams.get("limit")) || 9;
  const [limitOption, setLimitOption] = useState(initialLimit);

  // Update state when URL changes
  useEffect(() => {
    setLimitOption(Number(searchParams.get("limit")) || 9);
  }, [searchParams]);

  const limitOptions = [
    { value: 6, label: "6 per page" },
    { value: 9, label: "9 per page" },
    { value: 12, label: "12 per page" },
    { value: 15, label: "15 per page" },
  ];

  // Handle limit change
  function handleLimitChange(limit: number) {
    const params = new URLSearchParams(searchParams.toString());

    // Set the new limit
    params.set("limit", limit.toString());

    // Reset to page 1 when changing items per page
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="col-auto d-block lg:d-none">
      <div className="d-flex items-center">
        <div className="text-14 lh-12 fw-500 text-dark-1 mr-20">Show:</div>

        <div className="dropdown js-dropdown js-category-active">
          <div className="dropdown__button d-flex items-center text-14 rounded-8 px-20 py-10 text-14 lh-12">
            <span className="js-dropdown-title">
              {limitOptions.find((option) => option.value === limitOption)
                ?.label || "9 per page"}
            </span>
            <i className="icon text-9 ml-10 icon-chevron-down"></i>
          </div>

          <div className="dropdown__item">
            <div className="y-gap-15 js-dropdown-list">
              {limitOptions.map((option, index) => (
                <div key={index}>
                  <button
                    className={`d-block js-dropdown-link cursor ${
                      limitOption === option.value ? "active" : ""
                    }`}
                    onClick={() => {
                      setLimitOption(option.value);
                      handleLimitChange(option.value);
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
