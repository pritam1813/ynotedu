import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

// POST /api/cart/guest - Get course details for guest cart items
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { courseIds } = body;

        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return NextResponse.json({ courses: [] });
        }

        // Fetch course details for the given IDs
        const courses = await prisma.course.findMany({
            where: {
                id: { in: courseIds },
            },
            include: {
                instructor: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
        });

        // Transform to expected format
        const coursesData = courses.map((course) => ({
            id: course.id,
            title: course.title,
            thumbnail: course.thumbnail,
            price: course.price,
            instructorName:
                course.instructor.user?.profile?.firstName ||
                course.instructor.name,
        }));

        return NextResponse.json({ courses: coursesData });
    } catch (error) {
        console.error("Error fetching guest cart courses:", error);
        return NextResponse.json(
            { error: "Failed to fetch courses" },
            { status: 500 }
        );
    }
}
