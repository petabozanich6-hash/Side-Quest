import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {listStationery,saveStationery,downloadStationery,deliverSavedStationery,lessonReportQueue} from "../src/supportStationeryHistory.ts";
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

test("proposal automatically carries exact versioned terms, cannot deliver without explicit environment approval",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const now="2026-11-25T00:00:00Z";
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("terms-g","parent@example.test","Parent","Support","Request",now,now);
 const env={DB:db,SUPPORT_STATIONERY_EMAIL:"true",EMAIL:{send:async()=>{throw Error("must not send draft");}}};
 const doc=await prepareStationery(env,"guest","terms-g",null,{kind:"proposal",sections:["Needs","Support","Fee","Reply"]});
 assert.ok(doc.terms);assert.equal(doc.terms.version,"2026-11-25-v1");
 const review={reviewed:true,recipient_confirmed:doc.recipient,fingerprint:await stationeryFingerprint(doc)};
 const saved=await saveStationery(db,"guest","terms-g",null,doc,review);
 const copy=await downloadStationery(db,"guest","terms-g",saved.id);
 assert.deepEqual(Uint8Array.from(atob(copy.terms.base64),c=>c.charCodeAt(0)),doc.terms.pdf);
 assert.ok("error" in await deliverSavedStationery(env,"guest","terms-g",saved.id,review));
 assert.equal((await listStationery(db,"guest","terms-g"))[0].status,"saved");
});

test("session report uses only explicit parent-facing fields, never private diary or another family",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const at="2026-01-01T00:00:00.000Z",end="2026-01-01T01:00:00.000Z";
 for(const id of ["report-a","report-b"])db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run(id,id+"@example.test","Parent","Learning","Enquiry",at,at);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run("report-order","guest","report-a","report-quote",3000,"PRIVATE_SCOPE","Online","Terms","live",at,end,"completed",at,at);
 const details={report_covered:"Equivalent fractions",report_strengths:"Explained the numerator",report_practice:"Compare denominators",report_home_activity:"Fold a piece of paper into equal parts",reflection:"PRIVATE_REFLECTION",agenda:"PRIVATE_TUTOR_GUIDE"};
 db.raw.prepare("INSERT INTO support_tutor_diary(order_id,learner_label,details_json,updated_at) VALUES(?,?,?,?)").run("report-order","Learner",JSON.stringify(details),at);
 const points=[{id:"a",label:"Equivalent fractions",home:"Fold a piece of paper into equal parts",status:"covered",observed_at:at},{id:"b",label:"Explained the numerator",home:"",status:"independent",observed_at:at},{id:"c",label:"Compare denominators",home:"",status:"practise",observed_at:at},{id:"d",label:"UNATTEMPTED",home:"",status:"not_started",observed_at:null}];
 db.raw.prepare("INSERT INTO support_lesson_progress(order_id,checkpoints_json,updated_at) VALUES(?,?,?)").run("report-order",JSON.stringify(points),at);
 const env={DB:db};
 const doc=await prepareStationery(env,"guest","report-a","report-order",{from_session_diary:true});
 assert.ok(!("error" in doc));assert.equal(doc.kind,"session_report");assert.equal(doc.recipient,"report-a@example.test");
 const pdf=new TextDecoder().decode(doc.pdf);
 for(const k of ["Equivalent fractions","Explained the numerator","Compare denominators","Fold a piece of paper"])assert.ok(pdf.includes(k));
 assert.ok(!pdf.includes("PRIVATE_"));
 assert.ok("error" in await prepareStationery(env,"guest","report-b","report-order",{from_session_diary:true}));
 assert.ok(!pdf.includes("UNATTEMPTED"));
 db.raw.prepare("UPDATE support_lesson_progress SET checkpoints_json=? WHERE order_id=?").run(JSON.stringify(points.map(p=>({...p,status:"not_started"}))),"report-order");
 assert.ok("error" in await prepareStationery(env,"guest","report-a","report-order",{from_session_diary:true}));
});

