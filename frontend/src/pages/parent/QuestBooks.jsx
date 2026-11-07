import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Check, Clock, Gift, ImagePlus, Lock, Plus, ShoppingBag, Sparkles, Trash2, Upload } from "lucide-react";
import { api, apiErrorMessage } from "../../lib/api";
import QuestBookCover from "../../components/parent/QuestBookCover";
import LessonPrintActions from "../../components/parent/LessonPrintActions";

export const money = (cents) => (cents == null ? "" : `$${(cents / 100).toFixed(2)}`);

const YEAR_KEY = "sq_quest_books_year";
const rememberYear = (y) => { try { localStorage.setItem(YEAR_KEY, String(y)); } catch {} };
const storedYear = () => { try { const v = localStorage.getItem(YEAR_KEY); return v === null ? null : Number(v); } catch { return null; } };

function Shelf({ children }) {
  return (
    <div className="relative pt-6">
      <div className="flex flex-wrap gap-x-6 gap-y-10 sm:gap-x-9 px-3 sm:px-6 pb-3 justify-center sm:justify-start relative z-10">{children}</div>
      {/* wooden ledge */}
      <div className="h-4 rounded-md bg-gradient-to-b from-amber-700 to-amber-900 shadow-[0_8px_14px_-6px_rgba(60,30,5,.55)]" />
      <div className="h-2 mx-3 rounded-b-md bg-amber-950/40" />
    </div>
  );
}

