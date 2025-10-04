import React from "react";
import Star from "@/components/common/Star";
import { type Instructor } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import PaginationInstructors from "@/components/common/PaginationInstructors";
import SortInstructors from "./SortInstructors";

export default function InstructorListTwo({
  instructors,
  page,
  limit,
  totalCount,
}: {
  instructors: Instructor[];
  page: number;
  limit: number;
  totalCount: number;
}) {
  //   console.log(instructors.length);

  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-50">
          <div className="col-lg-3 pr-50">
            <div className="sidebar -courses">
              {/* Category */}
              {/* <div className="sidebar__item">
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
                              onClick={() => setFilterCategories([])}
                              className="sidebar-checkbox__item"
                            >
                              <div className="form-checkbox">
                                <input
                                  type="checkbox"
                                  defaultChecked={
                                    filterCategories.length ? false : true
                                  }
                                />
                                <div className="form-checkbox__mark">
                                  <div className="form-checkbox__icon icon-check"></div>
                                </div>
                              </div>

                              <div className="sidebar-checkbox__title">All</div>
                              <div className="sidebar-checkbox__count"></div>
                            </div>
                            {categories.map((elm, i) => (
                              <div
                                key={i}
                                onClick={() => {
                                  handleFilterCategories(elm.title);
                                }}
                                className="sidebar-checkbox__item cursor"
                              >
                                <div className="form-checkbox">
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      filterCategories.includes(elm.title)
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      handleQueryParams(e.currentTarget.value);
                                    }}
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
                                    teamMembers.filter(
                                      (itm) => itm.category == elm.title
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
              {/* <CategoryFilter
                  categories={categories}
                  teamMembers={teamMembers}
                  filterCategories={filterCategories}
                  setFilterCategories={setFilterCategories}
                  handleQueryParams={handleQueryParams}
                /> */}

              {/* Ratings */}
              <div className="sidebar__item">
                <div className="accordion js-accordion">
                  <div className={`accordion__item js-accordion-item-active `}>
                    <div
                      className="accordion__button items-center"
                      // onClick={() => setRatingOpen((pre) => !pre)}
                    >
                      <h5 className="sidebar__title">Ratings</h5>

                      <div className="accordion__icon">
                        <div className="icon icon-chevron-down"></div>
                        <div className="icon icon-chevron-up"></div>
                      </div>
                    </div>

                    <div
                      className="accordion__content"
                      // style={ratingOpen ? { maxHeight: "350px" } : {}}
                    >
                      <div className="accordion__content__inner">
                        <div className="sidebar-checkbox">
                          <div
                            //   onClick={() => setFilterRatingRange([])}
                            className="sidebar-checkbox__item"
                          >
                            {/* <div className="form-radio mr-10">
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
                              </div> */}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="row y-gap-20 items-center justify-between pb-30">
              <div className="col-auto">
                <div className="text-14 lh-12">
                  Showing{" "}
                  <span className="text-dark-1 fw-500">
                    {/* {sortedFilteredData.length} */}
                  </span>{" "}
                  total results
                </div>
              </div>

              <SortInstructors />
            </div>

            <div className="row y-gap-30">
              {instructors.map((instructor) => (
                <div key={instructor.id} className="col-lg-4 col-md-6">
                  <div className="teamCard -type-1 px-10 py-10 rounded-8 border-light">
                    <div className="teamCard__image">
                      <Image
                        width={488}
                        height={537}
                        src={instructor.image}
                        alt="image"
                      />
                    </div>
                    <div className="teamCard__content mt-10 px-10 pb-5">
                      <h4 className="teamCard__title">
                        <Link
                          className="linkCustom"
                          href={`/instructors/${instructor.id}`}
                        >
                          {instructor.name}
                        </Link>
                      </h4>
                      <p className="teamCard__text">{instructor.role}</p>
                      <div className="d-flex x-gap-10 pt-10">
                        <div className="d-flex items-center">
                          <div className="icon-star text-yellow-1 text-14"></div>
                          <div className="text-13 lh-1 ml-8">
                            {instructor.rating}
                          </div>
                        </div>

                        <div className="d-flex items-center">
                          <div className="icon-person-3 text-14"></div>
                          <div className="text-13 lh-1 ml-8">
                            {instructor.students} Students
                          </div>
                        </div>

                        <div className="d-flex items-center">
                          <div className="icon-play text-14"></div>
                          <div className="text-13 lh-1 ml-8">
                            {instructor.courses} Course
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row justify-center pt-60 lg:pt-40">
              <div className="col-auto">
                <PaginationInstructors
                  currentPage={page}
                  limit={limit}
                  totalItems={totalCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
