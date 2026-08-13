import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { safeFetchJson } from "@/utils/safeFetch";
import { CourseWithInstructor } from "../CustomCourseList";
import RatingStar from "../common/RatingStar";

interface CourseListProps {
  category: string;
  rating: number;
  level: string;
  duration: number;
  price: number;
  page: string;
  sort: string;
  limit: number;
}

interface CourseDataProps {
  courses: CourseWithInstructor[];
}

export default async function CourseList({
  category,
  rating,
  level,
  duration,
  price,
  page,
  sort,
  limit,
}: CourseListProps) {
  let queryString = `${getBaseUrl()}/api/courses?`;

  if (category) queryString += `category=${category}&`;
  if (level) queryString += `level=${level}&`;
  if (rating) queryString += `rating=${rating}&`;
  if (price) queryString += `price=${price}&`;
  if (duration) queryString += `duration=${duration}&`;

  queryString += `page=${page}&limit=${limit.toString()}&sort=${sort}`;
  // console.log("final Query string: ", queryString);

  const resData = await safeFetchJson<CourseDataProps>(
    queryString,
    {},
    { courses: [] }
  );
  const courses = Array.isArray(resData?.courses) ? resData.courses : [];

  return (
    <div className="row y-gap-30 side-content__wrap">
      {courses.length > 0 ? (
        <>
          {courses.map((elm, i) => (
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
                      src={elm.thumbnail}
                      alt="image"
                    />
                    <div className="coursesCard__image_overlay rounded-8"></div>
                  </div>
                  <div className="d-flex justify-between py-10 px-10 absolute-full-center z-3">
                    {elm.isPopular && (
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
                      {elm.rating}
                    </div>
                    <div className="d-flex x-gap-5 items-center">
                      <RatingStar rating={Math.floor(elm.rating)} />
                    </div>
                    <div className="text-13 lh-1 ml-10">({elm.reviews})</div>
                  </div>

                  <div className="text-17 lh-15 fw-500 text-dark-1 mt-10">
                    <Link className="linkCustom" href={`/courses/${elm.id}`}>
                      {elm.title}
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
                      <div className="text-14 lh-1">{elm.lessons} lesson</div>
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
                        elm.duration / 60
                      )}h ${Math.floor(elm.duration % 60)}m`}</div>
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
                      <div className="text-14 lh-1">{elm.level}</div>
                    </div>
                  </div>

                  <div className="coursesCard-footer">
                    <div className="coursesCard-footer__author">
                      <Image
                        width={30}
                        height={30}
                        src="/assets/img/coursesCards/6.png"
                        alt="image"
                      />
                      <div>{elm.instructor.name}</div>
                    </div>

                    <div className="coursesCard-footer__price">
                      {elm.price !== 0 ? (
                        <>
                          <div>${elm.price + elm.price * 0.2}</div>
                          <div>${elm.price}</div>
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

              <div className="side-content__item">
                <div className="px-30 pt-20 pb-30 bg-white rounded-8 border-light shadow-2">
                  <div className="text-18 lh-16 text-dark-1">{elm.title}</div>

                  <div className="row x-gap-10 y-gap-10 items-center pt-15">
                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <Image
                          width={16}
                          height={17}
                          className="mr-8"
                          src="/assets/img/coursesCards/icons/1.svg"
                          alt="icon"
                        />
                        <div className="text-14 lh-1">{elm.lessons} lesson</div>
                      </div>
                    </div>

                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <Image
                          width={16}
                          height={17}
                          className="mr-8"
                          src="/assets/img/coursesCards/icons/2.svg"
                          alt="icon"
                        />
                        <div className="text-14 lh-1">{`${Math.floor(
                          elm.duration / 60
                        )}h ${Math.floor(elm.duration % 60)}m`}</div>
                      </div>
                    </div>

                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <Image
                          width={16}
                          height={17}
                          className="mr-8"
                          src="/assets/img/coursesCards/icons/3.svg"
                          alt="icon"
                        />
                        <div className="text-14 lh-1">{elm.level}</div>
                      </div>
                    </div>
                  </div>

                  <div className="d-inline-block px-15 py-5 bg-green-1 text-dark-1 rounded-200 text-11 fw-500 uppercase mt-20">
                    BEST SELLER
                  </div>

                  <p className="text-dark-1 mt-15">
                    Learn the #1 most important building block of all art,
                    Drawing. This course will teach you how to draw like a pro!
                  </p>

                  <div className="row y-gap-15 pt-15">
                    <div className="col-12">
                      <div className="d-flex items-center">
                        <div className="size-20 d-flex items-center justify-center rounded-full border-light">
                          <div className="icon-check text-6"></div>
                        </div>
                        <div className="ml-10">Become a UX designer.</div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-flex items-center">
                        <div className="size-20 d-flex items-center justify-center rounded-full border-light">
                          <div className="icon-check text-6"></div>
                        </div>
                        <div className="ml-10">
                          You will be able to add UX designer.
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-flex items-center">
                        <div className="size-20 d-flex items-center justify-center rounded-full border-light">
                          <div className="icon-check text-6"></div>
                        </div>
                        <div className="ml-10">Become a UI designer.</div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-flex items-center">
                        <div className="size-20 d-flex items-center justify-center rounded-full border-light">
                          <div className="icon-check text-6"></div>
                        </div>
                        <div className="ml-10">
                          Build &amp; test a full website design.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row x-gap-20 y-gap-15 items-center pt-30">
                    <div className="col">
                      <button
                        style={{ padding: "0px 54px" }}
                        className="button -md h-60 -purple-1 text-white col-12 py-54"
                        // onClick={() => addCourseToCart(elm.id)}
                      >
                        {/* {isAddedToCartCourses(elm.id)
                                ? "Already Added"
                                : "Add To Cart"} */}
                        Add to Cart
                      </button>
                    </div>
                    <div className="col-auto">
                      <div className="d-flex items-center justify-center size-60 rounded-full border-light">
                        <div className="icon-bookmark text-20 text-purple-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}
