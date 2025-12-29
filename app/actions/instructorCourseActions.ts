"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";
import { revalidatePath } from "next/cache";

export async function getInstructorCourses() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Get instructor record
        const instructor = await prisma.instructor.findUnique({
            where: { userId },
        });

        if (!instructor) {
            return { success: false, error: "Instructor not found" };
        }

        // Fetch all courses for this instructor with section and content counts
        const courses = await prisma.course.findMany({
            where: { instructorId: instructor.id },
            include: {
                category: true,
                sections: {
                    include: {
                        contents: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Transform data to include counts
        const coursesWithCounts = courses.map((course) => ({
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level,
            language: course.language,
            thumbnail: course.thumbnail,
            price: course.price,
            isPublished: course.isPublished,
            categoryName: course.category.label,
            sectionsCount: course.sections.length,
            contentsCount: course.sections.reduce(
                (total, section) => total + section.contents.length,
                0
            ),
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        }));

        return { success: true, courses: coursesWithCounts };
    } catch (error) {
        console.error("Error fetching instructor courses:", error);
        return { success: false, error: "Failed to fetch courses" };
    }
}

export async function deleteCourse(courseId: number) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Get instructor record
        const instructor = await prisma.instructor.findUnique({
            where: { userId },
        });

        if (!instructor) {
            return { success: false, error: "Instructor not found" };
        }

        // Check if course belongs to this instructor
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return { success: false, error: "Course not found" };
        }

        if (course.instructorId !== instructor.id) {
            return { success: false, error: "Unauthorized to delete this course" };
        }

        // Delete the course (cascade will delete sections and contents)
        await prisma.course.delete({
            where: { id: courseId },
        });

        revalidatePath("/dashboard/courses");

        return { success: true, message: "Course deleted successfully" };
    } catch (error) {
        console.error("Error deleting course:", error);
        return { success: false, error: "Failed to delete course" };
    }
}

export async function togglePublishStatus(courseId: number) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Get instructor record
        const instructor = await prisma.instructor.findUnique({
            where: { userId },
        });

        if (!instructor) {
            return { success: false, error: "Instructor not found" };
        }

        // Fetch course with sections and contents
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                sections: {
                    include: {
                        contents: true,
                    },
                },
            },
        });

        if (!course) {
            return { success: false, error: "Course not found" };
        }

        if (course.instructorId !== instructor.id) {
            return {
                success: false,
                error: "Unauthorized to modify this course",
            };
        }

        // If trying to publish, validate requirements
        if (!course.isPublished) {
            const errors: string[] = [];

            // Check for thumbnail
            if (!course.thumbnail || course.thumbnail.trim() === "") {
                errors.push("Add a thumbnail image");
            }

            // Check for at least one section
            if (course.sections.length === 0) {
                errors.push("Add at least one section");
            }

            // Check for at least one content item
            const totalContents = course.sections.reduce(
                (total, section) => total + section.contents.length,
                0
            );

            if (totalContents === 0) {
                errors.push("Add at least one content item to a section");
            }

            if (errors.length > 0) {
                return {
                    success: false,
                    error: `Cannot publish: ${errors.join(", ")}`,
                };
            }
        }

        // Toggle the publish status
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: { isPublished: !course.isPublished },
        });

        revalidatePath("/dashboard/courses");

        return {
            success: true,
            message: updatedCourse.isPublished
                ? "Course published successfully!"
                : "Course unpublished successfully!",
            isPublished: updatedCourse.isPublished,
        };
    } catch (error) {
        console.error("Error toggling publish status:", error);
        return { success: false, error: "Failed to update course status" };
    }
}
