import type {App} from "./types";

type Window={day:number;start:string;end:string};
type Hours={start:string;end:string};
type DayOverride={date:string;windows:Hours[];limit:number};
type Policy={enforced:boolean;weekly_limit:number;daily_limit:number;evening_limit:number;date_overrides:DayOverride[];week_overrides:{monday:string;limit:number}[]};
type Settings={enabled:boolean;windows:Window[];revision:number;policy:Policy};
const defaults=():Policy=>({"enforced":true,"weekly_limit":5,"daily_limit":2,"evening_limit":1,"date_overrides":[],"week_overrides":[]});
const bounded=(v:unknown,max:number):v is number=>typeof v==="number"&&Number.isInteger(v)&&v>=0&&v<=max;
const validDate=(v:unknown):v is string=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+"T00:00:00Z"))&&new Date(v+"T00:00:00Z").toISOString().slice(0,10)===v;
const shift=(date:string,n:number)=>new Date(Date.parse(date+"T00:00:00Z")+n*86400000).toISOString().slice(0,10);
const monday=(date:string)=>shift(date,-((new Date(date+"T00:00:00Z").getUTCDay()+6)%7));
function validatePolicy(raw:any):Policy|null{
 if(!raw||typeof raw.enforced!=="boolean"||!bounded(raw.weekly_limit,30)||!bounded(raw.daily_limit,12)||!bounded(raw.evening_limit,12)||!Array.isArray(raw.date_overrides)||raw.date_overrides.length>180||!Array.isArray(raw.week_overrides)||raw.week_overrides.length>52)return null;
 const dates:DayOverride[]=[],weeks:Policy["week_overrides"]=[];
 for(const d of raw.date_overrides){
  if(!validDate(d?.date)||!bounded(d.limit,12)||!Array.isArray(d.windows)||d.windows.length>3||dates.some(x=>x.date===d.date))return null;
  const windows:Hours[]=[];
  for(const w of d.windows){if(!validClock(w?.start)||!validClock(w.end)||clock(w.end)-clock(w.start)<30||windows.some(x=>x.start<w.end&&x.end>w.start))return null;windows.push({start:w.start,end:w.end});}
  dates.push({date:d.date,windows,limit:d.limit});
 }
 for(const w of raw.week_overrides){if(!validDate(w?.monday)||monday(w.monday)!==w.monday||!bounded(w.limit,30)||weeks.some(x=>x.monday===w.monday))return null;weeks.push({monday:w.monday,limit:w.limit});}
 return {enforced:raw.enforced,weekly_limit:raw.weekly_limit,daily_limit:raw.daily_limit,evening_limit:raw.evening_limit,date_overrides:dates.sort((a,b)=>a.date.localeCompare(b.date)),week_overrides:weeks.sort((a,b)=>a.monday.localeCompare(b.monday))};
}
type Busy={start_at:string;end_at:string;prep_minutes?:number;wrap_minutes?:number};
const zone="Australia/Sydney", minute=60000, half=30*minute;
const localParts=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
function parts(t:number){return Object.fromEntries(localParts.formatToParts(new Date(t)).map(x=>[x.type,x.value]));}
function dayKey(t:number){const p=parts(t);return p.year+"-"+p.month+"-"+p.day;}
function clock(v:string){return Number(v.slice(0,2))*60+Number(v.slice(3));}
const validClock=(v:unknown):v is string=>typeof v==="string"&&/^(?:[01]\d|2[0-3]):(?:00|30)$/.test(v);
export function validateAvailability(b:any):Settings|null{
 if(typeof b?.enabled!=="boolean"||!Number.isInteger(b.revision)||b.revision<0||!Array.isArray(b.windows)||b.windows.length>21)return null;
 const windows:Window[]=[];
 for(const w of b.windows){
  if(!Number.isInteger(w?.day)||w.day<0||w.day>6||!validClock(w.start)||!validClock(w.end)||clock(w.end)-clock(w.start)<30)return null;
  if(windows.some(x=>x.day===w.day&&x.start<w.end&&x.end>w.start))return null;
  windows.push({day:w.day,start:w.start,end:w.end});
 }
 const policy=validatePolicy(b.policy??defaults());if(!policy||b.enabled&&!windows.length&&!policy.date_overrides.some(d=>d.windows.length))return null;
 return {enabled:b.enabled,windows:windows.sort((a,b)=>a.day-b.day||a.start.localeCompare(b.start)),revision:b.revision,policy};
}
export async function readAvailability(db:D1Database):Promise<Settings>{
 const r=await db.prepare("SELECT enabled,windows_json,revision,policy_json FROM support_public_availability WHERE id=1").first<any>();
 if(!r)return {enabled:false,windows:[],revision:0,policy:{...defaults(),enforced:false}};
 const v=validateAvailability({enabled:r.enabled===1,windows:JSON.parse(r.windows_json),revision:r.revision,policy:JSON.parse(r.policy_json)});
 if(!v)throw Error("Availability settings invalid.");
 return v;
}
export async function saveAvailability(db:D1Database,b:any){
 const v=validateAvailability(b);if(!v||b.confirmed!==true)return false;
 const at=new Date().toISOString();
 const result=v.revision===0?await db.prepare("INSERT OR IGNORE INTO support_public_availability(id,enabled,windows_json,revision,updated_at,policy_json) VALUES(1,?,?,1,?,?)").bind(v.enabled?1:0,JSON.stringify(v.windows),at,JSON.stringify(v.policy)).run():await db.prepare("UPDATE support_public_availability SET enabled=?,windows_json=?,revision=revision+1,updated_at=?,policy_json=? WHERE id=1 AND revision=?").bind(v.enabled?1:0,JSON.stringify(v.windows),at,JSON.stringify(v.policy),v.revision).run();
 return !!result.meta?.changes;
}
// Convert Sydney wall time to UTC. Skip ambiguous/nonexistent DST wall times.
function localTime(date:string,time:string){
 const base=Date.parse(date+"T"+time+":00Z");let matches:number[]=[];
 for(const offset of [10,11]){
  const t=base-offset*60*minute,p=parts(t);
  if(p.year+"-"+p.month+"-"+p.day===date&&p.hour+":"+p.minute===time)matches.push(t);
 }
 return matches.length===1?matches[0]:null;
}
function effective(settings:Settings,date:string){
 const d=settings.policy.date_overrides.find(x=>x.date===date);
 return {windows:d?.windows??settings.windows.filter(x=>x.day===new Date(date+"T00:00:00Z").getUTCDay()),daily:d?.limit??settings.policy.daily_limit,weekly:settings.policy.week_overrides.find(x=>x.monday===monday(date))?.limit??settings.policy.weekly_limit};
}
function boundary(date:string,time="00:00"){const t=localTime(date,time);if(t===null)throw Error("Invalid Sydney boundary.");return new Date(t).toISOString();}
type Interval={start:string;before:string;after:string};
type Check={from:string;to:string;max:number;count:number};
export async function bookingPolicyGuard(db:D1Database,intervals:Interval[]){
 const settings=await readAvailability(db),revision=settings.revision;
 const revisionSql=revision?"EXISTS(SELECT 1 FROM support_public_availability WHERE id=1 AND revision=?)":"NOT EXISTS(SELECT 1 FROM support_public_availability WHERE id=1)";
 const args:(string|number)[]=revision?[revision]:[];
 if(!settings.policy.enforced||!intervals.length)return {sql:" AND "+revisionSql,args};
 const checks=new Map<string,Check>();
 function add(from:string,to:string,max:number){const key=from+"|"+to,old=checks.get(key);checks.set(key,{from,to,max:old?Math.min(old.max,max):max,count:(old?.count??0)+1});}
 for(const i of intervals){
  const date=dayKey(Date.parse(i.start)),e=effective(settings,date),week=monday(date);
  if(!e.windows.some(w=>{const from=localTime(date,w.start),to=localTime(date,w.end);return from!==null&&to!==null&&Date.parse(i.before)>=from&&Date.parse(i.after)<=to;}))return null;
  add(boundary(date),boundary(shift(date,1)),e.daily);
  add(boundary(week),boundary(shift(week,7)),e.weekly);
  const evening=boundary(date,"17:00");if(i.start>=evening)add(evening,boundary(shift(date,1)),settings.policy.evening_limit);
 }
 const groups=[...checks.values()];if(groups.some(c=>c.count>c.max))return null;
 // Check capacity and settings revision inside the atomic reservation INSERT, including all package sessions.
 return {sql:" AND "+revisionSql+" AND NOT EXISTS(SELECT 1 FROM json_each(?) j WHERE json_extract(j.value,'$.count')+(SELECT COUNT(*) FROM support_service_orders o WHERE o.mode='live' AND o.status<>'cancelled' AND o.start_at>=json_extract(j.value,'$.from') AND o.start_at<json_extract(j.value,'$.to'))>json_extract(j.value,'$.max'))",args:[...args,JSON.stringify(groups)]};
}
export async function permittedByBookingPolicy(db:D1Database,interval:Interval){
 const guard=await bookingPolicyGuard(db,[interval]);return !!guard&&!!await db.prepare("SELECT 1 WHERE 1=1"+guard.sql).bind(...guard.args).first();
}
export function publicWindows(windows:Window[],busy:Busy[],now=new Date(),days=14,settings?:Settings,reserved:{start_at:string}[]=[]){
 const start=Date.parse(dayKey(now.getTime())+"T00:00:00Z");
 const blocks=busy.map(b=>({s:Date.parse(b.start_at)-Number(b.prep_minutes||0)*minute,e:Date.parse(b.end_at)+Number(b.wrap_minutes||0)*minute}));
 if(blocks.some(b=>!Number.isFinite(b.s)||!Number.isFinite(b.e)||b.e<=b.s))throw Error("Invalid diary interval.");
 const result:{date:string;windows:{start:string;end:string}[]}[]=[];
 for(let d=0;d<days;d++){
  const nominal=new Date(start+d*86400000),date=nominal.toISOString().slice(0,10),weekday=nominal.getUTCDay();
  const available:{start:string;end:string}[]=[];
  const e=settings?effective(settings,date):null,week=monday(date),enforced=settings?.policy.enforced===true;
  const count=(from:string,to:string)=>reserved.filter(r=>r.start_at>=from&&r.start_at<to).length;
  if(enforced&&e&&(count(boundary(date),boundary(shift(date,1)))>=e.daily||count(boundary(week),boundary(shift(week,7)))>=e.weekly)){result.push({date,windows:[]});continue;}
  const eveningFull=!!(enforced&&settings&&count(boundary(date,"17:00"),boundary(shift(date,1)))>=settings.policy.evening_limit);
  for(const w of (e?.windows??windows.filter(x=>x.day===weekday)).slice().sort((a,b)=>a.start.localeCompare(b.start))){
   const from=localTime(date,w.start),to=localTime(date,w.end);if(from===null||to===null||to<=from)continue;
   let run:number|null=null;
   for(let t=from;t<to;t+=half){
    const free=(!eveningFull||t<Date.parse(boundary(date,"17:00")))&&t>=now.getTime()+30*minute&&t+half<=to&&!blocks.some(b=>b.s<t+half&&b.e>t);
    if(free&&run===null)run=t;
    if(!free&&run!==null){available.push({start:new Date(run).toISOString(),end:new Date(t).toISOString()});run=null;}
   }
   if(run!==null)available.push({start:new Date(run).toISOString(),end:new Date(to).toISOString()});
  }
  result.push({date,windows:available});
 }
 return result;
}
export async function readPublicAvailability(db:D1Database,now=new Date(),ownerPreview=false){
 const settings=await readAvailability(db);
 if(!settings.enabled&&!ownerPreview)return {published:false,days:[],timezone:zone};
 const from=now.toISOString(),to=new Date(now.getTime()+29*86400000).toISOString();
 const first=monday(dayKey(now.getTime())),last=shift(monday(shift(dayKey(now.getTime()),27)),7);
 // No names, reasons, IDs, offers, prices or private diary content leave this function.
 const [orders,blocks,reserved]=await Promise.all([
  db.prepare("SELECT o.start_at,o.end_at,COALESCE(d.prep_minutes,0) prep_minutes,COALESCE(d.wrap_minutes,0) wrap_minutes FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(?) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(?) LIMIT 1001").bind(to,from).all<Busy>(),
  db.prepare("SELECT start_at,end_at FROM support_busy_blocks WHERE start_at<? AND end_at>? LIMIT 1001").bind(to,from).all<Busy>(),
  db.prepare("SELECT start_at FROM support_service_orders WHERE mode='live' AND status<>'cancelled' AND start_at>=? AND start_at<? LIMIT 1001").bind(boundary(first),boundary(last)).all<{start_at:string}>(),
 ]);
 const all=[...(orders.results||[]),...(blocks.results||[])];if(all.length>1000||(reserved.results||[]).length>1000)throw Error("Diary range too large.");
 return {published:true,days:publicWindows(settings.windows,all,now,28,settings,reserved.results||[]),timezone:zone};
}
/** Private owner suggestions only. A suggestion does not reserve an appointment. */
export async function suggestSupportStarts(db:D1Database,minutes:number,prep:number,wrap:number,now=new Date()){
 if(![minutes,prep,wrap].every(Number.isInteger)||minutes<15||minutes>180||prep<0||prep>120||wrap<0||wrap>120)return null;
 const availability=await readPublicAvailability(db,now,true);
 const starts:string[]=[];
 // At most one suggestion per morning/afternoon window, spread across dates.
 for(const day of availability.days){
  for(const w of day.windows){
   const from=Date.parse(w.start),to=Date.parse(w.end);
   const first=Math.ceil((from+prep*minute)/(15*minute))*15*minute;
   if(first+(minutes+wrap)*minute>to||first-prep*minute<=now.getTime())continue;
   const start=new Date(first).toISOString();
   // The availability snapshot already excludes diary conflicts and full daily/weekly/evening capacity.
   // These suggestions are non-binding; the atomic reservation still checks the current policy.
   starts.push(start);
   if(starts.length>=12)return starts;
  }
 }
 return starts;
}
export function registerPublicAvailability(app:App){
 app.get("/api/support-availability",async c=>{
  c.header("Cache-Control","no-store");
  try{return c.json(await readPublicAvailability(c.env.DB));}
  catch{return c.json({published:false,days:[],timezone:zone,unavailable:true},503);}
 });
}
