import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "../../lib/api";

/** Owner-only queue; Cloudflare handles generation independently of this tab. */
export default function QuestBookOvernight() {
  const [data,setData] = useState(null);
  const [selected,setSelected] = useState([]);
  const [autoApprove,setAutoApprove] = useState(false);
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
        setSelected(response.data.books.filter((b)=>b.has_chapters && (b.missing>0 || b.repairable>0 || b.ai_cleared>0)).map((b)=>b.id));
      }
    }catch(e){
      if(mounted.current)setError(apiErrorMessage(e,"Could not load the cross-book lesson queue."));
    }
  },[]);
  useEffect(()=>{
    mounted.current=true;
    void load();
    const interval=setInterval(()=>{void load();},15000);
    return ()=>{mounted.current=false;clearInterval(interval);};
  },[load]);
  const chosen=(data?.books||[]).filter((b)=>selected.includes(b.id) && b.has_chapters);
  const visibleBooks=(data?.books||[]).filter(b=>b.missing>0||b.repairable>0||b.ai_cleared>0||!b.has_chapters);
  const hiddenCompleted=(data?.books||[]).length-visibleBooks.length;
  const generateBooks=chosen.filter((b)=>b.missing>0);
  const repairBooks=chosen.filter((b)=>b.repairable>0);
  const totalSelected=generateBooks.reduce((n,b)=>n+b.missing,0);
  const repairSelected=repairBooks.reduce((n,b)=>n+b.repairable,0);
  const clearedSelected=chosen.reduce((n,b)=>n+(b.ai_cleared||0),0);
  const remaining=(data?.books||[]).reduce((n,b)=>n+b.missing,0);
  const jobs=data?.jobs || (data?.job?[data.job]:[]);
  const isActive=job=>["running","paused","building"].includes(job?.status);
  const generationActive=jobs.some(job=>job.kind!=="repair"&&isActive(job));
  const repairActive=jobs.some(job=>job.kind==="repair"&&isActive(job));
  const active=generationActive||repairActive;
  const activeJobs=jobs.filter(isActive);
  const historyJobs=jobs.filter(job=>!isActive(job));
  const attention=data?.attention||[];
  const timeOf=(value)=>value?new Date(value).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";
  const approveCleared=async()=>{
    if(!clearedSelected || !!busy)return;
    if(!window.confirm(`Approve the ${clearedSelected} AI-cleared lesson(s) across your selected books? Side-Quest will independently verify the saved lesson content, AI warnings and source before approving. Nothing will be published, and AI can miss errors.`))return;
    setBusy("approve");setError("");
    let approved=0,skipped=0;
    const failures=[];
    try {
      for(const book of chosen.filter(b=>b.ai_cleared>0)){
        try {
          const result=await api.post(`/quest-books/admin/books/${encodeURIComponent(book.id)}/lessons/approve-ai-cleared`,
            {confirm:"APPROVE_AI_CLEARED"},{timeout:120000});
          approved+=Number(result.data.approved_count||0);
          skipped+=Number(result.data.skipped_count||0);
        } catch(e) {
          failures.push(`${book.title}: ${apiErrorMessage(e,"Could not approve this book.")}`);
        }
      }
      await load();
      if(failures.length)setError(failures.join(" · "));
      toast[failures.length?"warning":"success"](`${approved} lessons approved. ${skipped+failures.length} entries need attention. Publishing remains separate.`,{duration:9000});
    }catch(e){setError(apiErrorMessage(e,"Could not verify the bulk approval."));}
    finally{setBusy("");}
  };
  const action=async(kind,jobId,options={})=>{
    if(kind==="stop" && !window.confirm("Stop this queue? Finished lessons will be kept. Waiting lessons will stop processing, and you can start a new queue later. A lesson already being processed may still finish."))return;
    if(kind==="set_auto_approve" && options.enabled && !window.confirm("Auto-approve only NEW lessons that pass all AI checks from this point onward? Already generated drafts will not be approved retroactively. Nothing will be published."))return;
    if((kind==="start" || kind==="repair") && !window.confirm(kind==="start"
      ? `Queue ${totalSelected} missing lessons for unattended AI generation? Workers AI resources may incur charges. Existing lessons remain untouched. ${autoApprove?"New AI-cleared lessons will be approved automatically; flagged ones stay Draft.":"New lessons stay Draft until reviewed."} Nothing is published. The queue can be paused or stopped, and new chapter plans will be picked up automatically.`
      : `Run AI repair on ${repairSelected} flagged lesson(s) across selected books? This can incur AI charges. Repaired lessons remain unapproved until checked. Stubborn problems stay in the attention queue.`))return;
    setBusy(kind);setError("");
    try{
      const queued=kind==="start"||kind==="repair";
      const path=queued?"/quest-books/admin/overnight/start":`/quest-books/admin/overnight/${encodeURIComponent(jobId)}/control`;
      await api.post(path,queued?{book_ids:(kind==="repair"?repairBooks:generateBooks).map(b=>b.id),
        mode:kind==="repair"?"repair":"generate",auto_approve:kind==="start"&&autoApprove}:{action:kind,...options});
      await load();
      toast.success(kind==="start"?"Generation started; new book chapter plans will be added automatically.":kind==="repair"?
        "Repair watch started; newly flagged lessons will be added automatically.":kind==="pause"?
        "Queue paused after the current lesson.":kind==="resume"?"Queue resumed.":kind==="stop"?
        "Queue stopped. Finished lessons are safe.":kind==="set_auto_approve"?
        options.enabled?"Auto-approval enabled for future clean lessons.":"Auto-approval disabled for future lessons.":kind==="set_auto_follow"?
        options.enabled?"Automatic pickup enabled.":"Automatic pickup disabled.":"Failed lessons queued for retry.");
    }catch(e){const msg=apiErrorMessage(e,"Could not update the overnight queue.");setError(msg);toast.error(msg);}
    finally{setBusy("");}
  };
  return <section className="rounded-2xl border border-violet-300 bg-white p-4 sm:p-5 space-y-4" data-testid="quest-overnight-queue">
    <div className="space-y-1">
      <h3 className="font-bold text-violet-950 text-lg">Live Lesson Production Queue</h3>
      <p className="text-sm text-slate-700">Make missing lessons, approve AI-cleared drafts, and bulk-repair the flagged ones across all your uploaded books. Queued work continues on the server while you use the rest of Side-Quest or close the browser. New chapter plans and flagged drafts are picked up automatically when queue watching is on. If the AI allowance temporarily runs out, the queue retries when available.</p>
      <p className="text-xs text-slate-600">Books need a saved chapter plan. Generation and repair share a dedicated one-minute server cycle (up to 60 attempts an hour). Actual progress depends on AI availability and retries. You can pause either queue. Nothing is published automatically.</p>
    </div>
    {!data && !error && <p role="status" className="text-sm">Finding missing lessons…</p>}
    {error && <p role="alert" className="text-sm text-red-800">{error} <button type="button" onClick={()=>void load()} className="underline">Reload</button></p>}
    {data && <>
      <p className="text-sm font-bold text-slate-900" data-testid="quest-overnight-total">
        {remaining} missing lesson{remaining===1?"":"s"} across {data.books.filter(b=>b.missing>0).length} book{data.books.filter(b=>b.missing>0).length===1?"":"s"}
      </p>
      <div className="space-y-3" data-testid="quest-live-queue">
        {activeJobs.length===0&&<p className="text-sm text-stone-600">No queue is running. Start generation or repairs below to keep processing in the background.</p>}
        {activeJobs.map(job=>{
          const counts=job.counts||{};
          const finished=Number(counts.generated||0)+Number(counts.skipped||0)+Number(counts.failed||0);
          const waiting=Number(counts.pending||0),processing=Number(counts.processing||0);
          const title=job.kind==="repair"?"Repair":"Generation";
          return <div key={job.id} className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3" data-testid="quest-overnight-status">
            <div className="flex justify-between gap-2 flex-wrap items-center">
              <p className="font-bold text-violet-950">{title} queue: {job.status==="running"&&!waiting&&!processing&&job.auto_follow?"watching for new work":job.status.replaceAll("_"," ")}</p>
              <span className="text-sm font-semibold text-violet-900">{finished} of {job.total} processed</span>
            </div>
            <div className="h-2 bg-violet-200 rounded-full overflow-hidden" role="progressbar"
              aria-valuemin={0} aria-valuemax={job.total} aria-valuenow={finished}>
              <div className="bg-violet-800 h-full" style={{width:`${job.total?Math.min(100,100*finished/job.total):0}%`}} />
            </div>
            <p className="text-sm text-violet-950">{Number(counts.generated||0)} {job.kind==="repair"?"repaired":"new"} · {Number(counts.skipped||0)} skipped · {processing} processing · {Number(counts.failed||0)} failed · {waiting} waiting</p>
            <div className="rounded-lg bg-white border border-violet-100 p-3 space-y-1.5 text-sm text-slate-800" aria-live="polite" data-testid="quest-live-activity">
              <p className="font-bold text-violet-950">What is happening now?</p>
              {job.current?<p><strong>Processing:</strong> {job.current.book_title} · {job.current.chapter_title} (attempt {job.current.attempts})</p>
                :job.status==="paused"?<p>Paused. No new lessons are being started.</p>
                :job.last_error?<p className="text-amber-900">{job.last_error}</p>
                :waiting>0?<p>Between lessons. The next server cycle will pick up another task.</p>
                :<p>All currently queued tasks are processed. Watching for new chapter plans and flagged lessons.</p>}
              {job.recent&&<p><strong>Most recent:</strong> {job.recent.book_title} · {job.recent.chapter_title} ({job.recent.status}{job.recent.last_error?", "+job.recent.last_error:""}) {timeOf(job.recent.updated_at)}</p>}
              {job.next&&<p><strong>Up next:</strong> {job.next.book_title} · {job.next.chapter_title}</p>}
              {!job.current&&!job.next&&job.status==="running"&&job.auto_follow&&<p className="text-xs text-violet-900">The queue checks for new book chapters and repairable drafts about every two minutes.</p>}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-800">
              {job.kind==="generate"&&<label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" data-testid="quest-live-auto-approve" checked={!!job.auto_approve} disabled={!!busy}
                  onChange={e=>void action("set_auto_approve",job.id,{enabled:e.target.checked})}/>
                <span><strong>Auto-approve future AI-cleared lessons</strong> (not existing drafts)</span>
              </label>}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" data-testid="quest-live-auto-follow" checked={!!job.auto_follow} disabled={!!busy}
                  onChange={e=>void action("set_auto_follow",job.id,{enabled:e.target.checked})}/>
                <span>Automatically add new {job.kind==="repair"?"flagged lessons":"book chapter plans"}</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.status==="running"&&<button type="button" disabled={!!busy} onClick={()=>void action("pause",job.id)}
                className="rounded-lg border border-violet-600 px-3 py-1.5 text-xs font-bold">Pause {job.kind==="repair"?"repairs":"generation"}</button>}
              {job.status==="paused"&&<button type="button" disabled={!!busy} onClick={()=>void action("resume",job.id)}
                className="rounded-lg bg-violet-800 text-white px-3 py-1.5 text-xs font-bold">Resume queue</button>}
              <button type="button" disabled={!!busy} onClick={()=>void action("stop",job.id)}
                className="rounded-lg border border-red-700 text-red-900 px-3 py-1.5 text-xs font-bold" data-testid="quest-stop-queue">Stop {job.kind==="repair"?"repairs":"generation"}</button>
              {Number(counts.failed||0)>0&&
                <button type="button" disabled={!!busy} onClick={()=>void action("retry_failed",job.id)}
                  className="rounded-lg border border-amber-700 px-3 py-1.5 text-xs font-bold">Retry failed lessons</button>}
              <button type="button" disabled={!!busy} onClick={()=>void load()}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-bold">Refresh progress</button>
            </div>
            <details className="text-xs text-violet-950"><summary className="cursor-pointer font-semibold">Progress by book</summary>
              <ul className="space-y-1 mt-2">
                {(job.books||[]).map(b=><li key={b.book_id}><Link className="underline font-semibold" to={`/parent/quest-books/${encodeURIComponent(b.book_id)}?workspace=lessons`}>{b.book_title}</Link>: {b.generated||0} processed, {b.failed||0} failed of {b.total}</li>)}
              </ul>
            </details>
          </div>;
        })}
        {historyJobs.length>0&&<details className="text-xs text-slate-700" data-testid="quest-queue-history">
          <summary className="cursor-pointer font-medium">Past queues ({historyJobs.length}) · completed and stopped runs are hidden from the active view</summary>
          <div className="mt-2 space-y-2">{historyJobs.map(job=><div key={job.id} className="border border-stone-200 rounded-lg p-2">
            {job.kind==="repair"?"Repair":"Generation"}: {job.status.replaceAll("_"," ")} · {job.counts?.generated||0} completed, {job.counts?.failed||0} failed
            {Number(job.counts?.failed||0)>0&&["completed_with_errors","completed"].includes(job.status)&&
              <button type="button" disabled={!!busy} onClick={()=>void action("retry_failed",job.id)} className="ml-2 underline font-semibold">Retry failed</button>}
          </div>)}</div>
        </details>}
      </div>
      {attention.length>0&&<details className="rounded-xl border border-amber-300 p-3 text-sm text-stone-900" data-testid="quest-needs-attention">
        <summary className="cursor-pointer font-bold text-amber-900">Needs attention · {attention.length} recent failed lesson{attention.length===1?"":"s"}</summary>
        <p className="text-xs mt-2">These were not discarded. Retry the failed items using their queue controls or inspect the book plan.</p>
        <ul className="space-y-2 mt-2">{attention.map((f,i)=><li key={`${f.job_id}:${i}`} className="border-b border-stone-100 pb-2">
          <span className="font-semibold">{f.book_title} · {f.chapter_title}</span>
          <span className="block text-xs text-red-900">{f.last_error||"AI task could not be completed."}</span>
        </li>)}</ul>
      </details>}
      <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
        {visibleBooks.map((book)=><label key={book.id} className="flex gap-3 items-center p-3 text-sm cursor-pointer">
          <input type="checkbox" checked={selected.includes(book.id)}
            disabled={!book.has_chapters || (book.missing===0 && !book.repairable && !book.ai_cleared) || !!busy}
            onChange={(e)=>setSelected(prev=>e.target.checked?[...prev,book.id]:prev.filter(id=>id!==book.id))}
            aria-label={`Generate missing lessons in ${book.title}`} />
          <span className="flex-1 min-w-0">
            <span className="font-semibold block text-stone-900">{book.title}</span>
            <span className="text-xs text-stone-600">{book.year_subject} · {book.generated}/{book.total} generated</span>
            <span className="text-xs text-violet-800 block">{book.ai_cleared||0} AI-cleared · {book.repairable||0} need AI repair</span>
            {!book.has_chapters && <span className="text-xs text-amber-800 block">Needs chapter analysis before lessons can be queued</span>}
          </span>
          <span className="text-xs font-bold text-violet-900">{book.missing? `${book.missing} missing` : "Generated"}</span>
        </label>)}
      </div>
      {hiddenCompleted>0&&<p className="text-xs text-slate-600">{hiddenCompleted} completed book{hiddenCompleted===1?"":"s"} hidden from this work list.</p>}
      {(totalSelected>0 || repairSelected>0 || clearedSelected>0) && <div className="rounded-xl border border-violet-200 p-3 space-y-2">
        <p className="font-bold text-violet-950 text-sm">Bulk actions for selected books</p>
        <p className="text-xs text-slate-700">Generation and repairs can both be queued. They take turns, one lesson attempt per minute, independently of your browser. Recheck and approve repaired lessons when they pass.</p>
        {!generationActive && totalSelected>0 && <label className="flex items-start gap-2 rounded-lg bg-stone-50 p-2 text-xs text-slate-800">
          <input type="checkbox" checked={autoApprove} onChange={e=>setAutoApprove(e.target.checked)}
            disabled={!!busy} data-testid="quest-overnight-auto-approve" />
          <span>Automatically approve newly generated AI-cleared lessons (zero warnings and all required content). Existing lessons are untouched. Any lesson with an issue stays a draft for bulk repair. This is not publication.</span>
        </label>}
        <div className="flex flex-wrap items-center gap-2">
          {!generationActive && totalSelected>0 && <button type="button" disabled={!!busy} onClick={()=>void action("start")}
            className="rounded-lg bg-violet-800 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
            data-testid="quest-start-overnight">Generate {totalSelected} missing lessons</button>}
          {clearedSelected>0 && <button type="button" disabled={!!busy} onClick={()=>void approveCleared()}
            className="rounded-lg border border-emerald-700 px-3 py-2 text-sm font-bold text-emerald-950 disabled:opacity-50"
            data-testid="quest-approve-across-books" >Approve {clearedSelected} existing AI-cleared drafts</button>}
          {!repairActive && repairSelected>0 && <button type="button" disabled={!!busy} onClick={()=>void action("repair")}
            className="rounded-lg border border-amber-700 px-3 py-2 text-sm font-bold text-amber-950 disabled:opacity-50"
            data-testid="quest-repair-across-books">Repair all {repairSelected} flagged lessons</button>}
        </div>
      </div>}


    </>}
  </section>;
}
