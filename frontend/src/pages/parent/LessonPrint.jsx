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
      <div className="max-w-3xl mx-auto mb-4 flex flex-wrap items-center gap-3 print:hidden">
        <button onClick={() => window.print()} className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-semibold flex items-center gap-1" data-testid="print-now"><Printer size={14} /> Print or save as PDF</button>
        <Link className="underline text-sm" to={`/print/lesson/${id}${answers ? "" : "?answers=1"}`} data-testid="print-switch">{answers ? "Show the student worksheet instead" : "Show my copy with answers instead"}</Link>
        <Link className="underline text-sm" to={`/parent/lessons/${id}/review`}>Back to the lesson</Link>
      </div>
      <LessonDocument lesson={lesson} view={answers ? "parent" : "student"} />
    </div>
  );
}
