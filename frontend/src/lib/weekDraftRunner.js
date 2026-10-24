// Writes AI drafts for empty timetable slots (Auto-Quest proposals) outside any page, a few at a time, so a parent can
// close Plan My Week, review finished drafts and come back while the rest are still being written. Like batchRunner,
// it lives for the life of the tab: after a refresh the slots that were not written yet simply show "Needs a lesson".
import { api } from "./api";

const POOL = 3;
const jobs = new Map(); // proposal id -> { state: "queued" | "writing" | "done" | "failed", label, error }
const listeners = new Set();
let stopped = "";

export function onWeekDraftChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
const emit = () => listeners.forEach(fn => { try { fn(); } catch { /* a page went away */ } });

export const weekDraftState = id => jobs.get(id)?.state || "";
export const weekDraftError = id => jobs.get(id)?.error || "";
export const weekDraftsStopped = () => stopped;
export function weekDraftSummary() {
  const all = [...jobs.values()];
  const n = s => all.filter(j => j.state === s).length;
  return { total: all.length, queued: n("queued"), writing: n("writing"), done: n("done"), failed: n("failed") };
}
export const weekDraftsRunning = () => [...jobs.values()].some(j => j.state === "queued" || j.state === "writing");

// Out of allowance or not on a paid plan: no point starting the rest.
const STOP = e => e?.response?.status === 402 || e?.response?.status === 429 || e?.response?.data?.code === "AI_QUOTA";

let active = 0;
function pump() {
  while (active < POOL && !stopped) {
    const next = [...jobs.entries()].find(([, j]) => j.state === "queued");
    if (!next) break;
    const [id, job] = next;
    job.state = "writing"; active++; emit();
    api.post(`/auto-quest/proposals/${id}/generate`, { topic: job.topic })
      .then(() => { job.state = "done"; })
      .catch(e => {
        job.state = "failed";
        job.error = e?.response?.data?.detail || "This draft could not be written.";
        if (STOP(e)) {
          stopped = job.error;
          for (const j of jobs.values()) if (j.state === "queued") { j.state = "failed"; j.error = "Not started: " + stopped; }
        }
      })
      .finally(() => { active--; emit(); pump(); });
  }
}

/** Queue drafts for these proposals. Already queued or running proposals are left alone, so repeated clicks are safe. */
export function runWeekDrafts(rows, topic = "") {
  stopped = "";
  // Finished entries from an earlier round are cleared so the summary describes this round only.
  if (!weekDraftsRunning()) jobs.clear();
  for (const r of rows) {
    const cur = jobs.get(r.id);
    if (cur && (cur.state === "queued" || cur.state === "writing")) continue;
    jobs.set(r.id, { state: "queued", label: r.label, topic });
  }
  emit();
  pump();
}
