"use client";

import React from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

interface CourseCartProps {
  onClose?: () => void;
}

const CourseCart = ({ onClose }: CourseCartProps) => {
  const { cartCourses, removeCourseFromCart, isLoading, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  const handleRemoveCart = async (courseId: number) => {
    await removeCourseFromCart(courseId);
  };

  return (
    <div className="header-cart bg-white -dark-bg-dark-1 rounded-8">
      <div
        className="px-30 pt-30 pb-10"
        style={{ maxHeight: "300px", overflowY: "scroll" }}
      >
        {isLoading ? (
          <div className="p-20 text-center text-dark-1">Loading cart...</div>
        ) : cartCourses.length === 0 ? (
          <div className="p-20 pb-30 text-18 text-dark-1">
            Your Course Cart Is Empty
          </div>
        ) : (
          cartCourses.map((course) => (
            <div key={course.id} className="row justify-between x-gap-40 pb-20">
              <Link
                style={{ textDecoration: "none" }}
                href={`/courses/${course.id}`}
                className="col"
                onClick={onClose}
              >
                <div className="row x-gap-10 y-gap-10">
                  <div className="col-auto">
                    <Image
                      width={80}
                      height={80}
                      src={course.thumbnail}
                      alt={course.title}
                      className="rounded-8"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="col">
                    <div className="text-dark-1 lh-15">{course.title}</div>

                    <div className="d-flex items-center mt-10">
                      <div className="text-18 lh-12 fw-500 text-dark-1">
                        {course.price > 0 ? `₹${course.price}` : "Free"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="col-auto">
                <button
                  onClick={() => handleRemoveCart(course.id)}
                  className="icon-close text-dark-1"
                  aria-label="Remove from cart"
                  disabled={isLoading}
                ></button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-30 py-20 border-top-light">
        <div className="row y-gap-10 justify-between items-center">
          <div className="col-auto">
            <div className="text-18 lh-12 fw-500 text-dark-1">Total</div>
          </div>

          <div className="col-auto">
            <div className="text-18 lh-12 fw-500 text-dark-1">
              ₹{totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="row y-gap-20 items-center justify-between pt-20 mt-20 border-top-light">
          <div className="col-auto">
            <Link
              className="button h-50 px-24 -dark-bg-dark-2 -dark-text-white text-dark-1"
              href="/cart"
              onClick={onClose}
            >
              View Cart
            </Link>
          </div>

          <div className="col-auto">
            <Link
              className="button h-50 px-24 -purple-1 text-white"
              href="/cart"
              onClick={onClose}
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCart;
