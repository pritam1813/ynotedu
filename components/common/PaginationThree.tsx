"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PaginationThree({
  totalPages,
}: {
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handlePrevious() {
    const params = new URLSearchParams(searchParams);
    let currentPage = parseInt(params.get("page"));

    if (currentPage) {
      if (currentPage > 1) {
        currentPage = currentPage - 1;
        params.set("page", currentPage.toString());
        replace(`${pathname}?${params.toString()}`);
      }
    }
  }

  function handleNext() {
    const params = new URLSearchParams(searchParams);
    let currentPage = parseInt(params.get("page"));

    if (currentPage && currentPage <= totalPages) {
      currentPage++;
      params.set("page", currentPage.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  }

  return (
    <div className="pagination -buttons">
      <button className="pagination__button -prev " onClick={handlePrevious}>
        <i className="icon icon-chevron-left"></i>
      </button>

      <button onClick={handleNext} className="pagination__button -next">
        <i className="icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
