import React from "react";
import Link from "next/link";

export default function PaginationInstructors({
  currentPage,
  limit,
  totalItems,
}: {
  currentPage: number;
  limit: number;
  totalItems: number;
}) {
  const totalPages = Math.ceil(totalItems / limit);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (showEllipsisStart) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination -buttons">
      {currentPage > 1 ? (
        <Link href={`/instructors?page=${currentPage - 1}`}>
          <button className="pagination__button -prev ">
            <i className="icon icon-chevron-left"></i>
          </button>
        </Link>
      ) : (
        <button className="pagination__button -prev ">
          <i className="icon icon-chevron-left"></i>
        </button>
      )}

      <div className="pagination__count">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return <span key={`ellipsis-${index}`}>...</span>;
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={`/instructors?page=${pageNum}`}
              className={isActive ? "-count-is-active" : ""}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link href={`/instructors?page=${currentPage + 1}`}>
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
  );
}
