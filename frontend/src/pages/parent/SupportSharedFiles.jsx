import React,{useState} from "react";
import {saveSupportFile} from "../../lib/supportFileDownload";
export default function SupportSharedFiles({path,client}){
 const [files,setFiles]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function run(fn){if(busy)return;setBusy(true);setError("");try{await fn();}catch(e){setError(e.response?.data?.detail||e.message||"Resource unavailable.");}finally{setBusy(false);}}
 return <section className="space-y-2"><button type="button" className="underline font-semibold text-sm" disabled={busy} onClick={()=>run(async()=>setFiles((await client.get(path+"/files")).data.files))}>View shared learning materials</button>{error&&<p role="alert" className="text-rose-800 text-sm">{error}</p>}{files?.length===0&&<p className="text-sm">No materials shared yet.</p>}{files?.map(f=><div key={f.id} className="border rounded-lg p-2"><strong>{f.title}</strong> <button type="button" disabled={busy} className="underline text-sm" onClick={()=>run(async()=>saveSupportFile(await client.get(path+"/files/"+f.id+"/download")))}>Download for offline use</button></div>)}</section>;
}
