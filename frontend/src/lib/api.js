import axios from "axios";

export const BACKEND_URL = "";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sq_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Links can't send a header, so they carry a files-only token from /auth/me (never the sign-in token).
export const FILE_TOKEN = "sq_file_token";
export const fileUrl = (fid) => {
  let token = "";
  try { token = localStorage.getItem(FILE_TOKEN) || ""; } catch {}
  return `${API}/files/${fid}?ft=${encodeURIComponent(token)}`;
};

/** Surface actionable API failures instead of generic "Failed" toasts. */
export function apiErrorMessage(err, fallback = "Could not save your changes") {
  const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.response?.data?.error;
  if (typeof detail === "string" && detail.trim()) return detail;
  const status = err?.response?.status;
  if (status === 401) return "Your sign-in has expired. Please sign in again and retry.";
  if (status === 403) return "This account does not have permission to save that change.";
  if (status === 404) return "The save service is unavailable on the live site (404). The Cloudflare Worker may be out of date.";
  if (status === 409) return "This change conflicts with an existing record. Refresh and try again.";
  if (status === 429) return "Too many requests. Please try again shortly.";
  if (status >= 500) return `The server could not save your changes (HTTP ${status}). Please retry; if it continues, the live Worker needs checking.`;
  if (!err?.response) return "Could not reach the save service. Check your connection and try again.";
  return `${fallback} (HTTP ${status}).`;
}
