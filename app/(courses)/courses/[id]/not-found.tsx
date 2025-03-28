import React from "react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Course Not Found | Ynotedu",
  description: "The requested course could not be found.",
};

export default function CourseNotFound() {
  return (
    <section className="no-page layout-pt-lg layout-pb-lg bg-beige-1">
      <div className="container">
        <div className="row y-gap-50 justify-between items-center">
          <div className="col-lg-6">
            <div className="no-page__img">
              <Image
                width={630}
                height={480}
                src="/assets/img/404/1.svg"
                alt="image"
              />
            </div>
          </div>

          <div className="col-xl-5 col-lg-6">
            <div className="no-page__content">
              <h1 className="no-page__main text-dark-1">
                40<span className="text-purple-1">4</span>
              </h1>
              <h2 className="text-35 lh-12 mt-5">Course Not Found</h2>
              <div className="mt-10">
                The course you&apos;re looking for doesn&apos;t exist or has
                been removed.
                <br />
                Try checking our course catalog for similar options.
              </div>
              <div className="d-flex mt-20">
                <Link href="/courses">
                  <button className="button -md -purple-1 text-white mr-10">
                    Browse All Courses
                  </button>
                </Link>
                <Link href="/">
                  <button className="button -md -outline-purple-1 text-purple-1">
                    Go to Homepage
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
