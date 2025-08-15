import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas
const updateSectionSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be less than 255 characters")
      .optional(),
    description: z.string().optional(),
    order: z
      .number()
      .int()
      .positive("Order must be a positive integer")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

const sectionIdSchema = z
  .string()
  .regex(/^\d+$/, "Section ID must be a valid number")
  .transform(Number);
const courseIdSchema = z
  .string()
  .regex(/^\d+$/, "Course ID must be a valid number")
  .transform(Number);

// GET /api/courses/[courseId]/sections/[sectionId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    // Validate IDs
    const courseIdValidation = courseIdSchema.safeParse((await params).id);
    const sectionIdValidation = sectionIdSchema.safeParse(
      (await params).sectionId
    );

    if (!courseIdValidation.success || !sectionIdValidation.success) {
      return NextResponse.json(
        { error: "Invalid course ID or section ID" },
        { status: 400 }
      );
    }

    const courseId = courseIdValidation.data;
    const sectionId = sectionIdValidation.data;

    // Fetch section with content items
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        courseId: courseId,
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

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId]/sections/[sectionId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    // Validate IDs
    const courseIdValidation = courseIdSchema.safeParse((await params).id);
    const sectionIdValidation = sectionIdSchema.safeParse(
      (await params).sectionId
    );

    if (!courseIdValidation.success || !sectionIdValidation.success) {
      return NextResponse.json(
        { error: "Invalid course ID or section ID" },
        { status: 400 }
      );
    }

    const courseId = courseIdValidation.data;
    const sectionId = sectionIdValidation.data;

    // Parse and validate request body
    const body = await request.json();
    const validation = updateSectionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // Check if section exists and belongs to the course
    const existingSection = await prisma.section.findFirst({
      where: {
        id: sectionId,
        courseId: courseId,
      },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Update section
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: updateData,
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

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error("Error updating section:", error);

    // Handle unique constraint violations
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

// DELETE /api/courses/[courseId]/sections/[sectionId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  try {
    // Validate IDs
    const courseIdValidation = courseIdSchema.safeParse((await params).id);
    const sectionIdValidation = sectionIdSchema.safeParse(
      (await params).sectionId
    );

    if (!courseIdValidation.success || !sectionIdValidation.success) {
      return NextResponse.json(
        { error: "Invalid course ID or section ID" },
        { status: 400 }
      );
    }

    const courseId = courseIdValidation.data;
    const sectionId = sectionIdValidation.data;

    // Check if section exists and belongs to the course
    const existingSection = await prisma.section.findFirst({
      where: {
        id: sectionId,
        courseId: courseId,
      },
      include: {
        contents: true,
      },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Delete section (cascade delete will handle content items)
    await prisma.section.delete({
      where: { id: sectionId },
    });

    return NextResponse.json(
      {
        message: "Section deleted successfully",
        deletedSection: {
          id: existingSection.id,
          title: existingSection.title,
          contentItemsDeleted: existingSection.contents.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
