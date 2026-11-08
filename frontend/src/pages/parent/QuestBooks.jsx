import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, BookOpenCheck, Check, Download, FileText, Gift, ImagePlus, Lock, Pencil, Plus, ShoppingBag, Sparkles, Trash2, Upload } from "lucide-react";
import { API, FILE_TOKEN, api, apiErrorMessage } from "../../lib/api";
import QuestBookCover from "../../components/parent/QuestBookCover";
import QuestBookLessonsAdmin from "../../components/parent/QuestBookLessonsAdmin";
import PdfPreview from "../../components/parent/PdfPreview";

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

const EMPTY = { title: "", subtitle: "", year: 3, subject: "mathematics", description: "", pages: "", price: "", bundle: "", lesson: "" };
const dollars = (c) => (c == null ? "" : (c / 100).toFixed(2));
const toForm = (b) => ({ id: b.id, title: b.title, subtitle: b.subtitle || "", year: b.year, subject: b.subject, description: b.description || "", pages: b.pages ?? "", price: dollars(b.price_cents), bundle: dollars(b.lessons_price_cents), lesson: dollars(b.lesson_price_cents) });
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
      const r = await api.post("/quest-books/admin/books", { ...(f.id ? { id: f.id } : {}), title: f.title, subtitle: f.subtitle, year: Number(f.year), subject: f.subject, description: f.description, pages: f.pages === "" ? null : Number(f.pages), price_cents, lessons_price_cents, lesson_price_cents });
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
      <label className="text-sm font-semibold text-emerald-950">Year level
        <select value={f.year} onChange={set("year")} className={field}>{data.years.map((y) => <option key={y.year} value={y.year}>{y.label}</option>)}</select>
      </label>
      <label className="text-sm font-semibold text-emerald-950">Subject
        <select value={f.subject} onChange={set("subject")} className={field}>{data.subjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
      </label>
      <label className="text-sm font-semibold text-emerald-950">Pages<input value={f.pages} onChange={set("pages")} inputMode="numeric" className={field} placeholder="optional" /></label>
      <label className="text-sm font-semibold text-emerald-950">Book price ($)<input value={f.price} onChange={set("price")} inputMode="decimal" className={field} placeholder="empty = members only" /></label>
      <label className="text-sm font-semibold text-emerald-950">Book + all lessons price ($)<input value={f.bundle} onChange={set("bundle")} inputMode="decimal" className={field} placeholder="e.g. 15.00 (optional)" /></label>
      <label className="text-sm font-semibold text-emerald-950">Single lesson price ($)<input value={f.lesson} onChange={set("lesson")} inputMode="decimal" className={field} placeholder="e.g. 1.00 (optional)" /></label>
      <p className="sm:col-span-2 text-xs text-stone-600">Prices are only for families without a membership. Members get the book and its lessons included. Lesson prices apply once you publish lessons to the book.</p>
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
  { kind: "sample", label: "Sample PDF", accept: "application/pdf,.pdf", type: "application/pdf", icon: Gift },
  { kind: "cover", label: "Cover PNG", accept: "image/png", type: "image/png", icon: ImagePlus },
];

