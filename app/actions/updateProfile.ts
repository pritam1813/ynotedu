"use server";

import { prisma } from "@/lib/client";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

type InitialStateProfile = {
  success: boolean;
  message: string;
};

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileId: z.string(),
  bio: z.string().min(10, "Bio Should be more than 10 characters").optional(),
  removeImage: z.enum(["true", "false"]).optional(), // New field to track image removal
  image: z
    .instanceof(File)
    .refine(
      (file) => {
        // Allow empty files (when no new image is selected)
        if (file.size === 0) return true;
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      },
      {
        message: "Only .jpg, .jpeg, .png and .webp files are accepted.",
      }
    )
    .refine(
      (file) => {
        // Allow empty files
        if (file.size === 0) return true;
        return file.size <= MAX_FILE_SIZE;
      },
      {
        message: `Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      }
    )
    .optional(),
});

export async function updateProfile(
  prevState: InitialStateProfile,
  formData: FormData
): Promise<InitialStateProfile> {
  try {
    const formValues = Object.fromEntries(formData);

    const validatedProfileData = profileSchema.safeParse(formValues);

    if (!validatedProfileData.success) throw validatedProfileData.error;

    const { firstName, lastName, profileId, bio, image, removeImage } =
      validatedProfileData.data;

    // Prepare update data
    const updateData: {
      firstName?: string;
      lastName?: string;
      bio?: string;
      avatarUrl?: string | null;
    } = {};

    // Only include fields that are provided
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;

    // Handle image removal
    if (removeImage === "true") {
      // Get current profile to delete old image from cloudinary
      const currentProfile = await prisma.userProfile.findUnique({
        where: { id: profileId },
        select: { avatarUrl: true },
      });

      // Delete from cloudinary if exists
      if (currentProfile?.avatarUrl) {
        try {
          // Extract public_id from cloudinary URL
          const publicId = currentProfile.avatarUrl
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Failed to delete old image from cloudinary:", error);
        }
      }

      updateData.avatarUrl = null;
    }
    // Handle new image upload (only if file has content and not removing)
    else if (image && image.size > 0 && removeImage === "false") {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Get current profile to delete old image
      const currentProfile = await prisma.userProfile.findUnique({
        where: { id: profileId },
        select: { avatarUrl: true },
      });

      // Delete old image from cloudinary if exists
      if (currentProfile?.avatarUrl) {
        try {
          const publicId = currentProfile.avatarUrl
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Failed to delete old image from cloudinary:", error);
        }
      }

      // Upload new image
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ynoteduprofiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("No upload result"));
            resolve(result.secure_url);
          }
        );

        uploadStream.end(buffer);
      });

      updateData.avatarUrl = imageUrl;
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length > 0) {
      await prisma.userProfile.update({
        where: { id: profileId },
        data: updateData,
      });
    }

    revalidatePath("/dashboard/settings");

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:");
      for (const issue of error.errors) {
        console.error(`- ${issue.path.join(".")}: ${issue.message}`);
        return {
          success: false,
          message: `${issue.message}`,
        };
      }
    } else {
      console.error("Update error:", error);
    }
    return {
      message: "Failed to update profile. Please try again.",
      success: false,
    };
  }
}
