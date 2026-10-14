import React, { useMemo, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

/**
 * Opt-in weekly timetable, completely independent from Learning Plans.
 * Nothing is persisted until the parent reviews the proposed entries.
 */
const DEFAULT_SUBJECTS = "English, Mathematics, Science, History";
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const localISO = date => [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
const nextMonday = () => { const d = new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()+((8-d.getDay())%7 || 7)); return localISO(d); };
const dateInWeek = (start, weekday) => { const d = new Date(start+"T12:00:00"); d.setDate(d.getDate()+((weekday-d.getDay()+7)%7)); return localISO(d); };

export default function TimetableGenerator({ students, events, onClose, onDone }) {
  const [selected, setSelected] = useState(students.map(s => s.id));
  const [subjects, setSubjects] = useState(Object.fromEntries(students.map(s => [s.id, (s.electives?.length ? s.electives.map(x=>x.name).filter(Boolean).join(", ") : DEFAULT_SUBJECTS)])));
  const [days, setDays] = useState([1,2,3,4,5]);
  const [weekStart, setWeekStart] = useState(nextMonday());
  const [minutes, setMinutes] = useState(45);
  const [startTime, setStartTime] = useState("09:00");
  const [sessions, setSessions] = useState(1);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const existing = useMemo(() => new Set(events.map(e => [e.date,e.student_id,e.title].join("|"))), [events]);
  const makeDraft = () => {
    if (!selected.length || !days.length) return toast.error("Choose at least one child and one day.");
    const result = [];
    for (const sid of selected) {
      const subjectList = (subjects[sid] || "").split(",").map(x=>x.trim()).filter(Boolean).slice(0,20);
      if (!subjectList.length) return toast.error("Enter at least one subject for each selected child.");
      const dayOrder = [...days].sort((a,b)=>a-b);
      subjectList.forEach((title,index) => {
        for(let repeat=0;repeat<sessions;repeat++) {
          const date=dateInWeek(weekStart, dayOrder[(index*sessions+repeat)%dayOrder.length]);
          const offset = result.filter(x=>x.student_id===sid && x.date===date).length * Number(minutes);
          const total = Number(startTime.split(":")[0])*60 + Number(startTime.split(":")[1]) + offset;
          if (total + Number(minutes) > 24*60) continue;
          const slot = String(Math.floor(total/60)).padStart(2,"0")+":"+String(total%60).padStart(2,"0");
          if (!existing.has([date,sid,title].join("|")) && !events.some(e=>e.date===date && e.student_id===sid && e.start_time===slot)) result.push({key: sid+"-"+index+"-"+repeat,student_id:sid,title,date,start_time:slot,duration_minutes:Number(minutes),event_type:"lesson",notes:"Generated timetable; editable in the family calendar."});
        }
      });
    }
    setDraft(result);
    if (!result.length) toast.message("All proposed entries already exist in the calendar.");
  };
  const save = async () => {
    if (!draft?.length || saving) return;
    setSaving(true);
    let count=0;
    try {
      for (const item of draft) {
        const {key,...event} = item;
        await api.post("/calendar", event);
        count++;
      }
      toast.success("Added "+count+" timetable sessions to the family calendar.");
      onDone(); onClose();
    } catch (err) {
      toast.error("Saved "+count+" sessions. The remaining entries were not saved. "+apiErrorMessage(err));
      onDone();
      setDraft(null);
    } finally {setSaving(false);}
  };
  return <div className="fixed inset-0 z-50 bg-slate-900/60 p-4 overflow-y-auto flex items-start justify-center" onClick={onClose}>
    <div className="mt-6 mb-6 max-w-3xl w-full bg-white rounded-2xl p-6 space-y-5 shadow-xl" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Automatic timetable generator">
      <div className="flex justify-between items-start gap-4">
        <div><h2 className="text-2xl font-bold">Automatic timetable generator</h2><p className="text-sm text-slate-600 mt-1">No learning plan needed. Choose subjects and days, preview the week, then add only what you approve.</p></div>
        <button type="button" className="text-xl" onClick={onClose} aria-label="Close timetable generator">×</button>
      </div>
      <div className="space-y-3">
        {students.map(s => <div key={s.id} className="border rounded-xl p-3 flex flex-col gap-2">
          <label className="font-semibold flex items-center gap-2"><input type="checkbox" checked={selected.includes(s.id)} onChange={e=>{setSelected(a=>e.target.checked?[...a,s.id]:a.filter(x=>x!==s.id));setDraft(null);}}/>{s.name}</label>
          {selected.includes(s.id) && <label className="text-sm">Subjects (comma-separated)<input className="w-full border rounded-md p-2 mt-1" value={subjects[s.id]||""} onChange={e=>{setSubjects(a=>({...a,[s.id]:e.target.value}));setDraft(null);}}/></label>}
        </div>)}
      </div>
      <div><p className="text-sm font-semibold mb-2">Learning days</p><div className="flex flex-wrap gap-3">{[0,1,2,3,4,5,6].map(d=><label className="flex gap-1 items-center text-sm" key={d}><input type="checkbox" checked={days.includes(d)} onChange={e=>{setDays(v=>e.target.checked?[...v,d]:v.filter(x=>x!==d));setDraft(null);}}/>{DAY_NAMES[d]}</label>)}</div></div>
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="text-sm">Week commencing<input type="date" className="block w-full border rounded p-2 mt-1" value={weekStart} onChange={e=>{setWeekStart(e.target.value);setDraft(null);}}/></label>
        <label className="text-sm">First lesson starts<input type="time" className="block w-full border rounded p-2 mt-1" value={startTime} onChange={e=>{setStartTime(e.target.value);setDraft(null);}}/></label>
        <label className="text-sm">Minutes per session<select className="block w-full border rounded p-2 mt-1" value={minutes} onChange={e=>{setMinutes(Number(e.target.value));setDraft(null);}}>{[15,30,45,60,90].map(m=><option key={m} value={m}>{m} minutes</option>)}</select></label>
        <label className="text-sm">Sessions per subject<select className="block w-full border rounded p-2 mt-1" value={sessions} onChange={e=>{setSessions(Number(e.target.value));setDraft(null);}}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} each week</option>)}</select></label>
      </div>
      <button type="button" onClick={makeDraft} className="rounded-full bg-emerald-800 text-white px-5 py-2 font-semibold">Generate preview</button>
      {draft && <div className="space-y-3">
        <p className="font-semibold">{draft.length} new sessions proposed (existing matching entries are skipped)</p>
        <div className="max-h-64 overflow-auto border rounded-lg divide-y">{draft.map((d,i)=><div className="p-2 text-sm flex flex-wrap items-center gap-2" key={d.key}><span className="w-32">{students.find(s=>s.id===d.student_id)?.name}</span><input aria-label="Session title" className="flex-1 min-w-24 border rounded p-1" value={d.title} onChange={e=>setDraft(old=>old.map((x,k)=>k===i?{...x,title:e.target.value}:x))}/><input type="time" aria-label="Session time" value={d.start_time} onChange={e=>setDraft(old=>old.map((x,k)=>k===i?{...x,start_time:e.target.value}:x))}/><input type="date" aria-label="Session date" value={d.date} onChange={e=>setDraft(old=>old.map((x,k)=>k===i?{...x,date:e.target.value}:x))}/><button type="button" onClick={()=>setDraft(old=>old.filter((_,k)=>k!==i))} className="text-rose-700">Remove</button></div>)}</div>
        <p className="text-xs text-slate-500">Calendar entries do not automatically create lessons or assignments. You can attach lessons separately. Saving adds new events; it never deletes previous work.</p>
        <button type="button" disabled={saving||!draft.length} onClick={save} className="rounded-full bg-emerald-800 text-white px-5 py-2 font-semibold disabled:opacity-50">{saving?"Saving…":"Add approved sessions to calendar"}</button>
      </div>}
    </div>
  </div>;
}
