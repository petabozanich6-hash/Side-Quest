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


const jurisdictionHelp:Record<string,{intro:string;focus:string;focusHint:string;record:string;recordHint:string;reminder:string}>={
 NSW:{
  intro:"NSW home education programs use current NESA syllabuses. Identify the relevant syllabus stage and the learning areas selected for this child.",
  focus:"Syllabus stage and learning-area choices",
  focusHint:"Identify the stage, syllabus source and any secondary elective syllabuses. Check syllabus implementation dates and use verified outcomes only.",
  record:"How we will explain the program and its evidence",
  recordHint:"Note how this plan reflects the child's needs, how learning will occur and where dated work samples will be kept.",
  reminder:"NSW syllabus documents are being updated. Check implementation dates and the department's current registration guidelines before use."
 },
 VIC:{
  intro:"A Victorian home education learning plan can use a subject-based or activity-based approach, while showing how the program substantially addresses the eight learning areas.",
  focus:"Our learning approach and how it covers the eight areas",
  focusHint:"Describe your subject-based or activity-based approach. If an activity contributes to several areas, explain how.",
  record:"The actual books, resources and learning locations",
  recordHint:"List real titles, websites, apps or community services and when or where the activities will happen.",
  reminder:"Check the VRQA's current guidance on learning plans, registration and any learning-area exemptions."
 },
 QLD:{
  intro:"Queensland uses a summary of the educational program. Explain the intended education and how it suits this child, rather than promising every lesson in advance.",
  focus:"Why this educational program suits our learner",
  focusHint:"Explain how the planned approach responds to the child's age, ability, aptitude, interests and development.",
  record:"Progress and reporting over the registration period",
  recordHint:"Describe actual evidence, reflection and review. A continuing registration may also need an updated program summary.",
  reminder:"Check Queensland Home Education's current reporting and program summary requirements."
 },
 WA:{
  intro:"In Western Australia, a home education moderator considers both the education program and the child's educational progress. Plan for an individual learner and collect varied evidence.",
  focus:"Individual goals and program approach",
  focusHint:"Explain the child's strengths, interests, learning priorities and how activities develop knowledge and skills.",
  record:"Progress examples for a moderator discussion",
  recordHint:"Identify practical work samples, photos, discussions or records that will demonstrate learning over time.",
  reminder:"Read the WA Department's current program and moderator evaluation guidance, including its discussion of the WA Curriculum."
 },
 SA:{
  intro:"South Australian planning should make the learning program, activities, resources, evidence and opportunities for social interaction clear.",
  focus:"Learning coverage and planned activities",
  focusHint:"Explain how the program covers the relevant learning areas, with actual topics, activities and resources.",
  record:"Evidence of literacy, numeracy and social learning",
  recordHint:"Identify progress observations and work samples, especially literacy and numeracy, plus appropriate social opportunities.",
  reminder:"Check SA's latest home education guidance, registration conditions and review process."
 },
 TAS:{
  intro:"Tasmania's home education guidance is organised around standards including literacy, numeracy, range of learning areas, wellbeing, pedagogy and evaluation.",
  focus:"How our program addresses the home education standards",
  focusHint:"Describe literacy, numeracy and suitable breadth; include the learner's personal goals and wellbeing.",
  record:"How we will teach and evaluate learning",
  recordHint:"Explain your teaching approach, observations, learning evidence and how the program will change over time.",
  reminder:"Check the Office of the Education Registrar's current Home Education Summary and Program guidance."
 },
 ACT:{
  intro:"An ACT Statement of Intent explains educational opportunities and learning strategies suited to the individual child's development and interests.",
  focus:"Opportunities across the child's development",
  focusHint:"Describe opportunities supporting intellectual, social, emotional, physical and family-led spiritual development.",
  record:"Learning strategies and citizenship",
  recordHint:"Explain ways to encourage learning and build independent participation in local and global communities.",
  reminder:"Check the ACT's Statement of Intent and annual Home Education Report processes and deadlines."
 },
 NT:{
  intro:"The Northern Territory requires an applicable department template for self-developed plans. This Side-Quest workbook is a preparation companion, not a substitute for that official template.",
  focus:"Topics, learning content and curriculum references",
  focusHint:"Identify learning content and current Australian Curriculum references for the child's year and subjects.",
  record:"Assessment tasks and actual learning resources",
  recordHint:"Plan a suitable assessment approach and name the books, materials, software or services you actually intend to use.",
  reminder:"IMPORTANT: Transfer your completed plan to the current NT government self-developed plan form where required. Do not lodge this workbook in its place."
 }
};
const NSW_ELECTIVES=["PDHPE","Creative Arts","Languages","Technology"] as const;

