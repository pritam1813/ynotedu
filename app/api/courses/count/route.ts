import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalCourses = await prisma.course.count();
    return NextResponse.json({ totalCourses });
  } catch (error) {
    console.error("Error fetching course count:", error);
    return NextResponse.json(
      { error: "Failed to fetch course count" },
      { status: 500 }
    );
  }
}
