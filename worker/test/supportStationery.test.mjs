import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {listStationery,saveStationery,downloadStationery,deliverSavedStationery} from "../src/supportStationeryHistory.ts";
import {buildStationeryPdf,validateStationery,stationeryEmailEnabled,sendStationery,prepareStationery,stationeryFingerprint} from "../src/supportStationery.ts";
const date="25 November 2026";
test("branded A4 stationery has stable parent-facing content and a valid cross-reference table",()=>{
 const r=buildStationeryPdf({kind:"letter",learner:"Sample learner",sections:["Hello (parent)\\ test."]},date);
 const pdf=new TextDecoder().decode(r.pdf);
 assert.equal(r.pages,1);assert.equal(r.filename,"sidequest-letter.pdf");
 assert.match(pdf,/SIDE-QUEST LEARNING/);assert.match(pdf,/Sample learner/);
 assert.ok(pdf.includes("Hello \\(parent\\)\\\\ test."));assert.match(pdf,/MediaBox \[0 0 595 842\]/);
 const offset=Number(pdf.match(/startxref\n(\d+)/)[1]);assert.equal(pdf.slice(offset,offset+4),"xref");
 const entries=pdf.slice(offset).split("\n").slice(3,3+Number(pdf.match(/xref\n0 (\d+)/)[1])-1);
 entries.forEach((entry,i)=>assert.ok(pdf.slice(Number(entry.slice(0,10))).startsWith((i+1)+" 0 obj")));
});
test("long reports paginate with repeated branding and preserve final line",()=>{
 const r=buildStationeryPdf({kind:"progress",learner:"",sections:[("A useful practice activity.\n").repeat(120),"Strengths","Practice","Final recommendation"]},date);
 assert.ok(r.pages>1);const text=new TextDecoder().decode(r.pdf);
 assert.ok(text.includes("Final recommendation"));assert.ok(text.includes("Page "+r.pages+" of "+r.pages));
});
test("worksheet provides writing rules; unknown templates, blank or excessive text rejected",()=>{
 const r=buildStationeryPdf({kind:"activity",learner:"",sections:["Read carefully","Write the answer",""]},date);
 assert.match(new TextDecoder().decode(r.pdf),/My working \/ notes/);
 for(const d of [{kind:"__proto__",sections:["x"]},{kind:"letter",sections:[""]},{kind:"letter",sections:["x".repeat(4001)]}])assert.throws(()=>validateStationery(d));
 assert.throws(()=>buildStationeryPdf({kind:"letter",sections:["Emoji 😀"]},date),/Latin-script/);
});
test("direct email is explicitly opt-in, and cannot send from private staging",()=>{
 const EMAIL={send:async()=>({messageId:"fake"})};
 assert.equal(stationeryEmailEnabled({EMAIL}),false);
 assert.equal(stationeryEmailEnabled({EMAIL,SUPPORT_STATIONERY_EMAIL:"true",STAGING_PRIVATE:"true"}),false);
 assert.equal(stationeryEmailEnabled({EMAIL,SUPPORT_STATIONERY_EMAIL:"true",STAGING_KEY:"test"}),false);
 assert.equal(stationeryEmailEnabled({EMAIL,SUPPORT_STATIONERY_EMAIL:"true"}),true);
});
test("review and exact scoped recipient required; sends only generated PDF to that recipient",async()=>{
 const sent=[];const e={SUPPORT_STATIONERY_EMAIL:"true",EMAIL:{send:async msg=>{sent.push(msg);return {messageId:"fake"};}}};
 const doc={...buildStationeryPdf({kind:"letter",sections:["Sample parent document"]},date),recipient:"parent@example.test",email_enabled:true};
 assert.equal(await sendStationery(e,doc,{reviewed:true,recipient_confirmed:"other@example.test"}),false);
 assert.equal(await sendStationery(e,doc,{reviewed:false,recipient_confirmed:doc.recipient}),false);
 assert.equal(await sendStationery(e,doc,{reviewed:true,recipient_confirmed:doc.recipient}),true);
 assert.equal(sent.length,1);assert.equal(sent[0].to,doc.recipient);assert.equal(sent[0].attachments[0].type,"application/pdf");
});

