import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";

/** Owner-only queue; Cloudflare handles generation independently of this tab. */
export default function QuestBookOvernight() {
  const [data,setData] = useState(null);
  const [selected,setSelected] = useState([]);
  const [busy,setBusy] = useState("");
  const [error,setError] = useState("");
  const initialized = useRef(false);
  const mounted = useRef(true);
  const load = useCallback(async()=>{
    try {
      const response=await api.get("/quest-books/admin/overnight",{params:{_:Date.now()}});
      if (!mounted.current)return;
      setData(response.data);setError("");
      if(!initialized.current) {
        initialized.current=true;
        setSelected(response.data.books.filter((b)=>b.has_chapters && b.missing>0).map((b)=>b.id));
      }
    }catch(e){
      if(mounted.current)setError(apiErrorMessage(e,"Could not load the cross-book lesson queue."));
    }
  },[]);
  useEffect(()=>{
    mounted.current=true;
    void load();
    const interval=setInterval(()=>{void load();},30000);
    return ()=>{mounted.current=false;clearInterval(interval);};
  },[load]);
  const bookIds=(data?.books||[]).filter((b)=>selected.includes(b.id) && b.missing>0 && b.has_chapters);
  const remaining=(data?.books||[]).reduce((n,b)=>n+b.missing,0);
  const totalSelected=bookIds.reduce((n,b)=>n+b.missing,0);
  const job=data?.job;
  const counts=job?.counts||{};
  const done=Number(counts.generated||0)+Number(counts.skipped||0)+Number(counts.failed||0);
  const active=["running","paused","building"].includes(job?.status);
  const action=async(kind)=>{
    setBusy(kind);setError("");
    try{
      const path=kind==="start"?"/quest-books/admin/overnight/start":`/quest-books/admin/overnight/${encodeURIComponent(job.id)}/control`;
      await api.post(path,kind==="start"?{book_ids:bookIds.map(b=>b.id)}:{action:kind});
      await load();
      toast.success(kind==="start"?"Overnight generation queued. You can close your browser.":kind==="pause"?"Queue paused after the current lesson.":kind==="resume"?"Overnight generation resumed.":"Failed lessons queued for retry.");
    }catch(e){const msg=apiErrorMessage(e,"Could not update the overnight queue.");setError(msg);toast.error(msg);}
    finally{setBusy("");}
  };
  return <section className="rounded-2xl border border-violet-300 bg-white p-4 sm:p-5 space-y-4" data-testid="quest-overnight-queue">
    <div className="space-y-1">
      <h3 className="font-bold text-violet-950 text-lg">Overnight Lesson Queue</h3>
      <p className="text-sm text-slate-700">All missing companion lessons across your uploaded Quest Books, in one place. The server generates the next lesson every five minutes, even when your MacBook is asleep or your browser is closed. Existing lessons are never regenerated.</p>
      <p className="text-xs text-slate-600">Books need their chapter and subsection plan saved first. Generated lessons remain drafts for review; this does not approve or publish anything.</p>
    </div>
    {!data && !error && <p role="status" className="text-sm">Finding missing lessons…</p>}
    {error && <p role="alert" className="text-sm text-red-800">{error} <button type="button" onClick={()=>void load()} className="underline">Reload</button></p>}
    {data && <>
      <p className="text-sm font-bold text-slate-900" data-testid="quest-overnight-total">
        {remaining} missing lesson{remaining===1?"":"s"} across {data.books.filter(b=>b.missing>0).length} book{data.books.filter(b=>b.missing>0).length===1?"":"s"}
      </p>
      <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
        {data.books.map((book)=><label key={book.id} className="flex gap-3 items-center p-3 text-sm cursor-pointer">
          <input type="checkbox" checked={selected.includes(book.id)}
            disabled={!book.has_chapters || book.missing===0 || !!busy || active}
            onChange={(e)=>setSelected(prev=>e.target.checked?[...prev,book.id]:prev.filter(id=>id!==book.id))}
            aria-label={`Generate missing lessons in ${book.title}`} />
          <span className="flex-1 min-w-0">
            <span className="font-semibold block text-stone-900">{book.title}</span>
            <span className="text-xs text-stone-600">{book.year_subject} · {book.generated}/{book.total} already generated</span>
            {!book.has_chapters && <span className="text-xs text-amber-800 block">Needs chapter analysis before lessons can be queued</span>}
          </span>
          <span className="text-xs font-bold text-violet-900">{book.missing? `${book.missing} missing` : "Complete"}</span>
        </label>)}
      </div>
      {!active && totalSelected>0 && <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={!!busy} onClick={()=>void action("start")}
          className="rounded-lg bg-violet-800 text-white font-bold px-4 py-2 text-sm disabled:opacity-50"
          data-testid="quest-start-overnight">
          {busy==="start"?"Queuing…" : `Generate ${totalSelected} missing lessons overnight`}
        </button>
        <p className="text-xs text-stone-600">About one attempt per five-minute cycle, subject to AI availability. Large collections may take more than one night.</p>
      </div>}
      {job && <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3" data-testid="quest-overnight-status">
        <div className="flex justify-between gap-2 flex-wrap items-center">
          <p className="font-bold text-violet-950">Queue: {job.status.replaceAll("_"," ")}</p>
          <span className="text-sm font-semibold text-violet-900">{done} of {job.total} processed</span>
        </div>
        <div className="h-2 bg-violet-200 rounded-full overflow-hidden" role="progressbar"
          aria-valuemin={0} aria-valuemax={job.total} aria-valuenow={done}>
          <div className="bg-violet-800 h-full" style={{width:`${job.total?Math.min(100,100*done/job.total):0}%`}} />
        </div>
        <p className="text-sm text-violet-950">{Number(counts.generated||0)} new · {Number(counts.skipped||0)} already present · {Number(counts.processing||0)} processing · {Number(counts.failed||0)} failed · {Number(counts.pending||0)} waiting</p>
        <div className="flex flex-wrap gap-2">
          {job.status==="running"&&<button type="button" disabled={!!busy} onClick={()=>void action("pause")}
            className="rounded-lg border border-violet-600 px-3 py-1.5 text-xs font-bold">Pause queue</button>}
          {job.status==="paused"&&<button type="button" disabled={!!busy} onClick={()=>void action("resume")}
            className="rounded-lg bg-violet-800 text-white px-3 py-1.5 text-xs font-bold">Resume queue</button>}
          {["completed_with_errors","paused","completed"].includes(job.status)&&Number(counts.failed||0)>0&&
            <button type="button" disabled={!!busy} onClick={()=>void action("retry_failed")}
              className="rounded-lg border border-amber-600 px-3 py-1.5 text-xs font-bold">Retry failed lessons</button>}
          <button type="button" disabled={!!busy} onClick={()=>void load()}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-bold">Refresh progress</button>
        </div>
        <ul className="space-y-1 text-xs text-violet-950">
          {(job.books||[]).map(b=><li key={b.book_id}><Link className="underline font-semibold" to={`/parent/quest-books/${encodeURIComponent(b.book_id)}?workspace=lessons`}>{b.book_title}</Link>: {b.generated||0} new, {b.skipped||0} skipped, {b.failed||0} failed of {b.total}</li>)}
        </ul>
        {job.last_error&&<p className="text-xs text-amber-900">{job.last_error}</p>}
        {(job.failures||[]).length>0&&<details className="text-xs text-red-900"><summary className="cursor-pointer font-bold">See {job.failures.length} failed lesson(s)</summary>
          <ul className="list-disc pl-5 mt-2 space-y-1">{job.failures.map((f,i)=><li key={i}>{f.book_title} · {f.chapter_title}: {f.last_error}</li>)}</ul>
        </details>}
      </div>}
    </>}
  </section>;
}
