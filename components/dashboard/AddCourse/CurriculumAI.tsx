"use client";

import React, { useState } from "react";
import { addSection, addContentItem } from "@/app/actions/courseActions";
import { toast } from "react-hot-toast";
import ContentUploader from "./ContentUploader";

interface Section {
  id: number;
  title: string;
  description?: string;
  contents: ContentItem[];
}

interface ContentItem {
  id: number;
  title: string;
  type: "VIDEO" | "PDF" | "QUIZ";
}

export default function Curriculum({ courseId }: { courseId?: number }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentOpenItem, setCurrentOpenItem] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [contentType, setContentType] = useState<"VIDEO" | "PDF" | "QUIZ">(
    "VIDEO"
  );

  async function handleAddSection() {
    if (!courseId) {
      toast.error("Please create course details first");
      return;
    }

    if (!newSectionTitle.trim()) {
      toast.error("Section title cannot be empty");
      return;
    }

    try {
      const result = await addSection(courseId, newSectionTitle);

      if (result.success) {
        toast.success("Section added successfully");
        setSections([
          ...sections,
          {
            id: result.section.id,
            title: result.section.title,
            description: result.section.description || "",
            contents: [],
          },
        ]);
        setNewSectionTitle("");
        setIsAddingSectionOpen(false);
      } else {
        toast.error(result.error || "Failed to add section");
      }
    } catch (error) {
      toast.error("Failed to add section");
      console.error(error);
    }
  }

  async function handleAddContent(
    sectionId: number,
    title: string,
    url: string,
    metadata: any
  ) {
    if (!courseId) {
      toast.error("Please create course details first");
      return;
    }

    try {
      const result = await addContentItem(sectionId, title, contentType, {
        url,
        ...metadata,
      });

      if (result.success) {
        toast.success("Content added successfully");

        // Update local state
        setSections(
          sections.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                contents: [
                  ...section.contents,
                  {
                    id: result.contentItem.id,
                    title,
                    type: contentType,
                  },
                ],
              };
            }
            return section;
          })
        );

        setIsAddingContent(false);
        setSelectedSection(null);
      } else {
        toast.error(result.error || "Failed to add content");
      }
    } catch (error) {
      toast.error("Failed to add content");
      console.error(error);
    }
  }

  return (
    <div className="py-30 px-30">
      {sections.length === 0 && !isAddingSectionOpen && courseId ? (
        <div className="text-center py-50">
          <p className="mb-10">
            No sections added yet. Start creating your course structure!
          </p>
          <button
            className="button -md -purple-1 text-white"
            onClick={() => setIsAddingSectionOpen(true)}
          >
            Add First Section
          </button>
        </div>
      ) : (
        <>
          {sections.map((section, i) => (
            <div key={section.id} className={`row ${i !== 0 ? "pt-30" : ""}`}>
              <div className="col-12">
                <h4 className="text-16 lh-1 fw-500">{section.title}</h4>
              </div>

              <div className="col-12">
                <div className="accordion -block-2 text-left js-accordion">
                  {section.contents.map((content, index) => (
                    <div
                      key={content.id}
                      className={`accordion__item -dark-bg-dark-1 mt-10 ${
                        currentOpenItem === `${section.id}-${index}`
                          ? "is-active"
                          : ""
                      }`}
                    >
                      <div
                        className="accordion__button py-20 px-30 bg-light-4"
                        onClick={() =>
                          setCurrentOpenItem((prev) =>
                            prev === `${section.id}-${index}`
                              ? null
                              : `${section.id}-${index}`
                          )
                        }
                      >
                        <div className="d-flex items-center">
                          <div className="icon icon-drag mr-10"></div>
                          <span className="text-16 lh-14 fw-500 text-dark-1">
                            {content.title}
                          </span>
                        </div>

                        <div className="d-flex x-gap-10 items-center">
                          <div className="badge -sm -dark-1 text-white mr-10">
                            {content.type}
                          </div>
                          <div className="accordion__icon mr-0">
                            <div className="d-flex items-center justify-center icon icon-chevron-down"></div>
                            <div className="d-flex items-center justify-center icon icon-chevron-up"></div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="accordion__content"
                        style={
                          currentOpenItem === `${section.id}-${index}`
                            ? { maxHeight: "100px" }
                            : {}
                        }
                      >
                        <div className="accordion__content__inner px-30 py-30">
                          <p>Content item preview will be shown here</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <button
                    className="button -sm py-15 -purple-3 text-purple-1 fw-500"
                    onClick={() => {
                      setSelectedSection(section.id);
                      setIsAddingContent(true);
                    }}
                  >
                    Add Content +
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isAddingContent && selectedSection !== null && (
            <div className="mt-30 border-light rounded-8 p-20">
              <h4 className="text-18 fw-500 mb-20">Add New Content</h4>

              <div className="mb-20">
                <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                  Content Type
                </label>
                <div className="d-flex x-gap-20">
                  <div
                    className={`button -sm ${
                      contentType === "VIDEO"
                        ? "-purple-1 text-white"
                        : "-outline-purple-1 text-purple-1"
                    }`}
                    onClick={() => setContentType("VIDEO")}
                  >
                    Video
                  </div>
                  <div
                    className={`button -sm ${
                      contentType === "PDF"
                        ? "-purple-1 text-white"
                        : "-outline-purple-1 text-purple-1"
                    }`}
                    onClick={() => setContentType("PDF")}
                  >
                    PDF
                  </div>
                  <div
                    className={`button -sm ${
                      contentType === "QUIZ"
                        ? "-purple-1 text-white"
                        : "-outline-purple-1 text-purple-1"
                    }`}
                    onClick={() => setContentType("QUIZ")}
                  >
                    Quiz
                  </div>
                </div>
              </div>

              <ContentUploader
                type={contentType}
                sectionId={selectedSection}
                onContentAdded={handleAddContent}
                onCancel={() => {
                  setIsAddingContent(false);
                  setSelectedSection(null);
                }}
              />
            </div>
          )}

          {!isAddingSectionOpen && courseId && (
            <div className="d-flex justify-center mt-30">
              <button
                className="button -md -outline-purple-1 text-purple-1"
                onClick={() => setIsAddingSectionOpen(true)}
              >
                Add New Section
              </button>
            </div>
          )}
        </>
      )}

      {isAddingSectionOpen && (
        <div className="mt-30 border-light rounded-8 p-20">
          <h4 className="text-18 fw-500 mb-20">Add New Section</h4>

          <div className="mb-20">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              Section Title*
            </label>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Enter section title"
              className="w-1/1"
            />
          </div>

          <div className="d-flex x-gap-10">
            <button
              className="button -md -purple-1 text-white"
              onClick={handleAddSection}
            >
              Add Section
            </button>
            <button
              className="button -md -outline-dark-1"
              onClick={() => {
                setIsAddingSectionOpen(false);
                setNewSectionTitle("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
