import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const res = await params;
    const id = parseInt(res.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
    }

    // Find the course by ID with instructor, meetings, demoLink, and sections
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        meetings: true,
        demoLink: true,
        sections: {
          include: {
            contents: {
              include: {
                video: true,
                pdf: true,
                quiz: {
                  include: {
                    questions: {
                      include: {
                        options: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
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
