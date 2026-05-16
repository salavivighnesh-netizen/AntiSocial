/**
 * Base URL for browser calls to the Express API.
 * In dev, default is same-origin (empty string) so Vite can proxy /api → port 4000
 * (works when you open the app via LAN IP, not only localhost).
 */
export function getClientApiBaseUrl() {
  const fromEnv = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "";
  return "http://localhost:4000";
}

export const apiUnreachableMessage =
  "Cannot reach the API server. From the AntiSocial-main folder run `npm run server` (port 4000). Ensure `.env` has MONGODB_URI and JWT_SECRET, and MongoDB is reachable.";
