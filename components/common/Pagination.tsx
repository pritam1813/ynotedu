"use client";
import React from "react";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
}

export default function Pagination({
  pageCount,
  currentPage,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    // const onPageChange = (page: number) => {
    //   // setCurrentPage(page);
    //   console.log(page);

    // };
    function onPageChange(page: number) {
      console.log(page);
    }

    // Always show first page
    pages.push(
      <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
        <button
          className="page-link"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          1
        </button>
      </li>
    );

    // Calculate start and end of pagination range
    const startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pageCount - 1, startPage + maxPagesToShow - 3);

    // Adjust if we're near the beginning
    if (startPage > 2) {
      pages.push(
        <li key="ellipsis-start" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => onPageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Add ellipsis if there are more pages
    if (endPage < pageCount - 1) {
      pages.push(
        <li key="ellipsis-end" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Always show last page if there is more than one page
    if (pageCount > 1) {
      pages.push(
        <li
          key={pageCount}
          className={`page-item ${currentPage === pageCount ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(pageCount)}
            disabled={currentPage === pageCount}
          >
            {pageCount}
          </button>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className="pagination -buttons">
      <button
        className="pagination__button -prev"
        // onClick={()=>{onPageChange()}}
        disabled={currentPage === 1}
      >
        <i className="icon icon-chevron-left"></i>
      </button>

      <div className="pagination__count">
        <ul className="pagination__list">{renderPageNumbers()}</ul>
      </div>

      <button
        className="pagination__button -next"
        // onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        <i className="icon icon-chevron-right"></i>
      </button>
    </div>
  );
}
