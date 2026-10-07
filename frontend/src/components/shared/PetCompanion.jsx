import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { X } from "lucide-react";
import { api } from "../../lib/api";
import { Pet } from "./Botanical";

const BREAK_IDEAS = [
  "Stand up and stretch as high as you can, then shake out your hands.",
  "Take five slow breaths. In through your nose, out through your mouth.",
  "Get a drink of water and look out a window for a minute.",
  "Walk once around the room, then come back and read the next bit again.",
  "Close your eyes for ten seconds. Then try just the very first small step.",
];

const arr = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
const clean = (t = "") => String(t).replace(/^(\S+\s)?Step \d+:\s*/, "$1");

function vocabOf(l) {
  return arr(l.vocabulary || l.key_vocabulary || l.key_words).map((v) =>
    typeof v === "string" ? { word: v } : { word: v.word || v.term, meaning: v.meaning || v.definition }
  ).filter((v) => v.word);
}

function buildTopics(l) {
  const topics = [];

  const idea = [];
  if (arr(l.success_criteria).length) idea.push({ title: "Here is what you are aiming for", list: l.success_criteria });
  if (l.worked_example) idea.push({ title: "Have a look at this example", text: l.worked_example });
  if (arr(l.teach_steps).length) idea.push({ title: "Go back and read one of these again", list: l.teach_steps.map((s) => clean(s.title)) });
  else if (l.explicit_teaching) idea.push({ title: "Read the teaching again, slowly", text: l.explicit_teaching });
  if (idea.length) topics.push({ key: "idea", label: "I don't understand the idea", tiers: idea });

  const task = [];
  if (l.independent_task) task.push({ title: "Your job is", text: l.independent_task });
  if (arr(l.steps).length) task.push({ title: "Go one step at a time", list: l.steps.map((s) => (s.detail ? `${clean(s.title)}: ${s.detail}` : clean(s.title))) });
  if (l.guided_practice) task.push({ title: "Try it like this first", text: l.guided_practice });
  if (arr(l.materials).length) task.push({ title: "Check you have what you need", list: l.materials });
  if (task.length) topics.push({ key: "task", label: "I don't know what to do", tiers: task });

  const vocab = vocabOf(l);
  const word = [];
  word.push({ title: "Try this first", list: ["Read the whole sentence again.", "Look for a small word you already know inside it.", "Say it out loud, one chunk at a time."] });
  if (vocab.length) word.push({ title: "Words from this lesson", list: vocab.map((v) => (v.meaning ? `${v.word}: ${v.meaning}` : v.word)) });
  topics.push({ key: "word", label: "I don't know a word", tiers: word });

  const tired = [{ title: "Let's take a tiny break", text: null, random: true }];
  if (l.offline_alternative) tired.push({ title: "Or try it a different way", text: l.offline_alternative });
  topics.push({ key: "tired", label: "This feels too hard or I'm tired", tiers: tired });

  return topics;
}

