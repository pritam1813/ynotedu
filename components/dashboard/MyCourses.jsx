"use client";

import React, { useEffect, useState } from "react";
import FooterNine from "../layout/footers/FooterNine";
import Pagination from "../common/Pagination";
import CoursesCardDashboard from "./DashBoardCards/CoursesCardDashboard";
import Link from "next/link";

export default function MyCourses() {
  const [pageItems, setPageItems] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [allEnrollments, setAllEnrollments] = useState([]);

  // Fetch enrolled courses from API
  useEffect(() => {
    const fetchEnrollments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/enrollments");
        if (response.ok) {
          const data = await response.json();
          // Transform enrollment data to match expected format
          const transformedData = data.map((enrollment) => ({
            id: enrollment.course.id,
            imageSrc: enrollment.course.thumbnail || "/assets/img/coursesCards/9.png",
            authorName: enrollment.course.instructor?.name || "Unknown",
            title: enrollment.course.title,
            rating: enrollment.course.rating || 0,
            completed: 0, // TODO: Implement progress tracking
            category: enrollment.course.category?.label || "General",
            status: "Enrolled", // All fetched are enrolled
            enrolledAt: enrollment.enrolledAt,
            courseId: enrollment.courseId,
          }));
          setAllEnrollments(transformedData);
          setPageItems(transformedData);
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Filter based on active tab (for future progress tracking)
  useEffect(() => {
    if (activeTab === 1) {
      // All enrolled courses
      setPageItems(allEnrollments);
    } else if (activeTab === 2) {
      // Completed courses (for now, none)
      setPageItems(allEnrollments.filter((elm) => elm.completed >= 100));
    } else if (activeTab === 3) {
      // In progress (for now, all enrolled)
      setPageItems(allEnrollments.filter((elm) => elm.completed < 100));
    }
  }, [activeTab, allEnrollments]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">My Courses</h1>
            <div className="mt-10">
              {isLoading
                ? "Loading your courses..."
                : `You have enrolled in ${allEnrollments.length} course${allEnrollments.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="tabs -active-purple-2 js-tabs">
                <div className="tabs__controls d-flex items-center pt-20 px-30 border-bottom-light js-tabs-controls">
                  <button
                    className={`text-light-1 lh-12 tabs__button js-tabs-button ${activeTab === 1 ? "is-active" : ""
                      } `}
                    data-tab-target=".-tab-item-1"
                    type="button"
                    onClick={() => setActiveTab(1)}
                  >
                    All Enrolled
                  </button>
                  <button
                    className={`text-light-1 lh-12 tabs__button js-tabs-button ml-30 ${activeTab === 2 ? "is-active" : ""
                      } `}
                    data-tab-target=".-tab-item-2"
                    type="button"
                    onClick={() => setActiveTab(2)}
                  >
                    Completed
                  </button>
                  <button
                    className={`text-light-1 lh-12 tabs__button js-tabs-button ml-30 ${activeTab === 3 ? "is-active" : ""
                      } `}
                    data-tab-target=".-tab-item-3"
                    type="button"
                    onClick={() => setActiveTab(3)}
                  >
                    In Progress
                  </button>
                </div>

                <div className="tabs__content py-30 px-30 js-tabs-content">
                  <div className="tabs__pane -tab-item-1 is-active">
                    <div className="row y-gap-10 justify-between">
                      <div className="col-auto">
                        <form
                          className="search-field border-light rounded-8 h-50"
                          onSubmit={handleSubmit}
                        >
                          <input
                            required
                            className="bg-white -dark-bg-dark-2 pr-50"
                            type="text"
                            placeholder="Search Courses"
                          />
                          <button className="" type="submit">
                            <i className="icon-search text-light-1 text-20"></i>
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="row y-gap-30 pt-30">
                      {isLoading ? (
                        <div className="col-12 text-center py-30">
                          <div className="text-18 text-light-1">
                            Loading your courses...
                          </div>
                        </div>
                      ) : pageItems.length === 0 ? (
                        <div className="col-12 text-center py-30">
                          <div className="text-18 text-dark-1 mb-20">
                            {activeTab === 1
                              ? "You haven't enrolled in any courses yet."
                              : activeTab === 2
                                ? "No completed courses yet."
                                : "No courses in progress."}
                          </div>
                          {activeTab === 1 && (
                            <Link href="/courses">
                              <button className="button -md -purple-1 text-white">
                                Browse Courses
                              </button>
                            </Link>
                          )}
                        </div>
                      ) : (
                        pageItems.map((data, i) => (
                          <CoursesCardDashboard data={data} key={i} />
                        ))
                      )}
                    </div>

                    {pageItems.length > 0 && (
                      <div className="row justify-center pt-30">
                        <div className="col-auto">
                          <Pagination />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterNine />
    </div>
  );
}
