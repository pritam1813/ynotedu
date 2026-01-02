"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
    courseId: number;
    course?: {
        title: string;
        thumbnail: string;
        price: number;
        instructorName?: string;
    };
}

export default function AddToCartButton({ courseId, course }: AddToCartButtonProps) {
    const { addCourseToCart, isLoading, cartCourses } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Track mount state locally to ensure consistent SSR/client rendering
    useEffect(() => {
        setMounted(true);
    }, []);

    // Only check cart state after mount to prevent hydration mismatch
    const isInCart = mounted ? cartCourses.some((c) => c.id === courseId) : false;

    const handleAddToCart = async () => {
        if (isInCart || isAdding) return;

        setIsAdding(true);
        try {
            if (course) {
                // Use provided course data
                await addCourseToCart({
                    id: courseId,
                    title: course.title,
                    thumbnail: course.thumbnail,
                    price: course.price,
                    instructorName: course.instructorName,
                });
                toast.success("Added to cart!");
            } else {
                // Fetch course data from API
                const response = await fetch(`/api/courses/${courseId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch course details");
                }
                const courseData = await response.json();
                await addCourseToCart({
                    id: courseData.id,
                    title: courseData.title,
                    thumbnail: courseData.thumbnail,
                    price: courseData.price,
                    instructorName: courseData.instructor?.name,
                });
                toast.success("Added to cart!");
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    // Disable button only after mount when we know the true state
    const buttonDisabled = isAdding || isLoading || (mounted && isInCart);
    const buttonText = isAdding ? "Adding..." : (mounted && isInCart) ? "Already Added" : "Add To Cart";

    return (
        <button
            className={`button -md -purple-1 text-white w-1/1 ${isAdding || isLoading ? "opacity-70" : ""}`}
            onClick={handleAddToCart}
            disabled={buttonDisabled}
        >
            {buttonText}
        </button>
    );
}