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

    // Extract filter parameters
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const language = searchParams.get("language");
    const price = searchParams.get("price");
    const rating = searchParams.get("rating");
    const duration = searchParams.get("duration");

    // Extract pagination parameters
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sortOption = searchParams.get("sort") || "newest";

    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 9;
    const skip = (page - 1) * limit;

    // Build the where clause conditionally based on available parameters
    const whereClause: any = {};

    if (category) {
      whereClause.category = {
        id: parseInt(category),
      };
    }

    if (level) {
      whereClause.level = level;
    }

    if (language) {
      whereClause.language = language;
    }

    if (price !== null) {
      const priceValue = price ? parseFloat(price) : undefined;
      if (priceValue !== undefined) {
        whereClause.price = {
          lte: priceValue,
        };
      }
    }

    if (rating !== null) {
      const ratingValue = rating ? parseFloat(rating) : undefined;
      if (ratingValue !== undefined) {
        whereClause.rating = {
          gte: ratingValue,
        };
      }
    }

    if (duration !== null) {
      const durationValue = duration ? parseInt(duration) : undefined;
      if (durationValue !== undefined) {
        whereClause.duration = {
          lte: durationValue,
        };
      }
    }

    // Build the orderBy clause based on sortOption
    let orderBy: any = {};
    switch (sortOption) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "popular":
        orderBy = { students: "desc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Get total count of filtered courses (for pagination)
    const totalCount = await prisma.course.count({
      where: whereClause,
    });

    // Get the courses with pagination
    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      courses,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
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
