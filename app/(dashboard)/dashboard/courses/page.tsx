import React from "react";
import AllCoursesTwo from "@/components/dashboard/AllCoursesTwo";

export const metadata = {
  title: "Dashboard-courses || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function page(props: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.search || "";

  return <AllCoursesTwo search={query} />;
}
