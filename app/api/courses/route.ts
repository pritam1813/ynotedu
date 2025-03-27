import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

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
    let whereClause: any = {};

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
