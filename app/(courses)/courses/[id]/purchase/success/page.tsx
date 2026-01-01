import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/client";
import PageLinks from "@/components/common/PageLinks";
import { getBaseUrl } from "@/utils/getBaseUrl";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    return {
        title: `Purchase Status | Course ${id} | Ynotedu`,
        description: "View your course purchase status.",
    };
}

// Helper to check payment status with PhonePe v2 API
async function checkPhonePeStatus(orderId: string) {
    const PHONEPE_STATUS_ENDPOINT =
        process.env.PHONEPE_ENV === "production"
            ? `https://api.phonepe.com/apis/pg/checkout/v2/order/${orderId}/status`
            : `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${orderId}/status`;

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

        // Check order status
        const response = await fetch(PHONEPE_STATUS_ENDPOINT, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${authData.accessToken}`,
            }
        });

        const statusData = await response.json();
        console.log("PhonePe Status Response:", statusData);
        return statusData;
    } catch (error) {
        console.error("Error checking PhonePe status:", error);
        return null;
    }
}

export default async function PurchaseSuccessPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const courseId = parseInt(id);
    const { userId } = await auth();
    const transactionId = resolvedSearchParams.txnId as string | undefined;

    if (!userId) {
        redirect("/sign-in");
    }

    // Get the enrollment for this course
    let enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
        include: {
            course: {
                include: {
                    instructor: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });

    // If there's a transaction ID, verify payment status with PhonePe
    let paymentStatus = "SUCCESS";
    if (transactionId && enrollment?.status === "PENDING") {
        const phonePeStatus = await checkPhonePeStatus(transactionId);

        // Check for successful payment (v2 API uses state: "COMPLETED" or code: "SUCCESS")
        if (phonePeStatus?.state === "COMPLETED" || phonePeStatus?.code === "SUCCESS") {
            // Update enrollment to active
            enrollment = await prisma.enrollment.update({
                where: { id: enrollment.id },
                data: { status: "ACTIVE" },
                include: {
                    course: {
                        include: {
                            instructor: {
                                select: {
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });
            // Increment student count
            await prisma.course.update({
                where: { id: courseId },
                data: { students: { increment: 1 } },
            });
            paymentStatus = "SUCCESS";
        } else if (phonePeStatus?.state === "PENDING" || phonePeStatus?.code === "PAYMENT_PENDING") {
            paymentStatus = "PENDING";
        } else {
            paymentStatus = "FAILED";
        }
    }

    // No enrollment found
    if (!enrollment) {
        return (
            <div className="main-content">
                <div className="content-wrapper js-content-wrapper overflow-hidden">
                    <PageLinks dark={undefined} />
                    <section className="layout-pt-lg layout-pb-lg">
                        <div className="container">
                            <div className="row justify-center">
                                <div className="col-xl-8 col-lg-10">
                                    <div className="bg-white shadow-1 rounded-8 px-50 py-50 text-center">
                                        <h2 className="text-24 lh-1 fw-500 text-dark-1 mb-20">
                                            Enrollment Not Found
                                        </h2>
                                        <p className="text-15 text-light-1 mb-30">
                                            We couldn&apos;t find an enrollment for this course.
                                        </p>
                                        <Link href={`/courses/${id}`}>
                                            <button className="button -md -purple-1 text-white">
                                                Go to Course
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    const course = enrollment.course;
    const isFree = enrollment.paymentAmount === 0;
    const isSuccess = enrollment.status === "ACTIVE" || paymentStatus === "SUCCESS";
    const isPending = enrollment.status === "PENDING" && paymentStatus === "PENDING";

    return (
        <div className="main-content">
            <div className="content-wrapper js-content-wrapper overflow-hidden">
                <PageLinks dark={undefined} />

                <section className="layout-pt-lg layout-pb-lg">
                    <div className="container">
                        <div className="row justify-center">
                            <div className="col-xl-8 col-lg-10">
                                <div className="bg-white shadow-1 rounded-8 px-50 py-50 text-center">
                                    {/* Status Icon */}
                                    <div className="d-flex justify-center mb-30">
                                        <div
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "50%",
                                                backgroundColor: isSuccess
                                                    ? "#22c55e"
                                                    : isPending
                                                        ? "#f59e0b"
                                                        : "#ef4444",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {isSuccess ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="50"
                                                    height="50"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            ) : isPending ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="50"
                                                    height="50"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="50"
                                                    height="50"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    <h2 className="text-24 lh-1 fw-500 text-dark-1 mb-20">
                                        {isSuccess
                                            ? isFree
                                                ? "Enrollment Successful!"
                                                : "Payment Successful!"
                                            : isPending
                                                ? "Payment Pending"
                                                : "Payment Failed"}
                                    </h2>

                                    <p className="text-15 text-light-1 mb-30">
                                        {isSuccess
                                            ? isFree
                                                ? "You have successfully enrolled in this course."
                                                : "Thank you for your purchase! You now have full access to this course."
                                            : isPending
                                                ? "Your payment is being processed. Please check back in a few moments."
                                                : "There was an issue with your payment. Please try again."}
                                    </p>

                                    {/* Course Info Card */}
                                    <div className="bg-light-4 rounded-8 px-30 py-25 mb-30">
                                        <h3 className="text-18 fw-500 text-dark-1 mb-10">
                                            {course.title}
                                        </h3>
                                        <p className="text-14 text-light-1 mb-15">
                                            by {course.instructor?.name || "Unknown Instructor"}
                                        </p>
                                        {!isFree && isSuccess && (
                                            <div className="text-16 fw-500 text-purple-1">
                                                Amount Paid: ₹{enrollment.paymentAmount.toFixed(2)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-center gap-15 flex-wrap">
                                        {isSuccess ? (
                                            <>
                                                <Link href={`/courses/${id}`}>
                                                    <button className="button -md -purple-1 text-white">
                                                        Start Learning
                                                    </button>
                                                </Link>
                                                <Link href="/dshb-courses">
                                                    <button className="button -md -outline-dark-1 text-dark-1">
                                                        Go to My Courses
                                                    </button>
                                                </Link>
                                            </>
                                        ) : isPending ? (
                                            <Link href={`/courses/${id}/purchase/success?txnId=${transactionId}`}>
                                                <button className="button -md -purple-1 text-white">
                                                    Check Status Again
                                                </button>
                                            </Link>
                                        ) : (
                                            <Link href={`/courses/${id}`}>
                                                <button className="button -md -purple-1 text-white">
                                                    Try Again
                                                </button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
