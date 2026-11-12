import test from "node:test";
import assert from "node:assert/strict";
import {buildStudioProductPdf,validateStudioProduct} from "../src/studioProductPdf.ts";

const product={
 title:"My Home Learning Journal",
 subtitle:"A practical record of discoveries",
 audience:"Year 3 learners",
 pages:[
  {title:"What I learned",kind:"writing",instructions:"Write complete sentences using the answer boxes.",prompts:["What did you try?","What new idea did you discover?"]},
  {title:"My checklist",kind:"checklist",instructions:"Tick the steps you have finished.",prompts:["I have completed my work.","I have checked my answer."]},
  {title:"Learning log",kind:"log",instructions:"Record your activities and evidence.",prompts:["Reading","Nature study","Maths activities","Creative work","Project reflection"]},
 ],
};
test("prints and digital exports share the same A4 page count and labels",()=>{
 const printed=buildStudioProductPdf(product,"print"),digital=buildStudioProductPdf(product,"fillable");
 const p=new TextDecoder().decode(printed.pdf);
 const d=new TextDecoder().decode(digital.pdf);
 assert.match(p,/^%PDF-1.4/);
 assert.match(d,/^%PDF-1.4/);
 assert.equal(printed.quality.pages,digital.quality.pages);
 assert.match(p,/\/MediaBox \[0 0 595 842\]/);
 assert.match(p,/My Home Learning Journal/);
 assert.match(d,/My Home Learning Journal/);
 assert.doesNotMatch(p,/\/AcroForm/);
 assert.match(d,/\/AcroForm/);
 assert.match(d,/\/FT \/Tx/);
 assert.match(d,/\/FT \/Btn/);
 assert.ok(digital.quality.form_fields>0);
 assert.equal(printed.quality.form_fields,0);
});
test("long exercises flow onto new pages instead of shrinking response fields",()=>{
 const long={...product,pages:[{title:"Writing practice",kind:"writing",instructions:"Answer the following questions.",prompts:Array.from({length:12},(_,i)=>"Please write a detailed response to question "+(i+1)+".")}]};
 const r=buildStudioProductPdf(long,"fillable");
 assert.ok(r.quality.pages>=4);
 assert.equal(r.quality.form_fields,12);
 assert.match(new TextDecoder().decode(r.pdf),/\/Count [4-9]/);
});
test("rejects empty content, overlong prompts and unsupported activity types",()=>{
 assert.throws(()=>validateStudioProduct({...product,title:""}),/Product title/);
 assert.throws(()=>validateStudioProduct({...product,pages:[]}),/activity pages/);
 assert.throws(()=>validateStudioProduct({...product,pages:[{...product.pages[0],prompts:[""]}]}),/Prompt/);
 assert.throws(()=>validateStudioProduct({...product,pages:[{...product.pages[0],kind:"drawing"}]}),/valid activity type/);
});
