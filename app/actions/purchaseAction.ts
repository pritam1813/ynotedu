"use server"

import { getBaseUrl } from "@/utils/getBaseUrl"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/client"
import type { Enrollment } from "@prisma/client"

const phonepeUrl = process.env.PHONEPE_ENV === "sandbox" ? "https://api-preprod.phonepe.com/apis" : "https://api.phonepe.com/apis"
const clientId = process.env.PHONEPE_CLIENT_ID!
const clientSecret = process.env.PHONEPE_CLIENT_SECRET!
const clientVersion = "1"

// State type for the action
export type PurchaseState = {
    success: boolean;
    error?: string;
    message?: string;
    tokenUrl?: string;
    transactionId?: string;
}

// Helper to get PhonePe access token with expiry handling
async function getPhonePeAccessToken(): Promise<{ accessToken: string; expiresAt: number } | null> {
    const authEndpoint = process.env.PHONEPE_ENV === "sandbox"
        ? "pg-sandbox/v1/oauth/token"
        : "identity-manager/v1/oauth/token"

    const authResponse = await fetch(`${phonepeUrl}/${authEndpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            client_version: clientVersion,
            grant_type: "client_credentials",
        }),
    });

    if (!authResponse.ok) {
        console.error("Failed to get PhonePe auth token");
        return null;
    }

    const authData = await authResponse.json();

    // Per PhonePe guidelines: access_token for API calls, expires_at for token validity
    return {
        accessToken: authData.access_token,
        expiresAt: authData.expires_at, // Token expiry timestamp in seconds
    };
}

export async function purchaseCourse(
    prevState: PurchaseState,
    formData: FormData
): Promise<PurchaseState> {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "AUTH_REQUIRED" };
    }

    // console.log("userId: ", userId);


    // Extract course info from formData
    const courseId = formData.get("courseId") as string;
    const totalAmount = parseFloat(formData.get("totalAmount") as string);

    if (!courseId || isNaN(totalAmount)) {
        return { success: false, error: "Invalid course information" };
    }

    const courseIdInt = parseInt(courseId);

    try {
        // Ensure user exists in the database (upsert from Clerk userId)
        await prisma.user.upsert({
            where: { id: userId },
            update: {}, // No updates needed if user exists
            create: { id: userId },
        });

        // Check if user is already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: courseIdInt,
                },
            },
        });

        if (existingEnrollment?.status === "ACTIVE") {
            return { success: false, error: "You are already enrolled in this course" };
        }

        // Get PhonePe access token (with expiry info per guidelines)
        const tokenData = await getPhonePeAccessToken();

        if (!tokenData) {
            return { success: false, error: "Failed to authenticate with payment gateway" };
        }

        // Check if token is about to expire (refresh if less than 60 seconds remaining)
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenData.expiresAt && tokenData.expiresAt - currentTime < 60) {
            console.warn("PhonePe token about to expire, getting fresh token...");
            const freshToken = await getPhonePeAccessToken();
            if (!freshToken) {
                return { success: false, error: "Failed to refresh payment gateway authentication" };
            }
            tokenData.accessToken = freshToken.accessToken;
            tokenData.expiresAt = freshToken.expiresAt;
        }

        // Generate unique order ID
        const merchantOrderId = `ORD_${userId.slice(-8)}_${courseId}_${Date.now()}`;

        // Create or update PENDING enrollment BEFORE initiating payment
        let enrollment: Enrollment;
        if (existingEnrollment) {
            enrollment = await prisma.enrollment.update({
                where: { id: existingEnrollment.id },
                data: {
                    status: "PENDING",
                    paymentAmount: totalAmount,
                    paymentId: merchantOrderId, // Store for callback verification
                },
            });
        } else {
            enrollment = await prisma.enrollment.create({
                data: {
                    userId,
                    courseId: courseIdInt,
                    status: "PENDING",
                    paymentAmount: totalAmount,
                    paymentId: merchantOrderId, // Store for callback verification
                },
            });
        }

        // Payment request using the access_token
        const paymentEndpoint = process.env.PHONEPE_ENV === "sandbox"
            ? "pg-sandbox/checkout/v2/pay"
            : "pg/checkout/v2/pay"

        const paymentResponse = await fetch(`${phonepeUrl}/${paymentEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${tokenData.accessToken}`,
            },
            body: JSON.stringify({
                merchantOrderId,
                amount: Math.round(totalAmount * 100), // Convert to paise
                expireAfter: 600, // 10 minutes
                paymentFlow: {
                    type: "PG_CHECKOUT",
                    merchantUrls: {
                        redirectUrl: `${getBaseUrl()}/courses/${courseId}/purchase/success?txnId=${merchantOrderId}`
                    }
                }
            }),
        });

        if (!paymentResponse.ok) {
            // Mark enrollment as cancelled if payment initiation fails
            await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: { status: "CANCELLED" },
            });
            console.error("PhonePe payment initiation failed:", await paymentResponse.text());
            return { success: false, error: "Failed to initiate payment" };
        }

        const paymentData = await paymentResponse.json();
        const paymentUrl = paymentData.redirectUrl;

        if (!paymentUrl) {
            await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: { status: "CANCELLED" },
            });
            console.error("No redirect URL in PhonePe response:", paymentData);
            return { success: false, error: "Payment gateway error" };
        }

        return {
            success: true,
            message: "Redirecting to payment...",
            tokenUrl: paymentUrl,
            transactionId: merchantOrderId
        };
    } catch (error) {
        console.error("Error purchasing course:", error);
        return { success: false, error: "Failed to purchase course" };
    }
}