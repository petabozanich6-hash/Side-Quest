import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {earliestSupportStart,permitsSupportStart} from "../src/supportLeadTime.ts";
import {requestAppointmentCancellation,dismissCancellation,cancelPaidAppointment,pendingCancellations,processSupportInvoiceNotices,sendFinalPaymentWarning} from "../src/supportPaymentSafety.ts";
const now=new Date("2026-11-25T00:00:00.000Z"),at=now.toISOString(),start="2026-12-08T00:00:00.000Z",end="2026-12-08T01:00:00.000Z";
function fixture(t){const db=makeDb();t.after(()=>db.raw.close());for(const id of ["a","b"])db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run(id,id+"@example.test","Parent","Support","Enquiry",at,at);
 const add=(id,status)=>db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(id,"guest","a",id+"-quote",3000,"Learning support","Online","Agreed terms","live",start,end,status,at,at);return {db,add};}
test("earlier tutor-offered times are permitted after the original enquiry",async t=>{const {db}=fixture(t);assert.equal(await earliestSupportStart(db,"guest","a"),Date.parse(at));assert.equal(await permitsSupportStart(db,"guest","a",["2026-11-24T23:59:59.999Z"]),false);assert.equal(await permitsSupportStart(db,"guest","a",["2026-11-26T00:00:00Z"]),true);assert.equal(await permitsSupportStart(db,"guest","missing",[start]),false);});
test("parent request does not release a paid appointment; owner must check financial resolution",async t=>{const {db,add}=fixture(t);add("paid","paid");add("other","paid");assert.equal(await requestAppointmentCancellation(db,"guest","b","paid",now),false);assert.equal(await requestAppointmentCancellation(db,"guest","a","paid",now),true);assert.equal(await requestAppointmentCancellation(db,"guest","a","paid",now),true);assert.equal((await pendingCancellations(db)).length,1);assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='paid'").get().status,"paid");assert.equal(await cancelPaidAppointment(db,"guest","a","paid",{confirmed:true},now),false);assert.equal(await dismissCancellation(db,"guest","b","paid",now),false);assert.equal(await cancelPaidAppointment(db,"guest","a","paid",{confirmed:true,financial_resolution_checked:true,parent_notified:true},now),true);assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='other'").get().status,"paid");assert.equal((await pendingCancellations(db)).length,0);});
test("reminder does not cancel or claim live Square balance; repeated cron cannot send twice",async t=>{const {db,add}=fixture(t);add("unpaid","confirmed");db.raw.prepare("INSERT INTO support_manual_invoices(order_id,reference,due_at,issued_at,issued_by) VALUES(?,?,?,?,?)").run("unpaid","INV-SAMPLE","2026-11-25T12:00:00.000Z",at,"owner");const sent=[],env={DB:db,EMAIL:{},SUPPORT_PAYMENT_NOTICES:"true"},sender=async(_,msg)=>{sent.push(msg);return true;};assert.equal((await processSupportInvoiceNotices({...env,STAGING_KEY:"test"},now,sender)).sent,0);await processSupportInvoiceNotices(env,now,sender);await processSupportInvoiceNotices(env,now,sender);assert.equal(sent.length,1);assert.match(sent[0].text,/do not pay again/);await processSupportInvoiceNotices(env,new Date("2026-11-25T13:00:00Z"),sender);assert.equal(sent.length,2);assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='unpaid'").get().status,"confirmed");});

test("owner-verified final warning is scoped, duplicate-safe and does not release the slot",async t=>{
 const {db,add}=fixture(t);add("warning","confirmed");
 db.raw.prepare("INSERT INTO support_manual_invoices(order_id,reference,due_at,issued_at,issued_by) VALUES(?,?,?,?,?)").run("warning","INV-WARNING","2026-11-25T12:00:00.000Z",at,"owner");
 const sent=[],env={DB:db,EMAIL:{},SUPPORT_PAYMENT_NOTICES:"true"},sender=async(_,msg)=>{sent.push(msg);return true;};
 const overdue=new Date("2026-11-25T13:00:00Z"),review={confirmed:true,checked_unpaid_in_square:true};
 assert.ok("error" in await sendFinalPaymentWarning(env,"guest","a","warning",review,now,sender));
 assert.ok("error" in await sendFinalPaymentWarning(env,"guest","b","warning",review,overdue,sender));
 assert.ok("error" in await sendFinalPaymentWarning(env,"guest","a","warning",{confirmed:true},overdue,sender));
 const result=await sendFinalPaymentWarning(env,"guest","a","warning",review,overdue,sender);
 assert.equal(result.warning_email_sent,true);
 assert.equal(sent.length,1);assert.equal(sent[0].to,"a@example.test");assert.match(sent[0].text,/cancel the reservation/);assert.match(sent[0].text,/already paid/);
 assert.ok("error" in await sendFinalPaymentWarning(env,"guest","a","warning",review,overdue,sender));
 assert.equal(db.raw.prepare("SELECT status FROM support_service_orders WHERE id='warning'").get().status,"confirmed");
});
