import React from "react";
import Faq from "@/components/common/Faq";
// import PageLinks from "@/components/common/PageLinks";
// import Preloader from "@/components/common/Preloader";
import ContactOne from "@/components/contacts/ContactOne";
// import FooterOne from "@/components/layout/footers/FooterOne";
// import Header from "@/components/layout/headers/Header";

export const metadata = {
  title: "Contact Us || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Contact() {
  return (
    <div className="main-content  ">
      {/* <Preloader />

      <Header /> */}
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <ContactOne />
        <Faq />

        {/* <FooterOne /> */}
      </div>
    </div>
  );
}
