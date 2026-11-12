import {mkdirSync,writeFileSync} from "node:fs";
import {generateHomeEducationTemplate} from "../src/homeEducationPdf.ts";
const dir=process.env.PROOF_DIR||"document-proof";
mkdirSync(dir,{recursive:true});
for(const edition of ["standard","complete"]){
 for(const mode of ["print","fillable"]){
  const file=dir+"/sidequest-nsw-year3-"+edition+"-"+mode+".pdf";
  const pdf=generateHomeEducationTemplate("NSW","3",false,mode,edition);
  writeFileSync(file,pdf);
  console.log(file, pdf.byteLength,"bytes");
 }
}
