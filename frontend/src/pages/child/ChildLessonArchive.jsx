import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { FolderOpen } from "lucide-react";

const DONE = new Set(["accepted", "demonstrated", "completed"]);
export default function ChildLessonArchive() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/assignments").then(({ data }) => {
      setLessons((Array.isArray(data) ? data : []).filter(a => DONE.has(a.status)));
    }).catch(() => setError("Couldn't load your completed lessons. Try again later."))
      .finally(() => setLoading(false));
  }, []);
  const groups = lessons.reduce((out, a) => {
    const subject = a.lesson?.learning_area || "Other";
    (out[subject] ||= []).push(a);
    return out;
  }, {});
  return <main className="space-y-6" data-testid="child-lesson-archive">
    <header className="space-y-2">
      <h1 className="font-display text-3xl font-bold flex items-center gap-3"><FolderOpen /> Completed Lessons</h1>
      <p className="text-sm opacity-75">Your completed quests are tucked away here, organised by subject. You can revisit them any time. Your work and feedback stay in My Portfolio.</p>
      <Link className="underline text-teal-700" to="/child/portfolio">Open My Portfolio</Link>
    </header>
    {loading && <p>Loading your archive…</p>}
    {error && <p role="alert">{error}</p>}
    {!loading && !error && lessons.length === 0 && <p>No completed lessons yet. Finish a quest to see it here!</p>}
    {Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([subject, entries]) =>
      <section key={subject} className="rounded-2xl bg-white border border-slate-200 p-5">
        <h2 className="font-display text-xl font-semibold mb-3">{subject} <span className="text-sm opacity-60">({entries.length})</span></h2>
        <div className="space-y-2">{entries.map(a =>
          <Link key={a.id} to={`/child/lesson/${a.id}`} className="block rounded-xl border border-slate-200 p-3 hover:border-teal-500">
            <span className="font-semibold">{a.lesson?.title || "Completed lesson"}</span>
            <span className="block text-xs opacity-70 mt-1">
              {a.updated_at ? `Completed ${new Date(a.updated_at).toLocaleDateString("en-AU")}` : "Completed"}
            </span>
          </Link>
        )}</div>
      </section>)}
  </main>;
}
