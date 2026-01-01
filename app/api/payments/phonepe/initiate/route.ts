import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/client";
import { getBaseUrl } from "@/utils/getBaseUrl";

// PhonePe v2 API endpoint
const PHONEPE_PAY_ENDPOINT =
    process.env.PHONEPE_ENV === "production"
        ? "https://api.phonepe.com/apis/pg/checkout/v2/pay"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

// POST /api/payments/phonepe/initiate - Initiate a PhonePe payment
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

        // Get the course details
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true, price: true, title: true },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check if it's a free course
        if (course.price === 0) {
            return NextResponse.json(
                { error: "This is a free course. Use /api/enrollments endpoint instead." },
                { status: 400 }
            );
        }

        // Check for existing active enrollment
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingEnrollment?.status === "ACTIVE") {
            return NextResponse.json(
                { error: "Already enrolled in this course" },
                { status: 409 }
            );
        }

        // Generate unique order ID for PhonePe v2 API
        const merchantOrderId = `ORD_${userId.slice(-8)}_${courseId}_${Date.now()}`;

        // Get or create pending enrollment
        let enrollment;
        if (existingEnrollment) {
            enrollment = await prisma.enrollment.update({
                where: { id: existingEnrollment.id },
                data: {
                    status: "PENDING",
                    paymentAmount: course.price,
                    paymentId: merchantOrderId,
                },
            });
        } else {
            enrollment = await prisma.enrollment.create({
                data: {
                    userId,
                    courseId,
                    status: "PENDING",
                    paymentAmount: course.price,
                    paymentId: merchantOrderId,
                },
            });
        }

        // Build PhonePe v2 payment payload
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

        const paymentRequestParams = {
            merchantOrderId,
            amount: Math.round(course.price * 100), // PhonePe expects amount in paise
            expireAfter: 600, // 10 minutes expiry
            paymentFlow: {
                type: "PG_CHECKOUT",
                merchantUrls: {
                    redirectUrl: `${baseUrl}/courses/${courseId}/purchase/success?txnId=${merchantOrderId}`,
                }
            }
        };

        // Get auth token
        const authResponse = await fetch(`${getBaseUrl()}/api/payments/phonepe/auth`, {
            method: "POST",
        });

        const authData = await authResponse.json();

        if (!authData.success || !authData.accessToken) {
            console.error("Failed to get auth token:", authData);
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
                "Authorization": `O-Bearer ${authData.accessToken}`,
            },
            body: JSON.stringify(paymentRequestParams),
        });

        const phonePeData = await phonePeResponse.json();

        console.log("PhonePe Payment Response:", phonePeData);

        // v2 API returns state: "PENDING" for a successfully created order with a redirectUrl
        const redirectUrl = phonePeData.redirectUrl;

        if (!phonePeResponse.ok || !redirectUrl) {
            console.error("PhonePe initiation failed:", phonePeData);
            await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: { status: "CANCELLED" },
            });
            return NextResponse.json(
                { error: "Payment initiation failed", details: phonePeData.message || phonePeData.state },
                { status: 500 }
            );
        }

        // Note: Enrollment stays PENDING until callback/success page confirms payment
        // The callback endpoint or success page will update to ACTIVE after verifying with PhonePe

        return NextResponse.json({
            success: true,
            redirectUrl,
            transactionId: merchantOrderId,
        });
    } catch (error) {
        console.error("Error initiating PhonePe payment:", error);
        return NextResponse.json(
            { error: "Failed to initiate payment" },
            { status: 500 }
        );
    }
}
