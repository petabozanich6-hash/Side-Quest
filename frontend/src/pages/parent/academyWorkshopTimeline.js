// The facilitator chooses when to progress. Timing is advisory and never closes a learner activity.
export function workshopTimeline(preparation,adult=false){
 const sections=String(preparation||"").split(/\n\n+/);
 const ranges=adult?[[0,10,"Welcome and writing warm-up",0],[10,25,"Author demonstration",2],[25,40,"Guided workshop",4],[40,45,"Short break",5],[45,70,"Writing studio",6],[70,83,"Optional feedback",7],[83,90,"Reflection and next step",8]]:[[0,5,"Icebreaker",0],[5,15,"Book chat",1],[15,25,"Author demonstration",2],[25,37,"Create together",4],[37,52,"Independent creative studio",6],[52,57,"Celebrate",8],[57,60,"Book discovery",8]];
 return ranges.map(([from,to,title,slide],i)=>{
  const raw=sections.find(s=>s.startsWith(from+"–"+to+" min | "));
  return {from,to,title,slide,script:raw?raw.replace(/^\d+–\d+ min \| [^:]+:\s*/,""):null,activity:i===0?"Invite ideas or launch the opening poll.":i===2&&!adult?"Explore the original story and writing technique.":i===3&&!adult||i===2&&adult?"Use the prepared story builder or moderated collaboration.":i===4?"Give writers space to create.":i===5?"Offer optional feedback; never require sharing.":i===6?"Invite reflection and an achievable next step.":""};
 });
}
export function elapsedWorkshopSeconds(accumulated,startedAt,now){
 return Math.max(0,Math.floor((accumulated+(startedAt===null?0:Math.max(0,now-startedAt)))/1000));
}
