"use client";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader({
  onThumbnailUploaded,
}: {
  onThumbnailUploaded?: (url: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  }

  async function handleImageUpload() {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        toast.success("File uploaded successfully");

        // If callback exists, pass the URL back
        if (onThumbnailUploaded) {
          onThumbnailUploaded(data.url);
        }
      } else {
        setStatus("error");
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      setStatus("error");
      toast.error("Failed to upload file");
      console.error(error);
    }
  }

  function handleClearImage() {
    setFile(null);
    setImageUrl("");
    setStatus("idle");
    if (onThumbnailUploaded) {
      onThumbnailUploaded("");
    }
  }

  return (
    <div className="col-12">
      <div className="rounded-16 bg-white -dark-bg-dark-1 shadow-4 h-100">
        <div className="d-flex items-center py-20 px-30 border-bottom-light">
          <h2 className="text-17 lh-1 fw-500">Media</h2>
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
                    src={
                      imageUrl || "/assets/img/general/upload-placeholder.png"
                    }
                    alt="course thumbnail"
                  />

                  {imageUrl && (
                    <div className="absolute-full-center d-flex justify-end py-20 px-20">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={handleClearImage}
                        className="d-flex justify-center items-center bg-white size-40 rounded-8 shadow-1"
                      >
                        <i className="icon-bin text-16"></i>
                      </span>
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
                        placeholder="Choose a file..."
                        value={file ? file.name : ""}
                        readOnly
                      />
                      {!file ? (
                        <button
                          type="button"
                          className="button -dark-3 text-white"
                        >
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="imageUpload1"
                          >
                            Upload Files
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
                          className="button -dark-3 text-white"
                          onClick={handleImageUpload}
                          disabled={status === "uploading"}
                        >
                          {status === "uploading" ? "Uploading..." : "Upload"}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-10">
                    Upload your course image here. It must meet our course image
                    quality standards to be accepted. Important guidelines:
                    750x440 pixels; .jpg, .jpeg,. gif, or .png. no text on the
                    image.
                  </p>

                  {status === "success" && (
                    <p className="text-success mt-10">
                      File Uploaded Successfully
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-danger mt-10">File Upload Error</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12">
              <form
                // onSubmit={handleSubmit}
                className="contact-form d-flex lg:flex-column"
              >
                <div
                  className="relative shrink-0"
                  //   style={
                  //     previewVideo
                  //       ? {}
                  //       : { backgroundColor: "#f2f3f4", width: 250, height: 200 }
                  //   }
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
                    src={mediaUpload[1].imgSrc}
                    alt="image"
                  />

                  <div className="absolute-full-center d-flex justify-end py-20 px-20">
                    <span
                      style={{ cursor: "pointer" }}
                      //   onClick={() => {
                      //     document.getElementById("imageUpload2").value = "";
                      //     setPreviewVideo("");
                      //   }}
                      className="d-flex justify-center items-center bg-white size-40 rounded-8 shadow-1"
                    >
                      <i className="icon-bin text-16"></i>
                    </span>
                  </div>
                </div>

                <div className="w-1/1 ml-30 lg:ml-0 lg:mt-20">
                  <div className="form-upload col-12">
                    <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                      Video URL*
                    </label>
                    <div className="form-upload__wrap">
                      <input
                        required
                        type="text"
                        name="name"
                        placeholder={"Video-1.mp3"}
                      />
                      <button className="button -dark-3 text-white">
                        <label
                          style={{ cursor: "pointer" }}
                          htmlFor="imageUpload2"
                        >
                          Upload Files
                        </label>
                        <input
                          required
                          id="imageUpload2"
                          type="file"
                          accept="image/*"
                          //   onChange={handleVideoChange}
                          style={{ display: "none" }}
                        />
                      </button>
                    </div>
                  </div>

                  <p className="mt-10">
                    {
                      "Enter a valid video URL. Students who watch a well-made promo video are 5X more likely to enroll in your course."
                    }
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="row y-gap-20 justify-between pt-30">
            <div className="col-auto">
              <button className="button -md -outline-purple-1 text-purple-1">
                Prev
              </button>
            </div>

            <div className="col-auto">
              <button className="button -md -purple-1 text-white">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
