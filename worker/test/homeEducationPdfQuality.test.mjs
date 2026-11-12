import test from "node:test";
import assert from "node:assert/strict";
import {generateHomeEducationTemplate} from "../src/homeEducationPdf.ts";

const asText=bytes=>new TextDecoder().decode(bytes);
const pages=source=>Number(source.match(/\/Type \/Pages \/Kids \[[^\]]*\] \/Count (\d+)/)?.[1]);
const widgets=source=>(source.match(/\/Type \/Annot \/Subtype \/Widget/g)||[]).length;

test("The original NSW educational plan is now a substantive printable and fillable workbook",()=>{
 const digital=asText(generateHomeEducationTemplate("NSW","3",false,"fillable","standard"));
 const paper=asText(generateHomeEducationTemplate("NSW","3",false,"print","standard"));
 assert.match(digital,/^%PDF-1.7/);
 assert.match(digital,/New South Wales/);
 assert.match(digital,/English - learning focus/);
 assert.match(digital,/Mathematics - teaching and evidence/);
 assert.match(digital,/Science and Technology/);
 assert.match(digital,/Evidence or planning notes/);
 assert.match(digital,/\/AcroForm/);
 assert.match(digital,/\/Ff 4096/);
 assert.match(digital,/\/FT \/Btn/);
 assert.doesNotMatch(paper,/\/AcroForm/);
 assert.equal(widgets(paper),0);
 assert.ok(widgets(digital)>55);
 assert.ok(pages(digital)>15);
 assert.equal(pages(digital),pages(paper));
});
test("Complete diary retains original product scope and adds usable records",()=>{
 const base=asText(generateHomeEducationTemplate("NSW","3"));
 const complete=asText(generateHomeEducationTemplate("NSW","3",false,"fillable","complete"));
 assert.ok(pages(complete)>pages(base)+8);
 for(const phrase of ["Learning diary","Reading and literacy record","Evidence portfolio index","Outcome and goals tracker","Projects and excursions","Family review"])assert.ok(complete.includes(phrase),phrase);
 assert.match(complete,/\/FT \/Tx/);
 assert.match(complete,/\/FT \/Btn/);
});
test("Public samples remain only two watermarked pages",()=>{
 const sample=asText(generateHomeEducationTemplate("QLD","3",true));
 assert.equal(pages(sample),2);
 assert.match(sample,/SAMPLE PREVIEW/);
 assert.doesNotMatch(sample,/Mathematics - learning focus/);
});
test("Field rectangles and text boxes fit within the printable A4 body",()=>{
 const raw=asText(generateHomeEducationTemplate("VIC","7",false,"fillable","complete"));
 const boxes=[...raw.matchAll(/\/Rect \[([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)\]/g)];
 assert.ok(boxes.length>100);
 for(const b of boxes){
  const [x1,y1,x2,y2]=b.slice(1).map(Number);
  assert.ok(x1>=45&&x2<=550&&y1>=65&&y2<=770, "Field outside safe page margins: "+b[0]);
  assert.ok(x2>x1+8&&y2>y1+8);
 }
});


test("all eight Australian jurisdictions have distinct print and fillable editions",()=>{
 const states={
  NSW:"New South Wales",VIC:"Victoria",QLD:"Queensland",WA:"Western Australia",
  SA:"South Australia",TAS:"Tasmania",ACT:"Australian Capital Territory",NT:"Northern Territory"
 };
 const fingerprints=new Set();
 for(const [code,name] of Object.entries(states)){
  for(const year of ["3","7"]){
   for(const edition of ["standard","complete"]){
    const printable=asText(generateHomeEducationTemplate(code,year,false,"print",edition));
    const fillable=asText(generateHomeEducationTemplate(code,year,false,"fillable",edition));
    assert.ok(printable.includes(name),code+" print missing its jurisdiction");
    assert.ok(fillable.includes(name),code+" fillable missing its jurisdiction");
    assert.ok(pages(printable)>10,code+" has an incomplete document");
    assert.equal(pages(printable),pages(fillable),code+" edition pages differ");
    assert.ok(!printable.includes("/AcroForm"),code+" print should not contain widgets");
    assert.ok(fillable.includes("/AcroForm"),code+" needs interactive fields");
    assert.ok(widgets(fillable)>35,code+" needs actual fields");
    assert.ok(!fingerprints.has(fillable),code+" uses a duplicate document");
    fingerprints.add(fillable);
   }
  }
 }
});


test("state-specific preparation page uses each jurisdiction's own plan terminology",()=>{
 const titles={
  NSW:"educational program",VIC:"home education learning plan",QLD:"summary of the educational program",
  WA:"education program",SA:"home education program",TAS:"Home Education Summary and Program",
  ACT:"Statement of Intent",NT:"teaching, learning and assessment plan"
 };
 for(const [state,title] of Object.entries(titles)){
  const pdf=asText(generateHomeEducationTemplate(state,"3",false,"print","standard"));
  assert.ok(pdf.includes("Preparing your "),state+" is missing its preparation chapter");
  assert.ok(pdf.includes(title),state+" lacks its authority terminology");
  if(state==="NT"){
   assert.match(pdf,/department.s prescribed self-developed plan form/);
  }
  if(state==="TAS")assert.match(pdf,/home education standards/i);
  if(state==="WA")assert.match(pdf,/home education moderator/i);
 }
});
test("NSW Years 7-10 explicitly include two selected elective areas rather than silently omitting them",()=>{
 const year7=asText(generateHomeEducationTemplate("NSW","7",false,"fillable","standard",["Languages","Technology"]));
 assert.match(year7,/Two additional learning areas/);
 assert.match(year7,/Additional area 1: Languages/);
 assert.match(year7,/Additional area 2: Technology/);
 assert.match(year7,/Languages - learning focus/);
 assert.match(year7,/Technology - teaching and evidence/);
 const unspecified=asText(generateHomeEducationTemplate("NSW","7"));
 assert.match(unspecified,/Elective 1 - parent to choose/);
 assert.match(unspecified,/Elective 2 - parent to choose/);
 assert.throws(()=>generateHomeEducationTemplate("NSW","7",false,"fillable","standard",["PDHPE","PDHPE"]));
 assert.throws(()=>generateHomeEducationTemplate("NSW","7",false,"fillable","standard",["Languages","Invalid"]));
});
test("NSW senior secondary has an explicit course planning warning and dedicated section",()=>{
 const senior=asText(generateHomeEducationTemplate("NSW","11"));
 assert.match(senior,/Senior secondary course and pattern-of-study planning/);
 assert.match(senior,/Pattern of study and verified syllabus references/);
});


test("large writing spaces and real editable working tables exist in every jurisdiction",()=>{
 const states=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
 for(const state of states){
  const fillable=asText(generateHomeEducationTemplate(state,"3",false,"fillable","standard"));
  const printable=asText(generateHomeEducationTemplate(state,"3",false,"print","standard"));
  for(const phrase of ["Resource inventory","Flexible weekly learning plan","Learning areas at a glance","lesson and activity planner","Additional working notes"]){
   assert.ok(fillable.includes(phrase),state+": missing "+phrase);
  }
  assert.ok(widgets(fillable)>120,state+" needs many independent fillable cells");
  assert.equal(widgets(printable),0,state+" print must remain handwriting-only");
  assert.ok(pages(fillable)>pages(asText(generateHomeEducationTemplate(state,"3",true))),
    state+" expanded form must have real interior pages");
  // The new table cells are tall enough for useful multiline answers.
  const tall=[...fillable.matchAll(/\/Rect \[([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)\]/g)]
   .filter(m=>Number(m[4])-Number(m[2])>=90);
  assert.ok(tall.length>=20,state+" needs spacious cells, not only shallow rows");
 }
});
test("full diary has separate weekly, diary and reading tables with editable cells",()=>{
 const text=asText(generateHomeEducationTemplate("VIC","7",false,"fillable","complete"));
 for(const phrase of ["Weekly or fortnightly planner - period 1","Learning diary - period 1",
  "Reading and literacy record","Evidence portfolio index","Outcomes and goals tracker",
  "Projects and excursions","Extra family planning notes"]){
   assert.ok(text.includes(phrase),"Missing comprehensive planner table: "+phrase);
 }
 assert.ok(widgets(text)>400,"The complete planner needs useful digital space for planning and evidence");
});