test("end-of-day queue distinguishes observed and unobserved lessons and saved reports",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());const at="2026-01-01T00:00:00.000Z",end="2026-01-01T01:00:00.000Z";
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("queue","parent@example.test","Parent","Support","Request",at,at);
 for(const id of ["observed","unobserved","future"])db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(id,"guest","queue",id+"-quote",3000,"Learning","Online","Terms","live",at,id==="future"?"2027-01-01T00:00:00.000Z":end,"paid",at,at);
 const now=new Date("2026-11-25T00:00:00Z");
 for(const id of ["observed","unobserved"])db.raw.prepare("INSERT INTO support_lesson_progress(order_id,checkpoints_json,updated_at) VALUES(?,?,?)").run(id,JSON.stringify([{id:"a",label:"Compare fractions",home:"Fold paper",status:id==="observed"?"supported":"not_started",observed_at:at}]),at);
 let q=await lessonReportQueue(db,now);assert.equal(q.items.length,2);assert.equal(q.items.find(x=>x.id==="observed").report_status,"needs_review");assert.equal(q.items.find(x=>x.id==="unobserved").report_status,"no_progress");assert.ok(!JSON.stringify(q).includes("Compare fractions"));
 const doc=await prepareStationery({DB:db},"guest","queue","observed",{from_session_diary:true});assert.ok(!("error" in doc),doc.error);
 await saveStationery(db,"guest","queue","observed",doc,{reviewed:true,recipient_confirmed:doc.recipient,fingerprint:await stationeryFingerprint(doc)});
 q=await lessonReportQueue(db,now);assert.equal(q.items.find(x=>x.id==="observed").report_status,"saved");
});

test("uploaded Square invoice and manually copied payment link travel together only to the reviewed parent",async t=>{
 const {uploadCorrespondenceAttachment,downloadCorrespondenceAttachment,saveCorrespondencePaymentLink,squarePaymentLink}=await import("../src/supportCorrespondenceAttachments.ts");
 const db=makeDb();t.after(()=>db.raw.close());const at="2026-11-25T00:00:00.000Z";
 for(const id of ["invoice-a","invoice-b"])db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run(id,id+"@example.test","Parent","Support","Enquiry",at,at);
 const blobs=new Map(),sent=[],BUCKET={put:async(k,v)=>blobs.set(k,new Uint8Array(v)),get:async k=>{const v=blobs.get(k);return v?{size:v.length,arrayBuffer:async()=>v.buffer}:null;},delete:async k=>blobs.delete(k)};
 const env={DB:db,BUCKET,SUPPORT_STATIONERY_EMAIL:"true",EMAIL:{send:async msg=>{sent.push(msg);return {messageId:"test"};}}};
 const doc=await prepareStationery(env,"guest","invoice-a",null,{kind:"letter",sections:["Your payment arrangements."]});
 const review={reviewed:true,recipient_confirmed:doc.recipient,fingerprint:await stationeryFingerprint(doc)};
 const saved=await saveStationery(db,"guest","invoice-a",null,doc,review);
 const invoice=buildStationeryPdf({kind:"letter",sections:["Synthetic invoice only"]},at.slice(0,10)).pdf;
 const base64=btoa(String.fromCharCode(...invoice));
 assert.ok("error" in await uploadCorrespondenceAttachment(env,"guest","invoice-b",saved.id,{reviewed:true,filename:"invoice.pdf",base64}));
 const upload=await uploadCorrespondenceAttachment(env,"guest","invoice-a",saved.id,{reviewed:true,filename:"invoice.pdf",base64});assert.ok(upload.ok,upload.error);
 const aid=upload.attachments[0].id,link="https://squareup.com/pay-invoice/example";
 assert.equal(await downloadCorrespondenceAttachment(env,"guest","invoice-b",saved.id,aid),null);
 for(const bad of ["https://squareup.com.evil.test/pay-invoice/example","javascript:alert(1)","https://squareup.com@evil.test/pay-invoice/example"])assert.equal(squarePaymentLink(bad),null);
 assert.equal(await saveCorrespondencePaymentLink(db,"guest","invoice-a",saved.id,{reviewed:true,url:link}),true);
 assert.ok("error" in await deliverSavedStationery(env,"guest","invoice-a",saved.id,review));
 assert.equal(sent.length,0);
 const delivery=await deliverSavedStationery(env,"guest","invoice-a",saved.id,{...review,attachment_ids:[aid],payment_link:link});
 assert.equal(delivery.email_notification_sent,true);assert.equal(sent[0].to,doc.recipient);assert.equal(sent[0].attachments.length,2);assert.equal(sent[0].attachments[1].filename,"invoice.pdf");assert.deepEqual(sent[0].attachments[1].content,invoice);assert.ok(sent[0].text.includes(link));
 assert.equal(await saveCorrespondencePaymentLink(db,"guest","invoice-a",saved.id,{reviewed:true,url:"https://square.link/u/other"}),false);
});

