export const GOOGLE_ERRORS = {
  google_cancelled: "Google sign-in was cancelled. Nothing was changed.",
  google_failed: "Google sign-in could not be completed. Please try again.",
  google_state: "Google sign-in could not be verified. Please start again from the sign-in page.",
  google_expired: "Google sign-in took too long and expired. Please try again.",
  google_config: "Google sign-in is not available right now. Use email and password instead.",
  google_denied: "Google did not confirm this email address, so Side Quest did not sign you in.",
  google_conflict: "That email is already linked to a different Google account. Sign in with that Google account, or with email and password.",
};

export function googleErrorMessage(code) {
  return GOOGLE_ERRORS[code] || "Google sign-in could not be completed. Please try again.";
}
