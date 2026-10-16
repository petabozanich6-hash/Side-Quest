// Offline lessons for children (installed app or browser).
//
// While online, a child's assigned, unfinished lessons are saved on the device (IndexedDB), as the server sends them to
// the child: no answer keys (the server strips those for children). With no signal the child can open those lessons,
// work through them and hand them in; their work waits in an on-device "outbox" and is sent, in order, as soon as the
// device is back online. Marking (practice checks, the quest quiz) always happens on the server, after reconnecting.
//
// Only child sessions use this. Everything is deleted on sign-out (clearOffline), and nothing from the parent hub or
// /api responses in general is stored. Keys are prefixed with the child's id, so siblings on one device stay apart.
import { api } from "./api";

const DB_NAME = "sq-offline";
const DB_VERSION = 1;
const MAX_LESSONS = 25;

let dbp = null;
// After sign-out nothing may reopen (and so recreate) the store until a child saves something again.
let closed = false;
const reopen = () => { closed = false; };
function db() {
  if (closed) return Promise.reject(new Error("signed out"));
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("no indexedDB"));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains("lessons")) d.createObjectStore("lessons");
      if (!d.objectStoreNames.contains("outbox")) d.createObjectStore("outbox");
      if (!d.objectStoreNames.contains("meta")) d.createObjectStore("meta");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  dbp.catch(() => { dbp = null; });
  return dbp;
}

function tx(store, mode, fn) {
  return db().then((d) => new Promise((resolve, reject) => {
    const t = d.transaction(store, mode);
    const s = t.objectStore(store);
    const out = fn(s);
    t.oncomplete = () => resolve(out && "result" in out ? out.result : out);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  }));
}
const put = (store, key, value) => tx(store, "readwrite", (s) => s.put(value, key)).catch(() => {});
const get = (store, key) => tx(store, "readonly", (s) => s.get(key)).catch(() => undefined);
const del = (store, key) => tx(store, "readwrite", (s) => s.delete(key)).catch(() => {});
async function entries(store, prefix) {
  try {
    return await tx(store, "readonly", (s) => {
      const out = [];
      const range = IDBKeyRange.bound(prefix, prefix + "￿");
      s.openCursor(range).onsuccess = (e) => { const c = e.target.result; if (c) { out.push([c.key, c.value]); c.continue(); } };
      return out;
    });
  } catch { return []; }
}

/** True when a request failed because there is no connection (as opposed to the server saying no). */
export const isNetworkError = (e) => !!e && !e.response && (e.code === "ERR_NETWORK" || e.message === "Network Error" || e.code === "ECONNABORTED" || !navigator.onLine);

// ------------------------------------------------------------------ change notifications
const listeners = new Set();
export const onOfflineChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const changed = () => listeners.forEach((fn) => { try { fn(); } catch { /* ignore */ } });

// ------------------------------------------------------------------ lessons
const lessonKey = (childId, aid) => `${childId}:${aid}`;

export async function getSavedLesson(childId, aid) { return get("lessons", lessonKey(childId, aid)); }
export async function savedLessonIds(childId) { return new Set((await entries("lessons", `${childId}:`)).map(([, v]) => v.id)); }
export async function setSavedLessonStatus(childId, aid, status) {
  const a = await getSavedLesson(childId, aid);
  if (a) await put("lessons", lessonKey(childId, aid), { ...a, status });
}

/**
 * Saves the child's open lessons on this device (called from the child's home page while online) and forgets saved
 * lessons that are no longer open (handed in, finished or removed), unless work for them is still waiting to be sent.
 */
export async function syncSavedLessons(childId, tasks) {
  if (!childId) return;
  reopen();
  const open = (tasks || []).filter((a) => a && a.id && !["submitted", "reviewed", "approved", "completed", "awaiting_help"].includes(a.status)).slice(0, MAX_LESSONS);
  const keep = new Set(open.map((a) => a.id));
  for (const a of open) {
    try {
      const { data } = await api.get(`/assignments/${a.id}`);
      const local = await get("outbox", `${childId}:${a.id}:draft`);
      await put("lessons", lessonKey(childId, a.id), { ...data, draft: local?.body ?? data.draft, saved_at: new Date().toISOString() });
    } catch (e) { if (isNetworkError(e)) break; }
  }
  const pending = await pendingAssignmentIds(childId);
  for (const [key, v] of await entries("lessons", `${childId}:`)) if (!keep.has(v.id) && !pending.has(v.id)) await del("lessons", key);
  changed();
}

/**
 * Offline lessons are a Family Membership feature. When the family isn't (or is no longer) paying, the device lets go
 * of this child's saved lessons and home page. Work still waiting to be sent stays, so nothing the child did is lost.
 */
export async function dropSavedLessons(childId) {
  if (!childId) return;
  const pending = await pendingAssignmentIds(childId);
  for (const [key, v] of await entries("lessons", `${childId}:`)) if (!pending.has(v.id)) await del("lessons", key);
  await del("meta", `${childId}:dashboard`);
  changed();
}

export async function saveDashboard(childId, data) { if (childId) await put("meta", `${childId}:dashboard`, data); }
export async function savedDashboard(childId) { return get("meta", `${childId}:dashboard`); }

// ------------------------------------------------------------------ outbox
// Per assignment: the latest draft, quiz answers waiting to be marked, and a hand-in waiting to be sent.
// They are sent in that order, so the server sees the work and the quiz before the hand-in.
const outKey = (childId, aid, kind) => `${childId}:${aid}:${kind}`;

