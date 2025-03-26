"use client";
import TestimonialsOne from "@/components/common/TestimonialsOne";
import Brands from "@/components/common/Brands";

export default function ClientComponentWrapper() {
  return (
    <>
      <TestimonialsOne />
      <Brands backgroundColorComponent={undefined} brandsTwo={undefined} />
    </>
  );
} 