import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";

// DELETE /api/cart/[courseId] - Remove specific course from cart
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { courseId } = await params;
        const courseIdNum = parseInt(courseId, 10);

        if (isNaN(courseIdNum)) {
            return NextResponse.json(
                { error: "Invalid courseId" },
                { status: 400 }
            );
        }

        // Get cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            return NextResponse.json({ success: true });
        }

        // Delete the cart item
        await prisma.courseOnCart.deleteMany({
            where: {
                cartId: cart.id,
                courseId: courseIdNum,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing from cart:", error);
        return NextResponse.json(
            { error: "Failed to remove from cart" },
            { status: 500 }
        );
    }
}
