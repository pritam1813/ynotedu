"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
// import { useStore } from "@/store/useStore";
import Link from "next/link";

const ShopCart = () => {
  // const { cartProducts, setCartProducts } = useStore();
  const [totalPrice, setTotalPrice] = useState(0);

  // const handleRemoveCart = (index) => {
  //   const item = cartProducts[index];
  //   setCartProducts(cartProducts.filter((elm) => elm !== item));
  // };

  // useEffect(() => {
  //   const sum = cartProducts.reduce((accumulator, currentValue) => {
  //     return accumulator + currentValue.price * currentValue.quantity;
  //   }, 0);
  //   setTotalPrice(sum);
  // }, [cartProducts]);

  return (
    <div className="header-cart bg-white -dark-bg-dark-1 rounded-8">
      <div
        className="px-30 pt-30 pb-10"
        style={{ maxHeight: "300px", overflowY: "scroll" }}
      >
        {/* {cartProducts.map((elm, i) => (
          <div key={i} className="row justify-between x-gap-40 pb-20">
            <Link
              style={{ textDecoration: "none" }}
              href={`/shop/${elm.id}`}
              className="col"
            >
              <div className="row x-gap-10 y-gap-10">
                <div className="col-auto">
                  <Image width={80} height={80} src={elm.image} alt="image" />
                </div>

                <div className="col">
                  <div className="text-dark-1 lh-15">{elm.name}</div>

                  <div className="d-flex items-center mt-10">
                    <div className="lh-12 fw-500 line-through text-light-1 mr-10">
                      ${elm.preDiscount}
                    </div>
                    <div className="text-18 lh-12 fw-500 text-dark-1">
                      ${elm.price}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="col-auto">
              <div
                onClick={() => handleRemoveCart(i)}
                className="icon-close text-dark-1"
              ></div>
            </div>
          </div>
        ))} */}
      </div>

      <div className="px-30 py-20 border-top-light">
        <div className="row y-gap-10 justify-between items-center">
          <div className="col-auto">
            <div className="text-18 lh-12 fw-500 text-dark-1">Total</div>
          </div>

          <div className="col-auto">
            <div className="text-18 lh-12 fw-500 text-dark-1">
              ${totalPrice}
            </div>
          </div>
        </div>

        <div className="row y-gap-10 justify-between items-center mt-10">
          <div className="col-auto">
            <div className="text-14 lh-16 text-light-1">Shipping</div>
          </div>

          <div className="col-auto">
            <div className="text-14 lh-16 text-light-1">
              {/* ${cartProducts.length * 10} */}
            </div>
          </div>
        </div>

        <div className="row y-gap-10 justify-between items-center mt-10">
          <div className="col-auto">
            <div className="text-18 lh-12 fw-500 text-dark-1">Total</div>
          </div>

          <div className="col-auto">
            <div className="text-18 lh-12 fw-500 text-dark-1">
              {/* ${totalPrice + cartProducts.length * 10} */}
            </div>
          </div>
        </div>

        <div className="row y-gap-20 items-center justify-between pt-20 mt-20 border-top-light">
          <div className="col-auto">
            <Link
              className="button h-50 px-24 -dark-bg-dark-2 -dark-text-white text-dark-1"
              href="/shop/cart"
            >
              View Cart
            </Link>
          </div>

          <div className="col-auto">
            <Link
              className="button h-50 px-24 -dark-bg-dark-2 -dark-text-white text-dark-1"
              href="/shop/checkout"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
