import React from "react";
import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import PageLinks from "@/components/common/PageLinks";
// import FooterOne from '@/components/layout/footers/FooterOne'
// import Header from '@/components/layout/headers/Header'
import BlogDetails from "@/components/blogs/BlogDetails";
// import Preloader from '@/components/common/Preloader'

export const metadata = {
  title: "Blog-details || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function BlogDetailsPage({
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

        <BlogDetails id={id} />

        <RelatedBlogs />

        {/* <FooterOne/> */}
      </div>
    </div>
  );
}
