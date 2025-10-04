"use server";

import { prisma } from "@/lib/client";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

type InitialStateCreateClass = {
  success: false;
  message: "";
};

const createScheduleSchema = z.object({
  title: z.string(),
  subject: z.string(),
  date: z.string().date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time",
  }),
  duration: z.coerce.number(),
  meetlink: z.string().url(),
});

export async function createClass(
  initialState: InitialStateCreateClass,
  formData: FormData
) {
  try {
    const formValues = Object.fromEntries(formData);

    const results = createScheduleSchema.safeParse(formValues);

    if (!results.success) throw results.error;

    const { userId } = await auth();
    const { id } = await prisma.instructor.findUnique({
      where: { userId },
    });

    await prisma.meeting.create({
      data: {
        title: results.data.title,
        duration: results.data.duration,
        startTime: new Date(`${results.data.date}T${results.data.time}:00`),
        meetLink: results.data.meetlink,
        instructorId: id,
      },
    });

    return { success: true, message: "Class Created" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:");
      for (const issue of error.errors) {
        console.error(`- ${issue.path.join(".")}: ${issue.message}`);
        return {
          success: false,
          message: `${issue.message}`,
        };
      }
    } else {
      console.error("Unexpected error:", error);
    }
    return { success: false, message: "not done" };
  }
}
