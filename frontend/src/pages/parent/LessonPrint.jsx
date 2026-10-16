import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Printer } from "lucide-react";
import { api } from "../../lib/api";
import LessonDocument from "../../components/parent/LessonDocument";

// Print-friendly lesson: the student worksheet by default, or the full parent copy with answers (?answers=1).
export default function LessonPrint() {
  const { id } = useParams();
  const [qs] = useSearchParams();
  const answers = qs.get("answers") === "1";
  const [lesson, setLesson] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { api.get(`/lessons/${id}`).then(r => setLesson(r.data)).catch(e => setErr(e.response?.data?.detail || "Could not open this lesson")); }, [id]);
  if (err) return <div className="p-8 text-rose-700" role="alert">{err}</div>;
  if (!lesson) return <div className="p-8 text-sm text-slate-500">Loading…</div>;
  return (
    <div className="min-h-screen bg-[#F5EFE0] p-4 print:bg-white print:p-0" data-testid="print-page">
      <div className="max-w-3xl mx-auto mb-4 space-y-3 print:hidden" data-testid="print-preview-controls">
        <p className="text-xs font-bold uppercase tracking-widest text-[#4A5D3A]">Side-Quest · Paper learning</p>
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/print/lesson/${id}`} aria-current={!answers ? "page" : undefined} className={`rounded-xl px-4 py-2 text-sm font-bold border-2 ${!answers ? "bg-[#1F3B2D] text-white border-[#1F3B2D]" : "bg-white text-[#1F3B2D] border-[#D4C8A8]"}`} data-testid="print-student-tab">Student workbook</Link>
          <Link to={`/print/lesson/${id}?answers=1`} aria-current={answers ? "page" : undefined} className={`rounded-xl px-4 py-2 text-sm font-bold border-2 ${answers ? "bg-[#1F3B2D] text-white border-[#1F3B2D]" : "bg-white text-[#1F3B2D] border-[#D4C8A8]"}`} data-testid="print-parent-tab">Parent guide &amp; answers</Link>
        </div>
        <p className="text-xs text-[#54634D]">{answers ? "Includes the teaching guide, suggested answers and curriculum references." : "Ready for handwriting, without parent-only answers or teaching notes."}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => window.print()} className="rounded-full bg-[#1F3B2D] text-white px-5 py-2.5 text-sm font-semibold flex items-center gap-1 hover:bg-[#345a42]" data-testid="print-now"><Printer size={16} /> Print or save as PDF</button>
          <Link className="underline text-sm text-[#1F3B2D]" to={`/print/lesson/${id}${answers ? "" : "?answers=1"}`} data-testid="print-switch">{answers ? "Switch to student workbook" : "Switch to parent answers"}</Link>
          <Link className="underline text-sm text-[#1F3B2D]" to={`/parent/lessons/${id}/review`}>Back to lesson</Link>
        </div>
      </div>
      <LessonDocument lesson={lesson} view={answers ? "parent" : "student"} />
    </div>
  );
}
