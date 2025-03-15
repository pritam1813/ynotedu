import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";
// import { UpdateInstructorInput, Instructor } from '@/models/Instructor';

// Import our instructors array from the parent route
// In a real app, this would be a database query
// import { instructors } from '../route';

// GET /api/instructors/[id] - Get a specific instructor
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const res = await params;
    const id = parseInt(res.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid instructor ID" },
        { status: 400 }
      );
    }

    // Find the instructor by ID
    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: {
        socialProfile: true,
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor, { status: 200 });
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor" },
      { status: 500 }
    );
  }
}

// PUT /api/instructors/[id] - Update a specific instructor
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = parseInt(params.id);
//     const body = await request.json();

//     // Find the instructor index
//     const index = instructors.findIndex(i => i.id === id);

//     if (index === -1) {
//       return NextResponse.json(
//         { error: 'Instructor not found' },
//         { status: 404 }
//       );
//     }

//     // Update the instructor
//     const updatedInstructor: Instructor = {
//       ...instructors[index],
//       ...body as UpdateInstructorInput,
//       updatedAt: new Date()
//     };

//     // Replace the old instructor with the updated one
//     instructors[index] = updatedInstructor;

//     return NextResponse.json(updatedInstructor, { status: 200 });
//   } catch (error) {
//     console.error('Error updating instructor:', error);
//     return NextResponse.json(
//       { error: 'Failed to update instructor' },
//       { status: 500 }
//     );
//   }
// }

// DELETE /api/instructors/[id] - Delete a specific instructor
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = parseInt(params.id);

//     // Find the instructor index
//     const index = instructors.findIndex(i => i.id === id);

//     if (index === -1) {
//       return NextResponse.json(
//         { error: 'Instructor not found' },
//         { status: 404 }
//       );
//     }

//     // Remove the instructor
//     const deletedInstructor = instructors[index];
//     instructors.splice(index, 1);

//     return NextResponse.json(
//       { message: 'Instructor deleted successfully', instructor: deletedInstructor },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error deleting instructor:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete instructor' },
//       { status: 500 }
//     );
//   }
// }
