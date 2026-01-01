
import { socialMediaLinks } from "@/data/socials";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import styles from "../../../public/assets/css/PinContent.module.css";
import { CourseWithInstructor } from "@/components/CustomCourseList";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";
import OpenVideoModal from "./OpenVideoModal";


export default function PinContent({
    course,
    isEnrolled,
}: {
    course: CourseWithInstructor;
    isEnrolled: boolean;
}) {
    const coursePrice = course?.price ?? 0;
    // const courseDuration = course?.duration || "Not specified";
    // const courseLevel = course?.level || "All levels";
    // const courseLanguage = course?.language || "English";
    const courseId = course?.id ?? 0;
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
                            alt={course?.title || "Course thumbnail"}
                        />
                        <OpenVideoModal />
                    </div>

                    <div className="courses-single-info__content scroll-bar-1 pt-30 pb-20 px-20">
                        {!isEnrolled && <div className="d-flex justify-between items-center mb-30">
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
                        </div>}

                        {!isEnrolled && <AddToCartButton courseId={courseId} />}
                        {!isEnrolled && coursePrice > 0 && (
                            <BuyNowButton courseId={courseId} price={coursePrice} />
                        )}
                        {isEnrolled && (
                            <>
                                <Link href={`/courses/${courseId}`}>
                                    <button className="button -md -green-1 text-dark w-1/1">
                                        Continue Learning
                                    </button>
                                </Link>
                                <div className="text-14 lh-1 text-center text-dark-1 mt-15">
                                    ✓ You are enrolled in this course
                                </div>
                            </>
                        )}

                        {coursePrice !== 0 && !isEnrolled && (
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
                                <div>{course.lessons}</div>
                            </div>

                            <div className="d-flex justify-between py-8 border-top-light">
                                <div className="d-flex items-center text-dark-1">
                                    <div className="icon-puzzle"></div>
                                    <div className="ml-10">Quizzes</div>
                                </div>
                                <div>3</div>
                            </div>

                            <div className="d-flex justify-between py-8 border-top-light">
                                <div className="d-flex items-center text-dark-1">
                                    <div className="icon-clock-2"></div>
                                    <div className="ml-10">Duration</div>
                                </div>
                                <div>{course.duration}</div>
                            </div>

                            <div className="d-flex justify-between py-8 border-top-light">
                                <div className="d-flex items-center text-dark-1">
                                    <div className="icon-bar-chart-2"></div>
                                    <div className="ml-10">Skill level</div>
                                </div>
                                <div>{course.level}</div>
                            </div>

                            <div className="d-flex justify-between py-8 border-top-light">
                                <div className="d-flex items-center text-dark-1">
                                    <div className="icon-translate"></div>
                                    <div className="ml-10">Language</div>
                                </div>
                                <div>{course.language}</div>
                            </div>

                            <div className="d-flex justify-between py-8 border-top-light">
                                <div className="d-flex items-center text-dark-1">
                                    <div className="icon-badge"></div>
                                    <div className="ml-10">Certificate</div>
                                </div>
                                <div>Yes</div>
                            </div>

                            <div className="d-flex justify-between py-8 border-top-light">
                                <div className="d-flex items-center text-dark-1">
                                    <div className="icon-infinity"></div>
                                    <div className="ml-10">Full lifetime access</div>
                                </div>
                                <div>Yes</div>
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
        </>
    );
}