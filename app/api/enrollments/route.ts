import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";

// GET /api/enrollments - Get all enrollments for the current user
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId,
                status: "ACTIVE",
            },
            include: {
                course: {
                    include: {
                        instructor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                        category: true,
                    },
                },
            },
            orderBy: {
                enrolledAt: "desc",
            },
        });

        return NextResponse.json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return NextResponse.json(
            { error: "Failed to fetch enrollments" },
            { status: 500 }
        );
    }
}

// POST /api/enrollments - Enroll in a course
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { courseId } = body;

        if (!courseId) {
            return NextResponse.json(
                { error: "courseId is required" },
                { status: 400 }
            );
        }

        // Get the course to check price
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true, price: true, title: true },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingEnrollment) {
            if (existingEnrollment.status === "ACTIVE") {
                return NextResponse.json(
                    { error: "Already enrolled in this course", enrollment: existingEnrollment },
                    { status: 409 }
                );
            }
            // If pending or cancelled, update to active
            const updatedEnrollment = await prisma.enrollment.update({
                where: { id: existingEnrollment.id },
                data: {
                    status: "ACTIVE",
                    paymentAmount: course.price,
                    updatedAt: new Date(),
                },
                include: {
                    course: true,
                },
            });

            // Increment student count
            await prisma.course.update({
                where: { id: courseId },
                data: { students: { increment: 1 } },
            });

            return NextResponse.json({
                message: "Enrollment reactivated successfully",
                enrollment: updatedEnrollment,
            });
        }

        // For free courses (price = 0), enroll immediately with ACTIVE status
        // For paid courses, in a real app you'd redirect to payment first
        // Here we simulate immediate payment success
        const isFree = course.price === 0;

        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId,
                status: "ACTIVE", // For mock flow, always set to ACTIVE
                paymentAmount: course.price,
                paymentId: isFree ? null : `mock_payment_${Date.now()}`, // Mock payment ID
            },
            include: {
                course: true,
            },
        });

        // Increment student count on the course
        await prisma.course.update({
            where: { id: courseId },
            data: { students: { increment: 1 } },
        });

        return NextResponse.json(
            {
                message: isFree
                    ? "Successfully enrolled in free course"
                    : "Successfully purchased course",
                enrollment,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating enrollment:", error);
        return NextResponse.json(
            { error: "Failed to enroll in course" },
            { status: 500 }
        );
    }
}
