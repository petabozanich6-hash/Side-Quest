import React,{useState,useEffect,useCallback} from "react";
import {adminApi,errorText} from "../../../lib/adminApi";
import SupportClassroom from "../SupportClassroom";
const date=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",weekday:"short",day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
export default function HqSupportCalendar(){
 const [offset,setOffset]=useState(0),[data,setData]=useState(null),[error,setError]=useState(""),[room,setRoom]=useState(null);
 const load=useCallback(async()=>{try{const from=new Date(Date.now()+offset*7*86400000);from.setHours(0,0,0,0);const to=new Date(from);to.setDate(to.getDate()+7);setData(await adminApi.get("/support-calendar",{from:from.toISOString(),to:to.toISOString()}));setError("");}catch(e){setError(errorText(e));}},[offset]);
 useEffect(()=>{load();},[load]);
 return <section className="paper-card p-4 space-y-3"><h3 className="font-display text-xl font-bold">Appointment calendar</h3><p className="text-sm">Both member and standalone bookings, displayed in Sydney time. Includes provisional reservations.</p>
 <div className="flex flex-wrap items-center gap-3"><button className="underline" onClick={()=>{setRoom(null);setOffset(n=>n-1);}}>Previous 7 days</button><button className="underline" onClick={()=>{setRoom(null);setOffset(0);}}>Current 7 days</button><button className="underline" onClick={()=>{setRoom(null);setOffset(n=>n+1);}}>Next 7 days</button><button className="underline" onClick={load}>Refresh</button></div>
 {error&&<p role="alert" className="text-rose-800">{error}</p>}{!data&&!error&&<p role="status">Loading appointments…</p>}
 {data&&<><p className="text-sm">{data.appointments.length} appointment(s){data.truncated?" — more appointments outside display limit":""}</p>{data.appointments.map(o=><div key={o.id} className="border rounded-lg p-3 space-y-1"><strong>{date.format(new Date(o.start_at))} – {date.format(new Date(o.end_at))}</strong><p className="text-sm">{o.parent_name||"Customer"} · {o.channel} · {o.status==="paid"?"Confirmed":o.status.replaceAll("_"," ")}</p><p className="text-sm">{o.scope}</p>{data.classroom_enabled&&o.status==="paid"&&<button className="underline font-bold text-sm" onClick={()=>setRoom(o)}>Open teaching workspace</button>}</div>)}
 <h4 className="font-bold">Overdue invoices (all dates)</h4>{!data.overdue.length&&<p className="text-sm">None awaiting review.</p>}{data.overdue.map(o=><p key={o.id} className="rounded-lg bg-amber-50 p-3 text-sm">{o.reference} · {o.scope} · due {date.format(new Date(o.due_at))}. Check Square before releasing.</p>)}</>}
 {room&&<SupportClassroom key={room.id} owner client={adminApi} path={(room.channel==="guest"?"/support-guests/":"/feedback/")+encodeURIComponent(room.request_id)+"/orders/"+room.id} onExit={()=>setRoom(null)}/>}
 </section>;
}