function OwnerPanel({ data, reload }) {
  const [busy, setBusy] = useState("");
  const [replace, setReplace] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const importBooks = async (files) => {
    setBusy("import");
    let done = 0;
    try {
      for (const file of files) {
        const text = await file.text();
        const r = await api.post(`/quest-books/admin/books${replace ? "?replace=1" : ""}`, text, { headers: { "Content-Type": "application/json" }, timeout: 120000 });
        if (!r.data?.ok) throw new Error(`Quest Books did not confirm ${file.name}.`);
        done++;
        toast.success(`${r.data.replaced ? "Updated" : "Added"} “${r.data.title}” (${r.data.lessons} lessons)`);
      }
      await reload();
    } catch (e) {
      toast.error(`${done ? done + " book(s) saved before the error. " : ""}${e?.response ? apiErrorMessage(e, "Import stopped") : e?.message || "Import stopped"}`, { duration: 9000 });
    } finally { setBusy(""); }
  };
  const uploadCover = async (book, file) => {
    setBusy("cover-" + book.id);
    try {
      const r = await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/cover`, file, { headers: { "Content-Type": "image/png" }, timeout: 120000 });
      if (!r.data?.ok) throw new Error("The cover was not confirmed.");
      toast.success(`Cover saved for “${book.title}”`);
      await reload();
    } catch (e) { toast.error(e?.response ? apiErrorMessage(e, "Could not save the cover") : e.message); }
    finally { setBusy(""); }
  };
  const savePrice = async (book, text) => {
    const trimmed = String(text || "").replace(/[$\s]/g, "");
    const cents = trimmed === "" ? null : Math.round(Number(trimmed) * 100);
    if (cents !== null && (!Number.isFinite(cents) || cents < 100)) { toast.error("Enter a price of at least $1, or leave it empty for members only."); return; }
    setBusy("price-" + book.id);
    try {
      await api.put(`/quest-books/admin/books/${encodeURIComponent(book.id)}/price`, { price_cents: cents });
      toast.success(cents === null ? `“${book.title}” is now members only` : `“${book.title}” can be bought for ${money(cents)}`);
      await reload();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not save the price")); }
    finally { setBusy(""); }
  };
  const remove = async () => {
    const book = deleteTarget;
    setBusy("delete-" + book.id);
    try {
      await api.delete(`/quest-books/admin/books/${encodeURIComponent(book.id)}`);
      toast.success(`Removed “${book.title}”. Families keep any lessons they already added.`);
      setDeleteTarget(null);
      await reload();
    } catch (e) { toast.error(apiErrorMessage(e, "Could not remove the book")); }
    finally { setBusy(""); }
  };

  return (
    <section className="rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-5 space-y-4" data-testid="quest-books-owner">
      <div>
        <h2 className="font-bold text-emerald-950">Owner HQ · Quest Books uploader</h2>
        <p className="text-sm text-emerald-900 mt-1">Only you can see this. Upload each book as a <strong>.json</strong> file (id, year, subject, title, lessons, and optionally <code>sample_key</code> to choose the free sample lesson; otherwise it's the first lesson). Set each book's price below; leave it empty to keep a book for members only. Every lesson is checked before anything is saved. Add a portrait <strong>PNG</strong> cover to any book; books without one get a designed cover. Updating a book never changes lessons families have already added; they can add new lessons from it.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 rounded-full bg-emerald-900 text-white px-4 py-2 text-sm font-bold cursor-pointer">
          <Upload size={16} /> {busy === "import" ? "Uploading…" : "Upload book files"}
          <input type="file" accept=".json,application/json" multiple disabled={!!busy} className="sr-only" data-testid="quest-books-import"
            onChange={(e) => { const f = [...(e.target.files || [])]; if (f.length) void importBooks(f); e.target.value = ""; }} />
        </label>
        <label className="flex gap-2 items-center text-sm text-emerald-900"><input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} disabled={!!busy} /> Replace existing books with the same id</label>
      </div>
      <div className="rounded-xl border border-emerald-300 bg-white divide-y divide-stone-100">
        {!data.books.length ? <p className="p-3 text-sm text-stone-600">No books uploaded yet.</p> : data.books.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-3 p-3">
            <QuestBookCover book={{ ...b, year_label: data.years.find((y) => y.year === b.year)?.label }} size="sm" />
            <div className="flex-1 min-w-[160px]">
              <p className="font-semibold text-slate-900">{b.title}</p>
              <p className="text-xs text-stone-500">{b.id} · {data.years.find((y) => y.year === b.year)?.label} · {b.lesson_count} lessons · {b.price_cents == null ? "Members only" : `${money(b.price_cents)} to buy`} · {b.has_cover ? "Cover uploaded" : "Designed cover"}</p>
            </div>
            <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); void savePrice(b, new FormData(e.currentTarget).get("price")); }}>
              <label className="text-xs font-semibold text-emerald-900" htmlFor={`price-${b.id}`}>Price $</label>
              <input id={`price-${b.id}`} name="price" inputMode="decimal" placeholder="members only" defaultValue={b.price_cents == null ? "" : (b.price_cents / 100).toFixed(2)} key={`${b.id}-${b.price_cents}`}
                className="w-24 rounded-lg border border-emerald-400 px-2 py-1.5 text-sm" disabled={!!busy} />
              <button type="submit" disabled={!!busy} className="rounded-lg bg-emerald-800 text-white px-2.5 py-1.5 text-xs font-bold disabled:opacity-50">{busy === "price-" + b.id ? "…" : "Save"}</button>
            </form>
            <label className="inline-flex items-center gap-1 rounded-lg border border-emerald-400 px-3 py-2 text-sm font-semibold text-emerald-900 cursor-pointer hover:bg-emerald-50">
              <ImagePlus size={15} /> {busy === "cover-" + b.id ? "Saving…" : b.has_cover ? "Replace cover" : "Add cover"}
              <input type="file" accept="image/png" className="sr-only" disabled={!!busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadCover(b, f); e.target.value = ""; }} />
            </label>
            <button type="button" disabled={!!busy} onClick={() => setDeleteTarget(b)} className="inline-flex gap-1 items-center rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50">
              <Trash2 size={15} /> Remove
            </button>
          </div>
        ))}
      </div>
      {deleteTarget && (
        <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 space-y-3" role="alertdialog" aria-label="Confirm removal">
          <p className="text-sm text-red-900">Remove <strong>{deleteTarget.title}</strong> and its cover from Quest Books? Families keep the lessons they already added.</p>
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
    return data.subjects.map((s) => {
      const books = data.books.filter((b) => b.year === year && b.subject === s.id);
      return books.length ? books.map((b) => ({ ...b, year_label: yearLabel })) : [{ placeholder: true, subject: s.id, subjectLabel: s.label, yearLabel, id: `${s.id}-soon`, theme: "meadow" }];
    }).flat();
  }, [data, year, yearLabel]);
  const countByYear = useMemo(() => {
    const m = new Map();
    for (const b of data?.books || []) m.set(b.year, (m.get(b.year) || 0) + 1);
    return m;
  }, [data]);

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-7" data-testid="quest-books">
      <header className="rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-100 border border-amber-200 p-6 sm:p-9 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold tracking-widest uppercase text-emerald-800">Side-Quest · Year-by-year subject books</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 text-slate-900">Quest Books</h1>
          <p className="mt-3 text-stone-700">Beautiful subject books for Maths, English, Science, History and Geography, written for each year level and aligned to the Australian Curriculum v9. Add a book and its lessons go straight into My lessons, ready to assign to your child.</p>
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
            <p>{data.preview ? "Look inside any book and try its free sample lesson with your child. " : "Look inside any book. "}Every Quest Book is included with <Link to="/parent/plan" className="underline font-semibold">Family Membership</Link>{data.can_buy ? ", or you can buy a single book to keep." : "."}</p>
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
          <p className="text-sm text-stone-600">{shelf.some((b) => !b.placeholder) ? "Tap a book to see what's inside." : "The books for this year level are being written. They'll appear here as each one is ready."}</p>
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
                <span className="text-[11px] text-stone-600">{b.lesson_count} lessons{b.owned ? <span className="text-emerald-800 font-semibold"> · yours</span> : b.added_count ? <span className="text-emerald-800 font-semibold"> · {b.added_count} added</span> : null}</span>
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
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
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
      if (d?.owned || d?.member) { setConfirming(false); setParams({}, { replace: true }); toast.success("Payment received. This book is yours!"); return; }
      if (++tries < 15) setTimeout(tick, 2000);
      else { setConfirming(false); toast("Your payment is still being confirmed. Refresh this page in a minute.", { duration: 9000 }); }
    };
    tick();
    return () => { live = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const book = data?.book;
  const added = book ? book.lessons.filter((l) => l.lesson_id).length : 0;
  const archived = book ? book.lessons.filter((l) => l.archived).length : 0;
  const remaining = book ? book.lessons.length - added - archived : 0;
  const units = useMemo(() => {
    const out = [];
    for (const l of book?.lessons || []) {
      const last = out[out.length - 1];
      if (last && last.unit === l.unit) last.lessons.push(l); else out.push({ unit: l.unit, lessons: [l] });
    }
    return out;
  }, [book]);

  const sample = book?.lessons.find((l) => l.sample);
  const full = data?.access === "full";

  const addLessons = async () => {
    setBusy("add");
    try {
      const r = await api.post(`/quest-books/books/${encodeURIComponent(id)}/add`, {}, { timeout: 180000 });
      if (r.data.sample_only) toast.success(r.data.added ? "Free sample lesson added to My lessons" : "The free sample is already in My lessons");
      else toast.success(r.data.added ? `Added ${r.data.added} lesson${r.data.added === 1 ? "" : "s"} to My lessons` : "You already have every lesson from this book");
      await load();
    } catch (e) {
      if (e?.response?.status === 402 && e.response.data?.code === "UPGRADE_REQUIRED") navigate("/parent/plan");
      toast.error(apiErrorMessage(e, "Could not add this book"));
    } finally { setBusy(""); }
  };
  const buy = async () => {
    setBusy("buy");
    try {
      const r = await api.post(`/quest-books/books/${encodeURIComponent(id)}/checkout`, {});
      if (!r.data?.url) throw new Error("Checkout did not open.");
      window.location.assign(r.data.url);
    } catch (e) {
      toast.error(e?.response ? apiErrorMessage(e, "Could not start checkout") : e.message);
      setBusy("");
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-6" data-testid="quest-book-detail">
      <Link to="/parent/quest-books" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-900 hover:underline"><ArrowLeft size={16} /> All Quest Books</Link>
      {!data && !error && <p role="status">Opening the book…</p>}
      {error && <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900" role="alert">{error}</div>}
      {book && <>
        <section className="rounded-3xl bg-gradient-to-br from-[#fbf6ec] to-[#efe2c9] border border-amber-200 p-6 sm:p-9 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <QuestBookCover book={book} size="lg" />
          <div className="flex-1 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">{book.year_label} · {book.subject_label}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{book.title}</h1>
            {book.subtitle && <p className="italic text-stone-700" style={{ fontFamily: "Georgia, serif" }}>{book.subtitle}</p>}
            {book.description && <p className="text-stone-700 whitespace-pre-line">{book.description}</p>}
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/80 border border-amber-200 px-3 py-1.5">{book.lesson_count} lessons</span>
              <span className="rounded-full bg-white/80 border border-amber-200 px-3 py-1.5">{units.length} unit{units.length === 1 ? "" : "s"}</span>
              <span className="rounded-full bg-white/80 border border-amber-200 px-3 py-1.5">Australian Curriculum v9 aligned</span>
            </div>
            {confirming && <p role="status" className="rounded-xl bg-white/80 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-900">Payment received. Unlocking your book…</p>}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              {full ? (
                remaining > 0 ? (
                  <button type="button" onClick={addLessons} disabled={!!busy} data-testid="quest-book-add"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold shadow hover:bg-emerald-800 disabled:opacity-60">
                    <Plus size={18} /> {busy === "add" ? "Adding lessons…" : added ? `Add ${remaining} new lesson${remaining === 1 ? "" : "s"}` : `Add all ${remaining} lessons to My lessons`}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 text-emerald-900 px-4 py-3 font-bold"><Check size={18} /> This book is in My lessons</span>
                )
              ) : (
                <>
                  {data.can_buy && (
                    <button type="button" onClick={buy} disabled={!!busy || confirming} data-testid="quest-book-buy"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold shadow hover:bg-emerald-800 disabled:opacity-60">
                      <ShoppingBag size={18} /> {busy === "buy" ? "Opening checkout…" : `Buy this book · ${money(book.price_cents)}`}
                    </button>
                  )}
                  <Link to="/parent/plan" className={data.can_buy ? "text-sm font-semibold text-emerald-900 underline" : "inline-flex items-center gap-2 rounded-xl bg-emerald-900 text-white px-5 py-3 font-bold"}>
                    {data.can_buy ? "Or get every Quest Book with Family Membership" : <><Lock size={16} /> Unlock with Family Membership</>}
                  </Link>
                </>
              )}
              {full && added > 0 && <Link to="/parent/lessons" className="text-sm font-semibold text-emerald-900 underline">Assign from My lessons →</Link>}
            </div>
            {data.owned && <p className="text-xs text-stone-600">You bought this book. Its lessons stay yours to assign, even without a membership.</p>}
            {data.access === "sample" && sample && (
              <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-white/80 p-4 space-y-3" data-testid="quest-book-sample">
                <p className="font-bold text-slate-900 inline-flex items-center gap-2"><Gift size={17} className="text-amber-600" /> Free sample lesson: {sample.title}</p>
                {sample.lesson_id ? (
                  <>
                    <p className="text-sm text-stone-700">It's in My lessons. Assign it to your child, or print it as a write-on workbook (choose “Save as PDF” in the print window to download it).</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Link to={`/parent/lessons/${sample.lesson_id}`} className="inline-flex items-center gap-1 rounded-xl border-2 border-emerald-800 px-4 py-2.5 text-sm font-bold text-emerald-900"><BookOpen size={16} /> Open &amp; assign</Link>
                      <LessonPrintActions lessonId={sample.lesson_id} />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-stone-700">Try one full lesson from this book for free: add it to My lessons, assign it to your child, or print it as a write-on PDF.</p>
                    <button type="button" onClick={addLessons} disabled={!!busy} data-testid="quest-book-add-sample"
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-amber-950 px-4 py-2.5 text-sm font-bold hover:bg-amber-400 disabled:opacity-60">
                      <Plus size={16} /> {busy === "add" ? "Adding…" : "Add the free sample lesson"}
                    </button>
                  </>
                )}
              </div>
            )}
            {archived > 0 && <p className="text-xs text-stone-600">{archived} lesson{archived === 1 ? " is" : "s are"} archived in My lessons. Restore {archived === 1 ? "it" : "them"} from the archive to use {archived === 1 ? "it" : "them"} again.</p>}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-2xl font-bold text-slate-900">Inside this book</h2>
          {units.map((u, ui) => (
            <div key={ui} className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
              {u.unit && <div className="bg-stone-50 border-b border-stone-200 px-5 py-3 font-bold text-slate-800">{u.unit}</div>}
              <ol className="divide-y divide-stone-100">
                {u.lessons.map((l) => (
                  <li key={l.key} className="px-5 py-4 flex gap-4 items-start">
                    <span className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-amber-100 text-amber-900 font-bold text-sm grid place-items-center">{l.position}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">{l.title}{l.sample && !full && <span className="ml-2 align-middle rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Free sample</span>}</p>
                      {l.objectives?.length > 0 && <p className="text-sm text-stone-600 mt-0.5">{l.objectives.join(" · ")}</p>}
                      {l.duration_minutes && <p className="text-xs text-stone-500 mt-1 inline-flex items-center gap-1"><Clock size={12} /> about {l.duration_minutes} min</p>}
                    </div>
                    {l.lesson_id ? (
                      <Link to={`/parent/lessons/${l.lesson_id}`} title="Open, assign or print this lesson" className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-900 px-3 py-1.5 text-xs font-bold hover:bg-emerald-100"><Check size={14} /> Open</Link>
                    ) : l.archived ? (
                      <span className="shrink-0 text-xs text-stone-500">Archived</span>
                    ) : !full && !l.sample ? <Lock size={15} className="shrink-0 mt-1 text-stone-400" aria-label="Locked" /> : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      </>}
    </div>
  );
}

export default function QuestBooks() {
  const { bookId } = useParams();
  return bookId ? <BookView id={bookId} /> : <ShelfView />;
}
