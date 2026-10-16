import React, { useEffect, useMemo, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

/**
 * Weekly timetable (Family Membership). One week at a time: each block becomes a timetable SLOT for a subject, and
 * lessons the parent assigns fill the child's next free slot of that subject (worker/src/timetable.ts).
 * Family calendar planner. Curriculum areas come from the chosen jurisdiction;
 * durations and frequency are suggested, NOT represented as legally mandated hours.
 * Nothing is written before the parent reviews and approves each calendar entry.
 */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const localISO = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
const nextMonday = () => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return localISO(d); };
const dateInWeek = (start, weekday) => { const d = new Date(start + "T12:00:00"); d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7)); return localISO(d); };
const secondary = s => ["S4", "S5", "S6"].includes(s.stage) || Number(s.year_level) >= 7;
const nameOf = c => typeof c === "string" ? c : (c?.name || c?.title || "");
const normalized = a => String(a || "").toLowerCase();
function weightFor(subject) {
  const a = normalized(subject);
  if (/english|literacy|language arts/.test(a)) return 5;
  if (/math|numeracy/.test(a)) return 5;
  if (/science/.test(a)) return 3;
  if (/history|geography|humanities|social|hsie/.test(a)) return 2.5;
  if (/technology|comput|digital/.test(a)) return 2.5;
  if (/health|physical|pdhpe/.test(a)) return 2;
  if (/arts|creative|music/.test(a)) return 2;
  if (/language|latin/.test(a)) return 2;
  return 2;
}
function curriculumAreas(student, jurisdiction) {
  const code = jurisdiction?.jurisdiction || "";
  const stateAreas = Array.isArray(jurisdiction?.areas) ? jurisdiction.areas.map(nameOf).filter(Boolean) : [];
  const electives = (student.electives || []).map(nameOf).filter(Boolean);
  const isHigh = secondary(student);
  if (code === "NSW" && isHigh) {
    // Preserve the individual child's actual high-school courses; do not replace
    // History, Computer Technology or Latin with primary-school subjects.
    return [...new Set(["English", "Mathematics", "Science", "History", ...electives])];
  }
  const defaults = code === "NSW"
    ? ["English", "Mathematics", "Science and Technology", "HSIE", "PDHPE", "Creative Arts"]
    : ["English", "Mathematics", "Science", "Humanities and Social Sciences", "Health and Physical Education", "The Arts", "Technologies", "Languages"];
  return [...new Set(stateAreas.length ? stateAreas : defaults)];
}
function allocate(student, areas, days, startTime, weekStart, existing, dailyOverride) {
  // Teaching-time guidance, not an assertion about any jurisdiction's minimum.
  const defaultDaily = secondary(student) ? 270 : ["ES1", "S1"].includes(student.stage) ? 150 : 210;
  const daily = dailyOverride || defaultDaily;
  const minBlock = secondary(student) ? 35 : 25;
  const maxBlock = secondary(student) ? 65 : 50;
  const totalMinutes = daily * days.length;
  const weights = areas.map(weightFor);
  const sum = weights.reduce((a, b) => a + b, 0);
  const allocations = areas.map((title, i) => ({
    title, minutes: totalMinutes * weights[i] / sum
  }));
  // Arrange a sensible number of age-appropriate blocks, giving high-priority
  // literacy/numeracy more sessions across the week.
  const slots = [];
  for (const area of allocations) {
    const count = Math.max(1, Math.round(area.minutes / ((minBlock + maxBlock) / 2)));
    for (let j = 0; j < count; j++) slots.push({ title: area.title, minutes: Math.min(maxBlock, Math.max(minBlock, Math.round(area.minutes / count / 5) * 5)) });
  }
  const dayOrder = [...days].sort((a, b) => a - b);
  const byDay = Object.fromEntries(dayOrder.map(d => [d, []]));
  // Distribute lessons by both subject recurrence and available daily capacity.
  // Prefer different subjects within a day; large subjects recur across the week.
  const minutesOn = day => byDay[day].reduce((n, x) => n + x.minutes, 0);
  const heavy = subject => /english|literacy|mathematics|maths|numeracy|science/i.test(subject);
  slots.sort((a, b) => weightFor(b.title) - weightFor(a.title) || b.minutes - a.minutes);
  for (const slot of slots) {
    const candidates = dayOrder.map(day => {
      const todays = byDay[day];
      const date = dateInWeek(weekStart, day);
      // Include existing timed lessons and commitments in the day's capacity.
      // A scheduled event is not free instructional time.
      const committed = existing.filter(e => e.student_id === student.id && e.date === date)
        .reduce((minutes, e) => minutes + Math.max(0, Number(e.duration_minutes) || 0), 0);
      const used = minutesOn(day) + committed;
      const same = todays.filter(x => x.title === slot.title).length;
      const alreadyHeavy = todays.filter(x => heavy(x.title)).length;
      const fits = used + slot.minutes <= daily;
      // A second subject session on a day is strongly discouraged. Give days
      // with less total instruction and fewer intensive blocks priority.
      const score = (fits ? 0 : 100000) + same * 5000 +
        (heavy(slot.title) ? alreadyHeavy * 150 : 0) +
        (used / daily) * 1000 + todays.length * 40;
      return { day, score };
    }).sort((a, b) => a.score - b.score || a.day - b.day);
    const best = candidates[0];
    if (best && best.score < 100000) byDay[best.day].push(slot);
    // Do not silently cram excess lessons into a full day.
  }
  // Alternate intensive and lighter blocks where possible.
  for (const day of dayOrder) {
    const planned = byDay[day];
    const intensive = planned.filter(x => heavy(x.title));
    const lighter = planned.filter(x => !heavy(x.title));
    const balanced = [];
    while (intensive.length || lighter.length) {
      if (intensive.length) balanced.push(intensive.shift());
      if (lighter.length) balanced.push(lighter.shift());
    }
    byDay[day] = balanced;
  }
  const [h, m] = startTime.split(":").map(Number);
  const result = [];
  for (const day of dayOrder) {
    const date = dateInWeek(weekStart, day);
    let cursor = (h * 60 + m);
    for (const [i, slot] of byDay[day].entries()) {
      // Short break after every two learning blocks.
      if (i && i % 2 === 0) cursor += 15;
      if (cursor + slot.minutes > 1440) break;
      // Find the next genuinely free interval, not merely a different start time.
      // Respect existing events and appointments, plus blocks proposed earlier in this preview.
      const occupied = [...existing, ...result]
        .filter(e => e.student_id === student.id && e.date === date && e.start_time)
        .map(e => ({ from: Number(e.start_time.slice(0, 2)) * 60 + Number(e.start_time.slice(3)),
          length: Math.max(1, Number(e.duration_minutes) || 1) }))
        .sort((a, b) => a.from - b.from);
      for (const block of occupied) {
        if (cursor < block.from + block.length && block.from < cursor + slot.minutes) cursor = block.from + block.length;
      }
      if (cursor + slot.minutes > 1440) continue;
      const time = String(Math.floor(cursor / 60)).padStart(2, "0") + ":" + String(cursor % 60).padStart(2, "0");
      result.push({ key: student.id + "-" + day + "-" + i, student_id: student.id, title: slot.title,
        date, start_time: time, duration_minutes: slot.minutes, event_type: "lesson",
        notes: "Suggested by Side-Quest using family curriculum areas, year level and learning days. Parent reviewed." });
      cursor += slot.minutes;
    }
  }
  return result;
}

