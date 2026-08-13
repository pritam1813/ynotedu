export function getBaseUrl() {
  // For server-side rendering
  if (typeof window === "undefined") {
    // In production on Vercel
    const vercelDomain =
      process.env.VERCEL_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL;

    if (vercelDomain) {
      return vercelDomain.startsWith("http")
        ? vercelDomain
        : `https://${vercelDomain}`;
    }

    // Custom base URL (works for both dev and prod locally)
    const customUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_API_URL;
    if (customUrl) {
      return customUrl.startsWith("http") ? customUrl : `https://${customUrl}`;
    }

    // Fallback to localhost (works for both dev and prod build locally)
    return "http://localhost:3000";
  }

  // For client-side, use relative URLs
  return "";
}

