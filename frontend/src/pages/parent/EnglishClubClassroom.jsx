import React,{useEffect,useState} from "react";
import LiveActivity from "./LiveActivity";
import EnglishClubVideo from "./EnglishClubVideo";
import EnglishClubMaterials from "./EnglishClubMaterials";
export default function EnglishClubClassroom({classId,requestId,seatId,client,owner=false,facilitatorGuide}){
 const [access,setAccess]=useState(null),[error,setError]=useState("");
 useEffect(()=>{
  if(owner)return;
  let live=true,pending=false;
  setAccess(null);setError("");
  async function load(){
   if(pending)return;pending=true;
   try{
    const r=await client.get("/family-portal/club-classroom/"+encodeURIComponent(requestId)+"/"+encodeURIComponent(classId));
    const v=r.data??r;
    if(live){setAccess(v.seat_id===seatId?v:null);setError(v.seat_id===seatId?"":"This workshop is unavailable.");}
   }catch(e){if(live){setAccess(null);setError(e.response?.data?.detail||"Classroom access could not be checked.");}}
   finally{pending=false;}
  }
  load();const t=setInterval(load,10000);
  return()=>{live=false;clearInterval(t);};
 },[owner,client,classId,requestId,seatId]);
 const path=owner?"/english-club/classes/"+encodeURIComponent(classId):"/support-guest/requests/"+encodeURIComponent(requestId||"")+"/english-club/"+encodeURIComponent(classId);
 if(!owner&&(!access||!access.in_window))return <section className="paper-card p-4 space-y-2"><h3 className="font-bold">English Club classroom</h3>{error?<p role="alert">{error}</p>:<p role="status">{access?"The classroom is available from ten minutes before the scheduled workshop until it ends.":"Checking your confirmed place…"}</p>}</section>;
 return <section className="space-y-4" aria-label="English Club teaching workspace">
  <p className="text-sm">One workshop, one classroom. A parent or guardian must supervise. Keep identifying information private.</p>
  <EnglishClubVideo key={path} path={path} client={client} owner={owner}/>
  <div className={owner?"grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start":"space-y-4"}><div className="min-w-0 space-y-4">
  {owner&&<EnglishClubMaterials key={"teaching:"+path} path={path} client={client} owner teachingOnly/>}
  <LiveActivity key={"activity:"+path} kind="club" sessionId={classId} requestId={requestId} client={client} owner={owner}/>
  {!owner&&<EnglishClubMaterials key={"resources:"+path} path={path} client={client}/>}
  </div>{owner&&facilitatorGuide&&<aside className="min-w-0">{facilitatorGuide}</aside>}</div>
  {owner&&<p className="text-xs">Prepare shared resources and the backup meeting link on the session preparation page. Group video remains an isolated pilot.</p>}
 </section>;
}
