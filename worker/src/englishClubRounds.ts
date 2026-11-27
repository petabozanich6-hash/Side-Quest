import {academyPrice,ACADEMY_PRICE_VERSION} from "./writersAcademyPricing";
import {campActivities} from "./englishClubCampGames";
import {creativeCamp,campPreparation,campResource} from "./englishClubCreativeCamps";
import {STORY_QUEST,storyQuestPreparation} from "./englishClubCurriculum";
import {workshopResource} from "./englishClubWorkshopResources";
import {validateActivityTemplate} from "./supportActivityLibrary";
import {sydneyWeek} from "./englishClub";
export const ROUND_PRICE_CENTS=1500;
const text=(v:unknown,max:number)=>typeof v==="string"&&v.trim().length<=max?v.trim():"";
const clock=new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
function local(t:number){const p=Object.fromEntries(clock.formatToParts(new Date(t)).map(x=>[x.type,x.value]));return p.year+"-"+p.month+"-"+p.day+"T"+p.hour+":"+p.minute;}
export function weeklyRoundStarts(first:unknown,count:number):string[]|null{
 if(typeof first!=="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(first)||!Number.isInteger(count)||count<2||count>12)return null;
 const start=Date.parse(first+":00Z");if(!Number.isFinite(start)||new Date(start).toISOString().slice(0,16)!==first)return null;
 const out:string[]=[];
 for(let i=0;i<count;i++){
 const nominal=start+i*7*86400000,wall=new Date(nominal).toISOString().slice(0,16);
 const candidates=[10,11].map(h=>nominal-h*3600000).filter(t=>local(t)===wall);
 if(candidates.length!==1)return null;
 out.push(new Date(candidates[0]).toISOString());
 }return out;
}
export async function createEnglishRound(db:D1Database,owner:string,b:any,now=new Date()){
 const title=text(b?.title,120),description=text(b?.description,1000),starts=weeklyRoundStarts(b?.first_local,b?.session_count);
 if(b?.confirmed!==true||!title||!starts||!Array.isArray(b.themes)||b.themes.length!==starts.length||b.themes.some((x:unknown)=>!text(x,120))||Date.parse(starts[0])-86400000<=now.getTime()||Date.parse(starts[starts.length-1])>now.getTime()+180*86400000)return {error:"Choose 2–12 weekly sessions in Sydney time, within six months, each with a theme and more than 24 hours' notice."};
 const camp=creativeCamp(b.curriculum_id),preset=camp||(b.curriculum_id===STORY_QUEST.id?STORY_QUEST:null);
 if(b.curriculum_id!==undefined&&(!preset||b.reviewed_activities!==true||starts.length!==6||title!==preset.title||description!==preset.description||b.themes.some((v:unknown,i:number)=>v!==preset.sessions[i]?.title)))return {error:"The selected curriculum no longer matches the reviewed six workshops. Reload and review the preset activities or create a custom round."};
 const id=crypto.randomUUID(),at=now.toISOString();
 const price=camp?academyPrice(camp.id,"upfront"):null;
 const statements=[db.prepare("INSERT INTO support_english_rounds(id,title,description,session_count,created_by,created_at,curriculum_id,price_per_session_cents,price_version,upfront_cents) VALUES(?,?,?,?,?,?,?,?,?,?)").bind(id,title,description,starts.length,owner,at,preset?.id||null,price?.session_cents??ROUND_PRICE_CENTS,price?ACADEMY_PRICE_VERSION:"legacy-v1",price?.total_cents??null)];
 for(const [i,start] of starts.entries()){
 const cid="english-club-"+crypto.randomUUID(),end=new Date(Date.parse(start)+3600000).toISOString(),before=new Date(Date.parse(start)-15*60000).toISOString(),after=new Date(Date.parse(end)+10*60000).toISOString(),week=sydneyWeek(start)+(camp?.id==="english-creative-camp-junior-v1"?"|junior":"");
 statements.push(db.prepare("INSERT INTO support_busy_blocks(id,label,start_at,end_at,created_at) VALUES((SELECT ? WHERE NOT EXISTS(SELECT 1 FROM support_english_classes WHERE week_of=?) AND NOT EXISTS(SELECT 1 FROM support_busy_blocks WHERE start_at<? AND end_at>?) AND NOT EXISTS(SELECT 1 FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(?) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(?))),'English Club (including preparation)',?,?,?)").bind(cid,week,after,before,after,before,before,after,at));
 // Explicit non-null round mapping also fails if a calendar block was not inserted.
 statements.push(db.prepare("INSERT INTO support_english_classes(id,week_of,start_at,end_at,topic,created_at,preparation,public_description) SELECT id,?,?,?,?,?,?,? FROM support_busy_blocks WHERE id=?").bind(week,start,end,text(b.themes[i],120),at,camp?campPreparation(camp.id,i):preset?storyQuestPreparation(i):"",preset?preset.sessions[i].description:"",cid));
 statements.push(db.prepare("INSERT INTO support_english_round_classes(round_id,class_id,sequence) VALUES(?,(SELECT id FROM support_english_classes WHERE id=?),?)").bind(id,cid,i+1));
 if(preset){
  const resource=camp?campResource(camp.id,i):workshopResource(i);
  if(!resource)return {error:"Workshop resources unavailable. No round was created."};
  statements.push(db.prepare("INSERT INTO support_english_workshop_resources(class_id,resource_json) VALUES(?,?)").bind(cid,JSON.stringify(resource)));
  // Owner confirmation covers these exact versioned prompts. New copies are private,
  // editable reviewed templates; no existing template or plan is overwritten.
  const items:{template_id:string;revision:number}[]=[];
  for(const a of (camp?campActivities(preset.sessions[i]):preset.sessions[i].activities)){
   const v=validateActivityTemplate({...a,subject:"English",year_level:camp?"Ages "+camp.age:"Mixed levels"});
   if(!v)return {error:"A preset activity is invalid. No round was created."};
   const key=crypto.randomUUID();
   statements.push(db.prepare("INSERT INTO support_activity_templates(id,title,subject,year_level,question,activity_type,options_json,answer_key,status,game_json,collaborative,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(key,v.title,v.subject,v.year_level,v.question,v.type,JSON.stringify(v.options),v.answer_key,"reviewed",v.game?JSON.stringify(v.game):null,v.collaborative,at,at));
   items.push({template_id:key,revision:1});
  }
  statements.push(db.prepare("INSERT INTO support_session_activity_plans(kind,session_id,items_json,updated_at) VALUES(?,?,?,?)").bind("club",cid,JSON.stringify(items),at));
 }
 }
 try{await db.batch(statements);return {id};}catch{return {error:"A week conflicts with an existing class, booking or blocked time. No round or calendar blocks were created."};}
}
export async function setEnglishRoundPublished(db:D1Database,id:string,b:any,now=new Date()){
 if(b?.confirmed!==true||typeof b.published!=="boolean")return false;
 const r=await db.prepare("UPDATE support_english_rounds SET published=? WHERE id=? AND (?=0 OR ((SELECT COUNT(*) FROM support_english_round_classes WHERE round_id=?)=session_count AND NOT EXISTS(SELECT 1 FROM support_english_round_classes x JOIN support_english_classes c ON c.id=x.class_id WHERE x.round_id=? AND julianday(c.start_at)<=julianday(?)+1)))").bind(b.published?1:0,id,b.published?1:0,id,id,now.toISOString()).run();
 return !!r.meta?.changes;
}
export async function listEnglishRounds(db:D1Database,publicOnly=false,now=new Date()){
 const rows=(await db.prepare(`SELECT r.id,r.title,r.description,r.session_count,r.curriculum_id,r.price_per_session_cents,r.price_version,r.upfront_cents,r.published,x.sequence,c.id class_id,c.topic,c.public_description,c.start_at,c.end_at,8-(SELECT COUNT(*) FROM support_english_enrolments e WHERE e.class_id=c.id AND e.status<>'cancelled') remaining FROM support_english_rounds r JOIN support_english_round_classes x ON x.round_id=r.id JOIN support_english_classes c ON c.id=x.class_id ${publicOnly?"WHERE r.published=1 AND NOT EXISTS(SELECT 1 FROM support_english_round_classes y JOIN support_english_classes d ON d.id=y.class_id WHERE y.round_id=r.id AND julianday(d.start_at)<=julianday(?)+1)":""} ORDER BY r.created_at DESC,x.sequence`).bind(...(publicOnly?[now.toISOString()]:[])).all<any>()).results||[];
 const grouped=new Map<string,any>();
 for(const r of rows){if(!grouped.has(r.id))grouped.set(r.id,{id:r.id,title:r.title,description:r.description,age_group:creativeCamp(r.curriculum_id)?.age||null,session_count:r.session_count,published:!!r.published,remaining:8,price_per_session_cents:r.price_per_session_cents,price_version:r.price_version,programme_id:r.curriculum_id,price_cents:r.upfront_cents??r.session_count*r.price_per_session_cents,weekly_total_cents:r.session_count*r.price_per_session_cents,classes:[]});const g=grouped.get(r.id);g.remaining=Math.min(g.remaining,r.remaining);g.classes.push({id:r.class_id,sequence:r.sequence,topic:r.topic,description:r.public_description,start_at:r.start_at,end_at:r.end_at});}
 return [...grouped.values()].filter(r=>!publicOnly||(r.remaining>0&&r.classes.length===r.session_count)).sort((a,b)=>a.classes[0].start_at.localeCompare(b.classes[0].start_at));
}
