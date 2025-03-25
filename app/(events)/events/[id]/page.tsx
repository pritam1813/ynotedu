import React from "react";
import PageLinks from "@/components/common/PageLinks";
import EventDetails from "@/components/events/EventDetails";
// import Preloader from '@/components/common/Preloader'
// import FooterOne from "@/components/layout/footers/FooterOne";
// import Header from '@/components/layout/headers/Header'

export const metadata = {
  title: "Event-details || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="main-content  ">
      {/* <Preloader/>

        <Header/> */}
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />

        <EventDetails id={id} />

        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