function OwnerPanel({ data, reload }) {
  const [busy, setBusy] = useState("");
  const [progress, setProgress] = useState(0);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [lessonsFor, setLessonsFor] = useState(null);
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
    <section className="rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-5 space-y-4" data-testid="quest-books-owner">
      <div>
        <h2 className="font-bold text-emerald-950">Owner HQ · Quest Books uploader</h2>
        <p className="text-sm text-emerald-900 mt-1">Only you can see this. Create a book, then upload its <strong>Book PDF</strong> (what members and buyers download), a short <strong>Sample PDF</strong> (free for everyone) and a portrait <strong>Cover PNG</strong>. Families only see a book once its Book PDF is uploaded. PDFs can be up to 95 MB.</p>
      </div>
      {adding ? (
        <BookForm data={data} onCancel={() => setAdding(false)} onSaved={async () => { setAdding(false); await reload(); }} />
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-full bg-emerald-900 text-white px-4 py-2 text-sm font-bold"><Plus size={16} /> Add a book</button>
      )}
      <div className="rounded-xl border border-emerald-300 bg-white divide-y divide-stone-100">
        {!data.books.length ? <p className="p-3 text-sm text-stone-600">No books yet.</p> : data.books.map((b) => (
          <div key={b.id} className="p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <QuestBookCover book={b} size="sm" />
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold text-slate-900">{b.title} {!b.has_book && <span className="ml-1 rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold uppercase">Draft: hidden from families</span>}</p>
                <p className="text-xs text-stone-500">{b.year_label} · {b.subject_label} · {b.price_cents == null ? "Members only" : `Book ${money(b.price_cents)}`}{b.lessons_price_cents != null ? ` · Bundle ${money(b.lessons_price_cents)}` : ""}{b.lesson_price_cents != null ? ` · Lesson ${money(b.lesson_price_cents)}` : ""}{b.has_lessons ? " · Lessons published" : ""}</p>
                <p className="text-xs text-stone-500 mt-0.5">{b.has_book ? `Book ${mb(b.book_bytes)} ✓` : "No book PDF"} · {b.has_sample ? `Sample ${mb(b.sample_bytes)} ✓` : "No sample"} · {b.has_cover ? "Cover ✓" : "No cover"}</p>
              </div>
              <button type="button" disabled={!!busy} onClick={() => setLessonsFor(lessonsFor === b.id ? null : b.id)} className="inline-flex gap-1 items-center rounded-lg border border-violet-300 px-3 py-2 text-sm font-semibold text-violet-900 hover:bg-violet-50"><BookOpenCheck size={15} /> Lessons</button>
              <button type="button" disabled={!!busy} onClick={() => setEditing(editing === b.id ? null : b.id)} className="inline-flex gap-1 items-center rounded-lg border border-emerald-400 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"><Pencil size={15} /> Details</button>
              <button type="button" disabled={!!busy} onClick={() => setDeleteTarget(b)} className="inline-flex gap-1 items-center rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"><Trash2 size={15} /> Remove</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILES.map((spec) => {
                const has = spec.kind === "book" ? b.has_book : spec.kind === "sample" ? b.has_sample : b.has_cover;
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

function ShelfView() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [year, setYear] = useState(null);
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
    return data.subjects.flatMap((s) => {
      const books = data.books.filter((b) => b.year === year && b.subject === s.id && (b.has_book || data.owner));
      return books.length ? books : [{ placeholder: true, subject: s.id, subjectLabel: s.label, yearLabel, id: `${s.id}-soon` }];
    });
  }, [data, year, yearLabel]);
  const countByYear = useMemo(() => {
    const m = new Map();
    for (const b of data?.books || []) if (b.has_book) m.set(b.year, (m.get(b.year) || 0) + 1);
    return m;
  }, [data]);

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="quest-books">
      <header className="rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-100 border border-amber-200 p-6 sm:p-9 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold tracking-widest uppercase text-emerald-800">Side-Quest · Year-by-year subject books</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 text-slate-900">Quest Books</h1>
          <p className="mt-3 text-stone-700">Beautiful downloadable books for Maths, English, Science, History and Geography, made for each year level. Download a book as a PDF to print at home or use on a tablet.</p>
        </div>
        <Sparkles className="absolute right-6 top-6 text-amber-300" size={44} />
        <BookOpen className="absolute right-[-18px] bottom-[-26px] text-emerald-800/10 rotate-[-12deg]" size={170} />
      </header>

      {!data && !error && <p role="status">Opening Quest Books…</p>}
      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900" role="alert">{error}</div>}
      {data && <>
        {!data.member && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex gap-3 items-start text-amber-950 text-sm">
            <Gift size={18} className="mt-0.5 shrink-0" />
            <p>Download a free sample of any book. Every Quest Book is included with <Link to="/parent/plan" className="underline font-semibold">Family Membership</Link>{data.can_buy ? ", or you can buy a single book to keep." : "."}</p>
          </div>
        )}

        <nav aria-label="Year level" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {data.years.map((y) => (
            <button key={y.year} type="button" data-testid={`quest-year-${y.year}`}
              onClick={() => { setYear(y.year); rememberYear(y.year); }}
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
              <div key={b.id} className="flex flex-col items-center gap-2 w-36 sm:w-40">
                <QuestBookCover book={b} />
                <span className="text-xs font-semibold text-stone-500">{b.subjectLabel} · coming soon</span>
              </div>
            ) : (
              <Link key={b.id} to={`/parent/quest-books/${b.id}`} data-testid={`quest-book-${b.id}`}
                className="group flex flex-col items-center gap-2 w-36 sm:w-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 rounded-xl">
                <QuestBookCover book={b} className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]" />
                <span className="text-xs font-bold text-slate-800 text-center leading-tight">{b.title}</span>
                <span className="text-[11px] text-stone-600">{b.owned ? <span className="text-emerald-800 font-semibold">Yours</span> : b.can_download ? "Included" : b.price_cents != null && data.can_buy ? money(b.price_cents) : "Members"}{b.pages ? ` · ${b.pages} pages` : ""}</span>
              </Link>
            ))}
          </Shelf>
        </section>

        {data.owner && <OwnerPanel data={data} reload={load} />}
      </>}
    </div>
  );
}

