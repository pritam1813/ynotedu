"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error details to browser console and server logs
    console.error("[Application Error]:", error);
  }, [error]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center p-4">
      <h2 className="text-24 font-semibold text-dark-1 mb-2">
        Something went wrong!
      </h2>
      <p className="text-15 text-muted mb-4 max-w-md">
        An error occurred while loading this page.
        {error.digest && (
          <span className="d-block text-13 text-secondary mt-1">
            Error Digest: <code>{error.digest}</code>
          </span>
        )}
      </p>
      <button
        onClick={() => reset()}
        className="button -md -purple-1 text-white rounded-8 px-24 py-12"
      >
        Try Again
      </button>
    </div>
  );
}
