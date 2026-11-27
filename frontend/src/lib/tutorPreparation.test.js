import {preparationContext,prefillPreparation,draftPreparation} from "./tutorPreparation";
const data={diary:{learner_label:"John",ready:false,revision:1,details:{agenda:"Session 2",reflection:"Keep this observation",report_covered:"Keep this reviewed content"}},order:{package_sequence:2,start_at:"2026-12-24T00:15:00Z",end_at:"2026-12-24T00:45:00Z"},learner_context:{learner:{year_level:"4",goals:"",interests:"Lego",approach:"Visual examples",private_notes:"Do not copy into preparation"},current_enquiry:"Learner: John\nYear level: Year 4\nLearning area: Mathematics\nPreferred support: Live online support\nParent confirms enquiry and no payment commitment.\nLearning needs: Equivalent fractions\nWhat is going well: Counting\nParent goals: Compare fractions",reports:[{sections:["Previous content","Progress","Practise halves and quarters",""]}]}};
test("prefills exact booked context without replacing existing notes or approval",()=>{
 const filled=prefillPreparation(data);
 expect(filled.details.subject).toBe("Mathematics");
 expect(filled.details.year_level).toBe("Year 4");
 expect(filled.details.objective).toBe("Compare fractions");
 expect(filled.details.interests).toContain("Lego");
 expect(filled.details.interests).toContain("Counting");
 expect(filled.details.approach).toBe("Visual examples");
 expect(filled.details.reflection).toBe("Keep this observation");
 expect(filled.details.report_covered).toBe("Keep this reviewed content");
 expect(data.diary.details.subject).toBeUndefined();
 const existing={...data,diary:{...data.diary,details:{...data.diary.details,subject:"English"}}};
 expect(prefillPreparation(existing).details.subject).toBe("English");
 const approved={...data,diary:{...data.diary,ready:true}};
 expect(prefillPreparation(approved)).toBe(approved.diary);
});
test("draft uses previous reviewed priority, exact appointment duration and remains unapproved",()=>{
 const d=draftPreparation(data,prefillPreparation(data));
 expect(d.ready).toBe(false);
 expect(d.details.agenda).toContain("Practise halves and quarters");
 const minutes=[...d.details.agenda.matchAll(/(\d+) min ·/g)].reduce((total,m)=>total+Number(m[1]),0);
 expect(minutes).toBe(30);
 expect(d.details.reflection).toBe(data.diary.details.reflection);
 expect(d.details.report_covered).toBe(data.diary.details.report_covered);
 expect(JSON.stringify(d)).not.toContain("Do not copy into preparation");
 expect(d.details.materials).toContain("Select or create actual");
 expect(draftPreparation({...data,order:{...data.order,start_at:"invalid"}},data.diary)).toBeNull();
});
test("uses scheduled proposal lesson rather than inventing curriculum or selecting first lesson",()=>{
 const proposed={...data,proposal:{subject:"Mathematics",year_level:"Year 4",lessons:[{title:"First",objective:"First objective"},{title:"Second",objective:"Second objective",activities:"Compare fraction strips",check:"Show a separate example",home_practice:"Draw two quarters"}],tutor_guides:[{}, {guide:"Model halves",answers:"Tutor-only answer"}]}};
 const d=draftPreparation(proposed,prefillPreparation(proposed));
 expect(d.details.objective).toBe("Second objective");
 expect(d.details.agenda).toContain("Second · 30 min");
 expect(d.details.agenda).not.toContain("First");
 expect(d.details.follow_up).toBe("Draw two quarters");
 expect(d.ready).toBe(false);
});
test("missing context remains unknown, not invented",()=>{
 const minimal={diary:{details:{},ready:false},order:data.order};
 expect(preparationContext(minimal).subject).toBe("");
 expect(prefillPreparation(minimal).details).toEqual({});
 expect(draftPreparation(minimal,minimal.diary).details.objective).toMatch(/starting point/);
});
