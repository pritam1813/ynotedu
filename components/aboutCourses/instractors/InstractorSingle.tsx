import React from "react";
import Image from "next/image";
import Link from "next/link";
import InstructorTabsSwitching from "./InstructorTabsSwitching";
import { InstructorWithSocialProfile } from "@/app/(aboutCourses)/instructors/[id]/page";

export default async function InstractorSingle({
  instructor,
}: {
  instructor: InstructorWithSocialProfile;
}) {
  // Check if instructor was not found
  if (instructor == null) {
    return (
      <div className="container py-20">
        <div className="row justify-center">
          <div className="col-xl-8 col-lg-9 col-md-11 text-center">
            <h2 className="text-24 md:text-32 lh-13 text-purple-1 mb-10">
              Instructor Not Found
            </h2>
            <p className="text-16 lh-15 text-dark-1 mb-30">
              The instructor you are looking for does not exist or has been
              removed.
            </p>
            <Link
              href="/instructors"
              className="button -md -purple-1 text-white"
            >
              View All Instructors
            </Link>
          </div>
        </div>
      </div>
    );
  }
  // console.log(instructor);

  const {
    name,
    role,
    image,
    reviews,
    students,
    courses,
    socialProfile,
    meetings,
  } = instructor;

  return (
    <>
      <section className="page-header -type-3">
        <div className="page-header__bg bg-purple-1"></div>
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-8 col-lg-9 col-md-11">
              <div className="page-header__content">
                <div className="page-header__img">
                  <Image
                    width={120}
                    height={120}
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      objectFit: "cover",
                    }}
                    src={
                      image ||
                      // imageSrc ||
                      "/assets/img/Instructors-single/1.png"
                    }
                    alt="image"
                  />
                </div>

                <div className="page-header__info pt-20">
                  <h1 className="text-30 lh-14 fw-700 text-white">{name}</h1>
                  <div className="text-white">{role}</div>
                  <div className="d-flex x-gap-20 pt-15">
                    <div className="d-flex items-center text-white">
                      <div className="icon-star mr-10"></div>
                      <div className="text-13 lh-1">Instructor Rating</div>
                    </div>

                    <div className="d-flex items-center text-white">
                      <div className="icon-video-file mr-10"></div>
                      <div className="text-13 lh-1">
                        {reviews || 3545} Reviews
                      </div>
                    </div>

                    <div className="d-flex items-center text-white">
                      <div className="icon-person-3 mr-10"></div>
                      <div className="text-13 lh-1">
                        {students ||
                          // studentCount ||
                          143}{" "}
                        Students
                      </div>
                    </div>

                    <div className="d-flex items-center text-white">
                      <div className="icon-play mr-10"></div>
                      <div className="text-13 lh-1">
                        {courses ||
                          // courseCount ||
                          453}{" "}
                        Course
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex items-center mt-30">
                  <button className="button -md -green-1 text-dark-1">
                    Send Message
                  </button>

                  <div className="d-flex items-center x-gap-15 text-white ml-25">
                    {socialProfile?.map((itm, index) => (
                      <a key={index} href={itm.url}>
                        <i className={`fa ${itm.icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InstructorTabsSwitching meetings={meetings} />
    </>
  );
}