export async function queueDraft(childId, aid, body) {
  reopen();
  await put("outbox", outKey(childId, aid, "draft"), { body, at: Date.now() });
  const a = await getSavedLesson(childId, aid);
  if (a) await put("lessons", lessonKey(childId, aid), { ...a, draft: body });
  changed();
}
/** After an online save: the device copy gets the latest work and any older queued draft is dropped (never resent). */
export async function rememberDraft(childId, aid, body) {
  await del("outbox", outKey(childId, aid, "draft"));
  const a = await getSavedLesson(childId, aid);
  if (a) await put("lessons", lessonKey(childId, aid), { ...a, draft: body });
}
export async function queueQuiz(childId, aid, answers) { reopen(); await put("outbox", outKey(childId, aid, "quiz"), { answers, at: Date.now() }); changed(); }
export async function queuedQuiz(childId, aid) { return get("outbox", outKey(childId, aid, "quiz")); }
export async function queueSubmission(childId, aid, body) {
  reopen();
  await put("outbox", outKey(childId, aid, "submit"), { body, at: Date.now() });
  await setSavedLessonStatus(childId, aid, "waiting_to_send");
  changed();
}
export async function queuedDraft(childId, aid) { return (await get("outbox", outKey(childId, aid, "draft")))?.body; }
export async function queuedSubmission(childId, aid) { return get("outbox", outKey(childId, aid, "submit")); }

export async function pendingAssignmentIds(childId) {
  return new Set((await entries("outbox", `${childId}:`)).map(([k]) => k.split(":")[1]));
}
export async function pendingCount(childId) {
  return (await entries("outbox", `${childId}:`)).filter(([k]) => k.endsWith(":submit") || k.endsWith(":draft")).length;
}

/** Messages for the child about things that happened while sending (e.g. the quiz needs another go). */
export async function notices(childId) { return (await get("meta", `${childId}:notices`)) || []; }
export async function clearNotices(childId) { await del("meta", `${childId}:notices`); changed(); }
async function addNotice(childId, n) { await put("meta", `${childId}:notices`, [...(await notices(childId)), n]); }

let flushing = null;
/**
 * Sends everything waiting in this child's outbox. Stops at the first connection problem (and tries again later);
 * a "no" from the server (already handed in, quiz not passed) is resolved, never retried forever.
 * Returns { sent, left }.
 */
export function flushOutbox(childId) {
  if (!childId) return Promise.resolve({ sent: 0, left: 0 });
  if (flushing) return flushing;
  flushing = (async () => {
    let sent = 0;
    const items = await entries("outbox", `${childId}:`);
    const byAid = new Map();
    for (const [k, v] of items) { const [, aid, kind] = k.split(":"); if (!byAid.has(aid)) byAid.set(aid, {}); byAid.get(aid)[kind] = v; }
    try {
      for (const [aid, w] of byAid) {
        const title = (await getSavedLesson(childId, aid))?.lesson?.title || "your lesson";
        if (w.draft) {
          try { await api.put(`/assignments/${aid}/draft`, w.draft.body); }
          catch (e) { if (isNetworkError(e) || e.response?.status === 401) throw e; }
          await del("outbox", outKey(childId, aid, "draft")); sent++;
        }
        let quizFailed = false;
        if (w.quiz) {
          try {
            const { data } = await api.post(`/assignments/${aid}/quiz-check`, { answers: w.quiz.answers });
            quizFailed = data && data.passed === false;
          } catch (e) { if (isNetworkError(e) || e.response?.status === 401) throw e; }
          await del("outbox", outKey(childId, aid, "quiz")); sent++;
        }
        if (w.submit) {
          if (quizFailed && !w.submit.body.needs_help) {
            // The quest check wasn't passed: don't hand in. The lesson goes back to the child with their work kept.
            await del("outbox", outKey(childId, aid, "submit"));
            await setSavedLessonStatus(childId, aid, "in_progress");
            await addNotice(childId, { aid, kind: "quiz_retry", text: `Your Quest check for "${title}" needs another go. Your work is saved, so open the lesson to try again.` });
            continue;
          }
          try {
            await api.post("/submissions", w.submit.body);
            await addNotice(childId, { aid, kind: "handed_in", text: `"${title}" has been handed in. Your grown-up will take a look.` });
          } catch (e) {
            if (isNetworkError(e) || e.response?.status === 401) throw e;
            const code = e.response?.data?.code;
            if (code === "QUIZ_NOT_PASSED") await addNotice(childId, { aid, kind: "quiz_retry", text: `Your Quest check for "${title}" needs another go before you hand it in.` });
            else if (code !== "ALREADY_SUBMITTED" && code !== "ALREADY_DONE") await addNotice(childId, { aid, kind: "error", text: `"${title}" couldn't be handed in: ${e.response?.data?.detail || "please try again"}.` });
            await setSavedLessonStatus(childId, aid, code === "ALREADY_SUBMITTED" || code === "ALREADY_DONE" ? "submitted" : "in_progress");
          }
          await del("outbox", outKey(childId, aid, "submit")); sent++;
        }
      }
    } catch { /* offline again or signed out: the rest waits for next time */ }
    const left = await pendingCount(childId);
    changed();
    // Pages showing server data (the child's home) reload once queued work has reached the server.
    if (sent > 0) { try { window.dispatchEvent(new Event("sq-offline-sent")); } catch { /* not in a browser */ } }
    return { sent, left };
  })().finally(() => { flushing = null; });
  return flushing;
}

/** Deletes every saved lesson, queued piece of work and message on this device (sign-out). */
export async function clearOffline() {
  try { if (dbp) (await dbp).close(); } catch { /* not open */ }
  dbp = null;
  closed = true;
  await new Promise((resolve) => {
    try { const r = indexedDB.deleteDatabase(DB_NAME); r.onsuccess = r.onerror = r.onblocked = () => resolve(); } catch { resolve(); }
  });
  changed();
}
