// import AddCourse from "@/components/dashboard/AddCourse";
// import { getBaseUrl } from "@/utils/getBaseUrl";
// import type { Category } from "@prisma/client";

// export default async function AddCoursePage() {
//   // Fetch categories
//   const res = await fetch(`${getBaseUrl()}/api/courses/categories`, {
//     cache: "no-store",
//   });
//   const categories: Category[] = await res.json();

//   // For now, use a mock instructor ID
//   // In a real application, you would get this from your auth system
//   const instructorId = "1";

//   return <AddCourse categories={categories} instructorId={instructorId} />;
// }
