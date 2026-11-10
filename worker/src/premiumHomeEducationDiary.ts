import { JURISDICTIONS, CHECKED_ON, planAreas, type JurisdictionCode } from "./data/planJurisdictions";

// Complete Side-Quest premium workbook. Blank and personalised versions share
// all the record sheets. This can be rendered directly with Browser Rendering.
const e=(v:unknown)=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const css=[
"@page{size:A4;margin:16mm 16mm 16mm 21mm}*{box-sizing:border-box}",
"body{font:10pt/1.45 Arial,Helvetica,sans-serif;color:#273327}h1,h2,h3,p{margin:0 0 9px}",
".page{break-after:page;min-height:245mm}.page:last-child{break-after:auto}",
".cover{break-after:page;min-height:250mm}.hero{background:#1F3B2D;color:#fff;margin:-16mm -16mm 0 -21mm;padding:40mm 22mm 22mm;min-height:135mm}",
".brand{font-size:18pt;font-weight:800;letter-spacing:3px}.gold{height:4px;width:80mm;background:#D4A574;margin:20mm 0}",
".hero h1{color:#fff;font-size:30pt;line-height:1.15}.edition{color:#E9D7BC;font-size:12pt}.cover-info{margin-top:18mm}",
".band{background:#1F3B2D;color:#fff;padding:13px 15px;margin:20px 0 18px;break-after:avoid}",
".band h2{font-size:17pt;color:#fff;margin:0}.band small{color:#E8D1AA;letter-spacing:1px}",
".field{margin:15px 0;break-inside:avoid}.field strong{color:#1F3B2D}.lines{height:70px;margin-top:7px;background:repeating-linear-gradient(to bottom,#fff 0,#fff 19px,#CDD7CA 20px,#CDD7CA 21px)}",
".large .lines{height:114px}.note{border-left:4px solid #D4A574;background:#F5EFE0;padding:12px 15px;margin:15px 0;white-space:pre-wrap;overflow-wrap:anywhere}",
"table{border-collapse:collapse;table-layout:fixed;width:100%;margin:15px 0}th,td{border:1px solid #C6D5C3;padding:8px;text-align:left;vertical-align:top}th{color:#1F3B2D;background:#EBF1E8}td{height:36px}",
".hint{font-size:8.5pt;color:#5C6B5A}.footer{margin-top:24px;border-top:1px solid #D4A574;padding-top:8px;font-size:8pt;color:#566651}",
"ul{padding-left:22px}li{margin:8px 0;overflow-wrap:anywhere}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}"
].join("");
const header=(n:string,title:string)=>'<div class="band"><small>SIDE-QUEST | '+e(n)+'</small><h2>'+e(title)+'</h2></div>';
const field=(text:string,long=false)=>'<div class="field '+(long?'large':'')+'"><strong>'+e(text)+'</strong><div class="lines"></div></div>';
const grid=(cols:string[],rows:number)=>'<table><thead><tr>'+cols.map(s=>'<th>'+e(s)+'</th>').join("")+'</tr></thead><tbody>'+Array.from({length:rows},()=>'<tr>'+cols.map(()=>'<td></td>').join("")+'</tr>').join("")+'</tbody></table>';
const page=(html:string)=>'<section class="page">'+html+'<div class="footer">SIDE-QUEST | HOME EDUCATION PLANNER & DIARY | FAMILY RESOURCE</div></section>';
const stage:Record<string,string>={K:"ES1",F:"ES1",Prep:"ES1","1":"S1","2":"S1","3":"S2","4":"S2","5":"S3","6":"S3","7":"S4","8":"S4","9":"S5","10":"S5","11":"S6","12":"S6"};
export function premiumDiaryHtml(code:string,year:string,prepared?:any,short=false):string {
 const codes=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"],years=["K","F","Prep",...Array.from({length:12},(_,i)=>String(i+1))];
 if(!codes.includes(code)||!years.includes(year))throw Error("Unsupported state or year");
 const j=JURISDICTIONS[code as JurisdictionCode];
 const areas=planAreas(j,{year_level:year,stage:stage[year]}).areas;
 const data=prepared?.data||{},filled=!!prepared;
 let out='<section class="cover"><div class="hero"><div class="brand">SIDE-QUEST</div><div class="gold"></div><h1>Home Education<br>Planner & Diary</h1><p class="edition">'+(filled?'Personalised':'Blank')+' family edition | '+e(j.name)+'</p></div>'+
 '<div class="cover-info"><h2>Plan. Learn. Record. Reflect.</h2><p>Individual education plans, curriculum mapping, lesson planning, reading logs, evidence, assessment and review all in one workbook.</p><div class="note">An independent planning resource, not an official government form or guarantee of registration. Verify current requirements. Source summary checked '+e(CHECKED_ON)+'.</div></div></section>';
 out+=page(header('01','Your family and registration')+(filled?'<div class="note">Learner: '+e(data.learner_name)+' | Year '+e(year)+' | '+e(data.period_start)+' to '+e(data.period_end)+'</div>':'')+
   field('Family and learner details')+field('Registration status and contacts')+field('Planning dates and deadlines')+field('Where learning records are stored'));
 out+=page(header('02','Personal learning and curriculum plan')+(filled?'<div class="note">'+e(prepared.content?.overview)+'</div>':'')+
   field('Learner strengths, interests and learning needs',true)+field('Goals, teaching and adjustments',true)+field('Learning schedule and resources',true));
 for(const name of (short?areas.slice(0,1):areas)){
  const a=data.areas?.[name]||{};
  out+=page(header('03','Learning area: '+name)+(filled?'<div class="note">Our topics: '+e(a.focus)+'\nOur activities: '+e(a.activities)+'\nProgress evidence: '+e(a.evidence)+'</div>':'')+
   field('Curriculum, stage, learning outcomes and objectives',true)+field('Activities and teaching approaches',true)+field('Learning resources and assessment',true));
 }
 if(!short){
  for(let term=1;term<=4;term++){
   out+=page(header('04','Term '+term+' goals and lesson planning')+field('Term priorities and curriculum links',true)+field('Lesson plan: objective, materials and teaching sequence',true)+field('Lesson plan: differentiation and progress check',true));
   out+=page(header('05','Term '+term+' learning diary')+'<p class="hint">Duplicate as needed for each week. Record what actually happened.</p>'+field('Week commencing')+grid(['Day / date','Activity and lesson','Outcome / focus','Evidence'],9));
   out+=page(header('06','Term '+term+' evidence tracker')+grid(['Date','Learning area / outcome','Evidence ID / location','What it demonstrates'],12));
   out+=page(header('07','Term '+term+' review')+field('Progress and achievements',true)+field('Work samples and observations',true)+field('Adjustments and next learning goals',true));
  }
  out+=page(header('08','Reading log')+grid(['Date','Text and author','Pages / duration','Response / learning'],13));
  out+=page(header('09','Book discussion and literacy responses')+field('Book / author / learning area')+field('Questions, discussion and vocabulary',true)+field('Written response and progress notes',true));
  out+=page(header('10','Projects, experiments and excursions')+grid(['Date','Activity and subject','Learning intention','Evidence / reflection'],11));
  out+=page(header('11','Outcome and progress tracker')+grid(['Learning area','Relevant syllabus outcome / goal','Evidence reference','Progress / next step'],11));
  out+=page(header('12','Assessment and achievement')+field('Knowledge and skills demonstrated',true)+field('Annotated examples, achievements and reflections',true)+field('Next learning goals and adjustments',true));
  out+=page(header('13','Home education requirements')+'<p class="hint">Check the official authority requirements and any prescribed forms. This list is not a compliance certification.</p><ul>'+j.requirements.map(s=>'<li>[ ] '+e(s)+'</li>').join('')+'</ul>'+field('Preparation for authority reviews'));
  out+=page(header('14','Official sources and review notes')+'<ul>'+j.sources.map(s=>'<li><strong>'+e(s.title)+'</strong>: '+e(s.url)+'</li>').join('')+'</ul>'+field('Questions and supporting documents to prepare',true));
 }else out+=page(header('Sample ends here','Full planner includes the remaining learning areas, term lesson plans, reading logs, outcome tracking, evidence sheets, assessment, review and official sources'));
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Side-Quest Home Education Planner & Diary</title><style>'+css+'</style></head><body>'+out+'</body></html>';
}


// Full family edition: each child has their own lesson, reading, evidence and
// outcomes sections. Concatenate the body pages into a single printable PDF.
export function premiumFamilyDiaryHtml(code:string,children:Array<{year_level:string;prepared?:any}>,blank=false):string{
  if(!Array.isArray(children)||children.length<1||children.length>5)throw Error("Choose 1 to 5 children");
  const docs=children.map(child=>premiumDiaryHtml(code,child.year_level,blank?undefined:child.prepared));
  const first=docs[0],before=first.slice(0,first.indexOf("</head>")+7);
  const bodies=docs.map((html,i)=>{
    const body=html.slice(html.indexOf("<body>")+6,html.lastIndexOf("</body>"));
    return '<div class="family-child" data-child="'+(i+1)+'">'+body+'</div>';
  });
  return before+"<body>"+bodies.join("\n")+"</body></html>";
}
