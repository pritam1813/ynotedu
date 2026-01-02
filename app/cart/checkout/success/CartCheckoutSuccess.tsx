"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

type PaymentStatus = "loading" | "success" | "pending" | "failed";

export default function CartCheckoutSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const txnId = searchParams.get("txnId");
    const { clearCart, fetchCart } = useCartStore();

    const [status, setStatus] = useState<PaymentStatus>("loading");
    const [message, setMessage] = useState("");
    const [enrolledCourses, setEnrolledCourses] = useState<number>(0);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!txnId) {
                setStatus("failed");
                setMessage("No transaction ID found");
                return;
            }

            try {
                // Query the payment status API
                const response = await fetch(
                    `/api/payments/phonepe/callback?merchantOrderId=${txnId}`
                );

                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus("success");
                    setMessage("Payment successful! You are now enrolled in your courses.");
                    setEnrolledCourses(data.enrolledCount || 0);

                    // Clear the cart after successful payment
                    clearCart();

                    // Refresh cart from server to ensure sync
                    setTimeout(() => {
                        fetchCart();
                    }, 1000);
                } else if (data.status === "PENDING") {
                    setStatus("pending");
                    setMessage("Payment is still being processed. Please wait...");
                } else {
                    setStatus("failed");
                    setMessage(data.error || "Payment verification failed");
                }
            } catch (error) {
                console.error("Error verifying payment:", error);
                setStatus("failed");
                setMessage("Failed to verify payment status");
            }
        };

        verifyPayment();
    }, [txnId, clearCart, fetchCart]);

    return (
        <section className="layout-pt-lg layout-pb-lg">
            <div className="container">
                <div className="row justify-center">
                    <div className="col-xl-6 col-lg-8 col-md-10">
                        <div className="text-center">
                            {status === "loading" && (
                                <>
                                    <div className="size-100 bg-light-4 rounded-full d-flex items-center justify-center mx-auto mb-30">
                                        <div className="spinner-border text-purple-1" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    <h2 className="text-24 lh-1 fw-500 text-dark-1">
                                        Verifying Payment...
                                    </h2>
                                    <p className="mt-15 text-light-1">
                                        Please wait while we verify your payment.
                                    </p>
                                </>
                            )}

                            {status === "success" && (
                                <>
                                    <div className="size-100 bg-green-1 rounded-full d-flex items-center justify-center mx-auto mb-30">
                                        <i className="icon-check text-40 text-white"></i>
                                    </div>
                                    <h2 className="text-24 lh-1 fw-500 text-dark-1">
                                        Payment Successful!
                                    </h2>
                                    <p className="mt-15 text-light-1">{message}</p>
                                    {enrolledCourses > 0 && (
                                        <p className="mt-10 text-green-1 fw-500">
                                            {enrolledCourses} course{enrolledCourses > 1 ? "s" : ""} enrolled
                                        </p>
                                    )}
                                    <div className="d-flex justify-center gap-20 mt-30">
                                        <Link
                                            href="/dshb-courses"
                                            className="button -md -purple-1 text-white"
                                        >
                                            Go to My Courses
                                        </Link>
                                        <Link
                                            href="/courses-list-1"
                                            className="button -md -outline-purple-1 text-purple-1"
                                        >
                                            Browse More Courses
                                        </Link>
                                    </div>
                                </>
                            )}

                            {status === "pending" && (
                                <>
                                    <div className="size-100 bg-yellow-1 rounded-full d-flex items-center justify-center mx-auto mb-30">
                                        <i className="icon-time text-40 text-white"></i>
                                    </div>
                                    <h2 className="text-24 lh-1 fw-500 text-dark-1">
                                        Payment Processing
                                    </h2>
                                    <p className="mt-15 text-light-1">{message}</p>
                                    <p className="mt-10 text-14 text-light-1">
                                        Transaction ID: {txnId}
                                    </p>
                                    <div className="mt-30">
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="button -md -purple-1 text-white"
                                        >
                                            Refresh Status
                                        </button>
                                    </div>
                                </>
                            )}

                            {status === "failed" && (
                                <>
                                    <div className="size-100 bg-red-1 rounded-full d-flex items-center justify-center mx-auto mb-30">
                                        <i className="icon-close text-40 text-white"></i>
                                    </div>
                                    <h2 className="text-24 lh-1 fw-500 text-dark-1">
                                        Payment Failed
                                    </h2>
                                    <p className="mt-15 text-light-1">{message}</p>
                                    {txnId && (
                                        <p className="mt-10 text-14 text-light-1">
                                            Transaction ID: {txnId}
                                        </p>
                                    )}
                                    <div className="d-flex justify-center gap-20 mt-30">
                                        <Link href="/cart" className="button -md -purple-1 text-white">
                                            Back to Cart
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="button -md -outline-purple-1 text-purple-1"
                                        >
                                            Contact Support
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
