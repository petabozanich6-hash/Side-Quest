import React, { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import { MailCheck } from "lucide-react";

export default function AnnouncementPreferences() {
  const [opt,setOpt]=useState(false);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  useEffect(()=>{
    let live=true;
    api.get("/announcements/preferences").then(({data})=>{if(live)setOpt(!!data.optional_announcements);})
      .catch(e=>{if(live)setError(apiErrorMessage(e,"Could not load email preferences"));})
      .finally(()=>{if(live)setLoading(false);});
    return ()=>{live=false;};
  },[]);
  async function save(next){
    setSaving(true);setError("");setNotice("");
    try {
      const {data}=await api.post("/announcements/preferences",{optional_announcements:next});
      setOpt(!!data.optional_announcements);
      setNotice(next?"Subscribed. You'll only receive occasional optional Side-Quest news.":"Unsubscribed from optional Side-Quest news.");
    }catch(e){setError(apiErrorMessage(e,"Could not update preference"));}
    finally{setSaving(false);}
  }
  return <main className="p-4 sm:p-8 lg:p-10 max-w-3xl space-y-5" data-testid="parent-announcement-preferences">
    <header><p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Parent Hub · Email preferences</p>
      <h1 className="font-display text-3xl font-bold mt-2 text-emerald-950 flex items-center gap-3"><MailCheck/>Side-Quest announcements</h1>
      <p className="text-sm text-stone-700 mt-2">You control whether to receive occasional optional email news. No daily marketing or automatic newsletters.</p></header>
    <section className="paper-card p-6 space-y-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={opt} disabled={loading||saving} onChange={e=>save(e.target.checked)}
          className="h-5 w-5 mt-0.5 accent-emerald-800" data-testid="optional-announcements-opt-in"/>
        <span><strong className="block text-emerald-950">Email me occasional optional Side-Quest news</strong>
          <span className="block mt-1 text-sm text-stone-600">Special features, major milestones and community news. Off by default; you can change your mind any time.</span></span>
      </label>
      <p className="text-sm text-stone-600">Essential non-promotional notices about the service you use, such as important outages or account security issues, are separate.</p>
      {error&&<p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-900">{error}</p>}
      {notice&&<p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-950">{notice}</p>}
    </section>
  </main>;
}