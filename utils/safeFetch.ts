/**
 * Helper to safely fetch JSON data on the server or client side with detailed logging.
 * Prevents Server Component crashes when API endpoints return non-200 responses or HTML error pages.
 */
export async function safeFetchJson<T>(
  url: string,
  options?: RequestInit,
  fallback?: T
): Promise<T> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unable to read response body");
      console.error(
        `[SSR Fetch Error] GET "${url}" failed with status ${res.status} (${res.statusText}):\n`,
        errorText.slice(0, 1000)
      );
      return fallback as T;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text().catch(() => "");
      console.error(
        `[SSR Fetch Non-JSON] GET "${url}" returned content-type "${contentType}", expected "application/json":\n`,
        responseText.slice(0, 1000)
      );
      return fallback as T;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`[SSR Fetch Exception] Exception during fetch to "${url}":`, error);
    return fallback as T;
  }
}
