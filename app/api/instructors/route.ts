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
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const category = searchParams.get("category");
    const rating = searchParams.get("rating"); // Rating threshold (e.g., 4.0, 4.5)
    const sort = searchParams.get("sort"); // 'asc' or 'desc'

    // Build the query
    const query: any = {
      include: {
        socialProfile: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    };

    // Filter by category if provided
    if (category && category !== "All Categories") {
      query.where = {
        ...query.where,
        categories: {
          some: {
            category: {
              label: category,
            },
          },
        },
      };
    }

    // Filter by rating threshold if provided
    if (rating) {
      const ratingValue = parseFloat(rating);
      if (!isNaN(ratingValue)) {
        query.where = {
          ...query.where,
          rating: {
            gte: ratingValue, // Greater than or equal to the specified rating
          },
        };
      }
    }

    // Apply sorting if provided
    if (sort) {
      query.orderBy = {
        rating: sort.toLowerCase() === "asc" ? "asc" : "desc",
      };
    } else {
      // Default sorting is by rating in descending order (highest first)
      query.orderBy = {
        rating: "desc",
      };
    }

    // Fetch instructors from database
    const instructors = await prisma.instructor.findMany(query);

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
