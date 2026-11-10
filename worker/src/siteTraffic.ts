/**
 * Anonymous public-page counts. No IP addresses, user IDs, names, URL parameters,
 * referrers or browser fingerprints are written to analytics tables.
 * Sessions are random tab-scoped UUIDs, so "visits" are estimates, not people.
 */
import type { App } from "./types";
import { hitRateLimit } from "./adminAudit";

const safePath=(value:unknown):string|null=>{
 if(typeof value!=="string"||value.length>100)return null;
 const path=value.replace(/\/+$/,"")||"/";
 if(["/","/shop","/login","/register","/get-app","/forgot-password"].includes(path))return path;
 if(/^\/shop\/configure-planner\/[0-9a-f-]{36}$/i.test(path))return "/shop/configure-planner";
 if(/^\/parent\/trust(?:\/[a-z0-9-]+)?$/.test(path))return "/trust";
 return null;
};
export async function ensureTrafficSchema(db:D1Database){
 await db.prepare("CREATE TABLE IF NOT EXISTS site_traffic_daily(day TEXT NOT NULL,path TEXT NOT NULL,views INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(day,path))").run();
 await db.prepare("CREATE TABLE IF NOT EXISTS site_traffic_sessions(day TEXT NOT NULL,session_id TEXT NOT NULL,PRIMARY KEY(day,session_id))").run();
}
export function registerSiteTraffic(app:App){
 app.post("/api/traffic/view",async c=>{
  c.header("Cache-Control","no-store");
  const origin=c.req.header("Origin");
  if(!origin||origin!==new URL(c.req.url).origin)return c.json({detail:"Not allowed"},403);
  const raw:any=await c.req.json().catch(()=>({}));
  const path=safePath(raw.path);
  const session=typeof raw.session==="string"?raw.session:"";
  if(!path||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session))return c.json({detail:"Invalid event"},400);
  try{
   const limit=await hitRateLimit(c.env.DB,"traffic:"+session,120,3600);
   if(!limit.ok)return c.json({detail:"Too many requests"},429);
   await ensureTrafficSchema(c.env.DB);
   const day=new Date().toISOString().slice(0,10);
   await c.env.DB.prepare("INSERT INTO site_traffic_sessions(day,session_id) VALUES(?,?) ON CONFLICT DO NOTHING").bind(day,session).run();
   await c.env.DB.prepare("INSERT INTO site_traffic_daily(day,path,views) VALUES(?,?,1) ON CONFLICT(day,path) DO UPDATE SET views=views+1").bind(day,path).run();
   return c.json({ok:true});
  }catch{return c.json({detail:"Analytics unavailable"},503)}
 });
}
export async function siteTrafficSummary(db:D1Database,days=30){
 await ensureTrafficSchema(db);
 const start=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
 const [totals,visits,rows,sessions]=await Promise.all([
  db.prepare("SELECT COALESCE(SUM(views),0) AS views FROM site_traffic_daily WHERE day>=?").bind(start).first<{views:number}>(),
  db.prepare("SELECT COUNT(*) AS visits FROM site_traffic_sessions WHERE day>=?").bind(start).first<{visits:number}>(),
  db.prepare("SELECT day,SUM(views) AS views FROM site_traffic_daily WHERE day>=? GROUP BY day ORDER BY day ASC").bind(start).all<{day:string,views:number}>(),
  db.prepare("SELECT path,SUM(views) AS views FROM site_traffic_daily WHERE day>=? GROUP BY path ORDER BY views DESC LIMIT 20").bind(start).all<{path:string,views:number}>(),
 ]);
 const today=new Date().toISOString().slice(0,10);
 const [todayViews,todayVisits]=await Promise.all([
  db.prepare("SELECT COALESCE(SUM(views),0) AS views FROM site_traffic_daily WHERE day=?").bind(today).first<{views:number}>(),
  db.prepare("SELECT COUNT(*) AS visits FROM site_traffic_sessions WHERE day=?").bind(today).first<{visits:number}>(),
 ]);
 return {days,start,today,views:totals?.views||0,estimated_visits:visits?.visits||0,today_views:todayViews?.views||0,today_estimated_visits:todayVisits?.visits||0,trend:rows.results||[],top_pages:sessions.results||[],note:"Counts only selected public pages. Visits are anonymous browser-tab sessions, not unique people. Tracking starts at deployment."};
}
