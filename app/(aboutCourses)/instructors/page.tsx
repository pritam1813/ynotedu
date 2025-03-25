import React from "react";
// import Instractors from "@/components/aboutCourses/instractors/Instractors";
import PageLinks from "@/components/common/PageLinks";
// import InstractorsTwo from "@/components/aboutCourses/instractors/InatractorsTwo";
import InstructorList from "@/components/aboutCourses/instractors/InstructorList";
export default function Instructors() {
  return (
    <div className="content-wrapper  js-content-wrapper overflow-hidden">
      <PageLinks dark={undefined} />

      {/* <Instractors /> */}
      {/* <InstractorsTwo /> */}
      <InstructorList />
    </div>
  );
}
