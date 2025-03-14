"use client";

import React, { useEffect, useState } from "react";

export default function Loading() {
  const [preloaderDisable, setPreloaderDisable] = useState(false);
  useEffect(() => {
    setPreloaderDisable(true);
  }, []);
  return (
    <div
      className="preloader__bg"
      style={preloaderDisable ? { transform: "scale(1,0)" } : {}}
    ></div>
  );
}
