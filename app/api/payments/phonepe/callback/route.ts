import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { getBaseUrl } from "@/utils/getBaseUrl";

// PhonePe v2 API status endpoint
const PHONEPE_STATUS_ENDPOINT =
    process.env.PHONEPE_ENV === "production"
        ? "https://api.phonepe.com/apis/pg/checkout/v2/order"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order";

// Helper to check payment status with PhonePe v2 API
async function checkPaymentStatus(orderId: string) {
    try {
        // Get auth token
        const authResponse = await fetch(`${getBaseUrl()}/api/payments/phonepe/auth`, {
            method: "POST",
        });
        const authData = await authResponse.json();

        if (!authData.success || !authData.accessToken) {
            console.error("Failed to get auth token for status check:", authData);
            return null;
        }

        const response = await fetch(`${PHONEPE_STATUS_ENDPOINT}/${orderId}/status`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${authData.accessToken}`,
            },
        });

        return response.json();
    } catch (error) {
        console.error("Error checking payment status:", error);
        return null;
    }
}

// POST /api/payments/phonepe/callback - Handle PhonePe webhook callback
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log("PhonePe callback received:", body);

        // PhonePe v2 API sends orderId directly (not base64 encoded)
        const orderId = body.orderId || body.merchantOrderId;

        if (!orderId) {
            console.error("No orderId in callback body:", body);
            return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
        }

        // Find the enrollment by paymentId
        const enrollment = await prisma.enrollment.findFirst({
            where: { paymentId: orderId },
            include: { course: true },
        });

        if (!enrollment) {
            console.error("Enrollment not found for order:", orderId);
            return NextResponse.json(
                { error: "Enrollment not found" },
                { status: 404 }
            );
        }

        // Verify the payment status with PhonePe
        const statusResponse = await checkPaymentStatus(orderId);

        console.log("PhonePe status response:", statusResponse);

        if (statusResponse?.state === "COMPLETED") {
            // Payment successful - activate enrollment
            if (enrollment.status !== "ACTIVE") {
                await prisma.enrollment.update({
                    where: { id: enrollment.id },
                    data: { status: "ACTIVE" },
                });

                // Increment student count on the course
                await prisma.course.update({
                    where: { id: enrollment.courseId },
                    data: { students: { increment: 1 } },
                });

                console.log("Payment successful, enrollment activated:", enrollment.id);
            }
        } else if (statusResponse?.state === "PENDING") {
            console.log("Payment pending for enrollment:", enrollment.id);
        } else {
            // Payment failed - mark as cancelled
            await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: { status: "CANCELLED" },
            });
            console.log("Payment failed, enrollment cancelled:", enrollment.id);
        }

        // Return success to PhonePe (acknowledge callback received)
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing PhonePe callback:", error);
        return NextResponse.json(
            { error: "Callback processing failed" },
            { status: 500 }
        );
    }
}

// GET /api/payments/phonepe/callback - Check payment status
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const orderId = searchParams.get("orderId") || searchParams.get("transactionId");

        if (!orderId) {
            return NextResponse.json(
                { error: "Missing order ID" },
                { status: 400 }
            );
        }

        // Check payment status with PhonePe
        const statusResponse = await checkPaymentStatus(orderId);

        // Find the enrollment
        const enrollment = await prisma.enrollment.findFirst({
            where: { paymentId: orderId },
            include: { course: true },
        });

        if (!enrollment) {
            return NextResponse.json(
                { error: "Enrollment not found" },
                { status: 404 }
            );
        }

        // Update enrollment based on status
        if (statusResponse?.state === "COMPLETED") {
            if (enrollment.status !== "ACTIVE") {
                await prisma.enrollment.update({
                    where: { id: enrollment.id },
                    data: { status: "ACTIVE" },
                });
                await prisma.course.update({
                    where: { id: enrollment.courseId },
                    data: { students: { increment: 1 } },
                });
            }
            return NextResponse.json({
                status: "SUCCESS",
                enrollment: { ...enrollment, status: "ACTIVE" },
            });
        } else if (statusResponse?.state === "PENDING") {
            return NextResponse.json({
                status: "PENDING",
                enrollment,
            });
        } else {
            return NextResponse.json({
                status: "FAILED",
                state: statusResponse?.state,
                message: statusResponse?.message,
                enrollment,
            });
        }
    } catch (error) {
        console.error("Error checking payment status:", error);
        return NextResponse.json(
            { error: "Failed to check payment status" },
            { status: 500 }
        );
    }
}
