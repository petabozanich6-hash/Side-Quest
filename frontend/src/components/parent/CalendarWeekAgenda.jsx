import React from "react";

// A readable agenda for one week, without requiring parents to decipher tiny
// calendar chips. The parent can still open any day or edit any individual item.
export default function CalendarWeekAgenda({
  days, eventsByDate, children, nameOf, colourOf, isFreeSlot, onDayOpen, onEdit,
}) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3" data-testid="calendar-week-agenda">
    {days.map(({ date, label, isToday }) => {
      const entries = eventsByDate[date] || [];
      const free = entries.filter(isFreeSlot).length;
      const filled = entries.filter(e => e.linked_assignment_id || e.linked_lesson_id).length;
      return <section key={date} className="rounded-xl border border-slate-200 bg-white overflow-hidden" data-testid={`cal-day-${date}`}>
        <div className="flex items-start justify-between gap-2 bg-stone-50 px-3 py-2 border-b">
          <button type="button" onClick={() => onDayOpen(date)} className="text-left font-bold text-sm hover:underline" aria-label={`View and edit ${date}`}>
            {label}{isToday && <span className="ml-1 text-teal-800 text-xs font-normal">Today</span>}
          </button>
          <span className="text-[11px] text-slate-500">{entries.length ? `${filled} assigned · ${free} free` : "No plans"}</span>
        </div>
        <div className="p-2 space-y-1.5">
          {!entries.length && <p className="px-2 py-3 text-xs text-slate-500">Nothing scheduled. Choose the day to add something.</p>}
          {entries.slice(0, 6).map(event => {
            const freeSlot = isFreeSlot(event);
            const student = event.student_id ? nameOf(event.student_id) || "Child" : "Whole family";
            const status = freeSlot ? "Lesson not chosen" :
              event.status === "done" ? "Completed" :
              event.linked_lesson_id ? "Lesson scheduled" : "Calendar event";
            return <button key={event.id} type="button"
              onClick={() => onEdit({ ...event, initialQuest: freeSlot })}
              data-testid={`edit-cal-${event.id}`} data-slot={freeSlot ? "free" : event.linked_lesson_id ? "filled" : undefined}
              className="w-full text-left rounded-lg border border-slate-200 p-2 flex gap-2 items-start hover:border-teal-500 hover:bg-teal-50/40">
              <span className="mt-1 h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colourOf(event.student_id) }} />
              <span className="flex-1 min-w-0">
                <span className="block text-xs text-slate-500">{event.start_time || "Any time"} · {student}</span>
                <span className="block text-sm font-semibold break-words">{event.title}</span>
                {event.lesson_title && <span className="block text-xs text-slate-700 break-words">{event.lesson_title}</span>}
                <span className={`block text-xs ${freeSlot ? "text-amber-800" : "text-slate-500"}`}>{status}</span>
              </span>
            </button>;
          })}
          {entries.length > 6 && <button type="button" onClick={() => onDayOpen(date)}
            className="text-xs text-teal-800 font-semibold px-2 py-1 underline">
            Show all {entries.length} items
          </button>}
        </div>
      </section>;
    })}
  </div>;
}
