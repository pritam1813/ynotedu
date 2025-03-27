"use client";
import React, { useState, useEffect } from "react";
import type { Course, Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const [showAllCategories, setShowAllCategories] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Filter categories with at least one course
  const filteredCategories = categories.filter(
    (category) => category.courses.length > 0
  );

  // Initial display limit for categories
  const INITIAL_CATEGORY_LIMIT = 3;

  // Categories to display based on showAllCategories state
  const displayedCategories = showAllCategories
    ? filteredCategories
    : filteredCategories.slice(0, INITIAL_CATEGORY_LIMIT);

  // Always show the button as long as there is at least one category
  const showMoreButton = filteredCategories.length > 0;

  // Function to get the current selected categories from URL params
  const getSelectedCategories = () => {
    const params = new URLSearchParams(searchParams.toString());
    return params.getAll("category");
  };

  // Keep track of selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    getSelectedCategories()
  );

  //   // Get the current rating from URL params
  //   const getCurrentRating = (): string => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     return params.get("rating") || "";
  //   };

  //   // Keep track of selected rating
  //   const [selectedRating, setSelectedRating] = useState<string>(
  //     getCurrentRating()
  //   );

  // Update URL when selectedCategories change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing category params
    params.delete("category");

    // Add new category params
    selectedCategories.forEach((category) => {
      params.append("category", category);
    });

    replace(`${pathname}?${params.toString()}`);
  }, [selectedCategories, pathname, replace, searchParams]);

  // Update URL when selectedRating changes
  //   useEffect(() => {
  //     const params = new URLSearchParams(searchParams.toString());

  //     // Update rating param
  //     if (selectedRating) {
  //       params.set("rating", selectedRating);
  //     } else {
  //       params.delete("rating");
  //     }

  //     replace(`${pathname}?${params.toString()}`);
  //   }, [selectedRating, pathname, replace, searchParams]);

  // Check if all categories are deselected (or none are selected)
  const isAllSelected = selectedCategories.length === 0;

  // Handle checkbox changes
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      // Add the category to selected categories
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      // Remove the category from selected categories
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
  };

  // Handle "All" checkbox
  const handleAllCategories = () => {
    setSelectedCategories([]);
  };

  // Handle rating radio button changes
  const handleRatingChange = (rating: string) => {
    // If the same rating is clicked again, deselect it
    const params = new URLSearchParams(searchParams.toString());
    if (rating) {
      params.set("rating", rating);
    } else {
      params.delete("rating");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  // Toggle between showing all categories and limited categories
  const toggleCategoriesDisplay = () => {
    setShowAllCategories(!showAllCategories);
  };

  return (
    <div className="sidebar -courses">
      {/* Categories */}
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
              style={categoryOpen ? { maxHeight: "550px" } : {}}
            >
              <div className="accordion__content__inner">
                <div className="sidebar-checkbox">
                  <div className="sidebar-checkbox__item cursor">
                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleAllCategories}
                      />
                      <div className="form-checkbox__mark">
                        <div className="form-checkbox__icon icon-check"></div>
                      </div>
                    </div>

                    <div className="sidebar-checkbox__title">All</div>
                    <div className="sidebar-checkbox__count"></div>
                  </div>

                  {displayedCategories.map((elm) => (
                    <div
                      key={elm.id.toString()}
                      className="sidebar-checkbox__item cursor"
                    >
                      <div className="form-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(
                            elm.id.toString()
                          )}
                          onChange={(e) =>
                            handleCategoryChange(
                              elm.id.toString(),
                              e.target.checked
                            )
                          }
                        />
                        <div className="form-checkbox__mark">
                          <div className="form-checkbox__icon icon-check"></div>
                        </div>
                      </div>

                      <div className="sidebar-checkbox__title">{elm.label}</div>
                      <div className="sidebar-checkbox__count">
                        ({elm.courses.length})
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sidebar__more mt-15">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCategoriesDisplay();
                    }}
                    className="text-14 fw-500 underline text-purple-1"
                  >
                    {showAllCategories ? "Show less" : "Show more"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating */}
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
                  <div className="sidebar-checkbox__item cursor">
                    <div className="form-radio mr-10">
                      <div className="radio">
                        <input
                          type="radio"
                          onChange={() => handleRatingChange(undefined)}
                          name="rating"
                        />
                        <div className="radio__mark">
                          <div className="radio__icon"></div>
                        </div>
                      </div>
                    </div>
                    <div className="sidebar-checkbox__title d-flex items-center">
                      <div className="d-flex x-gap-5 pr-10">All</div>
                    </div>
                  </div>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="sidebar-checkbox__item cursor">
                      <div className="form-radio mr-10">
                        <div className="radio">
                          <input
                            type="radio"
                            onChange={() =>
                              handleRatingChange((5 - i).toString())
                            }
                            name="rating"
                          />
                          <div className="radio__mark">
                            <div className="radio__icon"></div>
                          </div>
                        </div>
                      </div>
                      <div className="sidebar-checkbox__title d-flex items-center">
                        <div className="d-flex x-gap-5 pr-10">
                          <Star
                            star={5 - i}
                            textSize={"text-11"}
                            textColor={undefined}
                          />
                        </div>
                      </div>
                      <div className="sidebar-checkbox__count">
                        ({5 - i}
                        {i == 0 ? "" : "+"})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="sidebar__item">
                    <div className="accordion js-accordion">
                      <div
                        className={`accordion__item js-accordion-item-active ${
                          instractorOpen ? "is-active" : ""
                        } `}
                      >
                        <div
                          className="accordion__button items-center"
                          onClick={() => setInstractorOpen((pre) => !pre)}
                        >
                          <h5 className="sidebar__title">Instructors</h5>

                          <div className="accordion__icon">
                            <div className="icon icon-chevron-down"></div>
                            <div className="icon icon-chevron-up"></div>
                          </div>
                        </div>

                        <div
                          className="accordion__content"
                          style={instractorOpen ? { maxHeight: "350px" } : {}}
                        >
                          <div className="accordion__content__inner">
                            <div className="sidebar-checkbox">
                              <div
                                className="sidebar-checkbox__item"
                                onClick={() => setFilterInstractors([])}
                              >
                                <div className="form-checkbox">
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      filterInstractors.length ? false : true
                                    }
                                  />
                                  <div className="form-checkbox__mark">
                                    <div className="form-checkbox__icon icon-check"></div>
                                  </div>
                                </div>

                                <div className="sidebar-checkbox__title">
                                  All
                                </div>
                                <div className="sidebar-checkbox__count"></div>
                              </div>
                              {instractorNames.map((elm, i) => (
                                <div
                                  key={i}
                                  className="sidebar-checkbox__item cursor"
                                  onClick={() =>
                                    handleFilterInstractors(elm.title)
                                  }
                                >
                                  <div className="form-checkbox">
                                    <input
                                      type="checkbox"
                                      defaultChecked={
                                        filterInstractors.includes(elm.title)
                                          ? true
                                          : false
                                      }
                                    />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon icon-check"></div>
                                    </div>
                                  </div>

                                  <div className="sidebar-checkbox__title">
                                    {elm.title}
                                  </div>
                                  <div className="sidebar-checkbox__count">
                                    (
                                    {
                                      // coursesData.filter(
                                      //   (itm) => itm.authorName == elm.title
                                      // ).length
                                    }
                                    )
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="sidebar__more mt-15">
                              <a
                                href="#"
                                className="text-14 fw-500 underline text-purple-1"
                              >
                                Show more
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

      {/* <div className="sidebar__item">
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
                              {prices.map((elm, i) => (
                                <div
                                  key={i}
                                  className="sidebar-checkbox__item cursor"
                                  onClick={() => handleFilterPrice(elm.title)}
                                >
                                  <div className="form-radio mr-10">
                                    <div className="radio">
                                      <input
                                        type="radio"
                                        defaultChecked={
                                          filterPrice == elm.title
                                        }
                                      />
                                      <div className="radio__mark">
                                        <div className="radio__icon"></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="sidebar-checkbox__title">
                                    {elm.title}
                                  </div>
                                  <div className="sidebar-checkbox__count">
                                    (
                                    {elm.title == "Free" &&
                                      coursesData.filter((itm) => !itm.paid)
                                        .length}
                                    {elm.title == "Paid" &&
                                      coursesData.filter((itm) => itm.paid)
                                        .length}
                                    {elm.title == "All" && coursesData.length})
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

      {/* <div className="sidebar__item">
                    <div className="accordion js-accordion">
                      <div
                        className={`accordion__item js-accordion-item-active ${
                          levelOpen ? "is-active" : ""
                        }  `}
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
                                className="sidebar-checkbox__item cursor"
                                onClick={() => setFilterLevels([])}
                              >
                                <div className="form-checkbox">
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      filterLevels.length < 1 ? true : false
                                    }
                                  />
                                  <div className="form-checkbox__mark">
                                    <div className="form-checkbox__icon icon-check"></div>
                                  </div>
                                </div>

                                <div className="sidebar-checkbox__title">
                                  All
                                </div>
                                <div className="sidebar-checkbox__count"></div>
                              </div>
                              {levels.map((elm, i) => (
                                <div
                                  key={i}
                                  className="sidebar-checkbox__item cursor"
                                  onClick={() => handleFilterLevels(elm.title)}
                                >
                                  <div className="form-checkbox">
                                    <input
                                      type="checkbox"
                                      defaultChecked={
                                        filterLevels.includes(elm.title)
                                          ? true
                                          : false
                                      }
                                    />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon icon-check"></div>
                                    </div>
                                  </div>

                                  <div className="sidebar-checkbox__title">
                                    {elm.title}
                                  </div>
                                  <div className="sidebar-checkbox__count">
                                    (
                                    {
                                      coursesData.filter((itm) => !itm.paid)
                                        .length
                                    }
                                    )
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

      {/* <div className="sidebar__item">
                    <div className="accordion js-accordion">
                      <div
                        className={`accordion__item js-accordion-item-active ${
                          openLanguage ? "is-active" : ""
                        } `}
                      >
                        <div
                          className="accordion__button items-center"
                          onClick={() => setOpenLanguage((pre) => !pre)}
                        >
                          <h5 className="sidebar__title">Languange</h5>

                          <div className="accordion__icon">
                            <div className="icon icon-chevron-down"></div>
                            <div className="icon icon-chevron-up"></div>
                          </div>
                        </div>

                        <div
                          className="accordion__content"
                          style={openLanguage ? { maxHeight: "350px" } : {}}
                        >
                          <div className="accordion__content__inner">
                            <div className="sidebar-checkbox">
                              <div
                                className="sidebar-checkbox__item cursor"
                                onClick={() => setFilterlanguange([])}
                              >
                                <div className="form-checkbox">
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      filterlanguange.length ? false : true
                                    }
                                  />
                                  <div className="form-checkbox__mark">
                                    <div className="form-checkbox__icon icon-check"></div>
                                  </div>
                                </div>
                                <div className="sidebar-checkbox__title">
                                  All
                                </div>
                                <div className="sidebar-checkbox__count"></div>
                              </div>
                              {languages.map((elm, i) => (
                                <div
                                  key={i}
                                  className="sidebar-checkbox__item cursor"
                                  onClick={() =>
                                    handleFilterlanguange(elm.title)
                                  }
                                >
                                  <div className="form-checkbox">
                                    <input
                                      type="checkbox"
                                      defaultChecked={
                                        filterlanguange.includes(elm.title)
                                          ? true
                                          : false
                                      }
                                    />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon icon-check"></div>
                                    </div>
                                  </div>
                                  <div className="sidebar-checkbox__title">
                                    {elm.title}
                                  </div>
                                  <div className="sidebar-checkbox__count">
                                    (
                                    {
                                      coursesData.filter(
                                        (itm) => itm.languange == elm.title
                                      ).length
                                    }
                                    )
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="sidebar__more mt-15">
                              <a
                                href="#"
                                className="text-14 fw-500 underline text-purple-1"
                              >
                                Show more
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

      {/* <div className="sidebar__item">
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
                                className="sidebar-checkbox__item"
                                onClick={() => setFilterDuration([])}
                              >
                                <div className="form-checkbox">
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      filterDuration.length ? false : true
                                    }
                                  />
                                  <div className="form-checkbox__mark">
                                    <div className="form-checkbox__icon icon-check"></div>
                                  </div>
                                </div>
                                <div className="sidebar-checkbox__title">
                                  All
                                </div>
                                <div className="sidebar-checkbox__count"></div>
                              </div>
                              {duration.map((elm, i) => (
                                <div
                                  key={i}
                                  className="sidebar-checkbox__item cursor"
                                  onClick={() =>
                                    handleFilterDuration(elm.range)
                                  }
                                >
                                  <div className="form-checkbox">
                                    <input
                                      type="checkbox"
                                      defaultChecked={
                                        filterDuration.toString() ==
                                        elm.range.toString()
                                          ? true
                                          : false
                                      }
                                    />
                                    <div className="form-checkbox__mark">
                                      <div className="form-checkbox__icon icon-check"></div>
                                    </div>
                                  </div>
                                  <div className="sidebar-checkbox__title">
                                    {elm.title}
                                  </div>
                                  <div className="sidebar-checkbox__count">
                                    (
                                    {
                                      coursesData.filter(
                                        (itm) =>
                                          itm.duration >= elm.range[0] &&
                                          itm.duration <= elm.range[1]
                                      ).length
                                    }
                                    )
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
    </div>
  );
}
