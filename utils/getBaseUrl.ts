export function getBaseUrl() {
  // For server-side rendering
  if (typeof window === "undefined") {
    // In production on Vercel
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    // Custom base URL (works for both dev and prod locally)
    if (process.env.BASE_URL) {
      return process.env.BASE_URL;
    }

    // Fallback to localhost (works for both dev and prod build locally)
    return "http://localhost:3000";
  }

  // For client-side, use relative URLs
  return "";
}
