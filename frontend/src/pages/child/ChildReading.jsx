import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";

const TYPES = [
  { v: "fiction", l: "Story" }, { v: "nonfiction", l: "Non-fiction" }, { v: "picture", l: "Picture book" },
  { v: "graphic", l: "Graphic novel" }, { v: "poetry", l: "Poetry" }, { v: "reference", l: "Reference" },
];
const MODES = [
  { v: "independent", l: "I read it myself" }, { v: "with_adult", l: "Read with a grown-up" },
  { v: "read_to", l: "Someone read it to me" }, { v: "audio", l: "Audiobook" },
];
const STATUS = {
  pending: { l: "Waiting for approval", c: "#C8893B" },
  approved: { l: "Approved", c: "#059669" },
  rejected: { l: "Sent back", c: "#B45309" },
};

export default function ChildReading() {
  const nav = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const blank = { title: "", author: "", read_date: today, duration_minutes: 20, pages: "", book_type: "fiction", reading_mode: "independent" };
  const [form, setForm] = useState(blank);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = () => api.get("/reading-submissions/mine").then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/reading-submissions", {
        ...form,
        duration_minutes: Number(form.duration_minutes),
        pages: form.pages ? Number(form.pages) : null,
      });
      toast.success("Sent to your parent to check");
      setForm(blank); load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not send. Try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5 animate-in" data-testid="child-reading">
      <button onClick={() => nav("/child")} className="text-sm font-bold flex items-center gap-1" style={{ color: "#4A5D3A" }}><ArrowLeft size={14} /> Back</button>
      <header>
        <div className="font-script text-2xl" style={{ color: "#C77B5B" }}>Every page counts</div>
        <h1 className="font-display text-4xl font-bold" style={{ color: "#1F3B2D" }}>My reading</h1>
        <p className="text-sm text-stone-600 mt-1">Add a book you read. Your parent checks it, then it counts and your pet gets XP.</p>
      </header>

      <form onSubmit={submit} className="paper-card p-6 space-y-3" data-testid="child-reading-form">
        <Field label="Book title"><input required maxLength={120} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="cr-input" data-testid="cr-title" /></Field>
        <Field label="Author (if you know)"><input maxLength={80} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="cr-input" /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Day you read"><input required type="date" max={today} value={form.read_date} onChange={e => setForm({ ...form, read_date: e.target.value })} className="cr-input" /></Field>
          <Field label="Minutes"><input required type="number" min="1" max="600" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} className="cr-input" /></Field>
          <Field label="Pages (optional)"><input type="number" min="1" value={form.pages} onChange={e => setForm({ ...form, pages: e.target.value })} className="cr-input" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kind of book"><select value={form.book_type} onChange={e => setForm({ ...form, book_type: e.target.value })} className="cr-input">{TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select></Field>
          <Field label="How did you read it?"><select value={form.reading_mode} onChange={e => setForm({ ...form, reading_mode: e.target.value })} className="cr-input">{MODES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select></Field>
        </div>
        <button disabled={busy} className="w-full rounded-full py-3 text-sm font-bold disabled:opacity-50" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid="cr-submit">Send to my parent</button>
      </form>

      <section className="paper-card p-6">
        <h2 className="font-display text-xl font-bold mb-3" style={{ color: "#1F3B2D" }}>My books</h2>
        {items.length === 0 ? (
          <div className="text-sm text-stone-500 flex items-center gap-2"><BookOpen size={16} /> Nothing added yet.</div>
        ) : (
          <div className="space-y-2">
            {items.map(i => (
              <div key={i.id} className="rounded-xl border p-3 flex items-center justify-between gap-3" style={{ borderColor: "#E8E2D1" }}>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{i.title}</div>
                  <div className="text-xs text-stone-500">{i.read_date} · {i.duration_minutes} min{i.status === "rejected" && i.parent_note ? ` · "${i.parent_note}"` : ""}</div>
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: STATUS[i.status]?.c }}>{STATUS[i.status]?.l}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <style>{`.cr-input{width:100%;border-radius:.75rem;border:1px solid #D4C8A8;padding:.6rem .85rem;font-size:.875rem;background:#fff}.cr-input:focus{outline:none;border-color:#4A5D3A}`}</style>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div><label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label><div className="mt-1">{children}</div></div>
);
