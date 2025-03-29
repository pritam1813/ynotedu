import React from "react";
import type { Category } from "@prisma/client";

export default function CreateCourseForm({
  AvailableCategories,
  Instructor,
}: {
  AvailableCategories: Category[];
  Instructor: string;
}) {
  return (
    <form className="contact-form row y-gap-30" action="#">
      <div className="col-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Title*
        </label>

        <input
          required
          type="text"
          placeholder="Learn Figma - UI/UX Design Essential Training"
          name="title"
        />
      </div>

      {/* <div className="col-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Short Description*
        </label>

        <textarea required placeholder="Description" rows={7}></textarea>
      </div> */}

      <div className="col-12">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Description*
        </label>

        <textarea
          required
          placeholder="Description"
          rows={7}
          name="description"
        ></textarea>
      </div>

      {/* <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          What will students learn in your course?*
        </label>

        <textarea required placeholder="Description" rows={7}></textarea>
      </div> */}

      {/* <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Requirements*
        </label>

        <textarea required placeholder="Description" rows={7}></textarea>
      </div> */}

      <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Level*
        </label>

        {/* <input required type="text" placeholder="Select" /> */}
        <select name="level" id="CourseLevel">
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Audio Language*
        </label>

        {/* <input required type="text" placeholder="Select" /> */}
        <select name="language" id="CourseLanguage">
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Bengali">Bengali</option>
        </select>
      </div>

      {/* <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Close Caption*
        </label>

        <input required type="text" placeholder="Select" />
      </div> */}

      <div className="col-md-6">
        <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
          Course Category*
        </label>

        {/* <input required type="text" placeholder="Select" /> */}
        <select name="category" id="Category">
          {AvailableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
