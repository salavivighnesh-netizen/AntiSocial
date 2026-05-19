/**
 * Turn axios/fetch failures into readable messages (especially Express 404 HTML).
 */
export function formatHttpApiError(error, fallback) {
  const status = error?.response?.status;
  const method = (error?.config?.method || "GET").toUpperCase();
  const url = error?.config?.url || error?.response?.config?.url || "";
  const data = error?.response?.data;
  const bodyMsg =
    (typeof data === "object" && data !== null && (data.error || data.message)) ||
    (typeof data === "string" && !data.includes("<!DOCTYPE") ? data : "");

  if (status === 404) {
    const isExpressDefault =
      typeof data === "string" && /Cannot (GET|POST|PUT|DELETE|PATCH)/i.test(data);
    if (isExpressDefault || !bodyMsg) {
      return new Error(
        `API route not found (${method} ${url || "unknown"}). ` +
          "Start the API with `npm run server` from AntiSocial-main. " +
          "For local dev, leave VITE_API_URL unset (Vite proxies /api) or set VITE_API_URL=http://localhost:4000 without a trailing /api."
      );
    }
    return new Error(bodyMsg);
  }

  if (status === 401) {
    return new Error(bodyMsg || "Please sign in again.");
  }

  return new Error(bodyMsg || error?.message || fallback);
}
