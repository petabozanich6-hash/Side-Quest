// Private print production jobs; only the paid order's generated PDF goes into
// the owner's print queue. No child names, notes or learning records in D1.
export const PREMIUM_PRINT_FOLDER="shop/premium-print-orders";
export function premiumPdfKey(orderId:string,productId:string,jobId:string){
  return PREMIUM_PRINT_FOLDER+"/"+orderId+"/"+productId+"/"+jobId+".pdf";
}
const CREATE="CREATE TABLE IF NOT EXISTS premium_print_jobs (id TEXT PRIMARY KEY, order_id TEXT NOT NULL, product_id TEXT NOT NULL, pdf_key TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ready', submitted_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(order_id,product_id))";
const ready=new WeakMap<object,Promise<void>>();
export function ensurePremiumPrintQueue(db:D1Database):Promise<void>{
 let promise=ready.get(db);
 if(!promise){promise=db.prepare(CREATE).run().then(()=>undefined).catch(e=>{ready.delete(db);throw e;});ready.set(db,promise);}
 return promise;
}
export const PRINT_JOB_STATUSES=["ready","sent_to_printer","printed","dispatched","complete"] as const;
