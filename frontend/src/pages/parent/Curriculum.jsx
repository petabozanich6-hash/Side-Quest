import React from "react";
import { ExternalLink } from "lucide-react";

const LINKS = [
  {
    title: "NSW Curriculum",
    url: "https://curriculum.nsw.edu.au",
    desc: "The official NSW syllabuses for Kindergarten to Year 12: outcomes, content, and support material for every stage and subject.",
  },
  {
    title: "NSW Education Standards Authority (NESA)",
    url: "https://educationstandards.nsw.edu.au",
    desc: "Registration and home education requirements, mandatory subjects, the Record of School Achievement, and the HSC.",
  },
];

export default function Curriculum() {
  return (
    <div className="p-8 lg:p-10 space-y-6" data-testid="curriculum-page">
      <header>
        <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Curriculum</h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Syllabus outcomes and requirements are set by NESA and can change. Use the official sites below as your source, and check them before planning each term.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
        {LINKS.map(l => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="paper-card p-6 block hover:shadow-md transition-shadow" data-testid={`curriculum-link-${l.url.replace(/https?:\/\//, "").split(".")[0]}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="font-display text-xl font-bold" style={{color:"#1F3B2D"}}>{l.title}</div>
              <ExternalLink size={16} className="text-stone-400 shrink-0 mt-1"/>
            </div>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">{l.desc}</p>
            <div className="mt-3 font-mono text-xs text-stone-500">{l.url.replace("https://", "")}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
