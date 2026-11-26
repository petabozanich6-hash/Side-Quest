import type {Env} from "./types";
import {unifiedPortalPilot} from "./unifiedPortalIdentity";
import {isPlatformOwner} from "./access";
import {stationeryBase64} from "./supportStationery";
const encoder=new TextEncoder();
const enc=(s:string)=>encoder.encode(s);
export const SIGNED_TEMPLATE_VERSION="english-club-ignis-v2";
const MAX=1500000;
// Require exactly the approved artwork canvas; browser uploads a flattened RGB JPEG.
export function validCertificateJpeg(b:Uint8Array){
 if(b.length<100||b.length>MAX||b[0]!==255||b[1]!==216||b[b.length-2]!==255||b[b.length-1]!==217)return false;
 let i=2;
 while(i+4<b.length){
  if(b[i++]!==255)return false;
  while(b[i]===255)i++;
  const marker=b[i++];if(marker===0xda||marker===0xd9)return false;
  const n=b[i]*256+b[i+1];if(n<2||i+n>b.length)return false;
  if(marker===0xc0||marker===0xc2)return n>=8&&b[i+2]===8&&b[i+3]*256+b[i+4]===1024&&b[i+5]*256+b[i+6]===1536&&b[i+7]===3;
  i+=n;
 }
 return false;
}
async function hash(b:Uint8Array){return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new Uint8Array(b).buffer)),v=>v.toString(16).padStart(2,"0")).join("");}
export async function signedTemplateStatus(e:Env){
 if(!unifiedPortalPilot(e))return null;
 const row=await e.DB.prepare("SELECT t.id,t.created_at FROM support_club_certificate_template_active a JOIN support_club_certificate_templates t ON t.id=a.template_id WHERE a.singleton=1").first();
 return {storage_available:!!e.BUCKET,active:row||null};
}
export async function saveSignedTemplate(e:Env,owner:string,b:any,now=new Date()){
 if(!unifiedPortalPilot(e)||!e.BUCKET||!await isPlatformOwner(e.DB,owner)||b?.confirmed!==true||typeof b.base64!=="string"||b.base64.length>MAX*4/3+4)return {error:"Private storage and explicit owner approval of the signed artwork are required."};
 let bytes:Uint8Array;try{bytes=Uint8Array.from(atob(b.base64),c=>c.charCodeAt(0));}catch{return {error:"Invalid JPEG."};}
 if(!validCertificateJpeg(bytes))return {error:"Use the prepared 1536 × 1024 RGB signed JPEG (maximum 1.5 MB)."};
 const id=crypto.randomUUID(),key="private/club-certificate-templates/"+id+".jpg",digest=await hash(bytes);
 try{
  await e.BUCKET.put(key,bytes,{httpMetadata:{contentType:"image/jpeg",cacheControl:"private, no-store"}});
  await e.DB.batch([e.DB.prepare("INSERT INTO support_club_certificate_templates(id,object_key,sha256,created_by,created_at) VALUES(?,?,?,?,?)").bind(id,key,digest,owner,now.toISOString()),e.DB.prepare("INSERT INTO support_club_certificate_template_active(singleton,template_id) VALUES(1,?) ON CONFLICT(singleton) DO UPDATE SET template_id=excluded.template_id").bind(id)]);
 }catch{return {error:"Private template storage could not be verified. Review before retrying."};}
 return {saved:true,id};
}
export async function loadSignedTemplate(e:Env,id:string){
 if(!unifiedPortalPilot(e)||!e.BUCKET||!/^[a-zA-Z0-9_-]{1,80}$/.test(id))return null;
 const row=await e.DB.prepare("SELECT object_key,sha256 FROM support_club_certificate_templates WHERE id=?").bind(id).first<{object_key:string;sha256:string}>();
 if(!row||row.object_key!=="private/club-certificate-templates/"+id+".jpg")return null;
 const obj=await e.BUCKET.get(row.object_key);if(!obj||obj.size>MAX)return null;
 const bytes=new Uint8Array(await obj.arrayBuffer());
 return validCertificateJpeg(bytes)&&await hash(bytes)===row.sha256?bytes:null;
}
function pdfText(s:string){
 const v=s.replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/\u00a0/g," ");
 if(/[^\x20-\x7e\xa0-\xff]/.test(v))throw Error("Name or title needs font review.");
 return Array.from(v,c=>c.charCodeAt(0)>126?"\\"+c.charCodeAt(0).toString(8).padStart(3,"0"):"\\()".includes(c)?"\\"+c:c).join("");
}
function join(parts:Uint8Array[]){const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length;}return out;}
export function buildSignedClubCertificate(row:{id:string;learner_name:string;title:string;session_count:number;completed_at:string;kind:string},image:Uint8Array){
 if(!validCertificateJpeg(image)||!row.learner_name?.trim()||row.learner_name.length>80||!row.title?.trim()||row.title.length>120||!Number.isFinite(Date.parse(row.completed_at))||!Number.isInteger(row.session_count)||row.session_count<1||row.session_count>12||!["single","round"].includes(row.kind)||row.kind==="single"&&row.session_count!==1||!/^[A-Za-z0-9_-]{1,80}$/.test(row.id))throw Error("Invalid certificate snapshot.");
 const W=842,H=595,scale=W/1536,offset=(H-1024*scale)/2;
 const y=(px:number)=>H-offset-px*scale;
 const center=(s:string,cx:number,cy:number,max:number,size:number,font:string)=>{
  const estimate=Array.from(s,c=>" ilI.,'!:;".includes(c)?.28:"mwMW@%".includes(c)?.95:"ABCDEFGHKNOPQRSTUVXYZ".includes(c)?.75:.58).reduce((a,b)=>a+b,0);
  const safe=Math.min(size,max*scale/Math.max(estimate,1),max*scale/s.length);
  const x=cx*scale-estimate*safe/2;
  return "0.10 0.21 0.12 rg BT /"+font+" "+safe.toFixed(2)+" Tf "+x.toFixed(2)+" "+y(cy).toFixed(2)+" Td ("+pdfText(s)+") Tj ET";
 };
 const date=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",day:"numeric",month:"long",year:"numeric"}).format(new Date(row.completed_at));
 const stream=["q "+W+" 0 0 "+(1024*scale).toFixed(3)+" 0 "+offset.toFixed(3)+" cm /Artwork Do Q",center(row.learner_name,790,440,650,33,"B"),center(row.title,790,626,500,23,"B"),center(date,647,892,235,12,"R"),"0.12 0.23 0.18 rg BT /R 6 Tf 280 5 Td ("+pdfText("Certificate "+row.id)+") Tj ET"].join("\n");
 const objects=[enc("<< /Type /Catalog /Pages 2 0 R >>"),enc("<< /Type /Pages /Kids [5 0 R] /Count 1 >>"),enc("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"),enc("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>"),enc("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /R 3 0 R /B 4 0 R >> /XObject << /Artwork 7 0 R >> >> /Contents 6 0 R >>"),enc("<< /Length "+enc(stream).length+" >>\nstream\n"+stream+"\nendstream"),join([enc("<< /Type /XObject /Subtype /Image /Width 1536 /Height 1024 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+image.length+" >>\nstream\n"),image,enc("\nendstream")])];
 const parts=[enc("%PDF-1.4\n")],offsets=[0];let at=parts[0].length;
 objects.forEach((o,i)=>{offsets.push(at);const block=join([enc((i+1)+" 0 obj\n"),o,enc("\nendobj\n")]);parts.push(block);at+=block.length;});
 parts.push(enc("xref\n0 "+offsets.length+"\n0000000000 65535 f \n"+offsets.slice(1).map(n=>String(n).padStart(10,"0")+" 00000 n \n").join("")+"trailer\n<< /Size "+offsets.length+" /Root 1 0 R >>\nstartxref\n"+at+"\n%%EOF\n"));
 return {pdf:join(parts),filename:"sidequest-english-club-certificate.pdf",template:SIGNED_TEMPLATE_VERSION};
}
export async function signedCertificateExport(e:Env,row:any){
 if(!row.template_id)return null;
 const artwork=await loadSignedTemplate(e,row.template_id);if(!artwork)return null;
 const doc=buildSignedClubCertificate(row,artwork);
 return {filename:doc.filename,mime:"application/pdf",base64:stationeryBase64(doc.pdf),template:doc.template};
}
