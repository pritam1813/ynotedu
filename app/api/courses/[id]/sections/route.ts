import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas
const createSectionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z.string().optional(),
  order: z.number().int().positive("Order must be a positive integer"),
});

const courseIdSchema = z
  .string()
  .regex(/^\d+$/, "Course ID must be a valid number")
  .transform(Number);

// GET /api/courses/[courseId]/sections
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate courseId
    const courseIdValidation = courseIdSchema.safeParse((await params).id);
    if (!courseIdValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid course ID",
          details: courseIdValidation.error.errors,
        },
        { status: 400 }
      );
    }

    const courseId = courseIdValidation.data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Fetch sections with their content items
    const sections = await prisma.section.findMany({
      where: { courseId },
      include: {
        contents: {
          include: {
            video: true,
            pdf: true,
            quiz: {
              include: {
                questions: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/sections
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate courseId
    const courseIdValidation = courseIdSchema.safeParse((await params).id);
    if (!courseIdValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid course ID",
          details: courseIdValidation.error.errors,
        },
        { status: 400 }
      );
    }

    const courseId = courseIdValidation.data;

    // Parse and validate request body
    const body = await request.json();
    const validation = createSectionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { title, description, order } = validation.data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Create new section
    const newSection = await prisma.section.create({
      data: {
        title,
        description,
        order,
        courseId,
      },
      include: {
        contents: {
          include: {
            video: true,
            pdf: true,
            quiz: {
              include: {
                questions: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);

    // Handle unique constraint violations or other database errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A section with this order already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
