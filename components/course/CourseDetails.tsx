import Star from "../common/Star";
import { CourseWithInstructor } from "../CustomCourseList";
import CourseDetailsTab from "./CourseDetailsTab";
import Link from "next/link";
import PinContent from "./PinContent";


interface CourseDetailsProps {
  course: CourseWithInstructor;
  isOwner?: boolean;
  isEnrolled?: boolean;
}

export default function CourseDetailsOne({
  course,
  isOwner = false,
  isEnrolled = false,
}: CourseDetailsProps) {
  // Ensure we have instructor data
  const instructorName = course?.instructor?.name || "Unknown Instructor";
  const instructorId = course?.instructor?.id || "Unknown Instructor";
  const instructorImage =
    course?.instructor?.image || "/assets/img/instructors/default.png";
  const rating = course?.rating || 0;
  const enrollmentCount = 853; // This should be dynamic from the API in the future

  return (
    <div id="js-pin-container" className="js-pin-container relative">
      <section className="page-header -type-5 bg-light-6">
        <div className="page-header__bg">
          <div
            className="bg-image js-lazy"
            data-bg="img/event-single/bg.png"
          ></div>
        </div>

        <div className="container">
          <div className="page-header__content pt-90 pb-90">
            <div className="row y-gap-30">
              <div className="col-xl-7 col-lg-8">
                <div className="d-flex x-gap-15 y-gap-10 pb-20">
                  {course?.isPopular ? (
                    <div>
                      <div className="badge px-15 py-8 text-11 bg-purple-1 text-white fw-400">
                        POPULAR
                      </div>
                    </div>
                  ) : course?.isFeatured ? (
                    <div>
                      <div className="badge px-15 py-8 text-11 bg-green-1 text-dark-1 fw-400">
                        FEATURED
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="badge px-15 py-8 text-11 bg-orange-1 text-white fw-400">
                        NEW
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-30 lh-14 pr-60 lg:pr-0">
                    {course?.title || "Course Title Unavailable"}
                  </h1>
                </div>

                <p className="col-xl-9 mt-20">
                  {course?.description ||
                    "No description available for this course."}
                </p>

                <div className="d-flex x-gap-30 y-gap-10 items-center flex-wrap pt-20">
                  <div className="d-flex items-center">
                    <div className="text-14 lh-1 text-yellow-1 mr-10">
                      {rating}
                    </div>
                    <div className="d-flex x-gap-5 items-center">
                      <Star
                        star={rating}
                        textSize={"text-11"}
                        textColor={undefined}
                      />
                    </div>
                    <div className="text-14 lh-1 text-light-1 ml-10">
                      ({rating})
                    </div>
                  </div>

                  <div className="d-flex items-center text-light-1">
                    <div className="icon icon-person-3 text-13"></div>
                    <div className="text-14 ml-8">
                      {enrollmentCount} enrolled on this course
                    </div>
                  </div>

                  <div className="d-flex items-center text-light-1">
                    <div className="icon icon-wall-clock text-13"></div>
                    <div className="text-14 ml-8">
                      {course?.updatedAt
                        ? `Last updated ${new Date(
                          course.updatedAt
                        ).toLocaleDateString()}`
                        : "Last updated recently"}
                    </div>
                  </div>
                </div>

                <div className="d-flex items-center pt-20">
                  <div
                    className="bg-image size-30 rounded-full js-lazy"
                    style={{
                      backgroundImage: `url(${instructorImage})`,
                    }}
                  ></div>
                  <div className="text-14 lh-1 ml-10">
                    <Link href={`/instructors/${instructorId}`}>{instructorName}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PinContent course={course} isEnrolled={isEnrolled} />
      <CourseDetailsTab course={course} isOwner={isOwner} />
    </div>
  );
}

