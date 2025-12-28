"use client";

import { useState } from "react";
import type { Meeting } from "@prisma/client";
import Overview from "../courseSingle/Overview";
import CourseContent from "../courseSingle/CourseContent";
import Instractor from "../courseSingle/Instractor";
import Reviews from "../courseSingle/Reviews";
import Classes from "../courseSingle/Classes";
import { CourseWithInstructor } from "../CustomCourseList";

type TabId = "overview" | "course-content" | "instructors" | "classes" | "reviews";

const menuItems: { id: TabId; text: string }[] = [
  { id: "overview", text: "Overview" },
  { id: "course-content", text: "Course Content" },
  { id: "instructors", text: "Instructors" },
  { id: "classes", text: "Classes" },
  { id: "reviews", text: "Reviews" },
];

interface CourseDetailsTabProps {
  course: CourseWithInstructor;
}

export default function CourseDetailsTab({ course }: CourseDetailsTabProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const meetings: Meeting[] = course.meetings || [];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "course-content":
        return <CourseContent />;
      case "instructors":
        return <Instractor />;
      case "classes":
        return <Classes meetings={meetings} />;
      case "reviews":
        return <Reviews />;
      default:
        return <Overview />;
    }
  };

  return (
    <section className="layout-pt-md layout-pb-md">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="page-nav-menu -line">
              <div className="d-flex x-gap-30">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`pb-12 page-nav-menu__link ${activeTab === item.id ? "is-active" : ""
                        }`}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {item.text}
                    </button>
                  </div>
                ))}
              </div>

            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>
    </section>
  );
}

