import React from "react";
import InstractorSingle from "@/components/aboutCourses/instractors/InstractorSingle";
import PageLinks from "@/components/common/PageLinks";
import { getBaseUrl } from "@/utils/getBaseUrl";
import type { Meeting, SocialProfile, Instructor } from "@prisma/client";

export const metadata = {
  title: "Instructors || Ynotedu - Professional LMS Online Education ",
  description:
    "Elevate your e-learning content with Ynotedu, the most impressive LMS template for online courses, education and LMS platforms.",
};

export interface InstructorWithSocialProfile extends Instructor {
  socialProfile: SocialProfile[];
  meetings: Meeting[];
}

export const dynamicParams = true;
export const revalidate = 60 * 60 * 24;

export async function generateStaticParams() {
  const data = await fetch(`${getBaseUrl()}/api/instructors`).then((res) =>
    res.json()
  );

  return data.instructors.map((instructor: Instructor) => ({
    id: instructor.id.toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await fetch(`${getBaseUrl()}/api/instructors/${id}`);

  const instructor: InstructorWithSocialProfile = await data.json();

  return (
    <div className="main-content">
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />
        <InstractorSingle instructor={instructor} />
      </div>
    </div>
  );
}
