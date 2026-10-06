import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, fileUrl } from "../../lib/api";
import { toast } from "sonner";
import { Upload, Send, HelpCircle, Loader2, Image as ImgIcon, Mic, Film, FileText, ArrowLeft, Printer } from "lucide-react";

export default function ChildLesson() {
  const { aid } = useParams();
  const nav = useNavigate();
  const [a, setA] = useState(null);
  const [response, setResponse] = useState("");
  const [reflection, setReflection] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [stuckOpen, setStuckOpen] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.get(`/assignments/${aid}`).then(r => {
      setA(r.data);
      if (r.data.status === "not_started") api.put(`/assignments/${aid}/status?status=opened`).catch(()=>{});
    });
  }, [aid]);

  const uploadFile = async (file) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file); fd.append("context", "submission");
    try {
      const { data } = await api.post("/files/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFiles(prev => [...prev, data]);
      toast.success("Uploaded");
    } catch (err) { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const submit = async () => {
    if (!response.trim() && files.length === 0) {
      toast.error("Add a written response or upload your work");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/submissions", { assignment_id: aid, response_text: response, reflection, file_ids: files.map(f=>f.id), needs_help: needsHelp });
      toast.success(needsHelp ? "Sent for help" : "Submitted for review");
      nav("/child");
    } catch (err) { toast.error("Submit failed"); }
    finally { setSubmitting(false); }
  };

  const printLesson = () => {
    const l = a.lesson; const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${l.title}</title><style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 20px;}h1{font-size:22px;}h2{font-size:14px;text-transform:uppercase;letter-spacing:0.05em;color:#555;margin-top:20px;}p,li{line-height:1.6;}</style></head><body><h1>${l.title}</h1><p>Stage ${l.stage} · ${l.learning_area}</p><h2>Learning intention</h2><p>${l.learning_intention}</p><h2>Success criteria</h2><ul>${(l.success_criteria||[]).map(c=>`<li>${c}</li>`).join("")}</ul><h2>Explicit teaching</h2><p>${(l.explicit_teaching||"").replace(/\n/g,"<br/>")}</p><h2>Worked example</h2><p>${l.worked_example||""}</p><h2>Independent task</h2><p>${l.independent_task||""}</p><h2>Offline alternative</h2><p>${l.offline_alternative||""}</p><br/><br/><div style="border-top:1px dashed #333;padding-top:10px;">My response:<br/><br/><br/><br/></div></body></html>`);
    w.document.close(); w.print();
  };

  if (!a) return <div className="text-slate-500">Loading…</div>;
  const l = a.lesson || {};
  const supportBanner = a.support_level === "red"
    ? { cls: "bg-rose-50 border-rose-200 text-rose-900", text: "Red zone — wait for a grown-up before starting" }
    : a.support_level === "yellow"
    ? { cls: "bg-amber-50 border-amber-200 text-amber-900", text: "Yellow — try it, then ask for help if you get stuck" }
    : { cls: "bg-emerald-50 border-emerald-200 text-emerald-900", text: "Green — have a go on your own" };

  return (
    <div className="space-y-5 animate-in" data-testid="child-lesson">
      <button onClick={()=>nav("/child")} className="text-sm font-semibold opacity-75 hover:opacity-100 flex items-center gap-1" data-testid="back-home"><ArrowLeft size={14}/> Back</button>

      <header className="rounded-3xl bg-white border border-slate-200 p-6">
        <div className="text-xs font-mono opacity-60">{l.stage} · {l.learning_area}</div>
        <h1 className="font-display text-3xl font-bold mt-1">{l.title}</h1>
        <div className={`mt-4 rounded-xl border px-4 py-2 text-sm ${supportBanner.cls}`} data-testid="support-banner">{supportBanner.text}</div>
      </header>

      <Step n="1" title="What am I learning?"><p className="text-base">{l.learning_intention}</p></Step>
      <Step n="2" title="How I'll know I've got it">
        <ul className="list-disc pl-5 space-y-1">{(l.success_criteria||[]).map((c,i)=><li key={i}>{c}</li>)}</ul>
      </Step>
      <Step n="3" title="What I need">
        <p className="text-sm">{(l.materials||[]).join(", ") || "Nothing special"}</p>
      </Step>
      {l.key_vocabulary?.length > 0 && <Step n="4" title="Key words">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">{l.key_vocabulary.map((v,i)=><li key={i} className="rounded-lg bg-slate-50 border border-slate-200 p-2">{v}</li>)}</ul>
      </Step>}
      <Step n="5" title="Let's learn">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">{l.explicit_teaching}</div>
      </Step>
      {l.worked_example && <Step n="6" title="Example"><div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-sm">{l.worked_example}</div></Step>}
      {l.guided_practice && <Step n="7" title="Try with me"><p className="text-sm">{l.guided_practice}</p></Step>}
      <Step n="8" title="My task">
        <p className="text-base">{l.independent_task}</p>
        {l.response_prompt && <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm"><strong>Respond to:</strong> {l.response_prompt}</div>}
      </Step>

      <Step n="9" title="My response">
        <textarea rows={5} value={response} onChange={e=>setResponse(e.target.value)} placeholder="Type your answer here… (or upload a photo of your paper work below)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base" data-testid="response-text"/>
      </Step>

      <Step n="10" title="Upload my work">
        <input ref={fileRef} type="file" accept="image/*,audio/*,video/*,application/pdf" onChange={e=>e.target.files[0] && uploadFile(e.target.files[0])} className="hidden" data-testid="file-input"/>
        <button onClick={()=>fileRef.current.click()} disabled={uploading} className="rounded-lg border-2 border-dashed border-slate-300 w-full p-6 flex flex-col items-center gap-2 hover:border-slate-500" data-testid="upload-btn">
          {uploading ? <Loader2 className="animate-spin"/> : <Upload size={20}/>}
          <span className="text-sm font-semibold">{uploading ? "Uploading…" : "Tap to add photo, audio, video or PDF"}</span>
          <span className="text-xs opacity-60">Great for paper work, drawings, recordings</span>
        </button>
        {files.length > 0 && (
          <div className="mt-3 grid grid-cols-3 md:grid-cols-5 gap-2">
            {files.map(f => (
              <div key={f.id} className="rounded-lg border border-slate-200 overflow-hidden">
                {f.content_type?.startsWith("image/")
                  ? <img src={fileUrl(f.id)} alt={f.original_filename} className="w-full h-20 object-cover"/>
                  : <div className="h-20 bg-slate-50 grid place-items-center text-slate-500">{f.content_type?.startsWith("audio/") ? <Mic size={20}/> : f.content_type?.startsWith("video/") ? <Film size={20}/> : <FileText size={20}/>}</div>}
                <div className="p-1 text-[10px] truncate">{f.original_filename}</div>
              </div>
            ))}
          </div>
        )}
      </Step>

      <Step n="11" title="Reflect">
        <textarea rows={3} value={reflection} onChange={e=>setReflection(e.target.value)} placeholder={l.reflection_prompt || "What did you learn? What was tricky?"} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" data-testid="reflection-text"/>
      </Step>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={needsHelp} onChange={e=>setNeedsHelp(e.target.checked)} className="mt-1 h-5 w-5" data-testid="needs-help"/>
          <span className="text-sm">I need help from a grown-up before I finish this.</span>
        </label>
        <div className="flex items-center gap-3">
          <button onClick={submit} disabled={submitting} className="rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2" data-testid="submit-work">
            {submitting ? <><Loader2 size={16} className="animate-spin"/> Sending…</> : <><Send size={14}/> {needsHelp ? "Send for help" : "Submit for review"}</>}
          </button>
          <button onClick={()=>setStuckOpen(true)} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold flex items-center gap-2" data-testid="stuck-btn"><HelpCircle size={14}/> I'm stuck</button>
          <button onClick={printLesson} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold flex items-center gap-2" data-testid="print-btn"><Printer size={14}/> Print</button>
        </div>
      </div>

      {stuckOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setStuckOpen(false)}>
          <div onClick={e=>e.stopPropagation()} className="w-full max-w-sm rounded-3xl bg-white p-6" data-testid="stuck-modal">
            <h3 className="font-display text-xl font-bold mb-3">When you feel stuck</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Read the instructions again, slowly.</li>
              <li>Look at the example.</li>
              <li>Check the key words.</li>
              <li>Try just the first step.</li>
              <li>Tick "I need help" and submit.</li>
              <li>Skip to the next part if you can.</li>
              <li>Ask a grown-up when they're free.</li>
            </ol>
            <button onClick={()=>setStuckOpen(false)} className="mt-4 w-full rounded-full bg-slate-900 text-white py-2 text-sm font-semibold">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}

const Step = ({ n, title, children }) => (
  <section className="rounded-2xl bg-white border border-slate-200 p-5" data-testid={`step-${n}`}>
    <div className="text-xs font-mono opacity-60">Step {n}</div>
    <h2 className="font-display text-lg font-semibold mt-0.5 mb-3">{title}</h2>
    <div className="text-slate-800">{children}</div>
  </section>
);
