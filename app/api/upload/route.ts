import { NextRequest, NextResponse } from "next/server";

// Mock function to generate a random URL
function generateRandomUrl(fileType: string) {
  const randomId = Math.random().toString(36).substring(2, 15);
  const fileTypes = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "application/pdf": "pdf",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
  };

  const ext = fileTypes[fileType as keyof typeof fileTypes] || "jpg";
  return `https://cdn.ynotedu.com/${randomId}.${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you'd handle the file upload here
    // For mock purposes, we'll just delay the response
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a mock URL based on file type
    const url = generateRandomUrl(file.type);

    return NextResponse.json({
      success: true,
      url,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Error in file upload:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
