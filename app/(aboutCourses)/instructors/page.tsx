import React from "react";
import PageLinks from "@/components/common/PageLinks";
import InstructorListTwo from "@/components/aboutCourses/instractors/InstructorListTwo";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { type Instructor } from "@prisma/client";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Instructors({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const pageParam = (await searchParams).page;
  const limitParam = (await searchParams).limit;

  const limit = Array.isArray(limitParam) ? limitParam[0] : limitParam ?? "9";
  const page = Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1";

  const data = await fetch(
    `${getBaseUrl()}/api/instructors?page=${page}&limit=${limit}`
  ).then((res) => res.json());

  const instructors: Instructor[] = data.instructors;

  return (
    <div className="content-wrapper  js-content-wrapper overflow-hidden">
      <PageLinks dark={undefined} />

      {/* <Instractors /> */}
      {/* <InstractorsTwo /> */}
      <section className="page-header -type-1">
        <div className="container">
          <div className="page-header__content">
            <div className="row justify-center text-center">
              <div className="col-auto">
                <div>
                  <h1 className="page-header__title">Instructors</h1>
                </div>

                <div>
                  <p className="page-header__text">
                    We’re on a mission to deliver engaging, curated courses at a
                    reasonable price.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <InstructorList /> */}
      <InstructorListTwo
        instructors={instructors}
        page={parseInt(page)}
        limit={parseInt(limit)}
        totalCount={data.totalCount}
      />
    </div>
  );
}
