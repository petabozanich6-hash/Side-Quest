import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

export default function GoogleButton({
  label = "Continue with Google",
}) {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "redirect",
    redirect_uri: `${window.location.origin}/oauth/callback`,
  });

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
