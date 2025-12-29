"use client";

import React, { useState } from "react";
import { validateCourseContent } from "@/lib/validations/courseContent";
import toast, { Toaster } from "react-hot-toast";

interface QuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: number;
  text: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE" | "TRUE_FALSE" | "TEXT_ANSWER";
  order: number;
  points: number;
  options: QuestionOption[];
}

interface Quiz {
  id?: number;
  timeLimit?: number;
  passingScore: number;
  questions: Question[];
}

interface Video {
  id?: number;
  url: string;
  duration: number;
  thumbnail?: string;
}

interface PdfDocument {
  id?: number;
  url: string;
  pages?: number;
}

interface ContentItem {
  id?: number;
  title: string;
  description?: string;
  order: number;
  type: "VIDEO" | "PDF" | "QUIZ";
  video?: Video;
  pdf?: PdfDocument;
  quiz?: Quiz;
}

interface Section {
  id?: number;
  title: string;
  description?: string;
  order: number;
  contents: ContentItem[];
}

interface FormData {
  sections: Section[];
}

interface CourseContentFormProps {
  courseId: string;
  existingSections?: any[];
}

// Helper function to transform server sections to form format
function transformSectionsForForm(serverSections: any[]): Section[] {
  if (!serverSections || serverSections.length === 0) {
    return [
      {
        title: "Section 1",
        description: "",
        order: 1,
        contents: [],
      },
    ];
  }

  return serverSections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description || "",
    order: section.order,
    contents: (section.contents || []).map((content: any) => ({
      id: content.id,
      title: content.title,
      description: content.description || "",
      order: content.order,
      type: content.type,
      video: content.video
        ? {
          id: content.video.id,
          url: content.video.url,
          duration: content.video.duration,
          thumbnail: content.video.thumbnail || "",
        }
        : undefined,
      pdf: content.pdf
        ? {
          id: content.pdf.id,
          url: content.pdf.url,
          pages: content.pdf.pages,
        }
        : undefined,
      quiz: content.quiz
        ? {
          id: content.quiz.id,
          timeLimit: content.quiz.timeLimit,
          passingScore: content.quiz.passingScore,
          questions: (content.quiz.questions || []).map((q: any) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            order: q.order,
            points: q.points,
            options: (q.options || []).map((opt: any) => ({
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          })),
        }
        : undefined,
    })),
  }));
}

