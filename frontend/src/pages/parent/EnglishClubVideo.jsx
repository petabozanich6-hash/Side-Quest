import React,{useEffect,useState} from "react";
import SupportVideoPanel from "./SupportVideoPanel";
export default function EnglishClubVideo({path,client,owner=false,academy=false}){
 const [state,setState]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function refresh(){try{const r=await client.get(path+"/video");setState(r.data??r);setError("");}catch(e){setState(null);setError(e.response?.data?.detail||e.message||"Could not check the club room.");}}
 useEffect(()=>{let active=true;async function load(){try{const r=await client.get(path+"/video");if(active)setState(r.data??r);}catch(e){if(active){setState(null);setError(e.response?.data?.detail||e.message||"Could not check the club room.");}}}setState(null);setError("");load();const t=setInterval(load,15000);return()=>{active=false;clearInterval(t);};},[path,client]);
 async function close(){if(busy||!window.confirm("End the English Club video room for everyone?"))return;setBusy(true);try{await client.post(path+"/video-close",{confirmed:true});await refresh();}catch(e){setState(s=>s?{...s,open:false}:s);setError(e.response?.data?.detail||e.message||"Closure needs review.");}finally{setBusy(false);}}
 return <div className="rounded-xl border p-3 space-y-2"><h4 className={academy?"font-serif text-xl font-bold text-[#25334c]":"font-semibold"}>{academy?"Meet the author · live room":"English Club classroom"}</h4>{error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}{!state?<p className="text-sm">Checking classroom access…</p>:!state.enabled?<p className="text-sm">The group video pilot is not enabled.</p>:!state.open?<p className="text-sm">{state.status==="closed"?"This session has ended.":owner?"Open the room from ten minutes before the session begins.":"Waiting for the host to open the room. A confirmed paid place is required."}</p>:null}
 {state?.enabled&&<button type="button" className="underline text-sm" onClick={refresh}>Refresh room status</button>}
 {state?.enabled&&state.open&&<SupportVideoPanel path={path} client={client} owner={owner} open={state.open} group/>}
 {owner&&state?.enabled&&state.status==="ready"&&<button type="button" className="rounded-lg border px-3 py-2 text-sm text-rose-800" disabled={busy} onClick={close}>End room for everyone</button>}</div>;
}