test("provisional appointment payment request becomes a dated confirmation only after full verified payment",async t=>{
 const {sendBookingConfirmation,bookingNotificationStatus}=await import("../src/supportBookingNotifications.ts");
 const {recordManualInvoice,verifyManualInvoice}=await import("../src/supportOrders.ts");
 const db=makeDb();t.after(()=>db.raw.close());
 const at="2026-11-25T00:00:00.000Z",now=new Date(at),start="2026-12-08T00:00:00.000Z",end="2026-12-08T00:30:00.000Z";
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("book","parent@example.test","Parent","Support","Request",at,at);
 db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run("book-order","guest","book","book-q",3500,"Learning","Online","Agreed terms","live",start,end,"confirmed",at,at);
 const sent=[],env={DB:db,SUPPORT_STATIONERY_EMAIL:"true",EMAIL:{send:async msg=>{sent.push(msg);return {messageId:"test"};}}};
 const portal="https://sidequestlearning.app/learning-support/portal";
 assert.equal(await sendBookingConfirmation(env,"guest","book","book-order",portal,now),false);
 assert.ok((await recordManualInvoice(db,"guest","book","book-order",{reference:"INV-BOOK-1",due_at:"2026-12-07T00:00:00.000Z",issued_in_square:true},"owner",now)).ok);
 const doc=await prepareStationery(env,"guest","book","book-order",{from_booking:true});
 assert.ok(!("error" in doc),doc.error);assert.equal(doc.kind,"booking_payment");
 const text=new TextDecoder().decode(doc.pdf);assert.match(text,/INV-BOOK-1/);assert.match(text,/35\.00/);assert.match(text,/provisionally reserved/);
 const review={reviewed:true,recipient_confirmed:doc.recipient,fingerprint:await stationeryFingerprint(doc)};
 const saved=await saveStationery(db,"guest","book","book-order",doc,review);
 assert.equal(await verifyManualInvoice(db,"guest","book","book-order",{reference:"INV-BOOK-1",amount_cents:3499,paid_in_square:true},"owner",now),false);
 assert.equal(await verifyManualInvoice(db,"guest","book","book-order",{reference:"INV-BOOK-1",amount_cents:3500,paid_in_square:true},"owner",now),true);
 assert.ok("error" in await deliverSavedStationery(env,"guest","book",saved.id,review));
 assert.equal(await sendBookingConfirmation(env,"guest","other","book-order",portal,now),false);
 assert.equal(await sendBookingConfirmation(env,"guest","book","book-order",portal,now),true);
 assert.equal(await sendBookingConfirmation(env,"guest","book","book-order",portal,now),false);
 assert.equal(sent.length,1);assert.equal(sent[0].to,"parent@example.test");assert.match(sent[0].text,/8 December 2026/);assert.match(sent[0].text,/35\.00/);assert.match(sent[0].text,/INV-BOOK-1/);
 assert.equal((await bookingNotificationStatus(db,"guest","book","book-order")).status,"sent");
});
