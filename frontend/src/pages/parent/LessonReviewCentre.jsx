import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, BookMarked, House, Library, RefreshCw } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import QuestBookLessonsAdmin from "../../components/parent/QuestBookLessonsAdmin";

/**
 * Owner publishing workspace. Family-created lessons remain private and never
 * enter the book / standalone commercial queues just because they were drafted.
 * Child submission review is intentionally a separate workflow.
 */
export default function LessonReviewCentre() {
  const { user } = useAuth();
  const [tab, setTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [bookId, setBookId] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    try {
      const [catalogue, library] = await Promise.all([
        api.get("/quest-books", { params: { _: Date.now() } }),
        api.get("/lessons", { params: { _: Date.now() } }),
      ]);
      if (!catalogue.data.owner) throw new Error("This workspace is only available to the platform owner.");
      setBooks(catalogue.data.books || []);
      setLessons(library.data || []);
      setError("");
    } catch (e) { setError(apiErrorMessage(e, "Could not load the owner review centre")); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (user?.is_platform_owner) void load(); }, [user?.is_platform_owner]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!user?.is_platform_owner) return <Navigate to="/parent/lessons" replace />;

  const personal = lessons.filter((l) => !l.quest_book_id && l.source !== "side_quest_standalone");
  const standalone = lessons.filter((l) => !l.quest_book_id && l.source === "side_quest_standalone");
  const bookDrafts = lessons.filter((l) => l.quest_book_id && l.source !== "side_quest_book");
  const matching = (value) => String(value || "").toLowerCase().includes(search.trim().toLowerCase());
  const selected = books.find((b) => b.id === bookId);
  const tabs = [
    ["books", "Book companion lessons", books.length],
    ["standalone", "Official standalone lessons", standalone.length],
    ["personal", "My family lessons", personal.length],
  ];
  const copyToOfficial = async (lesson) => {
    if (!window.confirm(`Create a separate official standalone draft from “${lesson.title}”? Your family lesson will stay private and nothing will be published.`)) return;
    try {
      const r = await api.post(`/quest-books/admin/lessons/${encodeURIComponent(lesson.id)}/copy-to-standalone`);
      await load();
      setTab("standalone");
      toast.success(r.data.message || "Official standalone draft created.");
    } catch (e) {
      toast.error(apiErrorMessage(e, "Could not copy this family lesson"));
    }
  };
  const lessonCard = (l, allowCopy = false) => (
    <div key={l.id} className="rounded-xl border border-stone-200 bg-white p-4 space-y-2">
      <h3 className="font-semibold text-emerald-950">{l.title}</h3>
      <p className="text-xs text-stone-600">{[l.year_level, l.learning_area, l.status === "ready" ? "Saved Ready" : "Draft"].filter(Boolean).join(" · ")}</p>
      <div className="flex items-center gap-3 flex-wrap">
        <Link className="inline-block text-sm font-bold text-emerald-800 underline" to={`/parent/lessons/${l.id}/review`}>Open lesson</Link>
        {allowCopy && <button type="button" onClick={() => void copyToOfficial(l)} className="text-sm font-bold text-violet-800 underline">Copy to official standalone drafts</button>}
      </div>
    </div>
  );
  return (
    <div className="max-w-6xl p-4 sm:p-8 space-y-5" data-testid="owner-lesson-review-centre">
      <div className="flex justify-between gap-3 flex-wrap items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-emerald-950">Lesson Review Centre</h1>
          <p className="text-sm text-slate-600 mt-1">Review your published-content drafts separately from the lessons you make for your children.</p>
        </div>
        <button className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold flex items-center gap-2" onClick={() => { setLoading(true); void load(); }}><RefreshCw size={15} /> Refresh</button>
      </div>
      {error && <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">{error}</p>}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lesson collections">
        {tabs.map(([key, label, n]) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => { setTab(key); setBookId(""); setSearch(""); }}
            className={`rounded-full px-4 py-2 text-sm font-semibold border ${tab === key ? "bg-emerald-900 text-white border-emerald-900" : "bg-white text-emerald-950 border-emerald-300"}`}>
            {label} ({n})
          </button>
        ))}
      </div>
      {loading ? <p role="status" className="text-sm text-stone-600">Loading lesson collections…</p> : <>
        {tab === "books" && (
          selected ? (
            <div className="space-y-3">
              <button type="button" className="text-sm text-emerald-900 font-bold flex items-center gap-1" onClick={() => setBookId("")}><ArrowLeft size={15} /> All books</button>
              <p className="text-sm font-semibold text-stone-700">{selected.title} · {selected.year_label} · {selected.subject_label}</p>
              <QuestBookLessonsAdmin key={selected.id} book={selected} onChanged={load} />
              <Link to={`/parent/quest-books/${encodeURIComponent(selected.id)}?workspace=lessons`} className="inline-block text-sm font-bold text-emerald-900 underline">Open the complete book workspace</Link>
            </div>
          ) : (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="font-bold text-emerald-950 flex gap-2 items-center"><BookMarked size={18} /> Official book collection</h2>
                <input type="search" aria-label="Search books" placeholder="Find a book…" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm" />
              </div>
              <p className="text-sm text-stone-600">Select a book to see its real review progress, saved approvals, draft lessons and publication controls. Private family lessons are never counted.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {books.filter((b) => matching(b.title) || matching(b.year_label) || matching(b.subject_label)).map((b) => {
                  const drafts = bookDrafts.filter((l) => l.quest_book_id === b.id).length;
                  return <button key={b.id} type="button" onClick={() => setBookId(b.id)} className="text-left rounded-xl border border-emerald-200 bg-white p-4 hover:border-emerald-700 space-y-2">
                    <h3 className="font-bold text-emerald-950">{b.title}</h3>
                    <p className="text-xs text-stone-600">{b.year_label} · {b.subject_label}</p>
                    <p className="text-xs text-stone-600">{drafts} working draft{drafts === 1 ? "" : "s"} · {b.has_lessons ? "Lessons published" : "Not yet published"}</p>
                    <span className="text-sm font-bold text-emerald-800 underline">Open review queue</span>
                  </button>;
                })}
              </div>
              {!books.length && <p className="text-sm text-stone-600">No books have been created yet. <Link to="/parent/quest-books" className="underline">Open Quest Books</Link> to add one.</p>}
            </section>
          )
        )}
        {tab === "standalone" && <section className="space-y-3">
          <h2 className="font-bold text-emerald-950 flex items-center gap-2"><Library size={18} /> Official standalone content</h2>
          <p className="text-sm text-stone-600">Only lessons explicitly designated as official standalone content belong here. A lesson made for your family is never automatically commercial.</p>
          <div className="grid sm:grid-cols-2 gap-3">{standalone.map((l) => lessonCard(l))}</div>
          {!standalone.length && <p className="text-sm border border-dashed rounded-xl p-4 text-stone-600">No official standalone lessons are designated yet. This workspace does not publish private lessons or create a public listing automatically.</p>}
        </section>}
        {tab === "personal" && <section className="space-y-3">
          <h2 className="font-bold text-emerald-950 flex items-center gap-2"><House size={18} /> Private family lessons</h2>
          <p className="text-sm text-stone-600">Your personal homeschooling lessons stay in your own library. Opening, editing or reviewing one here does not add it to a book or make it available to other families.</p>
          <div className="grid sm:grid-cols-2 gap-3">{personal.map((l) => lessonCard(l, true))}</div>
          {!personal.length && <p className="text-sm text-stone-600">No personal lessons in your active library.</p>}
        </section>}
      </>}
      <p className="text-xs text-stone-500">Reviewing the accuracy of a lesson for publication is separate from marking a child's completed assignment.</p>
    </div>
  );
}
