import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { BookOpen, Compass, ExternalLink, FileCheck, MapPinned, ShieldCheck } from "lucide-react";
import { NATIONAL_RESOURCES, jurisdictionFor, usesNswOutcomes } from "../../data/australianCurriculum";
import { useAuth } from "../../context/AuthContext";
import { JurisdictionSelect, saveJurisdiction } from "../../components/parent/JurisdictionPicker";

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

function ChangeJurisdiction({ current }) {
  const { user, setSession } = useAuth();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(current || "");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    if (!code || code === current) { setOpen(false); return; }
    setSaving(true);
    try { await saveJurisdiction(code, setSession, user); toast.success("State or territory updated"); setOpen(false); }
    catch (err) { toast.error(err.response?.data?.detail || "Couldn't save that. Please try again."); }
    finally { setSaving(false); }
  };
  if (!open) {
    return <button type="button" onClick={() => { setCode(current || ""); setOpen(true); }} className="text-sm font-semibold underline text-emerald-800" data-testid="curriculum-change-state">Moved interstate? Change your state or territory</button>;
  }
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="curriculum-change-form">
      <div className="w-full sm:w-72"><JurisdictionSelect value={code} onChange={setCode} testid="curriculum-state-select" className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm" /></div>
      <button type="button" disabled={!code || saving} onClick={save} className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" data-testid="curriculum-state-save">{saving ? "Saving…" : "Save"}</button>
      <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700">Cancel</button>
    </div>
  );
}

function JurisdictionSection({ place }) {
  return (
    <section id={`curriculum-${place.code.toLowerCase()}`}
      className="paper-card p-4 sm:p-6 scroll-mt-24 space-y-4"
      aria-labelledby={`jurisdiction-heading-${place.code}`}
      data-testid={`curriculum-state-${place.code}`}>
      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <MapPinned size={15} aria-hidden="true" /> Your state or territory · {place.code}
      </span>
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
    </section>
  );
}


/** TASC uses accredited course identifiers, which are NOT individual outcomes. */
function TascCourseFinder() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  useEffect(() => {
    let cancelled = false;
    api.get("/curriculum/senior-courses").then(({ data }) => {
      if (cancelled) return;
      setCourses(data.available && Array.isArray(data.courses) ? data.courses : []);
      setStatus(data.available ? "ready" : "unavailable");
    }).catch(() => { if(!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, []);
  const term=query.trim().toLowerCase();
  const found=courses.filter(x=>!term || x.title.toLowerCase().includes(term) || x.code.toLowerCase().includes(term));
  return (
    <section aria-labelledby="tasc-heading" className="paper-card p-4 sm:p-6 space-y-3" data-testid="tasc-senior-course-catalogue">
      <div className="flex items-center gap-2"><BookOpen size={19} className="text-emerald-800" aria-hidden="true" />
        <h2 id="tasc-heading" className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>2026 Tasmania senior course codes</h2>
      </div>
      <p className="text-sm text-stone-700">Browse the current TASC-accredited senior subjects, including electives, Languages and Preliminary courses. <strong>These identify courses, not individual learning outcomes.</strong> They do not automatically mark any outcome as achieved.</p>
      {status==="loading" && <p className="text-sm text-stone-600">Loading official course identifiers…</p>}
      {status==="error" && <p className="text-sm text-rose-700">Could not load course identifiers. Check the <a className="underline" href="https://www.tasc.tas.gov.au/students/courses/a-z/" target="_blank" rel="noopener noreferrer">official TASC course list</a>.</p>}
      {status==="unavailable" && <p className="text-sm text-stone-700">The 2026 course-code catalogue is not available for this account yet.</p>}
      {status==="ready" && <>
        <label htmlFor="tasc-catalogue-search" className="block text-sm font-semibold">Find a senior subject or course code</label>
        <input id="tasc-catalogue-search" type="search" value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="e.g. Japanese, Biology or ACC315116" className="w-full max-w-md rounded-xl border border-stone-300 bg-white p-2.5 text-sm" />
        <p className="text-xs text-stone-600">Showing {Math.min(found.length,40)} of {found.length} matches · {courses.length} verified 2026 course identifiers</p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2" data-testid="tasc-courses">
          {found.slice(0,40).map(course=><li key={course.code} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
            <a href={course.source_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline">{course.title}</a>
            <div className="text-xs text-stone-600 mt-1"><code className="font-mono">{course.code}</code> · Level {course.level} · {course.tce_credit_points} TCE credits</div>
          </li>)}
        </ul>
        {!found.length && <p className="text-sm text-stone-600">No courses match that search.</p>}
        <p className="text-xs text-stone-600">Verified against the <a className="underline" href="https://www.tasc.tas.gov.au/students/courses/a-z/" target="_blank" rel="noopener noreferrer">TASC current-year course list</a>. Re-check the official catalogue for 2027 or later.</p>
      </>}
    </section>
  );
}

export default function Curriculum() {
  const { user } = useAuth();
  const place = jurisdictionFor(user?.jurisdiction);
  const nsw = usesNswOutcomes(user?.jurisdiction);
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-9 max-w-7xl mx-auto" data-testid="curriculum-page">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
          <Compass size={17} aria-hidden="true" /> Your curriculum compass
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold" style={{ color: "#1F3B2D" }}>
          {place ? `Home education in ${place.name}` : "Home education in your state or territory"}
        </h1>
        <p className="text-base leading-relaxed text-stone-700 max-w-3xl">
          Side-Quest welcomes Australian families wherever they live. Here are the official home education,
          curriculum and record-keeping resources for <strong>{place ? place.name : "your state or territory"}</strong>, plus national resources that are useful anywhere.
        </p>
        {place && <ChangeJurisdiction current={place.code} />}
      </header>

      {place && <JurisdictionSection place={place} />}

      {place?.code === "TAS" && <TascCourseFinder />}

      <section className="paper-card p-4 sm:p-6 border-l-4" style={{ borderLeftColor: "#4A5D3A" }} aria-labelledby="mapping-heading">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={20} className="text-emerald-800 shrink-0" aria-hidden="true" />
          <h2 id="mapping-heading" className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>How Side-Quest fits with your local rules</h2>
        </div>
        <p className="text-sm leading-relaxed text-stone-700">
          Plan your learning, create and assign lessons, use your family calendar, see progress and collect the little wins in your Evidence Backpack.
          Side-Quest helps you organise learning; it doesn't register a child or certify a program, so check what your authority actually asks for.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600" data-testid="curriculum-outcome-note">
          {nsw
            ? "Automatic outcome suggestions and the learning plan writer use the NSW syllabus outcome list. They are suggestions for you to check, not official confirmation."
            : `Side-Quest doesn't hold the ${place ? place.code : "local"} outcome list yet, so automatic outcome suggestions and the learning plan writer are switched off for your family rather than showing NSW outcomes that don't apply. Record outcomes yourself from your official curriculum above.`}
        </p>
      </section>

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
        <p className="text-xs leading-relaxed text-stone-500">Official links and rules can change. Always check the current details on the linked authority's website.</p>
      </section>
    </div>
  );
}
