// Owner HQ API client. Every request carries the X-SideQuest-Admin header the server requires for changes
// (a cross-site form or image cannot send it). Passkey ceremonies use @simplewebauthn/browser.
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { api } from "./api";

const HEADERS = { "X-SideQuest-Admin": "1" };

export const adminApi = {
  get: (path, params) => api.get(`/admin${path}`, { params, headers: HEADERS }).then((r) => r.data),
  post: (path, body) => api.post(`/admin${path}`, body ?? {}, { headers: HEADERS }).then((r) => r.data),
  put: (path, body) => api.put(`/admin${path}`, body ?? {}, { headers: HEADERS }).then((r) => r.data),
  del: (path) => api.delete(`/admin${path}`, { headers: HEADERS }).then((r) => r.data),
};

export const errorCode = (e) => e?.response?.data?.code;
export const errorText = (e, fallback = "Something went wrong. Please try again.") => {
  if (e?.name === "NotAllowedError") return "The passkey prompt was cancelled or timed out.";
  const d = e?.response?.data?.detail;
  return typeof d === "string" && d ? d : fallback;
};

/** Adds a passkey. The first one needs the account password again. */
export async function enrolPasskey({ password, label }) {
  const { options } = await adminApi.post("/security/passkeys/register/options", password ? { password } : {});
  const response = await startRegistration({ optionsJSON: options });
  return adminApi.post("/security/passkeys/register/verify", { response, label });
}

/** Confirms it's the Owner with a passkey; opens Owner HQ for this sign-in for 15 minutes. */
export async function stepUpWithPasskey() {
  const { options } = await adminApi.post("/security/step-up/options");
  const response = await startAuthentication({ optionsJSON: options });
  return adminApi.post("/security/step-up/verify", { response });
}
