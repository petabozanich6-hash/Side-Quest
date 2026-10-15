import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { flushOutbox, getSavedLesson, isNetworkError, pendingAssignmentIds } from "../../lib/offline";
import ChildLesson from "./ChildLesson";
import ParentLessonPlayer from "./ParentLessonPlayer";

// Lessons a parent built or generated with AI use the step-by-step player; only older library lessons keep the original quest player.
// With no signal, the copy saved on this device is used (see lib/offline.js).
export default function ChildLessonRouter() {
  const { aid } = useParams();
  const { user } = useAuth();
  const [a, setA] = useState(null);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const childId = user?.id;
    // Work done offline goes to the server first, so the lesson opens with the child's latest answers.
    if (childId && (await pendingAssignmentIds(childId)).has(aid)) await flushOutbox(childId);
    try {
      const r = await api.get(`/assignments/${aid}`);
      setA(r.data); setOffline(false); setError("");
    } catch (e) {
      const saved = childId && isNetworkError(e) ? await getSavedLesson(childId, aid) : null;
      if (saved) { setA(saved); setOffline(true); setError(""); return; }
      setError(isNetworkError(e) ? "You're offline and this quest isn't saved on this device yet. Open your quests once while you have internet and it will work offline next time." : "We could not open this quest.");
    }
  }, [aid, user?.id]);
  useEffect(() => { load(); }, [load]);
  if (error) return <div className="text-stone-600" role="alert" data-testid="lesson-error">{error}</div>;
  if (!a) return <div className="text-stone-500">Loading…</div>;
  if (a.lesson?.builder || a.lesson?.source === "parent" || a.lesson?.source === "ai") return <ParentLessonPlayer key={a.id + a.status + (offline ? ":offline" : "")} assignment={a} onChanged={load} offline={offline} />;
  if (offline) return <div className="text-stone-600" role="alert">This older quest needs the internet. Your newer quests work offline.</div>;
  return <ChildLesson />;
}
