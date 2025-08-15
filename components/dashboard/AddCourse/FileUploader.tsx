"use client";
import React, { ChangeEvent, useState } from "react";
import { mediaUpload } from "@/data/dashboard";
import Image from "next/image";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader({ courseId }: { courseId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  //   const [uploadProgress, setUploadProgress] = useState(0);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      // To do
      // Upload to a image object storage bucket and get that url
    }
  }

  async function handleImageUpload() {
    if (!file) return;
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`/api/courses/${courseId}/thumbnail`, {
        method: "POST",
        body: formData,
      });

      setStatus("success");
    } catch (error) {
      setStatus("error");
      console.log(error);
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
                    mediaUpload[0].imgSrc
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
                    alt="image"
                  />

                  <div className="absolute-full-center d-flex justify-end py-20 px-20">
                    <span
                      style={{ cursor: "pointer" }}
                      //   onClick={() => {
                      //     document.getElementById("imageUpload1").value = "";
                      //     setPreviewImage("");
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
                        placeholder={"Cover-1.png"}
                        defaultValue={file ? file.name : ""}
                      />
                      {!file ? (
                        <button className="button -dark-3 text-white">
                          <label
                            style={{ cursor: "pointer" }}
                            htmlFor="imageUpload1"
                          >
                            Upload Files
                          </label>

                          <input
                            required
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
                          className="button -dark-3 text-white"
                          type="submit"
                          onClick={handleImageUpload}
                        >
                          Save
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

                  {file && status === "success" && (
                    <p className="text-success mt-10">
                      File Uploaded Successfully
                    </p>
                  )}
                  {file && status === "error" && (
                    <p className="text-danger mt-10">File Upload Error</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row y-gap-20 justify-between pt-30">
            <div className="col-auto">
              {/* <button className="button -md -outline-purple-1 text-purple-1">
                Prev
              </button> */}
            </div>

            <div className="col-auto">
              <button className="button -md -purple-1 text-white">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
