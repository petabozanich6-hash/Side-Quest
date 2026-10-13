import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import {
  ABOUT_HEADING,
  ABOUT_PARAGRAPHS,
  FUTURE_PRICING,
  PRICING_SUMMARY,
  SUBSCRIPTION_SUPPORT,
} from "../content/subscriptionMessaging";

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FBF7EC" }}>
      <header>
        <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5" data-testid="about-home">
            <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ backgroundColor: "#1F3B2D" }}>
              <Compass size={22} style={{ color: "#F5EFE0" }} />
            </div>
            <div>
              <div className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Side Quest</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold -mt-0.5">Learning</div>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold" style={{ color: "#52473A" }} data-testid="about-parent-login">Parent sign in</Link>
            <Link to="/" className="text-sm font-semibold" style={{ color: "#52473A" }} data-testid="about-back">Home</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4A5D3A" }}>{SUBSCRIPTION_SUPPORT}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#1F3B2D" }} data-testid="about-statement">
          {ABOUT_HEADING}
        </h1>
        {ABOUT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-base leading-relaxed" style={{ color: "#52473A" }}>
            {paragraph}
          </p>
        ))}

        <section className="mt-10 rounded-3xl p-6" style={{ backgroundColor: "#F5EFE0", border: "1px solid #D4C8A8" }} data-testid="future-pricing">
          <h2 className="font-display text-2xl font-bold" style={{ color: "#1F3B2D" }}>Pricing</h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "#52473A" }}>{PRICING_SUMMARY}</p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "#52473A" }}>{FUTURE_PRICING}</p>
        </section>
      </main>
    </div>
  );
}
