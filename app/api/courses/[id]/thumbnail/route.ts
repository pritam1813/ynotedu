import { prisma } from "@/lib/client";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const courseIdSchema = z
  .string()
  .regex(/^\d+$/, "Course ID must be a valid number")
  .transform(Number);

// Helper function to extract Cloudinary public_id from URL
function getCloudinaryPublicId(url: string): string | null {
  try {
    // Cloudinary URLs look like: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

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

    // Delete old thumbnail from Cloudinary if it exists
    if (course.thumbnail) {
      const oldPublicId = getCloudinaryPublicId(course.thumbnail);
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (deleteError) {
          console.error("Error deleting old thumbnail:", deleteError);
          // Continue with upload even if old delete fails
        }
      }
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

    // Use secure_url to ensure HTTPS protocol
    const thumbnailUrl = uploadResult.secure_url || uploadResult.url.replace('http://', 'https://');

    const data = await prisma.course.update({
      where: { id: courseId },
      data: { thumbnail: thumbnailUrl },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    if (!course.thumbnail) {
      return NextResponse.json({ error: "No thumbnail to delete" }, { status: 400 });
    }

    // Delete from Cloudinary
    const publicId = getCloudinaryPublicId(course.thumbnail);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted thumbnail from Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue to clear from DB even if Cloudinary delete fails
      }
    }

    // Clear thumbnail from database
    await prisma.course.update({
      where: { id: courseId },
      data: { thumbnail: "" },
    });

    return NextResponse.json({
      success: true,
      message: "Thumbnail deleted successfully"
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

