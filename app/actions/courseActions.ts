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

const dratfCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  level: z.string(),
  language: z.string(),
  categoryId: z.number(),
  instructorId: z.number(),
  price: z.number().min(0).optional(),
  duration: z.number().min(1).optional(),
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

export type FormState = {
  errors?: z.ZodIssue[];
  success?: boolean;
  message?: string;
};

export async function saveDraftCourse(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const formValues = Object.fromEntries(formData);

    const parsedValues = {
      ...formValues,
      categoryId: Number(formValues.categoryId),
      instructorId: Number(formValues.instructorId),
      price: formValues.price ? Number(formValues.price) : undefined,
      duration: formValues.duration ? Number(formValues.duration) : undefined,
    };

    // Validate instructorId and categoryId are valid numbers
    if (isNaN(parsedValues.instructorId) || parsedValues.instructorId <= 0) {
      console.error("Invalid instructor ID:", formValues.instructorId);
      return {
        success: false,
        message: "Invalid instructor ID. Please try again or contact support.",
      };
    }

    if (isNaN(parsedValues.categoryId) || parsedValues.categoryId <= 0) {
      console.error("Invalid category ID:", formValues.categoryId);
      return {
        success: false,
        message: "Invalid category selected. Please select a valid category.",
      };
    }

    const result = dratfCourseSchema.safeParse(parsedValues);

    if (!result.success) {
      console.error("Validation failed:", result.error.errors);
      return {
        success: false,
        message: "Validation failed. Please check all required fields.",
      };
    }

    const { categoryId, instructorId, title, description, level, language, price, duration } =
      result.data;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        level,
        language,
        thumbnail: "",
        rating: 0,
        reviews: 0,
        duration: duration || 0,
        price: price || 0,
        lessons: 0,
        students: 0,
        categoryId,
        instructorId,
      },
    });
    // revalidatePath('/drafts');

    return {
      success: true,
      message: `Course Saved to draft. CourseId: ${course.id}`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.error("Validation failed:");
      for (const issue of error.errors) {
        console.error(`- ${issue.path.join(".")}:  ${issue.message}`);
      }
      return {
        success: false,
        message: "Validation failed. Please check all required fields.",
      };
    } else {
      // Handle other unexpected errors
      console.error("Unexpected error:", error);
      return {
        success: false,
        message: "Failed to create course. Please try again.",
      };
    }
  }
}

export async function updateCourse(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const courseId = formData.get("courseId") as string;

  const formValues = Object.fromEntries(formData);

  const parsedValues = {
    ...formValues,
    categoryId: Number(formValues.categoryId),
    instructorId: Number(formValues.instructorId),
    price: formValues.price ? Number(formValues.price) : undefined,
    duration: formValues.duration ? Number(formValues.duration) : undefined,
  };

  // Validate instructorId and categoryId are valid numbers
  if (isNaN(parsedValues.instructorId) || parsedValues.instructorId <= 0) {
    console.error("Invalid instructor ID:", formValues.instructorId);
    return {
      success: false,
      message: "Invalid instructor ID. Please try again or contact support.",
    };
  }

  if (isNaN(parsedValues.categoryId) || parsedValues.categoryId <= 0) {
    console.error("Invalid category ID:", formValues.categoryId);
    return {
      success: false,
      message: "Invalid category selected. Please select a valid category.",
    };
  }

  const result = dratfCourseSchema.safeParse(parsedValues);

  if (!result.success) {
    console.error("Validation failed:", result.error.errors);
    return {
      success: false,
      message: "Validation failed. Please check all required fields.",
    };
  }

  // const { categoryId, instructorId, title, description, level, language } =
  //   result.data;

  try {
    // Your update logic here
    const updatedCourse = await prisma.course.update({
      where: { id: Number(courseId) },
      data: {
        ...result.data,
      },
    });

    return {
      success: true,
      message: `Course updated successfully! CourseId: ${updatedCourse.id}`,
      errors: undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.error("Validation failed:");
      for (const issue of error.errors) {
        console.error(`- ${issue.path.join(".")}:  ${issue.message}`);
      }
      return {
        success: false,
        message: "Validation failed. Please check all required fields.",
      };
    } else {
      // Handle other unexpected errors
      console.error("Unexpected error:", error);
      return {
        success: false,
        message: "Failed to update course. Please try again.",
      };
    }
  }
}

export async function submitSampleForm(prevState, formData) {
  // Extract form data
  const name = formData.get("name");
  const description = formData.get("description");

  // Save to database here
  // await db.sampleFormData.create({ name, description });

  // Return the form data to keep it in the form
  return {
    name,
    description,
    message: "Form submitted successfully!",
  };
}

export async function submitCourseContent(formData: FormData) {
  const courseId = formData.get("courseId");

  // Parse the form data
  const sections = [];
  let sectionIndex = 0;

  while (formData.get(`sections[${sectionIndex}][title]`)) {
    const section = {
      title: formData.get(`sections[${sectionIndex}][title]`),
      description: formData.get(`sections[${sectionIndex}][description]`),
      order: parseInt(
        formData.get(`sections[${sectionIndex}][order]`) as string
      ),
      contents: [],
    };

    let contentIndex = 0;
    while (
      formData.get(`sections[${sectionIndex}][contents][${contentIndex}][type]`)
    ) {
      const content = {
        title: formData.get(
          `sections[${sectionIndex}][contents][${contentIndex}][title]`
        ),
        type: formData.get(
          `sections[${sectionIndex}][contents][${contentIndex}][type]`
        ),
        // Add video, pdf, quiz data parsing here
      };

      section.contents.push(content);
      contentIndex++;
    }

    sections.push(section);
    sectionIndex++;
  }

  // Save to database using Prisma
  console.log("Form data:", { courseId, sections });

  // Return success/error
  return { success: true };
}
