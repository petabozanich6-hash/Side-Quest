import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Compass, ExternalLink, FileCheck, MapPinned, ShieldCheck } from "lucide-react";
import { AUSTRALIAN_JURISDICTIONS, NATIONAL_RESOURCES } from "../../data/australianCurriculum";

const CATEGORY_STYLE = {
  Registration: "bg-emerald-50 text-emerald-800",
  Curriculum: "bg-violet-50 text-violet-800",
  Planning: "bg-amber-50 text-amber-800",
  Records: "bg-sky-50 text-sky-800",
};

function ResourceLink({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      data-testid="curriculum-resource"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          {resource.category && (
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${CATEGORY_STYLE[resource.category] || "bg-stone-100 text-stone-700"}`}>
              {resource.category}
            </span>
          )}
          <div className="mt-2 text-sm font-bold leading-snug" style={{ color: "#1F3B2D" }}>{resource.title}</div>
        </div>
        <ExternalLink size={16} aria-hidden="true" className="shrink-0 text-stone-500 mt-1" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{resource.desc}</p>
      <span className="mt-2 block text-xs text-stone-500 break-all">{new URL(resource.url).hostname}</span>
      <span className="sr-only"> (opens a government or curriculum website in a new tab)</span>
    </a>
  );
}

export default function Curriculum() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-9 max-w-7xl mx-auto" data-testid="curriculum-page">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
          <Compass size={17} aria-hidden="true" /> Your curriculum compass
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold" style={{ color: "#1F3B2D" }}>Home education around Australia</h1>
        <p className="text-base leading-relaxed text-stone-700 max-w-3xl">
          Different places, different requirements — and every family has its own way of learning.
          We've gathered official home education, curriculum and record-keeping resources for
          <strong> all eight Australian states and territories</strong>, so you can find the right starting point.
        </p>
        <p className="text-sm text-stone-600 max-w-3xl">
          Browse every jurisdiction below for now. A future account update will use the state or
          territory selected when your family signs up to show the most relevant guidance automatically.
          <strong> No location is saved from this page.</strong>
        </p>
      </header>

      <section className="paper-card p-4 sm:p-6 border-l-4" style={{ borderLeftColor: "#4A5D3A" }} aria-labelledby="mapping-heading">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={20} className="text-emerald-800 shrink-0" aria-hidden="true" />
          <h2 id="mapping-heading" className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>What Side-Quest supports right now</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-stone-700 leading-relaxed">
          <p><strong>For every Australian family:</strong> create and assign lessons, use the family calendar, follow progress and collect learning records in your Evidence Backpack.</p>
          <p><strong>NSW outcome mapping only:</strong> the built-in outcome codes, suggested matches, stage-based subject patterns and AP visit pack are based on NSW. Those features are <strong>not yet adapted</strong> for other jurisdictions.</p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          The official authority for your state or territory decides what registration, curriculum and
          evidence it requires. Side-Quest can help you organise information, but it cannot register
          your child, certify a learning program or guarantee an inspection outcome.
        </p>
      </section>

      <nav className="space-y-3" aria-label="Jump to your state or territory">
        <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Find your part of Australia</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AUSTRALIAN_JURISDICTIONS.map((place) => (
            <a key={place.code} href={`#curriculum-${place.code.toLowerCase()}`}
              className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-left hover:shadow-sm hover:border-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
              data-testid={`curriculum-jump-${place.code}`}>
              <span className="block text-xs font-bold text-emerald-800">{place.code}</span>
              <span className="block text-sm font-semibold text-stone-800 mt-1">{place.name}</span>
            </a>
          ))}
        </div>
      </nav>

      <section aria-labelledby="australia-wide-heading" className="space-y-4">
        <div className="flex items-center gap-2"><BookOpen aria-hidden="true" size={20} className="text-emerald-800" />
          <h2 id="australia-wide-heading" className="font-display text-2xl font-bold" style={{ color: "#1F3B2D" }}>Useful wherever you call home</h2>
        </div>
        <p className="text-sm text-stone-600 max-w-3xl">
          These national resources can help with planning and finding teaching ideas. The Australian
          Curriculum is a useful reference, but it doesn't replace your local home education rules.
        </p>
        <div className="grid md:grid-cols-3 gap-3" data-testid="curriculum-national-resources">
          {NATIONAL_RESOURCES.map((resource) => <ResourceLink key={resource.url} resource={resource} />)}
        </div>
      </section>

      <div className="space-y-7" data-testid="curriculum-jurisdictions">
        {AUSTRALIAN_JURISDICTIONS.map((place) => (
          <section key={place.code} id={`curriculum-${place.code.toLowerCase()}`}
            className="paper-card p-4 sm:p-6 scroll-mt-24 space-y-4"
            aria-labelledby={`jurisdiction-heading-${place.code}`}
            data-testid={`curriculum-state-${place.code}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <MapPinned size={15} aria-hidden="true" /> {place.code}
              </span>
              {place.code === "NSW" && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">NSW outcome tools available</span>}
            </div>
            <div>
              <h2 id={`jurisdiction-heading-${place.code}`} className="font-display text-2xl sm:text-3xl font-bold" style={{ color: "#1F3B2D" }}>{place.name}</h2>
              <p className="mt-1 text-xs text-stone-600"><strong>Responsible authority:</strong> {place.authority}</p>
            </div>
            <p className="text-sm leading-relaxed text-stone-700">{place.intro}</p>
            <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 sm:p-4 flex gap-3">
              <FileCheck size={18} aria-hidden="true" className="shrink-0 mt-0.5 text-emerald-800" />
              <p className="text-sm leading-relaxed text-stone-700"><strong>Good to know:</strong> {place.focus}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {place.links.map((resource) => <ResourceLink key={`${place.code}-${resource.title}`} resource={resource} />)}
            </div>
            {place.code !== "NSW" && (
              <p className="text-xs leading-relaxed text-stone-600">
                Side-Quest's existing automatic outcome suggestions and syllabus stages are NSW-based.
                Use your local guidance above when planning and reviewing a program for {place.name}.
              </p>
            )}
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-6 space-y-3">
        <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>A little help keeping track</h2>
        <p className="text-sm leading-relaxed text-stone-700">
          You don't have to collect everything at once. Start with your local registration guidance,
          build a realistic learning plan, then add lesson work, notes and everyday discoveries to the
          <strong> Evidence Backpack</strong> as you go. Check what your own authority actually asks for
          before preparing any report or review.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/parent/evidence" className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white">Open Evidence Backpack</Link>
          <Link to="/parent/lessons" className="rounded-full border border-stone-400 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800">My lessons</Link>
        </div>
        <p className="text-xs leading-relaxed text-stone-500">Official links and rules can change. This directory was reviewed in October 2026. Always confirm the latest details on the linked authority's website.</p>
      </section>
    </div>
  );
}
