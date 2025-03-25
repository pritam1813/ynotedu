"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { menuList } from "@/data/menu";
import ShopCart from "../layout/component/ShopCart";
import EventCart from "../layout/component/EventCart";
import CourseCart from "../layout/component/CourseCart";

export default function CartToggle() {
  const { cartProducts, cartCourses, cartEvents } = useStore();
  const [activeCart, setActiveCart] = useState(false);
  const [menuItem, setMenuItem] = useState("");
  const [submenu, setSubmenu] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    menuList.forEach((elm) => {
      elm?.links?.forEach((elm2) => {
        if (elm2.href?.split("/")[1] == pathname?.split("/")[1]) {
          setMenuItem(elm.title);
        } else {
          elm2?.links?.map((elm3) => {
            if (elm3.href?.split("/")[1] == pathname?.split("/")[1]) {
              setMenuItem(elm.title);
              setSubmenu(elm2.title);
            }
          });
        }
      });
    });
  }, []);
  return (
    <div className="relative ml-30 xl:ml-20">
      <button
        style={{ position: "relative" }}
        onClick={() => setActiveCart((pre) => !pre)}
        className="d-flex items-center text-white"
        data-el-toggle=".js-cart-toggle"
      >
        <i className="text-20 icon icon-basket"></i>
        <div className="cartProductCount">
          {submenu == "Shop" && (
            <>{cartProducts.length > 9 ? "9+" : cartProducts.length} </>
          )}
          {menuItem == "Events" && (
            <>{cartEvents.length > 9 ? "9+" : cartEvents.length} </>
          )}
          {!(submenu == "Shop" || menuItem == "Events") && (
            <>{cartCourses.length > 9 ? "9+" : cartCourses.length} </>
          )}
        </div>
      </button>

      <div
        className={`toggle-element js-cart-toggle ${
          activeCart ? "-is-el-visible" : ""
        }`}
      >
        {submenu == "Shop" && <ShopCart />}
        {menuItem == "Events" && <EventCart />}
        {!(submenu == "Shop" || menuItem == "Events") && <CourseCart />}
      </div>
    </div>
  );
}
