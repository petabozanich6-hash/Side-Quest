/** A quote is a non-binding proposal. No payment, booking or service entitlement is created. */
export const QUOTE_SCHEMA = [
  "CREATE TABLE IF NOT EXISTS learning_support_quotes (id TEXT PRIMARY KEY, feedback_id TEXT NOT NULL REFERENCES parent_feedback(id) ON DELETE CASCADE, scope TEXT NOT NULL, delivery TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK(amount_cents BETWEEN 0 AND 1000000), currency TEXT NOT NULL DEFAULT 'AUD' CHECK(currency='AUD'), status TEXT NOT NULL DEFAULT 'offered' CHECK(status IN ('offered','interested','declined','withdrawn')), created_at TEXT NOT NULL, expires_at TEXT NOT NULL, responded_at TEXT, withdrawn_at TEXT)",
  "CREATE INDEX IF NOT EXISTS idx_support_quotes_thread ON learning_support_quotes(feedback_id,created_at DESC,id)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_support_quotes_open ON learning_support_quotes(feedback_id) WHERE status IN ('offered','interested')"
] as const;
export async function ensureQuoteSchema(db:D1Database){
 for(const sql of QUOTE_SCHEMA)await db.prepare(sql).run();
}
export function validateQuote(b:Record<string,unknown>){
 const scope=typeof b.scope==="string"?b.scope.trim():"";
 const delivery=typeof b.delivery==="string"?b.delivery.trim():"";
 const cents=b.amount_cents,days=b.valid_days;
 if(scope.length<10||scope.length>1500||delivery.length<3||delivery.length>500)return {error:"Describe the support (10–1500 characters) and delivery arrangements (3–500 characters)."} as const;
 if(typeof cents!=="number"||!Number.isInteger(cents)||cents<0||cents>1000000)return {error:"Enter a valid total in AUD cents (up to $10,000)."} as const;
 if(typeof days!=="number"||!Number.isInteger(days)||days<1||days>30)return {error:"Choose a validity period of 1–30 days."} as const;
 return {scope,delivery,cents,days} as const;
}
export async function supportThread(db:D1Database,id:string,family?:string,user?:string){
 const sql="SELECT id,family_id,user_id,status FROM parent_feedback WHERE id=? AND page_hint='learning-support'";
 return family!==undefined&&user!==undefined?db.prepare(sql+" AND family_id=? AND user_id=?").bind(id,family,user).first<any>():db.prepare(sql).bind(id).first<any>();
}
export async function listSupportQuotes(db:D1Database,id:string,now=new Date()){
 const {results}=await db.prepare("SELECT id,scope,delivery,amount_cents,currency,status,created_at,expires_at,responded_at,withdrawn_at FROM learning_support_quotes WHERE feedback_id=? ORDER BY created_at DESC,id DESC LIMIT 100").bind(id).all<any>();
 return (results||[]).map(q=>({...q,status:q.status==="offered"&&q.expires_at<=now.toISOString()?"expired":q.status}));
}
