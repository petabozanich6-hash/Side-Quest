import React, { useEffect, useRef } from "react";
import { API } from "../../lib/api";

export default function GoogleButton({ label = "Continue with Google" }) {
  const buttonRef = useRef(null);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleGoogleCredential = async (response) => {
    try {
      const result = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.detail || "Google sign-in failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/parent";
    } catch (error) {
      alert(error.message || "Google sign-in failed");
    }
  };

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 320,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, [clientId]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-full border-2 border-stone-300 bg-white py-2.5 px-4 text-sm font-semibold text-stone-800"
      >
        Google sign-in is not configured
      </button>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" aria-label={label} />;
}
