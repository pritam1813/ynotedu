import React from "react";
import { prisma } from "@/lib/client";
import type { Category, Course, Instructor } from "@prisma/client";
import CourseListCategoryWise from "./CourseListCategoryWise";

export interface CourseWithInstructor extends Course {
  instructor: Instructor;
}

export interface CourseWithCategory extends Category {
  courses: CourseWithInstructor[];
}

export const revalidate = 3600;

export default async function CustomCourseListHome() {
  let categories: CourseWithCategory[] = [];

  try {
    categories = (await prisma.category.findMany({
      include: {
        courses: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
                rating: true,
                reviews: true,
                students: true,
                courses: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    })) as unknown as CourseWithCategory[];
  } catch (error) {
    console.error(
      "[Homepage Error] Failed to query categories from database:",
      error
    );
  }

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <section className="layout-pt-lg layout-pb-lg">
      <div className="row justify-center text-center">
        <div className="col-auto">
          <div className="sectionTitle ">
            <h2 className="sectionTitle__title sm:text-24">
              Our Most Popular Courses
            </h2>

            <p className="sectionTitle__text ">
              10,000+ unique online course list designs
            </p>
          </div>
        </div>
      </div>

      {safeCategories.length > 0 && (
        <CourseListCategoryWise
          categories={safeCategories.filter(
            (catgory) => catgory.courses && catgory.courses.length >= 7
          )}
        />
      )}
    </section>
  );
}
