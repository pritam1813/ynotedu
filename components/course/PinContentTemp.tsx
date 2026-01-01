
import { socialMediaLinks } from "@/data/socials";
import Link from "next/link";
import ModalVideoComponent from "../common/ModalVideo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import styles from "../../public/assets/css/PinContent.module.css";
import { CourseWithInstructor } from "../CustomCourseList";

export default function PinContentTemp({
  course,
}: {
  course: CourseWithInstructor;
}) {

  return (
    <>
      <div
        id="js-pin-content"
        // style={
        //   screenWidth < 991
        //     ? { height: "fit-content", right: "0%" }
        //     : { height: "100%", right: "7%", paddingTop: "80px" }
        // }
        // className="courses-single-info js-pin-content"

        className={`${styles.pinContent} courses-single-info js-pin-content`}
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
              //   alt={course?.title || "Course thumbnail"}
              alt="Course thumbnail"
            />
            <div className="absolute-full-center d-flex justify-center items-center">
              <div
                // onClick={() => setIsOpen(true)}
                className="d-flex justify-center items-center size-60 rounded-full bg-white js-gallery cursor"
                data-gallery="gallery1"
              >
                <div className="icon-play text-18"></div>
              </div>
            </div>
          </div>

          <div className="courses-single-info__content scroll-bar-1 pt-30 pb-20 px-20">
            {/* <div className="d-flex justify-between items-center mb-30">
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
            </div> */}

            {/* {renderActionButtons()} */}

            {/* {coursePrice !== 0 && !enrollmentStatus.enrolled && (
              <div className="text-14 lh-1 text-center mt-30">
                30-Day Money-Back Guarantee
              </div>
            )} */}

            {/* <div className="mt-25">
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
            </div> */}

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
      {/* <ModalVideoComponent
        videoId={videoId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      /> */}
    </>
  );
}