"use client";
import { useActionState, useEffect, useRef, useCallback } from "react";
import type { Category } from "@prisma/client";
import { saveDraftCourse, updateCourse } from "@/app/actions/courseActions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const initialState = {
  errors: undefined,
  success: false,
  message: "",
};

interface ExistingCourse {
  id: string;
  title: string;
  description: string;
  level: string;
  language: string;
  categoryId: string;
  // Add other fields as needed
}

export default function CreateCourseForm({
  AvailableCategories,
  Instructor,
  existingCourse,
  isEditing = false,
}: {
  AvailableCategories: Category[];
  Instructor: string;
  existingCourse?: ExistingCourse | null;
  isEditing?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const action = isEditing ? updateCourse : saveDraftCourse;
  const [state, formAction] = useActionState(action, initialState);
  const params = new URLSearchParams(searchParams);
  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, []);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message.split("CourseId: ")[0]);
      if (state.message != "") {
        params.set("courseid", state.message.split("CourseId: ")[1]);
      } else {
        params.delete("courseid");
      }
      replace(`${pathname}?${params.toString()}`);
    }
  }, [state]);

  return (
    <form ref={formRef} className="contact-form row y-gap-30" action={formAction}>
      {/* <Toaster position="top-center" /> */}
      {isEditing && existingCourse && (
        <input type="hidden" name="courseId" value={existingCourse.id} />
      )}

      <div className="col-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Title*
        </label>

        <input
          required
          type="text"
          placeholder="Learn Figma - UI/UX Design Essential Training"
          name="title"
          defaultValue={existingCourse?.title || ""}
        />
      </div>

      <div className="col-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Description*
        </label>

        <textarea
          required
          placeholder="Description"
          rows={7}
          name="description"
          defaultValue={existingCourse?.description || ""}
        ></textarea>
      </div>

      <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Level*
        </label>

        <select
          name="level"
          id="CourseLevel"
          defaultValue={existingCourse?.level || "BEGINNER"}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Audio Language*
        </label>

        <select
          name="language"
          id="CourseLanguage"
          defaultValue={existingCourse?.language || "English"}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Bengali">Bengali</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Category*
        </label>

        <select
          name="categoryId"
          id="Category"
          required
          defaultValue={existingCourse?.categoryId || ""}
        >
          <option value="" disabled>
            Select a category
          </option>
          {AvailableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <input type="hidden" name="instructorId" value={Instructor} />
      <div className="row y-gap-20 justify-between pt-15">
        <div className="col-auto">
          <button
            type="button"
            onClick={handleReset}
            className="button -md -outline-purple-1 text-purple-1"
          >
            Reset
          </button>
        </div>

        <div className="col-auto">
          <button className="button -md -purple-1 text-white" type="submit">
            {isEditing ? "Update" : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
}
