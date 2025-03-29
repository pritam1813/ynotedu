"use client";
import React, { useState } from "react";
import type { Category, Course } from "@prisma/client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface CategoryWithCourses extends Category {
  courses: Course[];
}

export default function CoursesSideBar({
  categories,
}: {
  categories: CategoryWithCourses[];
}) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  // const [ratingOpen, setRatingOpen] = useState(true);
  // const [instractorOpen, setInstractorOpen] = useState(true);
  // const [priceOpen, setPriceOpen] = useState(true);
  // const [levelOpen, setLevelOpen] = useState(true);
  // const [openLanguage, setOpenLanguage] = useState(true);
  // const [durationOpen, setDurationOpen] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleCategory(checked: boolean, name: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) params.append("category", name);
    else params.delete("category", name);

    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="sidebar -courses">
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
                    // onClick={() => setFilterCategories([])}
                    className="sidebar-checkbox__item"
                  >
                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        // defaultChecked={
                        //   filterCategories.length ? false : true
                        // }
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
                    .slice(0, 5)
                    .map((elm, i) => (
                      <div key={i} className="sidebar-checkbox__item cursor">
                        <div className="form-checkbox">
                          <input
                            type="checkbox"
                            name={elm.id.toString()}
                            onChange={(e) =>
                              handleCategory(e.target.checked, e.target.name)
                            }
                            defaultValue={searchParams
                              .get("category")
                              ?.toString()}
                          />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon icon-check"></div>
                          </div>
                        </div>

                        <div className="sidebar-checkbox__title">
                          {elm.label}
                        </div>
                        <div className="sidebar-checkbox__count">
                          ({elm.courses.length})
                        </div>
                      </div>
                    ))}
                </div>

                {/* <div className="sidebar__more mt-15">
                  <a
                    href="#"
                    className="text-14 fw-500 underline text-purple-1"
                  >
                    Show more
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="sidebar__item">
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
                              onClick={() => setFilterRatingRange([])}
                              className="sidebar-checkbox__item"
                            >
                              <div className="form-radio mr-10">
                                <div className="radio">
                                  <input
                                    type="radio"
                                    defaultChecked={
                                      filterRatingRange.length < 1
                                    }
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
                                    textSize={"text-11"}
                                    textColor={undefined}
                                  />
                                </div>
                                All
                              </div>
                              <div className="sidebar-checkbox__count"></div>
                            </div>
                            {rating.map((elm, i) => (
                              <div
                                key={i}
                                onClick={() =>
                                  handleFilterRatingRange(elm.range)
                                }
                                className="sidebar-checkbox__item cursor"
                              >
                                <div className="form-radio mr-10">
                                  <div className="radio">
                                    <input
                                      type="radio"
                                      defaultChecked={
                                        filterRatingRange.join(" ").trim() ===
                                        elm.range.join(" ").trim()
                                      }
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
                                      textSize={"text-11"}
                                      textColor={undefined}
                                    />
                                  </div>
                                  {elm.text}
                                </div>
                                <div className="sidebar-checkbox__count">
                                  (
                                  {
                                    coursesData.filter(
                                      (itm) =>
                                        itm.rating >= elm.range[0] &&
                                        itm.rating <= elm.range[1]
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
                </div>

                <div className="sidebar__item">
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

                              <div className="sidebar-checkbox__title">All</div>
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
                                    coursesData.filter(
                                      (itm) => itm.authorName == elm.title
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
                </div>

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
                                      defaultChecked={filterPrice == elm.title}
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
                </div>

                <div className="sidebar__item">
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

                              <div className="sidebar-checkbox__title">All</div>
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
                </div>

                <div className="sidebar__item">
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
                              <div className="sidebar-checkbox__title">All</div>
                              <div className="sidebar-checkbox__count"></div>
                            </div>
                            {languages.map((elm, i) => (
                              <div
                                key={i}
                                className="sidebar-checkbox__item cursor"
                                onClick={() => handleFilterlanguange(elm.title)}
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
                </div>

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
                              <div className="sidebar-checkbox__title">All</div>
                              <div className="sidebar-checkbox__count"></div>
                            </div>
                            {duration.map((elm, i) => (
                              <div
                                key={i}
                                className="sidebar-checkbox__item cursor"
                                onClick={() => handleFilterDuration(elm.range)}
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
