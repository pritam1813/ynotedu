"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import ModalVideoComponent from "../common/ModalVideo";
import Image from "next/image";
import { CourseWithInstructor } from "../CustomCourseList";
import { socialMediaLinks } from "@/data/socials";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PinContent({
  course,
}: {
  course: CourseWithInstructor;
}) {
  const { isAddedToCartCourses, addCourseToCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const [screenWidth, setScreenWidth] = useState(0);

  // Default values for possible undefined properties
  const coursePrice = course?.price ?? 0;
  const courseDuration = course?.duration || "Not specified";
  const courseLevel = course?.level || "All levels";
  const courseLanguage = course?.language || "English";
  const courseId = course?.id ?? 0;

  // Default values for course information
  const lessonsCount = 20; // Static values for now, would be better coming from API
  const quizzesCount = 3;
  const hasCertificate = true;
  const hasLifetimeAccess = true;
  const videoId = "LlCwHnp3kL4";

  useEffect(() => {
    // Set initial width
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        id="js-pin-content"
        style={
          screenWidth < 991
            ? { height: "fit-content", right: "0%" }
            : { height: "100%", right: "7%", paddingTop: "80px" }
        }
        className="courses-single-info js-pin-content"
      >
        <div
          style={{ position: "sticky", top: "100px" }}
          className="bg-white shadow-2 rounded-8 border-light py-10 px-10"
        >
          <div className="relative">
            <Image
              width={368}
              height={238}
              className="w-1/1"
              // src={course?.thumbnail || "/assets/img/coursesCards/9.png"}
              src="/assets/img/coursesCards/9.png"
              alt={course?.title || "Course thumbnail"}
            />
            <div className="absolute-full-center d-flex justify-center items-center">
              <div
                onClick={() => setIsOpen(true)}
                className="d-flex justify-center items-center size-60 rounded-full bg-white js-gallery cursor"
                data-gallery="gallery1"
              >
                <div className="icon-play text-18"></div>
              </div>
            </div>
          </div>

          <div className="courses-single-info__content scroll-bar-1 pt-30 pb-20 px-20">
            <div className="d-flex justify-between items-center mb-30">
              {coursePrice !== 0 ? (
                <>
                  <div className="text-24 lh-1 text-dark-1 fw-500">
                    ${coursePrice}
                  </div>
                  <div className="lh-1 line-through">
                    ${coursePrice + 0.1 * coursePrice}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-24 lh-1 text-dark-1 fw-500">Free</div>
                  <div></div>
                </>
              )}
            </div>

            <button
              className="button -md -purple-1 text-white w-1/1"
              onClick={() => addCourseToCart(courseId)}
            >
              {isAddedToCartCourses(courseId) ? "Already Added" : "Add To Cart"}
            </button>
            <button className="button -md -outline-dark-1 text-dark-1 w-1/1 mt-10">
              Buy Now
            </button>

            {coursePrice !== 0 && (
              <div className="text-14 lh-1 text-center mt-30">
                30-Day Money-Back Guarantee
              </div>
            )}

            <div className="mt-25">
              <div className="d-flex justify-between py-8 ">
                <div className="d-flex items-center text-dark-1">
                  <div className="icon-video-file"></div>
                  <div className="ml-10">Lessons</div>
                </div>
                <div>{lessonsCount}</div>
              </div>

              <div className="d-flex justify-between py-8 border-top-light">
                <div className="d-flex items-center text-dark-1">
                  <div className="icon-puzzle"></div>
                  <div className="ml-10">Quizzes</div>
                </div>
                <div>{quizzesCount}</div>
              </div>

              <div className="d-flex justify-between py-8 border-top-light">
                <div className="d-flex items-center text-dark-1">
                  <div className="icon-clock-2"></div>
                  <div className="ml-10">Duration</div>
                </div>
                <div>{courseDuration}</div>
              </div>

              <div className="d-flex justify-between py-8 border-top-light">
                <div className="d-flex items-center text-dark-1">
                  <div className="icon-bar-chart-2"></div>
                  <div className="ml-10">Skill level</div>
                </div>
                <div>{courseLevel}</div>
              </div>

              <div className="d-flex justify-between py-8 border-top-light">
                <div className="d-flex items-center text-dark-1">
                  <div className="icon-translate"></div>
                  <div className="ml-10">Language</div>
                </div>
                <div>{courseLanguage}</div>
              </div>

              <div className="d-flex justify-between py-8 border-top-light">
                <div className="d-flex items-center text-dark-1">
                  <div className="icon-badge"></div>
                  <div className="ml-10">Certificate</div>
                </div>
                <div>{hasCertificate ? "Yes" : "No"}</div>
              </div>

              <div className="d-flex justify-between py-8 border-top-light">
                <div className="d-flex items-center text-dark-1">
                  <div className="icon-infinity"></div>
                  <div className="ml-10">Full lifetime access</div>
                </div>
                <div>{hasLifetimeAccess ? "Yes" : "No"}</div>
              </div>
            </div>

            <div className="d-flex justify-center pt-15">
              {socialMediaLinks.map((social) => (
                <Link
                  target="_blank"
                  href={social.href}
                  key={social.id}
                  className="d-flex justify-center items-center size-40 rounded-full"
                >
                  <FontAwesomeIcon icon={social.icon} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ModalVideoComponent
        videoId={videoId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
