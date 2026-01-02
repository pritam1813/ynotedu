"use client";

import React, { useState, useEffect } from "react";
// import { useStore } from "@/store/useStore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ModalVideoComponent from "../common/ModalVideo";
import Image from "next/image";
import { CourseWithInstructor } from "../CustomCourseList";
import { socialMediaLinks } from "@/data/socials";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

interface EnrollmentStatus {
  enrolled: boolean;
  status?: string;
}

export default function PinContentOld({
  course,
}: {
  course: CourseWithInstructor;
}) {
  // const { isAddedToCartCourses, addCourseToCart } = useStore();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>({
    enrolled: false,
  });
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);

  // Default values for possible undefined properties
  const coursePrice = course?.price ?? 0;
  const courseDuration = course?.duration || "Not specified";
  const courseLevel = course?.level || "All levels";
  const courseLanguage = course?.language || "English";
  const courseId = course?.id ?? 0;

  // Default values for course information
  const lessonsCount = 20; // Static values for now
  const quizzesCount = 3;
  const hasCertificate = true;
  const hasLifetimeAccess = true;
  const videoId = "LlCwHnp3kL4";

  const isFree = coursePrice === 0;

  // Check enrollment status on mount and when auth state changes
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!courseId) {
        setIsCheckingEnrollment(false);
        return;
      }

      // Reset checking state when starting a new check
      setIsCheckingEnrollment(true);

      try {
        const response = await fetch(`/api/enrollments/${courseId}`, {
          credentials: 'include',
          // Disable cache to ensure fresh data on reload
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEnrollmentStatus({
            enrolled: data.enrolled,
            status: data.status,
          });
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    // Only check enrollment when authentication is loaded
    if (isLoaded) {
      checkEnrollment();
    }
  }, [courseId, isLoaded, isSignedIn]);

  // Handle screen resize
  useEffect(() => {
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle free course enrollment
  const handleEnroll = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to enroll in this course");
      router.push("/login");
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        setEnrollmentStatus({ enrolled: true, status: "ACTIVE" });
        toast.success("Successfully enrolled in this course!");
        router.push(`/courses/${courseId}/purchase/success`);
      } else if (response.status === 409) {
        setEnrollmentStatus({ enrolled: true, status: "ACTIVE" });
        toast.success("You are already enrolled in this course!");
      } else {
        toast.error(data.error || "Failed to enroll in course");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Handle paid course purchase with PhonePe
  const handlePurchase = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to purchase this course");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch("/api/payments/phonepe/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();

      if (response.ok && data.redirectUrl) {
        toast.success("Redirecting to payment...");
        // Redirect to PhonePe payment page
        window.location.href = data.redirectUrl;
      } else if (response.status === 409) {
        setEnrollmentStatus({ enrolled: true, status: "ACTIVE" });
        toast.success("You are already enrolled in this course!");
      } else {
        toast.error(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Render enrollment button based on state
  const renderActionButtons = () => {
    if (isCheckingEnrollment) {
      return (
        <button
          className="button -md -purple-1 text-white w-1/1"
          disabled
        >
          Loading...
        </button>
      );
    }

    if (enrollmentStatus.enrolled) {
      return (
        <>
          <Link href={`/courses/${courseId}`}>
            <button className="button -md -green-1 text-white w-1/1">
              Continue Learning
            </button>
          </Link>
          <div className="text-14 lh-1 text-center text-green-1 mt-15">
            ✓ You are enrolled in this course
          </div>
        </>
      );
    }

    // Not enrolled - show purchase buttons
    return (
      <>
        {isFree ? (
          // Free course - single enroll button
          <button
            className="button -md -purple-1 text-white w-1/1"
            onClick={handleEnroll}
            disabled={isEnrolling}
          >
            {isEnrolling ? "Enrolling..." : "Enroll Now (Free)"}
          </button>
        ) : (
          // Paid course - Add to cart and Buy Now buttons
          <>
            <button
              className="button -md -purple-1 text-white w-1/1"
            // onClick={() => addCourseToCart(courseId)}
            >
              {/* {isAddedToCartCourses(courseId) ? "Already Added" : "Add To Cart"} */}
            </button>
            <button
              className="button -md -outline-dark-1 text-dark-1 w-1/1 mt-10"
              onClick={handlePurchase}
              disabled={isEnrolling}
            >
              {isEnrolling ? "Processing..." : "Buy Now"}
            </button>
          </>
        )}
      </>
    );
  };

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

            {renderActionButtons()}

            {coursePrice !== 0 && !enrollmentStatus.enrolled && (
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
