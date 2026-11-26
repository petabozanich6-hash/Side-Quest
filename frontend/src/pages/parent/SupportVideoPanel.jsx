import React,{useState,useRef,useEffect} from "react";
import {loadSupportVideoSdk} from "../../lib/supportVideoSdk";
const btn="rounded-lg border px-3 py-2 font-semibold text-sm disabled:opacity-50";
async function leave(m){if(!m)return;try{await m.self.disableScreenShare();}catch{}try{await m.self.disableAudio();}catch{}try{await m.self.disableVideo();}catch{}try{await m.leave();}catch{}}
function Track({video,audio,muted,label}){
 const ref=useRef(null),[blocked,setBlocked]=useState(false);
 useEffect(()=>{const el=ref.current;if(!el)return;const tracks=[video,audio].filter(Boolean);el.srcObject=tracks.length?new MediaStream(tracks):null;if(tracks.length)el.play().then(()=>setBlocked(false)).catch(()=>setBlocked(true));return()=>{el.srcObject=null;};},[video,audio]);
 return <div className="rounded-lg bg-stone-900 text-white p-2"><p className="text-xs mb-1">{label}</p><video ref={ref} autoPlay playsInline muted={muted} className="aspect-video w-full object-contain rounded bg-black" aria-label={label}/>{!video&&<p className="text-xs">Camera or screen off</p>}{blocked&&<button type="button" className={btn} onClick={()=>ref.current?.play().then(()=>setBlocked(false)).catch(()=>setBlocked(true))}>Enable playback</button>}</div>;
}
export default function SupportVideoPanel({path,client,owner,open,group=false}){
 const [meeting,setMeeting]=useState(null),[view,setView]=useState(null),[error,setError]=useState(""),[busy,setBusy]=useState(false),[consent,setConsent]=useState(false);
 const current=useRef(null),generation=useRef(0),joining=useRef(false);
 const snapshot=m=>({self:m.self,peers:m.participants.joined.toArray(),audio:m.self.audioEnabled,video:m.self.videoEnabled,sharing:m.self.screenShareEnabled,joined:m.self.roomJoined,state:m.self.roomState});
 function stop(){generation.current++;const m=current.current;current.current=null;joining.current=false;setMeeting(null);setView(null);setBusy(false);void leave(m);}
 useEffect(()=>{if(!open)stop();return()=>{generation.current++;const m=current.current;current.current=null;void leave(m);};},[open,path]);
 useEffect(()=>{if(!meeting)return;let active=true;const update=()=>{if(!active)return;try{const s=snapshot(meeting);setView(s);if(["kicked","ended","left","rejected"].includes(s.state))stop();}catch{setError("Video state could not be read. Leave and try again.");stop();}};update();const t=setInterval(update,500);return()=>{active=false;clearInterval(t);};},[meeting]);
 async function join(){
  if(!open||!consent||joining.current||current.current)return;
  joining.current=true;const attempt=++generation.current;setBusy(true);setError("");let m;
  try{
   const sdk=await loadSupportVideoSdk();if(attempt!==generation.current)return;
   if(owner)await client.post(path+"/video-prepare",{confirmed:true});
   if(attempt!==generation.current)return;
   const r=await client.post(path+"/video-token",{});if(attempt!==generation.current)return;
   const data=r.data??r;
   if(typeof data.token!=="string"||!data.token)throw new Error("Video access was not granted.");
   m=await sdk.init({authToken:data.token,defaults:{audio:false,video:false}});
   if(attempt!==generation.current){await leave(m);return;}
   current.current=m;await m.join();
   if(attempt!==generation.current){await leave(m);return;}
   setMeeting(m);setView(snapshot(m));
  }catch(e){if(attempt===generation.current){current.current=null;setError(e.response?.data?.detail||e.message||"Could not join video. Check the session status or contact the host.");}await leave(m);}
  finally{if(attempt===generation.current){joining.current=false;setBusy(false);}}
 }
 async function media(action){const m=current.current;if(!m||busy)return;setBusy(true);setError("");try{await m.self[action]();if(current.current===m)setView(snapshot(m));}catch{setError("Media access failed or was declined. Check your device permissions.");}finally{setBusy(false);}}
 if(!open)return null;
 return <section className="rounded-xl border border-stone-300 p-3 space-y-3" aria-label={group?"English Club video":"Private video session"}>
 <h4 className="font-bold">{group?"English Club live room":"Live video"} · staging pilot</h4><p className="text-sm">Camera and microphone start off. No recording. A parent or guardian must remain present. Do not share sensitive information or other applications.</p>
 {error&&<p role="alert" className="text-sm text-rose-800">{error}</p>}
 {!meeting?<><label className="flex gap-2 text-sm"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> {owner?"I am ready to supervise this session and use the approved video presets.":"I am the parent or guardian and will supervise this session."}</label><button type="button" className={btn} disabled={!consent||busy} onClick={join}>{busy?"Connecting…":owner?"Prepare and join video":"Join video"}</button>{busy&&<button type="button" className={btn} onClick={stop}>Cancel connection</button>}</>:<>
 <p role="status" className="text-sm">{view?.joined?"Connected":view?.state==="waitlisted"?"Waiting for admission":"Connecting / reconnecting"}</p>
 <div className="grid sm:grid-cols-2 gap-2">{view&&<Track label="Your camera" video={view.video?view.self.videoTrack:null} muted/>}{view?.peers.map(p=><Track key={p.id} label={group?"Club participant":"Other participant"} video={p.videoEnabled?p.videoTrack:null} audio={p.audioEnabled?p.audioTrack:null} muted={false}/> )}</div>
 {view?.peers.filter(p=>p.screenShareEnabled).map(p=><Track key={"screen-"+p.id} label="Shared screen" video={p.screenShareTracks?.video} audio={p.screenShareTracks?.audio} muted={false}/>)}
 {view?.sharing&&<Track label="Your shared screen" video={view.self.screenShareTracks?.video} muted/>}
 <div className="flex flex-wrap gap-2"><button type="button" className={btn} disabled={busy||!view?.joined} aria-pressed={!!view?.audio} onClick={()=>media(view.audio?"disableAudio":"enableAudio")}>{view?.audio?"Mute microphone":"Enable microphone"}</button><button type="button" className={btn} disabled={busy||!view?.joined} aria-pressed={!!view?.video} onClick={()=>media(view.video?"disableVideo":"enableVideo")}>{view?.video?"Turn camera off":"Enable camera"}</button>{owner&&<button type="button" className={btn} disabled={busy||!view?.joined} onClick={()=>media(view.sharing?"disableScreenShare":"enableScreenShare")}>{view?.sharing?"Stop sharing":"Share screen"}</button>}<button type="button" className={btn+" text-rose-800"} onClick={stop}>Leave video</button></div>
 </>}
 </section>;
}
