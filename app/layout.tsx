"use client";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../public/assets/sass/styles.scss";
import "../public/assets/sass/animations.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-calendar/dist/Calendar.css";
config.autoAddCss = false;

import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
