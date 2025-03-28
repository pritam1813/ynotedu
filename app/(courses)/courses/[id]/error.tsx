"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function CourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
                alt="error illustration"
              />
            </div>
          </div>

          <div className="col-xl-5 col-lg-6">
            <div className="no-page__content">
              <h1 className="no-page__main text-dark-1">
                Er<span className="text-purple-1">ror</span>
              </h1>
              <h2 className="text-35 lh-12 mt-5">
                Oops! Something went wrong.
              </h2>
              <div className="mt-10">
                We encountered an error while loading this course.
                <br />
                You can try again or browse our other courses.
              </div>
              <div className="d-flex mt-20">
                <button
                  onClick={() => reset()}
                  className="button -md -purple-1 text-white mr-10"
                >
                  Try Again
                </button>
                <Link href="/courses">
                  <button className="button -md -outline-purple-1 text-purple-1">
                    Browse Courses
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
