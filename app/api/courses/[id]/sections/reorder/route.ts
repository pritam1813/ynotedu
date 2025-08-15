import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for reordering sections
const reorderSectionsSchema = z.object({
  sections: z
    .array(
      z.object({
        id: z.number().int().positive(),
        order: z.number().int().positive(),
      })
    )
    .min(1, "At least one section must be provided"),
});

const courseIdSchema = z
  .string()
  .regex(/^\d+$/, "Course ID must be a valid number")
  .transform(Number);

// PUT /api/courses/[courseId]/sections/reorder
export async function PUT(
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
    const validation = reorderSectionsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { sections } = validation.data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Verify all sections belong to the course
    const sectionIds = sections.map((s) => s.id);
    const existingSections = await prisma.section.findMany({
      where: {
        id: { in: sectionIds },
        courseId: courseId,
      },
    });

    if (existingSections.length !== sections.length) {
      return NextResponse.json(
        {
          error:
            "One or more sections not found or don't belong to this course",
        },
        { status: 400 }
      );
    }

    // Update section orders in a transaction
    const updatePromises = sections.map((section) =>
      prisma.section.update({
        where: { id: section.id },
        data: { order: section.order },
      })
    );

    await prisma.$transaction(updatePromises);

    // Fetch updated sections
    const updatedSections = await prisma.section.findMany({
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

    return NextResponse.json({
      message: "Sections reordered successfully",
      sections: updatedSections,
    });
  } catch (error) {
    console.error("Error reordering sections:", error);

    // Handle unique constraint violations
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate order values detected" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
