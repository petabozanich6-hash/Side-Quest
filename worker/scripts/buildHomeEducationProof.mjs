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
