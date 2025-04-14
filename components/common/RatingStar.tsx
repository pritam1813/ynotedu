import React from "react";

export default function RatingStar({ rating }: { rating: number }) {
  // console.log(rating);

  return (
    <>
      {Array.from({ length: rating }, (_, i) => (
        <div key={i} className="icon-star text-9 text-yellow-1"></div>
      ))}
    </>
  );
}
