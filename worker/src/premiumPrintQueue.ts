// Private print production jobs; only the paid order's generated PDF goes into
// the owner's print queue. No child names, notes or learning records in D1.
export const PREMIUM_PRINT_FOLDER="shop/premium-print-orders";
export function premiumPdfKey(orderId:string,productId:string,jobId:string){
  return PREMIUM_PRINT_FOLDER+"/"+orderId+"/"+productId+"/"+jobId+".pdf";
}
const CREATE="CREATE TABLE IF NOT EXISTS premium_print_jobs (id TEXT PRIMARY KEY, order_id TEXT NOT NULL, product_id TEXT NOT NULL, pdf_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ready', submitted_at TEXT NOT NULL, updated_at TEXT NOT NULL, tracking TEXT NOT NULL DEFAULT '', dispatch_notified_at TEXT, UNIQUE(order_id,product_id))";
const ready=new WeakMap<object,Promise<void>>();
export function ensurePremiumPrintQueue(db:D1Database):Promise<void>{
 let promise=ready.get(db);
 if(!promise){
   promise=(async()=>{
     await db.prepare(CREATE).run();
     // Existing production queues were created before tracking/notification support.
     // D1's additive alterations preserve every paid job and private PDF.
     for(const col of ["tracking TEXT NOT NULL DEFAULT ''","dispatch_notified_at TEXT"]){
       try{await db.prepare("ALTER TABLE premium_print_jobs ADD COLUMN "+col).run();}
       catch(err:any){if(!/duplicate column name/i.test(String(err?.message||err)))throw err;}
     }
   })().catch(e=>{ready.delete(db);throw e;});
   ready.set(db,promise);
 }
 return promise;
}
export const PRINT_JOB_STATUSES=["ready","sent_to_printer","printed","dispatched","complete"] as const;
export function canAdvancePrintStatus(from:string,to:string):boolean{
 const i=PRINT_JOB_STATUSES.indexOf(from as any);
 return i>=0 && i<PRINT_JOB_STATUSES.length-1 && PRINT_JOB_STATUSES[i+1]===to;
}
export function validatePrintTracking(value:unknown):string|null{
 if(typeof value!=="string")return null;
 const trimmed=value.trim();
 return trimmed.length>=5 && trimmed.length<=80 && /^[A-Za-z0-9 ._\/-]+$/.test(trimmed) ? trimmed : null;
}
