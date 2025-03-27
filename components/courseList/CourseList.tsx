"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import PaginationTwo from "../common/PaginationTwo";

interface Course {
  id: number;
  imageSrc: string;
  authorImageSrc: string;
  title: string;
  rating: number;
  ratingCount: number;
  lessonCount: number;
  duration: number;
  level: string;
  originalPrice?: number;
  discountedPrice?: number;
  paid: boolean;
  category?: string;
  popular?: boolean;
  authorName: string;
  [key: string]: any; // Allow additional properties to accommodate different data structures
}

interface CourseListProps {
  category: string;
  level: string;
  language: string;
  price: string;
  rating: string;
  duration: string;
  sort: string;
  page: number;
  onPageChange: (page: number) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  category,
  level,
  language,
  price,
  rating,
  duration,
  sort,
  page,
  onPageChange,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query string with all filter parameters
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (level) params.append("level", level);
        if (language) params.append("language", language);
        if (price && price !== "All") params.append("price", price);
        if (rating) params.append("rating", rating);
        if (duration) params.append("duration", duration);
        if (sort && sort !== "Default") params.append("sort", sort);
        params.append("page", page.toString());
        params.append("limit", ITEMS_PER_PAGE.toString());

        // For testing - Remove this in production
        // This is a temporary fallback to use static data from data/courses.js
        // if the API isn't working yet
        const useStaticData = true;

        if (useStaticData) {
          // Import coursesData dynamically to avoid circular dependencies
          const coursesModule = await import("@/data/courses");
          const staticCourses = coursesModule.coursesData as any[];

          // Filter data based on the current filters
          let filteredData = [...staticCourses];

          if (category) {
            filteredData = filteredData.filter(
              (course) => course.category === category
            );
          }

          if (level) {
            filteredData = filteredData.filter(
              (course) => course.level === level
            );
          }

          if (language) {
            filteredData = filteredData.filter(
              (course) => course.languange === language
            );
          }

          if (price === "Free") {
            filteredData = filteredData.filter((course) => !course.paid);
          } else if (price === "Paid") {
            filteredData = filteredData.filter((course) => course.paid);
          }

          if (rating) {
            const [min, max] = rating.split(",").map(Number);
            filteredData = filteredData.filter(
              (course) => course.rating >= min && course.rating <= max
            );
          }

          if (duration) {
            const [min, max] = duration.split(",").map(Number);
            filteredData = filteredData.filter(
              (course) => course.duration >= min && course.duration <= max
            );
          }

          // Apply sorting
          if (sort && sort !== "Default") {
            filteredData = sortCourses(filteredData, sort);
          }

          // Apply pagination
          const startIndex = (page - 1) * ITEMS_PER_PAGE;
          const paginatedData = filteredData.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
          );

          setCourses(paginatedData as Course[]);
          setTotalCourses(filteredData.length);
        } else {
          // Real API call
          const response = await fetch(`/api/courses?${params.toString()}`);

          if (!response.ok) {
            throw new Error("Failed to fetch courses");
          }

          // The API returns an array of courses, not an object with courses and total
          const coursesData = await response.json();

          // Check if the response is an array (expected from the API)
          if (Array.isArray(coursesData)) {
            setCourses(coursesData);
            setTotalCourses(coursesData.length);
          } else if (coursesData.courses) {
            // Alternative format if the API changes to return {courses, total}
            setCourses(coursesData.courses);
            setTotalCourses(coursesData.total || coursesData.courses.length);
          } else {
            throw new Error("Unexpected API response format");
          }
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category, level, language, price, rating, duration, sort, page]);

  // Helper function to sort courses based on the selected option
  const sortCourses = (data: any[], sortOption: string) => {
    const sortedData = [...data];

    switch (sortOption) {
      case "Rating (asc)":
        return sortedData.sort((a, b) => a.rating - b.rating);
      case "Rating (dsc)":
        return sortedData.sort((a, b) => b.rating - a.rating);
      case "Price (asc)":
        return sortedData.sort(
          (a, b) => (a.discountedPrice || 0) - (b.discountedPrice || 0)
        );
      case "Price (dsc)":
        return sortedData.sort(
          (a, b) => (b.discountedPrice || 0) - (a.discountedPrice || 0)
        );
      case "Duration (asc)":
        return sortedData.sort((a, b) => a.duration - b.duration);
      case "Duration (dsc)":
        return sortedData.sort((a, b) => b.duration - a.duration);
      default:
        return sortedData;
    }
  };

  if (loading) {
    return <div className="text-center py-30">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center py-30 text-red-1">{error}</div>;
  }

  return (
    <>
      <div className="row y-gap-30 side-content__wrap">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="text-center py-30 col-12">
            No courses found matching your criteria.
          </div>
        )}
      </div>

      {courses.length > 0 && (
        <div className="row justify-center pt-90 lg:pt-50">
          <div className="col-auto">
            <PaginationTwo
              pageNumber={page}
              setPageNumber={onPageChange}
              data={Array(totalCourses).fill(null)}
              pageCapacity={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CourseList;
