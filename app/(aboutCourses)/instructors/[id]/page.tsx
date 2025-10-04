import React from "react";
import InstractorSingle from "@/components/aboutCourses/instractors/InstractorSingle";
import PageLinks from "@/components/common/PageLinks";
import { prisma } from "@/lib/client";
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

export const revalidate = 3600;

export async function generateStaticParams() {
  const instructors = await prisma.instructor.findMany({
    select: { id: true },
  });

  return instructors.map((instructor) => ({
    id: instructor.id.toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const instructor = await prisma.instructor.findUnique({
    where: { id: parseInt(id) },
    include: {
      socialProfile: true,
      meetings: true,
    },
  });

  console.log("Ins: ", instructor);

  if (!instructor) {
    throw new Error("Instructor not found");
  }

  return (
    <div className="main-content">
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <PageLinks dark={undefined} />
        <InstractorSingle instructor={instructor} />
      </div>
    </div>
  );
}
