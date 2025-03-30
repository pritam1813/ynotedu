"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { Course } from "@prisma/client";
import Star from "../common/Star";
import Link from "next/link";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { useSearchParams } from "next/navigation";
import Pagination from "../common/Pagination";

export default function CourseList({ category }: { category: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const coursesPerPage = 9;

  const searchParams = useSearchParams();

  // Get all query parameters
  const categoryParam = searchParams.get("category") || category;
  const levelParam = searchParams.get("level") || "";
  const ratingParam = searchParams.get("rating") || "";
  const priceParam = searchParams.get("price") || "";
  const durationParam = searchParams.get("duration") || "";
  const pageParam = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Build query string with all filter parameters
        let queryString = `${getBaseUrl()}/api/courses?`;

        if (categoryParam) queryString += `category=${categoryParam}&`;
        if (levelParam) queryString += `level=${levelParam}&`;
        if (ratingParam) queryString += `rating=${ratingParam}&`;
        if (priceParam) queryString += `price=${priceParam}&`;
        if (durationParam) queryString += `duration=${durationParam}&`;

        // Add pagination parameters
        queryString += `page=${currentPage}&limit=${coursesPerPage}&sort=${sortOption}`;

        const res = await fetch(queryString);
        const data = await res.json();

        if (data.courses) {
          setCourses(data.courses);
          setTotalCourses(data.totalCount || data.courses.length);
        } else {
          setCourses(data);
          setTotalCourses(data.length);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [
    categoryParam,
    levelParam,
    ratingParam,
    priceParam,
    durationParam,
    currentPage,
    sortOption,
  ]);

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "popular", label: "Most Popular" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Handler for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="row y-gap-20 justify-between items-center mb-30">
        <div className="col-auto">
          <div className="text-14 lh-12">
            Showing <span className="text-dark-1 fw-500">{courses.length}</span>{" "}
            total results
          </div>
        </div>

        <div className="col-auto">
          <div className="d-flex items-center">
            <div className="text-14 lh-12 fw-500 text-dark-1 mr-20">
              Sort by:
            </div>

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
                        onClick={() => setSortOption(option.value)}
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
      </div>

      {loading ? (
        <div className="row justify-center py-50">
          <div className="spinner"></div>
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="row y-gap-30 side-content__wrap">
            {courses.map((course, i) => (
              <div
                key={i}
                className="side-content col-xl-4 col-lg-6 col-md-4 col-sm-6"
              >
                <div className="coursesCard -type-1 ">
                  <div className="relative">
                    <div className="coursesCard__image overflow-hidden rounded-8">
                      <Image
                        width={530}
                        height={370}
                        className="w-1/1"
                        // src={
                        //   course.thumbnail || "/assets/img/coursesCards/6.png"
                        // }
                        src="/assets/img/coursesCards/6.png"
                        alt={course.title}
                      />
                      <div className="coursesCard__image_overlay rounded-8"></div>
                    </div>
                    <div className="d-flex justify-between py-10 px-10 absolute-full-center z-3">
                      {course.isPopular && (
                        <>
                          <div>
                            <div className="px-15 rounded-200 bg-purple-1">
                              <span className="text-11 lh-1 uppercase fw-500 text-white">
                                Popular
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="px-15 rounded-200 bg-green-1">
                              <span className="text-11 lh-1 uppercase fw-500 text-dark-1">
                                Best sellers
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="h-100 pt-15">
                    <div className="d-flex items-center">
                      <div className="text-14 lh-1 text-yellow-1 mr-10">
                        {course.rating}
                      </div>
                      <div className="d-flex x-gap-5 items-center">
                        <Star
                          star={course.rating || 0}
                          textSize={undefined}
                          textColor={undefined}
                        />
                      </div>
                      <div className="text-13 lh-1 ml-10">
                        ({course.reviews || 0})
                      </div>
                    </div>

                    <div className="text-17 lh-15 fw-500 text-dark-1 mt-10">
                      <Link
                        className="linkCustom"
                        href={`/courses/${course.id}`}
                      >
                        {course.title}
                      </Link>
                    </div>

                    <div className="d-flex x-gap-10 items-center pt-10">
                      <div className="d-flex items-center">
                        <div className="mr-8">
                          <Image
                            width={16}
                            height={17}
                            src="/assets/img/coursesCards/icons/1.svg"
                            alt="icon"
                          />
                        </div>
                        <div className="text-14 lh-1">
                          {course.lessons} lesson
                        </div>
                      </div>

                      <div className="d-flex items-center">
                        <div className="mr-8">
                          <Image
                            width={16}
                            height={17}
                            src="/assets/img/coursesCards/icons/2.svg"
                            alt="icon"
                          />
                        </div>
                        <div className="text-14 lh-1">{`${Math.floor(
                          course.duration / 60
                        )}h ${Math.floor(course.duration % 60)}m`}</div>
                      </div>

                      <div className="d-flex items-center">
                        <div className="mr-8">
                          <Image
                            width={16}
                            height={17}
                            src="/assets/img/coursesCards/icons/3.svg"
                            alt="icon"
                          />
                        </div>
                        <div className="text-14 lh-1">{course.level}</div>
                      </div>
                    </div>

                    <div className="coursesCard-footer">
                      <div className="coursesCard-footer__author">
                        <Image
                          width={30}
                          height={30}
                          src="/assets/img/coursesCards/6.png"
                          alt="instructor"
                        />
                        <div>{course.instructorId}</div>
                      </div>

                      <div className="coursesCard-footer__price">
                        {course.price !== 0 ? (
                          <>
                            <div>${course.price}</div>
                            <div>${(course.price + 30).toFixed(2)}</div>
                          </>
                        ) : (
                          <>
                            <div></div>
                            <div>Free</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCourses > coursesPerPage && (
            <div className="row justify-center pt-60">
              <div className="col-auto">
                {/* <Pagination
                  pageCount={Math.ceil(totalCourses / coursesPerPage)}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                /> */}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="row justify-center py-50">
          <div className="col-auto">
            <div className="text-18 lh-1">
              No courses found matching your criteria
            </div>
          </div>
        </div>
      )}
    </>
  );
}
