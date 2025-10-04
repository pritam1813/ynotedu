import React from "react";
import { getBaseUrl } from "@/utils/getBaseUrl";
import Image from "next/image";
import Link from "next/link";

export default async function ManageInstructorTable({
  page,
}: {
  page: string;
}) {
  const result = await fetch(`${getBaseUrl()}/api/instructors`);
  const data = await result.json();
  const { instructors, totalCount } = data;

  const itemsPerPage = 5;
  const currentPage = parseInt(page);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentInstructors = instructors.slice(startIndex, endIndex);

  return (
    <div className="py-30 px-30">
      <div className="row y-gap-30">
        <div className="mt-40">
          <div className="px-30 py-20 bg-light-7 -dark-bg-dark-2 rounded-8">
            <div className="row x-gap-10">
              <div className="col-lg-5">
                <div className="text-purple-1">Name</div>
              </div>
              <div className="col-lg-2">
                <div className="text-purple-1">Role</div>
              </div>
              <div className="col-lg-2">
                <div className="text-purple-1">Course Count</div>
              </div>
              <div className="col-lg-3">
                <div className="text-purple-1">Students</div>
              </div>
            </div>
          </div>

          {/* Display list of instructors here*/}
          {currentInstructors.length > 0 &&
            currentInstructors.map((instructor, index) => (
              <div key={index} className="px-30 border-bottom-light">
                <div className="row x-gap-10 items-center py-15">
                  <div className="col-lg-5">
                    <div className="d-flex items-center">
                      <Image
                        width={40}
                        height={40}
                        src={instructor.image}
                        alt="image"
                        className="size-40 fit-cover"
                      />
                      <div className="ml-10">
                        <div className="text-dark-1 lh-12 fw-500">
                          {instructor.name}
                        </div>
                        <div className="text-14 lh-12 mt-5">
                          {new Date(instructor.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-2">{instructor.role}</div>
                  <div className="col-lg-2">{instructor.courses}</div>
                  <div className="col-lg-3">{instructor.students}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="row justify-center pt-30">
        <div className="col-auto">
          <div className="pagination -buttons">
            {currentPage > 1 ? (
              <Link
                href={`/dashboard/manageinstructor?page=${currentPage - 1}`}
              >
                <button className="pagination__button -prev ">
                  <i className="icon icon-chevron-left"></i>
                </button>
              </Link>
            ) : (
              <button className="pagination__button -prev ">
                <i className="icon icon-chevron-left"></i>
              </button>
            )}

            <span style={{ justifyContent: "space-between" }}>
              Page: {page} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/dashboard/manageinstructor?page=${currentPage + 1}`}
              >
                <button className="pagination__button -next">
                  <i className="icon icon-chevron-right"></i>
                </button>
              </Link>
            ) : (
              <button className="pagination__button -next">
                <i className="icon icon-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
