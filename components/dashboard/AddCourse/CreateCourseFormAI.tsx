// "use client";

// import React, { useState } from "react";
// import type { Category } from "@prisma/client";
// import { createCourse } from "@/app/actions/courseActions";
// import { toast } from "react-hot-toast";

// export default function CreateCourseForm({
//   AvailableCategories,
//   Instructor,
//   onSuccess,
// }: {
//   AvailableCategories: Category[];
//   Instructor: string;
//   onSuccess: (courseId: number) => void;
// }) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [thumbnail, setThumbnail] = useState("");

//   async function handleSubmit(formData: FormData) {
//     setIsSubmitting(true);

//     try {
//       // Convert form data to the format expected by server action
//       const courseData = {
//         title: formData.get("title") as string,
//         description: formData.get("description") as string,
//         level: formData.get("level") as string,
//         language: formData.get("language") as string,
//         thumbnail: thumbnail || "https://cdn.ynotedu.com/default-course.jpg",
//         price: parseFloat(formData.get("price") as string),
//         duration: parseInt(formData.get("duration") as string),
//         categoryId: parseInt(formData.get("categoryId") as string),
//         instructorId: parseInt(Instructor),
//       };

//       const result = await createCourse(courseData);

//       if (result.success) {
//         toast.success("Course created successfully!");
//         onSuccess(result.course.id);
//       } else {
//         toast.error(result.error || "Failed to create course");
//       }
//     } catch (error) {
//       toast.error("Failed to create course");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <form className="contact-form row y-gap-30" action={handleSubmit}>
//       <div className="col-12">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Course Title*
//         </label>

//         <input
//           required
//           type="text"
//           placeholder="Learn Figma - UI/UX Design Essential Training"
//           name="title"
//         />
//       </div>

//       {/* <div className="col-12">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Short Description*
//         </label>

//         <textarea required placeholder="Description" rows={7}></textarea>
//       </div> */}

//       <div className="col-12">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Course Description*
//         </label>

//         <textarea
//           required
//           placeholder="Description"
//           rows={7}
//           name="description"
//         ></textarea>
//       </div>

//       {/* <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           What will students learn in your course?*
//         </label>

//         <textarea required placeholder="Description" rows={7}></textarea>
//       </div> */}

//       {/* <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Requirements*
//         </label>

//         <textarea required placeholder="Description" rows={7}></textarea>
//       </div> */}

//       <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Course Level*
//         </label>

//         {/* <input required type="text" placeholder="Select" /> */}
//         <select name="level" id="CourseLevel">
//           <option value="BEGINNER">Beginner</option>
//           <option value="INTERMEDIATE">Intermediate</option>
//           <option value="ADVANCED">Advanced</option>
//         </select>
//       </div>

//       <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Audio Language*
//         </label>

//         {/* <input required type="text" placeholder="Select" /> */}
//         <select name="language" id="CourseLanguage">
//           <option value="English">English</option>
//           <option value="Hindi">Hindi</option>
//           <option value="Bengali">Bengali</option>
//         </select>
//       </div>

//       {/* <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Close Caption*
//         </label>

//         <input required type="text" placeholder="Select" />
//       </div> */}

//       <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Price ($)*
//         </label>

//         <input
//           required
//           type="number"
//           placeholder="49.99"
//           name="price"
//           min="0"
//           step="0.01"
//         />
//       </div>

//       <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Duration (minutes)*
//         </label>

//         <input
//           required
//           type="number"
//           placeholder="120"
//           name="duration"
//           min="1"
//         />
//       </div>

//       <div className="col-md-6">
//         <label className="text-16 lh-1 fw-500 text-dark-1 mb-10">
//           Course Category*
//         </label>

//         {/* <input required type="text" placeholder="Select" /> */}
//         <select name="categoryId" id="Category">
//           {AvailableCategories.map((category) => (
//             <option key={category.id} value={category.id}>
//               {category.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       <input type="hidden" name="thumbnail" value={thumbnail} />

//       <div className="col-12 mt-20">
//         <button
//           type="submit"
//           className="button -md -purple-1 text-white"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Creating Course..." : "Create Course"}
//         </button>
//       </div>
//     </form>
//   );
// }
