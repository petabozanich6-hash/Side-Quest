// Small, pure helpers for the child's dashboard. Every open assignment stays visible.
export const isReturned = (a) => ["needs_revision", "needs_more_practice"].includes(a?.status);
export const isResume = (a) => ["in_progress", "opened"].includes(a?.status);
export const canWork = (a) => a?.status !== "awaiting_help";

export const lessonId = (a) => a?.lesson?.id || a?.lesson_id;

export function planFor(a, events = [], today = "") {
  const dates = events
    .filter((event) => event.date && (
      event.linked_assignment_id ? event.linked_assignment_id === a.id : event.linked_lesson_id === lessonId(a)
    ))
    .map((event) => event.date)
    .sort();
  // An assignment may have a date but no calendar entry.
  if (!dates.length && (a.scheduled_date || a.due_date)) dates.push(a.scheduled_date || a.due_date);
  if (!dates.length) return null;
  return dates.find((date) => date === today) ||
    dates.filter((date) => date < today).slice(-1)[0] ||
    dates[0];
}

export function groupChildQuests(tasks = [], events = [], today = "") {
  const groups = { returned: [], today: [], catchUp: [], workAhead: [], anytime: [], awaitingHelp: [] };
  const planned = {};
  for (const a of tasks) {
    const date = planFor(a, events, today);
    planned[a.id] = date;
    if (a.status === "awaiting_help") groups.awaitingHelp.push(a);
    else if (isReturned(a)) groups.returned.push(a);
    else if (date === today) groups.today.push(a);
    else if (date && date < today) groups.catchUp.push(a);
    else if (date && date > today) groups.workAhead.push(a);
    else groups.anytime.push(a);
  }
  groups.workAhead.sort((a, b) => planned[a.id].localeCompare(planned[b.id]));
  return { ...groups, planned };
}

export function featuredChildQuest(groups) {
  const eligible = [
    ...groups.today, ...groups.returned, ...groups.catchUp,
    ...groups.anytime, ...groups.workAhead,
  ].filter(canWork);
  // Carry on with genuine unfinished work first, regardless of its scheduled day.
  return eligible.find((a) => a.status === "in_progress") ||
    eligible.find((a) => a.status === "opened") ||
    groups.returned.find(canWork) ||
    groups.today.find(canWork) ||
    groups.catchUp.find(canWork) ||
    groups.anytime.find(canWork) ||
    groups.workAhead.find(canWork) ||
    null;
}
