// app/api/course-content/route.ts
import { prisma } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod validation schemas
const QuestionOptionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

const QuestionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  type: z.enum([
    "MULTIPLE_CHOICE",
    "SINGLE_CHOICE",
    "TRUE_FALSE",
    "TEXT_ANSWER",
  ]),
  order: z.number().int().positive(),
  points: z.number().int().positive().min(1, "Points must be at least 1"),
  options: z
    .array(QuestionOptionSchema)
    .min(1, "At least one option is required"),
});

const QuizSchema = z.object({
  timeLimit: z.number().int().positive().optional().nullable(),
  passingScore: z
    .number()
    .int()
    .min(0)
    .max(100, "Passing score must be between 0-100"),
  questions: z
    .array(QuestionSchema)
    .min(1, "Quiz must have at least one question"),
});

const VideoSchema = z.object({
  url: z.string().url("Invalid video URL"),
  duration: z.number().int().positive("Duration must be positive"),
  thumbnail: z
    .string()
    .url("Invalid thumbnail URL")
    .optional()
    .or(z.literal("")),
});

const PdfDocumentSchema = z.object({
  url: z.string().url("Invalid PDF URL"),
  pages: z.number().int().positive().optional().nullable(),
});

const ContentItemSchema = z
  .object({
    title: z.string().min(1, "Content title is required"),
    description: z.string().optional().nullable(),
    order: z.number().int().positive(),
    type: z.enum(["VIDEO", "PDF", "QUIZ"]),
    video: VideoSchema.optional().nullable(),
    pdf: PdfDocumentSchema.optional().nullable(),
    quiz: QuizSchema.optional().nullable(),
  })
  .refine(
    (data) => {
      // Ensure the correct content type data is present
      if (data.type === "VIDEO" && !data.video) {
        return false;
      }
      if (data.type === "PDF" && !data.pdf) {
        return false;
      }
      if (data.type === "QUIZ" && !data.quiz) {
        return false;
      }
      return true;
    },
    {
      message: "Content item must have corresponding data for its type",
    }
  );

const SectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional().nullable(),
  order: z.number().int().positive(),
  contents: z.array(ContentItemSchema),
});

const CourseContentSchema = z.object({
  courseId: z.number().int().positive("Invalid course ID"),
  sections: z
    .array(SectionSchema)
    .min(1, "Course must have at least one section"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = CourseContentSchema.parse(body);

    // Additional validation: Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Validate quiz questions have correct answers
    for (const section of validatedData.sections) {
      for (const content of section.contents) {
        if (content.type === "QUIZ" && content.quiz) {
          for (const question of content.quiz.questions) {
            const hasCorrectAnswer = question.options.some(
              (option) => option.isCorrect
            );
            if (!hasCorrectAnswer) {
              return NextResponse.json(
                {
                  error: `Question "${question.text}" must have at least one correct answer`,
                },
                { status: 400 }
              );
            }

            // For single choice, ensure only one correct answer
            if (question.type === "SINGLE_CHOICE") {
              const correctAnswers = question.options.filter(
                (option) => option.isCorrect
              );
              if (correctAnswers.length > 1) {
                return NextResponse.json(
                  {
                    error: `Single choice question "${question.text}" can only have one correct answer`,
                  },
                  { status: 400 }
                );
              }
            }
          }
        }
      }
    }

    // Start transaction to create all content
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing sections for this course (cascade will handle content)
      await tx.section.deleteMany({
        where: { courseId: validatedData.courseId },
      });

      // Create sections and their content
      const createdSections = [];

      for (const sectionData of validatedData.sections) {
        const section = await tx.section.create({
          data: {
            title: sectionData.title,
            description: sectionData.description || null,
            order: sectionData.order,
            courseId: validatedData.courseId,
          },
        });

        // Create content items for this section
        for (const contentData of sectionData.contents) {
          const contentItem = await tx.contentItem.create({
            data: {
              title: contentData.title,
              description: contentData.description || null,
              order: contentData.order,
              type: contentData.type,
              sectionId: section.id,
            },
          });

          // Create type-specific content
          if (contentData.type === "VIDEO" && contentData.video) {
            await tx.video.create({
              data: {
                url: contentData.video.url,
                duration: contentData.video.duration,
                thumbnail: contentData.video.thumbnail || null,
                contentItemId: contentItem.id,
              },
            });
          } else if (contentData.type === "PDF" && contentData.pdf) {
            await tx.pdfDocument.create({
              data: {
                url: contentData.pdf.url,
                pages: contentData.pdf.pages || null,
                contentItemId: contentItem.id,
              },
            });
          } else if (contentData.type === "QUIZ" && contentData.quiz) {
            const quiz = await tx.quiz.create({
              data: {
                timeLimit: contentData.quiz.timeLimit || null,
                passingScore: contentData.quiz.passingScore,
                contentItemId: contentItem.id,
              },
            });

            // Create questions for the quiz
            for (const questionData of contentData.quiz.questions) {
              const question = await tx.question.create({
                data: {
                  text: questionData.text,
                  type: questionData.type,
                  order: questionData.order,
                  points: questionData.points,
                  quizId: quiz.id,
                },
              });

              // Create options for the question
              for (const optionData of questionData.options) {
                await tx.questionOption.create({
                  data: {
                    text: optionData.text,
                    isCorrect: optionData.isCorrect,
                    questionId: question.id,
                  },
                });
              }
            }
          }
        }

        createdSections.push(section);
      }

      // Update course with lesson count and other stats
      const totalLessons = validatedData.sections.reduce(
        (total, section) => total + section.contents.length,
        0
      );

      await tx.course.update({
        where: { id: validatedData.courseId },
        data: {
          lessons: totalLessons,
          updatedAt: new Date(),
        },
      });

      return createdSections;
    });

    return NextResponse.json({
      success: true,
      message: "Course content saved successfully",
      data: {
        sectionsCreated: result.length,
        totalLessons: validatedData.sections.reduce(
          (total, section) => total + section.contents.length,
          0
        ),
      },
    });
  } catch (error) {
    console.error("Course content creation error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          error: "Validation failed",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A unique constraint violation occurred" },
        { status: 409 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Related record not found" },
        { status: 404 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve course content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const sections = await prisma.section.findMany({
      where: { courseId: parseInt(courseId) },
      orderBy: { order: "asc" },
      include: {
        contents: {
          orderBy: { order: "asc" },
          include: {
            video: true,
            pdf: true,
            quiz: {
              include: {
                questions: {
                  orderBy: { order: "asc" },
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("Course content retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course content" },
      { status: 500 }
    );
  }
}
