import React, { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

export default function CalendarEventEditor({ event, students, lessons, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: event.title || "", date: event.date || "", start_time: event.start_time || "",
    duration_minutes: event.duration_minutes ?? "", student_id: event.student_id || "",
    event_type: event.event_type || "lesson", linked_lesson_id: event.linked_lesson_id || "",
    notes: event.notes || ""
  });
  const [busy, setBusy] = useState(false);
  const [assignment, setAssignment] = useState(null);
  useEffect(() => {
    if (!event.linked_assignment_id) return;
    api.get(`/assignments/${event.linked_assignment_id}`).then(r => setAssignment(r.data)).catch(() => {});
  }, [event.linked_assignment_id]);
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const save = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!form.title.trim() || !form.date) { toast.error("Title and date are required"); return; }
    setBusy(true);
    try {
      const lessonChanged = (form.linked_lesson_id || "") !== (event.linked_lesson_id || "");
      const studentChanged = (form.student_id || "") !== (event.student_id || "");
      const payload = {
        ...form, title: form.title.trim(),
        student_id: form.student_id || null, linked_lesson_id: form.linked_lesson_id || null,
        start_time: form.start_time || null,
        duration_minutes: form.duration_minutes === "" ? null : Number(form.duration_minutes),
        linked_assignment_id: event.linked_assignment_id || null
      };
      if (event.linked_assignment_id && lessonChanged) {
        // An assignment may already contain answers or evidence; never silently swap its lesson.
        payload.linked_assignment_id = null;
      }
      if (event.linked_assignment_id && studentChanged && !lessonChanged) {
        if (!form.student_id) { toast.error("Choose a child for an assigned lesson."); return; }
        if (!assignment || ["submitted","accepted","demonstrated","completed"].includes(assignment.status)) {
          toast.error("This lesson has submitted or completed work. Change the calendar entry without changing its owner, or schedule a new lesson.");
          return;
        }
        await api.post(`/assignments/${event.linked_assignment_id}/reassign`, { student_id: form.student_id });
      }
      await api.put(`/calendar/${event.id}`, payload);
      toast.success("Calendar updated");
      onSaved(); onClose();
    } catch (err) { toast.error(apiErrorMessage(err)); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!window.confirm("Remove this calendar entry? Any assigned lesson, submissions and portfolio evidence will be kept.")) return;
    setBusy(true);
    try {
      await api.delete(`/calendar/${event.id}`);
      toast.success("Scheduled entry removed; learning evidence kept.");
      onSaved(); onClose();
    } catch(err) { toast.error(apiErrorMessage(err)); }
    finally { setBusy(false); }
  };
  return <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={onClose}>
    <form className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-3 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()} onSubmit={save} data-testid="calendar-edit-modal">
      <div className="flex justify-between items-center"><h2 className="font-display text-xl font-bold">Edit scheduled entry</h2><button type="button" onClick={onClose} aria-label="Close" className="p-2">✕</button></div>
      <label className="block text-sm font-semibold">Title<input className="input mt-1" required value={form.title} onChange={e=>set("title",e.target.value)}/></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold">Date<input className="input mt-1" type="date" required value={form.date} onChange={e=>set("date",e.target.value)}/></label>
        <label className="block text-sm font-semibold">Start time<input className="input mt-1" type="time" value={form.start_time} onChange={e=>set("start_time",e.target.value)}/></label>
      </div>
      <label className="block text-sm font-semibold">Duration (minutes)<input className="input mt-1" type="number" min="1" max="600" value={form.duration_minutes} onChange={e=>set("duration_minutes",e.target.value)}/></label>
      <label className="block text-sm font-semibold">Child<select className="input mt-1" value={form.student_id} onChange={e=>set("student_id",e.target.value)}><option value="">Whole family / no child</option>{students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label className="block text-sm font-semibold">Event type<select className="input mt-1" value={form.event_type} onChange={e=>set("event_type",e.target.value)}>{["lesson","assignment","assessment","project","excursion","co-op","tutor","holiday","parent-review"].map(t=><option key={t} value={t}>{t}</option>)}</select></label>
      <label className="block text-sm font-semibold">Linked lesson<select className="input mt-1" value={form.linked_lesson_id} onChange={e=>set("linked_lesson_id",e.target.value)}><option value="">None</option>{lessons.map(l=><option key={l.id} value={l.id}>{l.title}</option>)}{event.linked_lesson_id && !lessons.some(l=>l.id===event.linked_lesson_id) && <option value={event.linked_lesson_id}>Previously linked lesson</option>}</select></label>
      <label className="block text-sm font-semibold">Notes<textarea className="input mt-1" rows={2} value={form.notes} onChange={e=>set("notes",e.target.value)}/></label>
      <p className="text-xs text-slate-600">Rescheduling changes the calendar, not completed lesson evidence. Changing a linked lesson unlinks the old assignment; it does not erase work.</p>
      <div className="flex justify-between flex-wrap gap-2 pt-2"><button type="button" disabled={busy} onClick={remove} className="border border-red-300 text-red-700 rounded-full px-4 py-2">Remove scheduled entry</button><button disabled={busy} type="submit" className="bg-teal-800 text-white rounded-full px-6 py-2">{busy?"Saving…":"Save changes"}</button></div>
    </form>
  </div>;
}
