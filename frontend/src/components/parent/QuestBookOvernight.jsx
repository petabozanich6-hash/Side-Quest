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
    const interval=setInterval(()=>{void load();},30000);
    return ()=>{mounted.current=false;clearInterval(interval);};
  },[load]);
  const chosen=(data?.books||[]).filter((b)=>selected.includes(b.id) && b.has_chapters);
  const generateBooks=chosen.filter((b)=>b.missing>0);
  const repairBooks=chosen.filter((b)=>b.repairable>0);
  const totalSelected=generateBooks.reduce((n,b)=>n+b.missing,0);
  const repairSelected=repairBooks.reduce((n,b)=>n+b.repairable,0);
  const clearedSelected=chosen.reduce((n,b)=>n+(b.ai_cleared||0),0);
  const remaining=(data?.books||[]).reduce((n,b)=>n+b.missing,0);
  const job=data?.job;
  const counts=job?.counts||{};
  const done=Number(counts.generated||0)+Number(counts.skipped||0)+Number(counts.failed||0);
  const active=["running","paused","building"].includes(job?.status);
  const approveCleared=async()=>{
    if(!clearedSelected || active || !!busy)return;
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
  const action=async(kind)=>{
    if((kind==="start" || kind==="repair") && !window.confirm(kind==="start"
      ? `Queue ${totalSelected} missing lessons for unattended AI generation? Workers AI resources may incur charges. Existing lessons remain untouched. ${autoApprove?"New AI-cleared lessons will be approved automatically; flagged ones stay Draft.":"New lessons stay Draft until reviewed."} Nothing is published. The queue can be paused.`
      : `Run AI repair on ${repairSelected} flagged lesson(s) across selected books? This can incur AI charges. Repaired lessons remain unapproved until checked. Stubborn problems stay in the attention queue.`))return;
    setBusy(kind);setError("");
    try{
      const queued=kind==="start"||kind==="repair";
      const path=queued?"/quest-books/admin/overnight/start":`/quest-books/admin/overnight/${encodeURIComponent(job.id)}/control`;
      await api.post(path,queued?{book_ids:(kind==="repair"?repairBooks:generateBooks).map(b=>b.id),
        mode:kind==="repair"?"repair":"generate",auto_approve:kind==="start"&&autoApprove}:{action:kind});
      await load();
      toast.success(kind==="start"?"Missing lessons queued. You can close your browser.":kind==="repair"?
        "Bulk AI repair queued. Each lesson is processed independently.":kind==="pause"?
        "Queue paused after the current lesson.":kind==="resume"?"Queue resumed.":"Failed lessons queued for retry.");
    }catch(e){const msg=apiErrorMessage(e,"Could not update the overnight queue.");setError(msg);toast.error(msg);}
    finally{setBusy("");}
  };
  return <section className="rounded-2xl border border-violet-300 bg-white p-4 sm:p-5 space-y-4" data-testid="quest-overnight-queue">
    <div className="space-y-1">
      <h3 className="font-bold text-violet-950 text-lg">Overnight Lesson Queue</h3>
      <p className="text-sm text-slate-700">Make missing lessons, approve AI-cleared drafts, and bulk-repair the flagged ones across all your uploaded books. Queued work runs on the server even with your browser closed.</p>
      <p className="text-xs text-slate-600">Books need a saved chapter plan. Generation and repair process one lesson per five-minute server cycle; large collections can take several nights. Nothing is published automatically.</p>
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
            disabled={!book.has_chapters || (book.missing===0 && !book.repairable && !book.ai_cleared) || !!busy || active}
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
      {!active && (totalSelected>0 || repairSelected>0 || clearedSelected>0) && <div className="rounded-xl border border-violet-200 p-3 space-y-2">
        <p className="font-bold text-violet-950 text-sm">Bulk actions for selected books</p>
        <p className="text-xs text-slate-700">1. Generate missing lessons. 2. Approve AI-cleared drafts. 3. Repair flagged drafts. Recheck and approve repaired lessons when they pass.</p>
        {totalSelected>0 && <label className="flex items-start gap-2 rounded-lg bg-stone-50 p-2 text-xs text-slate-800">
          <input type="checkbox" checked={autoApprove} onChange={e=>setAutoApprove(e.target.checked)}
            disabled={!!busy} data-testid="quest-overnight-auto-approve" />
          <span>Automatically approve newly generated AI-cleared lessons (zero warnings and all required content). Existing lessons are untouched. Any lesson with an issue stays a draft for bulk repair. This is not publication.</span>
        </label>}
        <div className="flex flex-wrap items-center gap-2">
          {totalSelected>0 && <button type="button" disabled={!!busy} onClick={()=>void action("start")}
            className="rounded-lg bg-violet-800 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
            data-testid="quest-start-overnight">Generate {totalSelected} missing lessons</button>}
          {clearedSelected>0 && <button type="button" disabled={!!busy} onClick={()=>void approveCleared()}
            className="rounded-lg border border-emerald-700 px-3 py-2 text-sm font-bold text-emerald-950 disabled:opacity-50"
            data-testid="quest-approve-across-books">Approve {clearedSelected} AI-cleared lessons</button>}
          {repairSelected>0 && <button type="button" disabled={!!busy} onClick={()=>void action("repair")}
            className="rounded-lg border border-amber-700 px-3 py-2 text-sm font-bold text-amber-950 disabled:opacity-50"
            data-testid="quest-repair-across-books">Repair all {repairSelected} flagged lessons</button>}
        </div>
      </div>}

      {job && <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-3" data-testid="quest-overnight-status">
        <div className="flex justify-between gap-2 flex-wrap items-center">
          <p className="font-bold text-violet-950">{job.kind==="repair"?"Repair":"Generation"} queue: {job.status.replaceAll("_"," ")}</p>
          {job.kind==="generate"&&job.auto_approve&&<p className="text-xs text-emerald-900">Auto-approval is enabled only for new AI-cleared lessons.</p>}
          <span className="text-sm font-semibold text-violet-900">{done} of {job.total} processed</span>
        </div>
        <div className="h-2 bg-violet-200 rounded-full overflow-hidden" role="progressbar"
          aria-valuemin={0} aria-valuemax={job.total} aria-valuenow={done}>
          <div className="bg-violet-800 h-full" style={{width:`${job.total?Math.min(100,100*done/job.total):0}%`}} />
        </div>
        <p className="text-sm text-violet-950">{Number(counts.generated||0)} {job.kind==="repair"?"repaired":"new"} · {Number(counts.skipped||0)} skipped · {Number(counts.processing||0)} processing · {Number(counts.failed||0)} failed · {Number(counts.pending||0)} waiting</p>
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
