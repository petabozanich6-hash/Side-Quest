import { JURISDICTIONS } from "./data/planJurisdictions";

// Seed only missing product listings; do not alter existing Owner HQ edits,
// file attachments, approval metadata, customer orders, or live products.
const editions = [
  { code:"blank", title:(name:string)=>"Home Education Planning Template – "+name+" (Fillable PDF)", tag:"fillable-pdf", price:499, fulfilment:"digital" },
  { code:"guided", title:(name:string)=>"Guided Home Education Plan – "+name, tag:"guided-document", price:999, fulfilment:"digital" },
  { code:"printed", title:(name:string)=>"Printed Home Education Planning Workbook – "+name, tag:"print-and-post", price:1499, fulfilment:"made_to_order" },
  { code:"premium_blank", title:(name:string)=>"Complete Home Education Planner & Diary – "+name+" (Blank PDF)", tag:"premium-planner-blank", price:2995, fulfilment:"digital" },
  { code:"premium_personalised", title:(name:string)=>"Complete Home Education Planner & Diary – "+name+" (Personalised PDF)", tag:"premium-planner-personalised", price:3995, fulfilment:"digital" },
  { code:"premium_printed", title:(name:string)=>"Complete Home Education Planner & Diary – "+name+" (Spiral Bound Printed)", tag:"premium-planner-printed", price:6995, fulfilment:"made_to_order" },
] as const;

export async function ensureDocumentShopListings(db:D1Database) {
 const key="document-listings-2026-11-v1";
 const seeded=!!(await db.prepare("SELECT 1 FROM shop_meta WHERE key=?").bind(key).first());
 const states=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"] as const;
 const entries=states.flatMap((state)=>editions.map((kind)=>({
  state,kind,title:kind.title(JURISDICTIONS[state].name),
 })));
 const existing=(await db.prepare("SELECT title FROM shop_products WHERE collection='Home Education Documents'").all<{title:string}>()).results||[];
 const titles=new Set(existing.map(x=>x.title));
 const now=new Date().toISOString();
 const statements=(seeded?[]:entries.filter(x=>!titles.has(x.title))).map(({state,kind,title},i)=>{
  const slug="home-education-"+state.toLowerCase()+"-"+kind.code;
  const tags=JSON.stringify(["home-education-document",state.toLowerCase(),kind.tag]);
  const description="A Side-Quest home education planning resource for "+JURISDICTIONS[state].name+". Independent parent resource; not an official government form, authority endorsement or registration guarantee. "+(kind.fulfilment==="digital"?"Digital document.":"Printed to order, with Australian postage included in the price.")+" Confirm your current state or territory requirements before use.";
  return db.prepare(`INSERT OR IGNORE INTO shop_products
  (id,slug,department,collection,title,description,tags,fulfilment,status,visible,price_cents,stage,max_per_order,sort,created_at,updated_at)
  VALUES (?,?,?,?,?,?,?,?,'register_interest',1,?,'launch_now',1,?,?,?)`)
  .bind(crypto.randomUUID(),slug,"home-education","Home Education Documents",title,description,tags,kind.fulfilment,kind.price,8000+i,now,now);
 });
 for(let i=0;i<statements.length;i+=40)await db.batch(statements.slice(i,i+40));
 await db.prepare("INSERT OR IGNORE INTO shop_meta(key,value) VALUES(?,?)").bind(key,now).run();
 // One-time activation of ONLY the originally seeded on-demand catalogue rows.
 // Leave intentionally hidden/edited products alone; never activate uploaded templates.
 const liveKey="on-demand-document-listings-2026-11-v1";
 if(!(await db.prepare("SELECT 1 FROM shop_meta WHERE key=?").bind(liveKey).first())){
   for(const entry of entries.filter(x=>["guided","premium_personalised","premium_printed"].includes(x.kind.code))){
     await db.prepare(`UPDATE shop_products SET status='in_stock',updated_at=?
       WHERE slug=? AND title=? AND department='home-education'
         AND status='register_interest' AND visible=1
         AND document_release_version IS NULL`)
       .bind(now,"home-education-"+entry.state.toLowerCase()+"-"+entry.kind.code,entry.title).run();
   }
   await db.prepare("INSERT OR IGNORE INTO shop_meta(key,value) VALUES(?,?)").bind(liveKey,now).run();
 }
 return {added:statements.length,total:entries.length};
}
