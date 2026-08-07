/**
 * Shared API base URL for the ResumeIQ backend.
 *
 * Configure via NEXT_PUBLIC_API_URL (e.g. the Render deployment URL); falls
 * back to the local dev server. Trailing slashes are stripped so callers can
 * concatenate path segments safely.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/+$/, "");
