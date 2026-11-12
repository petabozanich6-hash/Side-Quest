// Side-Quest Home Education documents: accessible A4 print and AcroForm editions.
// The preview, reusable document and printable edition share one deterministic layout.
// This is an independent family planning tool, not an authority-issued form.
import { JURISDICTIONS, CHECKED_ON, planAreas, type JurisdictionCode } from "./data/planJurisdictions";

type Field={name:string; kind:"text"|"check";x:number;y:number;width:number;height:number};
type Page={draw:string[];fields:Field[]};
type Edition="standard"|"complete";
type Mode="fillable"|"print";
const W=595,H=842,L=47,R=548,BOTTOM=67,TOP=750;
const enc=new TextEncoder();
const green="0.12 0.22 0.16",gold="0.71 0.54 0.34",ink="0.17 0.2 0.17",muted="0.39 0.43 0.39",line="0.79 0.82 0.78";
const ascii=(v:unknown)=>String(v??"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/[^\x20-\x7e]/g,"?");
const escape=(v:unknown)=>ascii(v).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");
const wrap=(s:unknown,size:number,width:number)=>{
 const limit=Math.max(10,Math.floor(width/(size*.50)));
 const words=ascii(s).split(/\s+/).filter(Boolean),lines:string[]=[];
 let current="";
 for(const word of words){
  if(word.length>limit){
   if(current){lines.push(current);current="";}
   for(let n=0;n<word.length;n+=limit)lines.push(word.slice(n,n+limit));
  }else if((current?current.length+1:0)+word.length>limit){if(current)lines.push(current);current=word;}
  else current+=(current?" ":"")+word;
 }
 if(current)lines.push(current);
 return lines.length?lines:[""];
};
const stage=(year:string)=>{const n=Number(year);if(!Number.isFinite(n)||n<=0)return"ES1";return n<=2?"S1":n<=4?"S2":n<=6?"S3":n<=8?"S4":n<=10?"S5":"S6";};
const areaHints=(area:string)=>{
 const s=area.toLowerCase();
 if(/english|literacy/.test(s))return {focus:"Reading, writing, speaking and listening: which texts, skills and language experiences will you cover?",activities:"How will reading, writing, storytelling, discussion and meaningful practice happen?",evidence:"Reading records, dated writing samples, conversations or other authentic evidence"};
 if(/math|numera/.test(s))return{focus:"Which number, measurement, geometry, data or problem-solving ideas will be explored?",activities:"What demonstrations, manipulatives, investigations and real-life problems will you use?",evidence:"Worked examples, dated problem solving, observations or practical investigations"};
 if(/science/.test(s))return{focus:"What questions, concepts, investigations or scientific practices will guide learning?",activities:"Describe observations, fair tests, experiments, nature studies or research appropriate to the learner.",evidence:"Lab notes, photos of experiments, labelled drawings, explanations or work samples"};
 if(/hist|geograph|humanities|hsie|civic|business/.test(s))return{focus:"Which people, places, periods, communities or social questions will you explore?",activities:"Describe maps, timelines, primary sources, visits, projects or inquiry activities.",evidence:"Maps, timelines, research notes, discussions, projects or reflections"};
 if(/arts|creative/.test(s))return{focus:"Which art forms, techniques, creative works or performances will you explore?",activities:"Describe making, viewing, performing, experimenting and responding to artworks.",evidence:"Work samples, photographs, portfolios, sketches or performance reflections"};
 if(/pd h|pdhpe|health|physical|wellbeing/.test(s))return{focus:"Which health, movement, safety or wellbeing skills will be developed?",activities:"Describe movement activities, practical safety learning, discussions and wellbeing strategies.",evidence:"Skill observations, participation records, reflections or dated activity notes"};
 if(/technolog/.test(s))return{focus:"Which design, digital or practical technology skills and processes will you explore?",activities:"Describe designing, making, testing, problem solving and evaluating solutions.",evidence:"Plans, prototypes, digital files, photographs or process reflections"};
 if(/language/.test(s))return{focus:"Which language, communication, cultural or intercultural learning experiences will you explore?",activities:"Describe conversation, listening, reading, games, writing or cultural inquiry.",evidence:"Vocabulary records, dialogue notes, audio reflections or work samples"};
 return{focus:"Which concepts, knowledge and skills are planned for this learning area?",activities:"Describe meaningful learning experiences and teaching approaches.",evidence:"Dated work samples, photographs, observations or learner reflections"};
};

/**
 * Backward-compatible API. mode and edition are owner publishing options:
 * existing three-argument preview/paid routes continue to generate fillable
 * planning workbooks. Full editions add printable and interactive record pages.
 */
export function generateHomeEducationTemplate(state:string,yearLevel="3",sampleOnly=false,mode:Mode="fillable",edition:Edition="standard"):Uint8Array{
 if(!Object.prototype.hasOwnProperty.call(JURISDICTIONS,state)||state==="OTHER")throw Error("Invalid state");
 if(!/^(K|F|Prep|[1-9]|1[0-2])$/i.test(yearLevel))throw Error("Invalid school year");
 if(mode!=="fillable"&&mode!=="print")throw Error("Invalid PDF edition");
 if(edition!=="standard"&&edition!=="complete")throw Error("Invalid document range");
 const jur=JURISDICTIONS[state as JurisdictionCode];
 const displayYear=/^(K|F|Prep)$/i.test(yearLevel)?jur.foundationYear:yearLevel;
 const pages:Page[]=[];let p!:Page,y=TOP,fieldNumber=0;
 const rect=(x:number,b:number,w:number,h:number,color:string)=>p.draw.push(color+" rg "+x+" "+b+" "+w+" "+h+" re f");
 const outline=(x:number,b:number,w:number,h:number,color=line)=>p.draw.push(color+" RG 0.7 w "+x+" "+b+" "+w+" "+h+" re S");
 const rule=(x:number,ry:number,x2:number,color=line)=>p.draw.push(color+" RG 0.55 w "+x+" "+ry+" m "+x2+" "+ry+" l S");
 const text=(t:unknown,x:number,ty:number,size=10,bold=false,color=ink)=>p.draw.push(color+" rg BT /"+(bold?"B":"R")+" "+size+" Tf "+x+" "+ty+" Td ("+escape(t)+") Tj ET");
 const lines=(t:unknown,x:number,width:number,size=10,lead=16,color=ink)=>{
  const out=wrap(t,size,width);
  for(const s of out){text(s,x,y,size,false,color);y-=lead;}
  return out.length;
 };
 const page=()=>{
  p={draw:[],fields:[]};pages.push(p);y=TOP;
  rect(0,792,W,50,green);rect(L,785,79,3,gold);
  text("SIDE-QUEST",L,813,14,true,"1 1 1");
  text("HOME EDUCATION DOCUMENT STUDIO",269,814,8,false,"0.88 0.88 0.82");
  rule(L,762,R);
 };
 const ensure=(height:number)=>{if(y-height<BOTTOM)page();};
 const section=(index:string,title:string,subtitle:string)=>{
  const headingLines=wrap(title,17,468);
  const h=22+headingLines.length*24;
  ensure(h+66);
  rect(L,y-h,R-L,h,"0.93 0.95 0.92");
  text(index.toUpperCase(),L+11,y-14,8,true,muted);
  headingLines.forEach((t,i)=>text(t,L+11,y-38-i*24,17,true,green));
  y-=h+17;
  if(subtitle){ensure(60);lines(subtitle,L+5,R-L-12,9.2,15,muted);y-=12;}
 };
 const field=(label:string,help="",height=104,short=false)=>{
  const lbl=wrap(label,11,R-L-10),hint=help?wrap(help,8.8,R-L-18):[];
  const cost=lbl.length*15+hint.length*13+height+24;
  ensure(cost);
  for(const s of lbl){text(s,L+3,y,11,true,green);y-=15;}
  for(const s of hint){text(s,L+3,y,8.8,false,muted);y-=13;}
  y-=12;
  const bottom=y-height;
  outline(L,bottom,R-L,height);
  if(!short)for(let yy=bottom+23;yy<y-5;yy+=24)rule(L+13,yy,R-13,"0.87 0.89 0.86");
  fieldNumber++;
  if(mode==="fillable")p.fields.push({name:"answer_"+String(fieldNumber).padStart(4,"0"),kind:"text",x:L+3,y:bottom+3,width:R-L-6,height:height-6});
  y=bottom-23;
 };
 const pair=(a:string,b:string)=>{
  const h=55;ensure(h+28);
  const widths=[(R-L)/2-7,(R-L)/2-7],xs=[L,R-widths[1]];
  [a,b].forEach((label,i)=>{
   text(label,xs[i]+3,y,10,true,green);
   outline(xs[i],y-h-10,widths[i],h);
   fieldNumber++;
   if(mode==="fillable")p.fields.push({name:"answer_"+String(fieldNumber).padStart(4,"0"),kind:"text",x:xs[i]+3,y:y-h-7,width:widths[i]-6,height:h-6});
  });
  y-=h+40;
 };
 const checkbox=(label:string)=>{
  const entry=wrap(label,9.5,R-L-42),h=Math.max(30,entry.length*14+8);
  ensure(h+10);
  outline(L+3,y-18,15,15,"0.42 0.46 0.41");
  entry.forEach((s,i)=>text(s,L+31,y-4-i*14,9.5));
  fieldNumber++;
  if(mode==="fillable")p.fields.push({name:"check_"+String(fieldNumber).padStart(4,"0"),kind:"check",x:L+3,y:y-18,width:15,height:15});
  y-=h+10;
 };
 const table=(headings:string[],rows:number,rowHeight=69)=>{
  const widths=headings.length===4?[84,133,142,142]:[100,192,209];
  const xs=[L];
  for(let i=1;i<widths.length;i++)xs.push(xs[i-1]+widths[i-1]);
  const header=()=>{ensure(45);rect(L,y-30,R-L,30,"0.93 0.95 0.92");headings.forEach((h,i)=>wrap(h,8.1,widths[i]-9).slice(0,2).forEach((s,j)=>text(s,xs[i]+5,y-13-j*10,8.1,true,green)));y-=30;};
  header();
  for(let i=0;i<rows;i++){
   if(y-rowHeight-12<BOTTOM){page();header();}
   const bottom=y-rowHeight;
   widths.forEach((w,j)=>{
    outline(xs[j],bottom,w,rowHeight);
    fieldNumber++;
    if(mode==="fillable")p.fields.push({name:"answer_"+String(fieldNumber).padStart(4,"0"),kind:"text",x:xs[j]+3,y:bottom+3,width:w-6,height:rowHeight-6});
   });
   y=bottom-9;
  }
 };
 const startSection=(number:string,title:string,description:string)=>{page();section(number,title,description);};
 // Introductory cover is reserved as a complete A4 page.
 p={draw:[],fields:[]};pages.push(p);
 rect(0,470,W,372,green);
 rect(L,734,105,3,gold);
 text("SIDE-QUEST",L,758,23,true,"1 1 1");
 text("THE HOME EDUCATION COLLECTION",L,705,10,true,"0.86 0.77 0.59");
 text("Home Education",L,630,32,true,"1 1 1");
 text(edition==="complete"?"Planner & Diary":"Planning Workbook",L,580,30,true,"1 1 1");
 for(const [i,s] of wrap(jur.name,16,480).entries())text(s,L,520-i*20,16,true,"0.91 0.83 0.69");
 text("PLAN. TEACH. RECORD. REFLECT.",L,428,14,true,green);
 text("Practical, printable and digitally fillable",L,396,11,false,ink);
 text("A4 documents for Australian home educating families",L,374,10,false,muted);
 rect(L,231,R-L,108,"0.95 0.96 0.94");
 text("BEFORE YOU BEGIN",L+16,313,11,true,green);
 ["Complete each field using your family's real plans and records.",
  "Print and handwrite, or type in a compatible PDF reader.",
  "Verify current guidance with your state or territory authority.",
  "Use an official government form wherever one is prescribed."
 ].forEach((s,i)=>text(String(i+1)+". "+s,L+16,288-i*20,9.4,false,ink));
 text("Independent resource - not a government form or registration guarantee.",L,120,9,false,muted);
 text("Official-source catalogue last checked "+CHECKED_ON+". Review before using.",L,102,8.4,false,muted);
 
 startSection("01","Learner and planning period","Start with the details that make this a plan for an individual learner. Leave fields blank until you have accurate information.");
 pair("Learner name / identifier","Year level / stage ("+displayYear+")");
 pair("Planning start date","Planning end date");
 field("What does this learner enjoy and do well?","Interests, strengths, motivations and current skills.",115);
 field("What would meaningful progress look like?","Include a few realistic learning and development goals.",118);

 startSection("02","How learning will happen","Explain your approach in plain language. A useful plan describes what the parent actually intends to do.");
 field("Learning approaches and teaching strategies","For example: discussion, modelling, guided practice, independent projects, hands-on learning.",108);
 field("Adjustments and learning support","Outline practical supports or changes to pace, resources or instruction. Sensitive medical details are not needed here.",105);
 field("Learning environment, routine and supervision","Describe where, when and with whom learning will normally happen.",108);

 startSection("03","Resources and recording","Named resources and a clear recordkeeping method make it easier to follow the program over time.");
 field("Resources we plan to use","Name actual books, websites, programs, community resources, tools and materials.",110);
 field("How we will record progress","Describe dated work samples, reading records, projects, observations or other methods.",110);
 field("How and when we will review the plan","For example: periodic reflections, work samples, discussions and adjustments.",110);

 const areas=planAreas(jur,{year_level:yearLevel,stage:stage(yearLevel)}).areas;
 areas.forEach((area,i)=>{
  const hints=areaHints(area),n=String(i+4).padStart(2,"0");
  startSection(n,area+" - learning focus","Use this space for your real curriculum focus and goals. Do not claim outcomes or codes that have not been checked against current sources.");
  field("Learning focus and intended knowledge or skills",hints.focus,110);
  field("Relevant curriculum reference or learning goals","If applicable, enter verified syllabus outcomes, learning areas or your own clearly labelled goals.",105);
  field("Why these learning priorities suit the learner","Connect goals to strengths, needs, interests and progress so far.",105);
  startSection(n+"B",area+" - teaching and evidence","Keep teaching intentions separate from the evidence you will collect after learning has occurred.");
  field("Teaching strategies and planned learning experiences",hints.activities,113);
  field("Materials, texts, places and other learning resources","List concrete resources the family actually has or will obtain.",105);
  field("How progress will be noticed and recorded",hints.evidence,105);
 });
 startSection("A","Learning records and evidence","This is a working record. Add copies of this page if the family needs more entries.");
 table(["Date","Learning area","Learning experience","Evidence / next step"],7,64);

 startSection("B","Review and adjustments","Reflect on actual learning rather than treating planned activities as completed work.");
 field("Progress, achievements and skills demonstrated","What did the learner understand, make, discuss or practise?",110);
 field("Work samples and records referenced","Record specific evidence references or file names.",110);
 field("What will change in the next planning period?","Identify next steps, teaching adjustments or new resources.",110);

 if(edition==="complete"){
  for(let term=1;term<=4;term++){
   startSection("T"+term,"Planning period "+term,"Use this as a term planner or another planning block. Adapt dates and duration to suit your family's approach.");
   pair("Period starts","Period ends");
   field("Learning priorities and curriculum focus","What will the learner work towards during this period?",94);
   field("Activities, projects and teaching sequence","How will you introduce, practise and extend this learning?",96);
   field("Resources, evidence and review points","What materials and records will help you check progress?",94);
   startSection("D"+term,"Learning diary - period "+term,"Record what really happened. Duplicate this page for more days or weeks.");
   table(["Date","Subject / learning area","Learning completed","Evidence / reflection"],7,64);
  }
  startSection("R","Reading and literacy record","Include independent reading, read-alouds, audiobooks and other text experiences as relevant.");
  table(["Date","Book / text / author","Reading activity","Response / next step"],7,64);
  startSection("E","Evidence portfolio index","Use a consistent file name or evidence ID to match entries to dated work samples.");
  table(["Date","Area / focus","Evidence ID / file","What the evidence shows"],7,64);
  startSection("O","Outcome and goals tracker","Use verified codes only where applicable; learning goals can also be written in ordinary language.");
  table(["Area","Outcome or goal","Evidence reference","Progress / next step"],7,64);
  startSection("P","Projects and excursions","Document the learning connected to activities outside a conventional lesson.");
  table(["Date","Project or outing","Learning intention","Evidence / reflection"],7,64);
  startSection("F","Family review","Revisit this page at an interval that works for your family.");
  field("What has worked particularly well?","Consider engagement, understanding, confidence and practical experiences.",110);
  field("What were the challenges?","Record changes needed in teaching, resources, environment or timing.",110);
  field("Our priorities for the next learning period","List achievable next steps and how progress will be recorded.",110);
 }
 startSection("C","Requirements: parent review","Use this section as a preparation aid, not a compliance certificate. Verify the latest authority guidance.");
 for(const [i,req] of jur.requirements.entries()){
  if(i>0&&i%3===0)startSection("C"+String(Math.floor(i/3)+1),"Requirements - continued","Review each item against the official authority guidance and note what you still need to prepare.");
  checkbox(req);
  field("Evidence or planning notes for item "+(i+1),"Reference the relevant section, dated work sample or action still to complete.",62,true);
 }
 startSection("S","Official sources and final check","State-specific information can change. Confirm current registration and documentation requirements directly with the authority.");
 for(const source of jur.sources){
  const title=wrap(source.title,10,R-L-15),url=wrap(source.url,8.5,R-L-15),height=title.length*15+url.length*13+16;
  ensure(height);
  for(const s of title){text(s,L+4,y,10,true,green);y-=15;}
  for(const s of url){text(s,L+4,y,8.5,false,muted);y-=13;}
  y-=16;
 }
 ensure(95);
 lines("Independent Side-Quest preparation resource. Not government-issued, endorsed or a guarantee of registration.",L+4,R-L-10,9.4,15);
 lines("Authority source catalogue checked "+CHECKED_ON+". Verify any current rules, prescribed forms and registration deadlines before submission.",L+4,R-L-10,9.4,15,muted);
 y-=12;
 checkbox("I have reviewed the current official guidance and checked which documents are actually required.");

 const exported=sampleOnly?pages.slice(0,2):pages;
 const objects:string[]=[""];const reserve=()=>{objects.push("");return objects.length-1;};
 const set=(id:number,value:string)=>{objects[id]=value;};
 const regular=reserve(),bold=reserve(),pagesId=reserve(),catalog=reserve();
 set(regular,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
 set(bold,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
 const allWidgets:number[]=[],ids:number[]=[];
 let checkOff=0,checkOn=0;
 if(mode==="fillable"&&exported.some(v=>v.fields.some(f=>f.kind==="check"))){
  const off="q 0.45 0.5 0.44 RG 0.9 w 0.5 0.5 14 14 re S Q";
  const on="q 0.45 0.5 0.44 RG 0.9 w 0.5 0.5 14 14 re S 0.12 0.24 0.16 RG 2 w 3 8 m 6 4 l 12 12 l S Q";
  checkOff=reserve();checkOn=reserve();
  set(checkOff,"<< /Type /XObject /Subtype /Form /BBox [0 0 15 15] /Length "+enc.encode(off).length+" >>\nstream\n"+off+"\nendstream");
  set(checkOn,"<< /Type /XObject /Subtype /Form /BBox [0 0 15 15] /Length "+enc.encode(on).length+" >>\nstream\n"+on+"\nendstream");
 }
 for(let i=0;i<exported.length;i++){
  const sheet=exported[i],pid=reserve(),streamId=reserve();ids.push(pid);
  if(i>0){
   const foot="SIDE-QUEST  |  "+jur.code+"  |  "+(edition==="complete"?"COMPLETE PLANNER & DIARY":"HOME EDUCATION PLANNING WORKBOOK");
   sheet.draw.push(line+" RG 0.55 w "+L+" 57 m "+R+" 57 l S");
   sheet.draw.push(muted+" rg BT /R 7.7 Tf "+L+" 41 Td ("+escape(foot)+") Tj ET");
   sheet.draw.push(muted+" rg BT /R 7.7 Tf 469 41 Td (Page "+(i+1)+" of "+exported.length+") Tj ET");
  }
  const stream=sheet.draw.join("\n")+"\n"+(sampleOnly?"0.59 0.24 0.18 rg BT /B 12 Tf 435 65 Td (SAMPLE PREVIEW) Tj ET\n":"");
  set(streamId,"<< /Length "+enc.encode(stream).length+" >>\nstream\n"+stream+"endstream");
  const annots:number[]=[];
  for(const f of sheet.fields){
   const widget=reserve();annots.push(widget);allWidgets.push(widget);
   const bbox="["+f.x+" "+f.y+" "+(f.x+f.width)+" "+(f.y+f.height)+"]";
   if(f.kind==="text"){
    const multi=f.height>46?4096:0;
    set(widget,"<< /Type /Annot /Subtype /Widget /FT /Tx /T ("+f.name+") /V () /Rect "+bbox+" /F 4 /Ff "+multi+" /DA (/Helv 10 Tf 0.12 0.18 0.12 rg) /Border [0 0 0] /P "+pid+" 0 R >>");
   }else{
    set(widget,"<< /Type /Annot /Subtype /Widget /FT /Btn /T ("+f.name+") /V /Off /AS /Off /Rect "+bbox+" /F 4 /P "+pid+" 0 R /AP << /N << /Off "+checkOff+" 0 R /Yes "+checkOn+" 0 R >> >> >>");
   }
  }
  set(pid,"<< /Type /Page /Parent "+pagesId+" 0 R /MediaBox [0 0 "+W+" "+H+"] /Resources << /Font << /R "+regular+" 0 R /B "+bold+" 0 R >> >> /Contents "+streamId+" 0 R "+(annots.length?"/Annots ["+annots.map(n=>n+" 0 R").join(" ")+"] ":"")+">>");
 }
 set(pagesId,"<< /Type /Pages /Kids ["+ids.map(n=>n+" 0 R").join(" ")+"] /Count "+ids.length+" >>");
 const acro=mode==="fillable"?" /AcroForm << /Fields ["+allWidgets.map(n=>n+" 0 R").join(" ")+"] /NeedAppearances true /DA (/Helv 10 Tf 0 g) /DR << /Font << /Helv "+regular+" 0 R >> >> >>":"";
 set(catalog,"<< /Type /Catalog /Pages "+pagesId+" 0 R"+acro+" >>");
 const chunks=["%PDF-1.7\n"],offsets:number[]=[0];let bytes=enc.encode(chunks[0]).length;
 for(let i=1;i<objects.length;i++){offsets[i]=bytes;const obj=i+" 0 obj\n"+objects[i]+"\nendobj\n";chunks.push(obj);bytes+=enc.encode(obj).length;}
 const start=bytes;chunks.push("xref\n0 "+objects.length+"\n0000000000 65535 f \n");
 for(let i=1;i<objects.length;i++)chunks.push(String(offsets[i]).padStart(10,"0")+" 00000 n \n");
 chunks.push("trailer\n<< /Size "+objects.length+" /Root "+catalog+" 0 R >>\nstartxref\n"+start+"\n%%EOF\n");
 return enc.encode(chunks.join(""));
}