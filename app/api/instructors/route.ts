import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
// import { CreateInstructorInput, Instructor } from '@/models/Instructor';

// This would typically come from a database
// For now, we'll use a simple in-memory store
// let instructors: Instructor[] = [];

// GET /api/instructors - Get all instructors
export async function GET(request: NextRequest) {
  try {
    // You would typically fetch from a database here
    const instructors = await prisma.instructor.findMany();
    return NextResponse.json(instructors, { status: 200 });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}

// POST /api/instructors - Create a new instructor
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     // Validate the input
//     const requiredFields = [
//       "name",
//       "role",
//       "image",
//       "category",
//       "rating",
//       "reviews",
//       "students",
//       "courses",
//       "socialProfile",
//     ];
//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { error: `Missing required field: ${field}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Create a new instructor with an auto-incremented ID
//     const newInstructor: Instructor = {
//       id:
//         instructors.length > 0
//           ? Math.max(...instructors.map((i) => i.id)) + 1
//           : 1,
//       ...(body as CreateInstructorInput),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     // Add to our collection
//     instructors.push(newInstructor);

//     return NextResponse.json(newInstructor, { status: 201 });
//   } catch (error) {
//     console.error("Error creating instructor:", error);
//     return NextResponse.json(
//       { error: "Failed to create instructor" },
//       { status: 500 }
//     );
//   }
// }
