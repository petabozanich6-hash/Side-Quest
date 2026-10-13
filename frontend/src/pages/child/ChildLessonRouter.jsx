import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import ChildLesson from "./ChildLesson";
import ParentLessonPlayer from "./ParentLessonPlayer";

// Lessons a parent built use the simple player; older lessons keep the staged quest player.
export default function ChildLessonRouter() {
  const { aid } = useParams();
  const [a, setA] = useState(null);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    api.get(`/assignments/${aid}`).then((r) => { setA(r.data); setError(""); }).catch(() => setError("We could not open this quest."));
  }, [aid]);
  useEffect(() => { load(); }, [load]);
  if (error) return <div className="text-stone-600" role="alert">{error}</div>;
  if (!a) return <div className="text-stone-500">Loading…</div>;
  if (a.lesson?.source === "parent") return <ParentLessonPlayer key={a.id + a.status} assignment={a} onChanged={load} />;
  return <ChildLesson />;
}
