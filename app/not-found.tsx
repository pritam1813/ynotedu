import React from "react";
import NotFound from "@/components/not-found/NotFound";
import PageLinks from "@/components/common/PageLinks";

export const metadata = {
  title: "Page not found || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function NotFoundPage() {
  return (
    <div className="main-content">
      {/* <Preloader />
      <Header /> */}
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={false} />
        <NotFound />
        {/* <FooterOne /> */}
      </div>
    </div>
  );
}
