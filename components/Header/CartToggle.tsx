"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import CourseCart from "../layout/component/CourseCart";

export default function CartToggle() {
  const { cartCourses, isLoading } = useCartStore();
  const [activeCart, setActiveCart] = React.useState(false);
  const pathname = usePathname();

  // Close cart dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeCart && !target.closest(".js-cart-container")) {
        setActiveCart(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeCart]);

  return (
    <div className="relative ml-30 xl:ml-20 js-cart-container">
      <button
        style={{ position: "relative" }}
        onClick={() => setActiveCart((pre) => !pre)}
        className="d-flex items-center text-white"
        data-el-toggle=".js-cart-toggle"
        aria-label="Toggle cart"
      >
        <i className="text-20 icon icon-basket"></i>
        <div className="cartProductCount">
          {isLoading ? (
            <span className="text-10">...</span>
          ) : (
            <>{cartCourses.length > 9 ? "9+" : cartCourses.length}</>
          )}
        </div>
      </button>

      <div
        className={`toggle-element js-cart-toggle ${activeCart ? "-is-el-visible" : ""
          }`}
      >
        <CourseCart onClose={() => setActiveCart(false)} />
      </div>
    </div>
  );
}
