// Versioned, print-friendly A4 landscape certificate. No remote assets or learner data sent to external services.
export const CLUB_CERTIFICATE_TEMPLATE="english-club-certificate-v1";
const encoder=new TextEncoder();
function escapePdf(s:string){
 const v=s.replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/\u00a0/g," ");
 if(/[^\x20-\x7e\xa0-\xff]/.test(v))throw Error("Certificate name or title contains characters unsupported by this PDF font. Review before fulfilment.");
 return Array.from(v,c=>c.charCodeAt(0)>126?"\\"+c.charCodeAt(0).toString(8).padStart(3,"0"):"\\()".includes(c)?"\\"+c:c).join("");
}
function wrap(s:string,max:number){
 const lines:string[]=[];let line="";
 for(let word of s.trim().split(/\s+/)){
  if(line&&line.length+1+word.length>max){lines.push(line);line="";}
  while(word.length>max){lines.push(word.slice(0,max));word=word.slice(max);}
  line+=(line?" ":"")+word;
 }
 if(line)lines.push(line);return lines;
}
// Conservative Helvetica glyph widths for centering. Largest glyph is <= 1 em.
function width(s:string,bold:boolean){
 return Array.from(s,c=>" ilI.,'!:;|".includes(c)?.28:"mwMW@%".includes(c)?.9:"ABCDEFGHKNOPQRSTUVXYZ".includes(c)?.7:"0123456789".includes(c)?.56:bold?.57:.52).reduce((a,b)=>a+b,0);
}
export function buildClubCertificatePdf(row:{id:string;learner_name:string;title:string;session_count:number;completed_at:string;kind:string}){
 const name=row.learner_name,title=row.title;
 if(typeof name!=="string"||name.trim().length<1||name.length>80||typeof title!=="string"||title.trim().length<1||title.length>120||!Number.isInteger(row.session_count)||row.session_count<1||row.session_count>12||!["single","round"].includes(row.kind)||row.kind==="single"&&row.session_count!==1||!Number.isFinite(Date.parse(row.completed_at))||!/^[a-zA-Z0-9_-]{1,80}$/.test(row.id))throw Error("Invalid approved certificate snapshot.");
 escapePdf(name);escapePdf(title);
 const commands:string[]=[];
 const rect=(x:number,y:number,w:number,h:number,color:string,stroke=false)=>commands.push(color+(stroke?" RG 1.2 w ":" rg ")+[x,y,w,h].join(" ")+" re "+(stroke?"S":"f"));
 const center=(s:string,y:number,size:number,bold=false,color="0.12 0.23 0.18")=>{
  const safe=Math.min(size,680/Math.max(s.length,1));
  const x=Math.max(80,(842-width(s,bold)*safe)/2);
  commands.push(color+" rg BT /"+(bold?"B":"R")+" "+safe.toFixed(2)+" Tf "+x.toFixed(2)+" "+y+" Td ("+escapePdf(s)+") Tj ET");
 };
 rect(0,0,842,595,"1 1 1");rect(25,25,792,545,"0.12 0.23 0.18",true);rect(33,33,776,529,"0.72 0.60 0.38",true);
 rect(50,489,742,54,"0.12 0.23 0.18");
 center("SIDE-QUEST LEARNING",520,21,true,"1 1 1");center("ENGLISH CLUB",502,10,true,"0.96 0.93 0.85");
 center("Certificate of Completion",436,35,true);
 center("This certificate is proudly presented to",391,14);
 const names=wrap(name,39);const nameStart=names.length===1?340:356;
 names.forEach((v,i)=>center(v,nameStart-i*30,30,true));
 const nameEnd=nameStart-(names.length-1)*30;
 const bodyY=Math.min(286,nameEnd-42);
 center(row.kind==="single"?"for completing the English Club workshop":"for completing the English Club learning round",bodyY,14);
 const titles=wrap(title,58);titles.forEach((v,i)=>center(v,bodyY-30-i*21,20,true));
 const countY=bodyY-30-(titles.length-1)*21-34;
 center(row.session_count+" completed "+(row.session_count===1?"workshop":"workshops")+" | Creative literacy and learning",countY,12);
 const completed=new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Sydney",day:"numeric",month:"long",year:"numeric"}).format(new Date(row.completed_at));
 center("Completed "+completed,105,13,true);
 center("Side-Quest Learning | Educational participation acknowledgement",77,10);
 center("Certificate ID: "+row.id,55,8);
 const stream=commands.join("\n");
 const objects=["","<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids [5 0 R] /Count 1 >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>","<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /R 3 0 R /B 4 0 R >> >> /Contents 6 0 R >>","<< /Length "+encoder.encode(stream).length+" >>\nstream\n"+stream+"\nendstream"];
 let pdf="%PDF-1.4\n",offsets=[0];
 for(let i=1;i<objects.length;i++){offsets.push(encoder.encode(pdf).length);pdf+=i+" 0 obj\n"+objects[i]+"\nendobj\n";}
 const xref=encoder.encode(pdf).length;
 pdf+="xref\n0 "+objects.length+"\n0000000000 65535 f \n"+offsets.slice(1).map(n=>String(n).padStart(10,"0")+" 00000 n \n").join("")+"trailer\n<< /Size "+objects.length+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF\n";
 return {pdf:encoder.encode(pdf),filename:"sidequest-english-club-certificate.pdf",template:CLUB_CERTIFICATE_TEMPLATE};
}
