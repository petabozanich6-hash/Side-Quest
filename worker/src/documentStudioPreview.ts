// Fictional example information for Owner HQ previews. No real family records,
// account or payment information are used. These inputs feed the exact same
// generator and PDF rendering path used for purchased guided documents.
import { JURISDICTIONS, planAreas, type JurisdictionCode } from "./data/planJurisdictions";
import { validateGuestInput } from "./guestDocumentDelivery";

export const PREVIEW_YEARS = ["K","F","Prep",...Array.from({length:12},(_,i)=>String(i+1))];

const STAGES: Record<string,string>={K:"ES1",F:"ES1",Prep:"ES1","1":"S1","2":"S1","3":"S2","4":"S2","5":"S3","6":"S3","7":"S4","8":"S4","9":"S5","10":"S5","11":"S6","12":"S6"};

export function sampleGuidedDocumentData(code: string, year: string) {
  const j=JURISDICTIONS[code as JurisdictionCode];
  if(!j || code==="OTHER" || !PREVIEW_YEARS.includes(year)) throw Error("Invalid preview jurisdiction or year level");
  const areas=planAreas(j,{stage:STAGES[year]||"ES1",year_level:year}).areas;
  const sample= {
    learner_name:"Alex Example",
    year_level:year,
    period_start:"2027-01-27",
    period_end:"2027-12-10",
    goals:"Build confidence in reading, writing and numeracy; practise inquiry and independent learning with guidance.",
    strengths:"Animals, drawing, stories, practical investigations",
    teaching:"A mix of explicit instruction, hands-on projects, reading and discussion, with flexible pacing and regular review.",
    schedule:"Four to five mornings of planned learning each week, with outdoor exploration, reading and practical tasks on other days.",
    resources:"Library books, selected curriculum-aligned resources, notebooks, art materials and household measuring equipment.",
    records:"Dated samples of work, reading notes, experiment observations and regular parent reflections.",
    review:"Review goals and collected evidence halfway through each term and adapt the plan where needed.",
    areas:Object.fromEntries(areas.map((area)=>[area,{
      focus:`Fictional example: develop foundational skills and understanding in ${area} for Year ${year}.`,
      activities:`Fictional example: guided lessons, reading, discussion and an age-appropriate practical ${area} task.`,
      evidence:`Fictional example: retain dated ${area} work samples and reflect on progress.`,
    }])),
  };
  const validated=validateGuestInput(sample);
  if(!validated.ok) throw Error(validated.detail);
  return validated.data;
}
