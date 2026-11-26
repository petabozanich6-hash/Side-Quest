import React,{useState,useEffect,useRef,useCallback} from "react";
import AppointmentLessonPack from "./AppointmentLessonPack";
import LiveActivity from "./LiveActivity";
import SupportVideoPanel from "./SupportVideoPanel";
import SupportLessonProgress from "./SupportLessonProgress";
import SupportPresentation,{SlideDisplay} from "./SupportPresentation";
import SupportImagePresentation,{PresentedImage} from "./SupportImagePresentation";
const colors=["#163b2c","#2563eb","#b91c1c","#111827"];
const button="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold disabled:opacity-50";
const line=p=>p.map(([x,y])=>(x*800)+","+(y*450)).join(" ");
export default function SupportClassroom({path,client,owner=false,onExit,requestId,sessionId}){
 const [room,setRoom]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[color,setColor]=useState(colors[0]),[draft,setDraft]=useState([]),[text,setText]=useState("");
 const pointer=useRef(null),sending=useRef(false);
 const load=useCallback(async()=>{try{const res=await client.get(path+"/classroom");setRoom(res.data??res);setError("");}catch(e){setRoom(null);setError(e.response?.data?.detail||"Classroom connection interrupted.");}},[path,client]);
 useEffect(()=>{load();const t=setInterval(()=>{if(document.visibilityState==="visible"&&!sending.current&&!pointer.current)load();},4000);return()=>clearInterval(t);},[load]);
 async function send(body){if(sending.current)return;sending.current=true;setBusy(true);try{const r=await client.post(path+"/classroom-board",{...body,revision:room?.revision});await load();if((r.data??r).video_cleanup_pending)setError("Teaching board closed; video cleanup still needs review in Cloudflare.");}catch(e){setError(e.response?.data?.detail||"Board update failed. Refresh before trying again.");}finally{setBusy(false);sending.current=false;}}
 const point=e=>{const r=e.currentTarget.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];};
 function down(e){if(!room?.open||busy||pointer.current)return;e.currentTarget.setPointerCapture(e.pointerId);pointer.current=[point(e)];setDraft(pointer.current);}
 function move(e){if(!pointer.current)return;if(pointer.current.length<160){pointer.current=[...pointer.current,point(e)];setDraft(pointer.current);}}
 function up(){if(!pointer.current)return;const points=pointer.current;pointer.current=null;setDraft([]);if(points.length>1)send({action:"stroke",points,color});}
 return <section className="rounded-xl border border-emerald-900 bg-white p-4 space-y-3" aria-label="Private teaching classroom">
 <header className="flex flex-wrap justify-between gap-2"><h3 className="font-display text-xl font-bold text-emerald-950">Side-Quest classroom</h3><button type="button" className={button} onClick={onExit}>Leave workspace</button></header>
 <p className="text-sm">Teaching workspace. A parent or guardian must supervise. Do not enter identifying child information. Video is available only in the isolated pilot.</p>
 {error&&<p role="alert" className="text-sm text-rose-800">{error} <button type="button" className="underline" onClick={load}>Refresh</button></p>}
 {room&&<p role="status" className="text-sm font-semibold">{room.open?"Classroom open":room.in_window?"Waiting for the tutor to open the classroom":"Classroom available ten minutes before the appointment"}</p>}
 {owner&&room?.in_window&&<button type="button" className={button} disabled={busy} onClick={()=>send({action:room.open?"close":"open",confirmed:true})}>{room.open?"Close classroom":"Open classroom"}</button>}
 {owner&&room&&<SupportLessonProgress key={path} path={path} client={client}/>}
 {room?.open&&room.video_enabled&&<SupportVideoPanel key={path} path={path} client={client} owner={owner} open={room.open}/>}
 {room?.open&&<>{owner&&<AppointmentLessonPack key={path} path={path} classroom send={send} busy={busy}/>}{(owner||requestId&&sessionId)&&<LiveActivity key={path} kind="tutoring" sessionId={sessionId||path.split("/").filter(Boolean).pop()} requestId={requestId} client={client} owner={owner}/>}<SlideDisplay slide={room.board.slide}/><PresentedImage image={room.board.image} client={client} path={path}/>{owner&&<><SupportPresentation send={send} busy={busy}/><SupportImagePresentation send={send} busy={busy}/></>}<div className="whitespace-pre-wrap break-words bg-stone-100 rounded-lg p-3 text-sm">{room.board.text||"Tutor notes will appear here."}</div>
 {owner&&<form className="space-y-2" onSubmit={e=>{e.preventDefault();send({action:"text",text});}}><label className="block text-sm">Teaching notes<textarea value={text} maxLength={2000} onChange={e=>setText(e.target.value)} className="block w-full border rounded-lg p-2"/></label><button type="submit" className={button} disabled={busy}>Share notes</button><button type="button" className={button+" ml-2"} onClick={()=>setText(room.board.text)}>Load current notes</button></form>}
 <div className="flex gap-2 flex-wrap">{colors.map(c=><button type="button" key={c} aria-label={"Pen "+c} aria-pressed={color===c} style={{background:c}} className={"w-10 h-10 rounded-full "+(color===c?"ring-2 ring-offset-2 ring-stone-900":"")} onClick={()=>setColor(c)}/>)}{owner&&<button type="button" className={button} disabled={busy} onClick={()=>{if(window.confirm("Clear the shared board and notes?"))send({action:"clear",confirmed:true});}}>Clear board</button>}</div>
 <svg viewBox="0 0 800 450" className="w-full border border-stone-300 rounded-lg bg-white touch-none" role="img" aria-label="Shared drawing board" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{pointer.current=null;setDraft([]);}}>
 {room.board.strokes.map((s,i)=><polyline key={i} points={line(s.points)} fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>)}{draft.length>0&&<polyline points={line(draft)} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>}
 </svg><p className="text-xs">Draw with a mouse, touch or stylus. Changes appear after refresh. If two edits conflict, retry the drawing.</p></>}
 </section>;
}
