import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Plus, X, BookOpen, Trash2, Printer } from "lucide-react";
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
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0,10);
  const [form, setForm] = useState({
    student_id: "", title: "", author: "", pages: "", pages_read: "", read_date: today,
    duration_minutes: 20, source: "home", book_type: "fiction", reading_mode: "independent",
    comprehension_notes: "", favourite_part: "", difficulty: "just_right", parent_note: ""
  });

  const load = async () => {
    const q = filter ? `?student_id=${filter}` : "";
    const [a, b] = await Promise.all([api.get(`/reading-log${q}`), api.get(`/reading-log/stats${q}`)]);
    setEntries(a.data); setStats(b.data);
  };
  useEffect(() => {
    api.get("/students").then(r => { setStudents(r.data); if (r.data[0]) setForm(f => ({...f, student_id: r.data[0].id})); });
  }, []);
  useEffect(() => { load(); }, [filter]);

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
    } catch { toast.error("Failed"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this reading entry?")) return;
    await api.delete(`/reading-log/${id}`); load();
  };

  const printLog = () => {
    const w = window.open("", "_blank");
    const header = `<html><head><title>Reading Log</title><style>body{font-family:Georgia,serif;max-width:900px;margin:40px auto;padding:0 20px}h1{font-size:24px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ccc;padding:8px;text-align:left;font-size:12px;vertical-align:top}th{background:#f5efe0}</style></head><body>`;
    const rows = entries.map(e => `<tr><td>${e.read_date}</td><td>${e.student?.name||""}</td><td><strong>${e.title}</strong>${e.author ? ` — ${e.author}` : ""}</td><td>${e.book_type}</td><td>${e.reading_mode.replace(/_/g,' ')}</td><td>${e.duration_minutes||""}</td><td>${e.pages_read||e.pages||""}</td><td>${e.comprehension_notes||""}</td></tr>`).join("");
    w.document.write(`${header}<h1>Reading Log</h1><p>Entries: ${entries.length} · Unique books: ${stats?.unique_books||0} · Total minutes: ${stats?.total_minutes||0} · Total pages: ${stats?.total_pages||0}</p><table><thead><tr><th>Date</th><th>Student</th><th>Book</th><th>Type</th><th>Mode</th><th>Min</th><th>Pages</th><th>Comprehension notes</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.print();
  };

  return (
    <div className="p-8 lg:p-10 space-y-6 relative" data-testid="reading-log-page">
      <Leaf className="absolute right-6 top-8" size={60} color="#C8893B"/>
      <Branch className="absolute left-0 bottom-0 opacity-20" size={180} color="#4A5D3A"/>

      <header>
        <div className="font-script text-2xl" style={{color:"#C77B5B"}}>Every page counts</div>
        <h1 className="font-display text-4xl font-bold" style={{color:"#1F3B2D"}}>Reading Log</h1>
        <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
          A proper reading record for NESA. Capture every book, chapter, picture book, audiobook or
          graphic novel. Track independent reading, read-aloud time, and comprehension notes — then export a
          clean printable log for your inspection folder.
        </p>
      </header>

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
              <tr key={e.id} className="border-t group" style={{borderColor:"#E8E2D1"}} data-testid={`read-${e.id}`}>
                <td className="p-3 font-mono text-xs">{e.read_date}</td>
                <td className="p-3 font-semibold">{e.student?.name}</td>
                <td className="p-3"><div className="font-semibold">{e.title}</div>{e.author && <div className="text-xs text-stone-500">by {e.author}</div>}</td>
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
