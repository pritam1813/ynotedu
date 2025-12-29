"use client";
import React, { ChangeEvent, useState } from "react";
import { mediaUpload } from "@/data/dashboard";
import Image from "next/image";
import toast from "react-hot-toast";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FileUploaderProps {
  courseId: string;
  existingThumbnail?: string;
}

export default function FileUploader({ courseId, existingThumbnail = "" }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(existingThumbnail);
  const [status, setStatus] = useState<UploadStatus>(existingThumbnail ? "success" : "idle");

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      setStatus("idle");
    }
  }

  async function handleClearImage() {
    // If there's an existing thumbnail (from server), delete it
    if (existingThumbnail && imageUrl === existingThumbnail) {
      try {
        setStatus("uploading");
        const response = await fetch(`/api/courses/${courseId}/thumbnail`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Thumbnail deleted successfully");
        } else {
          toast.error("Failed to delete thumbnail from server");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting thumbnail");
      }
    }

    // Clear local state
    setFile(null);
    setImageUrl("");
    setStatus("idle");
    // Reset the file input
    const fileInput = document.getElementById("imageUpload1") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function handleImageUpload() {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }

    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/courses/${courseId}/thumbnail`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        toast.success("Thumbnail uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setStatus("error");
      toast.error("Failed to upload thumbnail. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className="col-12">
      <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
        <div className="d-flex items-center py-20 px-30 border-bottom-light">
          <h2 className="text-17 lh-1 fw-500">
            <span className="text-purple-1 mr-10">3.</span>
            Media
          </h2>
          {status === "success" && (
            <span className="ml-auto text-green-1 text-14">✓ Uploaded</span>
          )}
        </div>

        <div className="py-30 px-30">
          <div className="row y-gap-50">
            <div className="col-12">
              <div className="contact-form d-flex lg:flex-column">
                <div
                  className="relative shrink-0"
                  style={
                    imageUrl
                      ? {}
                      : { backgroundColor: "#f2f3f4", width: 250, height: 200 }
                  }
                >
                  <Image
                    width={735}
                    height={612}
                    className="w-1/1"
                    style={{
                      width: "250px",
                      height: "200px",
                      objectFit: "contain",
                    }}
                    src={imageUrl || mediaUpload[0].imgSrc}
                    alt="Course thumbnail"
                  />

                  {imageUrl && (
                    <div className="absolute-full-center d-flex justify-end py-20 px-20">
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="d-flex justify-center items-center bg-white size-40 rounded-8 shadow-1"
                        style={{ cursor: "pointer", border: "none" }}
                      >
                        <i className="icon-bin text-16"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-1/1 ml-30 lg:ml-0 lg:mt-20">
                  <div className="form-upload col-12">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Course thumbnail*
                    </label>
                    <div className="form-upload__wrap">
                      <input
                        style={{
                          border: 0,
                          outline: "none",
                          width: "100%",
                          backgroundColor: "transparent",
                          borderRadius: "8px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "#DDDDDD",
                          lineHeight: "1.5",
                          padding: "15px 22px",
                        }}
                        type="text"
                        name="name"
                        placeholder={"Select an image..."}
                        value={file ? file.name : ""}
                        readOnly
                      />
                      {!file ? (
                        <button type="button" className="button -dark-3 text-white">
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="imageUpload1"
                          >
                            Browse
                          </label>
                          <input
                            name="CourseThumbnail"
                            id="imageUpload1"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={status === "uploading"}
                          className="button -purple-1 text-white"
                        >
                          {status === "uploading" ? "Uploading..." : "Upload"}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-10 text-light-1">
                    Upload your course thumbnail. Recommended: 750x440 pixels,
                    .jpg, .jpeg, .gif, or .png format.
                  </p>

                  {status === "success" && (
                    <p className="text-green-1 mt-10 fw-500">
                      ✓ Thumbnail uploaded successfully!
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-red-1 mt-10 fw-500">
                      ✗ Upload failed. Please try again.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

