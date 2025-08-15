// lib/validations/courseContent.ts
import { z } from "zod";

// Shared validation schemas (can be used on both frontend and backend)
export const QuestionOptionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

export const QuestionSchema = z.object({
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

export const QuizSchema = z.object({
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

export const VideoSchema = z.object({
  url: z.string().url("Invalid video URL"),
  duration: z.number().int().positive("Duration must be positive"),
  thumbnail: z
    .string()
    .url("Invalid thumbnail URL")
    .optional()
    .or(z.literal("")),
});

export const PdfDocumentSchema = z.object({
  url: z.string().url("Invalid PDF URL"),
  pages: z.number().int().positive().optional().nullable(),
});

export const ContentItemSchema = z
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
      if (data.type === "VIDEO" && !data.video) return false;
      if (data.type === "PDF" && !data.pdf) return false;
      if (data.type === "QUIZ" && !data.quiz) return false;
      return true;
    },
    {
      message: "Content item must have corresponding data for its type",
    }
  );

export const SectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional().nullable(),
  order: z.number().int().positive(),
  contents: z.array(ContentItemSchema),
});

export const CourseContentSchema = z.object({
  courseId: z.number().int().positive("Invalid course ID"),
  sections: z
    .array(SectionSchema)
    .min(1, "Course must have at least one section"),
});

// Frontend validation helper functions
export const validateSection = (section: any): string[] => {
  const errors: string[] = [];

  try {
    SectionSchema.parse(section);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((err) => err.message));
    }
  }

  return errors;
};

export const validateContentItem = (content: any): string[] => {
  const errors: string[] = [];

  try {
    ContentItemSchema.parse(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((err) => err.message));
    }
  }

  // Additional business logic validation
  if (content.type === "QUIZ" && content.quiz) {
    for (const question of content.quiz.questions) {
      const hasCorrectAnswer = question.options?.some(
        (option: any) => option.isCorrect
      );
      if (!hasCorrectAnswer) {
        errors.push(
          `Question "${question.text}" must have at least one correct answer`
        );
      }

      if (question.type === "SINGLE_CHOICE") {
        const correctAnswers =
          question.options?.filter((option: any) => option.isCorrect) || [];
        if (correctAnswers.length > 1) {
          errors.push(
            `Single choice question "${question.text}" can only have one correct answer`
          );
        }
      }
    }
  }

  return errors;
};

export const validateQuiz = (quiz: any): string[] => {
  const errors: string[] = [];

  try {
    QuizSchema.parse(quiz);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((err) => err.message));
    }
  }

  return errors;
};

export const validateQuestion = (question: any): string[] => {
  const errors: string[] = [];

  try {
    QuestionSchema.parse(question);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((err) => err.message));
    }
  }

  return errors;
};

// Enhanced client-side validation for the entire form
export const validateCourseContent = (
  formData: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    CourseContentSchema.parse(formData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(
        ...error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      );
    }
  }

  // Additional validations
  if (formData.sections) {
    formData.sections.forEach((section: any, sectionIndex: number) => {
      if (section.contents) {
        section.contents.forEach((content: any, contentIndex: number) => {
          const contentErrors = validateContentItem(content);
          contentErrors.forEach((error) => {
            errors.push(
              `Section ${sectionIndex + 1}, Content ${
                contentIndex + 1
              }: ${error}`
            );
          });
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
