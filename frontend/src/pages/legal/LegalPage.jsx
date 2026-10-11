import React, { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Mail, ChevronDown } from "lucide-react";
import { PAGES, CONTACT_EMAIL, PRIVACY_EMAIL, LAST_UPDATED } from "./legalContent";

const SUBJECTS = {
  general: [CONTACT_EMAIL, "Side Quest enquiry"],
  problem: [CONTACT_EMAIL, "Side Quest problem report"],
  access: [PRIVACY_EMAIL, "Data access request"],
  correction: [PRIVACY_EMAIL, "Data correction request"],
  complaint: [PRIVACY_EMAIL, "Privacy complaint"],
};

// Help & FAQ: these headings are theme labels, not questions.
const HELP_GROUPS = new Set([
  "The basics",
  "Pets, hints and rewards",
  "Lessons and learning",
  "Signing in",
  "Safety and privacy",
  "Your information and account",
  "When things go wrong",
]);
// Help & FAQ: shown as plain text, not dropdowns.
const HELP_PLAIN = new Set(["Welcome, adventurer", "Still stuck?"]);

function SectionBody({ s }) {
  return (
    <>
      {s.p && <p className="text-stone-700 leading-relaxed">{s.p}</p>}
      {s.items && (
        <ul className="mt-2 space-y-1.5 list-disc pl-5 text-stone-700 leading-relaxed">
          {s.items.map((it) => <li key={it}>{it}</li>)}
        </ul>
      )}
    </>
  );
}

function FaqItem({ s, id }) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${id}`;
  return (
    <div className="rounded-xl border bg-white/70" style={{ borderColor: "#E4DAC0" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
        data-testid={`faq-toggle-${id}`}
      >
        <span className="font-display text-base font-bold" style={{ color: "#1F3B2D" }}>{s.h}</span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-200"
          style={{ color: "#1F3B2D", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div id={panelId} className="px-4 pb-4">
          <SectionBody s={s} />
        </div>
      )}
    </div>
  );
}

function HelpSections({ sections }) {
  return (
    <div className="mt-8 space-y-3">
      {sections.map((s, i) => {
        if (HELP_PLAIN.has(s.h)) {
          return (
            <section key={`${s.h}-${i}`} className="pt-2">
              <h2 className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>{s.h}</h2>
              <div className="mt-1"><SectionBody s={s} /></div>
            </section>
          );
        }
        if (HELP_GROUPS.has(s.h)) {
          return (
            <div key={`${s.h}-${i}`} className="pt-6">
              <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>{s.h}</h2>
              {s.p && <p className="mt-0.5 text-sm text-stone-600">{s.p}</p>}
            </div>
          );
        }
        return <FaqItem key={`${s.h}-${i}`} s={s} id={i} />;
      })}
    </div>
  );
}

export default function LegalPage({ base = "/parent/trust", publicView = false }) {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page || (publicView && !page.public)) return <Navigate to={publicView ? "/" : base} replace />;
  const mail = page.contact ? SUBJECTS[page.contact] : null;
  return (
    <div className={publicView ? "min-h-screen" : ""} style={publicView ? { backgroundColor: "#FBF7EC" } : {}}>
      <div className="max-w-3xl mx-auto px-6 py-10" data-testid={`legal-${slug}`}>
        <Link to={publicView ? "/" : base} className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6" style={{ color: "#1F3B2D" }}>
          <ArrowLeft size={14} /> {publicView ? "Back to Side Quest" : "Back to Trust & Support"}
        </Link>
        <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>{page.title}</h1>
        <p className="mt-2 text-stone-600">{page.summary}</p>
        <p className="mt-1 text-xs text-stone-500">Last updated {LAST_UPDATED}</p>
        {slug === "help" ? (
          <HelpSections sections={page.sections} />
        ) : (
          <div className="mt-8 space-y-6">
            {page.sections.map((s, i) => (
              <section key={`${s.h}-${i}`}>
                <h2 className="font-display text-lg font-bold" style={{ color: "#1F3B2D" }}>{s.h}</h2>
                {s.p && <p className="mt-1 text-stone-700 leading-relaxed">{s.p}</p>}
                {s.items && (
                  <ul className="mt-2 space-y-1.5 list-disc pl-5 text-stone-700 leading-relaxed">
                    {s.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
        {mail && (
          <a href={`mailto:${mail[0]}?subject=${encodeURIComponent(mail[1])}`} className="mt-8 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="legal-mail-btn">
            <Mail size={16} /> Email us
          </a>
        )}
      </div>
    </div>
  );
}
