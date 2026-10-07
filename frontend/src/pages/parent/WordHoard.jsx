import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";

const BUTTON_STYLE = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };
const STAGES = [
  ["wild", "🥚 Wild"],
  ["spotted", "👀 Spotted"],
  ["tamed", "🐾 Tamed"],
  ["mastered", "🏆 Mastered"],
];

export default function ParentWordHoard() {
  const [students, setStudents] = useState(null);
  const [sid, setSid] = useState("");
  const [report, setReport] = useState(null);
  const [newWords, setNewWords] = useState("");

  useEffect(() => {
    api
      .get("/students")
      .then((res) => {
        setStudents(res.data);
        if (res.data.length) setSid(res.data[0].id);
      })
      .catch(() => {
        setStudents([]);
        toast.error("Could not load your children");
      });
  }, []);

  const load = useCallback(() => {
    if (!sid) return Promise.resolve();
    return api
      .get(`/word-bank/parent/${sid}`)
      .then((res) => setReport(res.data))
      .catch(() => toast.error("Could not load the Hoard Report"));
  }, [sid]);

  useEffect(() => {
    setReport(null);
    load();
  }, [load]);

  const addWords = async (e) => {
    e.preventDefault();
    const list = newWords.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
    if (!list.length) return;
    try {
      const { data } = await api.post("/word-bank/words", { words: list, student_id: sid, source: "manual" });
      toast.success(`${data.added.length} added${data.skipped.length ? `, ${data.skipped.length} already there` : ""}`);
      setNewWords("");
      load();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Could not add words");
    }
  };

  const removeWord = async (id) => {
    try {
      await api.delete(`/word-bank/${id}`);
      load();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Could not remove the word");
    }
  };

  const cheer = async (word) => {
    try {
      await api.post("/cheers", {
        student_id: sid,
        message: `You mastered “${word}” in your Word Hoard! Brilliant spelling.`,
        emoji: "🏆",
      });
      toast.success("Cheer sent");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Could not send the cheer");
    }
  };

  if (students === null) return <div className="text-stone-500">Loading…</div>;
  if (students.length === 0) return <div className="text-stone-600">Add a child first to start a Word Hoard.</div>;

  const summary = report?.summary;

  return (
    <div className="space-y-6 animate-in" data-testid="parent-word-hoard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>
          Hoard Report
        </h1>
        <select
          value={sid}
          onChange={(e) => setSid(e.target.value)}
          className="rounded-xl border px-3 py-2 text-sm bg-white"
          style={{ borderColor: "#D4C8A8" }}
          aria-label="Choose a child"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {!report && <div className="text-stone-500">Loading…</div>}

      {report && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STAGES.map(([key, label]) => (
              <div key={key} className="paper-card p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: "#1F3B2D" }}>{summary.counts?.[key] || 0}</div>
                <div className="text-xs text-stone-600">{label}</div>
              </div>
            ))}
          </div>

          <div className="paper-card p-4 text-sm text-stone-700 grid gap-1">
            <div>🔥 Streak: <strong>{summary.streak}</strong> day{summary.streak === 1 ? "" : "s"}</div>
            <div>📅 Practised on <strong>{summary.days_this_week}</strong> of the last 7 days</div>
            <div>
              🎯 Accuracy this week:{" "}
              <strong>{summary.accuracy_this_week === null ? "no practice yet" : `${summary.accuracy_this_week}%`}</strong>
              {summary.attempts_this_week ? ` (${summary.attempts_this_week} tries)` : ""}
            </div>
            <div>{summary.practised_today ? "✅ Practised today" : "⏳ Not practised yet today"}</div>
          </div>

          <section className="paper-card p-4">
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "#1F3B2D" }}>Tricky words</h2>
            {report.tricky_words.length === 0 ? (
              <p className="text-sm text-stone-600">No words have been missed more than once. Lovely.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {report.tricky_words.map((w) => (
                  <li key={w.id}>
                    <strong>{w.word}</strong> · missed {w.misses}× · {w.stage_label}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="paper-card p-4">
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "#1F3B2D" }}>Recently mastered</h2>
            {report.recently_mastered.length === 0 ? (
              <p className="text-sm text-stone-600">Nothing mastered yet.</p>
            ) : (
              <ul className="text-sm space-y-2">
                {report.recently_mastered.map((w) => (
                  <li key={w.id} className="flex items-center justify-between gap-2">
                    <span>🏆 <strong>{w.word}</strong></span>
                    <button
                      type="button"
                      onClick={() => cheer(w.word)}
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={BUTTON_STYLE}
                    >
                      Send a cheer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="paper-card p-4">
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "#1F3B2D" }}>Recent practice</h2>
            {report.recent_practice.length === 0 ? (
              <p className="text-sm text-stone-600">No practice yet.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {report.recent_practice.slice(0, 12).map((p) => (
                  <li key={p.id}>
                    {p.correct ? "✅" : "❌"} {p.word} <span className="text-stone-500">· {p.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form onSubmit={addWords} className="paper-card p-4 space-y-2">
            <label htmlFor="parent-new-words" className="text-sm font-bold" style={{ color: "#1F3B2D" }}>
              Add spelling words
            </label>
            <textarea
              id="parent-new-words"
              value={newWords}
              onChange={(e) => setNewWords(e.target.value)}
              rows={3}
              placeholder="One word per line, or separate with commas"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              style={{ borderColor: "#D4C8A8" }}
            />
            <button type="submit" className="rounded-full px-5 py-2 text-sm font-bold" style={BUTTON_STYLE}>
              Add to hoard
            </button>
          </form>

          <section className="paper-card p-4">
            <h2 className="font-display text-lg font-bold mb-2" style={{ color: "#1F3B2D" }}>All words ({report.words.length})</h2>
            <div className="flex flex-wrap gap-2">
              {report.words.map((w) => (
                <span key={w.id} className="rounded-full border px-3 py-1 text-xs bg-white" style={{ borderColor: "#D4C8A8" }}>
                  {w.word} · {w.stage_label}
                  <button
                    type="button"
                    onClick={() => removeWord(w.id)}
                    className="ml-2 text-stone-400 hover:text-red-600"
                    aria-label={`Remove ${w.word}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
