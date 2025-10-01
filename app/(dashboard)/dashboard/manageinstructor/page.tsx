import React from "react";
import ManageInstructorTable from "./ManageInstructorTable";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ManageInstructor({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  let pageParam = params.page;

  const page = Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1";

  return (
    <div className="dashboard__main">
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Manage Instructors</h1>
            <div className="mt-10">
              Lorem ipsum dolor sit amet, consectetur.
            </div>
          </div>
        </div>

        <div className="row y-gap-30">
          <div className="col-12">
            <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
              <div className="d-flex items-center py-20 px-30 border-bottom-light">
                <h2 className="text-17 lh-1 fw-500">Instructors</h2>
              </div>

              <ManageInstructorTable page={page} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
