import React from "react";
import { getBaseUrl } from "@/utils/getBaseUrl";

export default async function CoursePageHeader({
  coursecount,
}: {
  coursecount: number;
}) {
  // Get total course count for display
  try {
    // const res = await fetch(`${getBaseUrl()}/api/courses/count`);
    // const { totalCourses } = await res.json();

    return (
      <section className="page-header -type-1">
        <div className="container">
          <div className="page-header__content">
            <div className="row justify-between items-center">
              <div className="col-auto">
                <div>
                  <h1 className="page-header__title">Explore Our Courses</h1>
                </div>

                <div>
                  <p className="page-header__text">
                    Discover {coursecount}+ courses taught by industry experts
                    and expand your knowledge. From beginner to advanced levels
                    in various categories.
                  </p>
                </div>
              </div>

              {/* <div className="col-xl-4 col-lg-5">
                <div className="bg-white shadow-1 rounded-8 py-20 px-30">
                  <h4 className="text-20 fw-500 mb-20">
                    What do you want to learn?
                  </h4>
                  <form className="form-search" action="#">
                    <div className="search-field">
                      <input
                        className="search-field__input"
                        type="text"
                        placeholder="Search courses..."
                      />
                      <button className="search-field__btn" type="submit">
                        <i className="icon-search text-20"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching course count:", error);

    // Fallback in case of error
    return (
      <section className="page-header -type-1">
        <div className="container">
          <div className="page-header__content">
            <div className="row">
              <div className="col-auto">
                <div>
                  <h1 className="page-header__title">Explore Our Courses</h1>
                </div>

                <div>
                  <p className="page-header__text">
                    Discover hundreds of courses taught by industry experts and
                    expand your knowledge. From beginner to advanced levels in
                    various categories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
