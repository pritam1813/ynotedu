import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";

// GET /api/enrollments/[courseId] - Check if current user is enrolled in a course
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const courseIdInt = parseInt(courseId);

        console.log("User Id in Backend: ", userId);


        if (isNaN(courseIdInt)) {
            return NextResponse.json(
                { error: "Invalid course ID" },
                { status: 400 }
            );
        }

        // If not logged in, return not enrolled
        if (!userId) {
            return NextResponse.json({
                enrolled: false,
                enrollment: null,
            });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: courseIdInt,
                },
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                    },
                },
            },
        });

        // Check if enrollment exists first
        if (!enrollment) {
            return NextResponse.json({
                enrolled: false,
                enrollment: null,
            });
        }

        if (enrollment.status !== "ACTIVE") {
            return NextResponse.json({
                enrolled: false,
                enrollment: null,
            });
        }

        return NextResponse.json({
            enrolled: enrollment.status === "ACTIVE",
            status: enrollment.status,
            enrollment,
        });
    } catch (error) {
        console.error("Error checking enrollment:", error);
        return NextResponse.json(
            { error: "Failed to check enrollment status" },
            { status: 500 }
        );
    }
}
