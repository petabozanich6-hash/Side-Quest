import React from "react";
import { Link } from "react-router-dom";
import { Compass, Sparkles, BookOpen, Camera, Calendar, ShieldCheck, Printer, Users } from "lucide-react";

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6" data-testid={`feature-${title.replace(/\s+/g,'-').toLowerCase()}`}>
    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 grid place-items-center mb-4">
      <Icon size={20} />
    </div>
    <h3 className="font-display text-lg font-semibold mb-1 text-slate-900">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <header className="glass-nav sticky top-0 z-30 border-b border-slate-200">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Compass className="text-teal-700" size={26} />
            <span className="font-display text-xl font-bold text-slate-900">Side Quest Learning</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/child-login" className="text-sm font-semibold text-slate-700 hover:text-teal-700" data-testid="nav-child-login">Child sign in</Link>
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-teal-700" data-testid="nav-login">Parent sign in</Link>
            <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" data-testid="nav-register">Start free</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 grid lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800">
            <Sparkles size={14} /> NSW K-12 homeschool planning
          </span>
          <h1 className="mt-5 font-display text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
            Plan the learning.<br />
            <span className="text-teal-700">Trust the record.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl leading-relaxed">
            A dual-persona homeschool platform that gives parents a true command centre and gives every child
            an age-appropriate place to learn, submit work and reflect. Early Stage 1 through Stage 6.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/register" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800" data-testid="cta-start">Create a family account</Link>
            <Link to="/child-login" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400" data-testid="cta-child">I'm a student</Link>
          </div>
          <p className="mt-6 text-xs text-slate-500 max-w-xl">
            Side Quest Learning is a planning, teaching and record-keeping tool. Parents remain responsible for
            selecting an appropriate program and confirming alignment with current NESA and jurisdictional requirements.
          </p>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-mono text-slate-500">S4 • Year 8 • Science</div>
                <div className="font-display text-lg font-semibold">Working Scientifically — Fair tests</div>
              </div>
              <span className="pill pill-in-progress">In progress</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700"><span className="h-2 w-2 rounded-full bg-emerald-500"></span>Learning intention set</div>
              <div className="flex items-center gap-2 text-slate-700"><span className="h-2 w-2 rounded-full bg-emerald-500"></span>Explicit teaching ready</div>
              <div className="flex items-center gap-2 text-slate-700"><span className="h-2 w-2 rounded-full bg-amber-500"></span>Awaiting evidence</div>
              <div className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-slate-300"></span>Parent review</div>
            </div>
            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Linked outcome</div>
              <div className="font-mono text-xs text-slate-700">SC4-WS-01 · Working Scientifically</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Feature icon={Users} title="One family, every stage" desc="Add children across Early Stage 1 to Stage 6. Different subject levels per child. Isolated by family." />
        <Feature icon={Sparkles} title="AI lesson generator" desc="Claude Sonnet 5.5 drafts stage-appropriate lessons with explicit teaching, success criteria, and offline alternatives." />
        <Feature icon={Camera} title="Evidence portfolio" desc="Typed answers, photos of paper work, scans, audio, video — stored securely with parent review." />
        <Feature icon={Calendar} title="Family calendar" desc="Month, week and day planning. Drag-drop lessons. Catch-up days, excursions, and co-ops." />
        <Feature icon={BookOpen} title="Curriculum audit" desc="See lessons without outcomes, missing evidence, unapproved resources and coverage gaps." />
        <Feature icon={Printer} title="Print & offline" desc="Every lesson can be printed and completed on paper. Upload a photo of the finished work later." />
        <Feature icon={ShieldCheck} title="Child privacy" desc="No public profiles. Each child only sees their own assigned work. Family data stays isolated." />
        <Feature icon={Compass} title="Side Quests" desc="Seasonal, cultural and current-interest lessons mapped to genuine curriculum outcomes." />
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>Side Quest Learning · Supports NSW initial curriculum. Architecture ready for other jurisdictions.</p>
      </footer>
    </div>
  );
}
