import React from "react";
import { Link } from "react-router-dom";
import { parentOrigin } from "../lib/pwa";

/** Shown on the kids' address (SQ Kids) instead of any parent page: grown-ups use the main Side-Quest site or app. */
export default function KidsOnly() {
  const parent = parentOrigin();
  return (
    <div className="min-h-screen grid place-items-center p-6" style={{ backgroundColor: "#FEF5E0" }} data-testid="kids-only">
      <div className="paper-card p-8 max-w-md w-full text-center space-y-4">
        <img src="/icons/icon-192.png" alt="" className="mx-auto h-14 w-14 rounded-2xl" />
        <h1 className="font-display text-2xl font-bold" style={{ color: "#1F3B2D" }}>This is SQ Kids</h1>
        <p className="text-sm text-stone-700">SQ Kids is just for children. Grown-ups sign in on the main Side-Quest site or the Side-Quest app.</p>
        <Link to="/child-login" className="block rounded-full py-3 font-bold" style={{ backgroundColor: "#C77B5B", color: "#FBF7EC" }} data-testid="kids-only-child">I'm a child: sign me in</Link>
        <a href={`${parent}/login`} className="block text-sm font-semibold underline" style={{ color: "#4A5D3A" }} data-testid="kids-only-parent">I'm a grown-up: go to Side-Quest</a>
      </div>
    </div>
  );
}
