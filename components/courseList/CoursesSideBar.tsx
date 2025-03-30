"use client";
import React, { useState } from "react";
import type { Category, Course } from "@prisma/client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Star from "../common/Star";

interface CategoryWithCourses extends Category {
  courses: Course[];
}

export default function CoursesSideBar({
  categories,
}: {
  categories: CategoryWithCourses[];
}) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [levelOpen, setLevelOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [durationOpen, setDurationOpen] = useState(true);

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
    <div className="sidebar -courses">
      {/* Categories Filter */}
      <div className="sidebar__item">
        <div className="accordion js-accordion">
          <div
            className={`accordion__item js-accordion-item-active ${
              categoryOpen ? "is-active" : ""
            } `}
          >
            <div
              className="accordion__button items-center"
              onClick={() => setCategoryOpen((pre) => !pre)}
            >
              <h5 className="sidebar__title">Category</h5>

              <div className="accordion__icon">
                <div className="icon icon-chevron-down"></div>
                <div className="icon icon-chevron-up"></div>
              </div>
            </div>

            <div
              className="accordion__content"
              style={categoryOpen ? { maxHeight: "350px" } : {}}
            >
              <div className="accordion__content__inner">
                <div className="sidebar-checkbox">
                  <div
                    onClick={() => handleFilter("category", "", false)}
                    className="sidebar-checkbox__item"
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
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Filter */}
      <div className="sidebar__item">
        <div className="accordion js-accordion">
          <div
            className={`accordion__item js-accordion-item-active ${
              ratingOpen ? "is-active" : ""
            } `}
          >
            <div
              className="accordion__button items-center"
              onClick={() => setRatingOpen((pre) => !pre)}
            >
              <h5 className="sidebar__title">Ratings</h5>

              <div className="accordion__icon">
                <div className="icon icon-chevron-down"></div>
                <div className="icon icon-chevron-up"></div>
              </div>
            </div>

            <div
              className="accordion__content"
              style={ratingOpen ? { maxHeight: "350px" } : {}}
            >
              <div className="accordion__content__inner">
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
                      <div className="d-flex x-gap-5 pr-10">
                        <Star
                          star={5}
                          textSize="text-11"
                          textColor={undefined}
                        />
                      </div>
                      All
                    </div>
                    <div className="sidebar-checkbox__count"></div>
                  </div>

                  {ratingOptions.map((option, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        handleFilter(
                          "rating",
                          option.value,
                          !isFilterActive("rating", option.value)
                        )
                      }
                      className="sidebar-checkbox__item cursor"
                    >
                      <div className="form-radio mr-10">
                        <div className="radio">
                          <input
                            type="radio"
                            checked={isFilterActive("rating", option.value)}
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
                            star={parseFloat(option.value)}
                            textSize="text-11"
                            textColor={undefined}
                          />
                        </div>
                        {option.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Filter */}
      <div className="sidebar__item">
        <div className="accordion js-accordion">
          <div
            className={`accordion__item js-accordion-item-active ${
              levelOpen ? "is-active" : ""
            } `}
          >
            <div
              className="accordion__button items-center"
              onClick={() => setLevelOpen((pre) => !pre)}
            >
              <h5 className="sidebar__title">Level</h5>

              <div className="accordion__icon">
                <div className="icon icon-chevron-down"></div>
                <div className="icon icon-chevron-up"></div>
              </div>
            </div>

            <div
              className="accordion__content"
              style={levelOpen ? { maxHeight: "350px" } : {}}
            >
              <div className="accordion__content__inner">
                <div className="sidebar-checkbox">
                  <div
                    onClick={() => handleFilter("level", "", false)}
                    className="sidebar-checkbox__item"
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
                        handleFilter(
                          "level",
                          level,
                          !isFilterActive("level", level)
                        )
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
            </div>
          </div>
        </div>
      </div>

      {/* Duration Filter */}
      <div className="sidebar__item">
        <div className="accordion js-accordion">
          <div
            className={`accordion__item js-accordion-item-active ${
              durationOpen ? "is-active" : ""
            } `}
          >
            <div
              className="accordion__button items-center"
              onClick={() => setDurationOpen((pre) => !pre)}
            >
              <h5 className="sidebar__title">Duration</h5>

              <div className="accordion__icon">
                <div className="icon icon-chevron-down"></div>
                <div className="icon icon-chevron-up"></div>
              </div>
            </div>

            <div
              className="accordion__content"
              style={durationOpen ? { maxHeight: "350px" } : {}}
            >
              <div className="accordion__content__inner">
                <div className="sidebar-checkbox">
                  <div
                    onClick={() => handleFilter("duration", "", false)}
                    className="sidebar-checkbox__item"
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
                      <div className="sidebar-checkbox__title">
                        {option.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Filter */}
      <div className="sidebar__item">
        <div className="accordion js-accordion">
          <div
            className={`accordion__item js-accordion-item-active ${
              priceOpen ? "is-active" : ""
            } `}
          >
            <div
              className="accordion__button items-center"
              onClick={() => setPriceOpen((pre) => !pre)}
            >
              <h5 className="sidebar__title">Price</h5>

              <div className="accordion__icon">
                <div className="icon icon-chevron-down"></div>
                <div className="icon icon-chevron-up"></div>
              </div>
            </div>

            <div
              className="accordion__content"
              style={priceOpen ? { maxHeight: "350px" } : {}}
            >
              <div className="accordion__content__inner">
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
                      <div className="sidebar-checkbox__title">
                        {option.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
