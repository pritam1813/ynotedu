"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Star from "@/components/common/Star";
import { coursesData } from "@/data/courses";
import { Meeting } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";

// Sample class schedule data
const classScheduleData = [
  {
    id: 1,
    title: "Chemistry",
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    totalSlots: 10,
    availableSlots: 2,
  },
  {
    id: 2,
    title: "Physics",
    date: new Date(), // Today (in progress)
    startTime:
      (new Date().getHours() % 12 || 12) +
      ":" +
      (new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes()) +
      (new Date().getHours() >= 12 ? " PM" : " AM"),
    endTime:
      ((new Date().getHours() + 3) % 12 || 12) +
      ":" +
      (new Date().getMinutes() < 10
        ? "0" + new Date().getMinutes()
        : new Date().getMinutes()) +
      (new Date().getHours() + 3 >= 12 ? " PM" : " AM"),
    totalSlots: 8,
    availableSlots: 2,
  },
  {
    id: 3,
    title: "Maths",
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    startTime: "02:00 PM",
    endTime: "04:00 PM",
    totalSlots: 12,
    availableSlots: 0,
  },
  {
    id: 4,
    title: "Biology",
    date: new Date(Date.now() + 86400000), // Tomorrow
    startTime: "11:00 AM",
    endTime: "01:00 PM",
    totalSlots: 15,
    availableSlots: 2,
  },
  {
    id: 5,
    title: "Maths",
    date: new Date(Date.now() + 86400000 * 7), // 7 days from now
    startTime: "10:00 AM",
    endTime: "12:30 PM",
    totalSlots: 10,
    availableSlots: 10,
  },
];

