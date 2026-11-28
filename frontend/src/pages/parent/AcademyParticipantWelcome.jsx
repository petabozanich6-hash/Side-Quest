import React,{useState} from "react";
import {AcademyArtwork,academyTrack,academyTracks} from "./WritersAcademyBrand";
const sparks={
 junior:[
 ["A book opens by itself. What falls out?","A tiny crown","A talking leaf","A runaway boot"],
 ["A dragon has a very unusual collection. What is it?","Buttons","Teacups","Lost socks"],
 ["Something is missing from the library. What catches your eye?","A pawprint","A silver key","A torn note"],
 ["Imagine a town where everything floats. What would you tie down first?","My shoes","The bakery","My pet's bed"],
 ["Two doors lead to different adventures. Which would you open?","The tiny door","The cloudy staircase","Invent another"],
 ["Your story is on a bookshop shelf. What mood should the cover promise?","Wonder","Mystery","Laughter"]
 ],
 teen:[
 ["A railway ticket says Tomorrow. What kind of story might it promise?","Mystery","Speculative fiction","Comedy"],
 ["A character has to choose between two promises. What matters most?","Loyalty","Truth","Freedom"],
 ["A city disappears beneath the tide every day. Which rule would you explore?","Travel","Trade","Memory"],
 ["An abandoned room contains one unexpected detail. Which suggests a story?","A stopped clock","A torn message","A worn key"],
 ["A knight is sent to rescue a dragon. How would you transform the premise?","Change viewpoint","Change genre","Change the goal"],
 ["An opening scene feels flat. Which effect would you strengthen?","Atmosphere","Momentum","Voice"]
 ]};
export function participantSpark(track,sequence){return sparks[track]?.[sequence-1]||null;}
export default function AcademyParticipantWelcome({access,onVideo,onActivity,onResources}){
 const track=academyTrack(access.programme_id),palette=academyTracks[track],spark=participantSpark(track,access.sequence);
 const [choice,setChoice]=useState(""),[dismiss,setDismiss]=useState(false);
 const date=new Date(access.start_at).toLocaleString("en-AU",{dateStyle:"medium",timeStyle:"short",timeZone:"Australia/Sydney"});
 return <section className={"academy-surface academy-track-"+track+" space-y-3"} aria-label="Your Academy workshop">
 <header className="academy-hero"><div className="academy-hero-copy"><p className="academy-wordmark">{palette.label}</p><p className="academy-endorsement">Writers’ Academy by Side-Quest Learning</p><h2>{access.topic}</h2><p className="academy-kicker">Chapter {access.sequence} of 6</p><p>{track==="junior"?"Your next adventure awaits.":"A new creative challenge awaits."}</p><p className="text-xs">{date} · Sydney time</p></div><AcademyArtwork track={track}/></header>
 <div className="academy-journey" aria-label={"Chapter "+access.sequence+" of six"}>{Array.from({length:6},(_,i)=><div key={i} className={i+1===access.sequence?"academy-journey-current":""} aria-current={i+1===access.sequence?"step":undefined}><span>{i+1}</span><small>{i+1===access.sequence?"Today":"Chapter"}</small></div>)}</div>
 {spark&&!dismiss&&<section className="academy-warmup"><p className="academy-kicker">A little imagination before we begin</p><h3>{spark[0]}</h3><div className="academy-warmup-choices">{spark.slice(1).map(v=><button key={v} type="button" aria-pressed={choice===v} onClick={()=>setChoice(v)}>{v}</button>)}</div>{choice&&<p role="status">Imagine what happens next. Keep the idea for yourself or share it when invited.</p>}<p className="text-xs">Just for fun. This choice is not saved, scored or sent to anyone.</p><button type="button" className="underline text-sm" onClick={()=>setDismiss(true)}>Skip or close warm-up</button></section>}
 <nav className="academy-room-nav" aria-label="Workshop spaces"><button type="button" onClick={onVideo}><strong>Meet the author</strong><small>Live video room</small></button><button type="button" onClick={onActivity}><strong>Story workshop</strong><small>Live creative activities</small></button><button type="button" onClick={onResources}><strong>Reading room</strong><small>Story sparks and resources</small></button><a href="/family-portal?page=services&service=academy-journal" target="_blank" rel="noopener noreferrer"><strong>My writing journal</strong><small>Opens a separate tab</small></a></nav>
 <p className="text-xs">A parent or guardian must supervise. You can pass on any creative prompt or ask for help. Keep names, addresses and other identifying information out of shared writing.</p>
 </section>;
}
