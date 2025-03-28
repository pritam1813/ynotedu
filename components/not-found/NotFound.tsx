import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
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
              <h2 className="text-35 lh-12 mt-5">
                Oops! It looks like you&apos;re lost.
              </h2>
              <div className="mt-10">
                The page you&apos;re looking for isn&apos;t available. Try to
                search again
                <br /> or use the go to.
              </div>
              <Link href="/">
                <button className="button -md -purple-1 text-white mt-20">
                  Go Back To Homepage
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
