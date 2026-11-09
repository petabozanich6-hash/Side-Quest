import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, BookText, ChevronLeft, ChevronRight, Printer, ShoppingCart, Circle, CircleCheck, Eye, X, BookOpen, BookOpenCheck, Check, Download, FileText, Gift, Lock, Pencil, Plus, ShoppingBag, Sparkles, Trash2, Upload } from "lucide-react";
import { API, FILE_TOKEN, api, apiErrorMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import QuestBookCover from "../../components/parent/QuestBookCover";
import QuestBookLessonsAdmin from "../../components/parent/QuestBookLessonsAdmin";
import QuestBookOvernight from "../../components/parent/QuestBookOvernight";
import { plannedFor } from "../../lib/questBookPlan";
import { coverFromPdf, lookInsidePages, readerPages } from "../../lib/pdfPages";
import { addToCart, clearCart, inCart, removeFromCart, setCart, useCart } from "../../lib/questCart";

export const money = (cents) => (cents == null ? "" : `$${(cents / 100).toFixed(2)}`);
const mb = (bytes) => (bytes ? `${(bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0)} MB` : "");
const YEAR_KEY = "sq_quest_books_year";
const rememberYear = (y) => { try { localStorage.setItem(YEAR_KEY, String(y)); } catch {} };
const storedYear = () => { try { const v = localStorage.getItem(YEAR_KEY); return v === null ? null : Number(v); } catch { return null; } };
/** A plain link lets the browser save even a large PDF directly; it carries the files-only token, never the sign-in token. */
export const pdfLink = (id, kind) => {
  let token = "";
  try { token = localStorage.getItem(FILE_TOKEN) || ""; } catch {}
  return `${API}/quest-books/books/${encodeURIComponent(id)}/${kind === "sample" ? "sample" : "download"}?ft=${encodeURIComponent(token)}`;
};

function Shelf({ children }) {
  return (
    <div className="relative pt-6">
      <div className="flex flex-wrap gap-x-6 gap-y-10 sm:gap-x-9 px-3 sm:px-6 pb-3 justify-center sm:justify-start relative z-10">{children}</div>
      <div className="h-4 rounded-md bg-gradient-to-b from-amber-700 to-amber-900 shadow-[0_8px_14px_-6px_rgba(60,30,5,.55)]" />
      <div className="h-2 mx-3 rounded-b-md bg-amber-950/40" />
    </div>
  );
}

const EMPTY = { collection: "core", topic: "", title: "", subtitle: "", year: 3, subject: "mathematics", description: "", pages: "", price: "3.99", bundle: "9.99", lesson: "1.00", in_shop: false };
const dollars = (c) => (c == null ? "" : (c / 100).toFixed(2));
const toForm = (b) => ({ id: b.id, collection: b.collection || "core", topic: b.topic || "", title: b.title, subtitle: b.subtitle || "", year: b.year ?? "all", subject: b.subject, description: b.description || "", pages: b.pages ?? "", price: dollars(b.price_cents), bundle: dollars(b.lessons_price_cents), lesson: dollars(b.lesson_price_cents), in_shop: !!b.in_shop });
const cents = (v) => { const t = String(v || "").replace(/[$\s]/g, ""); return t === "" ? null : Math.round(Number(t) * 100); };

function BookForm({ data, initial, onSaved, onCancel }) {
  const [f, setF] = useState(initial || EMPTY);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const save = async (e) => {
    e.preventDefault();
    const price_cents = cents(f.price), lessons_price_cents = cents(f.bundle), lesson_price_cents = cents(f.lesson);
    if ([price_cents, lessons_price_cents, lesson_price_cents].some((v) => v !== null && !Number.isFinite(v))) { toast.error("Prices must be numbers, like 3.99."); return; }
    setBusy(true);
    try {
      const r = await api.post("/quest-books/admin/books", { ...(f.id ? { id: f.id } : {}), collection: f.collection, topic: f.collection === "core" ? "" : f.topic, title: f.title, subtitle: f.subtitle, year: f.year === "all" ? "all" : Number(f.year), subject: f.subject, description: f.description, pages: f.pages === "" ? null : Number(f.pages), price_cents, lessons_price_cents, lesson_price_cents, in_shop: !!f.in_shop });
      toast.success(r.data.created ? `Created “${r.data.book.title}”. Now upload its files.` : `Saved “${r.data.book.title}”`);
      await onSaved(r.data.book);
    } catch (err) { toast.error(apiErrorMessage(err, "Could not save the book")); }
    finally { setBusy(false); }
  };
  const field = "mt-1 block w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm";
  return (
    <form onSubmit={save} className="rounded-xl border border-emerald-300 bg-white p-4 grid sm:grid-cols-2 gap-3" data-testid="quest-book-form">
      <label className="text-sm font-semibold text-emerald-950 sm:col-span-2">Title<input required value={f.title} onChange={set("title")} className={field} maxLength={120} /></label>
      <label className="text-sm font-semibold text-emerald-950 sm:col-span-2">Subtitle<input value={f.subtitle} onChange={set("subtitle")} className={field} maxLength={160} placeholder="e.g. A year of number adventures" /></label>
      <label className="text-sm font-semibold text-emerald-950">Shelf
        <select value={f.collection} onChange={(e) => setF((x) => ({ ...x, collection: e.target.value, ...(e.target.value === "core" && (x.year === "all" || Number(x.year) > 10) ? { year: 3 } : {}), ...(e.target.value === "core" && x.subject === "other" ? { subject: "mathematics" } : {}) }))} className={field}>
          {data.collections.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </label>
      {f.collection !== "core" && <label className="text-sm font-semibold text-emerald-950">Topic (shown instead of the subject)<input value={f.topic} onChange={set("topic")} className={field} maxLength={60} placeholder="e.g. Numeracy, Mathematics Advanced" /></label>}
      <label className="text-sm font-semibold text-emerald-950">Year level
        <select value={f.year} onChange={set("year")} className={field}>
          {f.collection !== "core" && <option value="all">All ages</option>}
          {(f.collection === "core" ? data.years : data.specialist_years).map((y) => <option key={y.year} value={y.year}>{y.label}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold text-emerald-950">Subject
        <select value={f.subject} onChange={set("subject")} className={field}>{data.subjects.filter((s) => f.collection !== "core" || s.core).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}{f.collection !== "core" && <option value="other">Other</option>}</select>
      </label>
      <label className="text-sm font-semibold text-emerald-950">Pages<input value={f.pages} onChange={set("pages")} inputMode="numeric" className={field} placeholder="optional" /></label>
      <label className="text-sm font-semibold text-emerald-950">Book price ($)<input value={f.price} onChange={set("price")} inputMode="decimal" className={field} placeholder="empty = not on sale yet" /></label>
      <label className="text-sm font-semibold text-emerald-950">Book + all lessons price ($)<input value={f.bundle} onChange={set("bundle")} inputMode="decimal" className={field} placeholder="e.g. 15.00 (optional)" /></label>
      <label className="text-sm font-semibold text-emerald-950">Single lesson price ($)<input value={f.lesson} onChange={set("lesson")} inputMode="decimal" className={field} placeholder="e.g. 1.00 (optional)" /></label>
      <label className="sm:col-span-2 flex items-center gap-2 text-sm font-semibold text-emerald-950"><input type="checkbox" checked={!!f.in_shop} onChange={(e) => setF((x) => ({ ...x, in_shop: e.target.checked }))} className="h-4 w-4" /> Show in the public shop (tick when the book is finished)</label>
      <p className="sm:col-span-2 text-xs text-stone-600">Every family pays these prices, members included. Lesson prices apply once you publish lessons to the book.</p>
      <label className="text-sm font-semibold text-emerald-950 sm:col-span-2">Description (what parents see)<textarea value={f.description} onChange={set("description")} rows={4} className={field} maxLength={2000} /></label>
      <div className="sm:col-span-2 flex gap-2">
        <button type="submit" disabled={busy} className="rounded-lg bg-emerald-900 text-white px-4 py-2 text-sm font-bold disabled:opacity-60">{busy ? "Saving…" : f.id ? "Save changes" : "Create book"}</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold">Cancel</button>}
      </div>
    </form>
  );
}

const FILES = [
  { kind: "book", label: "Book PDF", accept: "application/pdf,.pdf", type: "application/pdf", icon: FileText },
];

function OwnerPanel({ data, reload }) {
  const [busy, setBusy] = useState("");
  const [progress, setProgress] = useState(0);
  const [adding, setAdding] = useState(false);

  const [editing, setEditing] = useState(null);
  const [lessonsFor, setLessonsFor] = useState(null);
  const [readerJobs, setReaderJobs] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const upload = async (book, spec, file) => {
    if (spec.type === "application/pdf" && !/\.pdf$/i.test(file.name) && file.type !== "application/pdf") { toast.error("Choose a PDF file."); return; }
    setBusy(`${book.id}-${spec.kind}`); setProgress(0);
    try {
      const r = await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/files/${spec.kind}`, file, {
        headers: { "Content-Type": spec.type }, timeout: 15 * 60 * 1000,
        onUploadProgress: (e) => { if (e.total) setProgress(Math.round((e.loaded / e.total) * 100)); },
      });
      if (!r.data?.ok) throw new Error("The upload wasn't confirmed.");
      toast.success(`${spec.label} saved for “${book.title}”`);
      if (spec.kind === "book") {
        setReaderJobs((j) => ({ ...j, [book.id]: "Queued — keep this browser tab open" }));
        // Upload is COMPLETE already. Continue preparation without locking the
        // owner out of the screen; pages are resumable if the tab closes.
        void (async () => {
          try { await makeCover(book, file); } catch { toast.error("Couldn't make the cover from page 1. Use Make cover in the book space."); }
          try {
            await makeLookInside(book, file);
            await reload();
          } catch { toast.error("Look-inside preview needs retrying. The PDF is safely uploaded."); }
          try {
            await makeReaderPages(book, file, (n, total) => setReaderJobs((j) => ({ ...j, [book.id]: `${n} of ${total} pages uploaded` })));
            toast.success(`Members' reader is ready for “${book.title}”.`);
            await reload();
          } catch (e) {
            toast.error(apiErrorMessage(e, "Reader preparation stopped. Reopen the book space and press Make again to resume."), { duration: 9000 });
          } finally { setReaderJobs((j) => { const copy = { ...j }; delete copy[book.id]; return copy; }); }
        })();
      }
      await reload();
    } catch (e) { toast.error(e?.response ? apiErrorMessage(e, "Upload failed") : e.message, { duration: 9000 }); }
    finally { setBusy(""); setProgress(0); }
  };
  const remove = async () => {
    const book = deleteTarget;
    setBusy("delete");
    try {
      await api.delete(`/quest-books/admin/books/${encodeURIComponent(book.id)}`);
      toast.success(`Removed “${book.title}”.`);
      setDeleteTarget(null);
      await reload();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not remove the book")); }
    finally { setBusy(""); }
  };

  return (
    <section className="rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-5 space-y-4 scroll-mt-4" data-testid="quest-books-owner">
      <div>
        <h2 className="font-bold text-emerald-950">Owner HQ · Quest Books uploader</h2>
        <p className="text-sm text-emerald-900 mt-1">Only you can see this. Create a book, then upload its <strong>Book PDF</strong> (buyers download it and can also read and print it here) . The cover is made from the PDF's first page, and families preview a book with Look inside. Families only see a book once its Book PDF is uploaded. PDFs can be up to 95 MB.</p>
      </div>
      {adding ? (
        <BookForm data={data} onCancel={() => setAdding(false)} onSaved={async () => { setAdding(false); await reload(); }} />
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-full bg-emerald-900 text-white px-4 py-2 text-sm font-bold"><Plus size={16} /> Add a book</button>
      )}
      <QuestBookOvernight />
      <div className="rounded-xl border border-emerald-300 bg-white divide-y divide-stone-100">
        {!data.books.length ? <p className="p-3 text-sm text-stone-600">No books yet.</p> : data.books.map((b) => (
          <div key={b.id} className="p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <QuestBookCover book={b} size="sm" />
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-slate-900">{b.title} {!b.has_book && <span className="ml-1 rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold uppercase">Draft: hidden from families</span>}</p>
                <p className="text-xs text-stone-500">{b.year_label} · {b.subject_label} · {b.price_cents == null ? "Members only" : `Book ${money(b.price_cents)}`}{b.lessons_price_cents != null ? ` · Bundle ${money(b.lessons_price_cents)}` : ""}{b.lesson_price_cents != null ? ` · Lesson ${money(b.lesson_price_cents)}` : ""}{b.has_lessons ? " · Lessons published" : ""}{b.in_shop ? " · In the shop" : " · Not in the shop"}</p>
                <p className="text-xs text-stone-500 mt-0.5">{b.has_book ? `Book ${mb(b.book_bytes)} ✓` : "No book PDF"} · {b.has_cover ? "Cover ✓ (page 1)" : "Cover made from page 1"}</p>
              </div>
              <Link to={`/parent/quest-books/${b.id}`} className="inline-flex gap-1 items-center rounded-lg bg-emerald-900 text-white px-3 py-2 text-sm font-semibold hover:bg-emerald-800" data-testid={`quest-open-space-${b.id}`}><BookOpen size={15} /> Open book space</Link>
              <button type="button" disabled={!!busy} onClick={() => setLessonsFor(lessonsFor === b.id ? null : b.id)} className="inline-flex gap-1 items-center rounded-lg border border-violet-300 px-3 py-2 text-sm font-semibold text-violet-900 hover:bg-violet-50"><BookOpenCheck size={15} /> Lessons</button>
              <button type="button" disabled={!!busy} onClick={() => setEditing(editing === b.id ? null : b.id)} className="inline-flex gap-1 items-center rounded-lg border border-emerald-400 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"><Pencil size={15} /> Details</button>
              <button type="button" disabled={!!busy} onClick={() => setDeleteTarget(b)} className="inline-flex gap-1 items-center rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"><Trash2 size={15} /> Remove</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILES.map((spec) => {
                const has = b.has_book;
                const mine = busy === `${b.id}-${spec.kind}`;
                const Icon = spec.icon;
                return (
                  <label key={spec.kind} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer ${has ? "border border-emerald-400 text-emerald-900 hover:bg-emerald-50" : "bg-emerald-800 text-white hover:bg-emerald-700"}`} data-testid={`quest-upload-${b.id}-${spec.kind}`}>
                    {mine ? <Upload size={15} /> : <Icon size={15} />}
                    {mine ? `Uploading ${progress}%…` : `${has ? "Replace" : "Upload"} ${spec.label}`}
                    <input type="file" accept={spec.accept} className="sr-only" disabled={!!busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(b, spec, f); e.target.value = ""; }} />
                  </label>
                );
              })}
            </div>
            {readerJobs[b.id] && <p role="status" data-testid={`quest-reader-progress-${b.id}`} className="text-xs font-semibold text-emerald-900">
              Preparing the online reader: {readerJobs[b.id]}. You can keep using Side-Quest, but leave this browser tab open for rendering.
            </p>}
            {lessonsFor === b.id && <QuestBookLessonsAdmin book={b} onChanged={reload} />}
            {editing === b.id && <BookForm data={data} initial={toForm(b)} onCancel={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload(); }} />}
          </div>
        ))}
      </div>
      {deleteTarget && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 space-y-3" role="alertdialog" aria-label="Confirm removal">
          <p className="text-sm text-red-900">Remove <strong>{deleteTarget.title}</strong> and all its files from Quest Books? Families who bought it will no longer be able to download it from the site.</p>
          <div className="flex gap-2">
            <button type="button" onClick={remove} disabled={!!busy} className="rounded-lg bg-red-700 text-white px-4 py-2 text-sm font-bold">{busy ? "Removing…" : "Remove book"}</button>
            <button type="button" onClick={() => setDeleteTarget(null)} disabled={!!busy} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}
    </section>
  );
}

function BookTile({ b, data }) {
  return (
    <Link to={`/parent/quest-books/${b.id}`} data-testid={`quest-book-${b.id}`}
      className="group flex flex-col items-center gap-2 w-36 sm:w-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 rounded-xl">
      <QuestBookCover book={b} className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]" />
      <span className="text-xs font-bold text-slate-800 text-center leading-tight">{b.title}</span>
      <span className="text-[11px] text-stone-600">{!b.has_book ? <span className="text-amber-700 font-semibold">Draft</span> : b.owned ? <span className="text-emerald-800 font-semibold">Yours</span> : b.can_download ? "Yours" : b.included ? "Included" : b.price_cents != null && data.can_buy ? money(b.price_cents) : "Members"}{b.pages ? ` · ${b.pages} pages` : ""}</span>
    </Link>
  );
}

function PlannedTile({ p, onClick }) {
  return (
    <button type="button" onClick={onClick} data-testid="quest-planned"
      className="flex flex-col items-center gap-2 w-36 sm:w-40 text-left">
      <div className="w-36 sm:w-40 aspect-[3/4] rounded-xl border-2 border-dashed border-violet-400 bg-violet-50/70 grid place-items-center p-3 text-center hover:bg-violet-100">
        <div><div className="text-[10px] font-bold uppercase tracking-wider text-violet-700">Planned · only you see this</div>
          <div className="font-display font-bold text-slate-800 mt-1 leading-tight">{p.topic}</div>
          <div className="text-xs text-stone-600 mt-1">{p.year === null ? "All ages" : p.year === 0 ? "Foundation" : `Year ${p.year}`}</div>
          <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-violet-800"><Plus size={12} /> Create</div></div>
      </div>
    </button>
  );
}

function ShelfView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [year, setYear] = useState(null);
  const [mode, setMode] = useState("core");
  const [collection, setCollection] = useState("naplan");
  const [draft, setDraft] = useState(null);
  const load = () => api.get("/quest-books", { params: { _: Date.now() } }).then(({ data: d }) => {
    setData(d);
    setYear((cur) => {
      if (cur !== null) return cur;
      const saved = storedYear();
      if (saved !== null && d.years.some((y) => y.year === saved)) return saved;
      return d.books[0]?.year ?? 3;
    });
  }).catch((e) => setError(apiErrorMessage(e, "Could not open Quest Books")));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const yearLabel = data?.years.find((y) => y.year === year)?.label || "";
  const shelf = useMemo(() => {
    if (!data) return [];
    return data.subjects.filter((s) => s.core).flatMap((s) => {
      const books = data.books.filter((b) => (b.collection || "core") === "core" && b.year === year && b.subject === s.id && (b.has_book || data.owner));
      return books.length ? books : [{ placeholder: true, subject: s.id, subjectLabel: s.label, yearLabel, id: `${s.id}-soon` }];
    });
  }, [data, year, yearLabel]);
  const countByYear = useMemo(() => {
    const m = new Map();
    for (const b of data?.books || []) if (b.has_book && (b.collection || "core") === "core") m.set(b.year, (m.get(b.year) || 0) + 1);
    return m;
  }, [data]);
  const specialistBooks = (data?.books || []).filter((b) => b.collection === collection && (b.has_book || data.owner));
  const planned = data?.owner ? plannedFor(collection, data.books) : [];
  // Families only see specialist shelves that have books; the owner sees every shelf, including empty ones to fill.
  const shelves = (data?.collections || []).filter((c) => c.id !== "core" && (data.owner || data.books.some((b) => b.collection === c.id && b.has_book)));
  useEffect(() => { if (shelves.length && !shelves.some((c) => c.id === collection)) setCollection(shelves[0].id); }, [shelves, collection]);
  const currentCollection = data?.collections?.find((c) => c.id === collection);
  const createPlanned = (p) => setDraft({ collection, year: p.year === null ? "all" : p.year, topic: p.topic, subject: p.subject,
    title: `${p.year === null ? "" : p.year === 0 ? "Foundation " : `Year ${p.year} `}${p.topic}`.trim() });
  const createCore = (subject, subjectLabel) => setDraft({ collection: "core", year, subject,
    title: `${yearLabel} ${subjectLabel}`.trim() });
  const inlineForm = (selected) => (
    <div className="mt-5 rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4 space-y-3" data-testid="quest-inline-create">
      <div>
        <h3 className="font-display font-bold text-emerald-950">Create {selected.collection === "core" ? `${yearLabel} ${data.subjects.find((s) => s.id === selected.subject)?.label || "book"}` : selected.topic}</h3>
        <p className="text-sm text-emerald-900">Your chosen year and subject are filled in below. Give the book its title, then you'll go straight to its own upload and lesson workspace.</p>
      </div>
      <BookForm key={JSON.stringify(selected)} data={data} initial={{ ...EMPTY, ...selected }}
        onCancel={() => setDraft(null)}
        onSaved={(book) => { setDraft(null); navigate(`/parent/quest-books/${encodeURIComponent(book.id)}`); }} />
    </div>
  );

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="quest-books">
      <header className="rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-100 border border-amber-200 p-6 sm:p-9 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-20"><CartButton /></div>
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold tracking-widest uppercase text-emerald-800">Side-Quest · Subject books and exam prep</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 text-slate-900">Quest Books</h1>
          <p className="mt-3 text-stone-700">Beautiful downloadable books for every year level, plus specialist books for NAPLAN, HSC, selective school tests and more. Download a book as a PDF to print at home or use on a tablet.</p>
        </div>
        <Sparkles className="absolute right-6 top-6 text-amber-300" size={44} />
        <BookOpen className="absolute right-[-18px] bottom-[-26px] text-emerald-800/10 rotate-[-12deg]" size={170} />
      </header>

      {!data && !error && <p role="status">Opening Quest Books…</p>}
      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900" role="alert">{error}</div>}
      {data && <>
        {data.can_buy && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex gap-3 items-start text-amber-950 text-sm">
            <Gift size={18} className="mt-0.5 shrink-0" />
            <p>Buy a book to keep the PDF, or the pack to get its ready-made lessons too. Each extra pack is 10% cheaper again, up to 50% off.</p>
          </div>
        )}

        <div className="inline-flex rounded-full border border-stone-300 bg-white p-1" role="tablist" aria-label="Quest Books shelves">
          {[["core", "Year-level books"], ["specialist", "Specialist"]].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => { setMode(id); setDraft(null); }} data-testid={`quest-mode-${id}`}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${mode === id ? "bg-emerald-900 text-white" : "text-slate-700"}`}>{label}</button>
          ))}
        </div>

        {mode === "specialist" ? (
          <section className="space-y-4" data-testid="quest-specialist">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {shelves.map((c) => {
                const n = data.books.filter((b) => b.collection === c.id && b.has_book).length;
                return (
                  <button key={c.id} type="button" onClick={() => { setCollection(c.id); setDraft(null); }} data-testid={`quest-collection-${c.id}`}
                    className={`text-left rounded-2xl border p-4 transition ${collection === c.id ? "border-emerald-800 bg-emerald-50 shadow" : "border-stone-200 bg-white hover:border-emerald-600"}`}>
                    <div className="font-display font-bold text-slate-900">{c.label}{n ? <span className="ml-1 text-xs text-emerald-700">· {n}</span> : null}</div>
                    <div className="text-xs text-stone-600 mt-1">{c.blurb}</div>
                  </button>
                );
              })}
            </div>
            <div className="rounded-3xl bg-gradient-to-b from-[#fbf6ec] to-[#f1e6d2] border border-amber-200 p-4 sm:p-7 space-y-2">
              <h2 className="font-display text-2xl font-bold text-slate-900">{currentCollection?.label}</h2>
              <p className="text-sm text-stone-600">{specialistBooks.length ? currentCollection?.blurb : "Books for this shelf are on their way."}</p>
              {(specialistBooks.length > 0 || planned.length > 0) && (
                <Shelf>
                  {specialistBooks.map((b) => <BookTile key={b.id} b={b} data={data} />)}
                  {planned.map((p, i) => <PlannedTile key={`p${i}`} p={p} onClick={() => createPlanned(p)} />)}
                </Shelf>
              )}
              {data.owner && draft && draft.collection !== "core" && inlineForm(draft)}
            </div>
          </section>
        ) : <>
        <nav aria-label="Year level" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {data.years.map((y) => (
            <button key={y.year} type="button" data-testid={`quest-year-${y.year}`}
              onClick={() => { setYear(y.year); rememberYear(y.year); setDraft(null); }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold border transition ${y.year === year ? "bg-emerald-900 text-white border-emerald-900 shadow" : "bg-white text-slate-700 border-stone-300 hover:border-emerald-700"}`}>
              {y.label}{countByYear.get(y.year) ? <span className={`ml-1.5 text-[11px] ${y.year === year ? "text-emerald-200" : "text-emerald-700"}`}>· {countByYear.get(y.year)}</span> : null}
            </button>
          ))}
        </nav>

        <section className="rounded-3xl bg-gradient-to-b from-[#fbf6ec] to-[#f1e6d2] border border-amber-200 p-4 sm:p-7 space-y-2">
          <h2 className="font-display text-2xl font-bold text-slate-900">{yearLabel} Quest Books</h2>
          <p className="text-sm text-stone-600">{shelf.some((b) => !b.placeholder) ? "Tap a book to see what's inside." : "The books for this year level are on their way. They'll appear here as each one is ready."}</p>
          <Shelf>
            {shelf.map((b) => b.placeholder ? (
              data.owner ? <button key={b.id} type="button" onClick={() => createCore(b.subject, b.subjectLabel)}
                data-testid={`quest-create-${year}-${b.subject}`}
                aria-label={`Create ${yearLabel} ${b.subjectLabel} book`}
                className="flex flex-col items-center gap-2 w-36 sm:w-40 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 hover:-translate-y-1 transition-transform">
                <QuestBookCover book={b} />
                <span className="text-xs font-bold text-emerald-800">+ Create {b.subjectLabel}</span>
              </button> : <div key={b.id} className="flex flex-col items-center gap-2 w-36 sm:w-40">
                <QuestBookCover book={b} />
                <span className="text-xs font-semibold text-stone-500">{b.subjectLabel} · coming soon</span>
              </div>
            ) : <BookTile key={b.id} b={b} data={data} />)}
          </Shelf>
          {data.owner && draft?.collection === "core" && inlineForm(draft)}
        </section>
        </>}

        {data.owner && <OwnerPanel data={data} reload={load} />}
      </>}
    </div>
  );
}

function LessonPeek({ bookId, peek, onClose }) {
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api.get(`/quest-books/books/${encodeURIComponent(bookId)}/lessons/${encodeURIComponent(peek.key)}/preview`)
      .then((r) => setP(r.data)).catch((e) => setErr(apiErrorMessage(e, "Could not load the preview")));
  }, [bookId, peek.key]);
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const inc = p?.includes || {};
  const bits = [inc.worked_examples && `${inc.worked_examples} worked example${inc.worked_examples === 1 ? "" : "s"}`, inc.activities && `${inc.activities} activit${inc.activities === 1 ? "y" : "ies"}`, inc.questions && `${inc.questions} practice question${inc.questions === 1 ? "" : "s"}`, inc.quiz && `${inc.quiz}-question quiz`, inc.parent_script && "parent script", inc.answer_key && "answer key"].filter(Boolean);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Preview of ${peek.title}`}>
      <div className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-xl p-5 space-y-3 text-sm" onClick={(e) => e.stopPropagation()} data-testid="quest-lesson-peek">
        <div className="flex items-start gap-2">
          <div className="mr-auto"><div className="text-[11px] font-bold uppercase tracking-wider text-violet-700">Lesson preview</div>
            <h3 className="font-display text-lg font-bold text-slate-900 leading-tight">{peek.title}</h3>
            {p && <p className="text-xs text-stone-500">{[p.stage, p.learning_area, p.minutes && `about ${p.minutes} min`].filter(Boolean).join(" · ")}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Close preview" className="rounded-full p-1 hover:bg-stone-100"><X size={18} /></button>
        </div>
        {err ? <p className="text-red-700">{err}</p> : !p ? <p className="text-stone-500">Loading…</p> : <>
          {p.summary && <p className="text-stone-700">{p.summary}</p>}
          {p.objectives.length > 0 && <div><p className="font-bold text-slate-800">Your child will learn to</p><ul className="list-disc pl-5 text-stone-700">{p.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></div>}
          {p.opening && <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-stone-700 italic">{p.opening}</div>}
          {p.sections.length > 0 && <div><p className="font-bold text-slate-800">What's inside</p><ol className="list-decimal pl-5 text-stone-700">{p.sections.map((s, i) => <li key={i}>{s}</li>)}</ol></div>}
          {bits.length > 0 && <p className="text-stone-700"><span className="font-bold text-slate-800">Includes: </span>{bits.join(", ")}.</p>}
          {p.key_words.length > 0 && <div className="flex flex-wrap gap-1">{p.key_words.map((k) => <span key={k} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-700">{k}</span>)}</div>}
        </>}
      </div>
    </div>
  );
}

// Uploads one file for a book (owner). Returns true when the server confirmed it.
async function uploadBookFile(book, spec, file, onProgress) {
  if (spec.type === "application/pdf" && !/\.pdf$/i.test(file.name || "") && file.type !== "application/pdf") { toast.error("Choose a PDF file."); return false; }
  try {
    const r = await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/files/${spec.kind}`, file, {
      headers: { "Content-Type": spec.type }, timeout: 15 * 60 * 1000,
      onUploadProgress: (e) => { if (e.total) onProgress?.(Math.round((e.loaded / e.total) * 100)); },
    });
    if (!r.data?.ok) throw new Error("The upload wasn't confirmed.");
    toast.success(`${spec.label} saved for “${book.title}”`);
    return true;
  } catch (e) { toast.error(e?.response ? apiErrorMessage(e, "Upload failed") : e.message, { duration: 9000 }); return false; }
}

// Makes the watermarked "look inside" pages from the uploaded Book PDF (owner's browser) and stores them.
// Makes the reader pages (every page as a picture) so members can read and print in Side-Quest without the PDF.
async function makeReaderPages(book, file, onProgress) {
  let pdf = file;
  if (!pdf) {
    const r = await api.get(`/quest-books/books/${encodeURIComponent(book.id)}/download`, { responseType: "blob", timeout: 5 * 60 * 1000 });
    pdf = new Blob([r.data], { type: "application/pdf" });
  }
  const root = `/quest-books/admin/books/${encodeURIComponent(book.id)}`;
  const { data: source } = await api.get(`${root}/read-source`);
  const storageKey = `sq-quest-reader-build:${book.id}`;
  let previous = null;
  try { previous = JSON.parse(localStorage.getItem(storageKey) || "null"); } catch { /* no prior build */ }
  const generation = previous?.source_id === source.source_id && /^[a-f0-9-]{36}$/i.test(previous?.generation)
    ? previous.generation : crypto.randomUUID();
  try { localStorage.setItem(storageKey, JSON.stringify({ generation, source_id: source.source_id })); } catch { /* resume only where supported */ }
  const progress = await api.get(`${root}/read-build/${encodeURIComponent(generation)}/progress`);
  const already = new Set(progress.data.uploaded || []);
  let completed = already.size;
  const uploads = new Set();
  let failure = null;
  const send = async (blob, n, total) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await api.put(`${root}/read-build/${encodeURIComponent(generation)}/${n}`, blob, {
          headers: { "Content-Type": "image/jpeg" }, timeout: 120000,
        });
        completed++;
        onProgress?.(completed, total);
        return;
      } catch (e) {
        if (attempt === 2) throw e;
        await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
      }
    }
  };
  let total = 0;
  try {
    total = await readerPages(pdf, async (blob, n, pageTotal) => {
      if (failure) throw failure;
      if (already.has(n)) { onProgress?.(completed, pageTotal); return; }
      // Render the next pages while up to three completed JPEGs upload.
      // Bounded work avoids hundreds of simultaneous requests or huge memory spikes.
      while (uploads.size >= 3) {
        await Promise.race(uploads);
        if (failure) throw failure;
      }
      const task = send(blob, n, pageTotal).catch((e) => { failure = e; }).finally(() => uploads.delete(task));
      uploads.add(task);
    }, { skipPages: already });
    await Promise.all(uploads);
    if (failure) throw failure;
    const finished = await api.post(`${root}/read-build/${encodeURIComponent(generation)}/finish`, {
      source_id: source.source_id, total,
    }, { timeout: 120000 });
    if (!finished.data.ok || finished.data.pages !== total)
      throw new Error("The server did not confirm all reader pages.");
    try { localStorage.removeItem(storageKey); } catch {}
    return total;
  } finally {
    await Promise.allSettled([...uploads]);
  }
}

/** The cover is the book's first page, made in the owner's browser and saved as the cover image. */
async function makeCover(book, file) {
  let pdf = file;
  if (!pdf) {
    const r = await api.get(`/quest-books/books/${encodeURIComponent(book.id)}/download`, { responseType: "blob", timeout: 5 * 60 * 1000 });
    pdf = new Blob([r.data], { type: "application/pdf" });
  }
  const png = await coverFromPdf(pdf);
  await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/files/cover`, png, { headers: { "Content-Type": "image/png" }, timeout: 120000 });
}

async function makeLookInside(book, file) {
  let pdf = file;
  if (!pdf) {
    const r = await api.get(`/quest-books/books/${encodeURIComponent(book.id)}/download`, { responseType: "blob", timeout: 5 * 60 * 1000 });
    pdf = new Blob([r.data], { type: "application/pdf" });
  }
  const pages = await lookInsidePages(pdf);
  if (!pages.length) throw new Error("No pages could be read from the book.");
  await api.delete(`/quest-books/admin/books/${encodeURIComponent(book.id)}/look`);
  for (let i = 0; i < pages.length; i++) {
    await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/look/${i + 1}`, pages[i], { headers: { "Content-Type": "image/jpeg" }, timeout: 120000 });
  }
  return pages.length;
}

/** Owner-only working space inside a book's own page: one checklist, each step with its action. */
function BookWorkspace({ book, reload }) {
  const [opts, setOpts] = useState(null);
  const [busy, setBusy] = useState("");
  const [progress, setProgress] = useState(0);
  const [readerBusy, setReaderBusy] = useState(false);
  const [readProgress, setReadProgress] = useState("");
  const [workspaceParams] = useSearchParams();
  const [open, setOpen] = useState(() => workspaceParams.get("workspace") === "lessons" ? "lessons" : null); // "details" | "lessons"
  useEffect(() => { api.get("/quest-books").then((r) => setOpts(r.data)).catch(() => {}); }, []);
  const full = opts?.books?.find((b) => b.id === book.id) || book;

  const doUpload = async (kind, file) => {
    const spec = FILES.find((f) => f.kind === kind);
    setBusy(kind); setProgress(0);
    const ok = await uploadBookFile(book, spec, file, setProgress);
    if (ok && kind === "book") {
      setReaderBusy(true);
      setReadProgress("Starting — keep this browser tab open");
      void (async () => {
        try { await makeCover(book, file); } catch { toast.error("Couldn't make the cover from page 1. Press Make cover to try again."); }
        try { await makeLookInside(book, file); toast.success("Look-inside preview ready."); await reload(); }
        catch (e) { toast.error(apiErrorMessage(e, "Couldn't prepare the look-inside preview. Retry from the book workspace.")); }
        try {
          await makeReaderPages(book, file, (n, total) => setReadProgress(`${n} of ${total} uploaded`));
          toast.success("All members' reader pages have been verified.");
          await reload();
        } catch (e) { toast.error(apiErrorMessage(e, "Reader preparation paused. Press Make again to resume."), { duration: 9000 }); }
        finally { setReaderBusy(false); setReadProgress(""); }
      })();
    }
    setBusy(""); setProgress(0);
    if (ok) await reload();
  };
  const remakeRead = async () => {
    setBusy("read");
    try { await makeReaderPages(book, null, (n, total) => setReadProgress(`${n} of ${total}`)); toast.success("Reader pages ready."); await reload(); }
    catch (e) { toast.error(apiErrorMessage(e, "Couldn't make the reader pages")); }
    finally { setBusy(""); setReadProgress(""); }
  };
  const remakeCover = async () => {
    setBusy("cover");
    try { await makeCover(book); toast.success("Cover made from page 1."); await reload(); }
    catch (e) { toast.error(apiErrorMessage(e, "Couldn't make the cover")); }
    finally { setBusy(""); }
  };
  const remakeLook = async () => {
    setBusy("look");
    try { const n = await makeLookInside(book); toast.success(`Made ${n} look-inside pages.`); await reload(); }
    catch (e) { toast.error(apiErrorMessage(e, "Couldn't make the look-inside pages")); }
    finally { setBusy(""); }
  };

  const filePick = (kind, label) => {
    const spec = FILES.find((f) => f.kind === kind);
    return (
      <label className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer ${busy ? "opacity-50 pointer-events-none" : ""} border border-emerald-600 text-emerald-900 hover:bg-emerald-50`}>
        <Upload size={13} /> {busy === kind ? `Uploading ${progress}%…` : label}
        <input type="file" accept={spec.accept} className="sr-only" disabled={!!busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void doUpload(kind, f); e.target.value = ""; }} />
      </label>
    );
  };
  const btn = (label, onClick) => <button type="button" disabled={!!busy} onClick={onClick} className="inline-flex items-center gap-1 rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50">{label}</button>;

  const steps = [
    { id: "details", title: "Details and prices", done: !!book.title && book.price_cents != null,
      info: book.price_cents == null ? "No price yet, so it isn't on sale." : `Book ${money(book.price_cents)}${book.lessons_price_cents != null ? ` · Pack ${money(book.lessons_price_cents)}` : ""}${book.lesson_price_cents != null ? ` · Lesson ${money(book.lesson_price_cents)}` : ""}`,
      action: btn(open === "details" ? "Close" : "Edit", () => setOpen(open === "details" ? null : "details")) },
    { id: "book", title: "Book PDF", done: book.has_book, info: book.has_book ? `Uploaded${book.book_bytes ? ` · ${mb(book.book_bytes)}` : ""}` : "The high-quality PDF buyers can keep; buyers can also read the online version. Hidden until uploaded.",
      action: filePick("book", book.has_book ? "Replace" : "Upload PDF") },
    { id: "read", title: "Online reader", done: book.read_pages > 0, needs: book.has_book,
      info: readerBusy || busy === "read" ? `Preparing reader pages… ${readProgress || "starting"} — leave this tab open` : book.read_pages ? `${book.read_pages} verified pages: buyers read and print selected pages online` : "After PDF upload, prepare the online reader. It resumes after interrupted uploads.",
      action: book.has_book && <button type="button" disabled={!!busy || readerBusy} onClick={remakeRead}
        className="inline-flex items-center rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-bold text-emerald-900 disabled:opacity-50">
        {busy === "read" || readerBusy ? "Preparing…" : book.read_pages ? "Make again" : "Make / resume"}
      </button> },
    { id: "look", title: "Look-inside pages", done: book.look_pages > 0, needs: book.has_book,
      info: busy === "look" ? "Making the pages…" : book.look_pages ? `${book.look_pages} watermarked pages parents see before buying` : "Made automatically from the Book PDF.",
      action: book.has_book && btn(busy === "look" ? "Making…" : book.look_pages ? "Make again" : "Make them", remakeLook) },
    { id: "cover", title: "Cover", done: book.has_cover, needs: book.has_book, info: busy === "cover" ? "Making the cover…" : book.has_cover ? "The book's first page" : "Made automatically from the first page of the Book PDF.",
      action: book.has_book && btn(busy === "cover" ? "Making…" : book.has_cover ? "Make again" : "Make cover", remakeCover) },
    { id: "chapters", title: "Teaching sessions mapped", done: book.has_chapters, needs: book.has_book, info: book.has_chapters ? "Mapped to the book" : "Read PDF bookmarks and split by skill and page.",
      action: book.has_book && btn(open === "lessons" ? "Close" : "Open", () => setOpen(open === "lessons" ? null : "lessons")) },
    { id: "lessons", title: "Lessons made and published", done: book.has_lessons, needs: book.has_chapters, info: book.has_lessons ? "Published to the book" : "Make complete lessons for each skill session, review, then publish.",
      action: book.has_chapters && btn(open === "lessons" ? "Close" : "Open", () => setOpen(open === "lessons" ? null : "lessons")) },
  ];
  const required = steps.filter((s) => !s.optional);
  const doneCount = required.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done && !s.optional && s.needs !== false);

  return (
    <section className="rounded-2xl border-2 border-emerald-700 bg-emerald-50/60 p-4 sm:p-5 space-y-3" data-testid="quest-book-workspace">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="font-bold text-emerald-950">Your book space <span className="text-xs font-semibold text-emerald-800">· only you see this</span></h2>
          <p className="text-xs text-emerald-900">{book.has_book ? "Families can see this book." : "Hidden from families until the Book PDF is uploaded."}</p>
        </div>
        <div className="text-sm font-bold text-emerald-950">{doneCount} of {required.length} done</div>
      </div>
      <div className="h-2 rounded-full bg-emerald-100 overflow-hidden"><div className="h-full bg-emerald-700 transition-all" style={{ width: `${(doneCount / required.length) * 100}%` }} /></div>
      <ol className="rounded-xl bg-white border border-emerald-200 divide-y divide-stone-100">
        {steps.map((st) => (
          <li key={st.id} className={`flex flex-wrap items-center gap-3 px-3 py-2.5 ${next?.id === st.id ? "bg-amber-50" : ""}`}>
            {st.done ? <CircleCheck size={20} className="text-emerald-700 shrink-0" /> : <Circle size={20} className="text-stone-300 shrink-0" />}
            <div className="flex-1 min-w-[160px]">
              <p className={`text-sm font-semibold ${st.done ? "text-slate-700" : "text-slate-900"}`}>{st.title}{st.optional && <span className="ml-1 text-[11px] font-normal text-stone-500">(optional)</span>}{next?.id === st.id && <span className="ml-2 rounded-full bg-amber-200 text-amber-900 px-2 py-0.5 text-[10px] font-bold uppercase">Next</span>}</p>
              <p className="text-xs text-stone-500">{st.info}</p>
            </div>
            {st.action || null}
          </li>
        ))}
      </ol>
      {open === "details" && opts && <BookForm data={opts} initial={toForm(full)} onCancel={() => setOpen(null)} onSaved={async () => { setOpen(null); await reload(); }} />}
      {open === "lessons" && <QuestBookLessonsAdmin book={book} onChanged={reload} />}
    </section>
  );
}

/** Watermarked page pictures shown before buying. Images only: the real PDF is never sent. */
function LookInside({ book, onClose, children }) {
  const [urls, setUrls] = useState([]);
  const [err, setErr] = useState("");
  useEffect(() => {
    let live = true; const made = [];
    (async () => {
      try {
        for (let n = 1; n <= book.look_pages; n++) {
          const r = await api.get(`/quest-books/books/${encodeURIComponent(book.id)}/look/${n}`, { responseType: "blob" });
          const u = URL.createObjectURL(r.data); made.push(u);
          if (live) setUrls((x) => [...x, u]);
        }
      } catch (e) { if (live) setErr("Could not load the preview pages."); }
    })();
    return () => { live = false; made.forEach((u) => URL.revokeObjectURL(u)); };
  }, [book.id, book.look_pages]);
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Look inside ${book.title}`}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()} data-testid="quest-look-inside">
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <div className="mr-auto"><div className="text-[11px] font-bold uppercase tracking-wider text-violet-700">Look inside</div><h3 className="font-display font-bold text-slate-900 leading-tight">{book.title}</h3></div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-stone-100"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto bg-stone-100 p-3 space-y-3 select-none" onContextMenu={(e) => e.preventDefault()}>
          {err && <p className="text-red-700 text-sm">{err}</p>}
          {!urls.length && !err && <p className="text-sm text-stone-500">Loading pages…</p>}
          {urls.map((u, i) => <img key={u} src={u} alt={`Preview page ${i + 1}`} draggable={false} className="mx-auto w-full max-w-[560px] rounded shadow pointer-events-none" />)}
          {urls.length > 0 && urls.length === book.look_pages && <p className="text-center text-xs text-stone-500 py-2">That's the preview. The full book{book.pages ? ` has ${book.pages} pages` : " has many more pages"}, in full quality with no watermark.</p>}
        </div>
        <div className="border-t bg-white px-4 py-3 flex flex-wrap gap-2 items-center">{children}</div>
      </div>
    </div>
  );
}

/** Members read and print a book from its page pictures. The PDF itself is never sent. */
function BookReader({ book, onClose }) {
  const total = book.read_pages;
  const { user } = useAuth();
  const maxPrint = 12;
  const urls = React.useRef(new Map());
  const [, force] = useState(0);
  const [page, setPage] = useState(1);
  const [printOpen, setPrintOpen] = useState(false);
  const [range, setRange] = useState({ from: 1, to: Math.min(total, 8) });
  const [printing, setPrinting] = useState("");
  const scroller = React.useRef(null);
  const load = React.useCallback(async (n) => {
    if (urls.current.has(n)) return urls.current.get(n);
    urls.current.set(n, null);
    try {
      const r = await api.get(`/quest-books/books/${encodeURIComponent(book.id)}/read/${n}`, { responseType: "blob" });
      const u = URL.createObjectURL(r.data);
      urls.current.set(n, u); force((x) => x + 1);
      return u;
    } catch { urls.current.delete(n); return null; }
  }, [book.id]);
  useEffect(() => () => { for (const u of urls.current.values()) if (u) URL.revokeObjectURL(u); }, []);
  useEffect(() => { const k = (e) => e.key === "Escape" && !printing && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose, printing]);
  // Load pages as they scroll into view (and the next couple ahead).
  useEffect(() => {
    const root = scroller.current;
    if (!root) return undefined;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {
        const n = Number(e.target.dataset.page);
        setPage(n);
        for (let k = n; k <= Math.min(total, n + 2); k++) void load(k);
      }
    }, { root, rootMargin: "400px 0px" });
    root.querySelectorAll("[data-page]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [load, total]);
  const goTo = (n) => scroller.current?.querySelector(`[data-page="${Math.max(1, Math.min(total, n))}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const print = async () => {
    const from = Math.max(1, Math.min(total, Number(range.from) || 1));
    const to = Math.max(from, Math.min(total, Number(range.to) || total));
    if (to - from + 1 > maxPrint) {
      toast.error(`Members can print up to ${maxPrint} pages at a time. Choose a smaller activity range, or purchase the PDF for unlimited personal printing.`);
      return;
    }
    setPrinting(`Getting pages ready… 0 of ${to - from + 1}`);
    try {
      const list = [];
      for (let n = from; n <= to; n++) {
        const u = await load(n);
        if (!u) throw new Error(`Page ${n} didn't load`);
        list.push(u);
        setPrinting(`Getting pages ready… ${n - from + 1} of ${to - from + 1}`);
      }
      const rootEl = document.createElement("div");
      rootEl.id = "sq-print-root";
      const style = document.createElement("style");
      style.textContent = "@media screen{#sq-print-root{display:none}}@media print{body>*:not(#sq-print-root){display:none!important}#sq-print-root .sq-print-page{page-break-after:always;break-after:page;position:relative;width:100%;}#sq-print-root img{display:block;width:100%;height:auto;}#sq-print-root .sq-print-label{font:11px sans-serif;text-align:right;color:#666;padding:4px 12px;}@page{margin:0}}";
      rootEl.appendChild(style);
      for (const u of list) {
        const pageEl = document.createElement("div"); pageEl.className = "sq-print-page";
        const img = document.createElement("img"); img.src = u; img.alt = "";
        const label = document.createElement("div"); label.className = "sq-print-label";
        label.textContent = `Side-Quest membership print · Licensed to ${user?.name || "this family account"} · Not for redistribution`;
        pageEl.appendChild(img); pageEl.appendChild(label); rootEl.appendChild(pageEl);
      }
      document.body.appendChild(rootEl);
      await Promise.all([...rootEl.querySelectorAll("img")].map((img) => (img.complete ? null : new Promise((r) => { img.onload = r; img.onerror = r; }))));
      const done = () => { rootEl.remove(); window.removeEventListener("afterprint", done); };
      window.addEventListener("afterprint", done);
      setPrinting(""); setPrintOpen(false);
      window.print();
      setTimeout(() => { if (document.body.contains(rootEl)) done(); }, 60000);
    } catch (e) { toast.error(e.message || "Couldn't prepare the pages to print"); setPrinting(""); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-800/95 flex flex-col" role="dialog" aria-modal="true" aria-label={`Reading ${book.title}`} data-testid="quest-reader">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-white border-b">
        <h3 className="mr-auto font-display font-bold text-slate-900 truncate max-w-[50%]">{book.title}</h3>
        <button type="button" onClick={() => goTo(page - 1)} aria-label="Previous page" className="rounded-full p-1.5 hover:bg-stone-100"><ChevronLeft size={18} /></button>
        <span className="text-sm text-stone-700 tabular-nums">Page {page} of {total}</span>
        <button type="button" onClick={() => goTo(page + 1)} aria-label="Next page" className="rounded-full p-1.5 hover:bg-stone-100"><ChevronRight size={18} /></button>
        <button type="button" onClick={() => setPrintOpen((x) => !x)} data-testid="quest-reader-print" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-900 text-white px-3 py-1.5 text-sm font-bold"><Printer size={15} /> Print</button>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-stone-100"><X size={18} /></button>
      </div>
      {printOpen && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-emerald-50 border-b text-sm">
          <span className="font-semibold text-emerald-950">Print pages</span>
          <input type="number" min={1} max={total} value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} className="w-20 rounded border border-stone-300 px-2 py-1" aria-label="From page" />
          <span>to</span>
          <input type="number" min={1} max={total} value={range.to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} className="w-20 rounded border border-stone-300 px-2 py-1" aria-label="To page" />
          <button type="button" onClick={() => setRange({ from: page, to: page })} className="underline">Just this page</button>
          <span className="text-xs text-stone-600">Up to {maxPrint} pages per print job. Full PDF printing is included with a purchased book.</span>
          <button type="button" onClick={print} disabled={!!printing} className="ml-auto rounded-lg bg-emerald-900 text-white px-3 py-1.5 font-bold disabled:opacity-60">{printing || "Print"}</button>
        </div>
      )}
      <div ref={scroller} className="flex-1 overflow-y-auto py-4 space-y-4 select-none" onContextMenu={(e) => e.preventDefault()}>
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
          const u = urls.current.get(n);
          return (
            <div key={n} data-page={n} className="mx-auto w-[min(95vw,820px)] aspect-[1/1.414] bg-white shadow-lg grid place-items-center">
              {u ? <img src={u} alt={`Page ${n}`} draggable={false} className="w-full h-full object-contain pointer-events-none" /> : <span className="text-sm text-stone-400">Page {n}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookView({ id }) {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [peek, setPeek] = useState(null);
  const [look, setLook] = useState(false);
  const [reading, setReading] = useState(false);
  const [confirming, setConfirming] = useState(params.get("purchase") === "success");
  const load = () => api.get(`/quest-books/books/${encodeURIComponent(id)}`, { params: { _: Date.now() } })
    .then(({ data: d }) => { setData(d); return d; }).catch((e) => { setError(apiErrorMessage(e, "Could not open this book")); return null; });
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Returning from Stripe grants nothing by itself: wait for the verified payment to unlock the book.
  useEffect(() => {
    if (params.get("purchase") === "cancelled") { toast("Checkout cancelled. Nothing was charged."); setParams({}, { replace: true }); return undefined; }
    if (params.get("purchase") !== "success") return undefined;
    let tries = 0, live = true;
    const tick = async () => {
      const d = await load();
      if (!live) return;
      const tier = params.get("tier"), key = params.get("key");
      const done = tier === "plus" ? d?.book?.owned_tier === "plus" : tier === "lesson" ? d?.lessons?.some((l) => l.key === key && l.unlocked) : d?.book?.can_download;
      if (done) { setConfirming(false); setParams({}, { replace: true }); toast.success("Payment received. It's yours!"); return; }
      if (++tries < 15) setTimeout(tick, 2000);
      else { setConfirming(false); toast("Your payment is still being confirmed. Refresh this page in a minute.", { duration: 9000 }); }
    };
    tick();
    return () => { live = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const book = data?.book;
  const lessons = data?.lessons || [];
  const [adding, setAdding] = useState("");
  const addLessons = async (key) => {
    setAdding(key || "all");
    try {
      const r = await api.post(`/quest-books/books/${encodeURIComponent(id)}/lessons/add`, key ? { key } : {}, { timeout: 120000 });
      toast.success(r.data.added ? `Added ${r.data.added} lesson${r.data.added === 1 ? "" : "s"} to My lessons` : "Those lessons are already in My lessons");
      if (r.data.added && r.data.without_matches > 0) {
        toast.message(`${r.data.without_matches} lesson${r.data.without_matches === 1 ? " has" : "s have"} no suggested outcome codes for your family's curriculum yet. The lesson is still available; check the official curriculum before recording progress.`, { duration: 9000 });
      }
      await load();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not add the lessons")); }
    finally { setAdding(""); }
  };
  const navigate = useNavigate();
  const cart = useCart();
  const has = (tier, lessonKey) => inCart(cart, { book_id: id, tier, ...(lessonKey ? { lesson_key: lessonKey } : {}) });
  // "Buy" adds to the cart; checkout happens once for everything in the cart.
  const add = (tier = "book", lessonKey) => {
    if (has(tier, lessonKey)) { navigate("/parent/quest-books/cart"); return; }
    addToCart({ book_id: id, tier, ...(lessonKey ? { lesson_key: lessonKey } : {}) });
    setLook(false);
    toast.success(tier === "plus" ? "Book + lessons added to your cart" : tier === "lesson" ? "Lesson added to your cart" : "Book added to your cart",
      { action: { label: "View cart", onClick: () => navigate("/parent/quest-books/cart") } });
  };
  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="quest-book-detail">
      <div className="flex items-center gap-3">
        <Link to="/parent/quest-books" className="mr-auto inline-flex items-center gap-1 text-sm font-semibold text-emerald-900 hover:underline"><ArrowLeft size={16} /> All Quest Books</Link>
        <CartButton />
      </div>
      {!data && !error && <p role="status">Opening the book…</p>}
      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900" role="alert">{error}</div>}
      {book && (
        <section className="rounded-3xl bg-gradient-to-br from-[#fbf6ec] to-[#efe2c9] border border-amber-200 p-6 sm:p-9 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <QuestBookCover book={book} size="lg" />
          <div className="flex-1 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">{book.year_label} · {book.subject_label}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{book.title}</h1>
            {book.subtitle && <p className="italic text-stone-700" style={{ fontFamily: "Georgia, serif" }}>{book.subtitle}</p>}
            {book.description && <p className="text-stone-700 whitespace-pre-line">{book.description}</p>}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/80 border border-amber-200 px-3 py-1.5">{book.can_download ? "Your purchased PDF" : book.included ? "Online reader · selected-page printing" : "PDF available to purchase"}</span>
              {book.pages && <span className="rounded-full bg-white/80 border border-amber-200 px-3 py-1.5">{book.pages} pages</span>}
              {book.book_bytes && <span className="rounded-full bg-white/80 border border-amber-200 px-3 py-1.5">{mb(book.book_bytes)}</span>}
            </div>
            {confirming && <p role="status" className="rounded-xl bg-white/80 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-900">Payment received. Unlocking your book…</p>}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              {book.can_download ? (
                <a href={pdfLink(book.id, "book")} download data-testid="quest-book-download"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold shadow hover:bg-emerald-800">
                  <Download size={18} /> Download the book
                </a>
              ) : book.can_read ? (
                <>
                  <button type="button" onClick={() => setReading(true)} data-testid="quest-book-read"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold shadow hover:bg-emerald-800">
                    <BookText size={18} /> Read and print
                  </button>
                  {book.can_buy && (
                    <button type="button" onClick={() => add("book")} data-testid="quest-book-buy-keep"
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-800 bg-white text-emerald-900 px-4 py-2.5 text-sm font-bold hover:bg-emerald-50">
                      {has("book") ? <><Check size={16} /> In your cart</> : <><ShoppingCart size={16} /> Buy the PDF to keep · {money(book.price_cents)}</>}
                    </button>
                  )}
                </>
              ) : (
                <>
                  {book.can_buy && (
                    <button type="button" onClick={() => (book.look_pages && !has("book") ? setLook(true) : add("book"))} disabled={confirming} data-testid="quest-book-buy"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold shadow hover:bg-emerald-800 disabled:opacity-60">
                      {has("book") ? <><Check size={18} /> In your cart · view cart</> : <><ShoppingBag size={18} /> Buy this book · {money(book.price_cents)}</>}
                    </button>
                  )}
                  {!book.can_buy && <span className="text-sm text-stone-600">Not on sale yet. Check back soon.</span>}
                </>
              )}
              {book.look_pages > 0 && !book.can_download && (
                <button type="button" onClick={() => setLook(true)} data-testid="quest-book-look"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-500 bg-white text-violet-900 px-4 py-2.5 text-sm font-bold hover:bg-violet-50">
                  <Eye size={16} /> Look inside
                </button>
              )}
            </div>
            {book.can_buy_plus && (
              <div className="space-y-1">
                <button type="button" onClick={() => add("plus")} disabled={confirming} data-testid="quest-book-buy-plus"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-600 bg-violet-50 text-violet-900 px-4 py-2.5 text-sm font-bold hover:bg-violet-100 disabled:opacity-60">
                  {has("plus") ? <><Check size={16} /> Book + lessons in your cart · view cart</> : <><BookOpenCheck size={16} /> {book.owned_tier === "book" ? `Add all ${lessons.length} lessons` : `Book + all ${lessons.length} lessons`} · {book.pack_discount_pct > 0 && <s className="font-normal opacity-60">{money(book.plus_full_price_cents)}</s>} {money(book.plus_price_cents)}</>}
                </button>
                {book.pack_discount_pct > 0 && <p className="text-xs font-semibold text-violet-800">{book.pack_discount_pct}% off because you already have {book.pack_discount_pct / 10} pack{book.pack_discount_pct === 10 ? "" : "s"}.</p>}
                {book.pack_discount_pct === 0 && book.owned_tier !== "book" && <p className="text-xs text-stone-600">Each extra pack you buy is 10% cheaper again, up to 50% off.</p>}
              </div>
            )}
            {book.owned && <p className="text-xs text-stone-600 inline-flex items-center gap-1"><Check size={14} /> You bought this book{book.owned_tier === "plus" ? " and its lessons" : ""}. Download it again any time.</p>}
            {book.can_download && <p className="text-xs text-stone-600">Print it at home or open it on a tablet. For a family's own use only, please don't share the file.</p>}

          </div>
        </section>
      )}
      {data?.owner && book && <BookWorkspace book={book} reload={load} />}
      {reading && book && <BookReader book={book} onClose={() => setReading(false)} />}
      {look && book && (
        <LookInside book={book} onClose={() => setLook(false)}>
          {book.can_buy && <button type="button" onClick={() => add("book")} data-testid="quest-look-buy" className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-4 py-2.5 text-sm font-bold disabled:opacity-60"><ShoppingCart size={16} /> {has("book") ? "In your cart" : `Add book to cart · ${money(book.price_cents)}`}</button>}
          {book.can_buy_plus && <button type="button" onClick={() => add("plus")} className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-600 bg-violet-50 text-violet-900 px-4 py-2.5 text-sm font-bold disabled:opacity-60"><BookOpenCheck size={16} /> {has("plus") ? "Pack in your cart" : `Add book + lessons · ${money(book.plus_price_cents)}`}</button>}
          <button type="button" onClick={() => setLook(false)} className="ml-auto text-sm font-semibold text-stone-600 underline">Not now</button>
        </LookInside>
      )}
      {book && lessons.length > 0 && (
        <section className="space-y-3" data-testid="quest-book-lessons">
          <div className="flex flex-wrap items-end gap-3">
            <div className="mr-auto"><h2 className="font-display text-2xl font-bold text-slate-900">Ready-made lessons</h2>
              <p className="text-sm text-stone-600">Complete lessons matched to workbook skills and pages. Assign online or print, then review as usual.</p></div>
            {lessons.some((l) => l.unlocked && !l.lesson_id) && (
              <button type="button" onClick={() => addLessons()} disabled={!!adding} data-testid="quest-book-add-lessons"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-4 py-2.5 text-sm font-bold disabled:opacity-60">
                <Plus size={16} /> {adding === "all" ? "Adding…" : `Add ${lessons.filter((l) => l.unlocked && !l.lesson_id).length} lessons to My lessons`}
              </button>
            )}
          </div>
          <ol className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100 overflow-hidden">
            {lessons.map((l) => (
              <li key={l.key} className="px-5 py-3 flex items-center gap-4">
                <span className="h-8 w-8 shrink-0 rounded-full bg-amber-100 text-amber-900 font-bold text-sm grid place-items-center">{l.position}</span>
                <div className="flex-1 min-w-0"><p className="font-semibold text-slate-900">{l.title}</p><p className="text-xs text-stone-500">Chapter: {l.chapter_title}</p></div>
                <button type="button" onClick={() => setPeek({ key: l.key, title: l.title })} data-testid={`quest-lesson-peek-${l.key}`}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100"><Eye size={14} /> Peek</button>
                {l.lesson_id ? (
                  <Link to={`/parent/lessons/${l.lesson_id}/review`} className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-900 px-3 py-1.5 text-xs font-bold"><Check size={14} /> Open & assign</Link>
                ) : l.unlocked ? (
                  <button type="button" onClick={() => addLessons(l.key)} disabled={!!adding} className="shrink-0 rounded-lg border border-emerald-700 px-3 py-1.5 text-xs font-bold text-emerald-900">{adding === l.key ? "Adding…" : "Add"}</button>
                ) : book.can_buy_lesson ? (
                  <button type="button" onClick={() => add("lesson", l.key)} disabled={confirming} className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-violet-400 px-3 py-1.5 text-xs font-bold text-violet-900 hover:bg-violet-50">{has("lesson", l.key) ? <><Check size={13} /> In cart</> : <><ShoppingCart size={13} /> Add · {money(book.lesson_price_cents)}</>}</button>
                ) : <Lock size={15} className="shrink-0 text-stone-400" aria-label="Included with Family Membership" />}
              </li>
            ))}
          </ol>
          {peek && <LessonPeek bookId={book.id} peek={peek} onClose={() => setPeek(null)} />}
          <p className="text-xs text-stone-600">Lessons you buy stay yours to assign, even without a membership.</p>
        </section>
      )}
    </div>
  );
}

function CartButton() {
  const cart = useCart();
  return (
    <Link to="/parent/quest-books/cart" data-testid="quest-cart-button"
      className="relative inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-white px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-50">
      <ShoppingCart size={16} /> Cart
      {cart.length > 0 && <span className="rounded-full bg-emerald-900 text-white text-xs px-2 py-0.5">{cart.length}</span>}
    </Link>
  );
}

function CartView() {
  const cart = useCart();
  const [params, setParams] = useSearchParams();
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(params.get("purchase") === "success");
  const [done, setDone] = useState(false);
  const cartKey = JSON.stringify(cart);
  useEffect(() => {
    if (!cart.length) { setQuote({ lines: [], removed: [], total_cents: 0 }); return; }
    api.post("/quest-books/cart/quote", { items: cart }).then((r) => setQuote(r.data)).catch((e) => toast.error(apiErrorMessage(e, "Could not price your cart")));
  }, [cartKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Back from Stripe: wait for the verified payment, then empty the cart.
  useEffect(() => {
    if (params.get("purchase") === "cancelled") { toast("Checkout cancelled. Nothing was charged, and your cart is still here."); setParams({}, { replace: true }); return undefined; }
    const id = params.get("cart");
    if (params.get("purchase") !== "success" || !id) return undefined;
    let tries = 0, live = true;
    const tick = async () => {
      const r = await api.get(`/quest-books/cart/${encodeURIComponent(id)}/status`).catch(() => null);
      if (!live) return;
      if (r?.data?.paid) { clearCart(); setConfirming(false); setDone(true); setParams({}, { replace: true }); toast.success("Payment received. Everything is yours!"); return; }
      if (++tries < 20) setTimeout(tick, 2000);
      else { setConfirming(false); toast("Your payment is still being confirmed. Check your books again in a minute.", { duration: 9000 }); }
    };
    tick();
    return () => { live = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkout = async () => {
    setBusy(true);
    try {
      const r = await api.post("/quest-books/cart/checkout", { items: cart, expected_total_cents: quote?.total_cents });
      if (!r.data?.url) throw new Error("Checkout did not open.");
      window.location.assign(r.data.url);
    } catch (e) {
      if (e?.response?.data?.code === "CART_CHANGED") { setQuote(e.response.data.quote); toast("Prices changed. Check the new total, then press Checkout again."); }
      else toast.error(e?.response ? apiErrorMessage(e, "Could not start checkout") : e.message);
      setBusy(false);
    }
  };
  // Tidy the cart to what the server says can be bought (owned items, replaced lessons and so on drop out).
  const tidy = () => setCart(quote.lines.map((l) => ({ book_id: l.book_id, tier: l.tier, ...(l.lesson_key ? { lesson_key: l.lesson_key } : {}) })));
  const tierLabel = (t) => (t === "plus" ? "Book + all lessons" : t === "lesson" ? "Single lesson" : "Book (PDF)");

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6 max-w-3xl" data-testid="quest-cart">
      <Link to="/parent/quest-books" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-900 hover:underline"><ArrowLeft size={16} /> Keep browsing Quest Books</Link>
      <h1 className="font-display text-3xl font-bold text-slate-900 inline-flex items-center gap-3"><ShoppingCart size={28} /> Your cart</h1>
      {confirming && <p role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-900">Payment received. Unlocking everything…</p>}
      {done && <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-900">All done. Open any book you bought to download it, or add its lessons to My lessons.</p>}
      {!quote ? <p role="status">Working out your total…</p> : !quote.lines.length && !quote.removed.length ? (
        !done && <p className="text-stone-600">Your cart is empty. Open a book and press Buy to add it.</p>
      ) : (
        <>
          {quote.lines.length > 0 && (
            <ul className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100">
              {quote.lines.map((l) => (
                <li key={`${l.book_id}-${l.tier}-${l.lesson_key || ""}`} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/parent/quest-books/${l.book_id}`} className="font-semibold text-slate-900 hover:underline">{l.tier === "lesson" ? l.title.replace(/^Lesson: /, "") : l.book_title}</Link>
                    <p className="text-xs text-stone-500">{tierLabel(l.tier)}{l.tier === "lesson" ? ` · ${l.book_title}` : ""}{/upgrade/.test(l.title) ? " · upgrade from the book you own" : ""}</p>
                    {l.note && <p className="text-xs font-semibold text-violet-800">{l.note}</p>}
                  </div>
                  <div className="text-right text-sm font-bold text-slate-900">{l.full_cents > l.amount_cents && <s className="block text-xs font-normal text-stone-400">{money(l.full_cents)}</s>}{money(l.amount_cents)}</div>
                  <button type="button" aria-label="Remove" onClick={() => removeFromCart({ book_id: l.book_id, tier: l.tier, lesson_key: l.lesson_key })} className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100"><X size={16} /></button>
                </li>
              ))}
            </ul>
          )}
          {quote.removed.length > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900 space-y-1">
              {quote.removed.map((r, i) => <p key={i}>One item was taken out: {r.reason}</p>)}
              <button type="button" onClick={tidy} className="font-semibold underline">OK, tidy my cart</button>
            </div>
          )}
          {quote.lines.length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              <div className="mr-auto text-lg font-bold text-slate-900">Total {money(quote.total_cents)} <span className="text-xs font-normal text-stone-500">AUD</span></div>
              <button type="button" onClick={checkout} disabled={busy || confirming || quote.can_buy === false} data-testid="quest-cart-checkout"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-6 py-3 font-bold shadow hover:bg-emerald-800 disabled:opacity-60">
                <ShoppingBag size={18} /> {busy ? "Opening checkout…" : "Checkout"}
              </button>
            </div>
          )}
          <p className="text-xs text-stone-600">Each extra book + lessons pack is 10% cheaper again, up to 50% off. Family Membership includes every book and lesson.</p>
        </>
      )}
    </div>
  );
}

export default function QuestBooks() {
  const { bookId } = useParams();
  if (bookId === "cart") return <CartView />;
  return bookId ? <BookView id={bookId} /> : <ShelfView />;
}
