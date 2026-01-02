"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface CourseListAddToCartButtonProps {
    courseId: number;
    title: string;
    thumbnail: string;
    price: number;
    instructorName?: string;
}

export default function CourseListAddToCartButton({
    courseId,
    title,
    thumbnail,
    price,
    instructorName,
}: CourseListAddToCartButtonProps) {
    const { isAddedToCartCourses, addCourseToCart, isLoading, hasMounted } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);

    // Check if in cart (returns false during SSR to prevent hydration mismatch)
    const isInCart = isAddedToCartCourses(courseId);

    const handleAddToCart = async () => {
        if (isInCart || isAdding) return;

        setIsAdding(true);
        try {
            await addCourseToCart({
                id: courseId,
                title,
                thumbnail,
                price,
                instructorName,
            });
            toast.success("Added to cart!");
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    // Show loading state during SSR hydration
    const buttonDisabled = !hasMounted || isInCart || isAdding || isLoading;
    const buttonText = !hasMounted
        ? "Add To Cart"
        : isAdding
            ? "Adding..."
            : isInCart
                ? "Already Added"
                : "Add To Cart";

    return (
        <button
            style={{ padding: "0px 54px" }}
            className={`button -md h-60 -purple-1 text-white col-12 py-54 ${buttonDisabled ? "opacity-70" : ""}`}
            onClick={handleAddToCart}
            disabled={buttonDisabled}
        >
            {buttonText}
        </button>
    );
}
