import { prisma } from "@/lib/client";

import { NextRequest, NextResponse } from "next/server";
import { zfd } from "zod-form-data";

const courseSchema = zfd.formData({
  title: zfd.text(),
  description: zfd.text(),
  level: zfd.text(),
  language: zfd.text(),
  thumbnail: zfd.text(),
  rating: zfd.numeric(),
  reviews: zfd.numeric(),
  duration: zfd.numeric(),
  price: zfd.numeric(),
  lessons: zfd.numeric(),
  students: zfd.numeric(),
  categoryId: zfd.text(),
  instructorId: zfd.text(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const language = searchParams.get("language");
    const price = searchParams.get("price");
    const rating = searchParams.get("rating");
    const duration = searchParams.get("duration");

    const priceValue = price ? parseFloat(price) : undefined;
    const ratingValue = rating ? parseFloat(rating) : undefined;
    const durationValue = duration ? parseInt(duration) : undefined;

    // Build the where clause conditionally based on available parameters
    const whereClause: any = {};

    if (category) {
      whereClause.category = {
        label: category,
      };
    }

    if (level) {
      whereClause.level = level;
    }

    if (language) {
      whereClause.language = language;
    }

    if (priceValue !== undefined) {
      whereClause.price = {
        lte: priceValue,
      };
    }

    if (ratingValue !== undefined) {
      whereClause.rating = {
        gte: ratingValue,
      };
    }

    if (durationValue !== undefined) {
      whereClause.duration = {
        lte: durationValue,
      };
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: true,
        category: true,
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching Courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch Course" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const courseData = courseSchema.parse(formData);

    // Extract categoryId from formData
    const categoryId = parseInt(formData.get("categoryId") as string);
    const instructorId = parseInt(formData.get("instructorId") as string);

    if (!categoryId || isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Valid categoryId is required" },
        { status: 400 }
      );
    }

    if (!instructorId || isNaN(instructorId)) {
      return NextResponse.json(
        { error: "Valid instructorId is required" },
        { status: 400 }
      );
    }

    // Create the course
    const newCourse = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        level: courseData.level,
        language: courseData.language,
        thumbnail: courseData.thumbnail,
        rating: 0,
        reviews: 0,
        duration: courseData.duration,
        price: courseData.price,
        lessons: 0,
        students: 0,
        categoryId: categoryId,
        instructorId: instructorId,
      },
      include: {
        instructor: true,
        category: true,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
