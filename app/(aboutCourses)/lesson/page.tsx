import React from "react";
import Descriptions from "@/components/aboutCourses/lesson/Descriptions";
import LessonItems from "@/components/aboutCourses/lesson/LessonItems";
import Reviews from "@/components/aboutCourses/lesson/Reviews";
import Video from "@/components/aboutCourses/lesson/Video";

export default function Lesson() {
  return (
    <div className="main-content  ">
      {/* <Preloader/>
        <HeaderTen/> */}
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <LessonItems rightPosition={undefined} />
        <section className="layout-pt-lg layout-pb-lg lg:pt-40">
          <div className="container">
            <div className="row justify-end">
              <div className="col-xxl-8 col-xl-7 col-lg-8">
                <Video />

                <Descriptions />
                <Reviews />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
