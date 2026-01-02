import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";

// GET /api/cart - Get user's cart
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Ensure user exists in DB
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId },
        });

        // Get or create cart
        const cart = await prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId },
            include: {
                courses: {
                    include: {
                        course: {
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
                        },
                    },
                    orderBy: {
                        addedAt: "desc",
                    },
                },
            },
        });

        // Transform to expected format
        const courses = cart.courses.map((item) => ({
            id: item.course.id,
            title: item.course.title,
            thumbnail: item.course.thumbnail,
            price: item.course.price,
            instructorName:
                item.course.instructor.user?.profile?.firstName ||
                item.course.instructor.name,
        }));

        return NextResponse.json({ courses });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { error: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

// POST /api/cart - Add course to cart
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

        // Check if course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check if already enrolled
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId },
            },
        });

        if (enrollment?.status === "ACTIVE") {
            return NextResponse.json(
                { error: "Already enrolled in this course" },
                { status: 409 }
            );
        }

        // Ensure user exists
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId },
        });

        // Get or create cart
        const cart = await prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });

        // Check if already in cart
        const existingCartItem = await prisma.courseOnCart.findUnique({
            where: {
                cartId_courseId: { cartId: cart.id, courseId },
            },
        });

        if (existingCartItem) {
            return NextResponse.json(
                { error: "Course already in cart" },
                { status: 409 }
            );
        }

        // Add to cart
        await prisma.courseOnCart.create({
            data: {
                cartId: cart.id,
                courseId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json(
            { error: "Failed to add to cart" },
            { status: 500 }
        );
    }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            return NextResponse.json({ success: true });
        }

        // Delete all cart items
        await prisma.courseOnCart.deleteMany({
            where: { cartId: cart.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return NextResponse.json(
            { error: "Failed to clear cart" },
            { status: 500 }
        );
    }
}
