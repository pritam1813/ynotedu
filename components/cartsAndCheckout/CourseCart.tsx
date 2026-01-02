"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CourseCart() {
  const { cartCourses, removeCourseFromCart, isLoading, getTotalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const totalPrice = getTotalPrice();

  const handleRemoveCart = async (courseId: number) => {
    await removeCourseFromCart(courseId);
    toast.success("Removed from cart");
  };

  const handleCheckout = async () => {
    if (cartCourses.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/cart/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // If there's a redirect URL (paid courses), redirect to PhonePe
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        // Only free courses - direct enrollment success
        clearCart();
        toast.success("Successfully enrolled in free courses!");
        router.push("/dshb-courses");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <section className="page-header -type-1">
        <div className="container">
          <div className="page-header__content">
            <div className="row justify-center text-center">
              <div className="col-auto">
                <div>
                  <h1 className="page-header__title">Course Cart</h1>
                </div>

                <div>
                  <p className="page-header__text">
                    We're on a mission to deliver engaging, curated courses at a
                    reasonable price.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-end">
            <div className="col-12">
              <div className="px-30 pr-60 py-25 rounded-8 bg-light-6 md:d-none">
                <div className="row justify-between">
                  <div className="col-md-5">
                    <div className="fw-500 text-purple-1">Course</div>
                  </div>
                  <div className="col-md-3">
                    <div className="fw-500 text-purple-1">Instructor</div>
                  </div>
                  <div className="col-md-2">
                    <div className="fw-500 text-purple-1">Price</div>
                  </div>
                  <div className="col-md-1">
                    <div className="d-flex justify-end">
                      <div className="fw-500 text-purple-1">Remove</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-30 pr-60 md:px-0">
                {isLoading ? (
                  <div className="py-60 text-center">
                    <p className="text-18 text-dark-1">Loading cart...</p>
                  </div>
                ) : cartCourses.length === 0 ? (
                  <div className="py-60 text-center">
                    <p className="text-18 text-dark-1 mb-20">Your cart is empty</p>
                    <Link
                      href="/courses-list-1"
                      className="button -md -purple-1 text-white"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  cartCourses.map((course) => (
                    <div
                      key={course.id}
                      className="row y-gap-20 justify-between items-center pt-30 pb-30 border-bottom-light"
                    >
                      <div className="col-md-5">
                        <div className="d-flex items-center">
                          <div className="">
                            <div
                              className="size-100 bg-image rounded-8"
                              style={{ backgroundImage: `url(${course.thumbnail})` }}
                            ></div>
                          </div>
                          <div className="fw-500 text-dark-1 ml-30">
                            <Link
                              className="linkCustom"
                              href={`/courses/${course.id}`}
                            >
                              {course.title}
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 md:mt-15">
                        <div className="">
                          <div className="shopCart-products__title d-none md:d-block mb-10">
                            Instructor
                          </div>
                          <p>{course.instructorName || "Instructor"}</p>
                        </div>
                      </div>

                      <div className="col-md-2 md:mt-15">
                        <div className="">
                          <div className="shopCart-products__title d-none md:d-block mb-10">
                            Price
                          </div>
                          <p className="text-18 fw-500">
                            {course.price > 0 ? `₹${course.price}` : "Free"}
                          </p>
                        </div>
                      </div>

                      <div className="col-md-1">
                        <button
                          className="md:d-none d-flex justify-end text-light-1 hover:text-red-1"
                          onClick={() => handleRemoveCart(course.id)}
                          disabled={isLoading}
                          aria-label="Remove from cart"
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartCourses.length > 0 && (
                <div className="shopCart-footer px-16 mt-30">
                  <div className="row justify-end">
                    <div className="col-auto">
                      <Link
                        href="/courses-list-1"
                        className="button -md -outline-purple-1 text-purple-1"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cartCourses.length > 0 && (
              <div className="col-xl-4 col-lg-5 layout-pt-lg">
                <div className="py-30 bg-light-4 rounded-8 border-light">
                  <h5 className="px-30 text-20 fw-500">Cart Totals</h5>

                  <div className="d-flex justify-between px-30 item mt-25">
                    <div className="py-15 fw-500 text-dark-1">
                      Items ({cartCourses.length})
                    </div>
                    <div className="py-15 fw-500 text-dark-1">
                      ₹{totalPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="d-flex justify-between px-30 item border-top-dark">
                    <div className="pt-15 fw-500 text-dark-1">Total</div>
                    <div className="pt-15 fw-500 text-dark-1 text-20">
                      ₹{totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || isLoading}
                  className={`button -md -purple-1 text-white col-12 mt-30 ${isCheckingOut ? "opacity-70" : ""
                    }`}
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </button>

                {totalPrice === 0 && (
                  <p className="text-center text-14 text-light-1 mt-15">
                    All courses are free! Click checkout to enroll.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
