"use client";
import React, { useState } from "react";
import type { Category, Course } from "@prisma/client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Star from "../common/Star";

interface CategoryWithCourses extends Category {
  courses: Course[];
}

export default function CourseSidebarMobile({
  categories,
  isOpen,
  onClose,
}: {
  categories: CategoryWithCourses[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Filter handlers
  function handleFilter(paramName: string, value: string, checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    // Reset to page 1 when applying filters
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
  }

  // Helper function to check if filter is active
  function isFilterActive(paramName: string, value: string): boolean {
    return searchParams.get(paramName) === value;
  }

  // Rating options
  const ratingOptions = [
    { value: "4.5", label: "4.5 & up" },
    { value: "4", label: "4.0 & up" },
    { value: "3.5", label: "3.5 & up" },
    { value: "3", label: "3.0 & up" },
  ];

  // Level options
  const levelOptions = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  // Duration options
  const durationOptions = [
    { value: "60", label: "Under 1 hour" },
    { value: "180", label: "1-3 hours" },
    { value: "360", label: "3-6 hours" },
    { value: "720", label: "6-12 hours" },
    { value: "1440", label: "Over 12 hours" },
  ];

  // Price options
  const priceOptions = [
    { value: "0", label: "Free" },
    { value: "25", label: "Under $25" },
    { value: "50", label: "Under $50" },
    { value: "100", label: "Under $100" },
    { value: "200", label: "Under $200" },
  ];

  return (
    <div
      className={`mobile-sidebar-filter ${isOpen ? "is-active" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        right: isOpen ? "0" : "-100%",
        bottom: 0,
        width: "320px",
        maxWidth: "100%",
        backgroundColor: "#fff",
        zIndex: 1000,
        overflow: "auto",
        transition: "right 0.3s ease",
        padding: "20px",
        boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="d-flex justify-between items-center mb-30">
        <h5 className="text-17 fw-500">Filter Courses</h5>
        <button
          onClick={onClose}
          className="icon-close text-16"
          style={{ border: "none", background: "none", cursor: "pointer" }}
        ></button>
      </div>

      <div className="y-gap-30">
        {/* Categories Filter */}
        <div className="filter-section">
          <h5 className="text-16 fw-500 mb-10">Category</h5>
          <div className="sidebar-checkbox">
            <div
              className="sidebar-checkbox__item"
              onClick={() => handleFilter("category", "", false)}
            >
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  checked={!searchParams.has("category")}
                  onChange={() => {}}
                />
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check"></div>
                </div>
              </div>

              <div className="sidebar-checkbox__title">All</div>
              <div className="sidebar-checkbox__count"></div>
            </div>
            {categories
              .filter((category) => category.courses.length !== 0)
              .map((category) => (
                <div
                  key={category.id}
                  className="sidebar-checkbox__item cursor"
                >
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={isFilterActive(
                        "category",
                        category.id.toString()
                      )}
                      onChange={(e) =>
                        handleFilter(
                          "category",
                          category.id.toString(),
                          e.target.checked
                        )
                      }
                    />
                    <div className="form-checkbox__mark">
                      <div className="form-checkbox__icon icon-check"></div>
                    </div>
                  </div>

                  <div className="sidebar-checkbox__title">
                    {category.label}
                  </div>
                  <div className="sidebar-checkbox__count">
                    ({category.courses.length})
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Ratings Filter */}
        <div className="filter-section">
          <h5 className="text-16 fw-500 mb-10">Ratings</h5>
          <div className="sidebar-checkbox">
            <div
              onClick={() => handleFilter("rating", "", false)}
              className="sidebar-checkbox__item"
            >
              <div className="form-radio mr-10">
                <div className="radio">
                  <input
                    type="radio"
                    checked={!searchParams.has("rating")}
                    onChange={() => {}}
                  />
                  <div className="radio__mark">
                    <div className="radio__icon"></div>
                  </div>
                </div>
              </div>
              <div className="sidebar-checkbox__title d-flex items-center">
                <div className="d-flex x-gap-5 pr-10"></div>
                All
              </div>
              <div className="sidebar-checkbox__count"></div>
            </div>
            {ratingOptions.map((item, index) => (
              <div
                className="sidebar-checkbox__item cursor"
                key={index}
                onClick={() =>
                  handleFilter(
                    "rating",
                    item.value,
                    !isFilterActive("rating", item.value)
                  )
                }
              >
                <div className="form-radio mr-10">
                  <div className="radio">
                    <input
                      type="radio"
                      checked={isFilterActive("rating", item.value)}
                      onChange={() => {}}
                    />
                    <div className="radio__mark">
                      <div className="radio__icon"></div>
                    </div>
                  </div>
                </div>
                <div className="sidebar-checkbox__title d-flex items-center">
                  <div className="d-flex x-gap-5 pr-10">
                    <Star
                      star={parseFloat(item.value)}
                      textSize={"text-11"}
                      textColor={undefined}
                    />
                  </div>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div className="filter-section">
          <h5 className="text-16 fw-500 mb-10">Level</h5>
          <div className="sidebar-checkbox">
            <div
              className="sidebar-checkbox__item cursor"
              onClick={() => handleFilter("level", "", false)}
            >
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  checked={!searchParams.has("level")}
                  onChange={() => {}}
                />
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check"></div>
                </div>
              </div>

              <div className="sidebar-checkbox__title">All Levels</div>
              <div className="sidebar-checkbox__count"></div>
            </div>
            {levelOptions.map((level, i) => (
              <div
                key={i}
                className="sidebar-checkbox__item cursor"
                onClick={() =>
                  handleFilter("level", level, !isFilterActive("level", level))
                }
              >
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={isFilterActive("level", level)}
                    onChange={() => {}}
                  />
                  <div className="form-checkbox__mark">
                    <div className="form-checkbox__icon icon-check"></div>
                  </div>
                </div>

                <div className="sidebar-checkbox__title">{level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <h5 className="text-16 fw-500 mb-10">Price</h5>
          <div className="sidebar-checkbox">
            <div
              onClick={() => handleFilter("price", "", false)}
              className="sidebar-checkbox__item"
            >
              <div className="form-radio mr-10">
                <div className="radio">
                  <input
                    type="radio"
                    checked={!searchParams.has("price")}
                    onChange={() => {}}
                  />
                  <div className="radio__mark">
                    <div className="radio__icon"></div>
                  </div>
                </div>
              </div>
              <div className="sidebar-checkbox__title">All Prices</div>
            </div>

            {priceOptions.map((option, i) => (
              <div
                key={i}
                onClick={() =>
                  handleFilter(
                    "price",
                    option.value,
                    !isFilterActive("price", option.value)
                  )
                }
                className="sidebar-checkbox__item cursor"
              >
                <div className="form-radio mr-10">
                  <div className="radio">
                    <input
                      type="radio"
                      checked={isFilterActive("price", option.value)}
                      onChange={() => {}}
                    />
                    <div className="radio__mark">
                      <div className="radio__icon"></div>
                    </div>
                  </div>
                </div>
                <div className="sidebar-checkbox__title">{option.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div className="filter-section">
          <h5 className="text-16 fw-500 mb-10">Duration</h5>
          <div className="sidebar-checkbox">
            <div
              className="sidebar-checkbox__item cursor"
              onClick={() => handleFilter("duration", "", false)}
            >
              <div className="form-radio mr-10">
                <div className="radio">
                  <input
                    type="radio"
                    checked={!searchParams.has("duration")}
                    onChange={() => {}}
                  />
                  <div className="radio__mark">
                    <div className="radio__icon"></div>
                  </div>
                </div>
              </div>
              <div className="sidebar-checkbox__title">Any Duration</div>
            </div>

            {durationOptions.map((option, i) => (
              <div
                key={i}
                onClick={() =>
                  handleFilter(
                    "duration",
                    option.value,
                    !isFilterActive("duration", option.value)
                  )
                }
                className="sidebar-checkbox__item cursor"
              >
                <div className="form-radio mr-10">
                  <div className="radio">
                    <input
                      type="radio"
                      checked={isFilterActive("duration", option.value)}
                      onChange={() => {}}
                    />
                    <div className="radio__mark">
                      <div className="radio__icon"></div>
                    </div>
                  </div>
                </div>
                <div className="sidebar-checkbox__title">{option.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex justify-center mt-30">
        <button
          onClick={onClose}
          className="button -md -purple-1 text-white w-1/1"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
