"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

export default function CourseListPagination({
  totalCount,
  coursesPerPage,
}: {
  totalCount: number;
  coursesPerPage: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Get the current page from URL params, default to 1
  const currentPage = Number(searchParams.get("page") || 1);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / coursesPerPage));

  // Generate pagination array based on current page and total pages
  const paginationRange = useMemo(() => {
    const maxPagesToShow = 5;

    // If total pages are less than max pages to show, display all pages
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Handle case when we're at the beginning
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    // Handle case when we're at the end
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Handle case when we're in the middle
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [currentPage, totalPages]);

  // Create URL for a specific page
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Validate page number is valid before setting
    if (typeof pageNumber === "number") {
      if (pageNumber < 1) pageNumber = 1;
      if (pageNumber > totalPages) pageNumber = totalPages;
    }

    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Navigate to a specific page
  const handlePageChange = (pageNumber: number | string) => {
    if (typeof pageNumber === "number") {
      // Ensure page number is within valid range
      if (pageNumber < 1 || pageNumber > totalPages) return;
      replace(createPageURL(pageNumber));
    }
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="pagination -buttons">
      <button
        className="pagination__button -prev"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <i className="icon icon-chevron-left"></i>
      </button>

      {paginationRange.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">
            ...
          </span>
        ) : (
          <div key={`page-${page}`} className="pagination__count">
            <button
              className={currentPage === page ? "-count-is-active" : ""}
              onClick={() => handlePageChange(page as number)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          </div>
        )
      )}

      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="pagination__button -next"
        aria-label="Next page"
      >
        <i className="icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
