import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {ownerToday} from "../src/unifiedOwnerToday.ts";
test("Today uses Sydney boundaries and groups real work without mutating payment or private notes",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const now=new Date("2026-11-26T00:00:00.000Z"),stamp=now.toISOString();
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES('r','p@example.com','Parent','Reading','PRIVATE',?,?)").run(stamp,stamp);
 const order=(id,status,start,end)=>db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,'guest','r',?,2500,'PRIVATE','Live','Terms','live',?,?,?,?,?)").run(id,"q"+id,start,end,status,stamp,stamp);
 order("paid","paid","2026-11-26T01:00:00.000Z","2026-11-26T01:30:00.000Z");
 order("unpaid","confirmed","2026-11-27T01:00:00.000Z","2026-11-27T01:30:00.000Z");
 order("overdue","confirmed","2026-11-28T01:00:00.000Z","2026-11-28T01:30:00.000Z");
 db.raw.prepare("INSERT INTO support_manual_invoices(order_id,reference,due_at,issued_at,issued_by) VALUES('overdue','INV-1','2026-11-25T23:00:00.000Z',?,'owner')").run(stamp);
 db.raw.prepare("INSERT INTO support_english_classes(id,week_of,start_at,end_at,topic,preparation,created_at) VALUES('class','2026-11-23','2026-11-26T03:00:00.000Z','2026-11-26T04:00:00.000Z','Stories','PRIVATE',?)").run(stamp);
 const r=await ownerToday(db,now),g=Object.fromEntries(r.groups.map(g=>[g.category,g]));
 assert.equal(r.date,"2026-11-26");assert.equal(g.schedule.total,2);assert.equal(g.preparation.total,1);assert.equal(g.enquiries.total,1);assert.equal(g.invoice.total,1);assert.equal(g.attention.items[0].action,"overdue_invoice");assert.equal(g.payment.total,0);
 assert.equal(JSON.stringify(r).includes("PRIVATE"),false);
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='overdue'").get().status,"confirmed");
});
