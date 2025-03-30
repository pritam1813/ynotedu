"use client";

import React, { useState } from "react";
import Curriculum from "./Curriculum";
import FileUploader from "./FileUploader";
import CreateCourseForm from "./CreateCourseForm";
import type { Category } from "@prisma/client";
import { Toaster } from "react-hot-toast";

interface AddCourseProps {
  categories: Category[];
  instructorId: string;
}

export default function AddCourse({
  categories,
  instructorId,
}: AddCourseProps) {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [thumbnail, setThumbnail] = useState("");

  const handleThumbnailUploaded = (url: string) => {
    setThumbnail(url);
  };

  const handleCourseCreated = (id: number) => {
    setCourseId(id);
    setStep(2);
  };

  return (
    <div className="dashboard__main">
      <Toaster position="top-right" />
      <div className="dashboard__content bg-light-4">
        <div className="row pb-50 mb-10">
          <div className="col-auto">
            <h1 className="text-30 lh-12 fw-700">Create New Course</h1>
            <div className="mt-10">
              Fill in the course details and build your curriculum
            </div>
          </div>
        </div>

        <div className="row y-gap-60">
          {/* Step navigation */}
          <div className="col-12">
            <div className="d-flex x-gap-30 items-center">
              <div
                className={`d-flex items-center py-10 px-20 rounded-8 ${
                  step === 1 ? "bg-purple-1 text-white" : "bg-white"
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => courseId && setStep(1)}
              >
                <div className="size-30 rounded-full d-flex justify-center items-center bg-white text-purple-1 mr-10">
                  1
                </div>
                <div>Basic Information</div>
              </div>
              <div
                className={`d-flex items-center py-10 px-20 rounded-8 ${
                  step === 2 ? "bg-purple-1 text-white" : "bg-white"
                }`}
                style={{
                  cursor: courseId ? "pointer" : "not-allowed",
                  opacity: courseId ? "1" : "0.7",
                }}
              >
                <div className="size-30 rounded-full d-flex justify-center items-center bg-white text-purple-1 mr-10">
                  2
                </div>
                <div>Curriculum</div>
              </div>
              <div
                className={`d-flex items-center py-10 px-20 rounded-8 ${
                  step === 3 ? "bg-purple-1 text-white" : "bg-white"
                }`}
                style={{
                  cursor: courseId ? "pointer" : "not-allowed",
                  opacity: courseId ? "1" : "0.7",
                }}
                onClick={() => courseId && setStep(3)}
              >
                <div className="size-30 rounded-full d-flex justify-center items-center bg-white text-purple-1 mr-10">
                  3
                </div>
                <div>Media</div>
              </div>
            </div>
          </div>

          {/* Step content */}
          {step === 1 && (
            <div className="col-12">
              <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
                <div className="d-flex items-center py-20 px-30 border-bottom-light">
                  <h2 className="text-17 lh-1 fw-500">Basic Information</h2>
                </div>

                <div className="py-30 px-30">
                  <CreateCourseForm
                    AvailableCategories={categories}
                    Instructor={instructorId}
                    onSuccess={handleCourseCreated}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && courseId && (
            <div className="col-12">
              <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
                <div className="d-flex items-center py-20 px-30 border-bottom-light">
                  <h2 className="text-17 lh-1 fw-500">Curriculum</h2>
                </div>

                <Curriculum courseId={courseId} />
              </div>

              <div className="row y-gap-20 justify-between pt-30">
                <div className="col-auto">
                  <button
                    className="button -md -outline-purple-1 text-purple-1"
                    onClick={() => setStep(1)}
                  >
                    Back to Details
                  </button>
                </div>

                <div className="col-auto">
                  <button
                    className="button -md -purple-1 text-white"
                    onClick={() => setStep(3)}
                  >
                    Continue to Media
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <FileUploader onThumbnailUploaded={handleThumbnailUploaded} />
          )}
        </div>
      </div>
    </div>
  );
}
