import test from "node:test";
import assert from "node:assert/strict";
import {standardInvoiceAutomationEnabled,standardInvoiceDueAt,standardReceiptMatches,issueNextStandardSandboxInvoice} from "../src/supportStandardInvoiceAutomation.ts";
test("standard invoice automation is disabled without complete independent sandbox approval",async()=>{
 const env={};
 assert.equal(standardInvoiceAutomationEnabled(env),false);
 assert.deepEqual(await issueNextStandardSandboxInvoice(env,new Date(),()=>{throw Error("Unexpected provider call");}),{status:"disabled"});
});
test("automation requires the exact accepted arrangement, not a subsequently changed order",()=>{
 const row={id:"order-1",amount_cents:2500,start_at:"2026-12-18T00:00:00.000Z",end_at:"2026-12-18T00:30:00.000Z",scope:"Tutoring",delivery:"Online",terms:"Agreed",installment_due_at:null};
 const {installment_due_at,...arrangement}=row;
 const accepted={...row,arrangements_json:JSON.stringify([{...arrangement,due_at:installment_due_at}])};
 assert.equal(standardReceiptMatches(accepted),true);
 for(const patch of [{amount_cents:2600},{start_at:"2026-12-19T00:00:00.000Z"},{terms:"Changed"},{id:"order-2"},{installment_due_at:"2026-12-17T00:00:00.000Z"}])assert.equal(standardReceiptMatches({...accepted,...patch}),false);
 assert.equal(standardReceiptMatches({...accepted,arrangements_json:"bad json"}),false);
});
test("standard invoice deadlines remain at least 24 hours before the session and in the future",()=>{
 const start="2026-12-18T00:00:00.000Z",now=new Date("2026-12-15T00:00:00.000Z");
 assert.equal(standardInvoiceDueAt(start,null,now),"2026-12-17T00:00:00.000Z");
 assert.equal(standardInvoiceDueAt(start,"2026-12-16T00:00:00.000Z",now),"2026-12-16T00:00:00.000Z");
 assert.equal(standardInvoiceDueAt(start,"2026-12-17T12:00:00.000Z",now),null);
 assert.equal(standardInvoiceDueAt(start,null,new Date("2026-12-17T00:00:00.000Z")),null);
});
