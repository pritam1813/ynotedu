"use client"

import { useActionState, useEffect, useState, useCallback, useRef } from "react";
import { purchaseCourse, PurchaseState } from "@/app/actions/purchaseAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface BuyNowButtonProps {
    courseId: number;
    price: number;
}

const initialState: PurchaseState = {
    success: false,
    error: undefined,
    tokenUrl: undefined,
    message: undefined,
    transactionId: undefined,
}

export default function BuyNowButton({ courseId, price }: BuyNowButtonProps) {
    const [isPhonePayScriptLoaded, setIsPhonePayScriptLoaded] = useState(
        () => typeof window !== 'undefined' && !!window.PhonePeCheckout
    );
    const [state, formAction, pending] = useActionState(purchaseCourse, initialState);
    const router = useRouter();

    // Store transactionId in ref so callback can access latest value
    const transactionIdRef = useRef<string | undefined>(undefined);

    // Update ref when state.transactionId changes
    useEffect(() => {
        if (state.transactionId) {
            transactionIdRef.current = state.transactionId;
        }
    }, [state.transactionId]);

    // Memoize callback to prevent recreation
    const callback = useCallback((response: string) => {
        // console.log("PhonePe callback response:", response);
        const txnId = transactionIdRef.current;
        const successUrl = txnId
            ? `/courses/${courseId}/purchase/success?txnId=${txnId}`
            : `/courses/${courseId}/purchase/success`;

        if (response === 'USER_CANCEL') {
            toast.error('Transaction cancelled');
            return;
        } else if (response === 'FAILURE') {
            toast.error('Payment failed. Please try again.');
            return;
        } else if (response === 'SUCCESS') {
            toast.success('Payment successful!');
            router.push(successUrl);
            return;
        } else if (response === 'CONCLUDED') {
            // CONCLUDED means the transaction flow ended - redirect to verify status
            toast('Verifying payment...', { icon: '⏳' });
            router.push(successUrl);
            return;
        }
    }, [router, courseId]);

    // Handle PhonePe transaction separately
    useEffect(() => {
        if (state.success && state.tokenUrl && isPhonePayScriptLoaded && window.PhonePeCheckout) {
            window.PhonePeCheckout.transact({
                tokenUrl: state.tokenUrl,
                callback,
                type: "IFRAME"
            });
        }
    }, [state.success, state.tokenUrl, isPhonePayScriptLoaded, callback]);

    // Handle error/success messages
    useEffect(() => {
        if (state.success && state.message) {
            toast.success(state.message);
        }

        if (state.error === "AUTH_REQUIRED") {
            toast.error("Please sign in to purchase this course");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <>
            <Script
                src="https://mercury.phonepe.com/web/bundle/checkout.js"
                onLoad={() => setIsPhonePayScriptLoaded(true)}
                onError={() => toast.error("Failed to load payment gateway")}
            />
            <form action={formAction}>
                <input type="hidden" name="courseId" value={courseId} />
                <input type="hidden" name="totalAmount" value={price} />
                <button
                    type="submit"
                    className="button -md -outline-dark-1 text-dark-1 w-1/1 mt-10"
                    disabled={!isPhonePayScriptLoaded || pending}
                >
                    {!isPhonePayScriptLoaded ? "Loading..." : pending ? "Processing..." : "Buy Now"}
                </button>
            </form>
        </>
    );
}