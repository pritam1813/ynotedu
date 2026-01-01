"use client"

import { useStore } from "@/store/useStore";

export default function AddToCartButton({ courseId }: { courseId: number }) {
    const { isAddedToCartCourses, addCourseToCart } = useStore();
    return (
        <button
            className="button -md -purple-1 text-white w-1/1"
            onClick={() => addCourseToCart(courseId)}
        >
            {isAddedToCartCourses(courseId) ? "Already Added" : "Add To Cart"}
        </button>
    );
}