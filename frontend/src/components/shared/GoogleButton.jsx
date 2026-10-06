import React from "react";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function GoogleButton({ label = "Continue with Google" }) {
  const start = () => {
    const redirectUrl = window.location.origin + "/auth/callback";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  return (
    <button type="button" onClick={start}
      className="w-full flex items-center justify-center gap-3 rounded-full border-2 border-stone-300 bg-white py-2.5 px-4 text-sm font-semibold text-stone-800 hover:border-moss hover:bg-cream transition"
      data-testid="google-signin">
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.2 29.2 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7 29 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c10.5 0 19-8.5 19-19 0-1.3-.1-2.6-.4-3.9z"/>
        <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.7 15 19 12 24 12c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7 29 5 24 5 16.5 5 10 9.3 6.3 14.1z"/>
        <path fill="#4CAF50" d="M24 43c5 0 9.5-1.9 12.9-5l-6-5c-1.9 1.3-4.2 2.1-6.9 2.1-5.2 0-9.6-2.8-11.3-7l-6.5 5C9.9 38.8 16.4 43 24 43z"/>
        <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.3 5.3l6 5c-.4.4 7-5 7-14.3 0-1.3-.1-2.6-.4-3.9z"/>
      </svg>
      {label}
    </button>
  );
}
