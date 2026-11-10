// Shared Side-Quest branded guided plan renderer. Exact same design for owner
// previews and customer PDF attachments. Public sample uses a short excerpt.
const esc=(v:unknown)=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const para=(v:unknown)=>'<p>'+esc(String(v??"").trim()||"To be completed by the family.")+'</p>';
const entries=(v:unknown)=>Array.isArray(v)?v.filter(x=>String(x??"").trim()).map(x=>'<li>'+esc(x)+'</li>').join(""):"";
const box=(label:string,value:unknown)=>'<div class="family-box"><h3>'+esc(label)+'</h3>'+para(value)+'</div>';
const section=(name:string,body:unknown)=>'<section class="narrative"><h2>'+esc(name)+'</h2>'+para(body)+'</section>';
const bulletSection=(label:string,items:unknown)=>'<div class="bullet-section"><h3>'+esc(label)+'</h3><ul>'+entries(items)+'</ul></div>';
const heading=(number:string,kicker:string,title:string)=>'<div class="section-band"><span>'+esc(number)+' · '+esc(kicker)+'</span><h2>'+esc(title)+'</h2></div>';
const CSS=[
"@page{size:A4;margin:18mm 16mm 19mm}",
"*{box-sizing:border-box}body{margin:0;font:10.3pt/1.55 Arial,Helvetica,sans-serif;color:#252B25;background:white}",
"h1,h2,h3,p{margin-top:0}p{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#1F3B2D;overflow-wrap:anywhere}",
".cover{break-after:page;min-height:240mm}.cover-top{background:#1F3B2D;color:white;padding:23mm 16mm 18mm;margin:-18mm -16mm 0;min-height:122mm}",
".brand{font-size:18pt;font-weight:800;letter-spacing:3px}.brand small{display:block;color:#D4A574;font-size:8pt;letter-spacing:2px;margin-top:5px}",
".gold-rule{background:#D4A574;height:3px;width:65mm;margin:20mm 0 19mm}.cover-title{font-size:30pt;font-weight:800;line-height:1.13;max-width:150mm;letter-spacing:-.7px}",
".cover-edition{font-size:12pt;color:#F0E5D4;margin-top:11mm}.cover-bottom{padding:18mm 3mm 0}.eyebrow{text-transform:uppercase;letter-spacing:1.7px;font-size:8pt;color:#4A5D3A;font-weight:bold}",
".learner{font-size:21pt;font-weight:bold;color:#1F3B2D;margin:4mm 0 9mm}.facts{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #BFCDBA;border-bottom:1px solid #BFCDBA;padding:13px 0;gap:12px}",
".facts strong{font-size:8pt;text-transform:uppercase;letter-spacing:1px;color:#64745E;display:block}.disclaimer{margin-top:9mm;background:#F5EFE0;border-left:4px solid #D4A574;padding:13px 15px;font-size:9pt}",
".pagehead{display:flex;justify-content:space-between;border-bottom:3px solid #D4A574;padding:0 0 10px;margin-bottom:23px;color:#1F3B2D;font-weight:bold;font-size:9pt;letter-spacing:1px}",
".pagehead em{font-weight:normal;font-style:normal;color:#64745E}.section-band{background:#1F3B2D;color:white;padding:11px 16px;margin:26px 0 19px;break-after:avoid}",
".section-band span{font-size:8pt;letter-spacing:1.8px;color:#E4CCA4}.section-band h2{font-size:15pt;color:white;margin:3px 0 0}",
".narrative{margin:20px 0}.narrative h2{font-size:13pt;color:#1F3B2D;border-bottom:1px solid #CBD7C4;padding-bottom:7px;margin:0 0 9px;break-after:avoid}",
".narrative p{margin:0}.family-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.family-box{border:1px solid #CED9CA;padding:13px 15px;margin:12px 0;break-inside:auto;border-radius:5px}",
".family-box h3{font-size:10pt;color:#1F3B2D;margin:0 0 7px}.family-box p{margin:0}",
".area{margin:18px 0 30px}.area-title{background:#EBF1E8;border-left:6px solid #D4A574;padding:12px 15px;color:#1F3B2D;font-size:16pt;font-weight:800;break-after:avoid}",
".area-caption{font-size:8.5pt;color:#64745E;margin:7px 0 17px}.bullet-section{margin:18px 0}.bullet-section h3{padding:8px 11px;background:#F5EFE0;color:#1F3B2D;font-size:10pt;margin:0 0 10px;break-after:avoid}",
"ul{padding-left:22px;margin:9px 0 14px}li{margin:0 0 7px}.checklist{padding:0;list-style:none}.checklist li{border-bottom:1px solid #D5DFD0;padding:9px 0;break-inside:avoid}",
".checklist li::before{content:'[ ] ';font-weight:bold;color:#4A5D3A}.sample-banner{padding:13px;background:#F7EEDC;border-left:4px solid #BE843C;color:#573A19;font-weight:bold;margin:15px 0}",
".fine{font-size:8.5pt;color:#576454}.pagefoot{border-top:1px solid #D4A574;margin-top:30px;padding-top:9px;font-size:8pt;color:#61705A;display:flex;justify-content:space-between}",
"@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.cover{break-after:page}}"
].join("\n");
type Input={content:Record<string,any>; jurisdiction:{code:string;name:string;planName:string;requirements?:string[];sources?:{title:string;url:string}[]};data:Record<string,any>;checked_on:string};
export function renderGuidedDocumentLayout(r:Input,sampleOnly=false):string{
 const c=r.content,j=r.jurisdiction,d=r.data;
 const areaList=(Array.isArray(c.learning_areas)?c.learning_areas:[]);
 const shown=sampleOnly?areaList.slice(0,1):areaList;
 const areas=shown.map((area:any,i:number)=>{
  const family=d.areas?.[area.area]||{};
  return '<section class="area"><div class="area-title">'+esc(area.area)+'</div>'+
    '<p class="area-caption">Learning area '+(i+1)+' · Goals, activities, resources and assessment</p>'+
    bulletSection("Learning goals",area.goals)+bulletSection("Teaching methods",area.teaching_methods)+
    bulletSection("Learning experiences",area.sample_activities)+
    box("Our learning priorities",family.focus)+box("Our planned activities",family.activities)+
    box("Resources and evidence",family.evidence)+box("Recording progress",area.evidence_approach)+'</section>';
 }).join("");
 const cover='<section class="cover"><div class="cover-top"><div class="brand">SIDE-QUEST<small>HOME EDUCATION DOCUMENT STUDIO</small></div>'+
    '<div class="gold-rule"></div><div class="cover-title">Your Home Education Plan</div>'+
    '<p class="cover-edition">Guided personalised edition · '+esc(j.name)+'</p></div>'+
    '<div class="cover-bottom"><p class="eyebrow">Prepared for</p><div class="learner">'+esc(d.learner_name||"Learner")+'</div>'+
    '<div class="facts"><div><strong>Year level</strong>'+esc(d.year_level||"To complete")+'</div>'+
    '<div><strong>Planning period</strong>'+esc(d.period_start||"")+" to "+esc(d.period_end||"")+'</div></div>'+
    '<p class="disclaimer">Independent Side-Quest planning resource. Not a government form, endorsement or registration guarantee. Verify all content and current requirements before submission.</p></div></section>';
 const pageHead='<header class="pagehead"><span>SIDE-QUEST</span><em>HOME EDUCATION · '+esc(j.code)+'</em></header>';
 let body=cover+pageHead+(sampleOnly?'<p class="sample-banner">FREE SAMPLE · Fictional learner information. This is not a complete purchased document.</p>':"")+
    heading("01","YOUR PROGRAM","The learning plan")+
    section("Overview",c.overview)+section("Educational philosophy",c.educational_philosophy)+
    '<div class="family-grid">'+box("Strengths, interests and learning needs",d.strengths)+box("Family learning goals",d.goals)+'</div>'+
    section("Learning environment and schedule",d.schedule)+
    heading("02","LEARNING AREAS",sampleOnly?"Example learning area":"What and how we will learn")+areas;
 if(sampleOnly)body+='<div class="sample-banner">End of free sample. Purchased documents include all learning areas, progress and evidence planning, resources, review and current authority checklist.</div>';
 else body+=heading("03","PLANNING AND EVIDENCE","Recording learning and progress")+
    section("Weekly learning rhythm",c.weekly_rhythm)+section("Our weekly schedule",d.schedule)+
    section("Assessment and progress approach",c.assessment_approach)+section("How we keep evidence",d.records)+
    section("Resources overview",c.resources_overview)+section("Our named resources",d.resources)+
    section("Review schedule",c.review_schedule)+section("Our approach to review",d.review)+
    heading("04","STATE REQUIREMENTS","Final preparation checklist")+
    '<p class="fine">Check each item yourself against the education authority guidance. Completion does not guarantee approval.</p>'+
    '<ul class="checklist">'+(j.requirements||[]).map(req=>'<li>'+esc(req)+'</li>').join("")+'</ul>'+
    '<section class="narrative"><h2>Official sources</h2><ul>'+(j.sources||[]).map(s=>'<li><strong>'+esc(s.title)+'</strong><br><a href="'+esc(s.url)+'">'+esc(s.url)+'</a></li>').join("")+'</ul></section>'+
    '<p class="fine">Source catalogue last checked '+esc(r.checked_on)+'. Information may have changed. This is a family-prepared plan, not proof that planned activities have already occurred.</p>';
 body+='<footer class="pagefoot"><span>Side-Quest Learning · Independent planning resource</span><span>'+esc(j.name)+'</span></footer>';
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Side-Quest | '+esc(j.planName)+'</title><style>'+CSS+'</style></head><body>'+body+'</body></html>';
}