export default function CourseContentForm({ courseId, existingSections = [] }: CourseContentFormProps) {
  const [currentOpenItem, setCurrentOpenItem] = useState<string>("");
  const [activeContentForm, setActiveContentForm] = useState<string>(""); // "sectionIndex-contentIndex"
  const [editingSection, setEditingSection] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    sections: transformSectionsForForm(existingSections),
  });

  const addSection = () => {
    setFormData((prev) => ({
      sections: [
        ...prev.sections,
        {
          title: `Section ${prev.sections.length + 1}`,
          description: "",
          order: prev.sections.length + 1,
          contents: [],
        },
      ],
    }));
  };

  const updateSection = (
    sectionIndex: number,
    field: keyof Section,
    value: any
  ) => {
    setFormData((prev) => ({
      sections: prev.sections.map((section, i) =>
        i === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  };

  const deleteSection = (sectionIndex: number) => {
    const section = formData.sections[sectionIndex];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${section.title}"? This will also delete all content items in this section.`
    );

    if (confirmDelete) {
      setFormData((prev) => ({
        sections: prev.sections
          .filter((_, i) => i !== sectionIndex)
          .map((section, i) => ({ ...section, order: i + 1 })),
      }));
      setCurrentOpenItem("");
      setActiveContentForm("");
      toast.success(`Section "${section.title}" has been deleted`);
    }
  };

  const addContentItem = (
    sectionIndex: number,
    type: "VIDEO" | "PDF" | "QUIZ"
  ) => {
    const section = formData.sections[sectionIndex];
    const newContent: ContentItem = {
      title: `New ${type.toLowerCase()}`,
      description: "",
      order: section.contents.length + 1,
      type,
      ...(type === "VIDEO" && {
        video: { url: "", duration: 0, thumbnail: "" },
      }),
      ...(type === "PDF" && {
        pdf: { url: "", pages: 0 },
      }),
      ...(type === "QUIZ" && {
        quiz: {
          timeLimit: 30,
          passingScore: 70,
          questions: [],
        },
      }),
    };

    updateSection(sectionIndex, "contents", [...section.contents, newContent]);
    setActiveContentForm(`${sectionIndex}-${section.contents.length}`);
    toast.success(`${type.toLowerCase()} content item added`);
  };

  const updateContentItem = (
    sectionIndex: number,
    contentIndex: number,
    field: keyof ContentItem,
    value: any
  ) => {
    const section = formData.sections[sectionIndex];
    const updatedContents = section.contents.map((content, i) =>
      i === contentIndex ? { ...content, [field]: value } : content
    );
    updateSection(sectionIndex, "contents", updatedContents);
  };

  const deleteContentItem = (sectionIndex: number, contentIndex: number) => {
    const content = formData.sections[sectionIndex].contents[contentIndex];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${content.title}"?`
    );

    if (confirmDelete) {
      const section = formData.sections[sectionIndex];
      const updatedContents = section.contents
        .filter((_, i) => i !== contentIndex)
        .map((content, i) => ({ ...content, order: i + 1 }));
      updateSection(sectionIndex, "contents", updatedContents);
      setActiveContentForm("");
      toast.success(`Content item "${content.title}" has been deleted`);
    }
  };

  const addQuestion = (sectionIndex: number, contentIndex: number) => {
    const content = formData.sections[sectionIndex].contents[contentIndex];
    if (content.quiz) {
      const newQuestion: Question = {
        text: "New question",
        type: "MULTIPLE_CHOICE",
        order: content.quiz.questions.length + 1,
        points: 1,
        options: [
          { text: "Option 1", isCorrect: true },
          { text: "Option 2", isCorrect: false },
        ],
      };

      const updatedQuiz = {
        ...content.quiz,
        questions: [...content.quiz.questions, newQuestion],
      };

      updateContentItem(sectionIndex, contentIndex, "quiz", updatedQuiz);
      toast.success("Question added to quiz");
    }
  };

  const updateQuestion = (
    sectionIndex: number,
    contentIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: any
  ) => {
    const content = formData.sections[sectionIndex].contents[contentIndex];
    if (content.quiz) {
      const updatedQuestions = content.quiz.questions.map((question, i) =>
        i === questionIndex ? { ...question, [field]: value } : question
      );

      const updatedQuiz = {
        ...content.quiz,
        questions: updatedQuestions,
      };

      updateContentItem(sectionIndex, contentIndex, "quiz", updatedQuiz);
    }
  };

  const addOption = (
    sectionIndex: number,
    contentIndex: number,
    questionIndex: number
  ) => {
    const content = formData.sections[sectionIndex].contents[contentIndex];
    if (content.quiz) {
      const question = content.quiz.questions[questionIndex];
      const newOption: QuestionOption = {
        text: `Option ${question.options.length + 1}`,
        isCorrect: false,
      };

      const updatedOptions = [...question.options, newOption];
      updateQuestion(
        sectionIndex,
        contentIndex,
        questionIndex,
        "options",
        updatedOptions
      );
    }
  };

  const updateOption = (
    sectionIndex: number,
    contentIndex: number,
    questionIndex: number,
    optionIndex: number,
    field: keyof QuestionOption,
    value: any
  ) => {
    const content = formData.sections[sectionIndex].contents[contentIndex];
    if (content.quiz) {
      const question = content.quiz.questions[questionIndex];
      const updatedOptions = question.options.map((option, i) =>
        i === optionIndex ? { ...option, [field]: value } : option
      );

      updateQuestion(
        sectionIndex,
        contentIndex,
        questionIndex,
        "options",
        updatedOptions
      );
    }
  };

  const handleSubmit = async () => {
    // Enhanced client-side validation using Zod
    const validation = validateCourseContent({
      courseId: parseInt(courseId),
      sections: formData.sections,
    });

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        toast.error(error, { duration: 5000 });
      });
      return;
    }

    const loadingToast = toast.loading("Saving course content...");

    try {
      const response = await fetch("/api/course-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: parseInt(courseId),
          sections: formData.sections,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Course content saved successfully! Created ${data.data.sectionsCreated} sections with ${data.data.totalLessons} lessons.`,
          { duration: 4000 }
        );
        // Optionally reset form or redirect
        // setFormData({ sections: [{ title: "Section 1", description: "", order: 1, contents: [] }] });
      } else {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          data.details.forEach((detail: any) => {
            toast.error(`${detail.field}: ${detail.message}`, {
              duration: 5000,
            });
          });
        } else {
          toast.error(data.error || "Failed to save course content");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all course content? This action cannot be undone."
    );

    if (confirmReset) {
      setFormData({
        sections: [
          {
            title: "Section 1",
            description: "",
            order: 1,
            contents: [],
          },
        ],
      });
      setCurrentOpenItem("");
      setActiveContentForm("");
      setEditingSection(null);
      toast.success("Course content has been reset");
    }
  };

  return (
    <div className="py-30 px-30">
      {/* <Toaster position="top-right" /> */}
      {formData.sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className={`row ${sectionIndex != 0 ? "pt-30" : ""}`}
        >
          <div className="col-12">
            <div className="accordion -block-2 text-left js-accordion">
              <div
                className={`accordion__item -dark-bg-dark-1 mt-10 ${currentOpenItem == `${sectionIndex}` ? "is-active" : ""
                  }`}
              >
                <input type="hidden" name="courseId" value={courseId} />
                <div
                  className="accordion__button py-20 px-30 bg-light-4"
                  onClick={() =>
                    setCurrentOpenItem((pre) =>
                      pre == `${sectionIndex}` ? "" : `${sectionIndex}`
                    )
                  }
                >
                  <div className="d-flex items-center">
                    <div className="icon icon-drag mr-10"></div>
                    {editingSection === sectionIndex ? (
                      <div className="d-flex items-center x-gap-10">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(sectionIndex, "title", e.target.value)
                          }
                          className="text-16 lh-14 fw-500 text-dark-1 border-0 bg-transparent"
                          placeholder="Section title"
                          onClick={(e) => e.stopPropagation()}
                          onBlur={() => setEditingSection(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setEditingSection(null);
                            }
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className="text-16 lh-14 fw-500 text-dark-1">
                        {section.title}
                      </span>
                    )}
                  </div>

                  <div className="d-flex x-gap-10 items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSection(sectionIndex);
                      }}
                      className="icon icon-edit mr-5"
                      type="button"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(sectionIndex);
                      }}
                      className="icon icon-bin"
                      type="button"
                    />
                    <div className="accordion__icon mr-0">
                      <div className="d-flex items-center justify-center icon icon-chevron-down"></div>
                      <div className="d-flex items-center justify-center icon icon-chevron-up"></div>
                    </div>
                  </div>
                </div>

                <div
                  className="accordion__content"
                  style={
                    currentOpenItem == `${sectionIndex}`
                      ? { maxHeight: "none" }
                      : {}
                  }
                >
                  <div className="accordion__content__inner px-30 py-30">
                    {/* Section Description */}
                    <div className="row mb-30 contact-form-class">
                      <div className="col-12">
                        <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                          Section Description (Optional)
                        </label>
                        <textarea
                          value={section.description || ""}
                          onChange={(e) =>
                            updateSection(
                              sectionIndex,
                              "description",
                              e.target.value
                            )
                          }
                          className="form-control"
                          rows={2}
                          placeholder="Enter section description"
                        />
                      </div>
                    </div>

                    {/* Add Content Buttons */}
                    <div className="d-flex x-gap-10 y-gap-10 flex-wrap mb-30">
                      <button
                        onClick={() => addContentItem(sectionIndex, "VIDEO")}
                        className="button -sm py-15 -purple-3 text-purple-1 fw-500 mr-20"
                        type="button"
                      >
                        Add Video +
                      </button>
                      <button
                        onClick={() => addContentItem(sectionIndex, "PDF")}
                        className="button -sm py-15 -purple-3 text-purple-1 fw-500 mr-20"
                        type="button"
                      >
                        Add PDF +
                      </button>
                      <button
                        onClick={() => addContentItem(sectionIndex, "QUIZ")}
                        className="button -sm py-15 -purple-3 text-purple-1 fw-500"
                        type="button"
                      >
                        Add Quiz +
                      </button>
                    </div>

                    {/* Content Items List */}
                    {section.contents.length > 0 && (
                      <div className="row">
                        <div className="col-12">
                          <h5 className="text-16 lh-1 fw-500 mb-20">
                            Content Items
                          </h5>
                          {section.contents.map((content, contentIndex) => (
                            <div
                              key={contentIndex}
                              className="border-light p-20 mb-15"
                            >
                              <div className="d-flex items-center justify-between mb-15">
                                <div className="d-flex items-center x-gap-10">
                                  <span className="text-14 fw-500 text-dark-1">
                                    {content.title} ({content.type})
                                  </span>
                                  <span className="text-12 text-light-1">
                                    Order: {content.order}
                                  </span>
                                </div>
                                <div className="d-flex x-gap-10 items-center">
                                  <button
                                    onClick={() => {
                                      const formKey = `${sectionIndex}-${contentIndex}`;
                                      setActiveContentForm(
                                        activeContentForm === formKey
                                          ? ""
                                          : formKey
                                      );
                                    }}
                                    className="button -xs py-10 -outline-purple-1 text-purple-1 fw-500"
                                    type="button"
                                  >
                                    {activeContentForm ===
                                      `${sectionIndex}-${contentIndex}`
                                      ? "Hide Form"
                                      : "Edit"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteContentItem(
                                        sectionIndex,
                                        contentIndex
                                      )
                                    }
                                    className="icon icon-bin text-red-1"
                                    type="button"
                                  />
                                </div>
                              </div>

                              {/* Content Item Form */}
                              {activeContentForm ===
                                `${sectionIndex}-${contentIndex}` && (
                                  <div className="bg-light-6 p-20 border-light">
                                    <div className="row y-gap-20 contact-form-class">
                                      <div className="col-12">
                                        <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                          Content Title
                                        </label>
                                        <input
                                          type="text"
                                          value={content.title}
                                          onChange={(e) =>
                                            updateContentItem(
                                              sectionIndex,
                                              contentIndex,
                                              "title",
                                              e.target.value
                                            )
                                          }
                                          className="form-control"
                                          placeholder="Enter content title"
                                        />
                                      </div>

                                      <div className="col-12">
                                        <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                          Description (Optional)
                                        </label>
                                        <textarea
                                          value={content.description || ""}
                                          onChange={(e) =>
                                            updateContentItem(
                                              sectionIndex,
                                              contentIndex,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                          className="form-control"
                                          rows={2}
                                          placeholder="Enter content description"
                                        />
                                      </div>

                                      {content.type === "VIDEO" &&
                                        content.video && (
                                          <>
                                            <div className="col-md-6">
                                              <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                                Video URL
                                              </label>
                                              <input
                                                type="url"
                                                value={content.video.url}
                                                onChange={(e) =>
                                                  updateContentItem(
                                                    sectionIndex,
                                                    contentIndex,
                                                    "video",
                                                    {
                                                      ...content.video,
                                                      url: e.target.value,
                                                    }
                                                  )
                                                }
                                                className="form-control"
                                                placeholder="https://youtube.com/watch?v=..."
                                              />
                                            </div>
                                            <div className="col-md-6">
                                              <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                                Duration (seconds)
                                              </label>
                                              <input
                                                type="number"
                                                value={content.video.duration}
                                                onChange={(e) =>
                                                  updateContentItem(
                                                    sectionIndex,
                                                    contentIndex,
                                                    "video",
                                                    {
                                                      ...content.video,
                                                      duration:
                                                        parseInt(
                                                          e.target.value
                                                        ) || 0,
                                                    }
                                                  )
                                                }
                                                className="form-control"
                                                placeholder="Enter duration in seconds"
                                              />
                                            </div>
                                            <div className="col-12">
                                              <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                                Thumbnail URL (Optional)
                                              </label>
                                              <input
                                                type="url"
                                                value={
                                                  content.video.thumbnail || ""
                                                }
                                                onChange={(e) =>
                                                  updateContentItem(
                                                    sectionIndex,
                                                    contentIndex,
                                                    "video",
                                                    {
                                                      ...content.video,
                                                      thumbnail: e.target.value,
                                                    }
                                                  )
                                                }
                                                className="form-control"
                                                placeholder="https://example.com/thumbnail.jpg"
                                              />
                                            </div>
                                          </>
                                        )}

                                      {content.type === "PDF" && content.pdf && (
                                        <>
                                          <div className="col-md-8">
                                            <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                              PDF URL
                                            </label>
                                            <input
                                              type="url"
                                              value={content.pdf.url}
                                              onChange={(e) =>
                                                updateContentItem(
                                                  sectionIndex,
                                                  contentIndex,
                                                  "pdf",
                                                  {
                                                    ...content.pdf,
                                                    url: e.target.value,
                                                  }
                                                )
                                              }
                                              className="form-control"
                                              placeholder="https://example.com/document.pdf"
                                            />
                                          </div>
                                          <div className="col-md-4">
                                            <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                              Number of Pages (Optional)
                                            </label>
                                            <input
                                              type="number"
                                              value={content.pdf.pages || ""}
                                              onChange={(e) =>
                                                updateContentItem(
                                                  sectionIndex,
                                                  contentIndex,
                                                  "pdf",
                                                  {
                                                    ...content.pdf,
                                                    pages:
                                                      parseInt(e.target.value) ||
                                                      undefined,
                                                  }
                                                )
                                              }
                                              className="form-control"
                                              placeholder="Enter page count"
                                            />
                                          </div>
                                        </>
                                      )}

                                      {content.type === "QUIZ" &&
                                        content.quiz && (
                                          <>
                                            <div className="col-md-6">
                                              <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                                Time Limit (minutes)
                                              </label>
                                              <input
                                                type="number"
                                                value={
                                                  content.quiz.timeLimit || ""
                                                }
                                                onChange={(e) =>
                                                  updateContentItem(
                                                    sectionIndex,
                                                    contentIndex,
                                                    "quiz",
                                                    {
                                                      ...content.quiz,
                                                      timeLimit:
                                                        parseInt(
                                                          e.target.value
                                                        ) || undefined,
                                                    }
                                                  )
                                                }
                                                className="form-control"
                                                placeholder="Leave empty for no limit"
                                              />
                                            </div>
                                            <div className="col-md-6">
                                              <label className="text-14 lh-1 fw-500 text-dark-1 mb-10">
                                                Passing Score (%)
                                              </label>
                                              <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={content.quiz.passingScore}
                                                onChange={(e) =>
                                                  updateContentItem(
                                                    sectionIndex,
                                                    contentIndex,
                                                    "quiz",
                                                    {
                                                      ...content.quiz,
                                                      passingScore:
                                                        parseInt(
                                                          e.target.value
                                                        ) || 70,
                                                    }
                                                  )
                                                }
                                                className="form-control"
                                                placeholder="70"
                                              />
                                            </div>

                                            <div className="col-12">
                                              <div className="d-flex items-center justify-between mb-15">
                                                <label className="text-14 lh-1 fw-500 text-dark-1">
                                                  Questions
                                                </label>
                                                <button
                                                  onClick={() =>
                                                    addQuestion(
                                                      sectionIndex,
                                                      contentIndex
                                                    )
                                                  }
                                                  className="button -xs py-10 -purple-3 text-purple-1 fw-500"
                                                  type="button"
                                                >
                                                  Add Question +
                                                </button>
                                              </div>

                                              {content.quiz.questions.map(
                                                (question, questionIndex) => (
                                                  <div
                                                    key={questionIndex}
                                                    className="border-light p-15 mb-15 bg-white"
                                                  >
                                                    <div className="row y-gap-15 p-10">
                                                      <div className="col-md-8">
                                                        <label className="text-12 lh-1 fw-500 text-dark-1 mb-5">
                                                          Question Text
                                                        </label>
                                                        <input
                                                          type="text"
                                                          value={question.text}
                                                          onChange={(e) =>
                                                            updateQuestion(
                                                              sectionIndex,
                                                              contentIndex,
                                                              questionIndex,
                                                              "text",
                                                              e.target.value
                                                            )
                                                          }
                                                          className="form-control"
                                                          placeholder="Enter question"
                                                        />
                                                      </div>
                                                      <div className="col-md-2">
                                                        <label className="text-12 lh-1 fw-500 text-dark-1 mb-5">
                                                          Type
                                                        </label>
                                                        <select
                                                          value={question.type}
                                                          onChange={(e) =>
                                                            updateQuestion(
                                                              sectionIndex,
                                                              contentIndex,
                                                              questionIndex,
                                                              "type",
                                                              e.target.value
                                                            )
                                                          }
                                                          className="form-control"
                                                        >
                                                          <option value="MULTIPLE_CHOICE">
                                                            Multiple Choice
                                                          </option>
                                                          <option value="SINGLE_CHOICE">
                                                            Single Choice
                                                          </option>
                                                          <option value="TRUE_FALSE">
                                                            True/False
                                                          </option>
                                                          <option value="TEXT_ANSWER">
                                                            Text Answer
                                                          </option>
                                                        </select>
                                                      </div>
                                                      <div className="col-md-2">
                                                        <label className="text-12 lh-1 fw-500 text-dark-1 mb-5">
                                                          Points
                                                        </label>
                                                        <input
                                                          type="number"
                                                          min="1"
                                                          value={question.points}
                                                          onChange={(e) =>
                                                            updateQuestion(
                                                              sectionIndex,
                                                              contentIndex,
                                                              questionIndex,
                                                              "points",
                                                              parseInt(
                                                                e.target.value
                                                              ) || 1
                                                            )
                                                          }
                                                          className="form-control"
                                                        />
                                                      </div>

                                                      {(question.type ===
                                                        "MULTIPLE_CHOICE" ||
                                                        question.type ===
                                                        "SINGLE_CHOICE") && (
                                                          <div className="col-12">
                                                            <div className="d-flex items-center justify-between mb-10">
                                                              <label className="text-12 lh-1 fw-500 text-dark-1">
                                                                Options
                                                              </label>
                                                              <button
                                                                onClick={() =>
                                                                  addOption(
                                                                    sectionIndex,
                                                                    contentIndex,
                                                                    questionIndex
                                                                  )
                                                                }
                                                                className="button -xs py-5 -purple-3 text-purple-1 fw-500"
                                                                type="button"
                                                              >
                                                                Add Option +
                                                              </button>
                                                            </div>
                                                            {question.options.map(
                                                              (
                                                                option,
                                                                optionIndex
                                                              ) => (
                                                                <div
                                                                  key={optionIndex}
                                                                  className="d-flex items-center x-gap-10 mb-10"
                                                                >
                                                                  <input
                                                                    type={
                                                                      question.type ===
                                                                        "MULTIPLE_CHOICE"
                                                                        ? "checkbox"
                                                                        : "radio"
                                                                    }
                                                                    name={`question_${questionIndex}_correct`}
                                                                    checked={
                                                                      option.isCorrect
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) => {
                                                                      if (
                                                                        question.type ===
                                                                        "SINGLE_CHOICE"
                                                                      ) {
                                                                        const updatedOptions =
                                                                          question.options.map(
                                                                            (
                                                                              opt,
                                                                              i
                                                                            ) => ({
                                                                              ...opt,
                                                                              isCorrect:
                                                                                i ===
                                                                                  optionIndex
                                                                                  ? e
                                                                                    .target
                                                                                    .checked
                                                                                  : false,
                                                                            })
                                                                          );
                                                                        updateQuestion(
                                                                          sectionIndex,
                                                                          contentIndex,
                                                                          questionIndex,
                                                                          "options",
                                                                          updatedOptions
                                                                        );
                                                                      } else {
                                                                        updateOption(
                                                                          sectionIndex,
                                                                          contentIndex,
                                                                          questionIndex,
                                                                          optionIndex,
                                                                          "isCorrect",
                                                                          e.target
                                                                            .checked
                                                                        );
                                                                      }
                                                                    }}
                                                                    className="form-check-input"
                                                                  />
                                                                  <input
                                                                    type="text"
                                                                    value={
                                                                      option.text
                                                                    }
                                                                    onChange={(e) =>
                                                                      updateOption(
                                                                        sectionIndex,
                                                                        contentIndex,
                                                                        questionIndex,
                                                                        optionIndex,
                                                                        "text",
                                                                        e.target
                                                                          .value
                                                                      )
                                                                    }
                                                                    className="form-control"
                                                                    placeholder={`Option ${optionIndex +
                                                                      1
                                                                      }`}
                                                                  />
                                                                </div>
                                                              )
                                                            )}
                                                          </div>
                                                        )}

                                                      {question.type ===
                                                        "TRUE_FALSE" && (
                                                          <div className="col-12">
                                                            <label className="text-12 lh-1 fw-500 text-dark-1 mb-5">
                                                              Correct Answer
                                                            </label>
                                                            <select
                                                              value={
                                                                question.options[0]
                                                                  ?.isCorrect
                                                                  ? "true"
                                                                  : "false"
                                                              }
                                                              onChange={(e) =>
                                                                updateQuestion(
                                                                  sectionIndex,
                                                                  contentIndex,
                                                                  questionIndex,
                                                                  "options",
                                                                  [
                                                                    {
                                                                      text: "True",
                                                                      isCorrect:
                                                                        e.target
                                                                          .value ===
                                                                        "true",
                                                                    },
                                                                    {
                                                                      text: "False",
                                                                      isCorrect:
                                                                        e.target
                                                                          .value ===
                                                                        "false",
                                                                    },
                                                                  ]
                                                                )
                                                              }
                                                              className="form-control"
                                                            >
                                                              <option value="true">
                                                                True
                                                              </option>
                                                              <option value="false">
                                                                False
                                                              </option>
                                                            </select>
                                                          </div>
                                                        )}

                                                      {question.type ===
                                                        "TEXT_ANSWER" && (
                                                          <div className="col-12">
                                                            <label className="text-12 lh-1 fw-500 text-dark-1 mb-5">
                                                              Correct Answer
                                                            </label>
                                                            <input
                                                              type="text"
                                                              onChange={(e) =>
                                                                updateQuestion(
                                                                  sectionIndex,
                                                                  contentIndex,
                                                                  questionIndex,
                                                                  "text",
                                                                  e.target.value
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </>
                                        )}

                                      <div className="col-12">
                                        <button
                                          onClick={() => setActiveContentForm("")}
                                          className="button -sm py-10 -outline-purple-1 text-purple-1 fw-500"
                                          type="button"
                                        >
                                          Save Content Item
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="row pt-30">
        <div className="col-12">
          <button
            onClick={addSection}
            className="button -md -outline-purple-1 text-purple-1"
            type="button"
          >
            Add New Section +
          </button>
        </div>
      </div>

      <div className="row y-gap-20 justify-between pt-30">
        <div className="col-auto sm:w-1/1">
          <button
            onClick={handleReset}
            className="button -md -outline-purple-1 text-purple-1 sm:w-1/1"
            type="button"
          >
            Reset
          </button>
        </div>

        <div className="col-auto sm:w-1/1">
          <button
            onClick={handleSubmit}
            className="button -md -purple-1 text-white sm:w-1/1"
            type="button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
