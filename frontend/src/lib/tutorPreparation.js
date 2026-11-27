// Private owner-only preparation helper. No AI request, invented learner facts, or publication.
const cut=(v,n)=>typeof v==="string"?v.trim().slice(0,n):"";
const join=(values,n)=>cut(values.filter(Boolean).join("\n"),n);
const parentFields=["Year level","Learning area","Learning needs","Parent goals","Interests and favourite topics","What is going well","Learning preferences","Preferred times / flexibility"];
export function preparationContext(data){
 const c=data?.learner_context||{},l=c.learner||{},p=data?.proposal;
 const text=typeof c.current_enquiry==="string"?c.current_enquiry:"",parts={};
 // The original intake has a fixed labelled format. Treat its contents as parent-supplied,
 // not verified learning outcomes. Keep first occurrence of each label.
 let active="";
 for(const line of text.split("\n")){
  const label=parentFields.find(k=>line.startsWith(k+": "));
  if(label){active=label;if(!(label in parts))parts[label]=line.slice(label.length+2);else active="";}
  else if(active==="Learning needs"&&line.trim())parts[active]+="\n"+line;
 }
 const year=cut(parts["Year level"]||p?.year_level||(l.year_level!=null?( /^\d+$/.test(String(l.year_level))?"Year "+l.year_level:String(l.year_level)):""),40);
 const subject=cut(parts["Learning area"]||p?.subject||"",80);
 const prior=Array.isArray(c.reports)?c.reports.find(r=>Array.isArray(r.sections)&&r.sections[2]):null;
 const goals=cut(l.goals||parts["Parent goals"],600),focus=cut(parts["Learning needs"],600);
 const interests=join([l.interests,parts["Interests and favourite topics"],parts["What is going well"]&&"Strengths: "+parts["What is going well"],parts["Learning preferences"]&&"Preferences: "+parts["Learning preferences"]],600);
 return {subject,year,goals,focus,interests,approach:cut(l.approach||parts["Learning preferences"],1000),practice:cut(prior?.sections[2],600)};
}
export function prefillPreparation(data){
 const diary=data?.diary;if(!diary)return null;
 const c=preparationContext(data),details={...diary.details};
 if(diary.ready)return diary;
 for(const [key,value] of Object.entries({subject:c.subject,year_level:c.year,interests:c.interests,objective:c.goals,approach:c.approach}))if(!cut(details[key],3000)&&value)details[key]=value;
 return {...diary,details};
}
export function draftPreparation(data,diary){
 const c=preparationContext(data),o=data.order||{},p=data.proposal,details={...diary.details};
 const duration=Math.round((Date.parse(o.end_at)-Date.parse(o.start_at))/60000);
 if(!Number.isFinite(duration)||duration<15||duration>180)return null;
 const subject=cut(details.subject||c.subject,80),year=cut(details.year_level||c.year,40);
 const scheduled=p?.lessons?.[(o.package_sequence||1)-1],guide=p?.tutor_guides?.[(o.package_sequence||1)-1];
 const objective=cut(scheduled?.objective||details.objective||c.goals|| (c.practice?"Revisit the previous report's practice priority: "+c.practice:c.focus?"Clarify and practise the requested learning focus: "+c.focus:"Establish the learner's starting point and agree one achievable learning goal."),600);
 const times=[Math.floor(duration*.15),Math.floor(duration*.25),Math.floor(duration*.30),Math.floor(duration*.20)];
 times.push(duration-times.reduce((a,b)=>a+b,0));
 const review=c.practice?"Revisit reported practice priority: "+c.practice:"Ask the learner to demonstrate their starting point; do not assume prior mastery.";
 const agenda=scheduled?join([scheduled.title+" · "+duration+" min",scheduled.activities,guide?.guide,"Check: "+scheduled.check],2500):join([times[0]+" min · Check in and assess: "+review,times[1]+" min · Model one small skill linked to the agreed objective; demonstrate a worked example and explain the reasoning.",times[2]+" min · Guided practice: work through a similar task together, checking understanding and adapting the difficulty.",times[3]+" min · Independent or interactive attempt: use a different example; ask the learner to explain their thinking.",times[4]+" min · Exit check: ask the learner to demonstrate the skill; record what to revisit."],2500);
 return {...diary,ready:false,details:{...details,subject,year_level:year,objective,interests:details.interests||c.interests,approach:join([details.approach||c.approach,scheduled?.check,guide?.answers,"Check understanding with a worked example, guided practice and a separate exit task. Adapt after observing the learner."],1000),agenda,materials:details.materials||"Prepare a worked example, a separate practice task, whiteboard and exit question. Select or create actual learner-facing resources and review them before marking ready.",preparation:details.preparation||"Confirm the focus and level; check previous progress; review examples and answers; select suitable interactive activities and check classroom access.",follow_up:cut(scheduled?.home_practice||details.follow_up||"After teaching, record observed progress and one suggested next step. Review the parent update before sending.",1500)}};
}
