import Preloader from "@/components/common/Preloader";
import AddCourse from "@/components/dashboard/AddCourse";

import Sidebar from "@/components/dashboard/Sidebar";
import HeaderDashboard from "@/components/layout/headers/HeaderDashboard";
import React from "react";

export const metadata = {
  title: "Dashboard-listing || ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default async function page(props: {
  searchParams?: Promise<{ courseid?: string }>;
}) {
  const searchParams = await props.searchParams;
  const courseId = searchParams?.courseid || "";
  return (
    <div className="barba-container" data-barba="container">
      <main className="main-content">
        <Preloader />
        <HeaderDashboard />
        <div className="content-wrapper js-content-wrapper overflow-hidden">
          <div
            id="dashboardOpenClose"
            className="dashboard -home-9 js-dashboard-home-9"
          >
            <div className="dashboard__sidebar scroll-bar-1">
              <Sidebar />
            </div>
            <AddCourse courseId={courseId} />
            {/* <Listing /> */}
          </div>
        </div>
      </main>
    </div>
  );
}
