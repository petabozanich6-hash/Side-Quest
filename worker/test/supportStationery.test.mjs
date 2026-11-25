import test from "node:test";
import assert from "node:assert/strict";
import {buildStationeryPdf,validateStationery,stationeryEmailEnabled,sendStationery} from "../src/supportStationery.ts";
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
