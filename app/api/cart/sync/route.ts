import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";

// POST /api/cart/sync - Sync guest cart to user cart on login
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { courseIds } = body;

        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return NextResponse.json({ success: true, message: "No items to sync" });
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

        // Get existing cart items
        const existingItems = await prisma.courseOnCart.findMany({
            where: { cartId: cart.id },
            select: { courseId: true },
        });
        const existingCourseIds = new Set(existingItems.map((item) => item.courseId));

        // Get user's active enrollments to exclude already enrolled courses
        const activeEnrollments = await prisma.enrollment.findMany({
            where: {
                userId,
                status: "ACTIVE",
            },
            select: { courseId: true },
        });
        const enrolledCourseIds = new Set(activeEnrollments.map((e) => e.courseId));

        // Filter out courses that are already in cart or already enrolled
        const newCourseIds = courseIds.filter(
            (id: number) => !existingCourseIds.has(id) && !enrolledCourseIds.has(id)
        );

        if (newCourseIds.length === 0) {
            return NextResponse.json({ success: true, message: "All items already synced" });
        }

        // Verify all courses exist
        const existingCourses = await prisma.course.findMany({
            where: { id: { in: newCourseIds } },
            select: { id: true },
        });
        const validCourseIds = existingCourses.map((c) => c.id);

        // Add new items to cart
        await prisma.courseOnCart.createMany({
            data: validCourseIds.map((courseId) => ({
                cartId: cart.id,
                courseId,
            })),
            skipDuplicates: true,
        });

        return NextResponse.json({
            success: true,
            synced: validCourseIds.length,
        });
    } catch (error) {
        console.error("Error syncing cart:", error);
        return NextResponse.json(
            { error: "Failed to sync cart" },
            { status: 500 }
        );
    }
}
