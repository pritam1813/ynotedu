"use client";

import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";

type ContentType = "VIDEO" | "PDF" | "QUIZ";

interface ContentUploaderProps {
  type: ContentType;
  sectionId: number;
  onContentAdded: (
    sectionId: number,
    title: string,
    url: string,
    metadata: any
  ) => void;
  onCancel: () => void;
}

export default function ContentUploader({
  type,
  sectionId,
  onContentAdded,
  onCancel,
}: ContentUploaderProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  }

  async function handleUpload() {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Additional metadata based on content type
        const contentMetadata = { ...metadata };

        if (type === "VIDEO") {
          contentMetadata.duration = metadata.duration || 0; // In seconds
          contentMetadata.thumbnail = metadata.thumbnail || "";
        } else if (type === "PDF") {
          contentMetadata.pages = metadata.pages || 0;
        }

        onContentAdded(sectionId, title, data.url, contentMetadata);
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  function handleMetadataChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setMetadata({
      ...metadata,
      [name]: name === "duration" || name === "pages" ? parseInt(value) : value,
    });
  }

  return (
    <div className="row y-gap-20">
      <div className="col-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Content Title*
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter content title"
          className="w-1/1"
        />
      </div>

      <div className="col-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Upload{" "}
          {type === "VIDEO"
            ? "Video"
            : type === "PDF"
            ? "PDF Document"
            : "Quiz File"}
          *
        </label>
        <div className="form-upload">
          <div className="form-upload__wrap">
            <input
              type="text"
              placeholder="Choose a file..."
              value={file ? file.name : ""}
              readOnly
              className="w-1/1"
            />
            <button type="button" className="button -dark-3 text-white">
              <label style={{ cursor: "pointer" }} htmlFor="contentUpload">
                Browse Files
              </label>
              <input
                id="contentUpload"
                type="file"
                accept={
                  type === "VIDEO"
                    ? "video/*"
                    : type === "PDF"
                    ? "application/pdf"
                    : ".json"
                }
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </button>
          </div>
        </div>
      </div>

      {type === "VIDEO" && (
        <>
          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              Duration (seconds)
            </label>
            <input
              type="number"
              name="duration"
              value={metadata.duration || ""}
              onChange={handleMetadataChange}
              placeholder="Enter video duration"
              min="1"
              className="w-1/1"
            />
          </div>

          <div className="col-md-6">
            <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
              Thumbnail URL (optional)
            </label>
            <input
              type="text"
              name="thumbnail"
              value={metadata.thumbnail || ""}
              onChange={handleMetadataChange}
              placeholder="Enter thumbnail URL"
              className="w-1/1"
            />
          </div>
        </>
      )}

      {type === "PDF" && (
        <div className="col-md-6">
          <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
            Number of Pages
          </label>
          <input
            type="number"
            name="pages"
            value={metadata.pages || ""}
            onChange={handleMetadataChange}
            placeholder="Enter number of pages"
            min="1"
            className="w-1/1"
          />
        </div>
      )}

      <div className="col-12 mt-15">
        <div className="d-flex x-gap-10">
          <button
            type="button"
            className="button -md -purple-1 text-white"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add Content"}
          </button>
          <button
            type="button"
            className="button -md -outline-dark-1"
            onClick={onCancel}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
