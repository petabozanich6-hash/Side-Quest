import React, { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { api } from "../../lib/api";

export default function GoogleButton({ onSuccess, onError, label = "Continue with Google" }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await api.post("/auth/google", {
          credential: tokenResponse.credential || tokenResponse.access_token,
        });

        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (error) {
        console.error("Google login failed:", error);
        if (onError) {
          onError(error);
        }
      }
    },
    onError: (error) => {
      console.error("Google sign-in failed:", error);
      if (onError) {
        onError(error);
      }
    },
  });

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <button
      type="button"
      className="google-login-button"
      onClick={() => login()}
    >
      <span aria-hidden="true">G</span>
      {label}
    </button>
  );
}
