import type {Env} from "./types";
import {SERVICE_TERMS_VERSION,SERVICE_TERMS_DATE,SERVICE_TERMS_FIELDS,SERVICE_TERMS_SECTIONS} from "./supportServiceTerms";
import {getOrder,type Channel} from "./supportOrders";
import {readQuotePlan} from "./supportQuotePlans";
import {sendEmail,layout,p,esc,SUPPORT_EMAIL,SITE_URL} from "./email";

// Parent-facing content is entered separately; never import the private tutor diary.
export const STATIONERY={
 terms:{title:"Learning Support Service Agreement",fields:SERVICE_TERMS_FIELDS},
 letter:{title:"Parent correspondence",fields:["Message"]},
 proposal:{title:"Learning support proposal",fields:["What we understand","Suggested support","Proposed arrangements and fees","Next steps"]},
 progress:{title:"Learning progress report",fields:["Learning focus","Progress and strengths","Areas to practise","Recommended next steps"]},
 summary:{title:"Session summary",fields:["What we worked on","What went well","Follow-up activities"]},
 session_report:{title:"Today’s learning update",fields:["What we covered","What went well","What to keep practising","Try this at home"]},
 plan:{title:"Personalised learning plan",fields:["Learning goals","Learning approach","Activities and resources","Review and next steps"]},
 activity:{title:"Home practice sheet",fields:["Instructions","Activities","Helpful hints"]},
 recommendations:{title:"Learning recommendations",fields:["Observations","Suggested strategies","Resources and next steps"]},
} as const;
type Kind=keyof typeof STATIONERY;
type Draft={kind:Kind;learner:string;sections:string[]};
export function validateStationery(raw:any):Draft{
 if(!raw||!Object.prototype.hasOwnProperty.call(STATIONERY,raw.kind))throw Error("Choose a document template.");
 const kind=raw.kind as Kind,fields=STATIONERY[kind].fields;
 const learner=typeof raw.learner==="string"?raw.learner.trim():"";
 if(learner.length>80||/[\r\n\x00-\x1f]/.test(learner))throw Error("Use a short agreed learner name or nickname.");
 if(!Array.isArray(raw.sections)||raw.sections.length!==fields.length||raw.sections.some((v:any)=>typeof v!=="string"||v.length>4000||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v))||raw.sections.join("").length>10000||!raw.sections.some((s:string)=>s.trim()))throw Error("Enter parent-facing content (up to 10,000 characters total).");
 const sections=raw.sections.map((s:string)=>s.trim());
 if(sections.reduce((n:number,s:string)=>n+s.split(/\r\n?|\n/).length,0)>300)throw Error("Use up to 300 lines per document.");
 return {kind,learner,sections};
}
const encoder=new TextEncoder();
const normalize=(v:string)=>v.replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/\u2022/g,"-").replace(/\u00a0/g," ");
function pdfText(v:string){
 // WinAnsi is sufficient for Latin-1, but do not silently corrupt other scripts.
 const s=normalize(v);if(/[^\x20-\x7e\xa0-\xff]/.test(s))throw Error("This PDF template currently supports Latin-script text only. Remove unsupported symbols before exporting.");
 return Array.from(s,c=>c.charCodeAt(0)>126?"\\"+c.charCodeAt(0).toString(8).padStart(3,"0"):"\\()".includes(c)?"\\"+c:c).join("");
}
function wrap(value:string,limit:number):string[]{
 const out:string[]=[];
 for(const paragraph of normalize(value).replace(/\r\n?/g,"\n").split("\n")){
  let line="";
  for(let word of paragraph.split(/\s+/).filter(Boolean)){
   if(line&&line.length+1+word.length>limit){out.push(line);line="";}
   while(word.length>limit){out.push(word.slice(0,limit));word=word.slice(limit);}
   line+=(line?" ":"")+word;
  }
  out.push(line);
 }
 return out;
}
export function buildStationeryPdf(raw:any,date:string){
 const d=validateStationery(raw),template=STATIONERY[d.kind],pages:string[][]=[];
 let page:string[]=[],y=0;
 const text=(s:string,x:number,at:number,size=11,bold=false,color="0.17 0.17 0.15")=>page.push(color+" rg BT /"+(bold?"B":"R")+" "+size+" Tf "+x+" "+at+" Td ("+pdfText(s)+") Tj ET");
 const rule=(at:number,color="0.83 0.78 0.66")=>page.push(color+" RG 0.7 w 48 "+at+" m 547 "+at+" l S");
 const next=()=>{
  page=[];pages.push(page);y=706;
  text("SIDE-QUEST LEARNING",48,791,19,true,"0.12 0.23 0.18");
  text("PERSONALISED LEARNING SUPPORT",48,773,9,true,"0.29 0.36 0.23");
  rule(759);
  text(template.title,48,735,15,true,"0.12 0.23 0.18");
  text(date,48,718,9);
 };
 next();
 if(d.learner){for(const line of wrap("Prepared for: "+d.learner,47)){text(line,48,y,10);y-=15;}y-=10;}
 for(let i=0;i<template.fields.length;i++){
  const value=d.sections[i];if(!value)continue;
  if(y<105)next();
  text(template.fields[i],48,y,12,true,"0.12 0.23 0.18");y-=20;
  for(const line of wrap(value,48)){
   if(y<84){next();text(template.fields[i]+" (continued)",48,y,11,true);y-=20;}
   text(line,48,y);y-=16;
  }
  y-=17;
 }
 if(d.kind==="activity"){
  if(y<220)next();
  text("My working / notes",48,y,12,true);y-=23;
  for(let j=0;j<6;j++){rule(y,"0.84 0.84 0.81");y-=24;}
 }
 const objs=["","","","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"];
 const ids:number[]=[];
 for(let i=0;i<pages.length;i++){
  page=pages[i];rule(62);text("Private parent copy | "+SUPPORT_EMAIL,48,46,8);
  text("Page "+(i+1)+" of "+pages.length,474,46,8);
  text("sidequestlearning.app",48,33,8);
  const stream=page.join("\n"),pid=objs.length,sid=pid+1;ids.push(pid);
  objs.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /R 3 0 R /B 4 0 R >> >> /Contents "+sid+" 0 R >>","<< /Length "+encoder.encode(stream).length+" >>\nstream\n"+stream+"\nendstream");
 }
 objs[1]="<< /Type /Catalog /Pages 2 0 R >>";objs[2]="<< /Type /Pages /Kids ["+ids.map(id=>id+" 0 R").join(" ")+"] /Count "+ids.length+" >>";
 let pdf="%PDF-1.4\n",offsets=[0];
 for(let i=1;i<objs.length;i++){offsets.push(encoder.encode(pdf).length);pdf+=i+" 0 obj\n"+objs[i]+"\nendobj\n";}
 const xref=encoder.encode(pdf).length;
 pdf+="xref\n0 "+objs.length+"\n0000000000 65535 f \n"+offsets.slice(1).map(n=>String(n).padStart(10,"0")+" 00000 n \n").join("")+"trailer\n<< /Size "+objs.length+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF\n";
 return {pdf:encoder.encode(pdf),pages:pages.length,filename:"sidequest-"+d.kind+".pdf",title:template.title,kind:d.kind};
}
export function stationeryEmailEnabled(e:Env){return e.SUPPORT_STATIONERY_EMAIL==="true"&&!!e.EMAIL&&!e.STAGING_KEY&&e.STAGING_PRIVATE!=="true";}
export type TermsAttachment={filename:string;pdf:Uint8Array;version:string;pages:number};
export function serviceTermsAttachment():TermsAttachment{const doc=buildStationeryPdf({kind:"terms",sections:[...SERVICE_TERMS_SECTIONS]},SERVICE_TERMS_DATE);return {filename:"sidequest-learning-support-service-terms.pdf",pdf:doc.pdf,version:SERVICE_TERMS_VERSION,pages:doc.pages};}
export function needsServiceTerms(kind:string){return kind==="proposal"||kind==="plan";}
export type PreparedStationery=ReturnType<typeof buildStationeryPdf>&{recipient:string;email_enabled:boolean;terms?:TermsAttachment};
export function termsDeliveryApproved(e:Env,version:string){return !version.includes("draft")&&version===SERVICE_TERMS_VERSION&&e.SUPPORT_TERMS_APPROVED_VERSION===version;}
export async function prepareStationery(e:Env,channel:Channel,id:string,oid:string|null,b:any):Promise<PreparedStationery|{error:string}>{
 if(oid){const order=await getOrder(e.DB,channel,id,oid);
 if(!order||order.status==="cancelled"||order.status==="review"||order.checkout_started_at)return {error:"An active, non-legacy service order is required."};}
 const recipient=channel==="guest"?await e.DB.prepare("SELECT email FROM support_guest_requests WHERE id=?").bind(id).first<{email:string}>():await e.DB.prepare("SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(id).first<{email:string}>();
 if(!recipient?.email)return {error:"Parent email not found."} as const;
 const date=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",dateStyle:"long"}).format(new Date());
 try{if(b?.from_session_diary===true){
 if(!oid)return {error:"Choose a completed lesson."};
 const order=await getOrder(e.DB,channel,id,oid);
 if(!order||order.mode!=="live"||!["paid","completed"].includes(order.status)||!order.end_at||Date.parse(order.end_at)>Date.now())return {error:"A delivered live lesson is required."};
 const row=await e.DB.prepare("SELECT learner_label,details_json FROM support_tutor_diary WHERE order_id=?").bind(oid).first<{learner_label:string;details_json:string}>();
 const details=row?JSON.parse(row.details_json):{};
 const keys=["report_covered","report_strengths","report_practice","report_home_activity"];
 const sections=keys.map(k=>typeof details[k]==="string"?details[k].trim():"");
 if(sections.some(v=>!v))return {error:"Save all four parent-update fields in the private diary first."};
 b={kind:"session_report",learner:row?.learner_label||"",sections};
 }if(typeof b?.quote_id==="string"&&b.quote_id){
 const q=await e.DB.prepare(channel==="guest"?"SELECT scope,delivery,amount_cents,expires_at FROM support_guest_quotes WHERE id=? AND request_id=?":"SELECT q.scope,q.delivery,q.amount_cents,q.expires_at FROM learning_support_quotes q JOIN parent_feedback f ON f.id=q.feedback_id WHERE q.id=? AND q.feedback_id=? AND f.page_hint=\'learning-support\'").bind(b.quote_id,id).first<any>();
 if(!q)return {error:"Proposal unavailable."};
 const plan=await readQuotePlan(e.DB,channel,id,b.quote_id,false);
 const sections=[plan?[plan.title,plan.subject+" | "+plan.year_level,plan.goal].join("\n"):q.scope,plan?plan.lessons.map((l:any,i:number)=>["Lesson "+(i+1)+": "+l.title+" ("+l.minutes+" min)",l.objective,l.activities,"Progress check: "+l.check,"Home practice: "+l.home_practice].join("\n")).join("\n\n"):q.scope,q.delivery+"\nTotal: AUD "+(q.amount_cents/100).toFixed(2)+"\nValid until "+new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",dateStyle:"long"}).format(new Date(q.expires_at)),"Review the attached service agreement and discuss suitable appointments. Expressing interest does not create a booking or charge."];
 b={kind:"proposal",sections};
 }if(b?.kind==="terms")return {error:"Use the versioned agreement, not editable terms."};const doc=buildStationeryPdf(b,date);return {...doc,recipient:recipient.email,email_enabled:stationeryEmailEnabled(e),...(needsServiceTerms(doc.kind)?{terms:serviceTermsAttachment()}: {})};}catch(err){return {error:err instanceof Error?err.message:"Invalid document."} as const;}
}
export async function sendStationery(e:Env,doc:PreparedStationery,b:any){
 if(!stationeryEmailEnabled(e)||!doc.email_enabled||b.reviewed!==true||b.recipient_confirmed!==doc.recipient)return false;
 if(needsServiceTerms(doc.kind)&&(!doc.terms||!termsDeliveryApproved(e,doc.terms.version)))return false;
 const attachments=[{filename:doc.filename,type:"application/pdf",content:doc.pdf,disposition:"attachment" as const},...(doc.terms?[{filename:doc.terms.filename,type:"application/pdf",content:doc.terms.pdf,disposition:"attachment" as const}]:[])];
 const extra=doc.terms?" The separate service agreement is also attached; review it before accepting the arrangements.":"";
 return sendEmail(e,{to:doc.recipient,subject:"Side-Quest Learning Support: "+doc.title,text:"Your personalised learning support document is attached."+extra+" Please keep it private. Reply to "+SUPPORT_EMAIL+" if you have questions.",html:layout({preheader:"Your personal learning support document.",kicker:"Learning Support",heading:doc.title,body:p("Your personalised document is attached as a PDF."+extra+" Please keep it private and contact us if you have questions.")+p(esc(SITE_URL)),reason:"This is correspondence about your learning support service."}),attachments});
}

export async function stationeryRecipient(db:D1Database,channel:Channel,id:string){
 return channel==="guest"?db.prepare("SELECT email FROM support_guest_requests WHERE id=?").bind(id).first<{email:string}>():db.prepare("SELECT u.email FROM parent_feedback p JOIN users u ON u.id=p.user_id WHERE p.id=? AND p.page_hint='learning-support'").bind(id).first<{email:string}>();
}
export function stationeryBase64(pdf:Uint8Array){
 let raw="";for(let i=0;i<pdf.length;i+=8192)raw+=String.fromCharCode(...pdf.subarray(i,i+8192));return btoa(raw);
}
export async function stationeryFingerprint(doc:PreparedStationery){
 const bytes=new TextEncoder().encode(JSON.stringify([doc.recipient,doc.filename,stationeryBase64(doc.pdf),doc.terms?.version??null,doc.terms?stationeryBase64(doc.terms.pdf):null]));
 const hash=await crypto.subtle.digest("SHA-256",bytes);
 return Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,"0")).join("");
}
