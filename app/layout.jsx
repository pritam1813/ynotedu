"use client";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../public/assets/sass/styles.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-calendar/dist/Calendar.css";
config.autoAddCss = false;

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Context from "@/context/Context";

export default function RootLayout({ children }) {
  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   // Import the script only on the client side
    //   import("bootstrap/dist/js/bootstrap.esm").then(() => {
    //     // Module is imported, you can access any exported functionality if
    //   });
    // }

    AOS.init({
      duration: 700,
      offset: 120,
      easing: "ease-out",
      once: true,
    });
  }, []);
  return (
    <html lang="en" className="">
      <head></head>
      <body>
        <Context> {children}</Context>
      </body>
    </html>
  );
}