/**
 * Backward-compatible API. mode and edition are owner publishing options:
 * existing three-argument preview/paid routes continue to generate fillable
 * planning workbooks. Full editions add printable and interactive record pages.
 */
export function generateHomeEducationTemplate(state:string,yearLevel="3",sampleOnly=false,mode:Mode="fillable",edition:Edition="standard",selectedElectives:string[]=[],productKind="blank"):Uint8Array{
 if(!Object.prototype.hasOwnProperty.call(JURISDICTIONS,state)||state==="OTHER")throw Error("Invalid state");
 if(!/^(K|F|Prep|[1-9]|1[0-2])$/i.test(yearLevel))throw Error("Invalid school year");
 if(mode!=="fillable"&&mode!=="print")throw Error("Invalid PDF edition");
 if(edition!=="standard"&&edition!=="complete")throw Error("Invalid document range");
 const kinds=["blank","guided","printed","planner_blank","planner_personalised","planner_printed"];
 if(!kinds.includes(productKind))throw Error("Invalid document product.");
 const master=["guided","planner_personalised","planner_printed"].includes(productKind);
 const productTitles:Record<string,string>={
  blank:"Planning Template",guided:"Guided Planning Master",printed:"Printed Workbook",
  planner_blank:"Complete Planner & Diary",planner_personalised:"Personalised Planner Master",
  planner_printed:"Spiral-Bound Planner Master"
 };
 const jur=JURISDICTIONS[state as JurisdictionCode];
 const displayYear=/^(K|F|Prep)$/i.test(yearLevel)?jur.foundationYear:yearLevel;
 const rawElectives=Array.isArray(selectedElectives)?selectedElectives:[];
 const chosen=rawElectives.filter(v=>NSW_ELECTIVES.some(a=>a===v));
 if(chosen.length!==rawElectives.length||new Set(chosen).size!==chosen.length||chosen.length>2)throw Error("Select up to two different NSW elective learning areas.");
 const isNswSecondary=state==="NSW"&&/^(7|8|9|10)$/.test(yearLevel);
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
  const cost=lbl.length*15+hint.length*13+height+35;
  ensure(cost);
  for(const s of lbl){text(s,L+3,y,11,true,green);y-=15;}
  for(const s of hint){text(s,L+3,y,8.8,false,muted);y-=13;}
  y-=12;
  const bottom=y-height;
  outline(L,bottom,R-L,height);
  if(mode==="print"&&!short)for(let yy=bottom+23;yy<y-5;yy+=24)rule(L+13,yy,R-13,"0.87 0.89 0.86");
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
 // Every editable table cell is its own multiline PDF field. Optional static
 // first-column labels make curriculum maps useful without asking families to
 // keep rewriting the learning area on every line.
 const table=(headings:string[],rows:number,rowHeight=98,options?:{widths?:number[];rowLabels?:string[]})=>{
  const widths=options?.widths || (headings.length===4?[79,133,144,145]:
    headings.length===3?[125,188,188]:headings.length===2?[165,336]:[]);
  if(!widths.length||widths.length!==headings.length||widths.reduce((a,b)=>a+b,0)!==R-L)
   throw Error("Invalid table column dimensions.");
  const xs=[L];
  for(let i=1;i<widths.length;i++)xs.push(xs[i-1]+widths[i-1]);
  const head=()=>{
   ensure(30+rowHeight+14);
   rect(L,y-31,R-L,31,"0.92 0.95 0.92");
   headings.forEach((heading,i)=>wrap(heading,8.4,widths[i]-12).slice(0,2).forEach((line,j)=>
    text(line,xs[i]+6,y-13-j*11,8.4,true,green)));
   y-=31;
  };
  head();
  for(let i=0;i<rows;i++){
   if(y-rowHeight-9<BOTTOM){
    page();
    text("WORKING TABLE - CONTINUED",L,y,9,true,muted);y-=20;
    head();
   }
   const bottom=y-rowHeight;
   if(i%2===1)rect(L,bottom,R-L,rowHeight,"0.987 0.99 0.984");
   widths.forEach((width,j)=>{
    outline(xs[j],bottom,width,rowHeight);
    const label=j===0?options?.rowLabels?.[i]:undefined;
    if(label){
     wrap(label,9,width-13).slice(0,Math.max(1,Math.floor((rowHeight-12)/14))).forEach((line,k)=>
      text(line,xs[j]+6,y-16-k*14,9,true,green));
    }else{
     if(mode==="print")for(let yy=bottom+25;yy<y-7;yy+=25)
      rule(xs[j]+7,yy,xs[j]+width-7,"0.88 0.9 0.86");
     fieldNumber++;
     if(mode==="fillable")p.fields.push({
      name:"answer_"+String(fieldNumber).padStart(4,"0"),kind:"text",
      x:xs[j]+4,y:bottom+4,width:width-8,height:rowHeight-8
     });
    }
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
 text(productKind==="blank"&&edition==="complete"?"Planner & Diary":productTitles[productKind],L,580,productKind==="planner_personalised"||productKind==="planner_printed"?25:27,true,"1 1 1");
 for(const [i,s] of wrap(jur.name,16,480).entries())text(s,L,520-i*20,16,true,"0.91 0.83 0.69");
 text(/^(K|F|Prep)$/i.test(yearLevel)?displayYear:"Year "+displayYear,L,479,11,true,"0.91 0.83 0.69");
 text("PLAN. TEACH. RECORD. REFLECT.",L,428,14,true,green);
 const coverSubtitles:Record<string,string>={
  blank:"A4 printing and digitally fillable PDF",
  guided:"Owner master for individual guided preparation",
  printed:"A4 printed-and-posted workbook production master",
  planner_blank:"A4 printing and digitally fillable family diary",
  planner_personalised:"Owner master - prepare each family edition individually",
  planner_printed:"Owner print master - final family edition still required"
 };
 text(coverSubtitles[productKind],L,396,10.3,false,ink);
 text("A4 documents for Australian home educating families",L,374,10,false,muted);
 rect(L,231,R-L,108,"0.95 0.96 0.94");
 text("BEFORE YOU BEGIN",L+16,313,11,true,green);
 ["Complete each field using your family's real plans and records.",
  "Print and handwrite, or type in a compatible PDF reader.",
  "Verify current guidance with your state or territory authority.",
  "Use an official government form wherever one is prescribed."
 ].forEach((s,i)=>text(String(i+1)+". "+s,L+16,288-i*20,9.4,false,ink));
 if(master)text("OWNER PRODUCTION MASTER - NOT A FINISHED PERSONALISED CUSTOMER DOCUMENT",L,150,8.2,true,"0.58 0.17 0.13");
 text("Independent resource - not a government form or registration guarantee.",L,120,9,false,muted);
 text("Official-source catalogue last checked "+CHECKED_ON+". Review before using.",L,102,8.4,false,muted);
 if(state==="NT")text("NT: Use the department\'s prescribed self-developed plan form for submission.",L,82,8.2,true,green);
 
 if(productKind==="guided"){
  startSection("GUIDE","How this guided document is completed","This is an owner production master. A genuine guided plan is based on the individual family's information, not a pre-written generic answer.");
  const steps=[
   ["01. Understand the learner","Ask the family to describe interests, current strengths, needs and realistic priorities. Do not infer diagnoses or add fictional achievements."],
   ["02. Choose goals and learning experiences","Identify the real knowledge or skills to develop, the activities that will teach them and actual named resources."],
   ["03. Connect learning and evidence","Link activities to observations, dated work samples and other evidence. Distinguish planned learning from learning already completed."],
   ["04. Review before individual delivery","Check that the plan reflects the actual child's year, jurisdiction, selected learning areas and family's approved wording."]
  ];
  for(const [heading,explain] of steps){
   ensure(96);text(heading,L+3,y,12,true,green);y-=21;lines(explain,L+5,R-L-12,9.6,16);y-=26;
  }
  field("Owner production notes (not a substitute for family input)","Record missing information and specific questions before preparing the real personalised document.",115);
 }

 startSection("01","Learner and planning period","Start with the details that make this a plan for an individual learner. Leave fields blank until you have accurate information.");
 pair("Learner name / identifier","Year level / stage ("+displayYear+")");
 pair("Planning start date","Planning end date");
 field("What does this learner enjoy and do well?","Interests, strengths, motivations and current skills.",148);
 field("What would meaningful progress look like?","Include a few realistic learning and development goals.",158);

 // Each jurisdiction receives a bespoke working page, not an NSW cover with a new name.
 const local=jurisdictionHelp[state];
 startSection(jur.code,"Preparing your "+jur.planName,
   "An independent planning companion, tailored to "+jur.name+". The official authority may prescribe additional documents.");
 ensure(79);
 lines("Education authority: "+jur.authority,L+3,R-L-6,9.1,15,green);
 y-=7;
 lines(local.intro,L+3,R-L-6,9.5,16);
 y-=10;
 ensure(61);
 lines(local.reminder,L+3,R-L-10,9,15,muted);
 y-=15;
 field(local.focus,local.focusHint,183);
 field(local.record,local.recordHint,183);
 if(isNswSecondary){
  startSection("NSW 7-10","Two additional learning areas",
    "The family must choose two further subjects, each from a different eligible key learning area. Choosing a category here does not select a particular syllabus.");
  const options=chosen.length===2?chosen:["To choose (first area)","To choose (second area)"];
  pair("Additional area 1: "+options[0],"Additional area 2: "+options[1]);
  field("Specific syllabus or subject for each additional area",
    "Choose and verify the specific syllabus in each of the two categories. Do not treat this blank workbook as evidence that a particular syllabus has been selected.",127);
  field("Curriculum source and learning plan for the two chosen subjects",
    "Identify the actual syllabus, current implementation date, proposed learning and real resources for each.",131);
 }
 if(state==="NSW"&&/^(11|12)$/.test(yearLevel)){
  startSection("NSW 11-12","Senior secondary course and pattern-of-study planning",
    "Senior secondary requirements differ from the K-10 learning-area structure. Check the correct course selection and pattern of study against current NSW guidance.");
  field("Proposed senior secondary courses and levels","List the actual course names and relevant year or level after checking the authority rules.",125);
  field("Pattern of study and verified syllabus references","Record how course selection and study requirements were checked.",125);
 }

 startSection("02","How learning will happen","Explain your approach in plain language. A useful plan describes what the parent actually intends to do.");
 field("Learning approaches and teaching strategies","For example: discussion, modelling, guided practice, independent projects, hands-on learning.",145);
 field("Adjustments and learning support","Outline practical supports or changes to pace, resources or instruction. Sensitive medical details are not needed here.",137);
 field("Learning environment, routine and supervision","Describe where, when and with whom learning will normally happen.",145);

 startSection("03","Resources and recording","Named resources and a clear recordkeeping method make it easier to follow the program over time.");
 field("Resources we plan to use","Name actual books, websites, programs, community resources, tools and materials.",150);
 field("How we will record progress","Describe dated work samples, reading records, projects, observations or other methods.",145);
 field("How and when we will review the plan","For example: periodic reflections, work samples, discussions and adjustments.",145);

 startSection("03A","Resource inventory","Name real books, websites, practical equipment and community resources. Each row has room to say how the resource supports learning.");
 table(["Resource / title","How it will be used","Learning area / access"],5,100,{widths:[139,192,170]});

 startSection("03B","Flexible weekly learning plan","A practical planning table, not a compulsory timetable. Enter learning sessions, activities and how you will notice progress.");
 table(["Day / session","Learning goal and planned activities","Resources / progress notes"],5,100,{widths:[111,218,172]});

 const curriculum=planAreas(jur,{year_level:yearLevel,stage:stage(yearLevel)},[],isNswSecondary?chosen:[]);
 const areas=[...curriculum.areas];
 if(isNswSecondary&&chosen.length<2){
  for(let i=chosen.length;i<2;i++)areas.push("Elective "+(i+1)+" - parent to choose");
 }
 startSection("MAP","Learning areas at a glance","A working overview of the learner's actual priorities. The learning areas are printed for you; the two larger columns are separate digital form fields.");
 table(["Learning area","Knowledge / skills to develop","Activities / evidence of progress"],areas.length,91,{
  widths:[148,178,175],rowLabels:areas
 });
 areas.forEach((area,i)=>{
  const hints=areaHints(area),n=String(i+4).padStart(2,"0");
  startSection(n,area+" - learning focus","Use this space for your real curriculum focus and goals. Do not claim outcomes or codes that have not been checked against current sources.");
  field("Learning focus and intended knowledge or skills",hints.focus,145);
  field("Relevant curriculum reference or learning goals","If applicable, enter verified syllabus outcomes, learning areas or your own clearly labelled goals.",135);
  field("Why these learning priorities suit the learner","Connect goals to strengths, needs, interests and progress so far.",135);
  startSection(n+"B",area+" - teaching and evidence","Keep teaching intentions separate from the evidence you will collect after learning has occurred.");
  field("Teaching strategies and planned learning experiences",hints.activities,148);
  field("Materials, texts, places and other learning resources","List concrete resources the family actually has or will obtain.",130);
  field("How progress will be noticed and recorded",hints.evidence,137);
  startSection(n+"C",area+" - lesson and activity planner","Use this practical grid to connect teaching activities to resources and evidence. Repeat or print another page when you need more rows.");
  table(["Week / topic","Learning activities and teaching steps","Resources / work to keep"],4,102,{widths:[105,207,189]});
 });
 startSection("A","Learning records and evidence","This is a working record. Add copies of this page if the family needs more entries. Each large cell can hold multiple lines.");
 table(["Date / focus","Learning completed","Evidence / next step"],5,104,{widths:[115,207,179]});

 startSection("B","Review and adjustments","Reflect on actual learning rather than treating planned activities as completed work.");
 field("Progress, achievements and skills demonstrated","What did the learner understand, make, discuss or practise?",145);
 field("Work samples and records referenced","Record specific evidence references or file names.",138);
 field("What will change in the next planning period?","Identify next steps, teaching adjustments or new resources.",140);

 if(edition==="complete"){
  for(let term=1;term<=4;term++){
   startSection("T"+term,"Planning period "+term,"Use this as a term planner or another planning block. Adapt dates and duration to suit your family's approach.");
   pair("Period starts","Period ends");
   field("Learning priorities and curriculum focus","What will the learner work towards during this period?",148);
   field("Activities, projects and teaching sequence","How will you introduce, practise and extend this learning?",148);
   field("Resources, evidence and review points","What materials and records will help you check progress?",140);
   startSection("W"+term,"Weekly or fortnightly planner - period "+term,
    "Use each spacious row for one learning block or day. Include a realistic activity, named resources and a way to check learning.");
   table(["Day / learning block","Teaching plan and learning goal","Resources / review notes"],5,100,{widths:[112,208,181]});
   startSection("D"+term,"Learning diary - period "+term,"Record actual learning rather than planned activities. Entries can be typed, saved or handwritten.");
   table(["Date / learning area","Learning completed / observations","Evidence / reflection"],5,100,{widths:[121,207,173]});
  }
  startSection("R","Reading and literacy record","Use a separate row for each reading experience. Include read-alouds, audiobooks and other text experiences as relevant.");
  table(["Date / book or text","What we read / discussed","Response, questions / next step"],5,102,{widths:[138,184,179]});
  startSection("E","Evidence portfolio index","Record where work samples are kept and what they actually show. Use filenames or references that match your stored evidence.");
  table(["Date / evidence ID","Learning focus / work sample","What this shows / follow-up"],5,102,{widths:[132,184,185]});
  startSection("O","Outcomes and goals tracker","Enter only verified syllabus outcomes or clearly identified personal goals. Record actual evidence separately from the intended goal.");
  table(["Area / goal or code","Planned work / resources","Evidence, progress / next step"],5,102,{widths:[152,174,175]});
  startSection("P","Projects and excursions","Document the learning connected to visits, community activities and projects, not only a date and attendance.");
  table(["Date / project or place","Learning focus and activities","Evidence / reflection"],5,102,{widths:[134,188,179]});
  startSection("F","Family review","Revisit this page at an interval that works for your family.");
  field("What has worked particularly well?","Consider engagement, understanding, confidence and practical experiences.",152);
  field("What were the challenges?","Record changes needed in teaching, resources, environment or timing.",152);
  field("Our priorities for the next learning period","List achievable next steps and how progress will be recorded.",155);
  startSection("X","Extra family planning notes","A blank, flexible space for the ideas, questions or adjustments that don't fit into the structured records.");
  field("Questions, ideas, learning possibilities and family notes","Record anything important to the next planning period.",237);
  field("Further reflections and follow-up actions","Keep longer notes together without squeezing them into a small table cell.",237);
 }
 startSection("C","Requirements: parent review","Use this section as a preparation aid, not a compliance certificate. Verify the latest authority guidance.");
 for(const [i,req] of jur.requirements.entries()){
  if(i>0&&i%3===0)startSection("C"+String(Math.floor(i/3)+1),"Requirements - continued","Review each item against the official authority guidance and note what you still need to prepare.");
  checkbox(req);
  field("Evidence or planning notes for item "+(i+1),"Reference the relevant section, dated work sample or action still to complete.",92,true);
 }
 startSection("N","Additional working notes","An open writing space for questions, planning changes, supplementary evidence or anything you need to explain in more detail.");
 field("Planning notes / extra information","Use this page for longer answers that don't fit into another area.",230);
 field("Next steps / information to verify","Write down additional resources, follow-up tasks or matters to check.",230);
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
   if(master)sheet.draw.push("0.58 0.17 0.13 rg BT /B 7.4 Tf "+L+" 27 Td (OWNER MASTER - NOT FOR AUTOMATIC DIGITAL DELIVERY) Tj ET");
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