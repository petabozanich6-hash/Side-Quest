import React, { useEffect, useState } from "react";
import { adminApi, errorText } from "../../../lib/adminApi";
import { Alert, Button, Card, fmtDate, GREEN } from "./ui";
import { Mail, Send, RefreshCw, ShieldCheck } from "lucide-react";

const newKey=()=>crypto.randomUUID();

export default function HqAnnouncements() {
  const [overview,setOverview]=useState(null);
  const [kind,setKind]=useState("service");
  const [subject,setSubject]=useState("");
  const [body,setBody]=useState("");
  const [preview,setPreview]=useState(null);
  const [confirmation,setConfirmation]=useState("");
  const [nonPromo,setNonPromo]=useState(false);
  const [consent,setConsent]=useState(false);
  const [key,setKey]=useState(newKey);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const refresh=async()=>{
    const result=await adminApi.get("/announcements");
    setOverview(result);
    return result;
  };
  useEffect(()=>{
    refresh().catch(e=>setError(errorText(e,"Could not load announcements.")));
    const timer=setInterval(()=>refresh().catch(()=>{}),60000);
    return ()=>clearInterval(timer);
  },[]);

  const edit=(field,value)=>{
    if(field==="kind")setKind(value);
    if(field==="subject")setSubject(value);
    if(field==="body")setBody(value);
    setPreview(null);setConfirmation("");setMessage("");setKey(newKey());
  };
  const makePreview=async()=>{
    setBusy(true);setError("");setMessage("");
    try {setPreview(await adminApi.post("/announcements/preview",{kind,subject,body}));}
    catch(e){setError(errorText(e));}
    finally{setBusy(false);}
  };
  const send=async()=>{
    if(!preview||busy)return;
    setBusy(true);setError("");setMessage("");
    try{
      const result=await adminApi.post("/announcements",{
        kind,subject,body,idempotency_key:key,expected_recipients:preview.recipients,
        confirmation,non_promotional_confirmed:kind==="service"&&nonPromo,
        consent_confirmed:kind==="optional"&&consent
      });
      setMessage("Announcement queued. "+result.delivery+" You'll see real sending counts in the history below.");
      setPreview(null);setConfirmation("");setSubject("");setBody("");setNonPromo(false);setConsent(false);setKey(newKey());
      await refresh();
    }catch(e){setError(errorText(e,"Could not queue this announcement. No recipient was added."));}
    finally{setBusy(false);}
  };
  const cancel=async id=>{
    if(!window.confirm("Cancel all unsent emails in this announcement? Already sent messages cannot be recalled."))return;
    setBusy(true);setError("");
    try{await adminApi.post("/announcements/"+encodeURIComponent(id)+"/cancel");await refresh();}
    catch(e){setError(errorText(e));}finally{setBusy(false);}
  };
  return <div className="space-y-5" data-testid="hq-announcements">
    <header>
      <h2 className="font-display text-2xl font-bold flex gap-2 items-center" style={{color:GREEN}}><Mail/>Special email announcements</h2>
      <p className="text-sm text-stone-700 mt-1">Only send important occasional news. No imported email lists, child accounts, or automatic campaigns.</p>
    </header>
    {!overview?.email_configured&&<Alert tone="warning">Cloudflare Email Sending isn't configured on this Worker. You can prepare announcements, but sending is disabled.</Alert>}
    <div className="grid sm:grid-cols-2 gap-3">
      <Card title="Participating parents"><p className="text-2xl font-bold text-emerald-950">{overview?.service_recipients??"—"}</p><p className="text-xs text-stone-600">Eligible active parent accounts for essential non-promotional service notices</p></Card>
      <Card title="Optional email subscribers"><p className="text-2xl font-bold text-emerald-950">{overview?.opted_in_recipients??"—"}</p><p className="text-xs text-stone-600">Parents who expressly opted in to occasional news. Existing families aren't subscribed automatically.</p></Card>
    </div>
    <Card title="Compose an announcement" testid="hq-announcement-compose">
      <div className="space-y-4">
        <label className="block text-sm font-semibold">Type
          <select className="mt-1 block w-full rounded-xl border border-stone-300 p-3 font-normal bg-white"
            value={kind} onChange={e=>edit("kind",e.target.value)} data-testid="hq-announcement-kind">
            <option value="service">Important service notice (non-promotional, participating parents)</option>
            <option value="optional">Optional special news (opted-in parents only)</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">Email subject
          <input className="mt-1 block w-full rounded-xl border border-stone-300 p-3 font-normal" maxLength={140}
            placeholder="An important Side-Quest update" value={subject} onChange={e=>edit("subject",e.target.value)} data-testid="hq-announcement-subject"/>
          <span className="text-xs text-stone-500">{subject.length}/140 · at least 6</span>
        </label>
        <label className="block text-sm font-semibold">Message (plain text)
          <textarea rows={8} className="mt-1 block w-full rounded-xl border border-stone-300 p-3 font-normal"
            value={body} maxLength={6000} onChange={e=>edit("body",e.target.value)}
            placeholder="What's happening, what parents need to know, and what they should do, if anything…"
            data-testid="hq-announcement-body"/>
          <span className="text-xs text-stone-500">{body.length}/6000 · at least 20</span>
        </label>
        <Button onClick={makePreview} disabled={busy||subject.trim().length<6||body.trim().length<20}
          data-testid="hq-announcement-preview">{busy?"Checking…":"Preview and check recipients"}</Button>
        {preview&&<div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 space-y-3" data-testid="hq-announcement-send-confirm">
          <div className="font-bold text-emerald-950 flex items-center gap-2"><ShieldCheck size={18}/> Final check — not yet sent</div>
          <p className="text-sm"><strong>Recipient count:</strong> {preview.recipients} eligible parents.</p>
          <p className="text-xs text-stone-600">Each parent receives their own email, with Side-Quest branding, contact details and an optional-news unsubscribe link. Delivery is paced in small batches, so this is not instantaneous.</p>
          <div className="rounded-xl bg-white border border-stone-200 p-4">
            <p className="text-xs font-bold uppercase text-stone-500">Email preview</p>
            <p className="font-bold mt-2 break-words">{preview.subject}</p>
            <p className="whitespace-pre-wrap text-sm text-stone-700 mt-2 break-words">{preview.body}</p>
          </div>
          {kind==="service"
            ?<label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={nonPromo} onChange={e=>setNonPromo(e.target.checked)} data-testid="hq-announcement-service-ack" className="mt-1"/><span>I confirm this is genuinely about the existing service and contains <strong>no advertising or promotion</strong>. Commercial updates must use the opted-in option.</span></label>
            :<label className="flex gap-2 items-start text-sm"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} data-testid="hq-announcement-consent-ack" className="mt-1"/><span>Send this only to parents who have explicitly opted in to optional news.</span></label>}
          <label className="block text-sm font-semibold">To confirm, type exactly: <strong>{preview.confirmation}</strong>
            <input className="mt-1 w-full rounded-xl border border-stone-300 p-3 font-normal" value={confirmation}
              onChange={e=>setConfirmation(e.target.value)} autoComplete="off" data-testid="hq-announcement-confirm-phrase"/>
          </label>
          <Button disabled={busy||!preview.email_configured||preview.recipients===0||confirmation!==preview.confirmation||
            !(kind==="service"?nonPromo:consent)} onClick={send} data-testid="hq-announcement-send"><Send size={15} className="inline mr-1"/>{busy?"Queuing…":"Send to "+preview.recipients+" parents"}</Button>
        </div>}
        {error&&<Alert>{error}</Alert>}
        {message&&<Alert tone="success">{message}</Alert>}
      </div>
    </Card>
    <Card title="Announcement history">
      <div className="flex justify-end mb-3"><Button tone="plain" onClick={()=>refresh().catch(e=>setError(errorText(e)))}
        data-testid="hq-announcements-refresh"><RefreshCw size={14} className="inline mr-1"/>Refresh counts</Button></div>
      {!overview?.broadcasts?.length?<p className="text-sm text-stone-600">No special announcements sent yet.</p>:
        <div className="space-y-3">{overview.broadcasts.map(a=><div key={a.id} className="rounded-xl border border-stone-200 bg-white p-4" data-testid={"hq-announcement-"+a.id}>
          <div className="flex gap-3 flex-wrap items-start justify-between"><div><p className="font-bold text-emerald-950">{a.subject}</p>
            <p className="text-xs text-stone-500">{a.kind==="service"?"Service notice":"Optional news"} · {fmtDate(a.created_at)} · {a.status}</p></div>
            {(a.status==="queued"||a.status==="sending")&&<Button tone="plain" disabled={busy}
              onClick={()=>cancel(a.id)} data-testid={"hq-announcement-cancel-"+a.id}>Stop remaining emails</Button>}</div>
          <p className="text-sm text-stone-700 mt-3">{a.recipients} queued originally · <strong>{a.sent||0} accepted by provider</strong> · {a.queued||0} waiting · {a.sending||0} sending · {a.failed||0} failed · {a.skipped||0} skipped</p>
          {a.failed>0&&<p className="text-xs text-amber-900 mt-1">Failed delivery attempts aren't retried automatically, to avoid sending the same email twice.</p>}
        </div>)}</div>}
    </Card>
    <p className="text-xs text-stone-600">Cloudflare Email Service controls the actual delivery limits. A successful provider handoff doesn't guarantee the message reaches every inbox. Never include a sales offer in an essential service notice.</p>
  </div>;
}