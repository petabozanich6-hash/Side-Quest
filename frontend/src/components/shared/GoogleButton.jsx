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
      onSuccess={async (credentialResponse) => {
        try {
          if (!credentialResponse?.credential) {
            throw new Error("Google did not return an ID credential");
          }

          const response = await api.post("/auth/google", {
            credential: credentialResponse.credential,
          });

          onSuccess?.(response.data);
        } catch (error) {
          console.error("Google login failed:", error);
          onError?.(error);
        }
      }}
      onError={() => {
        const error = new Error("Google sign-in was cancelled or failed");
        console.error("Google sign-in failed:", error);
        onError?.(error);
      }}
    />
  );
}
