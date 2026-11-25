import type {App} from "./types";

type Window={day:number;start:string;end:string};
type Settings={enabled:boolean;windows:Window[];revision:number};
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
 if(b.enabled&&!windows.length)return null;
 return {enabled:b.enabled,windows:windows.sort((a,b)=>a.day-b.day||a.start.localeCompare(b.start)),revision:b.revision};
}
export async function readAvailability(db:D1Database):Promise<Settings>{
 const r=await db.prepare("SELECT enabled,windows_json,revision FROM support_public_availability WHERE id=1").first<any>();
 if(!r)return {enabled:false,windows:[],revision:0};
 const v=validateAvailability({enabled:r.enabled===1,windows:JSON.parse(r.windows_json),revision:r.revision});
 if(!v)throw Error("Availability settings invalid.");
 return v;
}
export async function saveAvailability(db:D1Database,b:any){
 const v=validateAvailability(b);if(!v||b.confirmed!==true)return false;
 const at=new Date().toISOString();
 const result=v.revision===0?await db.prepare("INSERT OR IGNORE INTO support_public_availability(id,enabled,windows_json,revision,updated_at) VALUES(1,?,?,1,?)").bind(v.enabled?1:0,JSON.stringify(v.windows),at).run():await db.prepare("UPDATE support_public_availability SET enabled=?,windows_json=?,revision=revision+1,updated_at=? WHERE id=1 AND revision=?").bind(v.enabled?1:0,JSON.stringify(v.windows),at,v.revision).run();
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
export function publicWindows(windows:Window[],busy:Busy[],now=new Date(),days=14){
 const start=Date.parse(dayKey(now.getTime())+"T00:00:00Z");
 const blocks=busy.map(b=>({s:Date.parse(b.start_at)-Number(b.prep_minutes||0)*minute,e:Date.parse(b.end_at)+Number(b.wrap_minutes||0)*minute}));
 if(blocks.some(b=>!Number.isFinite(b.s)||!Number.isFinite(b.e)||b.e<=b.s))throw Error("Invalid diary interval.");
 const result:{date:string;windows:{start:string;end:string}[]}[]=[];
 for(let d=0;d<days;d++){
  const nominal=new Date(start+d*86400000),date=nominal.toISOString().slice(0,10),weekday=nominal.getUTCDay();
  const available:{start:string;end:string}[]=[];
  for(const w of windows.filter(x=>x.day===weekday).sort((a,b)=>a.start.localeCompare(b.start))){
   const from=localTime(date,w.start),to=localTime(date,w.end);if(from===null||to===null||to<=from)continue;
   let run:number|null=null;
   for(let t=from;t<to;t+=half){
    const free=t>=now.getTime()+30*minute&&t+half<=to&&!blocks.some(b=>b.s<t+half&&b.e>t);
    if(free&&run===null)run=t;
    if(!free&&run!==null){available.push({start:new Date(run).toISOString(),end:new Date(t).toISOString()});run=null;}
   }
   if(run!==null)available.push({start:new Date(run).toISOString(),end:new Date(to).toISOString()});
  }
  result.push({date,windows:available});
 }
 return result;
}
export async function readPublicAvailability(db:D1Database,now=new Date()){
 const settings=await readAvailability(db);
 if(!settings.enabled)return {published:false,days:[],timezone:zone};
 const from=now.toISOString(),to=new Date(now.getTime()+15*86400000).toISOString();
 // No names, reasons, IDs, offers, prices or private diary content leave this function.
 const [orders,blocks]=await Promise.all([
  db.prepare("SELECT o.start_at,o.end_at,COALESCE(d.prep_minutes,0) prep_minutes,COALESCE(d.wrap_minutes,0) wrap_minutes FROM support_service_orders o LEFT JOIN support_tutor_diary d ON d.order_id=o.id WHERE o.mode='live' AND o.status NOT IN ('cancelled','completed') AND julianday(o.start_at)-COALESCE(d.prep_minutes,0)/1440.0<julianday(?) AND julianday(o.end_at)+COALESCE(d.wrap_minutes,0)/1440.0>julianday(?) LIMIT 1001").bind(to,from).all<Busy>(),
  db.prepare("SELECT start_at,end_at FROM support_busy_blocks WHERE start_at<? AND end_at>? LIMIT 1001").bind(to,from).all<Busy>(),
 ]);
 const all=[...(orders.results||[]),...(blocks.results||[])];if(all.length>1000)throw Error("Diary range too large.");
 return {published:true,days:publicWindows(settings.windows,all,now),timezone:zone};
}
export function registerPublicAvailability(app:App){
 app.get("/api/support-availability",async c=>{
  c.header("Cache-Control","no-store");
  try{return c.json(await readPublicAvailability(c.env.DB));}
  catch{return c.json({published:false,days:[],timezone:zone,unavailable:true},503);}
 });
}
