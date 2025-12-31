"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";
import { revalidatePath } from "next/cache";

interface DemoLinkData {
    title: string;
    url: string;
    description?: string;
}

// Get demo link for a specific course
export async function getDemoLinkByCourse(courseId: number) {
    try {
        const demoLink = await prisma.demoLink.findUnique({
            where: { courseId },
        });

        return { success: true, demoLink };
    } catch (error) {
        console.error("Error fetching demo link:", error);
        return { success: false, error: "Failed to fetch demo link" };
    }
}

// Get all courses for the instructor with their demo link status
export async function getInstructorCoursesWithDemoLinks() {
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

        // Fetch all courses for this instructor with demo link info
        const courses = await prisma.course.findMany({
            where: { instructorId: instructor.id },
            include: {
                demoLink: true,
                category: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, courses };
    } catch (error) {
        console.error("Error fetching instructor courses:", error);
        return { success: false, error: "Failed to fetch courses" };
    }
}

// Create a new demo link for a course
export async function createDemoLink(courseId: number, data: DemoLinkData) {
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

        // Verify the course belongs to this instructor
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return { success: false, error: "Course not found" };
        }

        if (course.instructorId !== instructor.id) {
            return { success: false, error: "Unauthorized to add demo link to this course" };
        }

        // Check if a demo link already exists for this course
        const existingLink = await prisma.demoLink.findUnique({
            where: { courseId },
        });

        if (existingLink) {
            return { success: false, error: "Demo link already exists for this course. Please edit the existing one." };
        }

        // Create the demo link
        const demoLink = await prisma.demoLink.create({
            data: {
                title: data.title,
                url: data.url,
                description: data.description,
                courseId,
            },
        });

        revalidatePath("/dashboard/demolinks");
        revalidatePath(`/courses/${courseId}`);

        return { success: true, demoLink, message: "Demo link created successfully" };
    } catch (error) {
        console.error("Error creating demo link:", error);
        return { success: false, error: "Failed to create demo link" };
    }
}

// Update an existing demo link
export async function updateDemoLink(demoLinkId: number, data: DemoLinkData) {
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

        // Get the demo link with course info
        const demoLink = await prisma.demoLink.findUnique({
            where: { id: demoLinkId },
            include: { course: true },
        });

        if (!demoLink) {
            return { success: false, error: "Demo link not found" };
        }

        // Verify ownership
        if (demoLink.course.instructorId !== instructor.id) {
            return { success: false, error: "Unauthorized to modify this demo link" };
        }

        // Update the demo link
        const updatedDemoLink = await prisma.demoLink.update({
            where: { id: demoLinkId },
            data: {
                title: data.title,
                url: data.url,
                description: data.description,
            },
        });

        revalidatePath("/dashboard/demolinks");
        revalidatePath(`/courses/${demoLink.courseId}`);

        return { success: true, demoLink: updatedDemoLink, message: "Demo link updated successfully" };
    } catch (error) {
        console.error("Error updating demo link:", error);
        return { success: false, error: "Failed to update demo link" };
    }
}

// Delete a demo link
export async function deleteDemoLink(demoLinkId: number) {
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

        // Get the demo link with course info
        const demoLink = await prisma.demoLink.findUnique({
            where: { id: demoLinkId },
            include: { course: true },
        });

        if (!demoLink) {
            return { success: false, error: "Demo link not found" };
        }

        // Verify ownership
        if (demoLink.course.instructorId !== instructor.id) {
            return { success: false, error: "Unauthorized to delete this demo link" };
        }

        const courseId = demoLink.courseId;

        // Delete the demo link
        await prisma.demoLink.delete({
            where: { id: demoLinkId },
        });

        revalidatePath("/dashboard/demolinks");
        revalidatePath(`/courses/${courseId}`);

        return { success: true, message: "Demo link deleted successfully" };
    } catch (error) {
        console.error("Error deleting demo link:", error);
        return { success: false, error: "Failed to delete demo link" };
    }
}
