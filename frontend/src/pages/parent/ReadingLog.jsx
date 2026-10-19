import React, { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, X, BookOpen, Trash2, Printer, Check } from "lucide-react";
import { Leaf, Branch } from "../../components/shared/Botanical";

const TYPES = [
  { v: "fiction", l: "Fiction" },
  { v: "nonfiction", l: "Non-fiction" },
  { v: "picture", l: "Picture book" },
  { v: "graphic", l: "Graphic novel" },
  { v: "poetry", l: "Poetry" },
  { v: "reference", l: "Reference" },
];
const MODES = [
  { v: "independent", l: "Independent" },
  { v: "with_adult", l: "With an adult" },
  { v: "read_to", l: "Read to" },
  { v: "audio", l: "Audiobook" },
];
const SOURCES = ["home", "library", "school", "audiobook", "digital"];

export default function ReadingLog() {
  const [searchParams] = useSearchParams();
  const focused = searchParams.get("focus");
  const recommendedBook = searchParams.get("book");
  const recommendedAuthor = searchParams.get("author");
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    student_id: "", title: "", author: "", pages: "", pages_read: "", read_date: today,
    duration_minutes: 20, source: "home", book_type: "fiction", reading_mode: "independent",
    comprehension_notes: "", favourite_part: "", difficulty: "just_right", parent_note: ""
  });

  useEffect(() => {
    if (!recommendedBook) return;
    setForm(f => ({...f, title:recommendedBook.slice(0,120), author:(recommendedAuthor || "").slice(0,80)}));
    setOpen(true);
  }, [recommendedBook, recommendedAuthor]);

  const load = async () => {
    const q = filter ? `?student_id=${filter}` : "";
    const [a, b] = await Promise.all([api.get(`/reading-log${q}`), api.get(`/reading-log/stats${q}`)]);
    setEntries(a.data); setStats(b.data);
  };
  const loadPending = () => api.get("/reading-submissions/pending").then(r => setPending(r.data)).catch(() => setPending([]));
  useEffect(() => {
    api.get("/students").then(r => { setStudents(r.data); if (r.data[0]) setForm(f => ({...f, student_id: r.data[0].id})); });
    loadPending();
  }, []);
  useEffect(() => { load(); }, [filter]);
  useEffect(() => {
    if (!focused) return;
    if (filter) {setFilter("");return;}
    if (!entries.some(e => e.id===focused)) return;
    const raf=requestAnimationFrame(()=>document.getElementById("search-reading-"+focused)?.scrollIntoView({behavior:"smooth",block:"center"}));
    return ()=>cancelAnimationFrame(raf);
  },[focused,filter,entries]);

  const studentName = (id) => students.find(s => s.id === id)?.name || "Child";

  const approve = async (p) => {
    try {
      await api.post(`/reading-submissions/${p.id}/approve`, {});
      toast.success("Approved and added to the log");
      loadPending(); load();
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed"); }
  };
  const sendBack = async (p) => {
    const note = window.prompt("Optional message for your child (e.g. 'Tell me about it first'):", "");
    if (note === null) return;
    try {
      await api.post(`/reading-submissions/${p.id}/reject`, { parent_note: note });
      toast.success("Sent back");
      loadPending();
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed"); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student_id) { toast.error("Choose a student"); return; }
    try {
      await api.post("/reading-log", {
        ...form,
        pages: form.pages ? Number(form.pages) : null,
        pages_read: form.pages_read ? Number(form.pages_read) : null,
        duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      });
      toast.success("Logged");
      setOpen(false);
      setForm(f => ({...f, title:"", author:"", pages:"", pages_read:"", duration_minutes:20, comprehension_notes:"", favourite_part:"", parent_note:""}));
      load();
    } catch (err) { toast.error(apiErrorMessage(err, "Could not save reading log")); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this reading entry?")) return;
    await api.delete(`/reading-log/${id}`); load();
  };

  const printLog = () => {
    const w = window.open("", "_blank");
    if (!w) { toast.error("Please allow pop-ups to print your reading log."); return; }
    const escapePrint = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
    const rows = entries.map((e) => `<tr>
      <td>${escapePrint(e.read_date)}</td>
      <td>${escapePrint(e.student?.name || studentName(e.student_id))}</td>
      <td><strong>${escapePrint(e.title)}</strong>${e.author ? `<br><span class="muted">by ${escapePrint(e.author)}</span>` : ""}${e.verified_by_parent ? '<br><span class="verified">✓ Parent verified</span>' : ""}</td>
      <td>${escapePrint(e.book_type)}</td><td>${escapePrint((e.reading_mode || "").replace(/_/g, " "))}</td>
      <td>${escapePrint(e.duration_minutes)}</td><td>${escapePrint(e.pages_read || e.pages || "")}</td>
      <td class="notes">${escapePrint(e.comprehension_notes)}</td>
    </tr>`).join("");
    const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>Reading Log · Side-Quest</title>
    <style>
      @page { size: A4 landscape; margin: 13mm; }
      * { box-sizing: border-box; }
      body { font: 12px/1.5 Arial, sans-serif; color: #243a2d; background: white; margin: 20px auto; max-width: 1100px; padding: 0 18px; }
      header { border-top: 5px solid #1F3B2D; border-bottom: 2px solid #D4C8A8; padding: 12px 0 14px; margin-bottom: 14px; }
      .kicker { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; font-weight: 800; color: #9A563F; }
      h1 { color: #1F3B2D; font-size: 26px; margin: 3px 0; }
      .subtitle, .muted { color: #54634D; }
      .stats { display: flex; flex-wrap: wrap; gap: 7px; margin: 14px 0; }
      .stat { border: 1px solid #B7C7B0; border-radius: 6px; padding: 6px 10px; min-width: 110px; }
      .stat strong { display: block; color: #1F3B2D; font-size: 17px; }
      table { width: 100%; table-layout: fixed; border-collapse: collapse; }
      th, td { border: 1px solid #B7C7B0; padding: 7px 6px; vertical-align: top; text-align: left; overflow-wrap: anywhere; }
      th { background: #EFF3EA; color: #1F3B2D; font-size: 10px; text-transform: uppercase; letter-spacing: .04em; }
      th:nth-child(1) { width: 10%; } th:nth-child(2) { width: 11%; } th:nth-child(3) { width: 18%; }
      th:nth-child(4) { width: 10%; } th:nth-child(5) { width: 11%; } th:nth-child(6) { width: 6%; }
      th:nth-child(7) { width: 7%; } th:nth-child(8) { width: 27%; }
      thead { display: table-header-group; } tr { break-inside: avoid; }
      .notes { white-space: pre-wrap; } .verified { font-size: 10px; font-weight: bold; }
      footer { border-top: 1px solid #D4C8A8; margin-top: 18px; padding-top: 8px; font-size: 10px; color: #54634D; }
      @media print { body { margin: 0; padding: 0; } th { background: #f3f3f3; } .stat { border-color: #999; } }
    </style></head><body>
    <header><div class="kicker">SIDE-QUEST LEARNING · THE READING HOARD</div>
    <h1>Every page counts 📖</h1><div class="subtitle">Reading log · Family learning portfolio</div></header>
    <div class="stats"><div class="stat"><strong>${entries.length}</strong>Reading entries</div>
    <div class="stat"><strong>${Number(stats?.unique_books || 0)}</strong>Unique books</div>
    <div class="stat"><strong>${Number(stats?.total_minutes || 0)}</strong>Minutes reading</div>
    <div class="stat"><strong>${Number(stats?.total_pages || 0)}</strong>Pages explored</div></div>
    <table><thead><tr><th>Date</th><th>Learner</th><th>Book &amp; author</th><th>Type</th><th>Reading mode</th><th>Min</th><th>Pages</th><th>Comprehension &amp; reflections</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="8">No reading entries for this selection yet.</td></tr>'}</tbody></table>
    <footer>Side-Quest · Learning happens everywhere · Parent-maintained reading record</footer>
    </body></html>`;
    w.document.open(); w.document.write(html); w.document.close();
    w.focus(); w.print();
  };

  return (
    <div className="p-8 lg:p-10 space-y-6 relative" data-testid="reading-log-page">
      <Leaf className="absolute right-6 top-8" size={60} color="#C8893B"/>
      <Branch className="absolute left-0 bottom-0 opacity-20" size={180} color="#4A5D3A"/>

      <header>
        <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Every page counts</div>
        <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Reading Log</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
          A reading record for your family's home education portfolio. Capture every book, chapter, picture book, audiobook or
          graphic novel. Track independent reading, read-aloud time, and comprehension notes — then export a
          clean printable log for your inspection folder.
        </p>
      </header>

      {pending.length > 0 && (
        <section className="paper-card p-6" style={{backgroundColor:"#FFF8E7"}} data-testid="pending-reading">
          <h2 className="font-display text-xl font-bold mb-1" style={{color:"#1F3B2D"}}>Waiting for your approval ({pending.length})</h2>
          <p className="text-xs text-stone-600 mb-3">Your children added these. Only approved books count towards the log and pet XP.</p>
          <div className="space-y-2">
            {pending.map(p => (
              <div key={p.id} className="rounded-xl border bg-white p-3 flex items-center justify-between gap-3 flex-wrap" style={{borderColor:"#E8E2D1"}} data-testid={`pending-${p.id}`}>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{p.title}{p.author ? <span className="text-stone-500 font-normal"> by {p.author}</span> : null}</div>
                  <div className="text-xs text-stone-500">{studentName(p.student_id)} · {p.read_date} · {p.duration_minutes} min{p.pages ? ` · ${p.pages} pages` : ""} · {p.book_type} · {p.reading_mode.replace(/_/g,' ')}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>approve(p)} className="rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid={`approve-${p.id}`}><Check size={12}/> Approve</button>
                  <button onClick={()=>sendBack(p)} className="rounded-full border px-4 py-1.5 text-xs font-bold" style={{borderColor:"#D4C8A8"}} data-testid={`reject-${p.id}`}>Send back</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Entries" value={stats.entries}/>
          <Stat label="Unique books" value={stats.unique_books}/>
          <Stat label="Minutes" value={stats.total_minutes}/>
          <Stat label="Pages" value={stats.total_pages}/>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={()=>setOpen(true)} className="rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="add-reading"><Plus size={14}/> Log reading</button>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-full border px-4 py-2 text-sm bg-white font-semibold" style={{borderColor:"#D4C8A8"}} data-testid="filter-student">
          <option value="">All children</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button onClick={printLog} className="rounded-full border px-4 py-2 text-sm font-bold flex items-center gap-2" style={{borderColor:"#D4C8A8"}} data-testid="print-log"><Printer size={14}/> Print log</button>
      </div>

      <div className="paper-card overflow-hidden">
        <table className="w-full text-sm" data-testid="reading-table">
          <thead className="text-left text-xs uppercase tracking-wider font-bold text-stone-500" style={{backgroundColor:"#F5EFE0"}}>
            <tr><th className="p-3">Date</th><th className="p-3">Child</th><th className="p-3">Book</th><th className="p-3">Type</th><th className="p-3">Mode</th><th className="p-3">Min</th><th className="p-3">Pages</th><th className="p-3">Notes</th><th></th></tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr id={"search-reading-"+e.id} key={e.id} className={"border-t group "+(focused===e.id?"bg-emerald-50 ring-2 ring-emerald-400":"")} style={{borderColor:"#E8E2D1"}} data-testid={`read-${e.id}`}>
                <td className="p-3 font-mono text-xs">{e.read_date}</td>
                <td className="p-3 font-semibold">{e.student?.name}</td>
                <td className="p-3"><div className="font-semibold">{e.title}{e.verified_by_parent && <span title="Verified by parent" className="ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">verified</span>}</div>{e.author && <div className="text-xs text-stone-500">by {e.author}</div>}</td>
                <td className="p-3 text-xs">{e.book_type}</td>
                <td className="p-3 text-xs">{e.reading_mode.replace(/_/g,' ')}</td>
                <td className="p-3 text-xs">{e.duration_minutes || "—"}</td>
                <td className="p-3 text-xs">{e.pages_read || e.pages || "—"}</td>
                <td className="p-3 text-xs text-stone-600 max-w-xs truncate">{e.comprehension_notes || e.favourite_part || "—"}</td>
                <td className="p-3"><button onClick={()=>del(e.id)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-rose-600"><Trash2 size={13}/></button></td>
              </tr>
            ))}
            {entries.length === 0 && <tr><td colSpan={9} className="p-10 text-center">
              <BookOpen className="mx-auto mb-3" size={28} style={{color:"#4A5D3A"}}/>
              <div className="font-display text-lg" style={{color:"#1F3B2D"}}>No reading logged yet</div>
              <p className="text-sm text-stone-500 mt-2">Log every book your children read — fiction, non-fiction, picture books, audiobooks all count.</p>
            </td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=>setOpen(false)}>
          <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="w-full max-w-xl paper-card p-7 my-8" data-testid="reading-form">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-2xl font-bold" style={{color:"#1F3B2D"}}>Log a reading entry</h2><button type="button" onClick={()=>setOpen(false)}><X size={18}/></button></div>
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <F label="Student"><select required value={form.student_id} onChange={e=>setForm({...form, student_id: e.target.value})} className="input" data-testid="r-student"><option value="">Choose…</option>{students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></F>
                <F label="Date"><input required type="date" value={form.read_date} onChange={e=>setForm({...form, read_date: e.target.value})} className="input" data-testid="r-date"/></F>
              </div>
              <F label="Book title"><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="input" data-testid="r-title"/></F>
              <F label="Author"><input value={form.author} onChange={e=>setForm({...form, author: e.target.value})} className="input" data-testid="r-author"/></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Book type"><select value={form.book_type} onChange={e=>setForm({...form, book_type: e.target.value})} className="input" data-testid="r-type">{TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></F>
                <F label="Reading mode"><select value={form.reading_mode} onChange={e=>setForm({...form, reading_mode: e.target.value})} className="input" data-testid="r-mode">{MODES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></F>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <F label="Minutes"><input type="number" value={form.duration_minutes} onChange={e=>setForm({...form, duration_minutes: e.target.value})} className="input" data-testid="r-min"/></F>
                <F label="Total pages"><input type="number" value={form.pages} onChange={e=>setForm({...form, pages: e.target.value})} className="input" data-testid="r-pages"/></F>
                <F label="Pages read today"><input type="number" value={form.pages_read} onChange={e=>setForm({...form, pages_read: e.target.value})} className="input" data-testid="r-pr"/></F>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F label="Source"><select value={form.source} onChange={e=>setForm({...form, source: e.target.value})} className="input" data-testid="r-source">{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></F>
                <F label="Difficulty"><select value={form.difficulty} onChange={e=>setForm({...form, difficulty: e.target.value})} className="input" data-testid="r-diff"><option value="easy">Easy</option><option value="just_right">Just right</option><option value="challenging">Challenging</option></select></F>
              </div>
              <F label="Comprehension / discussion notes"><textarea rows={2} value={form.comprehension_notes} onChange={e=>setForm({...form, comprehension_notes: e.target.value})} placeholder="What did they discuss, retell, predict, infer?" className="input" data-testid="r-comp"/></F>
              <F label="Favourite part (optional)"><input value={form.favourite_part} onChange={e=>setForm({...form, favourite_part: e.target.value})} className="input" data-testid="r-fav"/></F>
              <F label="Parent note (optional)"><input value={form.parent_note} onChange={e=>setForm({...form, parent_note: e.target.value})} className="input" data-testid="r-note"/></F>
            </div>
            <button className="mt-5 w-full rounded-full py-3 text-sm font-bold" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="submit-reading">Log entry</button>
          </form>
        </div>
      )}
      <style>{`.input { width:100%; border-radius:0.75rem; border:1px solid #D4C8A8; padding:0.6rem 0.85rem; font-size:0.875rem; background: #fff; } .input:focus { outline:none; border-color:#4A5D3A; }`}</style>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="paper-card p-5">
    <div className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</div>
    <div className="font-display text-4xl font-bold mt-1" style={{color:"#1F3B2D"}}>{value}</div>
  </div>
);
const F = ({ label, children }) => (<div><label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label><div className="mt-1">{children}</div></div>);
