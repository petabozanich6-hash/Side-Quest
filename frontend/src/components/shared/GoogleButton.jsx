import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/api";

export default function GoogleButton({
  onSuccess,
  onError,
  label = "Continue with Google",
}) {
  return (
    <GoogleLogin
      text={label === "Continue with Google" ? "continue_with" : "signin_with"}
      useOneTap={false}
      onSuccess={async (credentialResponse) => {
        try {
          const credential = credentialResponse?.credential;

          if (!credential) {
            throw new Error("Google did not return an ID credential");
          }

          const response = await api.post("/auth/google", {
            credential,
          });

          onSuccess?.(response.data);
        } catch (error) {
          console.error(
            "Side Quest Google login failed:",
            error?.response?.data || error,
          );
          onError?.(error);
        }
      }}
      onError={() => {
        const error = new Error("Google sign-in was cancelled or blocked");
        console.error("Google sign-in failed:", error);
        onError?.(error);
      }}
    />
  );
}
