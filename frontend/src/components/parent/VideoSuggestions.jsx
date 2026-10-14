import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Film, Search, Trash2, X, Play, Plus } from "lucide-react";
import { api } from "../../lib/api";

const MAX_VIDEOS = 4;
const PLACES = [["intro", "Before the lesson starts"], ["teaching", "After the explanations"], ["examples", "After the worked examples"], ["practice", "After the practice"], ["extension", "At the end"]];
const PURPOSE = { intro: "Introduces the idea", explain: "Explains the idea", demo: "Shows it being done", extension: "Goes a little further" };
const placeFor = (purpose) => (purpose === "intro" ? "intro" : purpose === "demo" ? "examples" : purpose === "extension" ? "extension" : "teaching");
const mmss = (s) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "");

function Card({ v, children, preview, setPreview }) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-3 flex flex-col sm:flex-row gap-3" data-testid="video-card">
      <div className="sm:w-48 shrink-0">
        {preview ? (
          <div className="aspect-video overflow-hidden rounded-lg bg-black"><iframe title={v.title} src={`${v.embed_url}?rel=0&modestbranding=1&playsinline=1`} className="h-full w-full" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
        ) : (
          <button type="button" onClick={() => setPreview(true)} className="relative block w-full aspect-video overflow-hidden rounded-lg bg-slate-200" aria-label={`Preview ${v.title}`}>
            {v.thumbnail && <img src={v.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
            <span className="absolute inset-0 flex items-center justify-center"><span className="rounded-full bg-black/70 text-white p-2"><Play size={18} /></span></span>
          </button>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-semibold text-slate-900 leading-snug">{v.title}</p>
        <p className="text-sm text-slate-600">{[v.channel, v.duration_seconds ? mmss(v.duration_seconds) : ""].filter(Boolean).join(" · ")}</p>
        <p className="text-sm text-slate-700"><b>Purpose:</b> {PURPOSE[v.purpose] || PURPOSE.explain}{v.reason ? ` (${v.reason})` : ""}</p>
        {children}
      </div>
    </div>
  );
}

function Suggestion({ v, onAdd, onDismiss, adding }) {
  const [preview, setPreview] = useState(false);
  return (
    <Card v={v} preview={preview} setPreview={setPreview}>
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="button" onClick={() => setPreview((p) => !p)} className="rounded-full border border-slate-400 px-3 py-1 text-sm font-semibold" data-testid="video-preview">{preview ? "Close preview" : "Preview"}</button>
        <button type="button" disabled={adding} onClick={() => onAdd(v)} className="rounded-full bg-emerald-700 text-white px-3 py-1 text-sm font-semibold disabled:opacity-50" data-testid="video-add"><Plus size={14} className="inline -mt-0.5" /> Add to Lesson</button>
        <button type="button" onClick={() => onDismiss(v)} className="rounded-full border border-slate-300 px-3 py-1 text-sm" data-testid="video-dismiss">Dismiss</button>
      </div>
    </Card>
  );
}

// "Suggested resource": real videos from the YouTube Data API, chosen by the server (never by the AI) and approved by the parent.
// Nothing here changes what a child sees until the parent presses Add to Lesson.
export default function VideoSuggestions({ lesson, onSaved, auto = false }) {
  const [status, setStatus] = useState(null);
  const [list, setList] = useState([]);
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [link, setLink] = useState("");
  const [own, setOwn] = useState(null);
  const [open, setOpen] = useState(true);
  const tried = useRef(false);
  const videos = (lesson.resources || []).filter((r) => r.type === "video");
  const others = (lesson.resources || []).filter((r) => r.type !== "video");

  const search = useCallback(async (opts = {}) => {
    setBusy(true); setMsg("");
    try {
      const { data } = await api.post("/resources/suggest", { lesson_id: lesson.id, ...opts });
      setList(data.videos || []);
      setStatus((s) => ({ ...(s || {}), configured: true, searches_left_today: data.searches_left_today }));
      if (!(data.videos || []).length) setMsg("No suitable videos found for this topic. Your lesson is complete without one. You can search with different words or paste a YouTube link.");
    } catch (e) { setMsg(e.response?.data?.detail || "Could not look for videos just now. The lesson is fine without one."); }
    finally { setBusy(false); }
  }, [lesson.id]);

  useEffect(() => {
    api.get("/resources/status").then((r) => setStatus(r.data)).catch(() => setStatus({ configured: false }));
  }, []);
  useEffect(() => {
    if (auto && status?.configured && !videos.length && !tried.current) { tried.current = true; search(); }
  }, [auto, status, videos.length, search]);

  const save = async (resources, okMsg) => {
    setAdding(true);
    try {
      const { data } = await api.put(`/lessons/${lesson.id}`, { ...lesson, resources });
      onSaved(data); toast.success(okMsg);
      return true;
    } catch (e) { toast.error(e.response?.data?.detail || "Could not save the video"); return false; }
    finally { setAdding(false); }
  };
  const add = async (v) => {
    const r = {
      type: "video", title: v.title, url: v.url, channel: v.channel || "", description: v.description || "", duration_seconds: v.duration_seconds || null, thumbnail: v.thumbnail || "",
      purpose: v.purpose || "explain", concept: lesson.title ? `${lesson.title}` : "", after: placeFor(v.purpose), prompt: "", source: v.source === "parent" ? "parent" : "youtube", verified: true,
    };
    // Several videos can be added (up to MAX_VIDEOS); adding the same video again does nothing new.
    const key = (x) => x.video_id || x.url;
    if (videos.some((x) => key(x) === key(r) || x.url === r.url)) { toast.info("That video is already in the lesson"); return; }
    if (videos.length >= MAX_VIDEOS) { toast.error(`A lesson can have up to ${MAX_VIDEOS} videos. Remove one to add another.`); return; }
    if (await save([...others, ...videos, r], videos.length ? "Video added. The lesson now has " + (videos.length + 1) + " videos" : "Video added to the lesson")) { setList((l) => l.filter((x) => x.video_id !== v.video_id)); setOwn(null); setLink(""); }
  };
  const patch = (i, p) => save([...others, ...videos.map((x, k) => (k === i ? { ...x, ...p } : x))], "Saved");
  const remove = (i) => save([...others, ...videos.filter((_, k) => k !== i)], "Video removed");
  const verify = async () => {
    setMsg(""); setOwn(null);
    try { const { data } = await api.post("/resources/verify-link", { url: link }); setOwn(data); }
    catch (e) { setMsg(e.response?.data?.detail || "That link could not be used."); }
  };

  if (!status) return null;
  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-4 space-y-3" data-testid="video-suggestions">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Film size={18} /> Video for this lesson <span className="text-xs font-normal text-slate-500">(optional)</span></h2>
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-sm underline">{open ? "Hide" : "Show"}</button>
      </div>
      {open && (
        <>
          <p className="text-xs text-slate-600">The lesson teaches everything without a video. A video only adds a second explanation. Your child sees a video only after you add it, and it plays inside Side-Quest using YouTube’s privacy-enhanced player. Side-Quest has not watched these videos, so please preview before adding.</p>

          {videos.map((v, i) => (
            <Card key={v.video_id || i} v={v} preview={false} setPreview={() => {}}>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                <label className="flex items-center gap-1">Shows up: <select value={v.after || "teaching"} onChange={(e) => patch(i, { after: e.target.value })} className="rounded border border-slate-300 px-1 py-0.5" data-testid="video-place">{PLACES.map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></label>
                <button type="button" onClick={() => remove(i)} className="rounded-full border border-rose-300 text-rose-800 px-3 py-1 font-semibold" data-testid="video-remove"><Trash2 size={13} className="inline -mt-0.5" /> Remove</button>
              </div>
              <label className="block text-sm pt-1">The idea your child is asked about afterwards:
                <input defaultValue={v.concept || ""} onBlur={(e) => e.target.value !== (v.concept || "") && patch(i, { concept: e.target.value })} className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1" maxLength={200} data-testid="video-concept" />
              </label>
            </Card>
          ))}
          {videos.length > 0 && <p className="text-xs text-emerald-800" data-testid="video-added-note">{videos.length === 1 ? "This video is part of the lesson." : `These ${videos.length} videos are part of the lesson.`}{` You can add more below (up to ${MAX_VIDEOS}) or remove any you do not want.`}</p>}

          {status.configured ? (
            <div className="space-y-2">
              {busy && <p className="text-sm text-slate-600" role="status" data-testid="video-searching">Looking for a suitable video…</p>}
              {list.length > 0 && <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Suggested resource{list.length > 1 ? "s" : ""}</p>}
              {list.map((v) => <Suggestion key={v.video_id} v={v} adding={adding} onAdd={add} onDismiss={(x) => setList((l) => l.filter((y) => y.video_id !== x.video_id))} />)}
              <div className="flex flex-wrap gap-2 items-center">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search with different words" maxLength={100} className="flex-1 min-w-[12rem] rounded-lg border border-slate-300 px-3 py-1.5 text-sm" data-testid="video-query" />
                <button type="button" disabled={busy} onClick={() => search(q.trim().length >= 3 ? { query: q.trim(), fresh: true } : { purpose: "demo" })} className="rounded-full border border-slate-900 px-3 py-1.5 text-sm font-semibold disabled:opacity-50" data-testid="video-search"><Search size={14} className="inline -mt-0.5" /> {list.length || videos.length ? "Search for alternatives" : "Find a video"}</button>
              </div>
              {status.searches_left_today !== undefined && <p className="text-xs text-slate-500">Video searches left today: {status.searches_left_today}</p>}
            </div>
          ) : (
            <p className="text-sm text-slate-700" data-testid="video-not-configured">Automatic video suggestions are not switched on yet. You can still add a YouTube video yourself below.</p>
          )}

          <div className="space-y-2 border-t pt-3">
            <p className="text-sm font-semibold">Add a YouTube link yourself</p>
            <div className="flex flex-wrap gap-2">
              <input value={link} onChange={(e) => { setLink(e.target.value); setOwn(null); }} placeholder="Paste a YouTube address" className="flex-1 min-w-[12rem] rounded-lg border border-slate-300 px-3 py-1.5 text-sm" data-testid="video-link" />
              <button type="button" disabled={!link.trim()} onClick={verify} className="rounded-full border border-slate-900 px-3 py-1.5 text-sm font-semibold disabled:opacity-50" data-testid="video-check">Check link</button>
            </div>
            {own && <Suggestion v={own} adding={adding} onAdd={add} onDismiss={() => { setOwn(null); setLink(""); }} />}
          </div>
          {msg && <p className="text-sm text-amber-900" role="status" data-testid="video-msg">{msg}</p>}
        </>
      )}
    </section>
  );
}
