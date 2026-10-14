// Writes the lessons of an AI lesson set one at a time, outside any page, so a parent can open, edit and assign
// finished lessons while the rest are still being written. The server remembers the set and claims each lesson
// before writing it, so starting this twice, from two tabs or after a refresh can never write a lesson twice.
// If the tab is closed, nothing is lost: the set page picks up the lessons that were not written yet.
import { api } from "./api";

const running = new Map();
const listeners = new Set();

export const newId = () =>
  (window.crypto && window.crypto.randomUUID)
    ? window.crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (Number(c) ^ (Math.random() * 16 >> (Number(c) / 4))).toString(16));

export function onBatchChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }
const emit = (id, info) => listeners.forEach(fn => { try { fn(id, info); } catch { /* a page went away */ } });
export const isRunning = id => running.has(id);
export const anyRunning = () => running.size > 0;

const STOP = e => {
  const code = e?.response?.data?.code, st = e?.response?.status;
  return code === "AI_QUOTA" || code === "UPGRADE_REQUIRED" || st === 402;
};

export function runBatch(id, indexes) {
  if (running.has(id)) return running.get(id);
  const job = (async () => {
    for (const index of indexes) {
      emit(id, { phase: "start", index });
      let ok = false, err = null;
      for (let attempt = 0; attempt < 2 && !ok; attempt++) {
        try { await api.post(`/ai/batches/${id}/items/${index}/draft`); ok = true; }
        catch (e) {
          err = e;
          const code = e?.response?.data?.code;
          // Not worth an automatic second try: out of allowance, already being written elsewhere, or gone.
          if (STOP(e) || code === "IN_PROGRESS" || code === "LESSON_REMOVED" || e?.response?.status === 404) break;
        }
      }
      emit(id, { phase: "end", index, ok, error: err?.response?.data?.detail });
      if (!ok && STOP(err)) { emit(id, { phase: "stopped", reason: err.response.data.detail }); break; }
    }
  })().finally(() => { running.delete(id); emit(id, { phase: "done" }); });
  running.set(id, job);
  return job;
}