export default function PetCompanion() {
  const { aid } = useParams();
  const [lesson, setLesson] = useState(null);
  const [pet, setPet] = useState(null);
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(null);
  const [shown, setShown] = useState(1);
  const [sent, setSent] = useState(false);
  const [breakIdea] = useState(() => BREAK_IDEAS[Math.floor(Math.random() * BREAK_IDEAS.length)]);

  useEffect(() => {
    api.get(`/assignments/${aid}`).then((r) => setLesson(r.data?.lesson || {})).catch(() => {});
    api.get("/pet").then((r) => { if (!r.data?.needs_pet) setPet(r.data); }).catch(() => {});
  }, [aid]);

  if (!lesson) return null;
  const topics = buildTopics(lesson);
  const current = topics.find((t) => t.key === topic);
  const name = pet?.name || "Your guide";

  const callAdult = async () => {
    try {
      await api.put(`/assignments/${aid}/status?status=needs_help`);
      setSent(true);
      toast.success(`${name} let a grown-up know`);
    } catch {
      toast.error("That didn't send. Please go and find a grown-up.");
    }
  };

  const avatar = (size) => pet ? <Pet species={pet.species} size={size} happy /> : <span style={{ fontSize: size * 0.7 }}>\ud83c\udf31</span>;

  const pickTopic = (key) => { setTopic(key); setShown(1); };
  const close = () => { setOpen(false); setTopic(null); setShown(1); };

  const renderTier = (t, i) => (
    <div key={i} className="rounded-xl bg-white border p-3 text-sm" style={{ borderColor: "#D4C8A8" }} data-testid={`pet-tier-${i}`}>
      <div className="font-bold mb-1">{t.title}</div>
      {t.random && <p>{breakIdea}</p>}
      {t.text && <p className="whitespace-pre-wrap">{t.text}</p>}
      {t.list && <ul className="list-disc pl-5 space-y-1">{t.list.map((x, j) => <li key={j}>{x}</li>)}</ul>}
    </div>
  );

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-white border-2 pl-2 pr-4 py-1.5 shadow-lg hover:translate-y-[-2px] transition" style={{ borderColor: "#C77B5B" }} data-testid="pet-help-open">
          {avatar(44)}
          <span className="text-sm font-bold" style={{ color: "#1F3B2D" }}>Stuck? Ask {name}</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-40 w-[22rem] max-w-[calc(100vw-2rem)] max-h-[80vh] overflow-y-auto paper-card p-4 shadow-xl" data-testid="pet-help-panel">
          <div className="flex items-start gap-3">
            <div className="shrink-0">{avatar(64)}</div>
            <div className="flex-1">
              <div className="font-script text-xl" style={{ color: "#C77B5B" }}>{name}</div>
              <p className="text-sm">{!current ? "I'm here to help. What's tricky?" : "Let's work it out together."}</p>
            </div>
            <button type="button" onClick={close} aria-label="Close help" className="text-stone-500"><X size={18} /></button>
          </div>

          {!current && (
            <div className="mt-3 space-y-2">
              {topics.map((t) => (
                <button key={t.key} type="button" onClick={() => pickTopic(t.key)} className="w-full text-left rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-stone-50" style={{ borderColor: "#D4C8A8" }} data-testid={`pet-topic-${t.key}`}>{t.label}</button>
              ))}
              <button type="button" onClick={() => pickTopic("adult")} className="w-full text-left rounded-xl border bg-white px-3 py-2 text-sm font-semibold hover:bg-stone-50" style={{ borderColor: "#D4C8A8" }} data-testid="pet-topic-adult">I need a grown-up</button>
            </div>
          )}

          {topic === "adult" && (
            <div className="mt-3 space-y-3">
              <p className="text-sm">That's a great thing to do. Asking for help is part of learning.</p>
              {!sent ? (
                <button type="button" onClick={callAdult} className="rounded-full px-5 py-2 text-sm font-bold" style={{ backgroundColor: "#C77B5B", color: "#F5EFE0" }} data-testid="pet-call-adult">Let a grown-up know</button>
              ) : (
                <p className="text-sm font-bold text-green-800">Done. Go and find your grown-up, and show them where you're up to.</p>
              )}
              <button type="button" onClick={() => setTopic(null)} className="block text-xs underline text-stone-500">Back</button>
            </div>
          )}

          {current && (
            <div className="mt-3 space-y-2">
              {current.tiers.slice(0, shown).map(renderTier)}

              {shown < current.tiers.length ? (
                <button type="button" onClick={() => setShown(shown + 1)} className="rounded-full px-4 py-2 text-sm font-bold" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="pet-more-help">That didn't help, show me more</button>
              ) : (
                <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: "#FEF3C7" }}>
                  <p>Still stuck? That's okay. A grown-up can help from here.</p>
                  {!sent ? (
                    <button type="button" onClick={callAdult} className="mt-2 rounded-full px-4 py-2 text-sm font-bold" style={{ backgroundColor: "#C77B5B", color: "#F5EFE0" }}>Let a grown-up know</button>
                  ) : (
                    <p className="mt-2 font-bold text-green-800">Done. Go and find your grown-up.</p>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-1">
                <button type="button" onClick={() => setTopic(null)} className="text-xs underline text-stone-500">Something else</button>
                <button type="button" onClick={close} className="text-xs underline text-stone-500">I'm ready, thanks!</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
