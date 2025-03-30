"use server";

import { prisma } from "@/lib/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { toast } from "react-hot-toast";

const courseSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  level: z.string(),
  language: z.string(),
  thumbnail: z.string(),
  price: z.number().min(0),
  duration: z.number().min(1),
  categoryId: z.number(),
  instructorId: z.number(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export async function createCourse(data: CourseFormData) {
  try {
    const validatedData = courseSchema.parse(data);

    const newCourse = await prisma.course.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        level: validatedData.level,
        language: validatedData.language,
        thumbnail: validatedData.thumbnail,
        rating: 0,
        reviews: 0,
        duration: validatedData.duration,
        price: validatedData.price,
        lessons: 0,
        students: 0,
        categoryId: validatedData.categoryId,
        instructorId: validatedData.instructorId,
      },
    });

    revalidatePath("/dashboard/courses");
    return { success: true, course: newCourse };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path}: ${err.message}`)
        .join(", ");
      return { success: false, error: errorMessages };
    }
    return { success: false, error: "Failed to create course" };
  }
}

export async function addSection(
  courseId: number,
  title: string,
  description?: string
) {
  try {
    // Get the current highest order
    const sections = await prisma.section.findMany({
      where: { courseId },
      orderBy: { order: "desc" },
      take: 1,
    });

    const newOrder = sections.length > 0 ? sections[0].order + 1 : 1;

    const newSection = await prisma.section.create({
      data: {
        title,
        description,
        order: newOrder,
        courseId,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true, section: newSection };
  } catch (error) {
    return { success: false, error: "Failed to add section" };
  }
}

export async function addContentItem(
  sectionId: number,
  title: string,
  type: "VIDEO" | "PDF" | "QUIZ",
  metadata: any
) {
  try {
    // Get the current highest order
    const items = await prisma.contentItem.findMany({
      where: { sectionId },
      orderBy: { order: "desc" },
      take: 1,
    });

    const newOrder = items.length > 0 ? items[0].order + 1 : 1;

    const newContentItem = await prisma.contentItem.create({
      data: {
        title,
        type,
        order: newOrder,
        sectionId,
      },
    });

    // Based on type, create the corresponding content
    if (type === "VIDEO") {
      await prisma.video.create({
        data: {
          url: metadata.url,
          duration: metadata.duration || 0,
          thumbnail: metadata.thumbnail,
          contentItemId: newContentItem.id,
        },
      });
    } else if (type === "PDF") {
      await prisma.pdfDocument.create({
        data: {
          url: metadata.url,
          pages: metadata.pages,
          contentItemId: newContentItem.id,
        },
      });
    }

    revalidatePath(`/dashboard/courses`);
    return { success: true, contentItem: newContentItem };
  } catch (error) {
    return { success: false, error: "Failed to add content item" };
  }
}
