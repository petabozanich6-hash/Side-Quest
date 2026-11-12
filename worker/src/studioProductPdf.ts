/**
 * Owner-only product export for Square. This is a standalone A4 PDF composer:
 * the print and digital editions share identical content and pagination.
 * No Side-Quest shop listing, checkout, or order data is accessed here.
 */
export type StudioKind = "writing" | "checklist" | "log";
export type StudioPage = {title:string; instructions:string; kind:StudioKind; prompts:string[]};
export type StudioProduct = {title:string; subtitle:string; audience:string; pages:StudioPage[]};
type Field = {name:string; kind:"text"|"check"; x:number;y:number;w:number;h:number};
type Sheet = {paint:string[]; fields:Field[]};
type Quality = {pages:number; printable:boolean; digitally_fillable:boolean; form_fields:number; checks:string[]};

const WIDTH = 595, HEIGHT = 842, LEFT=49, RIGHT=546, BOTTOM=63, TOP=751;
const encoder=new TextEncoder();
const clean=(v:unknown)=>String(v??"").replace(/[\u0000-\u001f\u007f]/g," ").replace(/\s+/g," ").trim();
const ascii=(v:unknown)=>clean(v).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/[\u2022]/g,"-").replace(/[^\x20-\x7e]/g,"?");
const esc=(v:unknown)=>ascii(v).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");
const rgb=(r:number,g:number,b:number)=>[r,g,b].map(n=>Number(n.toFixed(3))).join(" ");
const FOREST=rgb(.13,.23,.18),GOLD=rgb(.68,.53,.33),INK=rgb(.16,.19,.16),MUTED=rgb(.37,.41,.37),LINE=rgb(.78,.81,.77);
function required(value:unknown,label:string,min:number,max:number):string{
 const text=clean(value);
 if(text.length<min||text.length>max)throw Error(label+" must be "+min+"-"+max+" characters.");
 return text;
}
export function validateStudioProduct(raw:unknown):StudioProduct{
 if(!raw||typeof raw!=="object")throw Error("Provide a document to build.");
 const r=raw as Record<string,unknown>;
 if(!Array.isArray(r.pages)||r.pages.length<1||r.pages.length>40)throw Error("Add between 1 and 40 activity pages.");
 const pages=r.pages.map((value,i)=>{
  if(!value||typeof value!=="object")throw Error("Activity "+(i+1)+" is missing.");
  const p=value as Record<string,unknown>;
  if(!["writing","checklist","log"].includes(String(p.kind)))throw Error("Choose a valid activity type on page "+(i+1)+".");
  if(!Array.isArray(p.prompts)||p.prompts.length<1||p.prompts.length>16)throw Error("Activity "+(i+1)+" needs 1-16 prompts.");
  const prompts=p.prompts.map((v,j)=>required(v,"Prompt "+(j+1)+" on activity "+(i+1),2,220));
  return {
   title:required(p.title,"Activity "+(i+1)+" title",3,85),
   instructions:required(p.instructions,"Activity "+(i+1)+" instructions",4,350),
   kind:p.kind as StudioKind,
   prompts,
  };
 });
 return {
  title:required(r.title,"Product title",4,110),
  subtitle:clean(r.subtitle).slice(0,180),
  audience:clean(r.audience).slice(0,90),
  pages,
 };
}
function wrap(value:string,size:number,width:number):string[]{
 const out:string[]=[];let line="";
 for(const word of ascii(value).split(" ").filter(Boolean)){
  const limit=Math.max(9,Math.floor(width/(size*.49)));
  if(word.length>limit){
   if(line){out.push(line);line="";}
   for(let n=0;n<word.length;n+=limit)out.push(word.slice(n,n+limit));
   continue;
  }
  if((line?line+" ":"").length+word.length<=limit)line+=(line?" ":"")+word;
  else{if(line)out.push(line);line=word;}
 }
 if(line)out.push(line);
 return out.length?out:[""];
}
function text(p:Sheet,content:string,x:number,y:number,size:number,bold=false,color=INK){
 p.paint.push(color+" rg BT /"+(bold?"B":"R")+" "+size+" Tf "+x+" "+y+" Td ("+esc(content)+") Tj ET");
}
function fill(p:Sheet,x:number,y:number,w:number,h:number,color:string){
 p.paint.push(color+" rg "+x+" "+y+" "+w+" "+h+" re f");
}
function stroke(p:Sheet,x:number,y:number,w:number,h:number,color=LINE){
 p.paint.push(color+" RG 0.7 w "+x+" "+y+" "+w+" "+h+" re S");
}
function rule(p:Sheet,x1:number,y:number,x2:number,color=LINE){
 p.paint.push(color+" RG 0.5 w "+x1+" "+y+" m "+x2+" "+y+" l S");
}
export function buildStudioProductPdf(raw:unknown,mode:"print"|"fillable"):{pdf:Uint8Array;quality:Quality}{
 if(!["print","fillable"].includes(mode))throw Error("Choose a print or fillable edition.");
 const product=validateStudioProduct(raw);
 const sheets:Sheet[]=[];let sheet!:Sheet, y=TOP, fieldIndex=0;
 const newSheet=()=>{
  sheet={paint:[],fields:[]};sheets.push(sheet);y=TOP;
  fill(sheet,0,796,WIDTH,46,FOREST);
  fill(sheet,LEFT,790,65,2,GOLD);
  text(sheet,"SIDE-QUEST",LEFT,814,13,true,"1 1 1");
  text(sheet,"LEARNING RESOURCES",405,815,8,false,".88 .87 .83");
  text(sheet,product.title.slice(0,75),LEFT,774,9,true,FOREST);
  rule(sheet,LEFT,760,RIGHT);
 };
 const need=(height:number)=>{if(y-height<BOTTOM)newSheet();};
 const paragraph=(s:string,x:number,width:number,size=10,leading=15,color=INK)=>{
  const lines=wrap(s,size,width);
  need(lines.length*leading+8);
  for(const line of lines){text(sheet,line,x,y,size,false,color);y-=leading;}
  return lines.length;
 };
 const field=(label:string,height=108)=>{
  const lines=wrap(label,10.5,RIGHT-LEFT-4),cost=lines.length*14+height+24;
  need(cost);
  for(const line of lines){text(sheet,line,LEFT+3,y,10.5,true);y-=14;}
  y-=8;
  const bottom=y-height;
  stroke(sheet,LEFT,bottom,RIGHT-LEFT,height);
  // Visible ruled guides make the exact same field useful when printed.
  for(let ty=bottom+23;ty<y-5;ty+=24)rule(sheet,LEFT+12,ty,RIGHT-12,rgb(.87,.89,.86));
  fieldIndex++;
  if(mode==="fillable")sheet.fields.push({name:"response_"+fieldIndex.toString().padStart(3,"0"),kind:"text",x:LEFT+2,y:bottom+2,w:RIGHT-LEFT-4,h:height-4});
  y=bottom-21;
 };
 const checkbox=(label:string)=>{
  const lines=wrap(label,10.5,RIGHT-LEFT-39),cost=lines.length*15+15;
  need(cost);
  const boxY=y-15;
  stroke(sheet,LEFT+5,boxY,15,15,rgb(.45,.48,.44));
  fieldIndex++;
  if(mode==="fillable")sheet.fields.push({name:"check_"+fieldIndex.toString().padStart(3,"0"),kind:"check",x:LEFT+5,y:boxY,w:15,h:15});
  let ly=y-1;
  for(const line of lines){text(sheet,line,LEFT+31,ly,10.5);ly-=15;}
  y=boxY-Math.max(14,lines.length*15-10);
 };
 const log=(labels:string[])=>{
  const widths=[98,170,228], xs=[LEFT,LEFT+98,LEFT+268], headers=["Date","Learning / activity","Notes or evidence"];
  const header=()=>{
   need(50);
   fill(sheet,LEFT,y-30,RIGHT-LEFT,30,rgb(.93,.95,.92));
   headers.forEach((s,i)=>text(sheet,s,xs[i]+7,y-19,9,true,FOREST));
   y-=30;
  };
  const rows=Math.max(4,Math.min(labels.length,10));
  header();
  for(let k=0;k<rows;k++){
   const prompt=labels[k]||"";
   // A long activity description grows its row. It is never clipped to two lines.
   const promptLines=prompt?wrap(prompt,8.5,152):[];
   const rowH=Math.max(72,promptLines.length*13+43);
   if(y-rowH-11<BOTTOM){newSheet();header();}
   const bottom=y-rowH;
   widths.forEach((w,i)=>stroke(sheet,xs[i],bottom,w,rowH));
   promptLines.forEach((line,j)=>text(sheet,line,xs[1]+8,y-14-j*13,8.5,false,MUTED));
   if(mode==="fillable")widths.forEach((w,i)=>{
    fieldIndex++;
    const reserved=i===1?promptLines.length*13+18:5;
    sheet.fields.push({name:"log_"+fieldIndex.toString().padStart(3,"0"),kind:"text",x:xs[i]+3,y:bottom+3,w:w-6,h:rowH-reserved-3});
   });
   y=bottom-9;
  }
 };
 // Dedicated cover sheet; content pages have restrained black-and-white interiors.
 sheet={paint:[],fields:[]};sheets.push(sheet);
 fill(sheet,0,465,WIDTH,377,FOREST);
 fill(sheet,LEFT,713,100,3,GOLD);
 text(sheet,"SIDE-QUEST",LEFT,738,22,true,"1 1 1");
 text(sheet,"THE DOCUMENT STUDIO COLLECTION",LEFT,693,10,true,rgb(.87,.76,.54));
 let coverY=647;
 for(const line of wrap(product.title,30,490).slice(0,4)){
  text(sheet,line,LEFT,coverY,30,true,"1 1 1");coverY-=41;
 }
 if(product.subtitle){
  let subY=438;
  for(const line of wrap(product.subtitle,12,480).slice(0,3)){
   text(sheet,line,LEFT,subY,12,false,INK);subY-=19;
  }
 }
 if(product.audience)text(sheet,"FOR "+product.audience.toUpperCase().slice(0,65),LEFT,321,10,true,FOREST);
 rule(sheet,LEFT,291,RIGHT,GOLD);
 text(sheet,"PRINT IT. TYPE IN IT. MAKE IT YOURS.",LEFT,266,12,true,FOREST);
 text(sheet,"Side-Quest Learning | An independent learning resource",LEFT,91,9,false,MUTED);
 text(sheet,"A4 edition | Review every page before distribution",LEFT,73,8,false,MUTED);
 newSheet();
 for(const [i,activity] of product.pages.entries()){
  need(116);
  fill(sheet,LEFT,y-35,RIGHT-LEFT,35,rgb(.93,.95,.92));
  text(sheet,"ACTIVITY "+String(i+1).padStart(2,"0"),LEFT+10,y-14,8,true,MUTED);
  text(sheet,activity.title.slice(0,82),LEFT+10,y-29,13,true,FOREST);
  y-=54;
  paragraph(activity.instructions,LEFT+4,RIGHT-LEFT-10,10,15,MUTED);
  y-=13;
  if(activity.kind==="writing"){
   for(const prompt of activity.prompts)field(prompt,Math.min(165,activity.prompts.length===1?190:112));
  }else if(activity.kind==="checklist"){
   for(const prompt of activity.prompts)checkbox(prompt);
  }else{
   log(activity.prompts);
  }
  y-=10;
 }
 const objects:string[]=[""];
 const add=()=>{objects.push("");return objects.length-1;};
 const set=(id:number,v:string)=>{objects[id]=v;};
 const regular=add(),bold=add(),pagesId=add(),catalog=add();
 set(regular,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
 set(bold,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
 const pids:number[]=[],widgets:number[]=[];
 let checkOff=0,checkOn=0;
 if(mode==="fillable"&&sheets.some(p=>p.fields.some(f=>f.kind==="check"))){
  const off="q 0.5 0.5 0.5 RG 0.9 w 0.5 0.5 14 14 re S Q";
  const on="q 0.5 0.5 0.5 RG 0.9 w 0.5 0.5 14 14 re S 0.12 0.24 0.16 RG 2 w 3 8 m 6 4 l 12 12 l S Q";
  checkOff=add();checkOn=add();
  set(checkOff,"<< /Type /XObject /Subtype /Form /BBox [0 0 15 15] /Length "+encoder.encode(off).length+" >>\nstream\n"+off+"\nendstream");
  set(checkOn,"<< /Type /XObject /Subtype /Form /BBox [0 0 15 15] /Length "+encoder.encode(on).length+" >>\nstream\n"+on+"\nendstream");
 }
 for(let i=0;i<sheets.length;i++){
  const p=sheets[i],pageId=add(),streamId=add();pids.push(pageId);
  if(i>0){
   rule(p,LEFT,51,RIGHT);
   text(p,"SIDE-QUEST  |  "+(product.audience||"Learning resources").slice(0,45),LEFT,37,8,false,MUTED);
   text(p,"Page "+(i+1)+" of "+sheets.length,480,37,8,false,MUTED);
  }
  const stream=p.paint.join("\n")+"\n";
  set(streamId,"<< /Length "+encoder.encode(stream).length+" >>\nstream\n"+stream+"endstream");
  const annots:number[]=[];
  for(const f of p.fields){
   const id=add();widgets.push(id);annots.push(id);
   const box="["+f.x+" "+f.y+" "+(f.x+f.w)+" "+(f.y+f.h)+"]";
   if(f.kind==="text"){
    set(id,"<< /Type /Annot /Subtype /Widget /FT /Tx /T ("+esc(f.name)+") /V () /Rect "+box+" /F 4 /Ff 4096 /DA (/Helv 11 Tf 0.1 0.14 0.1 rg) /Border [0 0 0] /P "+pageId+" 0 R >>");
   }else{
    set(id,"<< /Type /Annot /Subtype /Widget /FT /Btn /T ("+esc(f.name)+") /V /Off /AS /Off /Rect "+box+" /F 4 /P "+pageId+" 0 R /AP << /N << /Off "+checkOff+" 0 R /Yes "+checkOn+" 0 R >> >> >>");
   }
  }
  set(pageId,"<< /Type /Page /Parent "+pagesId+" 0 R /MediaBox [0 0 "+WIDTH+" "+HEIGHT+"] /Resources << /Font << /R "+regular+" 0 R /B "+bold+" 0 R >> >> /Contents "+streamId+" 0 R "+(annots.length?"/Annots ["+annots.map(id=>id+" 0 R").join(" ")+"] ":"")+">>");
 }
 set(pagesId,"<< /Type /Pages /Kids ["+pids.map(id=>id+" 0 R").join(" ")+"] /Count "+pids.length+" >>");
 const form=mode==="fillable"?" /AcroForm << /Fields ["+widgets.map(id=>id+" 0 R").join(" ")+"] /NeedAppearances true /DA (/Helv 11 Tf 0 g) /DR << /Font << /Helv "+regular+" 0 R >> >> >>":"";
 set(catalog,"<< /Type /Catalog /Pages "+pagesId+" 0 R"+form+" >>");
 const chunks:string[]=["%PDF-1.4\n"];const offsets:number[]=[0];let size=encoder.encode(chunks[0]).length;
 for(let id=1;id<objects.length;id++){
  offsets[id]=size;
  const chunk=id+" 0 obj\n"+objects[id]+"\nendobj\n";
  chunks.push(chunk);size+=encoder.encode(chunk).length;
 }
 const start=size;
 chunks.push("xref\n0 "+objects.length+"\n0000000000 65535 f \n");
 for(let id=1;id<objects.length;id++)chunks.push(String(offsets[id]).padStart(10,"0")+" 00000 n \n");
 chunks.push("trailer\n<< /Size "+objects.length+" /Root "+catalog+" 0 R >>\nstartxref\n"+start+"\n%%EOF\n");
 const pdf=encoder.encode(chunks.join(""));
 const checks=["A4 pages with fixed minimum writing and form-field sizes","Content moved to additional pages instead of being compressed","Same text and layout in print and fillable editions"];
 if(mode==="fillable")checks.push("AcroForm text and checkbox widgets included; verify save-and-reopen in a PDF reader");
 return {pdf,quality:{pages:sheets.length,printable:true,digitally_fillable:mode==="fillable",form_fields:mode==="fillable"?widgets.length:0,checks}};
}