export default function TimetableGenerator({ students, events, onClose, onDone }) {
  const [selected, setSelected] = useState(students.map(s => s.id));
  const [days, setDays] = useState([1, 2, 3, 4, 5]);
  const [weekStart, setWeekStart] = useState(nextMonday());
  const [startTime, setStartTime] = useState("09:00");
  const [dailyMinutes, setDailyMinutes] = useState(180);
  const [jurisdiction, setJurisdiction] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(null); // Family Membership feature
  useEffect(() => {
    api.get("/timetable/status").then(r => setAllowed(!!r.data?.allowed)).catch(() => setAllowed(false));
    api.get("/family/jurisdiction")
      .then(r => setJurisdiction(r.data))
      .catch(() => toast.error("Could not load your family's state or territory."))
      .finally(() => setLoading(false));
  }, []);
  const plan = useMemo(() => selected.map(id => {
    const child = students.find(s => s.id === id);
    return child ? { child, areas: curriculumAreas(child, jurisdiction) } : null;
  }).filter(Boolean), [students, selected, jurisdiction]);

  const makeDraft = () => {
    if (!jurisdiction?.jurisdiction) return toast.error("Set your family's state or territory before generating a timetable.");
    if (!selected.length || !days.length) return toast.error("Select at least one child and one learning day.");
    if (!weekStart || !/^\d{2}:\d{2}$/.test(startTime)) return toast.error("Choose a valid week and start time.");
    const proposed = plan.flatMap(({ child, areas }) => allocate(child, areas, days, startTime, weekStart, events, dailyMinutes));
    setDraft(proposed);
    if (!proposed.length) toast.message("No new entries proposed; matching dates or times are already scheduled.");
  };
  const save = async () => {
    if (!draft?.length || saving) return;
    setSaving(true);
    try {
      const blocks = draft.map(({ student_id, title, date, start_time, duration_minutes }) => ({ student_id, title, date, start_time, duration_minutes: Number(duration_minutes) }));
      const { data } = await api.post("/timetable/week", { week_start: weekStart, blocks });
      toast.success(`Timetable saved: ${data.created} slot${data.created === 1 ? "" : "s"}${data.skipped ? ` (${data.skipped} already there)` : ""}. Lessons you assign now fill these slots.`);
      onDone(); onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "The timetable could not be saved"));
    } finally { setSaving(false); }
  };

  // Copy the week before this one (same subjects, days and times), for the selected children.
  const repeatLastWeek = async () => {
    const prevStart = (() => { const d = new Date(weekStart + "T12:00:00"); d.setDate(d.getDate() - 7); return localISO(d); })();
    const prevEnd = (() => { const d = new Date(weekStart + "T12:00:00"); d.setDate(d.getDate() - 1); return localISO(d); })();
    try {
      const copies = [];
      for (const sid of selected) {
        const { data } = await api.get("/timetable/slots", { params: { student_id: sid, from: prevStart, to: prevEnd } });
        for (const s of data || []) {
          const d = new Date(s.date + "T12:00:00"); d.setDate(d.getDate() + 7);
          copies.push({ key: s.id, student_id: sid, title: s.title, date: localISO(d), start_time: s.start_time || startTime, duration_minutes: s.duration_minutes || 45 });
        }
      }
      setDraft(copies);
      if (!copies.length) toast.message("There's no timetable in the week before this one to copy. Generate one instead.");
    } catch (err) { toast.error(apiErrorMessage(err, "Could not read last week's timetable")); }
  };
  return <div className="fixed inset-0 z-50 bg-slate-900/60 p-4 overflow-y-auto flex items-start justify-center" onClick={onClose}>
    <div className="mt-6 mb-6 max-w-3xl w-full bg-white rounded-2xl p-6 space-y-5 shadow-xl" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Automatic timetable generator">
      <div className="flex justify-between items-start gap-4"><div>
        <h2 className="text-2xl font-bold">Weekly timetable</h2>
        <p className="text-sm text-slate-600 mt-1">Plan one week at a time. Each block is a slot for a subject; when you assign a lesson it fills your child's next free slot of that subject.</p>
        <p className="text-xs text-slate-500 mt-2">These are planning suggestions, not legally required subject-hour allocations. Review and edit before saving.</p>
      </div><button type="button" onClick={onClose} aria-label="Close" className="text-xl">×</button></div>
      {allowed === false && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" data-testid="timetable-upsell">
          <p className="font-semibold">Timetables are part of the Family Membership.</p>
          <p className="mt-1">Members plan each week in a few clicks, and assigned lessons drop straight into the right slot. You can still assign lessons and choose a day yourself.</p>
          <a href="/parent/plan" className="mt-2 inline-block font-semibold underline">See the Family Membership</a>
        </div>
      )}
      {allowed !== false && <>
      <p className="text-sm">Curriculum: <strong>{jurisdiction?.name || jurisdiction?.jurisdiction || (loading ? "Loading…" : "Not selected")}</strong></p>
      <div className="space-y-2">{students.map(s=><label key={s.id} className="flex gap-3 items-center rounded-lg border p-3">
        <input type="checkbox" checked={selected.includes(s.id)} onChange={e=>{setSelected(v=>e.target.checked?[...v,s.id]:v.filter(id=>id!==s.id));setDraft(null);}} />
        <span className="font-semibold">{s.name}</span><span className="text-xs text-slate-600">{s.year_level ? "Year " + s.year_level : s.stage}</span>
      </label>)}</div>
      <div><p className="text-sm font-semibold mb-2">Which days will you teach?</p><div className="flex flex-wrap gap-3">{DAYS.map((name,d)=><label key={d} className="flex gap-1 items-center text-sm"><input type="checkbox" checked={days.includes(d)} onChange={e=>{setDays(v=>e.target.checked?[...v,d]:v.filter(x=>x!==d));setDraft(null);}} />{name}</label>)}</div></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Week starting<input type="date" data-testid="tt-week" className="block w-full border rounded p-2 mt-1" value={weekStart} onChange={e=>{setWeekStart(e.target.value);setDraft(null);}} /></label>
        <label className="text-sm">Learning day starts<input type="time" className="block w-full border rounded p-2 mt-1" value={startTime} onChange={e=>{setStartTime(e.target.value);setDraft(null);}} /></label>
      </div>
      <label className="block text-sm font-semibold">Target lesson time per learning day
        <select className="block w-full border rounded p-2 mt-1" value={dailyMinutes} onChange={e=>{setDailyMinutes(Number(e.target.value));setDraft(null);}} data-testid="tt-daily-load">
          <option value={90}>Light day · 1½ hours</option>
          <option value={120}>Gentle day · 2 hours</option>
          <option value={180}>Balanced day · 3 hours</option>
          <option value={240}>Full day · 4 hours</option>
          <option value={300}>Extended day · 5 hours</option>
        </select>
        <span className="block text-xs font-normal text-slate-500 mt-1">Suggested lesson time only; adjust to suit your child. Breaks are additional.</span>
      </label>
      {plan.length>0 && <p className="text-xs text-slate-500">Curriculum areas are selected automatically: {plan.map(x=>x.child.name + " (" + x.areas.join(", ") + ")").join("; ")}.</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={loading||!jurisdiction?.jurisdiction||allowed===null} onClick={makeDraft} className="rounded-full bg-emerald-800 text-white px-5 py-2 font-semibold disabled:opacity-50" data-testid="tt-generate">Generate this week</button>
        <button type="button" disabled={allowed===null||!selected.length} onClick={repeatLastWeek} className="rounded-full border border-emerald-800 text-emerald-900 px-5 py-2 font-semibold disabled:opacity-50" data-testid="tt-repeat">Repeat last week</button>
      </div>
      {draft && <div className="space-y-3">
        <p className="font-semibold" data-testid="tt-count">{draft.length} timetable slots for the week of {weekStart} (times already taken are skipped)</p>
        <div className="max-h-64 overflow-auto border rounded-lg divide-y">{draft.map((d,i)=><div className="p-2 text-sm flex flex-wrap items-center gap-2" key={d.key}>
          <span className="w-32">{students.find(s=>s.id===d.student_id)?.name}</span>
          <input aria-label="Subject" className="flex-1 min-w-24 border rounded p-1" value={d.title} onChange={e=>setDraft(old=>old.map((x,k)=>k===i?{...x,title:e.target.value}:x))} />
          <input type="number" min="10" max="180" aria-label="Minutes" className="w-16 border rounded p-1" value={d.duration_minutes} onChange={e=>setDraft(old=>old.map((x,k)=>k===i?{...x,duration_minutes:Number(e.target.value)}:x))} />
          <input type="time" aria-label="Time" value={d.start_time} onChange={e=>setDraft(old=>old.map((x,k)=>k===i?{...x,start_time:e.target.value}:x))} />
          <input type="date" aria-label="Date" value={d.date} onChange={e=>setDraft(old=>old.map((x,k)=>k===i?{...x,date:e.target.value}:x))} />
          <button type="button" className="text-rose-700" onClick={()=>setDraft(old=>old.filter((_,k)=>k!==i))}>Remove</button>
        </div>)}</div>
        <p className="text-xs text-slate-500">Slots are empty until you assign lessons. Nothing already in your calendar is removed or changed.</p>
        <button type="button" disabled={saving||!draft.length} onClick={save} className="rounded-full bg-emerald-800 text-white px-5 py-2 font-semibold disabled:opacity-50" data-testid="tt-save">{saving?"Saving…":"Save this week's timetable"}</button>
      </div>}
      </>}
    </div>
  </div>;
}