export default function InstructorTabsSwitching({
  meetings,
}: {
  meetings: Meeting[];
}) {
  const [activeTab, setActiveTab] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Function to check if a class is currently in progress
  const isClassInProgress = (
    classDate: Date,
    startTime: string,
    endTime: string
  ) => {
    const now = new Date(); // Use new Date() for real-time comparison

    // Get date portions to compare
    const todayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const itemDate = new Date(
      classDate.getFullYear(),
      classDate.getMonth(),
      classDate.getDate()
    );

    // If not today, it can't be in progress
    if (todayDate.getTime() !== itemDate.getTime()) {
      return false;
    }

    // Parse times for today's date
    const [startHours, startMinutes] = parseTimeString(startTime);
    const [endHours, endMinutes] = parseTimeString(endTime);

    // Create date objects for today with the specified times
    const startDateTime = new Date();
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date();
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    // Check if current time is between start and end
    const isInProgress = now >= startDateTime && now <= endDateTime;

    // Debug log
    if (todayDate.getTime() === itemDate.getTime()) {
      console.log("Class check:", {
        title: "Responsive Web Design Workshop",
        now: now.toLocaleTimeString(),
        start: startDateTime.toLocaleTimeString(),
        end: endDateTime.toLocaleTimeString(),
        isInProgress,
      });
    }

    return isInProgress;
  };

  // Helper function to parse time strings like "10:30 AM" or "2:00 PM"
  const parseTimeString = (timeString: string) => {
    const [timePart, modifier] = timeString.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return [hours, minutes];
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-8 col-lg-9 col-md-11">
            <div className="tabs -active-purple-2 js-tabs">
              <div className="tabs__controls d-flex js-tabs-controls">
                <button
                  onClick={() => setActiveTab(1)}
                  className={`tabs__button js-tabs-button ${
                    activeTab == 1 ? "is-active" : ""
                  }`}
                  data-tab-target=".-tab-item-1"
                  type="button"
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  className={`tabs__button js-tabs-button ml-30 ${
                    activeTab == 2 ? "is-active" : ""
                  } `}
                  data-tab-target=".-tab-item-2"
                  type="button"
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveTab(3)}
                  className={`tabs__button js-tabs-button ml-30 ${
                    activeTab == 3 ? "is-active" : ""
                  } `}
                  data-tab-target=".-tab-item-3"
                  type="button"
                >
                  Class Schedule
                </button>
              </div>

              <div className="tabs__content pt-60 lg:pt-40 js-tabs-content">
                <div
                  className={`tabs__pane -tab-item-1  ${
                    activeTab == 1 ? "is-active" : ""
                  } `}
                >
                  <h4 className="text-20">Description</h4>
                  <p className="text-light-1 mt-30">
                    Phasellus enim magna, varius et commodo ut, ultricies vitae
                    velit. Ut nulla tellus, eleifend euismod pellentesque vel,
                    sagittis vel justo. In libero urna, venenatis sit amet
                    ornare non, suscipit nec risus. Sed consequat justo non
                    mauris pretium at tempor justo sodales. Quisque tincidunt
                    laoreet malesuada. Cum sociis natoque penatibus et magnis
                    dis parturient montes, nascetur.
                    <br />
                    <br />
                    This course is aimed at people interested in UI/UX Design.
                    We'll start from the very beginning and work all the way
                    through, step by step. If you already have some UI/UX Design
                    experience but want to get up to speed using Adobe XD then
                    this course is perfect for you too!
                    <br />
                    <br />
                    First, we will go over the differences between UX and UI
                    Design. We will look at what our brief for this real-world
                    project is, then we will learn about low-fidelity wireframes
                    and how to make use of existing UI design kits.
                  </p>
                  <button className="button underline text-purple-1 mt-30">
                    Show More
                  </button>
                </div>

                <div
                  className={`tabs__pane -tab-item-2 ${
                    activeTab == 2 ? "is-active" : ""
                  } `}
                >
                  <div className="row">
                    {coursesData.slice(0, 2).map((elm, i) => (
                      <div key={i} className="col-md-6">
                        <div className="coursesCard -type-1 rounded-8 shadow-3 bg-white">
                          <div className="relative">
                            <div className="coursesCard__image overflow-hidden rounded-top-8">
                              <Image
                                width={510}
                                height={360}
                                className="w-1/1"
                                src={elm.imageSrc}
                                alt="image"
                              />
                              <div className="coursesCard__image_overlay rounded-top-8"></div>
                            </div>
                            <div className="d-flex justify-between py-10 px-10 absolute-full-center z-3">
                              {elm.popular && (
                                <div>
                                  <div className="px-15 rounded-200 bg-purple-1">
                                    <span className="text-11 lh-1 uppercase fw-500 text-white">
                                      Popular
                                    </span>
                                  </div>
                                </div>
                              )}
                              {elm.bestSeller && (
                                <div>
                                  <div className="px-15 rounded-200 bg-green-1">
                                    <span className="text-11 lh-1 uppercase fw-500 text-dark-1">
                                      Best sellers
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="h-100 pt-20 pb-15 px-30">
                            <div className="d-flex items-center">
                              <div className="text-14 lh-1 text-yellow-1 mr-10">
                                {elm.rating}
                              </div>
                              <div className="d-flex x-gap-5 items-center">
                                <Star
                                  star={Math.round(elm.rating)}
                                  textSize={undefined}
                                  textColor={undefined}
                                />
                              </div>
                              <div className="text-13 lh-1 ml-10">
                                ({elm.ratingCount})
                              </div>
                            </div>

                            <div className="text-17 lh-15 fw-500 text-dark-1 mt-10">
                              <Link
                                className="linkCustom"
                                href={`/courses/${elm.id}`}
                              >
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
                                <div className="text-14 lh-1">
                                  {elm.lessonCount} lesson
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
                                  src={elm.authorImageSrc}
                                  alt="image"
                                />
                                <div>Ali Tufa{elm.authorName}</div>
                              </div>

                              <div className="coursesCard-footer__price">
                                {elm.paid ? (
                                  <>
                                    <div>${elm.originalPrice}</div>
                                    <div>${elm.discountedPrice}</div>
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
                </div>

                <div
                  className={`tabs__pane -tab-item-3 ${
                    activeTab == 3 ? "is-active" : ""
                  } `}
                >
                  <h4 className="text-20">Upcoming Classes</h4>

                  <div className="mt-30">
                    {classScheduleData.map((classItem, i) => (
                      <div
                        key={i}
                        className="py-20 px-30 rounded-8 bg-white shadow-3 mb-10"
                      >
                        <div className="row y-gap-20 justify-between items-center">
                          <div className="col-xl-5 col-lg-4">
                            <h5 className="text-17 fw-500">
                              {classItem.title}
                            </h5>
                            <div className="d-flex items-center mt-10">
                              <div className="mr-8">
                                <FontAwesomeIcon
                                  icon={faCalendar}
                                  width={16}
                                  height={17}
                                />
                              </div>
                              <div className="text-14 lh-1 text-light-1">
                                {formatDate(classItem.date)}
                              </div>
                            </div>
                            <div className="d-flex items-center mt-10">
                              <div className="mr-8">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  width={16}
                                  height={17}
                                />
                              </div>
                              <div className="text-14 lh-1 text-light-1">
                                {classItem.startTime} - {classItem.endTime}
                              </div>
                            </div>
                          </div>

                          <div className="col-auto">
                            {classItem.availableSlots !== 0 && (
                              <div className="d-flex items-center">
                                <div className="mr-10 text-14 lh-1 text-light-1">
                                  {classItem.availableSlots}/
                                  {classItem.totalSlots} slots available
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="col-auto">
                            {/* Class #2 is forced to always show the Attend Class button */}
                            {(i === 1 ||
                              isClassInProgress(
                                classItem.date,
                                classItem.startTime,
                                classItem.endTime
                              )) && (
                              <Link
                                href={`/classroom/${classItem.id}`}
                                className="button -md -dark-1 text-white"
                              >
                                Attend Class
                              </Link>
                            )}
                            {classItem.date > currentTime &&
                              classItem.availableSlots > 0 &&
                              i !== 1 && (
                                /* Don't show Reserve button for class #2 */
                                <button className="button -md -purple-1 text-white">
                                  Reserve Slot
                                </button>
                              )}
                            {classItem.availableSlots === 0 && (
                              <div className="px-15 py-8 rounded-200 bg-error-1">
                                <span className="text-14 lh-1 fw-500 text-white">
                                  Slots Full
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
