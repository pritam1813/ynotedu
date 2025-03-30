"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function CourseListPagination({
  totalCount,
  coursesPerPage,
}: {
  totalCount: number;

  coursesPerPage: number;
}) {
  const [prevBtn, setPrevbtn] = useState<boolean>(false);
  const [nextBtn, setNextbtn] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const numberofpages = Math.ceil(totalCount / coursesPerPage);
  let pageCapacity = 3;

  function handlePreviousPageButton(page: string) {
    const params = new URLSearchParams(searchParams.toString());

    const pageNum = parseInt(page);

    if (!page) {
      setPrevbtn(true);
    } else if (pageNum > 1) {
      setNextbtn(false);
      params.set("page", (pageNum - 1).toString());
    } else {
      setPrevbtn(true);
    }

    replace(`${pathname}?${params.toString()}`);
  }

  function handleNextPageButton(page: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    const pageNum = parseInt(page);
    if (!page) {
      setNextbtn(false);
      params.set("page", "2");
    } else if (pageNum < numberofpages) {
      setPrevbtn(false);
      params.set("page", (pageNum + 1).toString());
    } else {
      // params.set("page", "5");
      setNextbtn(true);
    }

    replace(`${pathname}?${params.toString()}`);
  }

  function handlePageChange(page: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (page) {
      console.log("Page: ", page);

      params.set("page", page);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="pagination -buttons">
      <button
        className="pagination__button -prev "
        disabled={prevBtn}
        onClick={() => {
          handlePreviousPageButton(searchParams.get("page"));
        }}
      >
        <i className="icon icon-chevron-left"></i>
      </button>

      {Array.from({ length: pageCapacity }, (_, i) => (
        <div key={i} className="pagination__count">
          <button
            className={
              searchParams.get("page") === (i + 1).toString()
                ? "-count-is-active"
                : ""
            }
            onClick={() => {
              handlePageChange((i + 1).toString());
            }}
          >
            {i + 1}
          </button>
        </div>
      ))}

      {totalCount > pageCapacity * 4 && searchParams.get("page") !== "4" && (
        <span>...</span>
      )}

      <button
        disabled={nextBtn}
        onClick={() => {
          handleNextPageButton(searchParams.get("page"));
          // console.log("Next ", searchParams.get("page"));
        }}
        className="pagination__button -next"
      >
        <i className="icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
