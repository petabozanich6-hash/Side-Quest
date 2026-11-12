import {mkdirSync,writeFileSync} from "node:fs";
import {generateHomeEducationTemplate} from "../src/homeEducationPdf.ts";

// Produce every supported jurisdiction, not an NSW-only proof.
const dir=process.env.PROOF_DIR||"document-proof";
const jurisdictions=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
mkdirSync(dir,{recursive:true});
for(const state of jurisdictions){
  for(const edition of ["standard","complete"]){
    for(const mode of ["print","fillable"]){
      const file=dir+"/sidequest-"+state.toLowerCase()+"-year3-"+edition+"-"+mode+".pdf";
      const pdf=generateHomeEducationTemplate(state,"3",false,mode,edition);
      writeFileSync(file,pdf);
      console.log(file,pdf.byteLength,"bytes");
    }
  }
}


for(const state of jurisdictions){
  for(const mode of ["print","fillable"]){
    const chosen=state==="NSW"?["Creative Arts","Technology"]:[];
    const file=dir+"/sidequest-"+state.toLowerCase()+"-year7-standard-"+mode+".pdf";
    const pdf=generateHomeEducationTemplate(state,"7",false,mode,"standard",chosen);
    writeFileSync(file,pdf);
    console.log(file,pdf.byteLength,"bytes");
  }
}
// Include a senior-secondary structural proof while treating it as requiring
// independent course-specific curriculum review, not as an approved template.
for(const mode of ["print","fillable"]){
 const file=dir+"/sidequest-nsw-year11-standard-"+mode+".pdf";
 const pdf=generateHomeEducationTemplate("NSW","11",false,mode,"standard");
 writeFileSync(file,pdf);
 console.log(file,pdf.byteLength,"bytes");
}


// Visual proof for the full original six-product range, not just the two blank
// exporters. Two contrasting jurisdictions exercise both the cover and the
// jurisdiction-specific body pages.
const products={
 blank:{edition:"standard",modes:["print","fillable"]},
 guided:{edition:"standard",modes:["print","fillable"]},
 printed:{edition:"standard",modes:["print"]},
 planner_blank:{edition:"complete",modes:["print","fillable"]},
 planner_personalised:{edition:"complete",modes:["print","fillable"]},
 planner_printed:{edition:"complete",modes:["print"]}
};
for(const state of ["NSW","VIC"]){
 for(const [kind,product] of Object.entries(products)){
  for(const mode of product.modes){
   const file=dir+"/sidequest-"+state.toLowerCase()+"-year3-"+kind+"-"+mode+"-product.pdf";
   const pdf=generateHomeEducationTemplate(state,"3",false,mode,product.edition,[],kind);
   writeFileSync(file,pdf);
   console.log(file,pdf.byteLength,"bytes");
  }
 }
}
