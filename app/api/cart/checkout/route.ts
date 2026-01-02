import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";
import { getBaseUrl } from "@/utils/getBaseUrl";

// PhonePe v2 API endpoint
const PHONEPE_PAY_ENDPOINT =
    process.env.PHONEPE_ENV === "production"
        ? "https://api.phonepe.com/apis/pg/checkout/v2/pay"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

// POST /api/cart/checkout - Initiate checkout for cart items
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user's cart with courses
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                courses: {
                    include: {
                        course: true,
                    },
                },
            },
        });

        if (!cart || cart.courses.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        // Separate free and paid courses
        const freeCourses = cart.courses.filter((item) => item.course.price === 0);
        const paidCourses = cart.courses.filter((item) => item.course.price > 0);

        // Enroll in free courses immediately
        if (freeCourses.length > 0) {
            for (const item of freeCourses) {
                await prisma.enrollment.upsert({
                    where: {
                        userId_courseId: { userId, courseId: item.course.id },
                    },
                    update: { status: "ACTIVE" },
                    create: {
                        userId,
                        courseId: item.course.id,
                        status: "ACTIVE",
                        paymentAmount: 0,
                    },
                });

                // Remove from cart
                await prisma.courseOnCart.delete({
                    where: {
                        cartId_courseId: { cartId: cart.id, courseId: item.course.id },
                    },
                });
            }
        }

        // If only free courses, return success
        if (paidCourses.length === 0) {
            return NextResponse.json({
                success: true,
                freeEnrollments: freeCourses.length,
                message: "Enrolled in free courses successfully",
            });
        }

        // Calculate total for paid courses
        const totalAmount = paidCourses.reduce(
            (sum, item) => sum + item.course.price,
            0
        );

        // Generate unique order ID for cart checkout
        const courseIds = paidCourses.map((item) => item.course.id).join("-");
        const merchantOrderId = `CART_${userId.slice(-8)}_${Date.now()}`;

        // Create pending enrollments for all paid courses
        for (const item of paidCourses) {
            await prisma.enrollment.upsert({
                where: {
                    userId_courseId: { userId, courseId: item.course.id },
                },
                update: {
                    status: "PENDING",
                    paymentAmount: item.course.price,
                    paymentId: merchantOrderId,
                },
                create: {
                    userId,
                    courseId: item.course.id,
                    status: "PENDING",
                    paymentAmount: item.course.price,
                    paymentId: merchantOrderId,
                },
            });
        }

        // Build PhonePe v2 payment payload
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

        const paymentRequestParams = {
            merchantOrderId,
            amount: Math.round(totalAmount * 100), // PhonePe expects amount in paise
            expireAfter: 600, // 10 minutes expiry
            paymentFlow: {
                type: "PG_CHECKOUT",
                merchantUrls: {
                    redirectUrl: `${baseUrl}/cart/checkout/success?txnId=${merchantOrderId}`,
                },
            },
        };

        // Get auth token
        const authResponse = await fetch(`${getBaseUrl()}/api/payments/phonepe/auth`, {
            method: "POST",
        });

        const authData = await authResponse.json();

        if (!authData.success || !authData.accessToken) {
            console.error("Failed to get auth token:", authData);
            // Revert enrollments to null/remove pending status
            for (const item of paidCourses) {
                await prisma.enrollment.update({
                    where: {
                        userId_courseId: { userId, courseId: item.course.id },
                    },
                    data: { status: "CANCELLED" },
                });
            }
            return NextResponse.json(
                { error: "Failed to authenticate with PhonePe" },
                { status: 500 }
            );
        }

        // Make request to PhonePe v2 API
        const phonePeResponse = await fetch(PHONEPE_PAY_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `O-Bearer ${authData.accessToken}`,
            },
            body: JSON.stringify(paymentRequestParams),
        });

        const phonePeData = await phonePeResponse.json();

        console.log("PhonePe Cart Checkout Response:", phonePeData);

        const redirectUrl = phonePeData.redirectUrl;

        if (!phonePeResponse.ok || !redirectUrl) {
            console.error("PhonePe cart checkout failed:", phonePeData);
            // Cancel pending enrollments
            for (const item of paidCourses) {
                await prisma.enrollment.update({
                    where: {
                        userId_courseId: { userId, courseId: item.course.id },
                    },
                    data: { status: "CANCELLED" },
                });
            }
            return NextResponse.json(
                {
                    error: "Payment initiation failed",
                    details: phonePeData.message || phonePeData.state,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            redirectUrl,
            transactionId: merchantOrderId,
            freeEnrollments: freeCourses.length,
            paidCourses: paidCourses.length,
            totalAmount,
        });
    } catch (error) {
        console.error("Error processing cart checkout:", error);
        return NextResponse.json(
            { error: "Failed to process checkout" },
            { status: 500 }
        );
    }
}