function BookView({ id }) {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
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
  const [preview, setPreview] = useState(false);
  const addLessons = async (key) => {
    setAdding(key || "all");
    try {
      const r = await api.post(`/quest-books/books/${encodeURIComponent(id)}/lessons/add`, key ? { key } : {}, { timeout: 120000 });
      toast.success(r.data.added ? `Added ${r.data.added} lesson${r.data.added === 1 ? "" : "s"} to My lessons` : "Those lessons are already in My lessons");
      await load();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not add the lessons")); }
    finally { setAdding(""); }
  };
  const buy = async (tier = "book", lessonKey) => {
    setBusy(true);
    try {
      const r = await api.post(`/quest-books/books/${encodeURIComponent(id)}/checkout`, { tier, ...(lessonKey ? { lesson_key: lessonKey } : {}) });
      if (!r.data?.url) throw new Error("Checkout did not open.");
      window.location.assign(r.data.url);
    } catch (e) {
      toast.error(e?.response ? apiErrorMessage(e, "Could not start checkout") : e.message);
      setBusy(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="quest-book-detail">
      <Link to="/parent/quest-books" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-900 hover:underline"><ArrowLeft size={16} /> All Quest Books</Link>
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
              <span className="rounded-full bg-white/80 border border-amber-200 px-3 py-1.5">Digital download · PDF</span>
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
              ) : (
                <>
                  {book.can_buy && (
                    <button type="button" onClick={() => buy("book")} disabled={busy || confirming} data-testid="quest-book-buy"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold shadow hover:bg-emerald-800 disabled:opacity-60">
                      <ShoppingBag size={18} /> {busy ? "Opening checkout…" : `Buy this book · ${money(book.price_cents)}`}
                    </button>
                  )}
                  <Link to="/parent/plan" className={book.can_buy ? "text-sm font-semibold text-emerald-900 underline" : "inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold"}>
                    {book.can_buy ? "Or get every Quest Book with Family Membership" : "Included with Family Membership"}
                  </Link>
                </>
              )}
              {book.has_sample && (
                <button type="button" onClick={() => setPreview(true)} data-testid="quest-book-sample"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-500 bg-white text-amber-900 px-4 py-2.5 text-sm font-bold hover:bg-amber-50">
                  <Gift size={16} /> Preview free sample
                </button>
              )}
            </div>
            {book.can_buy_plus && (
              <button type="button" onClick={() => buy("plus")} disabled={busy || confirming} data-testid="quest-book-buy-plus"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-600 bg-violet-50 text-violet-900 px-4 py-2.5 text-sm font-bold hover:bg-violet-100 disabled:opacity-60">
                <BookOpenCheck size={16} /> {book.owned_tier === "book" ? `Add all ${lessons.length} lessons · ${money(book.plus_price_cents)}` : `Book + all ${lessons.length} lessons · ${money(book.plus_price_cents)}`}
              </button>
            )}
            {book.owned && <p className="text-xs text-stone-600 inline-flex items-center gap-1"><Check size={14} /> You bought this book{book.owned_tier === "plus" ? " and its lessons" : ""}. Download it again any time.</p>}
            {book.can_download && <p className="text-xs text-stone-600">Print it at home or open it on a tablet. For a family's own use only, please don't share the file.</p>}
          </div>
        </section>
      )}
      {preview && book && <PdfPreview title={`${book.title} · free sample`} fetchPath={`/quest-books/books/${encodeURIComponent(book.id)}/sample`} downloadHref={pdfLink(book.id, "sample")} onClose={() => setPreview(false)} />}
      {book && lessons.length > 0 && (
        <section className="space-y-3" data-testid="quest-book-lessons">
          <div className="flex flex-wrap items-end gap-3">
            <div className="mr-auto"><h2 className="font-display text-2xl font-bold text-slate-900">Ready-made lessons</h2>
              <p className="text-sm text-stone-600">One lesson for each chapter, ready to assign. Children complete them on screen and you review their work as usual.</p></div>
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
                {l.lesson_id ? (
                  <Link to={`/parent/lessons/${l.lesson_id}/review`} className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-900 px-3 py-1.5 text-xs font-bold"><Check size={14} /> Open & assign</Link>
                ) : l.unlocked ? (
                  <button type="button" onClick={() => addLessons(l.key)} disabled={!!adding} className="shrink-0 rounded-lg border border-emerald-700 px-3 py-1.5 text-xs font-bold text-emerald-900">{adding === l.key ? "Adding…" : "Add"}</button>
                ) : book.can_buy_lesson ? (
                  <button type="button" onClick={() => buy("lesson", l.key)} disabled={busy || confirming} className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-violet-400 px-3 py-1.5 text-xs font-bold text-violet-900 hover:bg-violet-50"><ShoppingBag size={13} /> Buy · {money(book.lesson_price_cents)}</button>
                ) : <Lock size={15} className="shrink-0 text-stone-400" aria-label="Included with Family Membership" />}
              </li>
            ))}
          </ol>
          {!data.member && <p className="text-xs text-stone-600">Lessons you buy stay yours to assign, even without a membership. Family Membership includes every book and lesson.</p>}
        </section>
      )}
    </div>
  );
}

export default function QuestBooks() {
  const { bookId } = useParams();
  return bookId ? <BookView id={bookId} /> : <ShelfView />;
}
