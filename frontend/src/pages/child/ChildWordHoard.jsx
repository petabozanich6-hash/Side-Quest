import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";

const BUTTON_STYLE = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };

const STAGE_INFO = {
  wild: { emoji: "🥚", title: "Wild", blurb: "Not tamed yet" },
  spotted: { emoji: "👀", title: "Spotted", blurb: "You have met these" },
  tamed: { emoji: "🐾", title: "Tamed", blurb: "Almost yours" },
  mastered: { emoji: "🏆", title: "Mastered", blurb: "In your hoard for good" },
};

function speak(word) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(word);
  utter.rate = 0.8;
  window.speechSynthesis.speak(utter);
  return true;
}

export default function ChildWordHoard() {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(null);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [newWords, setNewWords] = useState("");

  const load = useCallback(
    () =>
      api
        .get("/word-bank")
        .then((res) => setData(res.data))
        .catch(() => {
          setData({ summary: { total: 0, counts: {}, streak: 0 }, words: {}, to_tame_today: [], stages: [] });
          toast.error("Could not load your Word Hoard");
        }),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  if (data === null) {
    return <div className="text-stone-500">Loading…</div>;
  }

  const { summary, words, to_tame_today: queue } = data;

  const start = (word) => {
    setCurrent(word);
    setGuess("");
    setResult(null);
    if (!speak(word.word)) toast.info(`Your word starts with “${word.word[0]}”`);
  };

  const check = async (e) => {
    e.preventDefault();
    if (!current || !guess.trim()) return;
    const correct = guess.trim().toLowerCase() === current.word;
    setBusy(true);
    try {
      const { data: res } = await api.post("/word-bank/practice", {
        word_id: current.id,
        correct,
      });
      setResult({ ...res, correct });
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Could not save that try");
    } finally {
      setBusy(false);
    }
  };

  const nextWord = async () => {
    setCurrent(null);
    setResult(null);
    await load();
  };

  const addWords = async (e) => {
    e.preventDefault();
    const list = newWords.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
    if (!list.length) return;
    try {
      const { data: res } = await api.post("/word-bank/words", { words: list, source: "manual" });
      toast.success(`${res.added.length} new wild word${res.added.length === 1 ? "" : "s"} found`);
      setNewWords("");
      load();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Could not add words");
    }
  };

  return (
    <div className="space-y-6 animate-in" data-testid="child-word-hoard">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>
          The Word Hoard
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Spell each wild word right on different days to tame it.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.keys(STAGE_INFO).map((stage) => (
          <div key={stage} className="paper-card p-3 text-center">
            <div className="text-2xl">{STAGE_INFO[stage].emoji}</div>
            <div className="text-2xl font-bold" style={{ color: "#1F3B2D" }}>
              {summary.counts?.[stage] || 0}
            </div>
            <div className="text-xs text-stone-600">{STAGE_INFO[stage].title}</div>
          </div>
        ))}
        <div className="paper-card p-3 text-center">
          <div className="text-2xl">🔥</div>
          <div className="text-2xl font-bold" style={{ color: "#1F3B2D" }}>
            {summary.streak || 0}
          </div>
          <div className="text-xs text-stone-600">Day streak</div>
        </div>
      </div>

      <section className="paper-card p-6" data-testid="tame-panel">
        <h2 className="font-display text-xl font-bold mb-3" style={{ color: "#1F3B2D" }}>
          Words to tame today
        </h2>

        {!current && queue.length === 0 && (
          <p className="text-sm text-stone-700">
            {summary.total === 0
              ? "No words yet. Add some below to begin your hoard."
              : "You have tamed everything for today. Come back tomorrow!"}
          </p>
        )}

        {!current && queue.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {queue.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => start(w)}
                className="rounded-full border px-4 py-2 text-sm bg-white hover:translate-y-[-2px] transition"
                style={{ borderColor: "#C77B5B" }}
              >
                {STAGE_INFO[w.stage].emoji} Tame a {w.stage} word
              </button>
            ))}
          </div>
        )}

        {current && !result && (
          <form onSubmit={check} className="space-y-3 text-center">
            <p className="text-sm text-stone-700">Listen, then spell the word.</p>
            <button
              type="button"
              onClick={() => speak(current.word)}
              className="rounded-full px-5 py-2 text-sm font-bold"
              style={BUTTON_STYLE}
            >
              🔊 Hear it again
            </button>
            {current.hint && <p className="text-xs text-stone-500">Hint: {current.hint}</p>}
            <div>
              <input
                autoFocus
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="rounded-xl border-2 px-4 py-3 text-xl text-center"
                style={{ borderColor: "#D4C8A8" }}
                aria-label="Type the word"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-full px-6 py-3 text-sm font-bold disabled:opacity-50"
              style={BUTTON_STYLE}
            >
              Check
            </button>
          </form>
        )}

        {current && result && (
          <div className="text-center space-y-2" data-testid="tame-result">
            <div className="text-5xl">{result.correct ? (result.just_mastered ? "🏆" : "🎉") : "🌱"}</div>
            <h3 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>
              {result.correct
                ? result.moved
                  ? `It is now ${result.new_stage}!`
                  : "Spot on! You tamed this one already today."
                : `Nearly! It is spelled “${current.word}”.`}
            </h3>
            {result.xp_gained > 0 && (
              <p className="text-sm text-stone-700">+{result.xp_gained} XP for your pet</p>
            )}
            {!result.correct && (
              <p className="text-sm text-stone-600">It slips back a stage. You will meet it again.</p>
            )}
            <button
              type="button"
              onClick={nextWord}
              className="mt-2 rounded-full px-6 py-3 text-sm font-bold"
              style={BUTTON_STYLE}
            >
              Continue
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-3" style={{ color: "#1F3B2D" }}>
          My hoard
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.keys(STAGE_INFO).map((stage) => (
            <div key={stage} className="paper-card p-4">
              <div className="font-bold" style={{ color: "#1F3B2D" }}>
                {STAGE_INFO[stage].emoji} {STAGE_INFO[stage].title}
                <span className="text-xs font-normal text-stone-500 ml-2">
                  {STAGE_INFO[stage].blurb}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(words[stage] || []).length === 0 && (
                  <span className="text-xs text-stone-400">Nothing here yet</span>
                )}
                {(words[stage] || []).map((w) => (
                  <span
                    key={w.id}
                    className="rounded-full border px-3 py-1 text-sm bg-white"
                    style={{ borderColor: "#D4C8A8" }}
                  >
                    {stage === "wild" ? "???" : w.word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <form onSubmit={addWords} className="paper-card p-4 space-y-2">
        <label className="text-sm font-bold" style={{ color: "#1F3B2D" }} htmlFor="new-words">
          Found a tricky word? Add it
        </label>
        <textarea
          id="new-words"
          value={newWords}
          onChange={(e) => setNewWords(e.target.value)}
          rows={2}
          placeholder="One word per line, or separate with commas"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          style={{ borderColor: "#D4C8A8" }}
        />
        <button type="submit" className="rounded-full px-5 py-2 text-sm font-bold" style={BUTTON_STYLE}>
          Add to hoard
        </button>
      </form>
    </div>
  );
}
