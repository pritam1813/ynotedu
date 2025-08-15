import { prisma } from "@/lib/client";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const courseIdSchema = z
  .string()
  .regex(/^\d+$/, "Course ID must be a valid number")
  .transform(Number);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const courseIdValidation = courseIdSchema.safeParse((await params).id);
    if (!courseIdValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid course ID",
          details: courseIdValidation.error.errors,
        },
        { status: 400 }
      );
    }
    const courseId = courseIdValidation.data;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto", // Automatically detect file type
            folder: "ynotedu", // Optional: organize uploads in folders
            transformation: [
              { quality: "auto:good" }, // Automatic quality optimization
              { fetch_format: "auto" }, // Automatic format optimization
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const uploadResult = result as any;

    const data = await prisma.course.update({
      where: { id: courseId },
      data: { thumbnail: uploadResult.url },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
