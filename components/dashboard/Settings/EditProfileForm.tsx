"use client";
import React, { useActionState, useEffect, useState, useRef } from "react";
import type { UserProfile } from "@prisma/client";
import Image from "next/image";
import { updateProfile } from "@/app/actions/updateProfile";
import toast, { Toaster } from "react-hot-toast";
// import imageCompression from "browser-image-compression";
import { compressImage } from "@/utils/compressImage";

const initialState = {
  success: false,
  message: "",
};

export default function EditProfileForm({
  activeTab,
  profile,
}: {
  activeTab: number;
  profile: UserProfile;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  const [imagePreview, setImagePreview] = useState<string | null>(
    profile.avatarUrl || "/assets/img/dashboard/edit/1.png"
  );
  const [hasNewImage, setHasNewImage] = useState(false);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success && state.message !== "") {
      toast.success(state.message);
      setHasNewImage(false);
      setShouldRemoveImage(false);
      setCompressedFile(null);
    }
    if (!state.success && state.message !== "") {
      toast.error(state.message);
    }
  }, [state]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        toast.loading("Compressing image...", { id: "compress" });

        // Compress if larger than 1MB
        // const compressed =
        //   file.size > 1024 * 1024
        //     ? await imageCompression(file, {
        //         maxSizeMB: 1,
        //         maxWidthOrHeight: 1920,
        //         useWebWorker: true,
        //       })
        //     : file;

        const compressionOptions = {
          maxSizeMB: 1, // Only compress if larger than 1MB
          maxWidthOrHeight: 1920,
          quality: 0.7, // 70% quality
        };

        const compressed = await compressImage(file, compressionOptions);

        // Store the compressed file
        setCompressedFile(compressed);

        // Create preview with compressed file
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setHasNewImage(true);
          setShouldRemoveImage(false);
          toast.success("Image ready!", { id: "compress" });
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Failed to process image", { id: "compress" });
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("/assets/img/dashboard/edit/1.png");
    setHasNewImage(false);
    setShouldRemoveImage(true);
    setCompressedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (formData: FormData) => {
    // Replace the file in formData with compressed version
    if (compressedFile && hasNewImage) {
      formData.set("image", compressedFile);
    }

    // Call the server action
    formAction(formData);
  };

  return (
    <div
      className={`tabs__pane -tab-item-1 is-active ${
        activeTab == 1 ? "is-active" : ""
      } `}
    >
      <form action={handleSubmit} className="contact-form row y-gap-30">
        <Toaster position="top-right" />
        <div className="row y-gap-20 x-gap-20 items-center">
          <label
            className="col-auto"
            htmlFor="imageUpload"
            style={
              imagePreview
                ? {}
                : { backgroundColor: "#f2f3f4", width: 100, height: 100 }
            }
          >
            {imagePreview && (
              <Image
                width={100}
                height={100}
                className="size-100"
                src={imagePreview}
                alt={imagePreview ? `${profile.username} avatar` : ""}
              />
            )}
          </label>

          <div className="col-auto">
            <div className="text-16 fw-500 text-dark-1">Your avatar</div>
            <div className="text-14 lh-1 mt-10">
              PNG or JPG no bigger than 800px wide and tall.
            </div>

            <div className="d-flex x-gap-10 y-gap-10 flex-wrap pt-15">
              <div>
                <div className="d-flex justify-center items-center size-40 rounded-8 bg-light-3">
                  <label
                    style={{ cursor: "pointer" }}
                    htmlFor="imageUpload1"
                    className="icon-cloud text-16"
                  ></label>
                  <input
                    ref={fileInputRef}
                    id="imageUpload1"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    disabled={isPending}
                  />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveImage}
                  className="d-flex justify-center items-center size-40 rounded-8 bg-light-3"
                  disabled={isPending}
                >
                  <div className="icon-bin text-16"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" name="profileId" value={profile.id} />
        <input
          type="hidden"
          name="removeImage"
          value={shouldRemoveImage ? "true" : "false"}
        />

        <div className="border-top-light pt-30 mt-30">
          <div className="contact-form row y-gap-30">
            <div className="col-md-6">
              <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                defaultValue={profile.firstName}
                disabled={isPending}
              />
            </div>

            <div className="col-md-6">
              <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                defaultValue={profile.lastName}
                disabled={isPending}
              />
            </div>

            <div className="col-12">
              <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
                Personal info {"(Bio)"}
              </label>

              <textarea
                name="bio"
                placeholder="Text..."
                rows={7}
                defaultValue={profile.bio}
                disabled={isPending}
              ></textarea>
            </div>

            <div className="col-12">
              <button
                className="button -md -purple-1 text-white"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
