import React from "react";
import Overview from "../courseSingle/Overview";
import CourseContent from "../courseSingle/CourseContent";
import Instractor from "../courseSingle/Instractor";
import Reviews from "../courseSingle/Reviews";

const menuItems = [
  { id: 1, href: "#overview", text: "Overview", isActive: true },
  { id: 2, href: "#course-content", text: "Course Content", isActive: false },
  { id: 3, href: "#instructors", text: "Instructors", isActive: false },
  { id: 4, href: "#reviews", text: "Reviews", isActive: false },
];

export default function CourseDetailsTab() {
  return (
    <section className="layout-pt-md layout-pb-md">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="page-nav-menu -line">
              <div className="d-flex x-gap-30">
                {menuItems.map((item, ind) => (
                  <div key={ind}>
                    <a
                      href={item.href}
                      className={`pb-12 page-nav-menu__link ${
                        item.isActive ? "is-active" : ""
                      }`}
                    >
                      {item.text}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <Overview />
            <CourseContent />
            <Instractor />
            <Reviews />
          </div>
        </div>
      </div>
    </section>
  );
}
