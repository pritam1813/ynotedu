import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET /api/meetings - Get meetings (can be filtered by instructor, course, status)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User Id: ", userId);

    const searchParams = request.nextUrl.searchParams;
    const instructorId = searchParams.get("instructorId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");
    console.log("Instructor Id: ", instructorId);

    // Build the query
    const query: any = {};

    if (instructorId) {
      query.where = {
        ...query.where,
        instructorId: parseInt(instructorId),
      };
    }

    if (courseId) {
      query.where = {
        ...query.where,
        courseId: parseInt(courseId),
      };
    }

    if (status) {
      query.where = {
        ...query.where,
        status,
      };
    }

    // Include relations
    query.include = {
      instructor: true,
      course: true,
    };

    // Order by startTime (most recent first)
    query.orderBy = {
      startTime: "desc",
    };

    // const meetings = await prisma.meeting.findMany(query);

    return NextResponse.json({ meetings: "meeting" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

// POST /api/meetings - Create a new meeting
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.startTime || !body.instructorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create meeting in the database
    const meeting = await prisma.meeting.create({
      data: {
        title: body.title,
        startTime: new Date(body.startTime),
        duration: body.duration || 60,
        description: body.description,
        meetLink: body.meetLink,
        status: body.status || "SCHEDULED",
        courseId: body.courseId ? parseInt(body.courseId) : null,
        instructorId: parseInt(body.instructorId),
        googleEventId: body.googleEventId,
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}

// PATCH /api/meetings - Update a meeting status (scheduled/live/cancelled)
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update meeting status
    const meeting = await prisma.meeting.update({
      where: {
        id: parseInt(body.id),
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(meeting, { status: 200 });
  } catch (error) {
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
}
