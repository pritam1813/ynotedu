import React from "react";
import InstractorSingle from "@/components/aboutCourses/instractors/InstractorSingle";
import PageLinks from "@/components/common/PageLinks";
// import Preloader from "@/components/common/Preloader";
// import FooterOne from "@/components/layout/footers/FooterOne";
// import Header from "@/components/layout/headers/Header";

export const metadata = {
  title: "Instractors || Ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with Ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // console.log("Page params:", params);
  const { id } = await params;

  return (
    <div className="main-content">
      {/* <Preloader />
      <Header /> */}
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />
        {/* @ts-expect-error Async Server Component */}
        <InstractorSingle id={id} />
        {/* <FooterOne /> */}
      </div>
    </div>
  );
}
