export function getBaseUrl() {
  // When running locally in development, return localhost.
  if (process.env.NODE_ENV === "development") {
    return process.env.BASE_URL || "http://localhost:3000";
  }
  // When deployed on Vercel, the environment variable VERCEL_URL is automatically provided.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // Fallback in case no condition matches.
  return "";
}
