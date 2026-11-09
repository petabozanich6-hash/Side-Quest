// Owner-only, dependency-free AcroForm template generation.
// It reuses the subscription state requirements catalogue, does not use AI,
// and does not save anything until the owner explicitly approves the preview.
import { JURISDICTIONS, CHECKED_ON, planAreas, type JurisdictionCode } from "./data/planJurisdictions";

type Field={name:string;x:number;y:number;width:number;height:number};
type Page={draw:string[];fields:Field[]};
const A4_WIDTH=595,A4_HEIGHT=842;
const ascii=(v:unknown)=>String(v??"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[\u2018\u2019]/g,"'").replace(/[\u2013\u2014]/g,"-").replace(/[^\x20-\x7e]/g,"?");
const escaped=(v:unknown)=>ascii(v).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");
const wrap=(v:string,size:number,max:number)=>{
 const lines:string[]=[];let line="";
 for(const word of ascii(v).split(/\s+/).filter(Boolean)){
  if((line+" "+word).length*size*.48<max){line=line?line+" "+word:word;continue;}
  if(line)lines.push(line);
  const limit=Math.max(8,Math.floor(max/(size*.48)));
  for(let n=0;n<word.length;n+=limit){const part=word.slice(n,n+limit);if(n+limit<word.length)lines.push(part);else line=part;}
 }
 if(line)lines.push(line);
 return lines.length?lines:[""];
};
const stage=(year:string)=>{
 const n=Number(year);
 if(!Number.isFinite(n)||n<=0)return "ES1";
 return n<=2?"S1":n<=4?"S2":n<=6?"S3":n<=8?"S4":n<=10?"S5":"S6";
};
export function generateHomeEducationTemplate(state:string,yearLevel="3"):Uint8Array {
 if(!Object.prototype.hasOwnProperty.call(JURISDICTIONS,state)||state==="OTHER")throw Error("Invalid state");
 const jur=JURISDICTIONS[state as JurisdictionCode];
 const pages:Page[]=[];let page!:Page,y=0,sequence=0;
 const newPage=()=>{
  page={draw:[],fields:[]};pages.push(page);y=777;
  // Restrained Side-Quest branding: forest-green title bar, bronze rule,
  // white pages, generous margins and functional form areas.
  page.draw.push("0.13 0.23 0.17 rg 0 789 595 53 re f");
  page.draw.push("1 1 1 rg BT /B 15 Tf 44 808 Td (SIDE-QUEST) Tj ET");
  page.draw.push("0.91 0.81 0.60 rg BT /R 9 Tf 175 810 Td (HOME EDUCATION DOCUMENT STUDIO) Tj ET");
  page.draw.push("0.76 0.62 0.38 rg 44 784 507 2 re f");
  page.draw.push("0.14 0.18 0.14 rg");
 };
 const ensure=(h:number)=>{if(y-h<65)newPage();};
 const label=(s:string,size=10,bold=false)=>{
  const lines=wrap(s,size,507);ensure(lines.length*(size+4)+8);
  for(const l of lines){page.draw.push(`BT /${bold?"B":"R"} ${size} Tf 44 ${y} Td (${escaped(l)}) Tj ET`);y-=size+4;}
  y-=6;
 };
 const field=(title:string,h=68)=>{
  const lines=wrap(title,10,507);
  ensure(lines.length*14+h+20);
  for(const l of lines){page.draw.push(`BT /B 10 Tf 44 ${y} Td (${escaped(l)}) Tj ET`);y-=14;}
  y-=h+3;sequence++;
  page.fields.push({name:`answer_${String(sequence).padStart(3,"0")}`,x:46,y,width:504,height:h});
  page.draw.push(`0.76 0.80 0.75 RG 0.7 w 46 ${y} 504 ${h} re S`);
  // Writing guides remain visible in a printed copy without obstructing
  // digital AcroForm widgets. One line per 19pt.
  if(h>35)for(let ruled=y+19;ruled<y+h-7;ruled+=19)
    page.draw.push(`0.88 0.90 0.86 RG 0.35 w 59 ${ruled} m 538 ${ruled} l S`);
  page.draw.push("0.14 0.18 0.14 rg");
  y-=17;
 };
 const heading=(s:string)=>{
   ensure(54);y-=15;
   page.draw.push(`0.92 0.95 0.91 rg 43 ${y-8} 510 32 re f`);
   page.draw.push(`0.16 0.34 0.21 rg BT /B 13 Tf 53 ${y+4} Td (${escaped(s)}) Tj ET`);
   page.draw.push("0.14 0.18 0.14 rg");y-=45;
 };
 const cover=()=>{
   page={draw:[],fields:[]};pages.push(page);y=200;
   page.draw.push("0.13 0.23 0.17 rg 0 515 595 327 re f");
   page.draw.push("0.78 0.61 0.39 rg 54 752 487 3 re f");
   page.draw.push("1 1 1 rg BT /B 19 Tf 56 711 Td (SIDE-QUEST) Tj ET");
   page.draw.push("0.90 0.84 0.71 rg BT /R 12 Tf 56 686 Td (HOME EDUCATION DOCUMENT STUDIO) Tj ET");
   page.draw.push(`1 1 1 rg BT /B 27 Tf 56 624 Td (Home Education) Tj ET`);
   page.draw.push(`1 1 1 rg BT /B 27 Tf 56 587 Td (Planning Workbook) Tj ET`);
   page.draw.push(`0.90 0.84 0.71 rg BT /B 15 Tf 56 545 Td (${escaped(jur.name)}) Tj ET`);
   page.draw.push("0.17 0.28 0.19 rg BT /B 14 Tf 56 467 Td (WRITE. PLAN. REFLECT.) Tj ET");
   page.draw.push("0.24 0.27 0.24 rg BT /R 11 Tf 56 435 Td (A practical, printable and digitally fillable planning companion.) Tj ET");
   page.draw.push("0.94 0.95 0.92 rg 50 265 495 133 re f");
   page.draw.push("0.16 0.20 0.16 rg BT /B 11 Tf 65 368 Td (BEFORE YOU BEGIN) Tj ET");
   const lines=[
     "1. Use each field to record your family's actual learning program.",
     "2. Type directly into supported PDF readers, or print and handwrite.",
     "3. Review the official state requirements linked at the end.",
     "4. Use official authority forms whenever they are prescribed.",
   ];
   lines.forEach((s,i)=>page.draw.push(`BT /R 10 Tf 65 ${344-i*22} Td (${escaped(s)}) Tj ET`));
   page.draw.push("0.33 0.36 0.33 rg BT /R 9 Tf 56 184 Td (Independent Side-Quest resource; not a government application or approval.) Tj ET");
   page.draw.push(`BT /R 9 Tf 56 164 Td (Official-source summary last checked ${escaped(CHECKED_ON)}. Confirm changes before submission.) Tj ET`);
 };
 cover();
 newPage();
 heading(jur.name+" - "+jur.planName);
 label("Independent fillable planning worksheet. NOT an official government form or proof of registration.",9);
 label("Source catalogue checked "+CHECKED_ON+". Confirm current requirements and prescribed forms with the education authority.",9);
 field("Learner name or preferred identification",32);
 field("Year level / stage (suggested "+yearLevel+")",32);
 field("Learning period (start and end)",32);
 field("Learning goals and educational priorities",92);
 field("Learner interests, strengths and individual learning needs",92);
 field("Teaching approach and adjustments",92);
 field("Learning rhythm, time allocation and supervision",92);
 field("Learning environments and practical arrangements",80);
 heading("Learning areas");
 label("Complete with your actual plans, resources, curriculum links and evidence approach. No outcomes are pre-claimed.",9);
 const areas=planAreas(jur,{year_level:yearLevel,stage:stage(yearLevel)}).areas;
 for(const area of areas){
  heading(area);
  field("Planned topics, learning goals and relevant curriculum",90);
  field("Teaching activities, strategies and learning experiences",90);
  field("Resources, assessment, work samples and progress evidence",90);
 }
 heading("Progress, resources and review");
 field("Approach to assessing progress and achievement",90);
 field("Actual books, materials, tools and learning resources",90);
 field("Evidence, dated work samples and recordkeeping",90);
 field("Review schedule and how the program will be adjusted",90);
 heading("State requirements - parent review");
 label("This checklist is not an automated compliance assessment. Verify each item against current authority guidelines.",9);
 for(const req of jur.requirements){label("- "+req,9);field("Your supporting plans, records and evidence",62);}
 heading("Official sources");
 for(const src of jur.sources)label(src.title+" - "+src.url,8);
 heading("Final parent check");
 label("Check this plan, provide honest and individualised information, and use any prescribed government forms. Side-Quest cannot guarantee approval.",9);
 const objects:string[]=[""];
 const reserve=()=>{objects.push("");return objects.length-1;};
 const set=(id:number,data:string)=>{objects[id]=data;};
 const regular=reserve(),bold=reserve(),pagesId=reserve(),catalog=reserve();
 set(regular,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
 set(bold,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
 const pids:number[]=[],widgets:number[]=[];
 for(const [index,p] of pages.entries()){
  const pid=reserve();pids.push(pid);const streamId=reserve();
  const content=p.draw.join("\n")+"\n"+`BT /R 8 Tf 44 32 Td (Side-Quest | ${jur.code} | page ${index+1} of ${pages.length} | draft fillable template) Tj ET\n`;
  set(streamId,`<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}endstream`);
  const annots:number[]=[];
  for(const f of p.fields){
   const id=reserve();annots.push(id);widgets.push(id);
   set(id,`<< /Type /Annot /Subtype /Widget /FT /Tx /T (${f.name}) /V () /Rect [${f.x} ${f.y} ${f.x+f.width} ${f.y+f.height}] /F 4 /Ff ${f.height>35?4096:0} /DA (/Helv 10 Tf 0 g) /Border [0 0 0] /P ${pid} 0 R >>`);
  }
  set(pid,`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${A4_WIDTH} ${A4_HEIGHT}] /Resources << /Font << /R ${regular} 0 R /B ${bold} 0 R >> >> /Contents ${streamId} 0 R /Annots [${annots.map(id=>id+" 0 R").join(" ")}] >>`);
 }
 set(pagesId,`<< /Type /Pages /Kids [${pids.map(id=>id+" 0 R").join(" ")}] /Count ${pids.length} >>`);
 set(catalog,`<< /Type /Catalog /Pages ${pagesId} 0 R /AcroForm << /Fields [${widgets.map(id=>id+" 0 R").join(" ")}] /NeedAppearances true /DA (/Helv 10 Tf 0 g) /DR << /Font << /Helv ${regular} 0 R >> >> >> >>`);
 let pdf="%PDF-1.7\n",offsets=[0];
 for(let id=1;id<objects.length;id++){offsets[id]=new TextEncoder().encode(pdf).length;pdf+=`${id} 0 obj\n${objects[id]}\nendobj\n`;}
 const start=new TextEncoder().encode(pdf).length;
 pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
 for(let i=1;i<objects.length;i++)pdf+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
 pdf+=`trailer\n<< /Size ${objects.length} /Root ${catalog} 0 R >>\nstartxref\n${start}\n%%EOF\n`;
 return new TextEncoder().encode(pdf);
}