test("standalone enquiry needs no account, subscription, order or payment; saved documents are scoped and immutable",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const now="2026-11-25T00:00:00Z";
 for(const id of ["guest-a","guest-b"])db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run(id,id+"@example.test","Sample parent","Learning","Enquiry",now,now);
 const deliveries=[],env={DB:db,SUPPORT_STATIONERY_EMAIL:"true",EMAIL:{send:async msg=>{deliveries.push(msg);return {messageId:"test"};}}};
 const draft={kind:"letter",learner:"Sample",sections:["Sample correspondence"]};
 const doc=await prepareStationery(env,"guest","guest-a",null,draft);assert.ok(!("error" in doc));
 assert.equal(doc.recipient,"guest-a@example.test");
 const review={reviewed:true,recipient_confirmed:doc.recipient,fingerprint:await stationeryFingerprint(doc)};
 assert.equal(await saveStationery(db,"guest","guest-a",null,doc,{...review,fingerprint:"changed"}),null);
 const saved=await saveStationery(db,"guest","guest-a",null,doc,review);
 assert.ok(saved.id);assert.equal(saved.status,"saved");
 assert.equal((await saveStationery(db,"guest","guest-a",null,doc,review)).id,saved.id);
 assert.equal((await listStationery(db,"guest","guest-a")).length,1);
 assert.equal((await listStationery(db,"guest","guest-b")).length,0);
 assert.equal(await downloadStationery(db,"guest","guest-b",saved.id),null);
 assert.equal(await downloadStationery(db,"member","guest-a",saved.id),null);
 const copy=await downloadStationery(db,"guest","guest-a",saved.id);
 assert.deepEqual(Uint8Array.from(atob(copy.base64),c=>c.charCodeAt(0)),doc.pdf);
 assert.ok("error" in await deliverSavedStationery(env,"guest","guest-b",saved.id,review));
 const results=await Promise.all([deliverSavedStationery(env,"guest","guest-a",saved.id,review),deliverSavedStationery(env,"guest","guest-a",saved.id,review)]);
 assert.equal(results.filter(r=>r.email_notification_sent===true).length,1);assert.equal(deliveries.length,1);
 assert.equal(deliveries[0].to,doc.recipient);assert.deepEqual(deliveries[0].attachments[0].content,doc.pdf);
 assert.equal((await listStationery(db,"guest","guest-a"))[0].status,"sent");
});
test("failed delivery is retained for manual review, not retried",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const now="2026-11-25T00:00:00Z";
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("g","parent@example.test","Sample","Learning","Enquiry",now,now);
 let attempts=0;const env={DB:db,SUPPORT_STATIONERY_EMAIL:"true",EMAIL:{send:async()=>{attempts++;throw Error("synthetic failure");}}};
 const doc=await prepareStationery(env,"guest","g",null,{kind:"letter",sections:["Sample"]});
 const review={reviewed:true,recipient_confirmed:doc.recipient,fingerprint:await stationeryFingerprint(doc)};
 const saved=await saveStationery(db,"guest","g",null,doc,review);
 assert.equal((await deliverSavedStationery(env,"guest","g",saved.id,review)).email_notification_sent,false);
 assert.equal((await listStationery(db,"guest","g"))[0].status,"review");
 assert.ok("error" in await deliverSavedStationery(env,"guest","g",saved.id,review));assert.equal(attempts,1);
});

test("proposal automatically carries exact versioned terms, cannot deliver an unapproved draft",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const now="2026-11-25T00:00:00Z";
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("terms-g","parent@example.test","Parent","Support","Request",now,now);
 const env={DB:db,SUPPORT_STATIONERY_EMAIL:"true",EMAIL:{send:async()=>{throw Error("must not send draft");}}};
 const doc=await prepareStationery(env,"guest","terms-g",null,{kind:"proposal",sections:["Needs","Support","Fee","Reply"]});
 assert.ok(doc.terms);assert.match(doc.terms.version,/draft/);
 const review={reviewed:true,recipient_confirmed:doc.recipient,fingerprint:await stationeryFingerprint(doc)};
 const saved=await saveStationery(db,"guest","terms-g",null,doc,review);
 const copy=await downloadStationery(db,"guest","terms-g",saved.id);
 assert.deepEqual(Uint8Array.from(atob(copy.terms.base64),c=>c.charCodeAt(0)),doc.terms.pdf);
 assert.ok("error" in await deliverSavedStationery(env,"guest","terms-g",saved.id,review));
 assert.equal((await listStationery(db,"guest","terms-g"))[0].status,"saved");
});
